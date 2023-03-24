/**
    @file ChemistryEnvironment.ts
    @desc A class that creates a chemistry environment.
*/
import { Vector3 } from "babylonjs";
import { Entity, AmbientLightSource, Model, Skybox } from "../../core";

/**
    @class
    @classdesc A class that creates a chemistry environment.
    @extends Entity
*/
export class ChemistryEnvironment extends Entity {
  /** @member {Model} m_Model
   * - The ground object of the environment. */
  m_Model: Model;

  /**
   * @brief A promise for loading the H2 model.
   */
  m_Promise: Promise<void>;

  /** @member {AmbientLightSource} m_AmbientLightSource
   * - The ambient light sourcea object of the environment. */
  m_AmbientLightSource: AmbientLightSource;

  /**
        @desc Initializes the basic environment.
        @function Init
        @return {void}
    */
  Init(): void {
    // Add a Model component for the Chemistry Room
    this.m_Model = this.AddComponent(Model);
    this.m_Model.m_AssetPath = "assets/models/chemistry.glb";

    // Load the Chemistry model and store the promise for future use
    this.m_Promise = this.m_Model.LoadModel();
    this.m_Promise.then(() => {
      // Do nothing for now
      this.m_Model.m_Mesh.scaling.setAll(100);
      this.getChildMeshes().forEach((mesh)=>{
        mesh.isPickable = false;
      })
    });

    // Create the ambient light source object
    this.m_AmbientLightSource = this.AddComponent(AmbientLightSource);
  }

  /**
        @desc An empty update function.
        @function Update
        @return {void}
    */
  Update(): void {}
}
