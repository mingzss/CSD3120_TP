/**
    @file UIPopup.ts
    @brief Contains the definition of the UIPopup class, a subclass of Entity.
    It represents a user interface popup used for controlling the transformation and merging/splitting of objects.
*/
import { Mesh } from "babylonjs";
import { AdvancedDynamicTexture, Button, Control, StackPanel } from "babylonjs-gui";
import {Entity, Plane} from "../../core"
import { InteractState } from "./TransformWidget";

/**
    @class UIPopup
    @brief A subclass of Entity representing a user interface popup.
*/
export class UIPopup extends Entity{

    // Transformation
    m_Plane: Plane;
    m_AdvancedTexture: AdvancedDynamicTexture;

    m_TranslateButton: Button;
    m_RotateButton: Button;

    m_StackPanel: StackPanel;

    m_DragState = InteractState.Translate;

    /**
    @brief Initializes the UIPopup.
    @returns void
    */
    Init(): void{

        // Setting up the plane
        this.m_Plane = this.AddComponent(Plane);
        this.m_Plane.m_Mesh.scaling.set(3, 1, 1);
        this.m_Plane.m_Mesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
        this.m_Plane.m_Mesh.renderingGroupId = 2;
        this.m_AdvancedTexture = AdvancedDynamicTexture.CreateForMesh(this.m_Plane.m_Mesh);
        this.m_AdvancedTexture.background = "black";

        // Translate Button
        this.m_TranslateButton = Button.CreateImageOnlyButton("Translate Button", "assets/textures/translate.png");
        this.m_TranslateButton.width = "100px";
        this.m_TranslateButton.height = "100px";
        this.m_TranslateButton.color = "black";
        this.m_TranslateButton.background = "white";
        this.m_TranslateButton.isEnabled = false;
        this.m_TranslateButton.isHitTestVisible = true;
        this.m_TranslateButton.isPointerBlocker = true;
        this.m_TranslateButton.onPointerClickObservable.add(() => {
            this.m_DragState = InteractState.Translate;
            this.m_TranslateButton.isEnabled = false;
            this.m_RotateButton.isEnabled = true;
        });

        // Rotate Button
        this.m_RotateButton = Button.CreateImageOnlyButton("Rotate Button", "assets/textures/rotate.png");
        this.m_RotateButton.width = "100px";
        this.m_RotateButton.height = "100px";
        this.m_RotateButton.color = "black";
        this.m_RotateButton.background = "white";
        this.m_RotateButton.isHitTestVisible = true;
        this.m_RotateButton.isPointerBlocker = true;
        this.m_RotateButton.onPointerClickObservable.add(() => {
            this.m_DragState = InteractState.Rotate;
            this.m_TranslateButton.isEnabled = true;
            this.m_RotateButton.isEnabled = false;
        });
     
        // Stack Panel to organize all the UI
        this.m_StackPanel = new StackPanel("UIPopup Stack Panel");
        this.m_StackPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.m_StackPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.m_StackPanel.isVertical = false;
        this.m_StackPanel.isPointerBlocker = true;
        this.m_StackPanel.addControl(this.m_TranslateButton);
        this.m_StackPanel.addControl(this.m_RotateButton);
        this.m_StackPanel.setPadding(0, 10, 0, 10);

        // Center the stack panel on the plane mesh
        this.m_StackPanel.scaleX = 7.5 / this.m_Plane.m_Mesh.scaling.x;
        this.m_StackPanel.scaleY = 7.5 / this.m_Plane.m_Mesh.scaling.y;
        this.m_StackPanel.left = "0px";
        this.m_StackPanel.top = "0px";
    
        // Finally add to the texture
        this.m_AdvancedTexture.addControl(this.m_StackPanel);

        // Start off Disabled
        this.m_Plane.Disable();
    }

    /**
     * @brief Empty Update method required by the Entity class.
     * 
     * This method does nothing and is required to be implemented due to the Table class inheriting from the Entity class.
     */
    Update(): void {
        
    }
}