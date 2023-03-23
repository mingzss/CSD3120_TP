/**
    @file table.ts
    @brief Represents a table entity in the scene.
    This class inherits from the Entity class and adds functionality to load and manipulate a table 3D model.
*/
import {Entity, Model} from "../../core"

export class Table extends Entity{

    /**
     * @brief Initializes the Table entity by loading its 3D model and setting its pickable attribute to false.
     * 
     * This method initializes the Table entity by adding a Model component to it and loading the table model from the asset path "assets/models/table.gltf".
     * Once the model is loaded, this method sets the pickable attribute of each child mesh to false, which disables picking on the table.
     */
    Init(): void {
        const model = this.AddComponent(Model);
        model.m_AssetPath = "assets/models/table.gltf";
        model.LoadModel().then(()=>{
            this.getChildMeshes().forEach((mesh)=>{
                mesh.isPickable = false;
            })
        });
    }

    /**
     * @brief Empty Update method required by the Entity class.
     * 
     * This method does nothing and is required to be implemented due to the Table class inheriting from the Entity class.
     */
    Update(): void {
        
    }
}