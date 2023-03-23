/**
    @file Light.ts
    @brief All light components implemention
*/
import { HemisphericLight, Light, PointLight, Scene, Vector3 } from "babylonjs";
import { Entity } from "../Entity";
import { Component } from "./Component";

/**

    @class PointLightSource

    @brief A component that represents a point light source in the scene.

    @details This component is responsible for creating, enabling, disabling and cleaning up a point light source in the scene.

    @extends Component

    @param name The name of the component.
    @param scene The scene object where the component will be used.
    @param entity The entity object to which the component is attached.
    @param index The index of the component in the entity's component array.
*/
export class PointLightSource extends Component {
  /** 
    @brief The light object representing the point light source in the scene.
    */
  public m_Light: Light;

  /**
   * @brief Creates a new instance of the PointLightSource class.
   *
   * @param name Name of the lightsource.
   * @param scene Scene that the lightsource belongs to.
   * @param entity Parent entity that this lightsource is attached to.
   * @param index Index of the lightsource within its parent entity's list of lightsource.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the lightsource.
   *
   * This method is called when the lightsource is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.m_Light = new PointLight(this.m_Name, new Vector3(), this.m_Scene);
    this.m_Light.parent = this.m_Entity;
  }

  /**
   * @brief Enables the lightsource.
   *
   * This method is called when the lightsource is enabled and should be used to start any
   * updates or processes that the lightsource is responsible for.
   */
  public Enable(): void {
    this.m_Light.setEnabled(false);
  }

  /**
   * @brief Disables the lightsource.
   *
   * This method is called when the lightsource is disabled and should be used to stop any
   * updates or processes that the lightsource is responsible for.
   */
  public Disable(): void {
    this.m_Light.setEnabled(false);
  }

  /**
   * @brief Cleans up the lightsource.
   *
   * This method is called when the lightsource is removed from an entity and should be used
   * to clean up any resources or state that was initialized during the lightsource's lifetime.
   */
  public Cleanup(): void {
    this.m_Scene.removeLight(this.m_Light);
  }
}

/**

    @class AmbientLightSource

    @brief A component that represents an ambient light source in the scene.

    @details This component is responsible for creating, enabling, disabling and cleaning up an ambient light source in the scene.

    @extends Component

    @param name The name of the component.
    @param scene The scene object where the component will be used.
    @param entity The entity object to which the component is attached.
    @param index The index of the component in the entity's component array.
*/
export class AmbientLightSource extends Component {
  /** 
    @brief The light object representing the ambient light source in the scene.
    */
  public m_Light: Light;

  /**
   * @brief Creates a new instance of the AmbientLightSource class.
   *
   * @param name Name of the lightsource.
   * @param scene Scene that the lightsource belongs to.
   * @param entity Parent entity that this lightsource is attached to.
   * @param index Index of the lightsource within its parent entity's list of lightsource.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the lightsource.
   *
   * This method is called when the lightsource is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.m_Light = new HemisphericLight(
      this.m_Name,
      new Vector3(0, 1, 0),
      this.m_Scene
    );
    this.m_Light.parent = this.m_Entity;
  }

  /**
   * @brief Enables the lightsource.
   *
   * This method is called when the lightsource is enabled and should be used to start any
   * updates or processes that the lightsource is responsible for.
   */
  public Enable(): void {
    this.m_Light.setEnabled(false);
  }

  /**
   * @brief Disables the lightsource.
   *
   * This method is called when the lightsource is disabled and should be used to stop any
   * updates or processes that the lightsource is responsible for.
   */
  public Disable(): void {
    this.m_Light.setEnabled(false);
  }

  /**
   * @brief Cleans up the lightsource.
   *
   * This method is called when the lightsource is removed from an entity and should be used
   * to clean up any resources or state that was initialized during the lightsource's lifetime.
   */
  public Cleanup(): void {
    this.m_Scene.removeLight(this.m_Light);
  }
}
