/**
    @file TextPlane.ts
    @brief A component class that sets up a text object on a plane mesh
*/
import { Scene, TransformNode, Vector3 } from "babylonjs";
import { TextBlock, AdvancedDynamicTexture } from "babylonjs-gui";
import { Entity } from "../Entity";
import {Plane} from "./Mesh"

/**
 * @brief Enumeration representing the different ways to orient the text plane
 */
enum TextPlaneOrientation{
    NONE,
    CAMERA_ALL,
    CAMERA_X,
    CAMERA_Y,
    CAMERA_Z,
    POSITION
}

/**
 * @brief TextPlane class for text rendered on top of plane mesh
 */
export class TextPlane extends Plane{

    /* Some Properties of AdvancedDynamicTexture
        - background
    */
    public m_GUITexture: AdvancedDynamicTexture;
    
    /* Some Properties of TextBlock:
        - text
        - color
        - fontSize
    */
    public m_TextBlock: TextBlock;

    /**
   * @brief Creates a new instance of the TextPlane class.
   *
   * @param name Name of the TextPlane.
   * @param scene Scene that the TextPlane belongs to.
   * @param entity Parent entity that this TextPlane is attached to.
   * @param index Index of the TextPlane within its parent entity's list of TextPlane.
   */
    constructor(
        name: string,
        scene: Scene,
        entity: Entity,
        index: number
    ) {
        super(name, scene, entity, index);
    }

    /**
   * @brief Initializes the mesh and text gui.
   *
   * This method is called when the textplane is added to an entity and should be used to
   * initialize any necessary resources or state.
   */
    public Init(): void {
        super.Init();
        this.m_GUITexture = AdvancedDynamicTexture.CreateForMesh(this.m_Mesh, 100, 100);
        this.m_TextBlock = new TextBlock(this.m_Name + " TextBlock");
        this.m_GUITexture.addControl(this.m_TextBlock);
    }

     /**
   * @brief Sets the orientation of the gui texture to always face the camera
   *
   * @param orientation Orientation of the GUI Texture to face
   * @param lookAtPos Look at position if TextPlaneOrientation.POSITION was used.
   */
    public SetAlwaysFaceCamera(orientation: TextPlaneOrientation, lookAtPos: Vector3 = new Vector3())
    {
        switch(orientation){
            case TextPlaneOrientation.NONE:
                this.m_Mesh.billboardMode = TransformNode.BILLBOARDMODE_NONE;
                break;
            case TextPlaneOrientation.CAMERA_ALL:
                this.m_Mesh.billboardMode = TransformNode.BILLBOARDMODE_ALL;
                break;
            case TextPlaneOrientation.CAMERA_X:
                this.m_Mesh.billboardMode = TransformNode.BILLBOARDMODE_X;
                break;
            case TextPlaneOrientation.CAMERA_Y:
                this.m_Mesh.billboardMode = TransformNode.BILLBOARDMODE_Y;
                break;
            case TextPlaneOrientation.CAMERA_Z:
                this.m_Mesh.billboardMode = TransformNode.BILLBOARDMODE_Z;
                break;
            case TextPlaneOrientation.POSITION:
                this.m_Mesh.billboardMode = TransformNode.BILLBOARDMODE_USE_POSITION;
                this.m_Mesh.lookAt(lookAtPos);
                break;
        }
    }
}