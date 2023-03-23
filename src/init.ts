/*!*****************************************************************************
\file				index.ts
\author				Yap Ming Han
\par DP email:		m.yap@digipen.edu
\par Course:		CSD3130
\par Project:		Individual Programming Assignment
\date				27/1/2023
\brief              This file contains the main starting point of the web app

\copyright	Copyright (C) 2022 DigiPen Institute of Technology.
            Reproduction or disclosure of this file or its contents without the
            prior written consent of DigiPen Institute of Technology is prohibited.
*******************************************************************************/

import { Engine } from "babylonjs";
import { AuthoringData } from "xrauthor-loader";

import { App } from "./app";
/**
 * createXRScene
 * @param canvasID is the HTMLCanvasElement target to render the scene into
 * @param authoringData is a dict of dicts that contains various information from other XRAuthor components, 
 *                      e.g., dicts of recordingData, editingData, etc. HOWEVER, you should ignore this object for now and create
 *                      an initial scene independent of authoringData for fulfilling A3 criteria.
 */
export function createXRScene(canvasID: string, authoringData: AuthoringData)
{
    // Retrieve canvas and create new Engine
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    const engine = new Engine(canvas, true);

    // Creation of web application and Async Scene creation
    const app = new App(engine, canvas, authoringData);
    const scenePromise = app.StartUp();

    // engine.runRenderLoop(() => {
    //     scene.render();
    // })

    // Render Loop
    scenePromise.then(scene=> {
        engine.runRenderLoop(() => {
            scene.Update();
            scene.render();
        })
    })

    // Resize Event
    window.addEventListener("resize", () => {
        engine.resize();
    })
}
