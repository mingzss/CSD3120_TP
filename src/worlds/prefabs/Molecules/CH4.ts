/**
    @file CH4.ts
    @brief Class representing an entity that loads and displays a 3D model of CH4 molecules.
*/
import {Entity, Model} from "../../../core"

export class CH4 extends Entity{

    /**
     * @brief The model component for the CH4 molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the CH4 model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the CH4 model.
     */
    Init(): void{
        // Add a Model component for the CH4 molecule
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/CH4.glb";
        
        // Load the CH4 model and store the promise for future use
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