/**
    @file ProgressBar.ts
    @brief Contains the definition of the ProgressBar class, a subclass of Entity.
    It represents a circular progress bar that fills up when the user holds down the pointer for awhile without dragging
*/
import { AnimationGroup, Color3, Mesh, MeshBuilder, ShaderMaterial, StandardMaterial, Texture, TransformNode, UniversalCamera, Vector3, VertexBuffer, VertexData } from "babylonjs"
import {ECS, Entity} from "../../core"
import {Animation} from "babylonjs"

/**
    @class O2
    @brief A class that represents an ProgressBar entity.
    @extends Entity
*/
export class ProgressBar extends Entity{

    // Properties
    m_Timer = 0;
    m_Delay = 500;
    m_PointerDownAndNotMoving = false;
    m_AnimationPlayed = false;
    m_OpenGUI = false;

    // Widgets
    m_OuterSpinner: Mesh;
    m_InnerSpinner: Mesh;
    m_Cylinder: Mesh;

    m_AnimationGroup: AnimationGroup;
    
    /**
        @brief Initializes the ProgressBar.
        @returns void
    */
    Init(): void {
        
        // Create meshes needed
        this.m_OuterSpinner = MeshBuilder.CreateTorus("Outer Spinner", {thickness: 0.1, diameter: 0.2}, this.m_Scene);
        this.m_Cylinder = MeshBuilder.CreateCylinder("Cylinder", {height: 0.2, diameter: 0.2}, this.m_Scene);
        this.m_InnerSpinner = MeshBuilder.CreateTorus("Inner Spinner", {thickness: 0.1, diameter: 0.2}, this.m_Scene);

        // Set Parentage
        this.m_OuterSpinner.addChild(this.m_Cylinder);
        this.m_OuterSpinner.addChild(this.m_InnerSpinner);
        this.m_OuterSpinner.setParent(this);
        
        this.m_OuterSpinner.renderingGroupId = 1;
        this.m_InnerSpinner.renderingGroupId = 1;
        this.m_Cylinder.renderingGroupId = 1;
        this.m_OuterSpinner.isPickable = false;
        this.m_InnerSpinner.isPickable = false;
        this.m_Cylinder.isPickable = false;

        // Set the spinner's position
        this.m_OuterSpinner.position = new Vector3(0, 1, 0);
        this.m_OuterSpinner.rotate(new Vector3(1, 0, 0), Math.PI / 2);
        this.m_OuterSpinner.billboardMode = Mesh.BILLBOARDMODE_ALL;
        
        // Set the spinner's material
        const spinnerMaterial = new StandardMaterial("ProgressBar Outer Spinner Material", this.m_Scene);
        spinnerMaterial.emissiveColor = new Color3(0.5, 1, 0.5);
        spinnerMaterial.disableLighting = true;
        this.m_OuterSpinner.material = spinnerMaterial;

        // Set the cylinder's material
        const cylinderMaterial = new StandardMaterial("ProgressBar Inner Spinner Material", this.m_Scene);
        cylinderMaterial.emissiveColor = new Color3(0, 0.5, 0.25);
        cylinderMaterial.disableLighting = true;
        this.m_Cylinder.material = cylinderMaterial;
        
        // Copy material to inner spinner as well
        this.m_InnerSpinner.material = spinnerMaterial;

        // Hide all meshes and reset variables
        this.ResetWidgets();

        // Create Animation for Circular Progress Bar to fill up
        this.m_AnimationGroup = new AnimationGroup("ProgressBar Animation Group", this.m_Scene);
        {
            const animationX = new Animation(
                "SpinnerAnimationX", 
                "scaling.x", 
                60, 
                Animation.ANIMATIONTYPE_FLOAT);
            const animationZ = new Animation(
                "SpinnerAnimationZ", 
                "scaling.z", 
                60, 
                Animation.ANIMATIONTYPE_FLOAT);
            const keys = [
                {frame: 0, value: 0},
                {frame: 15, value: 0},
                {frame: 30, value: 1},
            ];
            animationX.setKeys(keys);
            animationZ.setKeys(keys);

            this.m_AnimationGroup.addTargetedAnimation(animationX, this.m_InnerSpinner);
            this.m_AnimationGroup.addTargetedAnimation(animationZ, this.m_InnerSpinner);    
        }

        // Create Animation for Circular Progress Bar to fade in
        {
            const animationFade = new Animation(
                "ProgressBarFadeAnimation",
                "visibility",
                60, Animation.ANIMATIONTYPE_FLOAT);
            const keys = [
                {frame:0, value: 0},
                {frame:15, value: 1},
                {frame:30, value: 1}
            ]
            animationFade.setKeys(keys);
            this.m_AnimationGroup.addTargetedAnimation(animationFade, this.m_OuterSpinner);
            this.m_AnimationGroup.addTargetedAnimation(animationFade, this.m_InnerSpinner);    
            this.m_AnimationGroup.addTargetedAnimation(animationFade, this.m_Cylinder); 
        }

        // Add on animation group ended event to open the GUI
        this.m_AnimationGroup.onAnimationGroupEndObservable.add(
            evtData=>{
                if (this.m_AnimationPlayed){
                    this.m_OpenGUI = true;
                }
            }
        )
    }

    /**
        @brief Performs updates on the ProgressBar.
        @returns void
    */
    Update(): void {
        // Delay before playing the animation on pointer down
        if (!this.m_AnimationPlayed && this.m_PointerDownAndNotMoving){
            this.m_Timer += this.m_Scene.deltaTime;
            if (this.m_Timer > this.m_Delay){
                this.m_AnimationGroup.play();
                this.m_AnimationPlayed = true;
            }
        }
    }

    /**
        @brief On Pointer Down and valid Mesh is Picked.
        @returns void
    */
    OnPickedDown(pickedMesh: TransformNode){
        this.m_PointerDownAndNotMoving = true;
        this.m_OuterSpinner.position.copyFrom(pickedMesh.getAbsolutePosition());
        const camera = (this.m_Scene as ECS).m_Camera;
        this.m_OuterSpinner.position = this.m_OuterSpinner.position.add((camera as UniversalCamera).upVector);
    }

    /**
        @brief On Pointer Up or Moved
        @returns void
    */
    OnPointerMoveOrUp(pickedMesh: TransformNode, move: boolean){
        this.m_OuterSpinner.position.copyFrom(pickedMesh.getAbsolutePosition());
        const camera = (this.m_Scene as ECS).m_Camera;
        this.m_OuterSpinner.position = this.m_OuterSpinner.position.add((camera as UniversalCamera).upVector);

        this.m_PointerDownAndNotMoving = false;
        this.m_Timer = 0;
        this.m_AnimationPlayed = false;
        this.m_AnimationGroup.stop();
        this.ResetWidgets();

        if (this.m_OpenGUI){
            // Open GUI HERE!
            this.m_OpenGUI = false;
            return !move;
        }
        return false;
    }

    /**
        @brief Resets all meshes to invisible and variables
        @returns void
    */
    ResetWidgets(){
        this.m_InnerSpinner.visibility = 0;
        this.m_OuterSpinner.visibility = 0;
        this.m_Cylinder.visibility = 0;
        this.m_InnerSpinner.scaling.set(0, 5, 0);
    }
}