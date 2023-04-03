/**
    @file Locomotion.ts
    @brief A class that offers utility functions to enable locomotion features
*/
import {
  AbstractMesh,
  Material,
  Mesh,
  WebXRControllerMovement,
  WebXRFeatureName,
  WebXRMotionControllerTeleportation,
} from "babylonjs";
import { ECS } from "../ECS";
import { Entity } from "../Entity";
import { TmpWorld } from "../../worlds/TmpWorld";

/**
 * This class provides locomotion functionality for XR experiences.
 */
export class Locomotion {
  m_ECS: ECS;
  m_Teleportation: WebXRMotionControllerTeleportation;

  /**
   * Creates a new instance of Locomotion.
   * @param ecs - The Entity-Component System (ECS) to use for XR features.
   */
  constructor(ecs: ECS) {
    this.m_ECS = ecs;
  }

  /**
   * Enables teleportation locomotion for XR experiences.
   * @param ground - The mesh or meshes representing the ground.
   * @param teleportTime - The time it takes to teleport in milliseconds.
   * @param useMainComps - Whether to use the main components only.
   * @param fillColor - The fill color for the teleportation target.
   * @param borderColor - The border color for the teleportation target.
   * @param arrowMaterial - The material for the teleportation arrow.
   * @param parabolicOptions - The options for the parabolic ray used in teleportation.
   */
  public EnableTeleportation(
    ground: Mesh[],
    teleportTime: number = 2000,
    useMainComps: boolean = true,
    fillColor: string = "#55FF99",
    borderColor: string = "blue",
    arrowMaterial: Material,
    parabolicOptions: {
      enabled: boolean;
      checkRadius: number;
    } = { enabled: true, checkRadius: 2 }
  ) {
    // // Disable other locomotion features.
    // this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
    //   WebXRFeatureName.MOVEMENT
    // );
    // this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
    //   WebXRFeatureName.WALKING_LOCOMOTION
    // );

    // Enable teleportation feature.


    this.m_Teleportation =
      this.m_ECS.m_XR.baseExperience.featuresManager.enableFeature(
        WebXRFeatureName.TELEPORTATION,
        "stable",
        {
          xrInput: this.m_ECS.m_XR.input,
          //floorMeshes: ground,
          //pickBlockerMeshes: roomMeshes,
          timeToTeleport: teleportTime,
          useMainComponentOnly: useMainComps,
          defaultTargetMeshOptions: {
            teleportationFillColor: fillColor,
            teleportationBorderColor: borderColor,
            torusArrowMaterial: arrowMaterial,
          },
        },
        true,
        true
      ) as WebXRMotionControllerTeleportation;

      console.log("registered");
      
    // Set parabolic ray options.
    this.m_Teleportation.parabolicRayEnabled = parabolicOptions.enabled;
    this.m_Teleportation.parabolicCheckRadius = parabolicOptions.checkRadius;

  }

  /**
   * Enables controller movement locomotion for XR experiences.
   * @param speed - The movement speed in meters per second.
   */
  public EnableControllerMovement(speed: number = 0.1) {
    // Disable other locomotion features.
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.TELEPORTATION
    );
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.WALKING_LOCOMOTION
    );

    // Enable controller movement feature.
    const controller_movement =
      this.m_ECS.m_XR.baseExperience.featuresManager.enableFeature(
        WebXRFeatureName.MOVEMENT,
        "latest",
        {
          xrInput: this.m_ECS.m_XR.input,
        }
      ) as WebXRControllerMovement;

    // Set movement speed.
    controller_movement.movementSpeed = speed;
  }

  /**
   * Enable walking in place using the provided entity as the locomotion target.
   * Disables teleportation and controller movement features.
   * @param entity The entity to use as the locomotion target
   */
  public EnableWalkingInPlace(entity: Entity) {
    // Disable teleportation and controller movement features
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.TELEPORTATION
    );
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.MOVEMENT
    );

    // Set the camera's parent to the provided entity
    this.m_ECS.m_XR.baseExperience.camera.parent = entity;

    // Enable the walking in place feature with the provided entity as the locomotion target
    this.m_ECS.m_XR.baseExperience.featuresManager.enableFeature(
      WebXRFeatureName.WALKING_LOCOMOTION,
      "latest",
      {
        locomotionTarget: entity,
      }
    );
  }

  /**
   * Disables all XR features (teleportation, controller movement, and walking in place).
   */
  public Disable() {
    // Disable all XR features
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.TELEPORTATION
    );
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.MOVEMENT
    );
    this.m_ECS.m_XR.baseExperience.featuresManager.disableFeature(
      WebXRFeatureName.WALKING_LOCOMOTION
    );
  }
}
