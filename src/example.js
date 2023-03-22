import * as THREE from 'three'

let width, height;
let camera, renderer, scene;

const position = {
  earth: {
    x: 200,
    y: 1,
    z: 0,
    theta: 0,
    traceRadius: 200
  }
};

width = window.innerWidth;
height = window.innerHeight;

scene = new THREE.Scene();
//    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
camera = new THREE.PerspectiveCamera(45,        // Field of view
  400 / 400,  // Aspect ratio
  .1,         // Near
  10000       // Far);
);
camera.lookAt(scene.position);
camera.position.set(0, 0, 1000);
scene.add(camera);

renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 1);
renderer.setSize(width, height);
renderer.shadowMapEnabled = false;

const sunGeo = new THREE.SphereGeometry(70, 128, 128);
const sunMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunMesh.position.set(0, 0, 0);
sunMesh.castShadow = true;
sunMesh.receiveShadow = false;
scene.add(sunMesh);

const boxGeo = new THREE.BoxGeometry(50, 50, 50);
const boxMat = new THREE.MeshLambertMaterial({ color: 0xfff0f0 });
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
boxMesh.position.set(-100, 100, 0);
boxMesh.castShadow = true;
scene.add(boxMesh);

const earthTraceGeo = new THREE.CircleGeometry(position.earth.traceRadius, 128, 128);
const edges = new THREE.EdgesGeometry(earthTraceGeo);
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
scene.add(line);

const earthGeo = new THREE.SphereGeometry(30, 128, 128);
const earthMat = new THREE.MeshLambertMaterial({ color: 0x0000ff });
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
earthMesh.position.set(position.earth.traceRadius, 0, 0);
earthMesh.castShadow = true;
earthMesh.receiveShadow = true;
scene.add(earthMesh);

const lightSize = 250;
const pointLight = new THREE.PointLight(0xffff00, 1000, lightSize, 2);
pointLight.position.set(110, 0, 110);
pointLight.castShadow = true;
scene.add(pointLight);

const spotLight = new THREE.SpotLight(0xffffff, 1, 1000);
spotLight.position.set(-200, 120, 200);
spotLight.castShadow = true;
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
renderer.render(scene, camera);

window.onresize = resize;

render();
document.body.appendChild(renderer.domElement);

function render() {
  // spotLightHelper.update();

  position.earth.theta += 1;
  position.earth.x = getX(0, position.earth.theta, position.earth.traceRadius);
  position.earth.y = getY(0, position.earth.theta, position.earth.traceRadius);
  earthMesh.position.set(position.earth.x, position.earth.y, 0);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

function getX(x, theta, radius) {
  return x + Math.cos((Math.PI / 180) * theta) * radius;
}

function getY(y, theta, radius) {
  return y + Math.sin((Math.PI / 180) * theta) * radius;
}

function resize() {

  const aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  //controls.handleResize();
}
