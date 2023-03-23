// Ground
        //const ground = new GroundMesh("ground", this.scene);
        //const ground_material = new StandardMaterial("ground material", this.scene);
        //ground_material.diffuseTexture = new Texture("assets/textures/skybox", this.scene);

        // Sphere 1 Object Creation
        //const sphere1 = new Sphere(this.scene, 'Sphere 1', {diameter: 1.3});
        //sphere1.position = new Vector3(0, -4, 5); // (Abit Lower)
        //const sphere1Drag = new PointerDragBehavior(
            //{
                //dragPlaneNormal: Vector3.Backward()
            //}
        //);
        //sphere1.addBehavior(sphere1Drag);

        // multiple pointer scale
        //const multiPointScaleBehavior = new MultiPointerScaleBehavior();
        //sphere1.addBehavior(multiPointScaleBehavior);

        // 6dof pointer behavior
        //sphere1.addBehavior(new SixDofDragBehavior());

        // gizmos
        //const gizmoManager = new GizmoManager(this.scene);
        //gizmoManager.positionGizmoEnabled = true;
        //gizmoManager.rotationGizmoEnabled = true;
        //gizmoManager.scaleGizmoEnabled = true;
        //gizmoManager.boundingBoxGizmoEnabled = true;
        
        // Hello Sphere 2
        //const helloSphere = new Sphere(this.scene, "Hello Sphere", {diameter: 1});
        //helloSphere.position = new Vector3(0, 0, 5);
        //helloSphere.AddLabel(
            //1.5, 1,
            //"Hello!",
            //"white"
        //);
        //const helloSphereActionManager = helloSphere.actionManager = new ActionManager(this.scene);
        //helloSphere.actionManager.isRecursive = true;

        //const light = this.scene.getLightById("pointlight");
        //helloSphere.actionManager.registerAction(
            //new InterpolateValueAction(
                //ActionManager.OnPickDownTrigger,
                //light,
                //"diffuse",
                //Color3.Black(),
               // 1000
            //)
        //).then(
        //     new InterpolateValueAction(
        //         ActionManager.OnPickDownTrigger,
        //         light,
        //         "diffuse",
        //         Color3.White(),
        //         1000    // in 1 second
        //     )
        // );
        // helloSphere.actionManager.registerAction(
        //     new InterpolateValueAction(
        //         ActionManager.OnPickDownTrigger,
        //         helloSphere,
        //         "scaling",
        //         new Vector3(2,2,2),
        //         1000,
        //         new PredicateCondition(
        //             helloSphereActionManager,
        //             ()=>{
        //                 return light.diffuse.equals(Color3.Black());
        //             }
        //         )

        //     )
        // );
        // const otherMesh = this.scene.getMeshById("Sphere 1");
        // helloSphereActionManager.registerAction(
        //     new SetValueAction(
        //         {
        //             trigger: ActionManager.OnIntersectionEnterTrigger,
        //             parameter: {
        //                 mesh: otherMesh,
        //                 usePreciseInteraction: true
        //             },
        //         },
        //         helloSphere.mesh.material,
        //         "wireframe",
        //         true
        //    )
        // );

        // // Scene Actions
        // this.scene.actionManager = new ActionManager();
        // this.scene.actionManager.registerAction(
        //     // Customized Action:
        //     new ExecuteCodeAction(
        //         {
        //             trigger: ActionManager.OnKeyUpTrigger,
        //             parameter: "r"
        //         },
        //         ()=>{
        //             helloSphere.scaling.setAll(1);
        //             helloSphere.mesh.material.wireframe = false;
        //         }
        //     )
        // );
        

        // // Text
        // const helloPlane = new TextPlane(
        //     this.scene, 
        //     "hello text", 
        //     2.5, 1, 
        //     "Hello XR", 
        //     "purple"
        // );
        // helloPlane.textBlock.onPointerDownObservable.add(()=>{
        //     this.button_click_sound.play();
        // });

        // // interactions
        // // using behaviours:
        // const pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal: Vector3.Forward()});
        // helloSphere.addBehavior(pointerDragBehavior);
        // pointerDragBehavior.onDragStartObservable.add(evtData=>{
        //         console.log("Drag Start: Pointer ID = " + pointerDragBehavior.currentDraggingPointerId);
        //         console.log(evtData.pointerId);
        // });
        // pointerDragBehavior.onDragEndObservable.add(evtData=>{
            
        // });

        // //Adding own observables:
        // // For intersection:
        // const onIntersectObservable = new Observable<boolean>();
        // // register to update loop
        // this.scene.registerBeforeRender(function () {
        //     const isIntersecting = helloSphere.intersectsMesh(sphere1, true, true);
        //     onIntersectObservable.notifyObservers(isIntersecting)
        // });
        // helloSphere.onIntersectObservable = onIntersectObservable;
        // helloSphere.onIntersectObservable.add(
        //     isIntersecting=>{
        //         const material = helloSphere.mesh.material as StandardMaterial;
        //         if (isIntersecting){
        //             material.diffuseColor = Color3.Red();
        //         } else {
        //             material.diffuseColor = Color3.White();
        //         }
        //     }
        // )

        // // observable for custom check
        // const onDistanceChangeObservable = new Observable<number>();
        // let previousState: number = null;
        // this.scene.onBeforeRenderObservable.add(()=>{
        //     const currentState = Vector3.Distance(sphere1.position, helloSphere.position);
        //     if (currentState != previousState){
        //         console.log("Distance Updated");
        //         previousState = currentState;
        //         onDistanceChangeObservable.notifyObservers(currentState);
        //     }
        // });

        // // pushing custom observer
        // const observer = new Observer<number>(distance=>{
        //     helloSphere.label.textBlock.text = "ALOALAO";
        // }, -1);
        // onDistanceChangeObservable.observers.push(observer);

        // // coroutine
        // const addObserverCoroutine = function*() {
        //     // Stop 1st Frame
        //     yield;

        //     // Push only in 2nd Frame
        //     console.log("frame " + this.scene.getFrameId() + ": add observer");
        //     onDistanceChangeObservable.observers.push(observer);
        // };
        // this.scene.onBeforeRenderObservable.runCoroutineAsync(addObserverCoroutine());

        // // Coroutine example on delay
        // const coroutine = function*() {
        //     (async function(){
        //         await Tools.DelayAsync(2000);
        //         console.log("frame " + this.scene.getFrameId() + ": fn 1");
        //     })();
        //     yield;
        //     (async function(){
        //         await Tools.DelayAsync(2000);
        //         console.log("frame " + this.scene.getFrameId() + ": fn 2");
        //     })();
        //     yield;
        //     (async function(){
        //         console.log("frame " + this.scene.getFrameId() + ": fn 3");
        //     })();
        //     yield;
        //     (async function(){
        //         await Tools.DelayAsync(1000);
        //         console.log("frame " + this.scene.getFrameId() + ": fn 4");
        //     })();
        // }
        // this.scene.onBeforeRenderObservable.runCoroutineAsync(coroutine());

        // //this.createSkybox(this.scene);
        // //this.createVideoSkyDome(this.scene);


    // createParticles(scene: Scene)
    // {
    //     const particleSystem = new ParticleSystem("particleSystem", 1000, this.scene);
    //     particleSystem.particleTexture = new Texture("assets/textures/dwa.png", this.scene);
    //     particleSystem.emitter = new Vector3(0,0,0);
    //     particleSystem.minEmitBox = new Vector3(1,1,1);
    //     particleSystem.color1 = new Color4(1,1,1,1);
    //     particleSystem.color2 = new Color4(1,1,1,0);
    //     particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
    //     particleSystem.minSize = 1;
    //     particleSystem.maxSize = 2;
    //     particleSystem.minLifeTime = 0.3;
    //     particleSystem.maxLifeTime = 1.0;

    //     particleSystem.emitRate = 50;
    //     particleSystem.direction1 = new Vector3(-1,8,1);
    //     particleSystem.direction2 = new Vector3(1,8,-1);

    //     particleSystem.minEmitPower = 0.2;
    //     particleSystem.maxEmitPower = 0.8;
    //     particleSystem.updateSpeed = 0.01;

    //     particleSystem.gravity = new Vector3(0,-9.8,0);
    //     particleSystem.start();
    // }

    // addSounds(scene:Scene) {
    //     const music = new Sound("music", "assets/sounds/Combat_BGM.wav", this.scene, null, { loop: true, autoplay: false});
    //     this.button_click_sound = new Sound("SFX", "assets/sounds/UI_Select.wav", this.scene, null);
    // }

    // createVideoSkyDome(scene: Scene)
    // {
    //     const dome = new VideoDome("dome", "assets/videos/bridge.mp4", //this.data.video,
    //     {
    //         resolution: 32,
    //         size: 1000
    //     }, this.scene);
    // }