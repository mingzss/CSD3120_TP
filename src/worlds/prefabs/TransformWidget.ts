/**
    @file TransformWidget.ts
    @brief Contains the definition of the TransformWidget class, a subclass of Entity.
    It is responsible for controlling the transformation and merging/splitting of objects.
*/
import { AbstractMesh, Camera, Color3, LinesMesh, Material, MeshBuilder, PointerEventTypes, Space, StandardMaterial, SubMesh, TransformNode, Vector3 } from "babylonjs";
import {ECS, Entity, Sphere} from "../../core"
import { ProgressBar } from "./ProgressBar";
import { UIPopup} from "./UIPopup"

/**
 * @brief Represents the interact state of the widget
 */
export enum InteractState{
    None,
    Translate,
    Scale,
    Rotate
}

/**
 * @brief TransformWidget is a helper class to transform picked entities using gaze control
 */
export class TransformWidget extends Entity{

    // On Drag Properties to be saved
    m_DraggablePicked = false;
    m_DraggedObject: TransformNode;
    m_DraggedMesh: AbstractMesh;

    m_InitialPickedPoint: Vector3;
    m_InitialCameraPoint: Vector3;
    m_InitialDragObjectScale: Vector3;
    m_InitialDragObjectRotationOffset: Vector3;
    m_InitialRayLength: number;
    m_CameraToPickedTargetLine: LinesMesh;

    // Camera of Scene
    m_Camera: Camera;

    // Child Entities
    m_MiniSphere: Sphere;
    m_ProgressBar: ProgressBar;
    m_UIPopup: UIPopup;

    // Selected Mesh that can be merged/split
    m_MeshToMergeSplit : AbstractMesh;

    // Parent TransformNode of Meshes that have already merged
    m_MergedMeshes: Set<TransformNode> = new Set<TransformNode>();

    // If Picking is Enabled
    m_EnablePicking = true;

    /**
     * @brief Returns the highest level parent given a mesh
     * @param tMesh 
     * @returns Highest level parent of given mesh
     */
    GetFirstLevelParent(tMesh: AbstractMesh) : TransformNode{
        let tNode:TransformNode = tMesh;
        while(tNode.parent != null && tNode.parent != (this.m_Scene as ECS).m_Camera){
            tNode = (tNode.parent as TransformNode);
        }
        return tNode;
    }
    
