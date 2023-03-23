import {
  Color,
  // MeshToonMaterial,
  // MeshStandardMaterial,
  // RedFormat, DataTexture,
  Group, Mesh, ShaderMaterial, Vector3
} from "three"
import { asyncLoadGlb } from '../feature/glb-loader'
import { GhibliShader } from '../model/ghibli-shader'
/** @typedef {import('three').Scene} Scene */

export const TreesMaker = async (name, position, colors) => {
  const glb = await asyncLoadGlb('assets/trees.glb')

  // const material = new MeshStandardMaterial()
  // // material.color = new Color('#335941').convertLinearToSRGB()
  // material.color = new Color('#00ff00')
  
  // const material = new MeshToonMaterial()
  // const format = RedFormat
  // const colors = new Uint8Array(4)
  // colors.forEach((_, index) => colors[index] = (index / colors.length) * 256)
  // const gradientMap = new DataTexture(colors, colors.length, 1, format)
  // gradientMap.needsUpdate = true
  // material.gradientMap = gradientMap
  // material.color = new Color(0x00ff00)
  // const trees = new Mesh(glb.scene.children[0].geometry, material)

  const shader = new ShaderMaterial()
  uniforms.colorMap.value = colors
  shader.uniforms = uniforms
  shader.vertexShader = GhibliShader.vertexShader
  shader.fragmentShader = GhibliShader.fragmentShader

  const trees = new Mesh(glb.scene.children[0].geometry, shader)
  trees.castShadow = true
  trees.receiveShadow = true
  trees.position.set(0.33, -0.05, -0.68)

  const group = new Group()
  const { x, y, z } = position
  group.position.set(x, y, z)
  group.name = name
  group.add(trees)

  return group
}

const uniforms = {
  colorMap: {
    // value: [],
  },
  brightnessThresholds: {
    value: [0.9, 0.45, 0.001]
  },
  lightPosition: {
    value: new Vector3(15, 15, 15)
  },
}

/**
 * @param {Event} event 
 * @param {Scene} scene 
 */
export function changeTreesColorEvent (event, scene) {
  const name = event.target.id
  const colorCode = event.target.value
  const colorIndex = Number(name.split('-')[1]) - 1
  /** @type {THREE.Mesh<any, ShaderMaterial>} */
  const mesh = scene.getObjectByName('tree01').children[0]
  mesh.material.uniforms.colorMap.value[colorIndex] = new Color(colorCode)
}