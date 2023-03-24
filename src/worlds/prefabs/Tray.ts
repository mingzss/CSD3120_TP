/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial } from "babylonjs";
import {Entity, Model, TextPlane} from "../../core"
import { TmpWorld } from "../TmpWorld";
import { H2 } from "./H2";
import { O2 } from "./O2";

export class Tray extends Entity{

    /**
     * @brief The model component for the Tray molecule.
     */
    m_Model: Model;

    m_TextPlane: TextPlane;

    actionManager: ActionManager;

    /**
     * @brief A promise for loading the Tray model.
     */
    m_Promise: Promise<void>

    /**
     * @brief Initializes the entity by loading and displaying the Tray model.
     */
    Init(): void{
        // Add a Model component for the Tray
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/tray.glb";
        
        // Load the Beaker model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            // Do nothing for now
            this.m_Model.m_Mesh.scaling.setAll(0.25);
            // this.getChildMeshes().forEach((mesh)=>{
            //     mesh.isPickable = false;
            // })
            this.actionManager = this.m_Model.m_Mesh.actionManager = new ActionManager(this.m_Scene);
            this.InitAction();
        })

        this.m_TextPlane = this.AddComponent(TextPlane);
        this.m_TextPlane.m_Mesh.rotation.set(Math.PI/2, -Math.PI /2, 0);
        this.m_TextPlane.m_Mesh.position.set(0, 0, 0);
        this.m_TextPlane.m_GUITexture.background = "purple";
        this.m_TextPlane.m_TextBlock.color = "white";
        this.m_TextPlane.m_Mesh.scaling.setAll(1);
        this.m_TextPlane.m_TextBlock.fontSize = 10;
        this.m_TextPlane.m_TextBlock.textWrapping = true;
        this.m_TextPlane.m_Mesh.isPickable = false;
        (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }

    private InitAction(){
        this.actionManager.isRecursive = true;
        this.actionManager.registerAction(
            new ExecuteCodeAction(
                {
                    trigger: ActionManager.OnPickDownTrigger,

                },
                () => {
                    var tmpWorld = this.m_ECS as TmpWorld
                    if (this.m_Name == "Hydrogen")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(H2, "H2"));
                    else if (this.m_Name == "Oxygen")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(O2, "O2"));
                }
              )
        );
    }
}