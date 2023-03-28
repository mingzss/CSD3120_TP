/**
    @file ControllerDrag.ts
    @brief A class that offers utility functions to enable controller features
*/
import {
  AbstractMesh,
  Mesh,
  TransformNode,
  Vector3,
  WebXRFeatureName,
} from "babylonjs";
import { Console } from "console";
import { ECS } from "../ECS";

/**
 * @brief Class for enabling dragging of meshes with XR controllers.
 */
export class ControllerDrag {
  // Initialize a Set to store meshes that are currently locked and cannot be dragged
  m_LockedMeshes = new Set<AbstractMesh>();

  // Store a reference to the ECS instance
  m_ECS: ECS;

  /**
   * @brief Constructor for ControllerDrag class.
   * @param ecs The ECS object to use.
   */
  constructor(ecs: ECS) {
    this.m_ECS = ecs;
  }

  /**
   * @brief Enables dragging of meshes with XR controllers.
   */
  Enable() {
    // Declare some variables for use later
    let selectedMesh: AbstractMesh;
    let rootMesh: AbstractMesh;
    let parentTransform: TransformNode;

    // Add a callback to run when a new motion controller is added to the scene
    this.m_ECS.m_XR.input.onControllerAddedObservable.add((controller) => {
      // Add a callback to run when the motion controller is initialized
      controller.onMotionControllerInitObservable.add((motioncontroller) => {
        // Get the trigger component of the motion controller
        const trigger = motioncontroller.getComponentOfType("trigger");

        // Add a callback to run when the trigger button state changes
        trigger.onButtonStateChangedObservable.add(() => {
          if (trigger.pressed) {
            // If the trigger is pressed
            // Check if there is a mesh under the pointer of the controller
            if (
              (selectedMesh =
                this.m_ECS.m_XR.pointerSelection.getMeshUnderPointer(
                  controller.uniqueId
                ))
            ) {
              rootMesh = selectedMesh;
              while (rootMesh.parent) {
                //get top root of the mesh
                if (
                  rootMesh.name === "oculus-touch-left" ||
                  rootMesh.name === "oculus-touch-right"
                ) {
                  return;
                }
                rootMesh = rootMesh.parent as Mesh;
              }
              // If the mesh is not locked, calculate the distance between the mesh and the controller
              if (!this.m_LockedMeshes.has(rootMesh)) {
                const distance = Vector3.Distance(
                  motioncontroller.rootMesh.getAbsolutePosition(),
                  selectedMesh.getAbsolutePosition()
                );
                // If the distance is less than 1, attach the mesh to the motion controller
                if (distance < 10) {
                  rootMesh.setParent(motioncontroller.rootMesh);
                  console.log("grabbed mesh is: " + rootMesh.name)
                }
              }
            }
          } else {
            // If the trigger is not pressed
            if (rootMesh && rootMesh.parent) {
              // If a mesh is attached to the motion controller
              rootMesh.setParent(parentTransform, true, true); // Detach the mesh
            }
          }
        });
      });
    });
  }

  /**
   * @brief Registers a mesh to prevent it from being dragged.
   * @param mesh The mesh to register.
   */
  RegisterLockedMesh(mesh: AbstractMesh) {
    this.m_LockedMeshes.add(mesh);
  }

  /**
   * @brief Deregisters a mesh to allow it to be dragged again.
   * @param mesh The mesh to deregister.
   */
  DeregisterLockedMesh(mesh: AbstractMesh) {
    this.m_LockedMeshes.delete(mesh);
  }
}

/**
 * @brief Class for enabling hand tracking.
 */
export class HandTracking {
  // Store a reference to the ECS instance
  m_ECS: ECS;

  /**
   * @brief Constructor for HandTracking class.
   * @param ecs The ECS object to use.
   */
  constructor(ecs: ECS) {
    this.m_ECS = ecs;
  }

  /**
   * @brief Enables hand tracking.
   */
  Enable() {
    try {
      // Enable the hand tracking feature using the latest version of the WebXR API
      this.m_ECS.m_XR.baseExperience.featuresManager.enableFeature(
        WebXRFeatureName.HAND_TRACKING,
        "latest",
        {
          xrinput: this.m_ECS.m_XR.input,
          jointMeshes: {
            disableDefaultHandMesh: false,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // TODO: Register/Deregister locked meshes to prevent dragging for those
}
