/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import {Entity, Model} from "../../core"

export class Beaker extends Entity{

    /**
     * @brief The model component for the Beaker molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the Beaker model.
     */
    m_Promise: Promise<void>

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
            // Do nothing for now
            this.m_Model.m_Mesh.scaling.setAll(0.25);
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }
}