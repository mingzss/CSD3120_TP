/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial } from "babylonjs";
import {Entity, Model, TextPlane} from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { Carbon } from "../Atoms/Carbon";
import { Chlorine } from "../Atoms/Chlorine";
import { Hydrogen } from "../Atoms/Hydrogen";
import { Oxygen } from "../Atoms/Oxygen";

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

            this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name + " Tray";
            this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name + " Tray";
            this.actionManager = this.m_Scene.getLastMeshById(this.name + " Tray").actionManager = new ActionManager(this.m_Scene);

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
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Hydrogen, "Hydrogen Atom"));
                    else if (this.m_Name == "Oxygen")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Oxygen, "Oxygen Atom"));
                    else if (this.m_Name == "Chlorine")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Chlorine, "Chlorine Atom"));
                    else if (this.m_Name == "Carbon")
                        tmpWorld.m_Interactables.push(tmpWorld.Instantiate(Carbon, "Carbon Atom"));
                }
              )
        );
    }
}