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
import {createXRScene} from "./init"
import {AuthoringData, loadAuthoringData} from "xrauthor-loader"

// Call to Load Assets
loadAuthoringData("assets/water").then((data: AuthoringData) => {
    // Call XR function for XR Author
    createXRScene("renderCanvas", null);
});



