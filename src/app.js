import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import "./app.scss"

import { resizeHandler } from "./feature/display-handler"
import { SceneInit } from "./feature/scene-init"

import { CubeRotation } from "./makers/box-maker"
import { LightMaker } from "./makers/light-maker"
import { GroundMaker } from "./makers/ground-maker"
import { TreesMaker, changeTreesColorEvent } from "./makers/trees-maker"
import { CarsMaker, changeCarsColorEvent } from "./makers/cars-maker"

/** @type {'Orthographic'|'Perspective'} */
let cameraType = "Perspective"

/** @type {THREE.Mesh[]} */
let trees = []

let isRotation = true
const cameraDistance = 150

const { scene, camera, renderer } = SceneInit(
  cameraType == "Orthographic" ? cameraDistance : null
)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = true

scene.add(
  ...LightMaker(),
  GroundMaker()
)

resizeHandler(camera, renderer, cameraDistance)
animate()

BtnCallback('toggleControl', (ev) => {
  controls.enabled = !controls.enabled
  /** @type {HTMLButtonElement} */
  const button = ev.target
  if(controls.enabled)
    button.classList.add('active')
  else
    button.classList.remove('active')
})
BtnCallback('toggleRotation', (ev) => {
  isRotation = !isRotation
  /** @type {HTMLButtonElement} */
  const button = ev.target
  if(isRotation)
    button.classList.add('active')
  else
    button.classList.remove('active')
});
window.addEventListener('keyup', (keyEvent) => {
  if(keyEvent.key != ' ') return
  isRotation = !isRotation
})

const colors = [
  new THREE.Color('#427062'), // .convertLinearToSRGB()
  new THREE.Color('#33594e'),
  new THREE.Color('#234549'),
  new THREE.Color('#1e363f'),
];

/** @type {HTMLInputElement[]} */
const colorPanelStack = []

colors.forEach((color, index) => {
  const input = document.getElementById(`color-${index + 1}`)
  input.value = `#${color.getHexString()}`
  colorPanelStack.push(input)
});

colorPanelStack.forEach(input => {
  // input.oninput = (event) => changeTreesColorEvent(event, scene)
  input.oninput = (event) => changeCarsColorEvent(event, scene)
});

(async () => {
  // const temp = await Promise.all([
  //   TreesMaker('tree01', { x:0, y:0, z:4 }, colors),
  //   TreesMaker('tree02', { x:0, y:0, z:-4 }, colors)
  // ])
  // trees.push(...temp)
  // scene.add(...trees)

  const cars = await CarsMaker(colors)
  scene.add(cars)
})()

function animate() {
  if(isRotation && trees.length) CubeRotation(trees)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function BtnCallback(id, callback) {
  document.getElementById(id).onclick = callback
}