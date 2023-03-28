/**
    @file Chlorine.ts
    @brief Class representing an entity that loads and displays a 3D model of Chlorine atom.
*/
import { ActionManager, ExecuteCodeAction } from "babylonjs";
import {Entity, Model} from "../../../core"
import { TmpWorld } from "../../TmpWorld";

export class Chlorine extends Entity{

    /**
     * @brief The model component for the Chlorine atom.
     */
    m_Model: Model;

    actionManager: ActionManager;


    /**
     * @brief A promise for loading the Chlorine model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the Chlorine model.
     */
    Init(): void{
        // Add a Model component for the Chlorine molecule
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/Chlorine.glb";
        
        // Load the Chlorine model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(2, 6.4, -6);
            this.scaling.setAll(0.5);
            this.m_Model.m_Mesh.name = this.name + " Mesh";
            this.m_Model.m_Mesh.id = this.name + " Mesh";
            this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name + " Child";
            this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name + " Child";
            this.actionManager = this.m_Scene.getLastMeshById(this.name + " Mesh").actionManager = new ActionManager(this.m_Scene);
            this.InitAction();
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }

    public SetLabelVisibility(isVisible : boolean){

    }

    public SetMeshVisibility(isVisible : boolean){
        
    }

    private InitAction(){
        this.actionManager.isRecursive = true;
        const otherMesh = this._scene.getMeshById("Sink");
        this.actionManager.registerAction(new ExecuteCodeAction(
            {
              trigger: ActionManager.OnIntersectionEnterTrigger,
              parameter: {
                mesh: otherMesh,
              },
            },
            () => {
                var tmpWorld = this.m_ECS as TmpWorld
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                    if (tmpWorld.m_Interactables[i].m_Name == this.name)
                        tmpWorld.m_Interactables.splice(i, 1);
                }
                this.m_Model.m_Mesh.dispose();
                this.dispose();
            }
          )
        );
    }
}