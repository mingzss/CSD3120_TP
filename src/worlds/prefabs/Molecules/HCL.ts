/**
    @file HCL.ts
    @brief Class representing an entity that loads and displays a 3D model of HCL molecules.
*/
import { AbstractMesh, ActionManager, ExecuteCodeAction, StandardMaterial, Vector3 } from "babylonjs";
import { Entity, Model, TextPlane } from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { Beaker } from "../Interactables/Beaker";
import { ResearchTray } from "../Interactables/ResearchTray";

export class HCL extends Entity {

  /**
   * @brief The model component for the HCL molecule.
   */
  m_Model: Model;

  m_TextPlane: TextPlane;

  actionManager: ActionManager;

  usingResearchTray: boolean;

  placedInBeaker: boolean;

  /**
   * @brief A promise for loading the HCL model.
   */
  m_Promise: Promise<void>

  /**
   * @brief Initializes the entity by loading and displaying the HCL model.
   */
  Init(): void {
    // Add a Model component for the HCL molecule
    this.m_Model = this.AddComponent(Model);
    this.m_Model.m_AssetPath = "assets/models/HCL.glb";
    this.usingResearchTray = false;
    this.placedInBeaker = false;

    // Load the HCL model and store the promise for future use
    this.m_Promise = this.m_Model.LoadModel();
    this.m_Promise.then(() => {
      this.scaling.setAll(0.5);
      var tmp = this.m_Scene.getTransformNodeById("Beaker");
      this.position.set(tmp.absolutePosition._x, tmp.absolutePosition._y, 1.5 + tmp.absolutePosition._z);

      this.m_Model.m_Mesh.name = this.name + " Mesh";
      this.m_Model.m_Mesh.id = this.name + " Mesh";
      this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name + " Child";
      this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name + " Child";

      this.m_TextPlane = this.AddComponent(TextPlane);
      this.m_TextPlane.m_Mesh.rotation.set(0, -Math.PI / 2, 0);
      this.m_TextPlane.m_Mesh.position.set(0, 1, 0);
      this.m_TextPlane.m_GUITexture.background = "purple";
      this.m_TextPlane.m_TextBlock.color = "white";
      this.m_TextPlane.m_Mesh.scaling.setAll(1);
      this.m_TextPlane.m_TextBlock.fontSize = 10;
      this.m_TextPlane.m_TextBlock.textWrapping = true;
      this.m_TextPlane.m_Mesh.isPickable = false;
      this.m_TextPlane.m_TextBlock.text = this.m_Name + "(HCL)";
      (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;

      this.actionManager = this.m_Scene.getLastMeshById(this.name + " Mesh").actionManager = new ActionManager(this.m_Scene);
      this.m_TextPlane.m_Mesh.isVisible = false;

      this.InitAction();
    })
  }

  /**
   * @brief Empty method to satisfy the abstract class Entity.
   */
  Update(): void {
    this.m_Promise.then(() => {
      const beakerMesh = this._scene.getMeshById("Beaker");
      const currMesh = this.m_Scene.getLastMeshById(this.name + " Mesh");
      if (beakerMesh === null || currMesh === null) return;
      if (beakerMesh.intersectsMesh(currMesh)) {
        if (this.placedInBeaker == false) {
          this.m_TextPlane.m_Mesh.isVisible = false;
          let atomParent: AbstractMesh;
          atomParent = this.m_Model.m_Mesh.parent as AbstractMesh;

          atomParent.setParent(null);
          var tmpWorld = this.m_ECS as TmpWorld;
          tmpWorld.m_TransformWidget.m_DraggablePicked = false;
          tmpWorld.m_TransformWidget.m_CameraToPickedTargetLine.setEnabled(false);

          atomParent.setParent(beakerMesh);
          atomParent.position = Vector3.Random(-1, 1);
          this.placedInBeaker = true;
          var tmpWorld = this.m_ECS as TmpWorld;
          for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
            if (tmpWorld.m_Interactables[i].m_Name === "Beaker") {
              var beakerEntity = tmpWorld.m_Interactables[i] as Beaker;
              beakerEntity.hclCounter++;
              tmpWorld.hclCounter++;
              break;
            }
          }
        }
      }
    });
  }

  private InitAction() {
    this.actionManager.isRecursive = true;

    const researchTray = this._scene.getMeshById("ResearchTray");
    this.actionManager.registerAction(new ExecuteCodeAction(
      {
        trigger: ActionManager.OnIntersectionEnterTrigger,
        parameter: {
          mesh: researchTray,
          usePreciseIntersection: true
        },
      },
      () => {
        var tmpWorld = this.m_ECS as TmpWorld
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == "ResearchTray") {
            var researchTrayEntity = tmpWorld.m_Interactables[i] as ResearchTray
            if (researchTrayEntity.inUse) break;
            else {
              researchTrayEntity.m_TextPlane.m_TextBlock.text = "Can't combine with any atoms to further develop this molecule"
              researchTrayEntity.inUse = true;
              this.usingResearchTray = true;
              break;
            }
          }
        }
      }
    )
    );

    this.actionManager.registerAction(new ExecuteCodeAction(
      {
        trigger: ActionManager.OnIntersectionExitTrigger,
        parameter: {
          mesh: researchTray,
          usePreciseIntersection: true
        },
      },
      () => {
        var tmpWorld = this.m_ECS as TmpWorld
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == "ResearchTray") {
            var researchTrayEntity = tmpWorld.m_Interactables[i] as ResearchTray
            researchTrayEntity.m_TextPlane.m_TextBlock.text = researchTrayEntity.default
            researchTrayEntity.inUse = false;
            this.usingResearchTray = false;
            break;
          }
        }
      }
    )
    );

    this.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickDownTrigger,
        },
        () => {
          this.m_TextPlane.m_Mesh.isVisible = true;
        }
      )
    );

    this.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnPickUpTrigger,
        },
        () => {
          this.m_TextPlane.m_Mesh.isVisible = false;
        }
      )
    );

    const otherMesh = this._scene.getMeshById("Sink");
    this.actionManager.registerAction(new ExecuteCodeAction(
      {
        trigger: ActionManager.OnIntersectionEnterTrigger,
        parameter: {
          mesh: otherMesh,
        },
      },
      () => {
        if (this.parent.name === "Beaker") return;
        var tmpWorld = this.m_ECS as TmpWorld
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name)
            tmpWorld.m_Interactables.splice(i, 1);
        }
        this.m_Model.m_Mesh.dispose();
        this.m_TextPlane.m_Mesh.dispose();
        this.dispose();
      }
    )
    );

    const otherMesh2 = this._scene.getMeshById("Sink2");
    this.actionManager.registerAction(new ExecuteCodeAction(
      {
        trigger: ActionManager.OnIntersectionEnterTrigger,
        parameter: {
          mesh: otherMesh2,
        },
      },
      () => {
        if (this.parent.name === "Beaker") return;
        var tmpWorld = this.m_ECS as TmpWorld
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name)
            tmpWorld.m_Interactables.splice(i, 1);
        }
        this.m_Model.m_Mesh.dispose();
        this.m_TextPlane.m_Mesh.dispose();
        this.dispose();
      }
    )
    );
  }
}