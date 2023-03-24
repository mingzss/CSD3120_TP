/**
    @file H2O.ts
    @brief Class representing an entity that loads and displays a 3D model of H2O molecules.
*/
import {Entity, Model} from "../../../core"

export class H2O extends Entity{

    /**
     * @brief The model component for the H2O molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the H2O model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the H2O model.
     */
    Init(): void{
        // Add a Model component for the H2O molecule
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/H2O.glb";
        
        // Load the H2O model and store the promise for future use
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