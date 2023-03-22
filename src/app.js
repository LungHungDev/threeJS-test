import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

import "./app.scss"

import { resizeHandler } from "./feature/display-handler"
import { SceneInit } from "./feature/scene-init"
import { GlbLoader } from "./feature/glb-loader"

import { CubeRotation } from "./makers/box-maker"
import { LightMaker } from "./makers/light-maker"
import { GroundMaker } from "./makers/ground-maker"

/** @type {'Orthographic'|'Perspective'} */
let cameraType = "Perspective"

/** @type {THREE.Group} */
let trees

let isRotation = true
const cameraDistance = 150

const { scene, camera, renderer } = SceneInit(
  cameraType == "Orthographic" ? cameraDistance : null
)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enabled = true

scene.add(...LightMaker(), GroundMaker())

resizeHandler(camera, renderer, cameraDistance)
animate()

document.getElementById("toggleControl").onclick = () => {
  controls.enabled = !controls.enabled
}
document.getElementById("toggleRotation").onclick = () => {
  isRotation = !isRotation
}

const loader = GlbLoader()

loader.load("assets/trees.glb", (glb) => {
  trees = glb.scene

  const format = THREE.RedFormat
  const colors = new Uint8Array(4)
  for (let c = 0; c <= colors.length; c++) {
    colors[c] = (c / colors.length) * 256
  }
  const gradientMap = new THREE.DataTexture(colors, colors.length, 1, format)
  gradientMap.needsUpdate = true
  
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshToonMaterial()
  material.gradientMap = gradientMap
  material.color = '#009600'

  const mesh = new THREE.Mesh(geo, material)
  
  trees.add(mesh)
  trees.position.set(0, 0, 0)
  scene.add(trees)
})

function animate() {
  if(isRotation && trees) CubeRotation(trees)
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
