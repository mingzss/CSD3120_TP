/**
    @file VRWorld.ts
    @brief Contains the definition of the VRWorld class, a subclass of ECS.
    It represents a customized world with objects and behavior
*/
import { Mesh, StandardMaterial, UniversalCamera } from "babylonjs";
import { ECS, Entity } from "../core";
import {
    BasicEnvironment, 
    LightSource, 
    TransformWidget,
    H2,
    O2,
    Table,
    InfoText
} from "./prefabs"

export class VRWorld extends ECS{

    // Add Objects/Prefabs here

    // Base Environment
    m_BaseEnvironment: BasicEnvironment;
    
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
        this.m_Camera.position.set(0, 2, -16.5);
        (this.m_Camera as UniversalCamera).rotation.set(-13.0 * Math.PI / 180.0, 0, 0);

        // Initialize all lights
        this.m_BaseEnvironment = this.Instantiate(BasicEnvironment, "Environment");
        const ambientLight = this.m_BaseEnvironment.m_AmbientLightSource.m_Light;
        ambientLight.intensity = 0.5;
        
        this.m_LightSource1 = this.Instantiate(LightSource, "Point Light Source")
        this.m_LightSource1.position.set(3, 10, 3);
        const lightSource = this.m_LightSource1.m_PointLightSource.m_Light;
        lightSource.intensity = 1;
    
        // Initialize all objects (H2, O2, Table, Information)
        // O2/H2
        for (let i = 0; i < 2; ++i){
            this.m_Interactables.push(this.Instantiate(H2, "H2"));
            this.m_Interactables.push(this.Instantiate(O2, "O2"));
        }
        (this.m_Interactables[0] as H2).m_Promise.then(()=>{this.m_Interactables[0].position.set(1, 2, 0);});
        (this.m_Interactables[2] as H2).m_Promise.then(()=>{this.m_Interactables[2].position.set(1, 3, 0);});
        (this.m_Interactables[1] as O2).m_Promise.then(()=>{this.m_Interactables[1].position.set(-1, 3, 0);});
        (this.m_Interactables[3] as O2).m_Promise.then(()=>{this.m_Interactables[3].position.set(-1, 2, 0);});

        // Table
        const tableEnt = this.Instantiate(Table, "Table");
        tableEnt.position.set(0, -5, 0);
        tableEnt.scaling.setAll(10);

        // Information
        this.m_InfoText = this.Instantiate(InfoText, "InfoText");

        // Initialize Transform Widget
        this.m_TransformWidget = this.Instantiate(TransformWidget, "Transform Widget");

        // Enable Teleportation (Only works with controllers)
        const arrowMaterial = new StandardMaterial("Arrow Material", this);
        this.m_XRPromise.then(()=>{
            this.m_LocomotionFeature.EnableTeleportation(
                [this.m_BaseEnvironment.m_Ground.m_Mesh as Mesh], 
                2000,
                true,
                "#55FF99",
                "blue",
                arrowMaterial,
                {
                    enabled: true,
                    checkRadius: 2
                }
            );    
        });
    
        // Set bounding box renderer to render red
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