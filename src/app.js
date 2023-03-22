// import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import "./app.scss"

import { resizeHandler } from "./feature/display-handler"
import { SceneInit } from "./feature/scene-init"

import { CubeRotation } from "./makers/box-maker"
import { LightMaker } from "./makers/light-maker"
import { GroundMaker } from "./makers/ground-maker"
import { TreesMaker } from "./makers/trees-maker"

/** @type {'Orthographic'|'Perspective'} */
let cameraType = "Perspective"

/** @type {THREE.Mesh} */
let trees

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

BtnCallback('toggleControl', () => controls.enabled = !controls.enabled)
BtnCallback('toggleRotation', () => isRotation = !isRotation);
window.addEventListener('keyup', (keyEvent) => {
  if(keyEvent.key != ' ') return
  isRotation = !isRotation
});

(async () => {
  trees = await TreesMaker()
  scene.add(trees)
})()

function animate() {
  if(isRotation && trees) CubeRotation(trees)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function BtnCallback(id, callback) {
  document.getElementById(id).onclick = callback
}