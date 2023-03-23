/**
    @file Mesh.ts
    @brief All mesh component classes definitions
*/
import {
  MeshBuilder,
  Scene,
  AbstractMesh,
  StandardMaterial,
  SceneLoader,
  CubeTexture,
  Color3,
  Texture,
} from "babylonjs";
import { Entity } from "../Entity";
import { Component } from "./Component";
import * as path from "path";
import { ECS } from "../ECS";

/**
 * @brief Base class for meshes that can be added to entities in a game world.
 *
 * This abstract class provides a common interface and base functionality for meshes
 * that can be attached to entities in a game world.
 */
abstract class IMesh extends Component {
  /** 
    @brief The abstract mesh representing the mesh in the scene.
    */
  public m_Mesh: AbstractMesh;

  /**
   * @brief Creates a new instance of the IMesh class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    if (this.m_Mesh == null) {
      throw new Error("Mesh field should be valid before it comes here!");
    }
    this.m_Mesh.parent = this.m_Entity;
    this.m_Mesh.material = new StandardMaterial(
      this.m_Name + " Material",
      this.m_Scene
    );
  }

  /**
   * @brief Enables the mesh.
   *
   * This method is called when the mesh is enabled and should be used to start any
   * updates or processes that the mesh is responsible for.
   */
  public Enable(): void {
    this.m_Mesh.setEnabled(true);
  }

  /**
   * @brief Disables the mesh.
   *
   * This method is called when the mesh is disabled and should be used to stop any
   * updates or processes that the mesh is responsible for.
   */
  public Disable(): void {
    this.m_Mesh.setEnabled(false);
  }
  /**
   * @brief Cleans up the mesh.
   *
   * This method is called when the mesh is removed from an entity and should be used
   * to clean up any resources or state that was initialized during the mesh's lifetime.
   */
  public Cleanup(): void {
    this.m_Scene.removeMesh(this.m_Mesh, true);
  }
  /**
   * @brief Sets if the mesh can be dragged
   *
   * This method is called to enable dragging of the mesh itself
   */
  public SetDraggable(drag: boolean): void {
    (this.m_Scene as ECS).SetMeshLocked(this.m_Mesh, !drag);
  }
}

/**
 * @brief Sphere Class for Sphere Meshes
 *
 * This sphere class instantiates a sphere mesh in the scene
 */
export class Sphere extends IMesh {
  /**
   * @brief Creates a new instance of the Sphere class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.m_Mesh = MeshBuilder.CreateSphere(
      this.m_Name,
      { diameter: 1 },
      this.m_Scene
    );
    super.Init();
  }
}

export class Cube extends IMesh {
  /**
   * @brief Creates a new instance of the Cube class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.m_Mesh = MeshBuilder.CreateBox(this.m_Name, { size: 1 }, this.m_Scene);
    super.Init();
  }
}

export class Skybox extends Cube {
  /** 
    @brief The asset path to load skybox textures from
    */
  public m_CubeTextureAssetPath: string = "";

  /**
   * @brief Creates a new instance of the Skybox class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    super.Init();
    this.m_Mesh.scaling.set(1000, 1000, 1000);
    const material = this.m_Mesh.material as StandardMaterial;
    material.backFaceCulling = false;
    material.diffuseColor = new Color3(0, 0, 0);
    material.specularColor = new Color3(0, 0, 0);
    this.LoadCubeTexture();
  }

  /**
   * @brief Loads the skybox texture
   *
   * This method is called to load the skybox texture into the material of the mesh
   */
  public LoadCubeTexture() {
    if (this.m_CubeTextureAssetPath.length === 0) return;
    const material = this.m_Mesh.material as StandardMaterial;
    material.reflectionTexture = new CubeTexture(
      "assets/textures/skybox",
      this.m_Scene
    );
    material.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  }
}

export class Plane extends IMesh {
  /**
   * @brief Creates a new instance of the Plane class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.m_Mesh = MeshBuilder.CreatePlane(
      this.m_Name,
      { size: 1 },
      this.m_Scene
    );
    super.Init();
  }
}

export class Ground extends IMesh {
  /**
   * @brief Creates a new instance of the Ground class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.m_Mesh = MeshBuilder.CreateGround(
      this.m_Name,
      { width: 1, height: 1 },
      this.m_Scene
    );
    super.Init();
  }
}

export class Model extends IMesh {
  /** 
    @brief Returns true if the model has been loaded
    */
  public m_IsLoaded: boolean = false;

  /** 
    @brief The asset path to load the model file from
    */
  public m_AssetPath: string = "";

  /**
   * @brief Creates a new instance of the Model class.
   *
   * @param name Name of the Mesh.
   * @param scene Scene that the Mesh belongs to.
   * @param entity Parent entity that this Mesh is attached to.
   * @param index Index of the Mesh within its parent entity's list of Mesh.
   */
  constructor(name: string, scene: Scene, entity: Entity, index: number) {
    super(name, scene, entity, index);
  }

  /**
   * @brief Initializes the mesh.
   *
   * This method is called when the mesh is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
  public Init(): void {
    this.LoadModel();
  }

  /**
   * @brief LoadModel
   *
   * This method is called to load the model file asynchronously
   */
  public async LoadModel(): Promise<void> {
    if (this.m_AssetPath.length == 0) {
      return;
    }
    const filePath = path.basename(this.m_AssetPath);
    const folderPath = path.dirname(this.m_AssetPath) + "/";
    const result = await SceneLoader.ImportMeshAsync(
      "",
      folderPath,
      filePath,
      this.m_Scene
    );
    this.m_Mesh = result.meshes[0];
    this.m_Mesh.id = this.m_Name;
    this.m_Mesh.name = this.m_Name;
    this.m_IsLoaded = true;
    this.m_Mesh.parent = this.m_Entity;
    this.m_Mesh.material = new StandardMaterial(
      this.m_Name + " Material",
      this.m_Scene
    );
  }
}
