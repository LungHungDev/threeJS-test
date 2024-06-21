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
import Stats from 'three/examples/jsm/libs/stats.module.js'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import "./app.scss";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

/** @type {HTMLElement} */
let monitorPanel;
const renderer = new WebGLRenderer({ alpha: true, antialias: true });
const scene = new Scene();
// scene.background = new THREE.Color(0x282c34)
const stats = new Stats()
stats.setMode(0)

// 设置监视器位置
stats.domElement.style.position = 'absolute'
stats.domElement.style.left = '0px'
stats.domElement.style.top = '0px'

/** @type {PerspectiveCamera} */
let camera;
/** @type {FlyControls} */
let controls;
let controlsEnabled = false
// /** @type {THREE.Group<THREE.Object3DEventMap>} */
// let object
const group = new THREE.Group();

/** @type {THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>} */
let followBox

// 初始化目标位置
/** @type {Vector3|undefined} */
let startPosition; // = new THREE.Vector3(5, 5, 5);
/** @type {Vector3|undefined} */
let targetPosition; // = new THREE.Vector3(0, 0, 0);
/** @type {HTMLDivElement} */
let startBtn
// const duration = 2000; // 2秒
const moveValue = 1;
const rotationAngle = 0.005
const clock = new THREE.Clock();
clock.stop()

// const loader = new FBXLoader()
// loader.load('assets/Cyberpunk/Kitbash3d_CyberpunkProps-Native.FBX', obj => {
//   const modelScale = 0.5
//   obj.scale.set(modelScale, modelScale, modelScale)
//   object = obj
//   scene.add(obj)
// })

window.onload = async () => {
  monitorPanel = document.getElementById("monitorPanel");
  await sleep(100)
  const { innerWidth, innerHeight } = window;
  camera = new PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 2000);

  renderer.setClearColor(0x00ffff, 0);
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; // 啟用陰影映射
  renderer.shadowMap.type = PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(stats.domElement)

  // controls = new OrbitControls(camera, renderer.domElement);
  controls = new FlyControls( camera, renderer.domElement )
  controls.movementSpeed = 0;
  controls.rollSpeed = 0.03;
  controls.autoForward = false;
  controls.dragToLook = false;

  scene.add(camera, ...LightMaker());
  // camera.position.set(0, 162, 0);
  camera.position.set(0, 10, 10);
  camera.lookAt(new Vector3(0, 0, 0));

  catchBtnEvent();
  animate();
  load2DTexture()

  window.addEventListener('keyup', event => {
    if (event.key === ' ') {
      // controls.enabled != controls.enabled
      controlsEnabled = !controlsEnabled
      controlsEnabled ? clock.start() : clock.stop()
    }
  })

  targetPosition = new Vector3(0, 160, 0)
  startPosition = camera.position

  // 創建一個跟隨相機的物件
  const followBoxGeometry = new THREE.CircleGeometry(0.25, 64);
  const followBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  followBox = new THREE.Mesh(followBoxGeometry, followBoxMaterial);
  followBox.rotation.set(1.5707, 0, 0)
  followBox.position.set(0.69, 160, 0.3); // 設置物件在相機前方3個單位
  scene.add(followBox);
  
  const _startBtn = createBtn()
  document.body.appendChild(_startBtn)
  _startBtn.style.top = window.innerHeight / 2
  _startBtn.style.left = window.innerWidth / 2
  startBtn = _startBtn
};

