/**
    @file CH4.ts
    @brief Class representing an entity that loads and displays a 3D model of CH4 molecules.
*/
import { AbstractMesh, ActionManager, ExecuteCodeAction, StandardMaterial, Vector3, ISceneLoaderAsyncResult, PhysicsImpostor } from "babylonjs";
import { Cube, Entity, Model, TextPlane } from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { Beaker } from "../Interactables/Beaker";
import { ResearchTray } from "../Interactables/ResearchTray";

export class CH4 extends Entity{
  m_TextPlane: TextPlane;

  usingResearchTray: boolean;

  actionManager: ActionManager;

  placedInBeaker: boolean;

  m_Rigidbody: Cube;
  m_CH4ModelEntity: CH4Model;

  Init(): void {
    this.usingResearchTray = false;
    this.placedInBeaker = false;

    this.m_Rigidbody = this.AddComponent(Cube);
    this.m_Rigidbody.m_Mesh.setParent(null);
    this.m_Rigidbody.m_Mesh.scaling.set(0.6, 0.65, 0.7);
    this.m_Rigidbody.m_Mesh.visibility = 0;
    const impostor = new PhysicsImpostor(
        this.m_Rigidbody.m_Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 1, restitution: 0.2, friction: 0.2 },
        this.m_Scene
      );
    this.m_Rigidbody.m_Mesh.physicsImpostor = impostor;
    this.m_Rigidbody.m_Mesh.setParent(this);

    this.m_CH4ModelEntity = this.m_ECS.Instantiate(CH4Model, "CH4 Model");
    this.m_CH4ModelEntity.scaling.setAll(0.25);
    this.m_CH4ModelEntity.setParent(this.m_Rigidbody.m_Mesh);
    const beaker = (this.m_ECS as TmpWorld).m_Beaker;
    var tmp = beaker.m_Rigidbody.m_Mesh;
    this.position.set(tmp.absolutePosition._x, tmp.absolutePosition._y, 1.5 + tmp.absolutePosition._z);

    this.m_TextPlane = this.AddComponent(TextPlane);
    this.m_TextPlane.m_Mesh.rotation.set(0, -Math.PI / 2, 0);
    this.m_TextPlane.m_Mesh.position.set(0, 1, 0);
    this.m_TextPlane.m_GUITexture.background = "purple";
    this.m_TextPlane.m_TextBlock.color = "white";
    this.m_TextPlane.m_Mesh.scaling.setAll(1);
    this.m_TextPlane.m_TextBlock.fontSize = 10;
    this.m_TextPlane.m_TextBlock.textWrapping = true;
    this.m_TextPlane.m_Mesh.isPickable = false;
    this.m_TextPlane.m_TextBlock.text = this.m_Name + "(CH4)";
    (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;
    this.m_TextPlane.m_Mesh.setParent(this.m_Rigidbody.m_Mesh);

    this.actionManager = this.m_Rigidbody.m_Mesh.actionManager = new ActionManager(this.m_Scene);
    this.m_TextPlane.m_Mesh.isVisible = false;

    this.InitAction();
  }

  Update(): void {
    const beaker = (this.m_ECS as TmpWorld).m_Beaker;
    if (beaker === null) return;
    if (beaker.m_Rigidbody.m_Mesh.intersectsMesh(this.m_Rigidbody.m_Mesh)) {
      if (this.placedInBeaker == false) {
        this.m_TextPlane.m_Mesh.isVisible = false;
        let atomParent: AbstractMesh;
        atomParent = this.m_Rigidbody.m_Mesh.parent as AbstractMesh;

        atomParent.setParent(null);
        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.position.setAll(0);
        var tmpWorld = this.m_ECS as TmpWorld;
        tmpWorld.m_TransformWidget.m_DraggablePicked = false;
        tmpWorld.m_TransformWidget.m_CameraToPickedTargetLine.setEnabled(false);

        atomParent.setParent(beaker.m_BeakerModelEntity.m_Model.m_Mesh);
        atomParent.position = Vector3.Random(-1, 1);
        this.placedInBeaker = true;
        var tmpWorld = this.m_ECS as TmpWorld;
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name === "Beaker") {
            var beakerEntity = tmpWorld.m_Interactables[i] as Beaker;
            beakerEntity.ch4Counter++;
            tmpWorld.ch4Counter++;
            break;
          }
        }
      }
    }
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
        if (this.usingResearchTray) {
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
        if (this.parent?.parent?.name === "Beaker") return;
        var tmpWorld = this.m_ECS as TmpWorld
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name)
            tmpWorld.m_Interactables.splice(i, 1);
        }
        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.m_CH4ModelEntity.m_Model.m_Mesh.dispose();
        this.m_TextPlane.m_Mesh.dispose();
        this.Destroy();
        this.m_CH4ModelEntity.Destroy();
      })
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
        if (this.parent?.parent?.name === "Beaker") return;
        var tmpWorld = this.m_ECS as TmpWorld
        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name)
            tmpWorld.m_Interactables.splice(i, 1);
        }
        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.m_CH4ModelEntity.m_Model.m_Mesh.dispose();
        this.m_TextPlane.m_Mesh.dispose();
        this.Destroy();
        this.m_CH4ModelEntity.Destroy();
      }
    )
    );
  }
}

export class CH4Model extends Entity {

  /**
   * @brief The model component for the CH4 molecule.
   */
  m_Model: Model;


  /**
   * @brief A promise for loading the CH4 model.
   */
  m_Promise: Promise<ISceneLoaderAsyncResult>

  /**
   * @brief Initializes the entity by loading and displaying the CH4 model.
   */
  Init(): void {
    // Add a Model component for the CH4 molecule
    this.m_Model = this.AddComponent(Model);
    this.m_Model.m_AssetPath = "assets/models/CH4.glb";
    
    // Load the CH4 model and store the promise for future use
    this.m_Promise = this.m_Model.LoadModel();
    this.m_Promise.then((result) => {

      this.m_Model.m_Mesh.name = this.name + " Mesh";
      this.m_Model.m_Mesh.id = this.name + " Mesh";
      this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name + " Child";
      this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name + " Child";
      result.meshes.forEach((mesh)=>{
        mesh.isPickable = false;
      });
      return result;
    })
  }

  /**
   * @brief Empty method to satisfy the abstract class Entity.
   */
  Update(): void {

  }

  
}