import './style.css' 
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/Addons.js';
import {ShotsManager, syncCameraWithBlender} from 'threejs-blendertools';


	//---------------------------------------  SCENE SETUP  ----------------------------------------------
 
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	const renderer = new THREE.WebGLRenderer();
	let onEnterFrame:((delta:number)=>void)|undefined;

	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	let lastTime = 0;
	renderer.setAnimationLoop( time => {
		const delta = (time - lastTime) / 1000;
		lastTime = time;
		if(onEnterFrame){
			onEnterFrame(delta);
		}
		renderer.render(scene, camera);
	})

	//---------------------------------------------------------------------------------------------------

 
	/**
	 * Demo showing how you can use the shots
	 */
	function demoCameraShots(gltf:GLTF){

		const shotsManager = new ShotsManager(gltf.cameras as THREE.PerspectiveCamera[], gltf.animations);

		//
		// Artistic Option A
		//
		shotsManager.config([
			"shot1",
			"shot2",
			"shot3"
		]);


		//
		// Artistic Option B ( you can pick any order you want)
		//
		// shotsManager.config([
		// 	"shot3",
		// 	"shot1",
		// 	"shot2"
		// ]);

		//
		// Artistic Option C (you can use less shots not necesarly all the shots you have)
		//
		// shotsManager.config([
		// 	"shot2",
		// 	"shot1", 
		// ]);

		shotsManager.play(()=>{
			alert("Cutscene completed!")
		});

		shotsManager.targetCamera = camera;

		onEnterFrame = delta => {
			shotsManager.update(delta)
		}

	}

	/**
	 * This will just sync the camera with blender. Remember to select the camera in Blender in the panel too!
	 * The camera here will move copying the position, rotation and fov from the ones in Blender.
	 */
	function demoSyncCameraWithBlender(){

		/**
		 * Sync camera with blender
		 */
		syncCameraWithBlender(camera)
	}

	//
	// Load your model that contains all the camera shot's animations.
	//
	new GLTFLoader().load('shots.glb', (gltf) => {

		gltf.scene.traverse((child) => {
			if(child instanceof THREE.Mesh){
				child.material = new THREE.MeshNormalMaterial()
			}
		})
	 
		scene.add(gltf.scene);

		//
		// ----------------  START THE DEMO ( Uncomment the one you want to demo ) ----------------------
		//
		demoCameraShots(gltf); 
		//demoSyncCameraWithBlender()
	}); 