    /**
     * @brief Initializes the TransformWidget Entity with initial values and events
     */
    Init(): void {

        // Retrieve scene camera
        this.m_Camera = (this.m_Scene as ECS).m_Camera;

        // Line mesh for widget
        this.m_CameraToPickedTargetLine = MeshBuilder.CreateLines("Camera To Pick-Target",{
            points: [new Vector3(0,0,0), new Vector3(1,1,1)],
            updatable: true
        }, this.m_Scene);
        this.m_CameraToPickedTargetLine.alwaysSelectAsActiveMesh = true;
        const line_mat = this.m_CameraToPickedTargetLine.material = new StandardMaterial("Camera To Pick-Target Material", this.m_Scene);
        line_mat.diffuseColor = Color3.Black();
        line_mat.backFaceCulling = false;
        line_mat.disableLighting;
        this.m_CameraToPickedTargetLine.setEnabled(false);
        this.m_CameraToPickedTargetLine.setParent(this);
        this.m_CameraToPickedTargetLine.isPickable = false;
        
        // Mini Sphere
        this.m_MiniSphere = this.AddComponent(Sphere);
        this.m_MiniSphere.m_Mesh.isPickable = false;
        this.m_MiniSphere.m_Mesh.scaling.setAll(0.1);
        this.m_MiniSphere.m_Mesh.renderingGroupId = 2;
        const sphere_mat = this.m_MiniSphere.m_Mesh.material as StandardMaterial;
        sphere_mat.disableLighting = true;
        sphere_mat.emissiveColor = Color3.Gray();
        //this.m_MiniSphere.m_Mesh.setEnabled(false);

        // Progress Bar
        this.m_ProgressBar = (this.m_Scene as ECS).Instantiate(ProgressBar, "Transform Widget Hold Bar");
        this.m_ProgressBar.setParent(this);

        // UIPopup
        this.m_UIPopup = (this.m_Scene as ECS).Instantiate(UIPopup, "UI Pop-up");
        this.m_UIPopup.setParent(this);
        this.m_UIPopup.position.set(0, 4, 0);

        // Set up observable for picking/drag behavior
        this.m_Scene.onPointerObservable.add((pointerInfo)=>{
            if (!this.m_EnablePicking) return;
            switch(pointerInfo.type){
                case PointerEventTypes.POINTERMOVE:
                    // Stop the progress bar on move
                    if (this.m_DraggedObject != null){
                        this.m_ProgressBar.OnPointerMoveOrUp(this.m_DraggedObject, true);
                    }
                    break;
                case PointerEventTypes.POINTERDOWN:
                    // Check if pickResult is valid
                    var pickResult = this.m_Scene.pick(this.m_Scene.pointerX, this.m_Scene.pointerY);
                    if (pickResult.hit && pickResult.pickedMesh != null && pickResult.pickedPoint != null){
                        // Ignore GUI planes (These cannot be set to isPickable = false else gui stops working)
                        if (pickResult.pickedMesh == this.m_UIPopup.m_Plane.m_Mesh ||
                            pickResult.pickedMesh == this.m_UIPopup.m_MergePlane.m_Mesh) return;
                        
                        // Disable other controls
                        this.m_UIPopup.m_Plane.Disable();
                        this.m_UIPopup.m_MergePlane.Disable();

                        // Store Pick Information
                        this.m_DraggablePicked = true;
                        this.m_DraggedMesh = pickResult.pickedMesh;
                        this.m_InitialPickedPoint = pickResult.pickedPoint;
                        this.m_InitialRayLength = Vector3.Distance(this.m_Camera.position, pickResult.pickedPoint);
                        const camPickedPoint = this.m_Camera.position.add(this.m_Camera.getForwardRay(1).direction.scale(this.m_InitialRayLength));
                        this.m_InitialCameraPoint = camPickedPoint;
                        this.m_DraggedObject = this.GetFirstLevelParent(this.m_DraggedMesh);

                        // Gaze control will always be looking at the selected mesh
                        //(this.m_Camera as UniversalCamera).setTarget(pickResult.pickedPoint);

                        // Store initial information for later depending on interact state
                        switch(this.m_UIPopup.m_DragState)
                        {
                            case InteractState.Translate:
                                // Parent the object to follow the camera
                                this.m_DraggedObject.setParent(this.m_Camera);
                                break;
                            case InteractState.Scale:
                                this.m_InitialDragObjectScale = this.m_DraggedObject.scaling.clone();        
                                break;
                            case InteractState.Rotate:
                                const rotation = this.m_DraggedObject.rotation.clone();
                                this.m_DraggedObject.lookAt(camPickedPoint, 0, 0, 0, Space.WORLD);
                                this.m_DraggedObject.rotation.x = Math.PI / 2 - this.m_DraggedObject.rotation.x;
                                this.m_InitialDragObjectRotationOffset = this.m_DraggedObject.rotation.subtract(rotation);
                                this.m_DraggedObject.rotation = this.m_DraggedObject.rotation.subtract(this.m_InitialDragObjectRotationOffset);
                                break;
                        }

                        // Show Line Mesh Widget
                        this.m_CameraToPickedTargetLine.setEnabled(true);
                        //this.m_MiniSphere.m_Mesh.setEnabled(true);

                        // Start Progress Bar and Set positions
                        this.m_ProgressBar.OnPickedDown(this.m_DraggedObject);
                        this.m_UIPopup.position = this.m_ProgressBar.m_OuterSpinner.position.add(new Vector3(0, 0.25, 0));

                    } else {
                        // Reset selection and drag informations
                        this.m_UIPopup.m_Plane.Disable();
                        this.m_UIPopup.m_MergePlane.Disable();
                        this.m_DraggedObject = null;
                        this.m_DraggedMesh = null;
                    }
                    break;
                case PointerEventTypes.POINTERUP:
                    // Check if pointer was down on a valid mesh before
                    if (this.m_DraggablePicked){
                        switch(this.m_UIPopup.m_DragState)
                        {
                            case InteractState.Translate:
                                // Unparent the object
                                if (this.m_DraggedObject != null){
                                    this.m_DraggedObject.setParent(null);
                                }
                                break;
                            case InteractState.Scale:
                                break;
                            case InteractState.Rotate:
                                break;
                        }

                        // Reset all drag information
                        this.m_DraggablePicked = false;
                        this.m_CameraToPickedTargetLine.setEnabled(false);
                        //this.m_MiniSphere.m_Mesh.setEnabled(false);

                        if (this.m_DraggedObject != null){
                            // Show Transformation GUI if conditions are met
                            if (this.m_ProgressBar.OnPointerMoveOrUp(this.m_DraggedObject, false)){
                                // OPEN GUI
                                this.m_UIPopup.m_Plane.Enable();
                            } else {
                                // Else check for merge/split GUI
                                const hasIntersection = this.IntersectionTest(this.m_DraggedObject).size > 0;
                                if (hasIntersection){
                                    this.m_UIPopup.position = this.m_ProgressBar.m_OuterSpinner.position.add(new Vector3(0, 0.25, 0));
                                    this.m_UIPopup.m_MergeButton.isEnabled = true;
                                    this.m_UIPopup.m_SplitButton.isEnabled = this.m_MergedMeshes.has(this.m_DraggedObject);
                                    this.m_UIPopup.m_MergePlane.Enable();
                                    this.m_MeshToMergeSplit = this.m_DraggedMesh;
                                }
                                else{
                                    // Check if its merged
                                    if (this.m_MergedMeshes.has(this.m_DraggedObject)){
                                        this.m_UIPopup.m_MergePlane.Enable();
                                        this.m_UIPopup.m_MergeButton.isEnabled = false;
                                        this.m_UIPopup.m_SplitButton.isEnabled = true;
                                        this.m_MeshToMergeSplit = this.m_DraggedMesh;
                                    } 
                                }
                            }
                            this.m_UIPopup.position = this.m_ProgressBar.m_OuterSpinner.position.add(new Vector3(0, 0.25, 0));
                            this.m_DraggedObject = null;
                        }
                    }
                    break;
            }
        });
        
        // Add observables for merging/splitting meshes
        this.m_UIPopup.m_MergeButton.onPointerClickObservable.add(()=>{
            this.MergeMeshes();
        });

        this.m_UIPopup.m_SplitButton.onPointerClickObservable.add(()=>{
            this.SplitMeshes();
        });
    }

