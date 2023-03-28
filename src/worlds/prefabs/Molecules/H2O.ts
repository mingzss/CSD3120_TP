/**
    @file H2O.ts
    @brief Class representing an entity that loads and displays a 3D model of H2O molecules.
*/
import { ActionManager, ExecuteCodeAction, StandardMaterial } from "babylonjs";
import {Entity, Model, TextPlane} from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { ResearchTray } from "../Interactables/ResearchTray";

export class H2O extends Entity{

    /**
     * @brief The model component for the H2O molecule.
     */
    m_Model: Model;

    m_TextPlane: TextPlane;

    usingResearchTray: boolean;

    actionManager: ActionManager;

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
        this.usingResearchTray = false;
        
        // Load the H2O model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(()=>{
            this.position.set(2, 6.4, -3);
            this.scaling.setAll(0.5);

            this.m_Model.m_Mesh.name = this.name + " Mesh";
            this.m_Model.m_Mesh.id = this.name + " Mesh";
            this.m_Model.m_Mesh.getChildMeshes()[0].name = this.name + " Child";
            this.m_Model.m_Mesh.getChildMeshes()[0].id = this.name + " Child";

            this.m_TextPlane = this.AddComponent(TextPlane);
            this.m_TextPlane.m_Mesh.rotation.set(0, -Math.PI /2, 0);
            this.m_TextPlane.m_Mesh.position.set(0, 1, 0);
            this.m_TextPlane.m_GUITexture.background = "purple";
            this.m_TextPlane.m_TextBlock.color = "white";
            this.m_TextPlane.m_Mesh.scaling.setAll(1);
            this.m_TextPlane.m_TextBlock.fontSize = 10;
            this.m_TextPlane.m_TextBlock.textWrapping = true;
            this.m_TextPlane.m_Mesh.isPickable = false;
            this.m_TextPlane.m_TextBlock.text = this.m_Name + "(H2O)";
            (this.m_TextPlane.m_Mesh.material as StandardMaterial).disableLighting = true;
            
            this.actionManager = this.m_Scene.getLastMeshById(this.name + " Mesh").actionManager = new ActionManager(this.m_Scene);
            this.m_TextPlane.m_Mesh.isVisible = false;

            this.InitAction();
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {

    }

    private InitAction(){
        this.actionManager.isRecursive = true;
        const researchTray = this._scene.getMeshById("ResearchTray");
        this.actionManager.registerAction(new ExecuteCodeAction(
            {
              trigger: ActionManager.OnIntersectionEnterTrigger,
              parameter: {
                mesh: researchTray,
                usePreciseIntersection: true
              },
            },
            () => {
                var tmpWorld = this.m_ECS as TmpWorld
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                    if (tmpWorld.m_Interactables[i].m_Name == "ResearchTray")
                    {
                        var researchTrayEntity = tmpWorld.m_Interactables[i] as ResearchTray
                        if (researchTrayEntity.inUse) break;
                        else {
                            researchTrayEntity.m_TextPlane.m_TextBlock.text = "Combine with one more oxygen to get H2O2"
                            researchTrayEntity.inUse = true;
                            this.usingResearchTray = true;
                            break;
                        }
                    }
                }
            }
          )
        );

        this.actionManager.registerAction(new ExecuteCodeAction(
            {
              trigger: ActionManager.OnIntersectionExitTrigger,
              parameter: {
                mesh: researchTray,
                usePreciseIntersection: true
              },
            },
            () => {
                if (this.usingResearchTray)
                {
                    var tmpWorld = this.m_ECS as TmpWorld
                    for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                        if (tmpWorld.m_Interactables[i].m_Name == "ResearchTray")
                        {
                            var researchTrayEntity = tmpWorld.m_Interactables[i] as ResearchTray
                            researchTrayEntity.m_TextPlane.m_TextBlock.text = researchTrayEntity.default
                            researchTrayEntity.inUse = false;
                            this.usingResearchTray = false;
                            break;
                        }
                    }
                }
            }
          )
        );

        const otherMesh = this._scene.getMeshById("Sink");
        this.actionManager.registerAction(new ExecuteCodeAction(
            {
              trigger: ActionManager.OnIntersectionEnterTrigger,
              parameter: {
                mesh: otherMesh,
              },
            },
            () => {
                var tmpWorld = this.m_ECS as TmpWorld
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++){
                    if (tmpWorld.m_Interactables[i].m_Name == this.name)
                        tmpWorld.m_Interactables.splice(i, 1);
                }
                this.m_Model.m_Mesh.dispose();
                this.m_TextPlane.m_Mesh.dispose();
                this.dispose();
            }
          )
        );
    }
}