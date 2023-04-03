/**
    @file ChemistryEnvironment.ts
    @desc A class that creates a chemistry environment.
*/
import { AbstractMesh, ISceneLoaderAsyncResult, MeshBuilder, PhysicsImpostor, TransformNode, Vector3 } from "babylonjs";
import { Entity, AmbientLightSource, Model, Skybox } from "../../core";
import { TmpWorld } from "../TmpWorld";

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
  m_Promise: Promise<ISceneLoaderAsyncResult>;

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
    this.m_Promise.then((result) => {
      // Do nothing for now
      this.m_Model.m_Mesh.scaling.setAll(100);
      // this.getChildMeshes().forEach((mesh)=>{
      //   mesh.isPickable = false;
      // });
      
      const groundMesh = MeshBuilder.CreateBox("Ground Mesh", {size: 1}, this.m_Scene);
      groundMesh.scaling.set(50, 5, 60);
      groundMesh.physicsImpostor = new PhysicsImpostor(
        groundMesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      groundMesh.position.set(0, -2.6, 0);
      //groundMesh.isPickable = false;

      const wall1Mesh = MeshBuilder.CreateBox("Wall1 Mesh", {size: 1}, this.m_Scene);
      wall1Mesh.scaling.set(5, 20, 60);
      wall1Mesh.physicsImpostor = new PhysicsImpostor(
        wall1Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      wall1Mesh.position.set(20.7, 6, 0);
      wall1Mesh.isPickable = false;
      wall1Mesh.visibility = 0;

      const wall2Mesh = MeshBuilder.CreateBox("Wall2 Mesh", {size: 1}, this.m_Scene);
      wall2Mesh.scaling.set(5, 20, 60);
      wall2Mesh.physicsImpostor = new PhysicsImpostor(
        wall2Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      wall2Mesh.position.set(-20.3, 6, 0);
      wall2Mesh.isPickable = false;
      wall2Mesh.visibility = 0;

      const wall3Mesh = MeshBuilder.CreateBox("Wall3 Mesh", {size: 1}, this.m_Scene);
      wall3Mesh.scaling.set(60, 20, 5);
      wall3Mesh.physicsImpostor = new PhysicsImpostor(
        wall3Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      wall3Mesh.position.set(0, 6, -28.100);
      wall3Mesh.isPickable = false;
      wall3Mesh.visibility = 0;

      const wall4Mesh = MeshBuilder.CreateBox("Wall4 Mesh", {size: 1}, this.m_Scene);
      wall4Mesh.scaling.set(60, 20, 5);
      wall4Mesh.physicsImpostor = new PhysicsImpostor(
        wall4Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      wall4Mesh.position.set(0, 6, 28.8);
      wall4Mesh.isPickable = false;
      wall4Mesh.visibility = 0;
      
      const worktableMesh = MeshBuilder.CreateBox("WorkTable Mesh", {size: 1}, this.m_Scene);
      worktableMesh.scaling.set(8.1, 6, 24);
      worktableMesh.physicsImpostor = new PhysicsImpostor(
        worktableMesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      worktableMesh.position.set(-0.4, 3, -0.7);
      worktableMesh.isPickable = false;
      worktableMesh.visibility = 0;

      const shelve1Mesh = MeshBuilder.CreateBox("Shelve1 Mesh", {size: 1}, this.m_Scene);
      shelve1Mesh.scaling.set(2, 5.3, 8);
      shelve1Mesh.physicsImpostor = new PhysicsImpostor(
        shelve1Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      shelve1Mesh.position.set(-0.5, 8.4, 3.9);
      shelve1Mesh.isPickable = false;
      shelve1Mesh.visibility = 0;

      const shelve2Mesh = MeshBuilder.CreateBox("Shelve2 Mesh", {size: 1}, this.m_Scene);
      shelve2Mesh.scaling.set(2, 5.3, 8);
      shelve2Mesh.physicsImpostor = new PhysicsImpostor(
        shelve2Mesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      shelve2Mesh.position.set(-0.5, 8.4, -5.4);
      shelve2Mesh.isPickable = false;
      shelve2Mesh.visibility = 0;

      const researchtableMesh = MeshBuilder.CreateBox("Research Table Mesh", {size: 1}, this.m_Scene);
      researchtableMesh.scaling.set(4.2, 5.69, 9.1);
      researchtableMesh.physicsImpostor = new PhysicsImpostor(
        researchtableMesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      researchtableMesh.position.set(-15.501, 3, 4.500);
      researchtableMesh.isPickable = false;
      researchtableMesh.visibility = 0;

      const chemicalTableMesh = MeshBuilder.CreateBox("Chemical Table Mesh", {size: 1}, this.m_Scene);
      chemicalTableMesh.scaling.set(4.2, 5.9, 29);
      chemicalTableMesh.physicsImpostor = new PhysicsImpostor(
        chemicalTableMesh,
        PhysicsImpostor.BoxImpostor,
        { mass: 0, restitution: 0.2, friction: 0.2},
        this.m_Scene
      );
      chemicalTableMesh.position.set(16, 2.9, -0.3);
      chemicalTableMesh.isPickable = false;
      chemicalTableMesh.visibility = 0;

      var roomMeshes = (this.m_ECS as TmpWorld).m_ChemistryEnvironment.m_Model.m_Mesh.getChildMeshes();
      for (let i = 0; i < roomMeshes.length; i++) {
        if (roomMeshes[i].name === "pPlane1_lambert1_0") { //exclude the room model
            this.m_ECS.m_LocomotionFeature.m_Teleportation.addFloorMesh(roomMeshes[i]);
            break;
        }
        else{
          this.m_ECS.m_LocomotionFeature.m_Teleportation.addBlockerMesh(roomMeshes[i]);
        }
      }

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
