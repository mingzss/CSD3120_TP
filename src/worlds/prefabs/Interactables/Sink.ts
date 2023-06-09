/**
    @file Sink.ts
    @brief Class representing an entity that loads and displays a 3D model of Sink.
*/
import { ISceneLoaderAsyncResult } from "babylonjs";
import {Entity, Model} from "../../../core"

export class Sink extends Entity{

    /**
     * @brief The model component for the Sink molecule.
     */
    m_Model: Model;


    /**
     * @brief A promise for loading the Sink model.
     */
    m_Promise: Promise<ISceneLoaderAsyncResult>

    /**
     * @brief Initializes the entity by loading and displaying the Sink model.
     */
    Init(): void{
        // Add a Model component for the Sink
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/water_animation.glb";
        
        // Load the Sink model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(-0.5, 5.85, 9.26);
            this.scaling.set(0.03, 0.05, 0.02);
            this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name;
            this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name;
            this.getChildMeshes().forEach((mesh)=>{
                mesh.isPickable = false;
            })
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }
}