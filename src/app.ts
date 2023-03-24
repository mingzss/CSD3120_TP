/*!*****************************************************************************
\file				app.ts
\author				Yap Ming Han
\par DP email:		m.yap@digipen.edu
\par Course:		CSD3130
\par Project:		Individual Programming Assignment
\date				27/1/2023
\brief              This file contains the web application functions for this.scene creation

\copyright	Copyright (C) 2022 DigiPen Institute of Technology.
            Reproduction or disclosure of this file or its contents without the
            prior written consent of DigiPen Institute of Technology is prohibited.
*******************************************************************************/
import {Engine} from "babylonjs";
import "babylonjs-loaders";
import { AuthoringData } from "xrauthor-loader";
import {ECS} from "./core"
import { ControllerDrag } from "./core/Features/ControllerDrag";
import {TmpWorld} from "./worlds/TmpWorld"

/*
    App class representing the application structure of the
    web app
*/
export class App {
    private m_Engine: Engine;             // Base Engine
    private m_Canvas: HTMLCanvasElement;  // Canvas to be drawn on
    private m_AuthoringData: AuthoringData;
    private m_ECS: ECS;

    // Constructor Method
    constructor(engine: Engine, canvas: HTMLCanvasElement, data: AuthoringData){
        this.m_Engine = engine;
        this.m_Canvas = canvas;
        this.m_AuthoringData = data;
    }

    // Asynchronous Scene Creation
    async StartUp() : Promise<ECS>{
        // To Ensure Authoring Data from XR Author is read successfully
        // console.log(this.m_AuthoringData);

        // Build and Initialize ECS
        this.m_ECS = new TmpWorld(
            this.m_Engine, 
            this.m_Canvas, 
            {
                camera:{
                    attachControl: true
                },
                defaults:{
                    skybox: true, 
                    vr: true,
                    keyboardShortcuts: true
                }
            });
        this.m_ECS.Init();
        return this.m_ECS;
    }
}

