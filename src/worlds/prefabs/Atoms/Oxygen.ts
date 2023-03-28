/**
    @file Oxygen.ts
    @brief Contains the Oxygen class implementation.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial, Texture } from "babylonjs";
import {Entity, Model, Sphere} from "../../../core"
import { TmpWorld } from "../../TmpWorld";

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

    actionManager: ActionManager;

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
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(2, 6.4, 3);
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
        @brief The update function of the O2 entity.
    */
    Update(): void {
        // Empty for now.
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