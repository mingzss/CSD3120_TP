/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import {
  AbstractMesh,
  ActionManager,
  Color4,
  ExecuteCodeAction,
  ISceneLoaderAsyncResult,
  ParticleSystem,
  PhysicsImpostor,
  SixDofDragBehavior,
  Sound,
  Texture,
  Vector3,
} from "babylonjs";
import { Cube, Entity, Model } from "../../../core";
import { TmpWorld } from "../../TmpWorld";
import { CH4 } from "../Molecules/CH4";
import { CO2 } from "../Molecules/CO2";
import { H2CO3 } from "../Molecules/H2CO3";
import { H2O } from "../Molecules/H2O";
import { HCL } from "../Molecules/HCL";

export class Beaker extends Entity {
  actionManager: ActionManager;
  sixDofDragBehavior: SixDofDragBehavior;

  carbonCounter: number;
  chlorineCounter: number;
  hydrogenCounter: number;
  oxygenCounter: number;

  h2oCounter: number;
  ch4Counter: number;
  co2Counter: number;
  hclCounter: number;
  h2co3Counter: number;

  shakecounter: number;
  reacted: boolean;
  kaboomSound: Sound;
  dingSound: Sound;
  playedKaboom: boolean;
  kaboomParticleSystem: ParticleSystem;

  m_Rigidbody: Cube;
  m_BeakerModelEntity: BeakerModel;

  createParticles(filepath: string) {
    const particleSystem = new ParticleSystem(
      "particleSystem",
      5000,
      this.m_Scene
    );
    particleSystem.particleTexture = new Texture(filepath, this.m_Scene);
    particleSystem.emitter = this.m_Rigidbody.m_Mesh.getAbsolutePosition();
    particleSystem.minEmitBox = new Vector3(0, 0, 0);
    particleSystem.color1 = new Color4(1, 1, 1, 1);
    particleSystem.color2 = new Color4(1, 1, 1, 0);
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
    particleSystem.minSize = 1;
    particleSystem.maxSize = 0.2;
    particleSystem.minLifeTime = 0.1;
    particleSystem.maxLifeTime = 0.2;

    particleSystem.emitRate = 1000;
    particleSystem.direction1 = new Vector3(-1, 8, 1);
    particleSystem.direction2 = new Vector3(1, 8, -1);

    particleSystem.minEmitPower = 0.2;
    particleSystem.maxEmitPower = 0.8;
    particleSystem.updateSpeed = 0.01;

    particleSystem.gravity = new Vector3(0, -9.8, 0);
    particleSystem.disposeOnStop = true;
    this.kaboomParticleSystem = particleSystem;
    this.kaboomParticleSystem.start();
  }

  Init(): void {
    this.carbonCounter = 0;
    this.chlorineCounter = 0;
    this.hydrogenCounter = 0;
    this.oxygenCounter = 0;

    this.h2oCounter = 0;
    this.ch4Counter = 0;
    this.co2Counter = 0;
    this.hclCounter = 0;
    this.h2co3Counter = 0;

    this.shakecounter = 0;
    this.reacted = false;
    this.playedKaboom = false;
    this.kaboomSound = new Sound(
      "kaboom",
      "assets/sounds/Explosion.wav",
      this.m_Scene,
      null,
      { loop: false, autoplay: false }
    );
    this.dingSound = new Sound(
      "ding",
      "assets/sounds/ding.wav",
      this.m_Scene,
      null,
      { loop: false, autoplay: false }
    );

    this.m_Rigidbody = this.AddComponent(Cube);
    this.m_Rigidbody.m_Mesh.id = "BeakerRigidbody";
    this.m_Rigidbody.m_Mesh.setParent(null);
    this.m_Rigidbody.m_Mesh.scaling.set(1.25, 1.7, 1.25);
    this.m_Rigidbody.m_Mesh.visibility = 0;
    const impostor = new PhysicsImpostor(
      this.m_Rigidbody.m_Mesh,
      PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0, friction: 2 },
      this.m_Scene
    );
    this.m_Rigidbody.m_Mesh.physicsImpostor = impostor;
    this.m_Rigidbody.m_Mesh.setParent(this);
    this.m_ECS.m_LocomotionFeature.m_Teleportation.addBlockerMesh(
      this.m_Rigidbody.m_Mesh
    );
    this.actionManager = this.m_Rigidbody.m_Mesh.actionManager =
      new ActionManager(this.m_Scene);
    let previousBeakerPosition: number = null;
    //observable for shaking beaker
    this.m_Scene.onBeforeRenderObservable.add(() => {
      const offsetThreshold = 0.6;

      const currBeakerPosition = this.getAbsolutePosition().y;
      const offset = Math.abs(currBeakerPosition - previousBeakerPosition);

      if (offset > offsetThreshold) {
        ++this.shakecounter;
        if (this.shakecounter > 6) {
          console.log("shaked more than 6 times yo~");
        }
      }

      previousBeakerPosition = currBeakerPosition;
    });

