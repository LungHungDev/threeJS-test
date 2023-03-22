import * as THREE from 'three'
import './app.scss'
import { resizeHandler } from './display-handler'
import { SceneInit } from './scene-init'
import { BoxMaker, CubeRotation } from './box-maker'
import { LightMaker } from './light-maker'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const distance = 150
const { scene, camera, renderer } = SceneInit(distance)

let controlStatus = true
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = controlStatus

const cubes = [BoxMaker(-1.2), BoxMaker(1.2)]
scene.add(...cubes)

const lights = LightMaker()
scene.add(...lights)

const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
const material = new THREE.ShadowMaterial({ opacity: 0.4 })

const plane = new THREE.Mesh(geometry, material)
plane.castShadow = true
plane.receiveShadow = true
plane.rotation.set(-Math.PI/2, 0, 0)
plane.position.set(0, -1.05, 0)
scene.add(plane)

resizeHandler(camera, renderer, distance)
animate()

function animate() {
  CubeRotation(cubes)
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
