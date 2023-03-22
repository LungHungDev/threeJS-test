import { OrthographicCamera, PerspectiveCamera } from 'three'

export const resizeHandler = (camera, renderer, distance) => {
  window.addEventListener('resize', () => {
    const { innerWidth, innerHeight } = window
    if(camera instanceof OrthographicCamera) {
      camera.left = innerWidth / (-1 * distance)
      camera.right = innerWidth / distance
      camera.up = innerHeight / distance
      camera.bottom = innerHeight / (-1 * distance)
    } else if (camera instanceof PerspectiveCamera) {
      camera.aspect = innerWidth / innerHeight
    }
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
  })
}