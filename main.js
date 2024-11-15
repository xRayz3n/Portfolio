import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';




const loader = new GLTFLoader();
const scene = new THREE.Scene();


// Replace the perspective camera with an orthographic camera
const aspect = window.innerWidth / window.innerHeight;
const orthoSize = 5; // Adjust this value as needed to control zoom level

const camera = new THREE.OrthographicCamera(
  -orthoSize * aspect, // left
  orthoSize * aspect,   // right
  orthoSize,            // top
  -orthoSize,           // bottom
  0.1,                  // near
  1000                  // far
);


// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set camera position
camera.position.set(0, 3.3, 5.5);

// Set a point where the camera looks at
camera.rotation.x = -Math.PI / 6;


const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer( {
    canvas: canvas,
    antialias: true,
    alpha: true,
});

// // Helper

// const size = 20;
//     const divisions = 20;
//     const gridHelper = new THREE.GridHelper(size, divisions);
//     scene.add(gridHelper);

//     const axesHelper = new THREE.AxesHelper(10);
//     scene.add(axesHelper);

//     let helper = new THREE.CameraHelper(camera);
//     scene.add(helper);


    // const controls = new OrbitControls(camera, canvas);
    //     controls.enableDamping = true;
    //     controls.enableZoom = true;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


const light = new THREE.AmbientLight( 0xffffff, 0.05 );
scene.add( light );

const point_light = new THREE.PointLight( 0xffffff, 10, 0, 0.5 );
point_light.position.set( 1, 1, 10 );
scene.add( point_light );  

let worldModel; 
loader.load( './models/WT.glb', function ( world ) {
    worldModel = world.scene;
    scene.add(worldModel);
} );


const gui = new GUI();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0 && window.addEventListener('click', (event))  == true) {
        const clickedObject = intersects[0].object;
        // console.log('3D Object', clickedObject);
        console.log(clickedObject.material.color.getHexString())
        const color = clickedObject.material.color.getHexString() == "ff0000" ? 0xffffff : 0xff0000;
        clickedObject.material.color.set(color);

    }
})

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates to range [-1, 1]
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (worldModel) // Checks if the model has effectively loaded
    worldModel.rotation.y = mouseX * 0.02; // Adjust multiplier for desired effect
};
animate();

// Automatic screen resize
window.addEventListener('resize', () => {
    // Update the camera
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});