import * as THREE from 'three'
import './app.scss'

const width = window.innerWidth
const height = window.innerHeight

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,        // Field of view
  400 / 400,  // Aspect ratio
  .1,         // Near
  10000       // Far);
);
camera.lookAt(scene.position);
camera.position.set(0, 0, 1000);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1);
renderer.setSize(width, height);

const boxGeo = new THREE.BoxGeometry(50, 50, 50);
const boxMat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
boxMesh.position.set(-100, 100, 0);
boxMesh.castShadow = true;
scene.add(boxMesh);

const box = new THREE.BoxGeometry(60, 60, 60)
const material = new THREE.MeshLambertMaterial({ color: 0x010176 })
const cube = new THREE.Mesh(box,material)
boxMesh.position.set(-50, 100, 0);
cube.castShadow = true
scene.add(cube)

const lightSize = 250;
const pointLight = new THREE.PointLight(0xffff00, 1000, lightSize, 2);
pointLight.position.set(110, 0, 110);
pointLight.castShadow = true;
scene.add(pointLight);

// const spotLight = new THREE.SpotLight(0xffffff, 1, 1000);
// spotLight.position.set(-200, 120, 200);
// spotLight.castShadow = true;
// scene.add(spotLight);

// const ambientLight = new THREE.AmbientLight(0x404040);
// scene.add(ambientLight);
// renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);
render();

function render() {
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  cube.rotation.z += 0.01

  boxMesh.rotation.x += 0.01
  boxMesh.rotation.y += 0.01
  boxMesh.rotation.z += 0.01

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}