    /**
     * The Update method of the TransformWidget.
     */
    Update(): void {
        // Check if pointer was down on a valid mesh
        if (this.m_DraggablePicked){      
            
            // Retrieve the point in front of the camera
            const pickedPoint = this.m_Camera.position.add(this.m_Camera.getForwardRay(1).direction.scale(this.m_InitialRayLength));            
            
            switch(this.m_UIPopup.m_DragState)
            {
                case InteractState.Translate:
                    // Move sphere to point
                    this.m_MiniSphere.m_Mesh.position = this.m_InitialPickedPoint;
                    break;
                case InteractState.Scale:
                    {
                        // Calculate scale offset
                        const offset = pickedPoint.subtract(this.m_InitialCameraPoint).scale(1);
                        this.m_DraggedObject.scaling = this.m_InitialDragObjectScale.add(offset);
                        this.m_MiniSphere.m_Mesh.position = pickedPoint;
                    }
                    break;
                case InteractState.Rotate:
                    {
                        // Calculate rotate offset
                        this.m_DraggedObject.lookAt(pickedPoint, 0, 0, 0, Space.WORLD);
                        this.m_DraggedObject.rotation.x = Math.PI / 2 - this.m_DraggedObject.rotation.x;
                        this.m_DraggedObject.rotation = this.m_DraggedObject.rotation.subtract(this.m_InitialDragObjectRotationOffset);        
                        this.m_MiniSphere.m_Mesh.position = pickedPoint;
                    }
                    break;
            }
            // Form Lines to connect the sphere to points of interest
            this.m_CameraToPickedTargetLine = MeshBuilder.CreateLines(
                this.m_CameraToPickedTargetLine.name,{
                    points: [
                        this.m_InitialPickedPoint,
                        pickedPoint
                    ],
                    updatable: true,
                    instance: this.m_CameraToPickedTargetLine
                }, this.m_Scene);
            
            //Loop through each pickable mesh and check for intersections with other meshes
            this.IntersectionTest(this.m_DraggedObject);
        } else {
            // Change Color of Sphere to indicate gaze click will be successful
            this.m_MiniSphere.m_Mesh.position = this.m_Camera.position.add(this.m_Camera.getForwardRay(1).direction.scale(20));
            var pickResult = this.m_Scene.pick(this.m_Scene.pointerX, this.m_Scene.pointerY);
                    if (pickResult.hit && pickResult.pickedMesh != null && pickResult.pickedPoint != null){
                        if (pickResult.pickedMesh == this.m_UIPopup.m_Plane.m_Mesh ||
                            pickResult.pickedMesh == this.m_UIPopup.m_MergePlane.m_Mesh) return;
                        (this.m_MiniSphere.m_Mesh.material as StandardMaterial).emissiveColor = Color3.Red();
                    } else {
                        (this.m_MiniSphere.m_Mesh.material as StandardMaterial).emissiveColor = Color3.Gray();
                    }
        }

        // Update the progress bar
        this.m_ProgressBar.Update();
    }
   
