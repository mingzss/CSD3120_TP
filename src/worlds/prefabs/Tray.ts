/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial } from "babylonjs";
import {Entity, Model, TextPlane} from "../../core"
import { TmpWorld } from "../TmpWorld";
import { Carbon } from "./Atoms/Carbon";
import { Chlorine } from "./Atoms/Chlorine";
import { Hydrogen } from "./Atoms/Hydrogen";
import { Oxygen } from "./Atoms/Oxygen";

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
            this.m_Model.m_Mesh.scaling.setAll(0.25);
            //this.actionManager = this.m_Model.m_Mesh.actionManager = new ActionManager(this.m_Scene);
            if (this.m_Name == "Hydrogen")
            {
                this.m_Model.m_Mesh.getChildMeshes()[0].name = "HTray";
                this.m_Model.m_Mesh.getChildMeshes()[0].id = "HTray";
                this.actionManager = this.m_Scene.getLastMeshById("HTray").actionManager = new ActionManager(this.m_Scene);
            }

            else if (this.m_Name == "Oxygen")
            {
                this.m_Model.m_Mesh.getChildMeshes()[0].name = "OTray";
                this.m_Model.m_Mesh.getChildMeshes()[0].id = "OTray";
                this.actionManager = this.m_Scene.getLastMeshById("OTray").actionManager = new ActionManager(this.m_Scene);
            }

            else if (this.m_Name == "Chlorine")
            {
                this.m_Model.m_Mesh.getChildMeshes()[0].name = "CLTray";
                this.m_Model.m_Mesh.getChildMeshes()[0].id = "CLTray";
                this.actionManager = this.m_Scene.getLastMeshById("CLTray").actionManager = new ActionManager(this.m_Scene);
            }

            else if (this.m_Name == "Carbon")
            {
                this.m_Model.m_Mesh.getChildMeshes()[0].name = "CTray";
                this.m_Model.m_Mesh.getChildMeshes()[0].id = "CTray";
                this.actionManager = this.m_Scene.getLastMeshById("CTray").actionManager = new ActionManager(this.m_Scene);
            }

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
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Hydrogen, "Hydrogen"));
                    else if (this.m_Name == "Oxygen")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Oxygen, "Oxygen"));
                    else if (this.m_Name == "Chlorine")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Chlorine, "Chlorine"));
                    else if (this.m_Name == "Carbon")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Carbon, "Carbon"));
                }
              )
        );
    }
}