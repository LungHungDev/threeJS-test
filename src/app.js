import * as THREE from "three";
import {
  Scene,
  WebGLRenderer,
  Vector3,
  PerspectiveCamera,
  PCFSoftShadowMap,
  DirectionalLight,
  DirectionalLightHelper,
  AmbientLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./app.scss";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

/** @type {HTMLElement} */
let monitorPanel;
const renderer = new WebGLRenderer({ alpha: true, antialias: true });

const scene = new Scene();
// scene.background = new THREE.Color(0x282c34)

/** @type {PerspectiveCamera} */
let camera;
/** @type {OrbitControls} */
let controls;
// /** @type {THREE.Group<THREE.Object3DEventMap>} */
// let object
// /** @type {THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhongMaterial, THREE.Object3DEventMap>[]} */
// const planes = []
const group = new THREE.Group();
/** @type {THREE.Points} */
let points

// const loader = new FBXLoader()
// loader.load('assets/Cyberpunk/Kitbash3d_CyberpunkProps-Native.FBX', obj => {
//   const modelScale = 0.5
//   obj.scale.set(modelScale, modelScale, modelScale)
//   object = obj
//   scene.add(obj)
// })

window.onload = () => {
  monitorPanel = document.getElementById("monitorPanel");

  const { innerWidth, innerHeight } = window;
  camera = new PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 2000);
  // camera = new OrthographicCamera(40, innerWidth / innerHeight, 0.1, 2000)

  renderer.setClearColor(0x00ffff, 0);
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  // controls.enabled = false

  scene.add(
    camera,
    ...LightMaker()
    // GroundMaker()
  );
  camera.position.set(-8, 162, -38);
  camera.lookAt(scene.position);

  catchBtnEvent();
  animate();
  load2DTextureCase()
};

// 初始化目标位置
/** @type {Vector3|undefined} */
let startPosition; // = new THREE.Vector3(5, 5, 5);
/** @type {Vector3|undefined} */
let targetPosition; // = new THREE.Vector3(0, 0, 0);
// const duration = 2000; // 2秒
const moveValue = 1;

function animate() {

  if (group.children.length > 0) {
    group.children.forEach(point => {
      if (point instanceof THREE.Mesh) {
        point.rotation.x += Math.floor(Math.random() * 1000) / 10000 / 20
        point.rotation.z += Math.floor(Math.random() * 1000) / 10000 / 10
      }
    })
    group.rotation.z -= 0.0005
  }
  
  if (monitorPanel) {
    const { x, y, z } = camera.position;
    monitorPanel.innerText = `${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)}`;
  }

  if (startPosition && targetPosition) {
    let isLoop = false;

    if (Math.abs(targetPosition.x - camera.position.x) >= moveValue) {
      isLoop = true;
      camera.position.x +=
        targetPosition.x > camera.position.x ? moveValue : -moveValue;
    }
    if (Math.abs(targetPosition.y - camera.position.y) >= moveValue) {
      isLoop = true;
      camera.position.y +=
        targetPosition.y > camera.position.y ? moveValue : -moveValue;
    }
    if (Math.abs(targetPosition.z - camera.position.z) >= moveValue) {
      isLoop = true;
      camera.position.z +=
        targetPosition.z > camera.position.z ? moveValue : -moveValue;
    }

    if (isLoop) {
      if (controls.enabled) controls.enabled = false
    } else {
      startPosition = targetPosition = undefined;
      controls.enabled = true
    }
  }
  
  // 更新控制器
  controls.update();
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
}

function catchBtnEvent() {
  const lookPositionStack = [
    [-8, 162, -38],
    [151, 17, 87],
    [106, 86, -17]
  ];
  lookPositionStack.forEach((pos, index) => {
    const btn = document.getElementById(`btn${index + 1}`);
    if (!btn) throw new Error(`btn${index} element not found.`);
    btn.onclick = () => {
      startPosition = camera.position;
      targetPosition = new Vector3(pos[0], pos[1], pos[2]);
    };
  });
  const btn4 = document.getElementById('btn4') // zoomInOut()
  const btn5 = document.getElementById('btn5') // zoomInOut()
  btn4.onclick = () => zoomInOut(true)
  btn5.onclick = () => zoomInOut(false)
}

