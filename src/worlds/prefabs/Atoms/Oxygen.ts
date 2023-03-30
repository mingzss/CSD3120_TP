/**
    @file Oxygen.ts
    @brief Contains the Oxygen class implementation.
*/
import { AbstractMesh, ActionManager, ExecuteCodeAction, SixDofDragBehavior, StandardMaterial, Vector3, } from "babylonjs";
import {Entity, Model, TextPlane} from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { Beaker } from "../Interactables/Beaker";
import { ResearchTray } from "../Interactables/ResearchTray";

/**
    @class O2
    @brief A class that represents an O2 entity.
    @extends Entity
*/
export class Oxygen extends Entity{

    /**
        @brief The model associated with the Oxygen entity.
    */
    m_Model: Model;

    m_TextPlane: TextPlane;

    usingResearchTray: boolean;

    actionManager: ActionManager;

    placedInBeaker: boolean;
    //sixDofDragBehavior: SixDofDragBehavior;
    /**
        @brief A promise representing the loading of the Oxygen atom.
    */
    m_Promise: Promise<void>

    /**
        @brief Initializes the Oxygen entity by setting up its model.
    */
    Init(): void{
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/Oxygen.glb";
        this.usingResearchTray = false;
        this.placedInBeaker = false;

        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            var tmp = this.m_Scene.getTransformNodeById("Oxygen");
            this.position.set(tmp.absolutePosition._x, 0.15 + tmp.absolutePosition._y, tmp.absolutePosition._z);
            this.scaling.setAll(0.5);
            this.m_Model.m_Mesh.name = this.name + " Mesh";
            this.m_Model.m_Mesh.id = this.name + " Mesh";
            this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name + " Child";
            this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name + " Child";
            
            this.m_TextPlane = this.AddComponent(TextPlane);
            this.m_TextPlane.m_Mesh.rotation.set(0, -Math.PI /2, 0);
            this.m_TextPlane.m_Mesh.position.set(0, 1, 0);
            this.m_TextPlane.m_GUITexture.background = "purple";
            this.m_TextPlane.m_TextBlock.color = "white";
            this.m_TextPlane.m_Mesh.scaling.setAll(1);
            this.m_TextPlane.m_TextBlock.fontSize = 10;
            this.m_TextPlane.m_TextBlock.textWrapping = true;
            this.m_TextPlane.m_Mesh.isPickable = false;
            this.m_TextPlane.m_TextBlock.text = this.m_Name + "(O)";
            (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;
            
            this.actionManager = this.m_Scene.getLastMeshById(this.name + " Mesh").actionManager = new ActionManager(this.m_Scene);
            this.m_TextPlane.m_Mesh.isVisible = false;
            //this.sixDofDragBehavior = new SixDofDragBehavior();
            //this.m_Model.m_Entity.addBehavior(this.sixDofDragBehavior);
            this.InitAction();
        })
    }

    /**
        @brief The update function of the O2 entity.
    */
    Update(): void {
        // Empty for now.
        this.m_Promise.then(()=>{
            const beakerMesh = this._scene.getMeshById("Beaker");
            const currMesh = this.m_Scene.getLastMeshById(this.name + " Mesh");
            if (beakerMesh === null || currMesh === null) return;
            if (beakerMesh.intersectsMesh(currMesh))
            {
              if (this.placedInBeaker == false) {
                console.log("intersecting w beaker " + this.m_Model.m_Mesh.parent.name);
                this.m_TextPlane.m_Mesh.isVisible = false; //cos beaker will block the pointer or smth'
                let atomParent: AbstractMesh;
                atomParent = this.m_Model.m_Mesh.parent as AbstractMesh;
                
                atomParent.setParent(null);
                //atomParent.position = beakerMesh.position;
                var tmpWorld = this.m_ECS as TmpWorld;
                tmpWorld.m_TransformWidget.m_DraggablePicked = false;
                tmpWorld.m_TransformWidget.m_CameraToPickedTargetLine.setEnabled(false);
                console.log("setting parent");
                atomParent.setParent(beakerMesh);
                atomParent.position = Vector3.Random(-1, 1);
                this.placedInBeaker = true;
                //this.m_Model.m_Entity.removeBehavior(this.sixDofDragBehavior);
                var tmpWorld = this.m_ECS as TmpWorld;
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                    if (tmpWorld.m_Interactables[i].m_Name === "Beaker")
                    {
                        console.log("found beaker!");
                        var beakerEntity = tmpWorld.m_Interactables[i] as Beaker;
                        beakerEntity.oxygenCounter++;
                        break;
                    }
                }
            }
            }
          });
    }

    public SetLabelVisibility(isVisible : boolean){

    }

    public SetMeshVisibility(isVisible : boolean){
        
    }

    private InitAction(){
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
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                    if (tmpWorld.m_Interactables[i].m_Name == "ResearchTray")
                    {
                        var researchTrayEntity = tmpWorld.m_Interactables[i] as ResearchTray
                        if (researchTrayEntity.inUse) break;
                        else {
                            researchTrayEntity.m_TextPlane.m_TextBlock.text = "Combine with two hydrogen to get H20 or two oxygen with one carbon to get CO2"
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
                if (this.usingResearchTray)
                {
                    var tmpWorld = this.m_ECS as TmpWorld
                    for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                        if (tmpWorld.m_Interactables[i].m_Name == "ResearchTray")
                        {
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
                if (this.parent.name === "Beaker") return;
                var tmpWorld = this.m_ECS as TmpWorld
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
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
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                    if (tmpWorld.m_Interactables[i].m_Name == this.name)
                        tmpWorld.m_Interactables.splice(i, 1);
                }
                this.m_Model.m_Mesh.dispose();
                this.m_TextPlane.m_Mesh.dispose();
                this.dispose();
            }
          )
        );

        // const beakerMesh = this._scene.getMeshById("Beaker");
        // this.actionManager.registerAction(new ExecuteCodeAction(
        //     {
        //       trigger: ActionManager.OnIntersectionEnterTrigger,
        //       parameter: {
        //         mesh: beakerMesh,
        //         usePreciseIntersection: false
        //       },
        //     },
        //     () => {
        //         //make model.mesh a child of beaker and snap pos

        //         if (this.placedInBeaker == false) {
        //             console.log("intersecting w beaker " + this.m_Model.m_Mesh.parent.name);
        //             this.m_TextPlane.m_Mesh.isVisible = false; //cos beaker will block the pointer or smth'
        //             let atomParent: AbstractMesh;
        //             atomParent = this.m_Model.m_Mesh.parent as AbstractMesh;
                    
        //             atomParent.setParent(null);
                    
        //             var tmpWorld = this.m_ECS as TmpWorld;
        //             tmpWorld.m_TransformWidget.m_DraggablePicked = false;
        //             tmpWorld.m_TransformWidget.m_CameraToPickedTargetLine.setEnabled(false);
        //             console.log("setting parent");
        //             atomParent.setParent(beakerMesh);
        //             atomParent.position = Vector3.Random(-1, 1);
        //             this.placedInBeaker = true;
        //             var tmpWorld = this.m_ECS as TmpWorld;
        //             for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
        //                 if (tmpWorld.m_Interactables[i].m_Name === "Beaker")
        //                 {
        //                     console.log("found beaker!");
        //                     var beakerEntity = tmpWorld.m_Interactables[i] as Beaker;
        //                     beakerEntity.oxygenCounter++;
        //                     break;
        //                 }
        //             }
        //         }

        //     }
        //   )
        // );
    }
}