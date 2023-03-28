/**
    @file ResearchTray.ts
    @brief Class representing an entity that loads and displays a 3D model of ResearchTray.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial } from "babylonjs";
import {Entity, Model, TextPlane} from "../../../core"

export class ResearchTray extends Entity{

    /**
     * @brief The model component for the ResearchTray molecule.
     */
    m_Model: Model;

    inUse: boolean;

    m_TextPlane: TextPlane;

    default: string;

    /**
     * @brief A promise for loading the ResearchTray model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the ResearchTray model.
     */
    Init(): void{
        // Add a Model component for the ResearchTray
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/Tray.glb";
        this.inUse = false;
        
        // Load the ResearchTray model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(-16.5, 5.9, 7.5);
            this.m_Model.m_Mesh.scaling.setAll(0.25);

            this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name;
            this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name;
            this.getChildMeshes().forEach((mesh)=>{
                mesh.isPickable = false;
            })
        })

        this.m_TextPlane = this.AddComponent(TextPlane);
        this.m_TextPlane.m_Mesh.rotation.set(0, -Math.PI /2, 0);
        this.m_TextPlane.m_Mesh.position.set(-0.15, 1.5, -3);
        this.m_TextPlane.m_GUITexture.background = "black";
        this.m_TextPlane.m_TextBlock.color = "white";
        this.m_TextPlane.m_Mesh.scaling.set(3.5, 1.9, 1);
        this.m_TextPlane.m_TextBlock.fontSize = 10;
        this.m_TextPlane.m_TextBlock.textWrapping = true;
        this.default = "Place item on the tray next to this monitor to find out what you can do with the atom/molecules.";
        this.m_TextPlane.m_TextBlock.text = this.default;
        this.m_TextPlane.m_Mesh.isPickable = false;
        (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }
}