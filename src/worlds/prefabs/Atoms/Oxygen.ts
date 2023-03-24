/**
    @file Oxygen.ts
    @brief Contains the Oxygen class implementation.
*/
import { StandardMaterial, Texture } from "babylonjs";
import {Entity, Model, Sphere} from "../../../core"

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
}