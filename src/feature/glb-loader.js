import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
/** @typedef {import('three/examples/jsm/loaders/GLTFLoader').GLTF} GLTF */

const GlbLoader = () => {
  const dracoLoader = new DRACOLoader()
  const loader = new GLTFLoader()
  dracoLoader.setDecoderPath('assets/draco/')
  loader.setDRACOLoader(dracoLoader)
  return loader
}

/** @type {(uri: string) => Promise<GLTF>} */
export const asyncLoadGlb = (uri) => new Promise(resolve => GlbLoader().load(uri, resolve))