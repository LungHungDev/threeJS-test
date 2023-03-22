import {
  MeshToonMaterial,
  // MeshStandardMaterial,
  RedFormat, DataTexture, Color, Mesh } from "three"
import { GlbLoader } from "../feature/glb-loader"
/** @typedef {import('three/examples/jsm/loaders/GLTFLoader').GLTF} GLTF */

const loader = GlbLoader()

/** @type {(uri: string) => Promise<GLTF>} */
const asyncLoadGlb = (uri) => new Promise(resolve => loader.load(uri, resolve))

export const TreesMaker = async () => {
  const glb = await asyncLoadGlb('assets/trees.glb')
  // const material = new MeshStandardMaterial()
  // material.color = new Color('#335941').convertLinearToSRGB()
  // material.color = new Color('#234549')
  
  const material = new MeshToonMaterial()
  const format = RedFormat
  const colors = new Uint8Array(4)
  colors.forEach((_, index) => colors[index] = (index / colors.length) * 256)
  const gradientMap = new DataTexture(colors, colors.length, 1, format)
  gradientMap.needsUpdate = true
  material.gradientMap = gradientMap
  // material.color = new Color('#234549')
  material.color = new Color(0x00ff00)

  const trees = new Mesh(glb.scene.children[0].geometry, material)
  trees.castShadow = true
  trees.receiveShadow = true
  trees.position.set(0.33, -0.05, -0.68)

  return trees
}