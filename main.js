import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as TWEEN from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



const loader = new GLTFLoader();
const scene = new THREE.Scene();


// Replace the perspective camera with an orthographic camera
const aspect = window.innerWidth / window.innerHeight;


const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);

// Set camera position
const cameraInitialPosition = new THREE.Vector3(0, 4.3, 5.5);
const cameraInitialRotation = new THREE.Euler(-Math.PI / 6, 0, 0);

camera.position.copy(cameraInitialPosition);
// // Set a point where the camera looks at
camera.rotation.copy(cameraInitialRotation);

const canvas = document.getElementById("canvas");

const renderer = new THREE.WebGLRenderer( {
    canvas: canvas,
    antialias: true,
    alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap



    // const controls = new OrbitControls(camera, canvas);
    // controls.enableDamping = true;
    // controls.enableZoom = true;

document.addEventListener('keypress', (event) => { // Reads out camera position
    if (event.key === "Enter")
    {
        console.log(`Camera position: ${camera.position.x}, ${camera.position.y}, ${camera.position.z}, Camera rotation: ${camera.rotation.x}, ${camera.rotation.y}, ${camera.rotation.z}`)
    }
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


const light = new THREE.AmbientLight( 0xffffff, 0.05 );
// scene.add( light );

const point_light = new THREE.PointLight( 0xffffff, 5, 0, 0.5 );
point_light.position.set( 0, 2.9, 0 );
scene.add( point_light );  

// const helper = new THREE.CameraHelper( point_light.shadow.camera );
// scene.add( helper );

function addGlowTorus(object) {
    const torusGeometry = new THREE.TorusGeometry(0.03, 0.007, 16, 48);
    const torusMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { type: "c", value: new THREE.Color(0xffffff) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;

            void main() {
                vNormal = normalize(normalMatrix * normal);
                vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -viewPosition.xyz;
                gl_Position = projectionMatrix * viewPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            uniform vec3 glowColor;

            void main() {
                float intensity = pow(0.6 - dot(vNormal, vViewPosition), 2.0);
                gl_FragColor = vec4(glowColor * intensity, 1.0);
            }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const glowTorus = new THREE.Mesh(torusGeometry, torusMaterial);
    glowTorus.position.copy(object.position);
    glowTorus.rotation.set(Math.PI/2,0,0);
    scene.add(glowTorus);
}

let worldModel; 
const clickableObjects = []; // Store all child objects here for raycasting
let nayaKeyboards;
let arcPulse;
let exoTouch;
let mozaik;
let gamongus;
loader.load( './models/WT.glb', function ( world ) {
    worldModel = world.scene;
    scene.add(worldModel);

    preloader.style.display = 'none'; // Hide preloader
    landingPage.style.opacity = 1; // Show landing page
    setTimeout(() => {
        document.getElementById('welcomeTitle').classList.add('animate');
        const typingDuration = 3500; // Match the typing animation duration (3s)
        
        setTimeout(() => {
            document.getElementById('startButton').classList.add('show');
        }, typingDuration); 

        setTimeout(() => {document.getElementById('madeBy').classList.add('animate');}, 2000);

    }, 1000); // Add a 500ms delay after preloader finishes

    console.log(worldModel);
    nayaKeyboards = world.scene.children.find((child) => { return child.name === "Keyboards" });
    nayaKeyboards.cameraPosition = new THREE.Vector3(1.1357178368030407, 1.818500052382477, 0.22341896339374923);
    nayaKeyboards.cameraRotation = new THREE.Euler(-0.8183318751767803, -0.5803659001171946, -0.5298317237830532);
    nayaKeyboards.userData.originalPosition = nayaKeyboards.position.clone();
    nayaKeyboards.userData.originalRotation = nayaKeyboards.rotation.clone();

    arcPulse = world.scene.children.find((child) => { return child.name === "Arc"});
    arcPulse.cameraPosition = new THREE.Vector3(-0.32453536194005284, 1.3469273947136124, -0.05871204806531494);
    arcPulse.cameraRotation = new THREE.Euler(-0.6043801188381123, 0.04555737051256885, 0.03144005450442549);
    arcPulse.userData.originalPosition = arcPulse.position.clone();
    arcPulse.userData.originalRotation = arcPulse.rotation.clone();

    exoTouch = world.scene.children.find((child) => { return child.name === "Exotouch"});
    exoTouch.cameraPosition = new THREE.Vector3(-0.8562164349739319, 2.9073474169624687, -0.04643164641077946);
    exoTouch.cameraRotation = new THREE.Euler(-0.6388246061928632, 0.592805752136705, 0.3933271247396201);
    exoTouch.userData.originalPosition = exoTouch.position.clone();
    exoTouch.userData.originalRotation = exoTouch.rotation.clone();

    
    mozaik = world.scene.children.find((child) => { return child.name === "Coasters"});
    mozaik.cameraPosition = new THREE.Vector3(-0.9570724304040399, 1.6353095804542224, 2.2482848550641825);
    mozaik.cameraRotation = new THREE.Euler(-0.7879492606979157, -0.33295960801367536, -0.317406357724351);
    mozaik.userData.originalPosition = mozaik.position.clone();
    mozaik.userData.originalRotation = mozaik.rotation.clone();

    gamongus = world.scene.children.find((child) => { return child.name === "Gamongus"});
    gamongus.cameraPosition = new THREE.Vector3(0.17460133489092128, 1.9064901488532007, -1.0722653170302845);
    gamongus.cameraRotation = new THREE.Euler(-0.3479231710494397, -0.3305723127522177, -0.11717990733562156);
    gamongus.userData.originalPosition = gamongus.position.clone();
    gamongus.userData.originalRotation = gamongus.rotation.clone();

    clickableObjects.push(gamongus);
    clickableObjects.push(mozaik);
    clickableObjects.push(exoTouch);
    clickableObjects.push(nayaKeyboards);
    clickableObjects.push(arcPulse);

    clickableObjects.forEach((object) => {
        addGlowTorus(object);
    });

    mozaik.children.forEach(element => {
        element.cameraPosition = new THREE.Vector3(-0.9570724304040399, 1.6353095804542224, 2.2482848550641825);
        element.cameraRotation = new THREE.Euler(-0.7879492606979157, -0.33295960801367536, -0.317406357724351);
        element.userData.originalPosition = element.position.clone();
        element.userData.originalRotation = element.rotation.clone();
        clickableObjects.push(element);
    });
    });

startButton.addEventListener('click', () => { // when clicking the start button
    // Hide landing page and show canvas
    landingPage.style.opacity = 0;
    setTimeout(() => {
        landingPage.style.display = 'none';
        canvas.style.display = 'block'; // Display the canvas
    }, 500); // Match transition duration
});


    function showTextContainer(containerId) {
        // Hide all text containers first
        document.querySelectorAll('.textContainer').forEach(container => {
            container.classList.remove('active');
            container.classList.add('inactive');
        });
    
        // Show the specific container
        const textContainer = document.getElementById(containerId);
        if (textContainer) {
            textContainer.classList.remove('inactive');
            textContainer.classList.add('active');
        }
    }
    
    function splitScreenWithText(containerId) {
        // Crop the canvas and slide in the specific text container
        document.getElementById("leftText").classList.add('hidden');
        showTextContainer(containerId);
        canvas.style.transition = "clip-path 2s ease, transform 2s ease";
        canvas.style.clipPath = "inset(0 0% 0 0)";
        canvas.style.transform = "translateX(-15%)";
    
    }
    
    function resetFullScreen() {
        // Reset the canvas and slide out all text containers
        canvas.style.transition = "clip-path 1.5s ease, transform 1.5s ease";
        canvas.style.clipPath = "inset(0 0 0 0)";
        canvas.style.transform = "translateX(0)";
        setTimeout(() => {document.getElementById("leftText").classList.remove('hidden'); }, 1000);
    
        document.querySelectorAll('.textContainer').forEach(container => {
            container.classList.remove('active');
            container.classList.add('inactive');
        });
    }
    



const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hoveredObject = null; 
const hoverColor = 0xEEEEEE; 

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const objectUnderMouse = intersects[0].object;
            if (objectUnderMouse != null) {
                if ((hoveredObject == null || hoveredObject.parent != objectUnderMouse.parent)) {
                highlightGroup(objectUnderMouse);
                }
            }
            hoveredObject = objectUnderMouse;
    }
    else if (hoveredObject) {
        resetGroupColor(hoveredObject);
            hoveredObject = null;
    }
});
// To highlight group
function highlightGroup(group) {
  group.parent.traverse((child) => {
    if (child.isMesh && child.material.color.getHex() != hoverColor && mouseMovement == "initial") {
        child.userData.originalColor = child.material.color.getHex(); // Store original color
        child.material.color.setHex(hoverColor);
    }
  });
}

// Reset group color
function resetGroupColor(group) {
    group.parent.traverse((child) => {
      if (child.isMesh && child.userData.originalColor) {
        child.material.color.setHex(child.userData.originalColor); // Reset to original color

        delete child.userData.originalColor; // Clear after resetting
      }
    });
  }

let mouseMovement = "initial";
window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        // Trigger a behavior for the whole keyboard (group) when one of its meshes is clicked
        if (mouseMovement == "initial") {
            if (clickedObject.name.includes("KB")) InteractWithObject(nayaKeyboards);            
            if (clickedObject.name.includes("AP")) InteractWithObject(arcPulse);            
            if (clickedObject.name.includes("EXO")) InteractWithObject(exoTouch);
            if (clickedObject.name.includes("Coaster")) InteractWithObject(clickedObject);
            if (clickedObject.name.includes("Gamongus")) InteractWithObject(gamongus);
        }
    }
    if (mouseMovement != "initial") { // if the click doesn't intersect with the object
        ReturnCameraToInitial();
        switch (mouseMovement) {
            case 'Keyboards':
                ReturnObjectToPosition(nayaKeyboards);
                break;
            case 'Arc':
                ReturnObjectToPosition(arcPulse);
                break;            
            case 'Exotouch':
                ReturnObjectToPosition(exoTouch);
                break;
            case 'Coasters':
                ReturnObjectToPosition(mozaik);
                break;
            case 'Gamongus':
                ReturnObjectToPosition(gamongus);
                break;
            default:
                ReturnObjectToPosition(interactedObjects[interactedObjects.length-1])
                console.log('Unknown interaction type');
            }
    }
});

