/**
    @file VRWorld.ts
    @brief Contains the definition of the VRWorld class, a subclass of ECS.
    It represents a customized world with objects and behavior
*/
import { ActionManager, ExecuteCodeAction, Mesh, StandardMaterial, UniversalCamera, Vector3 } from "babylonjs";
import { ECS, Entity, TextPlane } from "../core";
import {
    LightSource, 
    TransformWidget,
    H2,
    O2,
    Table,
    InfoText,
    ChemistryEnvironment,
    Beaker,
    Tray,
    Sink,
    ResearchTray
} from "./prefabs"

export class TmpWorld extends ECS{

    // Add Objects/Prefabs here

    // Base Environment
    m_ChemistryEnvironment: ChemistryEnvironment;
    
    // Lighting
    m_LightSource1: LightSource;

    // Objects
    m_Interactables = Array<Entity>();

    

    // Information Entity
    m_InfoText: InfoText;

    // Transform Widget
    m_TransformWidget : TransformWidget;
    
    /**
     * @brief Initializes the whole scene/ECS
     */
    Init(): void {

        // Initialize camera position/rotation
        //this.m_Camera.position.set(0, 2, -16.5);
        (this.m_Camera as UniversalCamera).setTarget(new Vector3(-1.48, 1.83, 6.16));
        (this.m_Camera as UniversalCamera).rotation.set(0.17, -1.6, 0);
        (this.m_Camera as UniversalCamera).position.set(16, 8, 0);


        // Initialize all lights
        this.m_ChemistryEnvironment = this.Instantiate(ChemistryEnvironment, "Environment");
        const ambientLight = this.m_ChemistryEnvironment.m_AmbientLightSource.m_Light;
        ambientLight.intensity = 0.5;
        
        this.m_LightSource1 = this.Instantiate(LightSource, "Point Light Source")
        this.m_LightSource1.position.set(3, 10, 3);
        const lightSource = this.m_LightSource1.m_PointLightSource.m_Light;
        lightSource.intensity = 1;
    
        // Initialize all objects
        this.m_Interactables.push(this.Instantiate(Beaker, "Beaker"));
        (this.m_Interactables[0] as Beaker).m_Promise.then(()=>{
            this.m_Interactables[0].position.set(2, 7, 5.6);
        });

        this.m_Interactables.push(this.Instantiate(Tray, "Oxygen"));
        (this.m_Interactables[1] as Tray).m_Promise.then(()=>{
            this.m_Interactables[1].position.set(2, 6.3, 3);
            var textPlane = this.m_Interactables[1].GetComponent(TextPlane);
            textPlane.m_TextBlock.text = "Oxygen";
        });
        this.m_Interactables.push(this.Instantiate(Tray, "Hydrogen"));
        (this.m_Interactables[2] as Tray).m_Promise.then(()=>{
            this.m_Interactables[2].position.set(2, 6.3, 0);
            var textPlane = this.m_Interactables[2].GetComponent(TextPlane);
            textPlane.m_TextBlock.text = "Hydrogen";
        });

        
        this.m_Interactables.push(this.Instantiate(Tray, "Carbon"));
        (this.m_Interactables[3] as Tray).m_Promise.then(()=>{
            this.m_Interactables[3].position.set(2, 6.3, -3);
            var textPlane = this.m_Interactables[3].GetComponent(TextPlane);
            textPlane.m_TextBlock.text = "Carbon";
        });
        this.m_Interactables.push(this.Instantiate(Tray, "Chlorine"));
        (this.m_Interactables[4] as Tray).m_Promise.then(()=>{
            this.m_Interactables[4].position.set(2, 6.3, -6);
            var textPlane = this.m_Interactables[4].GetComponent(TextPlane);
            textPlane.m_TextBlock.text = "Chlorine";
        });

        this.m_Interactables.push(this.Instantiate(Sink, "Sink"));
        this.m_Interactables.push(this.Instantiate(ResearchTray, "ResearchTray"));


        this.m_XRPromise.then(() => {
            this.m_ControllerDragFeature.Enable();

        })

        // Information
        this.m_InfoText = this.Instantiate(InfoText, "InfoText");

        // Initialize Transform Widget
        this.m_TransformWidget = this.Instantiate(TransformWidget, "Transform Widget");

        // // Enable Teleportation (Only works with controllers)
        // const arrowMaterial = new StandardMaterial("Arrow Material", this);
        // this.m_XRPromise.then(()=>{
        //     this.m_LocomotionFeature.EnableTeleportation(
        //         [this.m_BaseEnvironment.m_Ground.m_Mesh as Mesh], 
        //         2000,
        //         true,
        //         "#55FF99",
        //         "blue",
        //         arrowMaterial,
        //         {
        //             enabled: true,
        //             checkRadius: 2
        //         }
        //     );    
        // });
    
        // // Set bounding box renderer to render red
        this.getBoundingBoxRenderer().frontColor.set(1, 0, 0);
        this.getBoundingBoxRenderer().backColor.set(1, 0, 0);

        // For Debugging:
        // window.addEventListener("keydown", e => {
        //     if (e.key === "t"){
        //     }
        // });
    }

    /**
     * @brief Updates the whole scene/ECS per frame
     */
    Update(): void {
        // Logic Before Render()
        this.m_Interactables.forEach((entity)=>{
            entity.Update();
        })

        this.m_TransformWidget.Update();
        
    }
}