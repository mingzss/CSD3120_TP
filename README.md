# CSD3120-Assignment
 
## Author
Yap Ming Han
2000490

## Brief
This is a project done for CSD3120, which aims at providing an immersive experiences in a classroom setting.

I have chosen to simply target users with **Google Cardboard** to perform interactions such as:
 - Translation, Scaling, Rotation
 - Merging, Splitting of Objects

via **Gaze/Viewpoint Control**.

Reason being the **Google Cardboard** is much more accessible than having each user (students) owning their own VR controller and headsets to access the environment.

For reasons of fulfilling the criteria, I have implemented the teleportation interaction for controller users, but as this project is still targeted at **Google Cardboard** users, it is still expected for users to have an area to walk around to reach the objects just in front of them.

## Setup
Install Dependencies:
```
npm install --save babylonjs
npm install --save babylonjs-gui
npm install --save babylonjs-loaders
npm install --save node-polyfill-webpack-plugin

npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev typescript ts-loader html-webpack-plugin
npm install --save-dev xrauthor-loader copy-webpack-plugin
npm install --save-dev @types/node
```

# First Look

![This is an image](public/assets/textures/preview.png)

## Transforming Objects

![This is an image](public/assets/textures/example1.png)

Users can look at an object and move the object around by holding down the button on the Cardboard.

![This is an image](public/assets/textures/example2.png)

To toggle the transform mode between Translate/Scale/Rotate, users can look at an object and hold down the button without dragging for 1 second. A GUI will popup above the object and now they can select the mode they wish to.


## Merging and Splitting Objects

![This is an image](public/assets/textures/example3.png)

Users can merge 2 or more objects together by intersecting them and letting go of the button. They can then click on the merge icon on the left of the GUI that pops up to merge the objects into 1.


![This is an image](public/assets/textures/example4.png)

Likewise, they can click the button while looking at a merged object and split them apart by clicking on split icon on the right of the GUI that pops up.

# Code Architecture
## ECS
This project uses a very simplistic Entity-Component-System model to organize all the objects being instantiated in the scene. The files responsible for the framework can be found under the "src/core" folder of the repository.

The entity class is responsible for creating and destroying components on initialization and runtime.
(https://github.com/mingzss/CSD3130_IPA/tree/main/src/core/Entity.ts)

Example Usage:
```
import {Entity, Model} from "../../core"

export class Table extends Entity{

    /**
     * @brief Initializes the Table entity by loading its 3D model and setting its pickable attribute to false.
     */
    Init(): void {
        const model = this.AddComponent(Model);
        model.m_AssetPath = "assets/models/table.gltf";
        model.LoadModel().then(()=>{
            this.getChildMeshes().forEach((mesh)=>{
                mesh.isPickable = false;
            })
        });
    }

    /**
     * @brief Empty Update method required by the Entity class.
     */
    Update(): void {}
}
```

## Worlds and Prefabs
With the framework inplace, worlds can be created on top of the ECS to build different scenes and behaviors. Here, the project repository created and uses the VRWorld class which extends ECS to setup a VR Scene for this assignment.
(https://github.com/mingzss/CSD3130_IPA/tree/main/src/worlds/VRWorld.ts)

```
export class VRWorld extends ECS{

    // Add Objects/Prefabs here

    m_BaseEnvironment: BasicEnvironment;// Base Environment
    m_LightSource1: LightSource;        // Lighting
    m_Interactables = Array<Entity>();  // Objects
    m_TransformWidget : TransformWidget;// Transform Widget
    
    /**
     * @brief Initializes the whole scene/ECS
     */
    Init(): void {

        // Initialize camera position
        this.m_Camera.position.set(0, 2, -16.5);
        ...
    }

    /**
     * @brief Updates the whole scene/ECS
     */
    Update(): void {
        ...
    }

```

A list of all the prefabs/entity templates can be found under 
https://github.com/mingzss/CSD3130_IPA/tree/main/src/worlds.

## Misc Assets
XR Author Video:
https://github.com/mingzss/CSD3130_IPA/tree/main/assets/videos