    /**
     * @brief Function that merges all mesh that intersects with m_MeshToMergeSplit
     * @returns void
     */
    MergeMeshes(){

        // Retrieve high level parent and perform intersection tests
        const tNode1 = this.GetFirstLevelParent(this.m_MeshToMergeSplit);
        const allIntersections = this.IntersectionTest(tNode1);
        if (allIntersections.size == 0) return;

        if (!this.m_MergedMeshes.has(tNode1)){

            // If this object was not merged before, create a new parent and parent both under this parent
            const newParent = new TransformNode("Merged Parent", this.m_Scene);
            newParent.position.setAll(0);

            // Calculate new parent position inbtwn all meshes
            newParent.position = newParent.position.add(tNode1.position);

            allIntersections.forEach((tNodeInt)=>{
                newParent.position = newParent.position.add(tNodeInt.position);
            });
            
            newParent.position = newParent.position.scale(1.0 / (allIntersections.size + 1));

            // Parent all intersected mesh under this parent
            tNode1.setParent(newParent);

            allIntersections.forEach((tNodeInt)=>{
                tNodeInt.setParent(newParent);

                // Draw a line to show they are bound tgt
                const binding = MeshBuilder.CreateLines("Binding",{
                    points: [tNode1.getAbsolutePosition(), tNodeInt.getAbsolutePosition()],
                }, this.m_Scene);
                binding.isPickable = false;

                // To prevent bounding box from showing
                binding.getBoundingInfo().maximum.setAll(0);
                binding.getBoundingInfo().minimum.setAll(0);
                binding.setParent(newParent);
            });

            // Add to merged set and update visuals
            this.m_MergedMeshes.add(newParent); 
            this.IntersectionTest(newParent);

        } else {

            // If this object was merged before, simply parent new intersections under this parent
            allIntersections.forEach((tNodeInt)=>{
                tNodeInt.setParent(tNode1);

                // Draw a line to show they are bound tgt
                const binding = MeshBuilder.CreateLines("Binding",{
                    points: [tNode1.getChildTransformNodes()[0].getAbsolutePosition(), tNodeInt.getAbsolutePosition()],
                }, this.m_Scene);
                binding.isPickable = false;

                // To prevent bounding box from showing
                binding.getBoundingInfo().maximum.setAll(0);
                binding.getBoundingInfo().minimum.setAll(0);
                binding.setParent(tNode1);
            });

            // update visuals
            this.IntersectionTest(tNode1);
        }

        // If Button Clicked, disable the GUI
        this.m_UIPopup.m_MergePlane.Disable();
    }

    /**
     * @brief Function that splits all meshes that were merged previously
     * @returns void
     */
    SplitMeshes(){

        // Get the highest level parent
        const tNode1 = this.GetFirstLevelParent(this.m_MeshToMergeSplit);

        // Deparent all nodes except for the binding lines
        tNode1.getChildren().forEach((node)=>{
            if (node.name == "Binding"){
                // Remove the binding lines
                node.dispose();
            } else {
                // Unparent the direct children
                const child = node as TransformNode;
                child.setParent(null);
                this.IntersectionTest(child);
            }
        });

        // Remove from set and throw parent away
        this.m_MergedMeshes.delete(tNode1);
        tNode1.dispose();

        // If Button Clicked, disable the GUI
        this.m_UIPopup.m_MergePlane.Disable();
    }

    /**
     * @brief Function that performs intersection test with all meshes under a parent with the whole scene
     * @returns void
     */
    IntersectionTest(tNode: TransformNode): Set<TransformNode>{
        // Initial intersection information
        const intersectingNodes = new Set<TransformNode>();
        let intersected = false;

        // Only compare with pickable and enabled meshes
        this.m_Scene.meshes.filter(
                mesh=> mesh.isPickable && mesh.isEnabled() &&
                mesh !== this.m_UIPopup.m_Plane.m_Mesh && 
                mesh !== this.m_UIPopup.m_MergePlane.m_Mesh 
            ).forEach((mesh) => {

            // Loop through the child meshes and check for intersection
            tNode.getChildMeshes().forEach((nodeMesh)=>{
                mesh.showBoundingBox = false;

                // Check if its under the same parent
                const mesh1Parent = this.GetFirstLevelParent(mesh);

                // If not under the same parent, or not same object and intersecting
                if (mesh1Parent !== tNode &&
                    mesh !== nodeMesh && mesh.intersectsMesh(nodeMesh, true, true)) {
                        intersectingNodes.add(mesh1Parent);
                        intersected = true;
                        //console.log("Intersected: " + mesh.name + ", " + nodeMesh.name);
                        //console.log("Parents: " + mesh1Parent.name + ", " + tNode.name);
                }
            });
        });

        // Loop through the parent and set the bounding box visibility accordingly
        tNode.getChildMeshes().forEach((nodeMesh)=>{
            nodeMesh.showBoundingBox = intersected;
        });

        // Loop through all intersecting nodes and update the visuals
        intersectingNodes.forEach((nodeMesh)=>{
            nodeMesh.getChildMeshes().forEach((mesh)=>{
                mesh.showBoundingBox = true;
            })
        })

        return intersectingNodes;
    }
}