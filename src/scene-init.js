import {
  Scene,
  WebGLRenderer,
  // OrthographicCamera,
  PerspectiveCamera,
  PCFSoftShadowMap
} from 'three'

export const SceneInit = (
  // distance
) => {
  const { innerWidth, innerHeight } = window
  const scene = new Scene()
  scene.background = null

  // const camera = new OrthographicCamera(
  //   innerWidth / (-1 * distance),
  //   innerWidth / distance,
  //   innerHeight / distance,
  //   innerHeight / (-1 * distance),
  //   - 50,
  //   10
  // )
  // camera.position.set(0, 0, 0)
  // scene.add(camera)

  const camera = new PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )
  camera.position.set(14.4666, 2.0365, 5.556165)
  camera.lookAt(scene.position)
  scene.add(camera)

  const renderer = new WebGLRenderer({ alpha: true })
  renderer.setClearColor(0x00ffff, 0)
  renderer.setSize(innerWidth, innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  document.body.appendChild(renderer.domElement)

  return { scene, camera, renderer }
}