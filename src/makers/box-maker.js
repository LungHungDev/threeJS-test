import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export const BoxMaker = (position) => {
  const box = new BoxGeometry(1, 1, 1)
  const material = new MeshStandardMaterial({ color: 'orange' }) //0x010176
  const cube = new Mesh(box, material)
  cube.castShadow = true
  cube.position.set(position, 0, 0)
  return cube
}

export const CubeRotation = (cube) => {
  const cubes = Array.isArray(cube) ? cube : [cube]
  cubes.forEach(_cube => {
    _cube.rotation.x += 0.02
    // _cube.rotation.y += 0.01
    // _cube.rotation.z += 0.01
  })
}