function zoomInOut(isIn) {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction)

  // 計算新的坐標
  const normalizedDirection = direction.clone().normalize(); // 歸一化方向向量
  const displacement = normalizedDirection.multiplyScalar(isIn ? 160 : -160); // 按距離縮放
  const newPoint = camera.position.clone().add(displacement); // 加到起點上
  startPosition = camera.position
  targetPosition = newPoint
  
  // camera.position.lerp(direction, 0.6 * (isIn ? 1 : -1))
}

/** 製造光線 */
function LightMaker() {
  const lightColor = 0xffffff
  const directionalLight = new DirectionalLight(lightColor, 2);
  // directionalLight.position.set(0, 0, -100)
  directionalLight.position.set(100, 100, 0)
  // const directionalLightHelper = new DirectionalLightHelper(directionalLight);
  
  const lightColor2 = 0xfff714
  const directionalLight2 = new DirectionalLight(lightColor2, 2);
  directionalLight2.position.set(100, 0, -100)
  // const directionalLightHelper2 = new DirectionalLightHelper(directionalLight2);

  // 創建環境光
  const ambientLight = new AmbientLight(0x404040, 1.5);

  return [
    directionalLight,
    // directionalLightHelper,
    directionalLight2,
    // directionalLightHelper2,
    ambientLight,
    // lightSphere
  ];
}

// function GroundMaker() {
//   const geometry = new PlaneGeometry(100, 100, 1, 1)
//   const material = new ShadowMaterial({ opacity: 0.4 })

//   const ground = new Mesh(geometry, material)
//   ground.castShadow = true
//   ground.receiveShadow = true
//   ground.rotation.set(-Math.PI/2, 0, 0)
//   ground.position.set(0, -3.05, 0)

//   return ground
// }

function load2DTextureCase() {
  // 加载图片纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/movement.png");
  // 创建平面几何体
  const geometry = new THREE.PlaneGeometry(2, 2);

  // 创建材质并应用纹理
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const flatCount = 400
  const stage = 30

  // 建立pick的位置陣列
  const positions = []
  for(let j = 0; j < flatCount; j++) {
    const x = (Math.floor(Math.random() * (flatCount / 2 - 0 + 1)) - flatCount / 4) * 1.4
    const y = (Math.floor(Math.random() * (flatCount / 2 - 0 + 1)) - flatCount / 4) * 1.4

    const zPoints = []
    for (let k = 0; k < stage; k++) {
      const z = k * 10 - 50 - Math.floor(Math.random() * 100) / 10 - 100
      zPoints.push(z)
      positions.push([x, y, z])
    }
    const points = [];
    points.push(new THREE.Vector3(x, y, zPoints[0]));
    points.push(new THREE.Vector3(x, y, zPoints[zPoints.length - 1]));
    const material = new THREE.LineBasicMaterial({ color: 0xfff714, transparent: true, opacity: 0.2, linewidth: 0.3 });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    group.add(new THREE.Line(geometry, material))
  }
  
  // 生成pick
  for(let i = 0; i < flatCount * stage; i++) {
    // 创建网格并添加到场景中
    const point = new THREE.Mesh(geometry, material);
    const position = positions[i]
    point.position.set(position[0], position[1], position[2])
    point.rotation.x = Math.floor(Math.random() * 100 * 2) / 100
    point.rotation.y = Math.floor(Math.random() * 100 * 2) / 100
    point.rotation.z = Math.floor(Math.random() * 100 * 2) / 100
    group.add(point)
  }
  scene.add(group)
}
