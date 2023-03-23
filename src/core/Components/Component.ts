/**
    @file Component.ts
    @brief A base component class for components to inherit from
*/
import { Scene } from "babylonjs";
import { Entity } from "../Entity";

/**
 * @brief Base class for components that can be added to entities in a game world.
 *
 * This abstract class provides a common interface and base functionality for components
 * that can be attached to entities in a game world. Each component has a unique name,
 * an index that specifies its order within its parent entity's list of components, and a
 * reference to the parent entity and scene.
 */
export abstract class Component {
    
  /** Name of the component. */
  public m_Name: string;

  /** Index of the component within its parent entity's list of components. */
  public m_ComponentIndex: number;

  /** Parent entity that this component is attached to. */
  public m_Entity: Entity;

  /** Scene that the component belongs to. */
  m_Scene: Scene;

  /**
   * @brief Creates a new instance of the Component class.
   *
   * @param name Name of the component.
   * @param scene Scene that the component belongs to.
   * @param entity Parent entity that this component is attached to.
   * @param index Index of the component within its parent entity's list of components.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    this.m_Scene = scene;
    this.m_Name = name;
    this.m_Entity = entity;
    this.m_ComponentIndex = index;
  }

  /**
   * @brief Initializes the component.
   *
   * This method is called when the component is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public abstract Init(): void;

  /**
   * @brief Enables the component.
   *
   * This method is called when the component is enabled and should be used to start any
   * updates or processes that the component is responsible for.
   */
  public abstract Enable(): void;

  /**
   * @brief Disables the component.
   *
   * This method is called when the component is disabled and should be used to stop any
   * updates or processes that the component is responsible for.
   */
  public abstract Disable(): void;

  /**
   * @brief Cleans up the component.
   *
   * This method is called when the component is removed from an entity and should be used
   * to clean up any resources or state that was initialized during the component's lifetime.
   */
  public abstract Cleanup(): void;
}
