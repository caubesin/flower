import * as THREE from 'three';
import { useEffect } from 'react'
import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import img from './model/flower.glb'


function App() {
  const init = () => {
    let mixer;

    const clock = new THREE.Clock();
    const container = document.getElementsByClassName( 'App' )[0];

    const stats = new Stats();
    container.appendChild( stats.dom );

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xbfe3dd );
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

    const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 5, 5, 10 );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0.5, 0 );
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'js/libs/draco/gltf/' );


    const loader = new GLTFLoader();
    loader.setDRACOLoader( dracoLoader );

    const animate = function () {
      requestAnimationFrame( animate );

      const delta = clock.getDelta();

      mixer.update( delta );

      controls.update();

      stats.update();

      renderer.render( scene, camera );
    };

    loader.load( img, function ( gltf ) {
      const model = gltf.scene;
			model.position.set( 0, 1, -3 );
			model.scale.set( 10, 10, 10 );
	    scene.add( model );

      mixer = new THREE.AnimationMixer( model );
			//mixer.clipAction( gltf.animations[ 0 ] ).play();
			animate();

    }, undefined, function ( error ) {
	    console.error( error );
    } );

    window.onresize = function () {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    };
    
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="App">
      
    </div>
  );
}

export default App;
