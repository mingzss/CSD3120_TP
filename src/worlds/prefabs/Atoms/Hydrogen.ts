/**
    @file Hydrogen.ts
    @brief Class representing an entity that loads and displays a 3D model of Hydrogen atom.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial } from "babylonjs";
import {Entity, Model, TextPlane} from "../../../core"

export class Hydrogen extends Entity{

    /**
     * @brief The model component for the Hydrogen atom.
     */
    m_Model: Model;

    m_TextPlane: TextPlane;

    actionManager: ActionManager;

    /**
     * @brief A promise for loading the Hydrogen model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the Hydrogen model.
     */
    Init(): void{
        // Add a Model component for the Hydrogen molecule

        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/Hydrogen.glb";

        // Load the Hydrogen model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(2, 6.4, 0);
            this.scaling.setAll(0.5);
            // this.m_TextPlane = this.AddComponent(TextPlane);
            // this.m_TextPlane.m_Mesh.rotation.set(0, -Math.PI /2, 0);
            // this.m_TextPlane.m_Mesh.position.set(0, 1, 0);
            // this.m_TextPlane.m_GUITexture.background = "purple";
            // this.m_TextPlane.m_TextBlock.color = "white";
            // this.m_TextPlane.m_Mesh.scaling.setAll(1);
            // this.m_TextPlane.m_TextBlock.fontSize = 10;
            // this.m_TextPlane.m_TextBlock.textWrapping = true;
            // this.m_TextPlane.m_Mesh.isPickable = false;
            // this.m_TextPlane.m_TextBlock.text = this.m_Name;
            // (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;
            // this.actionManager = this.m_Model.m_Mesh.actionManager = new ActionManager(this.m_Scene);
            // this.m_TextPlane.m_Mesh.isVisible = false;
            // this.InitAction();
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

    private InitAction(){
        this.actionManager.isRecursive = true;
        this.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPickDownTrigger,
                },
                () => {
                    this.m_TextPlane.m_Mesh.isVisible = true;
                }
              )
        );

        this.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPointerOutTrigger,
                },
                () => {
                    this.m_TextPlane.m_Mesh.isVisible = false;
                }
              )
        );
    }
}