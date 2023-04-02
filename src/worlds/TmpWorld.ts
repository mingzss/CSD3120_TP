/**
    @file VRWorld.ts
    @brief Contains the definition of the VRWorld class, a subclass of ECS.
    It represents a customized world with objects and behavior
*/
import { ActionManager, CannonJSPlugin, ExecuteCodeAction, Mesh, Observable, Sound, StandardMaterial, UniversalCamera, Vector3 } from "babylonjs";
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
    Hydrogen
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
    
    // if has spawns atoms/molecules
    m_hasSpawnAtoms: Boolean = false;
    
    m_researchTrayEntity : Entity;
    m_putOnTraySound : Sound;
    m_hasPlayedSoundOnce : Boolean = false;

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

        if (this.m_hasSpawnAtoms) {
            // gets last spawned object
            let currEntity = this.m_Interactables[this.m_Interactables.length-1];
            let currSpawnName = currEntity.m_Name;

            if (currSpawnName.includes("Chlorine") || currSpawnName.includes("Carbon") || 
                currSpawnName.includes("Hydrogen") || currSpawnName.includes("Oxygen") || 
                currSpawnName.includes("HCL") || currSpawnName.includes("CO2") ||
                currSpawnName.includes("CH4") || currSpawnName.includes("H2O")) {

                    const onDistanceChangeObservable = new Observable<number>();
                    let previousState: number = null;
                    this.onBeforeRenderObservable.add(() => {
                        const currentState = Vector3.Distance(currEntity.position,
                            this.m_researchTrayEntity.position);
                        if (currentState !== previousState) {
                            previousState = currentState;
                            onDistanceChangeObservable.notifyObservers(currentState);
                        }
                    });
                    currEntity.distanceDifferenceObservable = onDistanceChangeObservable;

                    const ob = currEntity.distanceDifferenceObservable.add(distance => {
                        const withinDistance = distance <= 0.6;
                        if (withinDistance) {
                            if (!this.m_hasPlayedSoundOnce) {
                                // sfx when user put things on top of tray 
                                // issue is when user select and not move and let go, sound still plays
                                this.m_putOnTraySound.play();
                                console.log("play");
                                this.m_hasPlayedSoundOnce = true;
                            }
                        }
                        else {
                            this.m_hasPlayedSoundOnce = false;
                        }
                    });
                    // console.log(this.m_Interactables[this.m_Interactables.length-1].m_Name);
                }
            this.m_hasSpawnAtoms = false;
        }

        
        this.m_TransformWidget.Update();
        
    }
}