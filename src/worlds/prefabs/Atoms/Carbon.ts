/**
    @file Carbon.ts
    @brief Class representing an entity that loads and displays a 3D model of Carbon atom.
*/
import {Entity, Model} from "../../../core"

export class Carbon extends Entity{

    /**
     * @brief The model component for the Carbon atom.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the Carbon model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the Carbon model.
     */
    Init(): void{
        // Add a Model component for the Carbon molecule
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/Carbon.glb";
        
        // Load the Carbon model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(2, 6.4, -3);
            this.scaling.setAll(0.5);
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
}