const createBtn = () => {
  const div = document.createElement('div')
  div.className = 'title-btn'
  div.innerText = 'Start'
  div.style.opacity = '0'
  return div
}

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
  
  // if (monitorPanel && followBox) {
  //   const { x, y, z } = followBox.position;
  //   // const { x, y, z } = camera.position;
  //   // monitorPanel.innerText = `${x}, ${y}, ${z}`;
  //   monitorPanel.innerText = `${Math.floor(x * 100) / 100}, ${Math.floor(y * 100) / 100}, ${Math.floor(z * 100) / 100}`;
  // }

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

    if (Math.abs(camera.rotation.x + 1.5707) >= rotationAngle) {
      isLoop = true;
      camera.rotation.x += camera.rotation.x >= -1.5707 ? -rotationAngle : rotationAngle
    }
    if (Math.abs(camera.rotation.y) > rotationAngle) {
      isLoop = true;
      camera.rotation.y += camera.rotation.y > 0 ? -rotationAngle : rotationAngle
    }
    if (Math.abs(camera.rotation.z) > rotationAngle) {
      isLoop = true;
      camera.rotation.z += camera.rotation.z > 0 ? -rotationAngle : rotationAngle
    }

    if (isLoop) {
      // if (controls.enabled) controls.enabled = false
      if (clock.running) clock.stop()
    } else {
      startPosition = targetPosition = undefined;
      // controls.enabled = true
      if (controlsEnabled) clock.start()
    }
  }

  if (!isEnter && camera.position.y > 155) {
    // 計算目標位置
    const _targetPosition = new THREE.Vector3();
    _targetPosition.setFromMatrixPosition(camera.matrixWorld);
    _targetPosition.add(new THREE.Vector3(0.7, -0.4, -3).applyQuaternion(camera.quaternion));
    
    if (followBox) {
      // 線性插值更新跟隨物體的位置
      followBox.position.lerp(_targetPosition, 0.04); // 0.1 是插值因子，值越小跟隨越慢
      followBox.lookAt(camera.position)

      if (startBtn) {
        const { x, y } = toScreenPosition(followBox, camera)
        startBtn.style.left = x - startBtn.offsetWidth / 2 + 'px'
        startBtn.style.top = y - startBtn.offsetHeight / 2 + 'px'
        startBtn.style.opacity = '1'
      }
    }
  } else {
    if (startBtn) startBtn.style.opacity = '0'
  }
  
  // 更新控制器
  // if (controlsEnabled) 
  // controls.update()
  controls.update(clock.getDelta());

  // 更新帧数
  stats.update()
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

function catchBtnEvent() {
  const btn4 = document.getElementById('btn4') // zoomInOut()
  btn4.onclick = () => zoomInOut()
}

let isEnter = false
function zoomInOut() {
  targetPosition = new Vector3(0, isEnter ? 160 : 10, 0)
  startPosition = camera.position
  isEnter = !isEnter
}

/** 製造光線 */
function LightMaker() {
  const lightColor = 0xffffff
  const directionalLight = new DirectionalLight(lightColor, 2);
  directionalLight.position.set(50, 50, -100)
  const directionalLightHelper = new DirectionalLightHelper(directionalLight);
  
  const lightColor2 = 0xfff714
  const directionalLight2 = new DirectionalLight(lightColor2, 2);
  directionalLight2.position.set(100, 0, -100)
  const directionalLightHelper2 = new DirectionalLightHelper(directionalLight2);

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

function load2DTexture() {
  // 加载图片纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("./assets/movement.png");
  // 创建平面几何体
  const geometry = new THREE.PlaneGeometry(3, 3);

  // 创建材质并应用纹理
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const flatCount = 150
  const stage = 50
  const spacingRate = 4

  // 建立pick的位置陣列
  const positions = []
  for(let j = 0; j < flatCount; j++) {
    const x = (Math.floor(Math.random() * (flatCount / 2 - 0 + 1)) - flatCount / 4) * spacingRate
    const y = (Math.floor(Math.random() * (flatCount / 2 - 0 + 1)) - flatCount / 4) * spacingRate

    const zPoints = []
    for (let k = 0; k < stage; k++) {
      const z = k * 10 - 50 - Math.floor(Math.random() * 100) / 10 - 120
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

/**
 * 將3D空間中的物體位置轉換為2D屏幕坐標
 * @param {THREE.Mesh} obj 
 * @param {THREE.PerspectiveCamera} camera 
 */
function toScreenPosition(obj, camera) {
  const vector = new THREE.Vector3();

  // 將物體的世界坐標轉換為相機的剪裁空間坐標
  obj.getWorldPosition(vector);
  vector.project(camera);

  // 計算屏幕坐標
  const x = (vector.x * 0.5 + 0.5) * renderer.domElement.clientWidth;
  const y = (1 - vector.y * 0.5 - 0.5) * renderer.domElement.clientHeight;

  return { x, y };
}

function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}