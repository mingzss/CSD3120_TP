/**
    @file Entity.ts
    @brief A Entity class that serves as the base class for objects to hold components
*/
import { Scene, TransformNode } from "babylonjs";
import { ECS } from "./ECS";
import { Component } from "./Components/Component";

/**

    @class Entity
    @brief Abstract class representing an entity in a scene.
    @details Entities are objects in a scene that can have components attached to them to define their behavior and properties.
    This class extends TransformNode from BabylonJS and provides methods for adding, getting, and removing components from the entity.
*/
export abstract class Entity extends TransformNode {
  /** The scene that the entity is in.*/
  m_Scene: Scene;
  /* The entity-component system that the entity belongs to. */
  m_ECS: ECS;
  /**
   * @brief The name of the entity.
   * @details This is a getter/setter property that gets/sets the name of the entity.
   */
  public get m_Name(): string {
    return this.name;
  }
  public set m_Name(name: string) {
    this.name = name;
  }

  /**
   * @brief Constructor for the entity.
   * @param name The name of the entity.
   * @param ecs The entity-component system that the entity belongs to.
   */
  constructor(name: string, ecs: ECS) {
    super(name, ecs);
    this.m_Scene = ecs;
    this.m_ECS = ecs;
    this.m_Name = name;
    console.log("Entity " + this.m_Name + " created.");
  }

  /**
   * @brief Adds a component of type T to the entity.
   * @param componentClass The class of the component to add.
   * @returns The added component.
   */
  AddComponent<T extends Component>(componentClass: {
    new (...args: any[]): T;
  }): T {
    //console.log("Adding " + componentClass.name + " Component to Entity: " + this.m_Name);
    return this.m_ECS.m_ComponentManager.AddComponent<T>(this, componentClass);
  }

  /**
   * @brief Gets a component of type T attached to the entity.
   * @param componentClass The class of the component to get.
   * @param index The index of the component to get (default is 0).
   * @returns The component, or null if not found.
   */
  GetComponent<T extends Component>(
    componentClass: { new (...args: any[]): T },
    index: number = 0
  ): T | null {
    return this.m_ECS.m_ComponentManager.GetComponent<T>(
      this,
      componentClass,
      index
    );
  }

  /**
   * @brief Removes a component of type T from the entity.
   * @param componentClass The class of the component to remove.
   * @param index The index of the component to remove (default is 0).
   */
  RemoveComponent<T extends Component>(
    componentClass: { new (...args: any[]): T },
    index: number = 0
  ) {
    return this.m_ECS.m_ComponentManager.RemoveComponent(
      this,
      componentClass,
      index
    );
  }

  /** @brief Initializes the entity. */
  Init(): void {}

  /** @brief Updates the entity. */
  Update(): void {}

  /** @brief Cleans up the entity. */
  CleanUp(): void {}

  /**
   * @brief Destroys the entity and its components.
   * @details Calls the CleanUp method and then removes the entity from the ECS.
   */
  Destroy() {
    this.CleanUp();
    this.m_ECS.Destroy(this);
  }

  /**
   * @brief Disposes of the entity and its children.
   * @details Calls the Destroy method on each child entity and then calls the dispose method of the parent.
   */
  dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
    for (const child of this.getChildren()) {
      (child as Entity).Destroy();
    }
    super.dispose(true, true);
  }
}
