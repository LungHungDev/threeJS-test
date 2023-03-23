import { asyncLoadGlb } from '../feature/glb-loader'
import { GhibliShader } from '../model/ghibli-shader'
import { Mesh, ShaderMaterial, Group, Vector3, Color } from 'three'

export const CarsMaker = async (colors) => {
  const glb = await asyncLoadGlb('assets/Giulettina.glb')

  const shader = new ShaderMaterial()
  uniforms.colorMap.value = colors
  shader.uniforms = uniforms
  shader.vertexShader = GhibliShader.vertexShader
  shader.fragmentShader = GhibliShader.fragmentShader
  
  const group = new Group()
  // const geometry = glb.scene.children[0].children[0].children[1].geometry

  glb.scene.children[0].children[0].children.forEach(geometry => {
    const car = new Mesh(geometry.geometry, shader)
    car.castShadow = true
    car.receiveShadow = true
    group.add(car)
  })
  group.name = 'cars01'

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
export function changeCarsColorEvent (event, scene) {
  const name = event.target.id
  const colorCode = event.target.value
  const colorIndex = Number(name.split('-')[1]) - 1
  scene.getObjectByName('cars01').children.forEach(mesh => {
    mesh.material.uniforms.colorMap.value[colorIndex] = new Color(colorCode)
  })
}