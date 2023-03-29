/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import { AbstractMesh, ActionManager, ExecuteCodeAction, SixDofDragBehavior } from "babylonjs";
import {Entity, Model} from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { H2O } from "../Molecules/H2O";

export class Beaker extends Entity{

    /**
     * @brief The model component for the Beaker molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the Beaker model.
     */
    m_Promise: Promise<void>
    actionManager: ActionManager;
    sixDofDragBehavior: SixDofDragBehavior;
    carbonCounter: number;
    chlorineCounter: number;
    hydrogenCounter: number;
    oxygenCounter: number;

    /**
     * @brief Initializes the entity by loading and displaying the Beaker model.
     */
    Init(): void{
        // Add a Model component for the Beaker
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/beaker.glb";
        this.carbonCounter = 0;
        this.chlorineCounter = 0;
        this.hydrogenCounter = 0;
        this.oxygenCounter = 0;
        // Load the Beaker model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.m_Model.m_Mesh.scaling.setAll(0.25);
            //this.sixDofDragBehavior = new SixDofDragBehavior();
            //this.m_Model.m_Entity.addBehavior(this.sixDofDragBehavior);
            //this.actionManager = this.m_Scene.getLastMeshById("Beaker").actionManager = new ActionManager(this.m_Scene);
            console.log("in init: " + this.m_Model.m_Mesh.getChildMeshes()[0].name);
            this.actionManager = this.m_Model.m_Mesh.getChildMeshes()[0].actionManager = new ActionManager(this.m_Scene);
            this.InitAction();
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }

    private InitAction(){
        this.actionManager.isRecursive = true;
        let beakerAction: ExecuteCodeAction;
        this._scene.actionManager.registerAction(
            beakerAction = new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnKeyDownTrigger,
                    parameter: 'm'
                },
                () => {
                    //this.m_Model.m_Mesh.name -> BeakerModel10
                    console.log(this.m_Model.m_Mesh.name);
                    console.log(this.m_Model.m_Mesh.getChildMeshes(true)[0].name);
                    var atomsInBeaker = this.m_Model.m_Mesh.getChildMeshes()[0].getChildTransformNodes(true);
                    atomsInBeaker.forEach((mesh)=>{
                        console.log("child nodes: " + mesh.name);
                        var atomchildren = mesh.getChildMeshes();
                        atomchildren.forEach((childchildd)=>{
                            childchildd.dispose();
  
                        });
                        mesh.dispose();
                    })
                    console.log(this.hydrogenCounter + " h and o: " + this.oxygenCounter);
                    var tmpWorld = this.m_ECS as TmpWorld;
                    if (this.hydrogenCounter === 2 && this.oxygenCounter === 1) { //H2O
                        var hName = "H2O Molecule " + tmpWorld.h2oCounter.toString();
                        var h2oEntity = tmpWorld.Instantiate(H2O, hName);
                        tmpWorld.h2oCounter++;
                        h2oEntity.m_Promise.then(() => {
                            console.log("H2O Promise: " + this.name);
                            for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                                if (tmpWorld.m_Interactables[i].m_Name == this.name)
                                {
                                    tmpWorld.m_Interactables.splice(i, 1);
                                    break;
                                }
                            }
                            tmpWorld.m_Interactables.push(h2oEntity);
                            var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
                            newBeakerEntity.position.set(2, 7, 5.6);
                            tmpWorld.m_Interactables.push(newBeakerEntity);
                            this.m_Scene.actionManager.unregisterAction(beakerAction);
    
                            this.m_Model.m_Mesh.dispose();
                            this.dispose();
                        });
                        


                    }

                }
              )
        );
    }
}