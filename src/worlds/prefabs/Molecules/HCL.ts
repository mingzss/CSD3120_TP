/**
    @file HCL.ts
    @brief Class representing an entity that loads and displays a 3D model of HCL molecules.
*/
import {Entity, Model} from "../../../core"

export class HCL extends Entity{

    /**
     * @brief The model component for the HCL molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the HCL model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the HCL model.
     */
    Init(): void{
        // Add a Model component for the HCL molecule
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/HCL.glb";
        
        // Load the HCL model and store the promise for future use
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