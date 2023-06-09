/**
    @file H2.ts
    @brief Class representing an entity that loads and displays a 3D model of H2 molecule.
*/
import { ISceneLoaderAsyncResult } from "babylonjs";
import {Entity, Model} from "../../core"

export class H2 extends Entity{

    /**
     * @brief The model component for the H2 molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the H2 model.
     */
    m_Promise: Promise<ISceneLoaderAsyncResult>

    /**
     * @brief Initializes the entity by loading and displaying the H2 model.
     */
    Init(): void{
        // Add a Model component for the H2 molecule
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/H2.glb";
        
        // Load the H2 model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            // Do nothing for now
            //this.m_Model.m_Mesh.scaling(10)
            this.position.set(0, 10, 0);
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }
}