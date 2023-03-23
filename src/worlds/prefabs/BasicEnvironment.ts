/**
    @file BasicEnvironment.ts
    @desc A class that creates a basic environment with a ground, ambient light source, and photo dome.
*/
import { PhotoDome, StandardMaterial, Texture } from "babylonjs";
import { Entity, AmbientLightSource, Ground, Skybox } from "../../core";

/**
    @class
    @classdesc A class that creates a basic environment with a ground, ambient light source, and photo dome.
    @extends Entity
*/
export class BasicEnvironment extends Entity{

    /** @member {Ground} m_Ground 
     * - The ground object of the environment. */
    m_Ground: Ground;

    /** @member {AmbientLightSource} m_AmbientLightSource 
     * - The ambient light source object of the environment. */
    m_AmbientLightSource: AmbientLightSource;

    /** @member {Skybox} m_Skybox 
     * - The skybox object of the environment. */
    m_Skybox: Skybox;

    /**
        @desc Initializes the basic environment with a ground, ambient light source, and photo dome.
        @function Init
        @return {void}
    */
    Init(): void {

        // Set the position of the environment
        this.position.set(0, -5, 0);

        // Create the ground object and set its properties
        this.m_Ground = this.AddComponent(Ground);
        this.m_Ground.m_Mesh.scaling.set(100, 1, 100);
        this.m_Ground.m_Mesh.isPickable = false;
        const groundTex = new Texture("assets/textures/FloorTile.jpg");
        groundTex.uScale = 50;
        groundTex.vScale = 50;
        (this.m_Ground.m_Mesh.material as StandardMaterial).diffuseTexture = groundTex;

        // Create the ambient light source object
        this.m_AmbientLightSource = this.AddComponent(AmbientLightSource);

        // Create the skybox object and set its properties
        /*
        this.m_Skybox = this.AddComponent(Skybox);
        this.m_Skybox.m_CubeTextureAssetPath = "assets/textures/skybox";
        this.m_Skybox.LoadCubeTexture();
        this.m_Skybox.m_Mesh.isPickable = false;
        */

        // Create the photodome
        const photoDome = new PhotoDome(
            "photoDome", // name
            "assets/textures/classroom.png", // photo url
            {
                resolution: 64, // resolution of the photo texture
                size: 1000, // size of the photodome
                useDirectMapping: true
            },
            this.m_Scene // the scene object
        );
        photoDome.mesh.isPickable = false;
    }

    /**
        @desc An empty update function.
        @function Update
        @return {void}
    */
    Update(): void{}
}