let cameraToInitialTween;
function ReturnCameraToInitial() {

    cameraToInitialTween = new TWEEN.Tween({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        rotationX: camera.rotation.x,
        rotationY: camera.rotation.y,
        rotationZ: camera.rotation.z,
        })
        .to({ x: cameraInitialPosition.x, y: cameraInitialPosition.y, z: cameraInitialPosition.z, rotationX: cameraInitialRotation.x, rotationY: cameraInitialRotation.y, rotationZ: cameraInitialRotation.z}, 2000) // Move over 2 seconds
        .easing(TWEEN.Easing.Cubic.InOut) // Smooth easing
        .onStart(() => mouseMovement = "initial")
        .onUpdate(function (object) {
            camera.position.set(object.x, object.y, object.z);
            camera.rotation.set(object.rotationX, object.rotationY, object.rotationZ);
        })
        .start()

}

// General function
let objectToPositionTween;
function ReturnObjectToPosition(item)
{
    resetFullScreen();
    interactedObjects.push("initial");
    objectToPositionTween = new TWEEN.Tween({
        x: item.position.x,
        y: item.position.y,
        z: item.position.z,
        rotationX: item.rotation.x,
        rotationY: item.rotation.y,
        rotationZ: item.rotation.z,
        })
        .to({ x: item.userData.originalPosition.x, y: item.userData.originalPosition.y, z: item.userData.originalPosition.z, rotationX: item.userData.originalRotation.x, rotationY: item.userData.originalRotation.y, rotationZ: item.userData.originalRotation.z}, 1000) // Move over 2 seconds
        .easing(TWEEN.Easing.Cubic.InOut) // Smooth easing
        .onStart(() => mouseMovement = "initial")
        .onUpdate(function (object) {
            item.position.set(object.x, object.y, object.z);
            item.rotation.set(object.rotationX, object.rotationY, object.rotationZ);
        })
        .start()
    }

    // Generic function
    let interactWithObjectTween;
    let cameraToObjectTween;
    let interactedObjects = [];
