import { Mesh, PlaneGeometry, ShadowMaterial } from 'three'

export const GroundMaker = () =>{
  const geometry = new PlaneGeometry(100, 100, 1, 1)
  const material = new ShadowMaterial({ opacity: 0.4 })
  
  const ground = new Mesh(geometry, material)
  ground.castShadow = true
  ground.receiveShadow = true
  ground.rotation.set(-Math.PI/2, 0, 0)
  ground.position.set(0, -1.05, 0)

  return ground
}