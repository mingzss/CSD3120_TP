/**
    @file O2.ts
    @brief Contains the O2 class implementation.
*/
import { StandardMaterial, Texture } from "babylonjs";
import {Entity, Model, Sphere} from "../../core"

/**
    @class O2
    @brief A class that represents an O2 entity.
    @extends Entity
*/
export class O2 extends Entity{

    /**
        @brief The model associated with the O2 entity.
    */
    m_Model: Model;

    /**
        @brief A promise representing the loading of the O2 model.
    */
    m_Promise: Promise<void>

    /**
        @brief Initializes the O2 entity by setting up its model.
    */
    Init(): void{
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/O2.glb";
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(0, 9, 0);
        })

        //const sphere = this.AddComponent(Sphere);
        //sphere.m_Mesh.position.set(0, 5, 0);
        //sphere.m_Mesh.rotation.set(Math.PI, 0, 0);
        //(sphere.m_Mesh.material as StandardMaterial).diffuseTexture = new Texture("assets/textures/water.jpg", this.m_Scene);
    }

    /**
        @brief The update function of the O2 entity.
    */
    Update(): void {
        // Empty for now.
    }
}