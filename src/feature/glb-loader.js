import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const GlbLoader = () => {
  const dracoLoader = new DRACOLoader()
  const loader = new GLTFLoader()
  dracoLoader.setDecoderPath('assets/draco/')
  loader.setDRACOLoader(dracoLoader)
  return loader
}