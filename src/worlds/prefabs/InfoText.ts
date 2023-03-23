/**
    @file InfoText.ts
    @brief A InfoText Class to display info in the scene
*/
import { StandardMaterial, Texture } from "babylonjs";
import {Entity, Plane, TextPlane } from "../../core"


/**
 * InfoText class for displaying information in the scene
 */
export class InfoText extends Entity{

    /**
     * Initializes the entity by setting up the necessary components and properties
     */
    Init(): void {
         // Add text plane on the left side
        const leftInfo = this.AddComponent(TextPlane);
        leftInfo.m_Mesh.rotation.set(0, -Math.PI/8, 0);
        leftInfo.m_Mesh.position.set(-100, 100, 280);
        leftInfo.m_GUITexture.background = "black";
        leftInfo.m_TextBlock.color = "white";
        leftInfo.m_Mesh.scaling.setAll(100);
        leftInfo.m_TextBlock.fontSize = 10;
        leftInfo.m_TextBlock.textWrapping = true;
        leftInfo.m_TextBlock.text = "Look at an atom and press the button on the cardboard to transform it. Hold the button without moving to change the transform mode.";
        leftInfo.m_Mesh.isPickable = false;
        (leftInfo.m_Mesh.material as StandardMaterial).disableLighting = true;

        // Add plane with texture on the top left
        const leftTopImage = this.AddComponent(Plane);
        leftTopImage.m_Mesh.rotation.set(0, -Math.PI/8, 0);
        leftTopImage.m_Mesh.position.set(-100, 180, 280);
        leftTopImage.m_Mesh.scaling.set(100, 50, 1);
        leftTopImage.m_Mesh.isPickable = false;
        const leftTopImageMaterial = (leftTopImage.m_Mesh.material as StandardMaterial);
        leftTopImageMaterial.disableLighting = true;
        leftTopImageMaterial.emissiveTexture = new Texture("assets/textures/example1.png", this.m_Scene);

        // Add plane with texture on the bottom left
        const leftBtmImage = this.AddComponent(Plane);
        leftBtmImage.m_Mesh.rotation.set(0, -Math.PI/8, 0);
        leftBtmImage.m_Mesh.position.set(-100, 20, 280);
        leftBtmImage.m_Mesh.scaling.set(100, 50, 1);
        leftBtmImage.m_Mesh.isPickable = false;
        const leftBtmImageMaterial = (leftBtmImage.m_Mesh.material as StandardMaterial);
        leftBtmImageMaterial.disableLighting = true;
        leftBtmImageMaterial.emissiveTexture = new Texture("assets/textures/example2.png", this.m_Scene);

         // Add text plane in the center
        const centerInfo = this.AddComponent(TextPlane);
        centerInfo.m_Mesh.position.set(0, 100, 300);
        centerInfo.m_Mesh.scaling.setAll(100)
        centerInfo.m_TextBlock.fontSize = 10;
        centerInfo.m_TextBlock.textWrapping = true;
        centerInfo.m_TextBlock.text = "This application is targeted at Google Cardboard users for the benefit of accessibility and portability";
        centerInfo.m_GUITexture.background = "black";
        centerInfo.m_TextBlock.color = "white";
        centerInfo.m_Mesh.isPickable = false;
        (centerInfo.m_Mesh.material as StandardMaterial).disableLighting = true;

        // Add text plane on the right side
        const rightInfo = this.AddComponent(TextPlane);
        rightInfo.m_Mesh.rotation.set(0, Math.PI/8, 0);
        rightInfo.m_Mesh.position.set(100, 100, 280);
        rightInfo.m_GUITexture.background = "black";
        rightInfo.m_Mesh.scaling.setAll(100)
        rightInfo.m_TextBlock.fontSize = 10;
        rightInfo.m_TextBlock.textWrapping = true;
        rightInfo.m_TextBlock.color = "white";
        rightInfo.m_TextBlock.text = "Drag an atom onto another to bring up the Merge/Split GUI. Click on the buttons to merge/split the atoms!";
        rightInfo.m_Mesh.isPickable = false;
        (rightInfo.m_Mesh.material as StandardMaterial).disableLighting = true;

        // Add plane with texture on the top right
        const rightTopImage = this.AddComponent(Plane);
        rightTopImage.m_Mesh.rotation.set(0, Math.PI/8, 0);
        rightTopImage.m_Mesh.position.set(100, 180, 280);
        rightTopImage.m_Mesh.scaling.set(100, 50, 1);
        rightTopImage.m_Mesh.isPickable = false;
        const rightTopImageMaterial = (rightTopImage.m_Mesh.material as StandardMaterial);
        rightTopImageMaterial.disableLighting = true;
        rightTopImageMaterial.emissiveTexture = new Texture("assets/textures/example3.png", this.m_Scene);

        // Add plane with texture on the top left
        const rightBtmImage = this.AddComponent(Plane);
        rightBtmImage.m_Mesh.rotation.set(0, Math.PI/8, 0);
        rightBtmImage.m_Mesh.position.set(100, 20, 280);
        rightBtmImage.m_Mesh.scaling.set(100, 50, 1);
        rightBtmImage.m_Mesh.isPickable = false;
        const rightBtmImageMaterial = (rightBtmImage.m_Mesh.material as StandardMaterial);
        rightBtmImageMaterial.disableLighting = true;
        rightBtmImageMaterial.emissiveTexture = new Texture("assets/textures/example4.png", this.m_Scene);
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {
        
    }
}