import { DirectionalLight, AmbientLight } from 'three'

export const LightMaker = () => {
  const directionalLight = new DirectionalLight('white')
  directionalLight.position.set(15, 15, 15)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  
  const ambientLight = new AmbientLight(0xffffff, 0.1)

  return [
    directionalLight,
    ambientLight
  ]
}