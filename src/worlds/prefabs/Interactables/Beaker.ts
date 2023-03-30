/**
    @file Beaker.ts
    @brief Class representing an entity that loads and displays a 3D model of Beaker.
*/
import { AbstractMesh, ActionManager, Color4, ExecuteCodeAction, ParticleSystem, SixDofDragBehavior, Sound, Texture, Vector3 } from "babylonjs";
import { Entity, Model } from "../../../core"
import { TmpWorld } from "../../TmpWorld";
import { CH4 } from "../Molecules/CH4";
import { CO2 } from "../Molecules/CO2";
import { H2O } from "../Molecules/H2O";
import { HCL } from "../Molecules/HCL";

export class Beaker extends Entity {

    /**
     * @brief The model component for the Beaker molecule.
     */
    m_Model: Model;

    /**
     * @brief A promise for loading the Beaker model.
     */
    m_Promise: Promise<void>
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

    shakecounter: number;
    reacted: boolean;
    kaboomSound: Sound;
    playedKaboom: boolean;
    kaboomParticleSystem: ParticleSystem;
    /**
     * @brief Initializes the entity by loading and displaying the Beaker model.
     */
    Init(): void {
        // Add a Model component for the Beaker
        this.m_Model = this.AddComponent(Model);
        this.m_Model.m_AssetPath = "assets/models/beaker.glb";

        this.carbonCounter = 0;
        this.chlorineCounter = 0;
        this.hydrogenCounter = 0;
        this.oxygenCounter = 0;

        this.h2oCounter = 0;
        this.ch4Counter = 0;
        this.co2Counter = 0;
        this.hclCounter = 0;

        this.shakecounter = 0;
        this.reacted = false;
        this.playedKaboom = false;
        this.kaboomSound = new Sound("kaboom", "assets/sounds/Explosion.wav", this.m_Scene, null, { loop: false, autoplay: false });
        // Load the Beaker model and store the promise for future use
        this.m_Promise = this.m_Model.LoadModel();
        this.m_Promise.then(() => {
            this.m_Model.m_Mesh.scaling.setAll(0.25);
            console.log("in init: " + this.m_Model.m_Mesh.getChildMeshes()[0].name);
            this.actionManager = this.m_Model.m_Mesh.getChildMeshes()[0].actionManager = new ActionManager(this.m_Scene);
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

            })
        })
    }

    /**
     * @brief Empty method to satisfy the abstract class Entity.
     */
    Update(): void {
        if (this.shakecounter > 6) {
            //if correct => play sound + spawn new molecule + dispose beaker
            //if wrong => play sound + explosion particles + fade beaker
            console.log(this.m_Model.m_Mesh.name);
            console.log(this.m_Model.m_Mesh.getChildMeshes(true)[0].name);
            var atomsInBeaker = this.m_Model.m_Mesh.getChildMeshes()[0].getChildTransformNodes(true);
            var tmpWorld = this.m_ECS as TmpWorld;
            atomsInBeaker.forEach((mesh) => {
                console.log("child nodes: " + mesh.name);
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
            })
            console.log(this.hydrogenCounter + " h and o: " + this.oxygenCounter + " h20:" + this.h2oCounter);
            var tmpWorld = this.m_ECS as TmpWorld;
            if (this.hydrogenCounter === 2 && this.oxygenCounter === 1 &&
                this.chlorineCounter == 0 && this.carbonCounter == 0 &&
                this.h2oCounter == 0 && this.ch4Counter == 0 &&
                this.co2Counter == 0 ) { //H2O
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
                    if (tmpWorld.m_Interactables[i].m_Name == this.name) {
                        tmpWorld.m_Interactables.splice(i, 1);
                        break;
                    }
                }
                var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
                newBeakerEntity.position.set(2, 7, 5.6);
                tmpWorld.m_Interactables.push(newBeakerEntity);

                this.m_Model.m_Mesh.dispose();
                this.dispose();

                newBeakerEntity.m_Promise.then(() => {
                    var hName = "H2O Molecule " + tmpWorld.h2oCounter.toString();
                    var h2oEntity = tmpWorld.Instantiate(H2O, hName);
                    tmpWorld.h2oCounter++;
                    var hName2 = "H2O Molecule " + tmpWorld.h2oCounter.toString();
                    var h2oEntity2 = tmpWorld.Instantiate(H2O, hName2);
                    tmpWorld.h2oCounter++;
                    Promise.all([h2oEntity.m_Promise, h2oEntity2.m_Promise]).then(() => {
                        console.log("H2O Promise: " + this.name);
                        tmpWorld.m_Interactables.push(h2oEntity);
                        tmpWorld.m_Interactables.push(h2oEntity2);

                        return;
                    });
                });

            }
            else if (this.hydrogenCounter === 2 && this.oxygenCounter === 0 &&
                this.h2oCounter == 0 && this.ch4Counter == 0 &&
                this.carbonCounter == 1 && this.chlorineCounter == 0 &&
                this.co2Counter == 0) { //CH4
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
                    if (tmpWorld.m_Interactables[i].m_Name == this.name) {
                        tmpWorld.m_Interactables.splice(i, 1);
                        break;
                    }
                }

                var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
                newBeakerEntity.position.set(2, 7, 5.6);
                tmpWorld.m_Interactables.push(newBeakerEntity);

                this.m_Model.m_Mesh.dispose();
                this.dispose();

                newBeakerEntity.m_Promise.then(() => {
                    var ch4Name = "CH4 Molecule " + tmpWorld.ch4Counter.toString();
                    var ch4Entity = tmpWorld.Instantiate(CH4, ch4Name);
                    tmpWorld.ch4Counter++;
                    ch4Entity.m_Promise.then(() => {
                        tmpWorld.m_Interactables.push(ch4Entity);
                        return;
                    });
                });
            }
            else if (this.hydrogenCounter === 0 && this.oxygenCounter === 1 &&
                this.h2oCounter == 0 && this.ch4Counter == 0 &&
                this.carbonCounter == 1 && this.chlorineCounter == 0 &&
                this.co2Counter == 0) { //CO2
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
                    if (tmpWorld.m_Interactables[i].m_Name == this.name) {
                        tmpWorld.m_Interactables.splice(i, 1);
                        break;
                    }
                }

                var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
                newBeakerEntity.position.set(2, 7, 5.6);
                tmpWorld.m_Interactables.push(newBeakerEntity);

                this.m_Model.m_Mesh.dispose();
                this.dispose();

                newBeakerEntity.m_Promise.then(() => {
                    var co2Name = "CO2 Molecule " + tmpWorld.co2Counter.toString();
                    var co2Entity = tmpWorld.Instantiate(CO2, co2Name);
                    tmpWorld.co2Counter++;
                    co2Entity.m_Promise.then(() => {
                        tmpWorld.m_Interactables.push(co2Entity);
                        return;
                    });
                });
            }
            else if (this.hydrogenCounter === 1 && this.oxygenCounter === 0 &&
                this.h2oCounter == 0 && this.ch4Counter == 0 &&
                this.carbonCounter == 0 && this.chlorineCounter == 1 &&
                this.co2Counter == 0) { //CO2
                for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
                    if (tmpWorld.m_Interactables[i].m_Name == this.name) {
                        tmpWorld.m_Interactables.splice(i, 1);
                        break;
                    }
                }

                var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
                newBeakerEntity.position.set(2, 7, 5.6);
                tmpWorld.m_Interactables.push(newBeakerEntity);

                this.m_Model.m_Mesh.dispose();
                this.dispose();

                newBeakerEntity.m_Promise.then(() => {
                    var hclName = "HCL Molecule " + tmpWorld.hclCounter.toString();
                    var hclEntity = tmpWorld.Instantiate(HCL, hclName);
                    tmpWorld.hclCounter++;
                    var hclName2 = "HCL Molecule " + tmpWorld.hclCounter.toString();
                    var hclEntity2 = tmpWorld.Instantiate(HCL, hclName2);
                    tmpWorld.hclCounter++;
                    Promise.all([hclEntity.m_Promise, hclEntity2.m_Promise]).then(() => {
                        console.log("HCL Promise: " + this.name);
                        tmpWorld.m_Interactables.push(hclEntity);
                        tmpWorld.m_Interactables.push(hclEntity2);

                        return;
                    });
                });
            }
            else {
                //kaboom sound + particles + fade beaker
                if (!this.playedKaboom) {
                    this.kaboomSound.play(0, 0, 1);
                    this.playedKaboom = true;
                    this.createParticles("assets/textures/fireparticle.png");
                }

                let beakerNode: AbstractMesh;
                beakerNode = this.m_Model.m_Mesh.parent as AbstractMesh;
                beakerNode.setParent(null);
                tmpWorld.m_TransformWidget.m_DraggablePicked = false;
                tmpWorld.m_TransformWidget.m_CameraToPickedTargetLine.setEnabled(false);
                var beakerMesh = this.m_Scene.getMeshById("Beaker");
                if (beakerMesh.visibility >= 0) {
                    beakerMesh.visibility -= 0.01;
                }
                else {
                    for (let i = 0; i < tmpWorld.m_Interactables.length; i++) {
                        if (tmpWorld.m_Interactables[i].m_Name == this.name) {
                            tmpWorld.m_Interactables.splice(i, 1);
                            break;
                        }
                    }
                    var newBeakerEntity = tmpWorld.Instantiate(Beaker, "Beaker");
                    newBeakerEntity.position.set(2, 7, 5.6);
                    tmpWorld.m_Interactables.push(newBeakerEntity);

                    this.kaboomSound.stop();
                    this.kaboomParticleSystem.stop();
                    this.m_Model.m_Mesh.dispose();
                    this.dispose();
                }
            }
        }
    }

    createParticles(filepath: string) {
        const particleSystem = new ParticleSystem("particleSystem", 5000, this.m_Scene);
        particleSystem.particleTexture = new Texture(filepath, this.m_Scene);
        particleSystem.emitter = this.getAbsolutePosition();
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
}