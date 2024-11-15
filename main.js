import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as TWEEN from 'https://unpkg.com/@tweenjs/tween.js@25.0.0/dist/tween.esm.js';



const loader = new GLTFLoader();
const scene = new THREE.Scene();


// Replace the perspective camera with an orthographic camera
const aspect = window.innerWidth / window.innerHeight;

// const orthoSize = 5; // Adjust this value as needed to control zoom level
// const camera = new THREE.OrthographicCamera(
//   -orthoSize * aspect, // left
//   orthoSize * aspect,   // right
//   orthoSize,            // top
//   -orthoSize,           // bottom
//   0.1,                  // near
//   1000                  // far
// );


const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);

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
scene.add( light );

const point_light = new THREE.PointLight( 0xffffff, 5, 0, 0.5 );
point_light.position.set( 0, 2.9, 0 );
scene.add( point_light );  

let worldModel; 
const clickableObjects = []; // Store all child objects here for raycasting
let nayaKeyboards;
let arcPulse;
let exoTouch;
let mozaik;
loader.load( './models/WT.glb', function ( world ) {
    worldModel = world.scene;
    scene.add(worldModel);
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

    mozaik.children.forEach(element => {
        element.cameraPosition = new THREE.Vector3(-0.9570724304040399, 1.6353095804542224, 2.2482848550641825);
        element.cameraRotation = new THREE.Euler(-0.7879492606979157, -0.33295960801367536, -0.317406357724351);
        element.userData.originalPosition = element.position.clone();
        element.userData.originalRotation = element.rotation.clone();
        clickableObjects.push(element);
    });
    clickableObjects.push(mozaik);
    clickableObjects.push(exoTouch);
    clickableObjects.push(nayaKeyboards);
    clickableObjects.push(arcPulse);
    });

    function splitScreenWithText() {
        // Crop the canvas to half-width and shift the center, then show the text container
        canvas.style.transition = "clip-path 1s ease, transform 1s ease";
        canvas.style.clipPath = "inset(0 0% 0 0)";
        canvas.style.transform = "translateX(-10%)"; // Shift canvas left to center the cropped area
        textContainer.style.transition = "opacity 1s ease";
        textContainer.style.opacity = "0";
        textContainer.style.display = "block";
        setTimeout(() => {
            textContainer.style.opacity = "0.8";
        }, 10);
    }
    
    function resetFullScreen() {
        // Reset the canvas to full screen and hide the text container
        canvas.style.transition = "clip-path 1s ease, transform 1s ease";
        canvas.style.clipPath = "inset(0 0 0 0)";
        canvas.style.transform = "translateX(0)";
        textContainer.style.display = "none";
        textContainer.style.transition = "opacity 1s ease";
        textContainer.style.opacity = "0";
        setTimeout(() => {
            textContainer.style.opacity = "0.8";
        }, 10);
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
        }
    }
    if (mouseMovement != "initial") {
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
    splitScreenWithText();
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



function RotateObject(Object) {
    Object.rotation.set(mouse.x * 1.5,Object.rotation.y, -mouse.y * 1.5);
    
}


const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (camera.position.equals(cameraInitialPosition)) // Moves the scene only in initial position
    scene.rotation.y = mouse.x * 0.02; // Adjust multiplier for desired effect
    console.log(mouseMovement)
    if (mouseMovement == "Keyboards")
    {
        RotateObject(nayaKeyboards);
    }
    if (mouseMovement == "Arc")
    {
        RotateObject(arcPulse);
    }
    if (mouseMovement == "Exotouch")
    {
        RotateObject(exoTouch);
    }
    if (mouseMovement == "Coasters")
    {
        RotateObject(mozaik);
    }
    else if (interactedObjects.length > 0 && interactedObjects[interactedObjects.length-1] != "initial")
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