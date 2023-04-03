/**
    @file VRWorld.ts
    @brief Contains the definition of the VRWorld class, a subclass of ECS.
    It represents a customized world with objects and behavior
*/
import { AbstractMesh, ActionEvent, ActionManager, CannonJSPlugin, ExecuteCodeAction, Mesh, Observable, Sound, StandardMaterial, UniversalCamera, Vector3 } from "babylonjs";
import { ECS, Entity, TextPlane } from "../core";
import * as cannon from "cannon"
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
    ResearchTray,
    Hydrogen,
    Oxygen
} from "./prefabs"

export class TmpWorld extends ECS{

    // Add Objects/Prefabs here

    // Base Environment
    m_ChemistryEnvironment: ChemistryEnvironment;
    
    // Lighting
    m_LightSource1: LightSource;

    // Objects
    m_Interactables = Array<Entity>();

    h2oCounter: number;
    ch4Counter: number;
    co2Counter: number;
    hclCounter: number;
    h2co3Counter: number;
        
    m_researchTrayEntity : Entity;
    m_putOnTraySound : Sound;
    m_toxicBool : boolean = true;

    // Information Entity
    m_InfoText: InfoText;

    // Transform Widget
    m_TransformWidget : TransformWidget;
    
    // Current beaker
    m_Beaker : Beaker;

    /**
     * @brief Initializes the whole scene/ECS
     */
    Init(): void {

        // Initialize Physics
        window.CANNON = cannon;
        const cannonjs = new CannonJSPlugin();
        cannonjs.setTimeStep(1.0 / 60.0);
        if (!this.enablePhysics(new Vector3(0, -9.81, 0), cannonjs)){
            throw new Error("Was not able to enable physics!");
        }
       
        // Initialize camera position/rotation
        //this.m_Camera.position.set(0, 2, -16.5);
        (this.m_Camera as UniversalCamera).setTarget(new Vector3(-1.48, 1.83, 6.16));
        (this.m_Camera as UniversalCamera).rotation.set(0.17, -1.6, 0);
        (this.m_Camera as UniversalCamera).position.set(16, 11, 0);

        this.h2oCounter = 0;
        this.ch4Counter = 0;
        this.co2Counter = 0;
        this.hclCounter = 0;
        this.h2co3Counter = 0;

        // Initialize all lights
        this.m_ChemistryEnvironment = this.Instantiate(ChemistryEnvironment, "Environment");
        const ambientLight = this.m_ChemistryEnvironment.m_AmbientLightSource.m_Light;
        ambientLight.intensity = 0.5;
        
        this.m_LightSource1 = this.Instantiate(LightSource, "Point Light Source")
        this.m_LightSource1.position.set(3, 10, 3);
        const lightSource = this.m_LightSource1.m_PointLightSource.m_Light;
        lightSource.intensity = 1;
        // Initialize all objects        
        this.m_Interactables.push(this.m_Beaker = this.Instantiate(Beaker, "Beaker"));

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
        this.m_Interactables.push(this.Instantiate(Sink, "Sink2"));
        (this.m_Interactables[6] as Tray).m_Promise.then(()=>{
            this.m_Interactables[6].position.set(-0.5, 5.85, -10.86);
        });
        this.m_Interactables.push(this.Instantiate(ResearchTray, "ResearchTray"));
        this.m_researchTrayEntity = this.m_Interactables[this.m_Interactables.length - 1];

        this.m_XRPromise.then(() => {
            this.m_ControllerDragFeature.Enable();

        })

        // Information
        this.m_InfoText = this.Instantiate(InfoText, "InfoText");

        // Initialize Transform Widget
        this.m_TransformWidget = this.Instantiate(TransformWidget, "Transform Widget");

        // Enable Teleportation (Only works with controllers)
        // const arrowMaterial = new StandardMaterial("Arrow Material", this);
        // this.m_XRPromise.then(()=>{
        //     this.m_ChemistryEnvironment.m_Promise.then(() => {
        //         var labMesh = this.getLastMeshById("pPlane1_lambert1_0") as Mesh;
        //         console.log(labMesh);
        //         this.m_LocomotionFeature.EnableTeleportation(
        //             [labMesh], 
        //             2000,
        //             true,
        //             "#55FF99",
        //             "blue",
        //             arrowMaterial,
        //             {
        //                 enabled: true,
        //                 checkRadius: 2
        //             }
        //         );  
        //         var tmpcmera = this.getCameraById('webxr');
        //         tmpcmera.position.set(9.5, 9.5, 0) ;
        //         console.log(tmpcmera);
        //     });
        // });
    
        // // Set bounding box renderer to render red
        this.getBoundingBoxRenderer().frontColor.set(1, 0, 0);
        this.getBoundingBoxRenderer().backColor.set(1, 0, 0);

        this.m_putOnTraySound = new Sound("putOntoTray", "assets/sounds/putOntoTray.wav", this.m_researchTrayEntity.m_Scene);

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

        // if (this.m_toxicBool)
            // if (this.m_XR.enterExitUI) {
                var tmpcmera = this.getCameraById('webxr');
                if (tmpcmera.position.x > 15.0 &&
                    tmpcmera.position.y > 1.6 &&
                    tmpcmera.position.z > 0)
                    
                 tmpcmera.position.set(9.5, 9.5, 0) ;
            //     this.m_toxicBool = false;
            //     console.log("fouahfna");
            // }


        this.m_TransformWidget.Update();
        
    }
}