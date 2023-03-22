import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const GlbLoader = () => {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('assets/draco/');
  
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  return loader
}