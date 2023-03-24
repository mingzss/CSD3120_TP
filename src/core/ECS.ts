/**
    @file ECS.ts
    @brief A Scene class that serves as a basis for a game's Entity Component System.
*/
import {
  WebXRDefaultExperience,
  AbstractMesh,
  ArcRotateCamera,
  Camera,
  Engine,
  Scene,
  UniversalCamera,
  Vector3,
  ActionManager
} from "babylonjs";
import { ComponentManager } from "./ComponentManager";
import { Entity } from "./Entity";
import { ControllerDrag, HandTracking } from "./Features/ControllerDrag";
import { Locomotion } from "./Features/Locomotion";

/**
    @brief An enumeration of different camera types.
*/
enum CameraType {
  UNIVERSAL,
  ARCROTATE,
}

/**
    @brief An enumeration of different drag features.
*/
enum DragFeature {
  CONTROLLER_DRAG,
  HAND_TRACKING,
}

/**
@brief A ECS class that serves as a basis for a game's Entity Component System.
*/
export class ECS extends Scene {
  /**
    @brief The camera used by the scene.
    */
  m_Camera: Camera;
  /**
    @brief The component manager used by the scene.
    */
  m_ComponentManager: ComponentManager = new ComponentManager(this);
  /**
    @brief The engine used by the scene.
    */
  m_Engine: Engine;
  /**
    @brief The canvas element used by the scene.
    */
  m_Canvas: HTMLCanvasElement;
  /**

    @brief The WebXR experience used by the scene.
    */
  m_XR: WebXRDefaultExperience;
  /**
    @brief A promise to set up the WebXR experience used by the scene.
    */
  m_XRPromise: Promise<void>;
  /**
    @brief The set of entities used by the scene.
    */
  m_Entities = new Set<Entity>();

  // Features
  /**
    @brief The controller drag feature used by the scene.
    */
  m_ControllerDragFeature: ControllerDrag = new ControllerDrag(this);
  /**
    @brief The hand tracking feature used by the scene.
    */
  m_HandTrackingFeature: HandTracking = new HandTracking(this);
  /**
    @brief The locomotion feature used by the scene.
    */
  m_LocomotionFeature: Locomotion = new Locomotion(this);

  /**
    @brief Creates a new instance of the ECS class.

    @param engine The engine used by the scene.
    @param canvas The canvas element used by the scene.
    @param options Options to configure the scene's camera and default features.
  */
  constructor(
    engine: Engine,
    canvas: HTMLCanvasElement,
    options: {
      camera: {
        cameraType?: CameraType;
        attachControl?: boolean;
      };
      defaults: {
        lights?: boolean;
        skybox?: boolean;
        environment?: boolean;
        vr?: boolean;
        keyboardShortcuts?: boolean;
      };
    } = null
  ) {
    super(engine);
    this.m_Engine = engine;
    this.m_Canvas = canvas;
    this.actionManager = new ActionManager(this);
    this.SetupCamera(
      options == null
        ? {
            cameraType: CameraType.UNIVERSAL,
            attachControl: false,
          }
        : options.camera
    );

    if (options != null) {
      if (options.defaults.lights) {
        this.createDefaultLight();
      }
      if (options.defaults.skybox) {
        this.createDefaultSkybox();
      }
      if (options.defaults.environment) {
        this.createDefaultEnvironment();
      }
      if (options.defaults.vr) {
        this.m_XRPromise = this.SetupVR();
      }
      if (options.defaults.keyboardShortcuts) {
        window.addEventListener("keydown", (e) => {
          if (e.ctrlKey && e.altKey && e.key === "i") {
            if (this.debugLayer.isVisible()) {
              this.debugLayer.hide();
            } else {
              this.debugLayer.show();
            }
          }
        });
      }
    }
  }

  /**
    Private method to set up the camera.
    @param {object} camera - An object containing the cameraType and attachControl properties.
    @param {CameraType} [camera.cameraType=CameraType.UNIVERSAL] - The type of camera to create.
    @param {boolean} [camera.attachControl=true] - Whether or not to attach camera controls to the canvas.
  */
  private SetupCamera(camera: {
    cameraType?: CameraType;
    attachControl?: boolean;
  }) {
    if (camera.cameraType == null) {
      camera.cameraType = CameraType.UNIVERSAL;
    }
    if (camera.attachControl == null) {
      camera.attachControl = true;
    }
    switch (camera.cameraType) {
      case CameraType.UNIVERSAL:
        this.m_Camera = new UniversalCamera(
          "Camera",
          new Vector3(0, 0, -5),
          this
        );
        break;
      case CameraType.ARCROTATE:
        this.m_Camera = new ArcRotateCamera(
          "Camera",
          0,
          0,
          5,
          Vector3.Zero(),
          this
        );
        break;
    }
    if (camera.attachControl === true)
      this.m_Camera.attachControl(this.m_Canvas, true);
  }

  /**
    Sets whether a mesh is locked or not for controller drag feature.
    @param {AbstractMesh} mesh - The mesh to register or deregister.
    @param {boolean} locked - Whether the mesh is locked or not.
  */
  public SetMeshLocked(mesh: AbstractMesh, locked: boolean) {
    if (this.m_ControllerDragFeature == null) return;

    if (locked) {
      this.m_ControllerDragFeature.RegisterLockedMesh(mesh);
    } else {
      this.m_ControllerDragFeature.DeregisterLockedMesh(mesh);
    }
  }

  /**
    Private method to set up VR.
    @returns {Promise} - A promise that resolves with an XR experience.
  */
  private async SetupVR() {
    this.m_XR = await this.createDefaultXRExperienceAsync({
      uiOptions: {
        sessionMode: "immersive-vr",
        //sessionMode: 'immserve-ar'
      },
      optionalFeatures: true,
    });
    (window as any).xr = this.m_XR;
  }

  /**
    Instantiates an entity of the specified class and adds it to the scene.
    @template T
    @param {class} entClass - The class of the entity to instantiate.
    @param {...any} args - Any arguments to pass to the entity's constructor.
    @returns {T} - The instantiated entity.
  */
  public Instantiate<T extends Entity>(
    entClass: { new (...args: any[]): T },
    ...args: any[]
  ): T {
    const entity = new entClass(...args, this);
    this.m_Entities.add(entity);
    entity.Init();
    return entity;
  }

  /**
    Destroys an entity and removes it from the scene.
    @template T
    @param {T} entity - The entity to destroy.
  */
  public Destroy<T extends Entity>(entity: T) {
    entity.dispose(true, true);
    this.removeTransformNode(entity);
    this.m_Entities.delete(entity);
    this.m_ComponentManager.RemoveEntity(entity);
  }

  /**
    Initializes the scene.
  */
  public Init() {}

  /**
    Updates the scene.
  */
  public Update() {}
}