function InteractWithObject(item) {
    console.log(item.name);
    if (item.name.includes("Coaster")) splitScreenWithText("Coasters"); else splitScreenWithText(item.name);
    interactedObjects = [];
    cameraToObjectTween = new TWEEN.Tween({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        rotationX: camera.rotation.x,
        rotationY: camera.rotation.y,
        rotationZ: camera.rotation.z,
        })
        .to({ x: item.cameraPosition.x, y: item.cameraPosition.y, z: item.cameraPosition.z, rotationX: item.cameraRotation.x, rotationY: item.cameraRotation.y, rotationZ: item.cameraRotation.z}, 2000) // Move over 2 seconds
        .easing(TWEEN.Easing.Cubic.InOut) // Smooth easing
        .onStart(() => {mouseMovement = "in motion"})
        .onUpdate(function (object) {
            camera.position.set(object.x, object.y, object.z);
            camera.rotation.set(object.rotationX, object.rotationY, object.rotationZ);
        })
        .start()
    
        interactWithObjectTween = new TWEEN.Tween(item.position)
        .to({ y: item.userData.originalPosition.y + 0.2 }, 2000) // Move over 2 seconds
        .easing(TWEEN.Easing.Cubic.InOut) // Smooth easing
        .onComplete(() => {mouseMovement = item.name; 
            interactedObjects.push(item);})
        .start()
}
window.addEventListener('contextmenu', (event) => { // prevents the menu from opening with right click
    event.preventDefault();
});
function RotateObject(Object) {
    Object.rotation.set(mouse.x * 1.5,Object.rotation.y, -mouse.y * 1.5);
    
}

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5, // strength
    1, // radius
    0.1 // threshold
);
const outputPass = new OutputPass();
composer.addPass(renderPass);
composer.addPass(bloomPass);
composer.addPass(outputPass);


const animate = () => {
    requestAnimationFrame(animate);
    composer.render();
    renderer.render(scene, camera);
    if (camera.position.equals(cameraInitialPosition)) // Moves the scene only in initial position
    scene.rotation.y = mouse.x * 0.02; // Adjust multiplier for desired effect
    if (interactedObjects.length > 0 && interactedObjects[interactedObjects.length-1] != "initial")
    RotateObject(interactedObjects[interactedObjects.length-1]);

    if (cameraToInitialTween != null) cameraToInitialTween.update();
    if (objectToPositionTween != null) objectToPositionTween.update();
    if (interactWithObjectTween != null) interactWithObjectTween.update();
    if (cameraToObjectTween != null) cameraToObjectTween.update();

    
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