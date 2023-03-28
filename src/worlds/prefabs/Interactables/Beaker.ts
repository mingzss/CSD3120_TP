/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import { AbstractMesh, ActionManager, ExecuteCodeAction, SixDofDragBehavior } from "babylonjs";
import {Entity, Model} from "../../../core"

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
    /**
     * @brief Initializes the entity by loading and displaying the Beaker model.
     */
    Init(): void{
        // Add a Model component for the Beaker
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/beaker.glb";
        
        // Load the Beaker model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.m_Model.m_Mesh.scaling.setAll(0.25);
            this.sixDofDragBehavior = new SixDofDragBehavior();
            this.m_Model.m_Entity.addBehavior(this.sixDofDragBehavior);
            this.actionManager = this.m_Scene.getLastMeshById("Beaker").actionManager = new ActionManager(this.m_Scene);
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
        this._scene.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnKeyDownTrigger,
                    parameter: 'm'
                },
                () => {
                    //this.m_Model.m_Mesh.name -> BeakerModel10
                    console.log(this.m_Model.m_Mesh.name);
                    var atomsInBeaker = this.m_Model.m_Mesh.getChildMeshes()[0].getChildTransformNodes(true);
                    atomsInBeaker.forEach((mesh)=>{
                        console.log("child nodes: " + mesh.name);
                        var atomchildren = mesh.getChildMeshes();
                        atomchildren.forEach((childchildd)=>{
                            childchildd.dispose();
  
                        });
                        mesh.dispose();
                    })
                }
              )
        );
    }
}