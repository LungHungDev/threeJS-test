import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three'

export const BoxMaker = (size, x, y, z, color) => {
  const box = new BoxGeometry(size, size, size)
  const material = new MeshStandardMaterial({ color: color ?? 0x010176 })
  const cube = new Mesh(box, material)
  cube.castShadow = true
  cube.position.set(x, y, z)
  return cube
}

export const CubeRotation = (cube) => {
  const cubes = Array.isArray(cube) ? cube : [cube]
  cubes.forEach(_cube => {
    _cube.rotation.x += 0.005
    // _cube.rotation.y += 0.01
    // _cube.rotation.z += 0.01
  })
}