    this.m_BeakerModelEntity = this.m_ECS.Instantiate(
      BeakerModel,
      "Beaker Model"
    );
    this.m_BeakerModelEntity.scaling.setAll(0.25);
    this.m_BeakerModelEntity.setParent(this.m_Rigidbody.m_Mesh);
    this.m_BeakerModelEntity.position.set(0, 0.1, 0);
    this.m_Rigidbody.m_Mesh.position.set(2, 7.5, 7);
  }

  Update(): void {
    if (this.m_Rigidbody.m_Mesh.position.y <= -1000) {
      this.m_Rigidbody.m_Mesh.position.set(2, 7, 6.95);
    }
    if (this.shakecounter > 6) {
      //if correct => play sound + spawn new molecule + dispose beaker
      //if wrong => play sound + explosion particles + fade beaker
      console.log(this.m_Rigidbody.m_Mesh.name);
      var atomsInBeaker =
        this.m_BeakerModelEntity.m_Model.m_Mesh.getChildTransformNodes(true);
      var tmpWorld = this.m_ECS as TmpWorld;
      atomsInBeaker.forEach((mesh) => {
        console.log("child nodes: " + mesh.name);
        if (mesh.name !== "Beaker") {
          for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
            if (tmpWorld.m_Interactables[i].name === mesh.name) {
              tmpWorld.m_Interactables.splice(i, 1);
              break;
            }
          }
          var atomchildren = mesh.getChildMeshes();
          atomchildren.forEach((childchild) => {
            childchild.dispose();
          });
          mesh.dispose();
        }
      });
      console.log(
        this.hydrogenCounter +
          " h and o: " +
          this.oxygenCounter +
          " h20:" +
          this.h2oCounter
      );
      var tmpWorld = this.m_ECS as TmpWorld;
      if (
        this.hydrogenCounter === 2 &&
        this.oxygenCounter === 1 &&
        this.chlorineCounter == 0 &&
        this.carbonCounter == 0 &&
        this.h2oCounter == 0 &&
        this.ch4Counter == 0 &&
        this.co2Counter == 0 &&
        this.h2co3Counter == 0
      ) {
        //H2O
        this.dingSound.play(0, 0, 1);

        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name) {
            tmpWorld.m_Interactables.splice(i, 1);
            break;
          }
        }
        var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
        newBeakerEntity.position.set(0, 0.1, 0);
        tmpWorld.m_Interactables.push(newBeakerEntity);
        (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.Destroy();
        this.m_BeakerModelEntity.Destroy();

        newBeakerEntity.m_BeakerModelEntity.m_Promise.then(() => {
          var hName = "H2O Molecule " + tmpWorld.h2oCounter.toString();
          var h2oEntity = tmpWorld.Instantiate(H2O, hName);
          tmpWorld.h2oCounter++;
          var hName2 = "H2O Molecule " + tmpWorld.h2oCounter.toString();
          var h2oEntity2 = tmpWorld.Instantiate(H2O, hName2);
          tmpWorld.h2oCounter++;
          tmpWorld.m_Interactables.push(h2oEntity);
          tmpWorld.m_Interactables.push(h2oEntity2);
        });
      } else if (
        this.hydrogenCounter === 2 &&
        this.oxygenCounter === 0 &&
        this.h2oCounter == 0 &&
        this.ch4Counter == 0 &&
        this.carbonCounter == 1 &&
        this.chlorineCounter == 0 &&
        this.co2Counter == 0 &&
        this.h2co3Counter == 0
      ) {
        //CH4
        this.dingSound.play(0, 0, 1);

        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name) {
            tmpWorld.m_Interactables.splice(i, 1);
            break;
          }
        }

        var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
        newBeakerEntity.position.set(0, 0.1, 0);
        tmpWorld.m_Interactables.push(newBeakerEntity);
        (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.Destroy();
        this.m_BeakerModelEntity.Destroy();
        newBeakerEntity.m_BeakerModelEntity.m_Promise.then(() => {
          var ch4Name = "CH4 Molecule " + tmpWorld.ch4Counter.toString();
          var ch4Entity = tmpWorld.Instantiate(CH4, ch4Name);
          tmpWorld.ch4Counter++;
          tmpWorld.m_Interactables.push(ch4Entity);
        });
      } else if (
        this.hydrogenCounter === 0 &&
        this.oxygenCounter === 1 &&
        this.h2oCounter == 0 &&
        this.ch4Counter == 0 &&
        this.carbonCounter == 1 &&
        this.chlorineCounter == 0 &&
        this.co2Counter == 0 &&
        this.h2co3Counter == 0
      ) {
        //CO2
        this.dingSound.play(0, 0, 1);

        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name) {
            tmpWorld.m_Interactables.splice(i, 1);
            break;
          }
        }

        var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
        newBeakerEntity.position.set(0, 0.1, 0);
        tmpWorld.m_Interactables.push(newBeakerEntity);
        (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.Destroy();
        this.m_BeakerModelEntity.Destroy();

        newBeakerEntity.m_BeakerModelEntity.m_Promise.then(() => {
          var co2Name = "CO2 Molecule " + tmpWorld.co2Counter.toString();
          var co2Entity = tmpWorld.Instantiate(CO2, co2Name);
          tmpWorld.co2Counter++;
          tmpWorld.m_Interactables.push(co2Entity);
        });
      } else if (
        this.hydrogenCounter === 1 &&
        this.oxygenCounter === 0 &&
        this.h2oCounter == 0 &&
        this.ch4Counter == 0 &&
        this.carbonCounter == 0 &&
        this.chlorineCounter == 1 &&
        this.co2Counter == 0 &&
        this.h2co3Counter == 0
      ) {
        //CO2
        this.dingSound.play(0, 0, 1);

        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name) {
            tmpWorld.m_Interactables.splice(i, 1);
            break;
          }
        }

        var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
        newBeakerEntity.position.set(0, 0.1, 0);
        tmpWorld.m_Interactables.push(newBeakerEntity);
        (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.Destroy();
        this.m_BeakerModelEntity.Destroy();

        newBeakerEntity.m_BeakerModelEntity.m_Promise.then(() => {
          var hclName = "HCL Molecule " + tmpWorld.hclCounter.toString();
          var hclEntity = tmpWorld.Instantiate(HCL, hclName);
          tmpWorld.hclCounter++;
          var hclName2 = "HCL Molecule " + tmpWorld.hclCounter.toString();
          var hclEntity2 = tmpWorld.Instantiate(HCL, hclName2);
          tmpWorld.hclCounter++;
          tmpWorld.m_Interactables.push(hclEntity);
          tmpWorld.m_Interactables.push(hclEntity2);
        });
      } else if (
        this.hydrogenCounter === 0 &&
        this.oxygenCounter === 0 &&
        this.h2oCounter == 1 &&
        this.ch4Counter == 0 &&
        this.carbonCounter == 0 &&
        this.chlorineCounter == 0 &&
        this.co2Counter == 1 &&
        this.h2co3Counter == 0
      ) {
        //H2CO3
        this.dingSound.play(0, 0, 1);

        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name) {
            tmpWorld.m_Interactables.splice(i, 1);
            break;
          }
        }

        var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
        newBeakerEntity.position.set(0, 0.1, 0);
        tmpWorld.m_Interactables.push(newBeakerEntity);
        (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.Destroy();
        this.m_BeakerModelEntity.Destroy();

        newBeakerEntity.m_BeakerModelEntity.m_Promise.then(() => {
          var h2co3Name = "H2CO3 Molecule " + tmpWorld.h2co3Counter.toString();
          var h2co3Entity = tmpWorld.Instantiate(H2CO3, h2co3Name);
          tmpWorld.h2co3Counter++;
          tmpWorld.m_Interactables.push(h2co3Entity);
        });
      } else if (
        this.hydrogenCounter === 0 &&
        this.oxygenCounter === 0 &&
        this.h2oCounter == 0 &&
        this.ch4Counter == 0 &&
        this.carbonCounter == 0 &&
        this.chlorineCounter == 0 &&
        this.co2Counter == 0 &&
        this.h2co3Counter == 1
      ) {
        //H2O + CO2
        this.dingSound.play(0, 0, 1);

        for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
          if (tmpWorld.m_Interactables[i].m_Name == this.name) {
            tmpWorld.m_Interactables.splice(i, 1);
            break;
          }
        }

        var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
        newBeakerEntity.position.set(0, 0.1, 0);
        tmpWorld.m_Interactables.push(newBeakerEntity);
        (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

        this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
        this.m_Rigidbody.m_Mesh.dispose();
        this.Destroy();
        this.m_BeakerModelEntity.Destroy();
        newBeakerEntity.m_BeakerModelEntity.m_Promise.then(() => {
          var h2oName = "H2O Molecule " + tmpWorld.h2oCounter.toString();
          var h2oEntity = tmpWorld.Instantiate(H2O, h2oName);
          tmpWorld.h2oCounter++;
          var co2Name = "CO2 Molecule " + tmpWorld.co2Counter.toString();
          var co2Entity = tmpWorld.Instantiate(CO2, co2Name);
          tmpWorld.co2Counter++;
          tmpWorld.m_Interactables.push(h2oEntity);
          tmpWorld.m_Interactables.push(co2Entity);
        });
      } else {
        //kaboom sound + particles + fade beaker
        if (!this.playedKaboom) {
          this.kaboomSound.play(0, 0, 1);
          this.playedKaboom = true;
          this.createParticles("assets/textures/fireparticle.png");
        }

        let beakerNode: AbstractMesh;
        beakerNode = this.m_Rigidbody.m_Mesh.parent as AbstractMesh;
        beakerNode.setParent(null);
        tmpWorld.m_TransformWidget.m_DraggablePicked = false;
        tmpWorld.m_TransformWidget.m_CameraToPickedTargetLine.setEnabled(false);
        var beakerMesh =
          this.m_BeakerModelEntity.m_Model.m_Mesh.getChildMeshes()[0];
        if (beakerMesh.visibility >= 0) {
          beakerMesh.visibility -= 0.01;
        } else {
          for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
            if (tmpWorld.m_Interactables[i].m_Name == "Beaker") {
              tmpWorld.m_Interactables.splice(i, 1);
              break;
            }
          }
          var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
          newBeakerEntity.position.set(0, 0.1, 0);
          tmpWorld.m_Interactables.push(newBeakerEntity);
          (this.m_ECS as TmpWorld).m_Beaker = newBeakerEntity;

          this.kaboomSound.stop();
          this.kaboomParticleSystem.stop();
          this.m_Rigidbody.m_Mesh.physicsImpostor.dispose();
          this.m_Rigidbody.m_Mesh.dispose();
          this.Destroy();
          this.m_BeakerModelEntity.Destroy();
        }
      }
    }
  }
}

export class BeakerModel extends Entity {
  /**
   * @brief The model component for the Beaker molecule.
   */
  m_Model: Model;

  /**
   * @brief A promise for loading the Beaker model.
   */
  m_Promise: Promise<ISceneLoaderAsyncResult>;
  /**
   * @brief Initializes the entity by loading and displaying the Beaker model.
   */
  Init(): void {
    // Add a Model component for the Beaker
    this.m_Model = this.AddComponent(Model);
    this.m_Model.m_AssetPath = "assets/models/beaker.glb";

    // Load the Beaker model and store the promise for future use
    this.m_Promise = this.m_Model.LoadModel().then((result) => {
      result.meshes.forEach((mesh) => {
        mesh.isPickable = false;
      });
      return result;
    });
  }

  /**
   * @brief Empty method to satisfy the abstract class Entity.
   */
  Update(): void {}
}
