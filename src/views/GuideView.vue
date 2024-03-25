<template>
  <div class="full">
    <div ref="modelRef" class="full"></div>
  </div>
</template>

<script setup lang="ts">
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {onMounted, VueElement, ref} from "vue";
const scene = new Three.Scene();
const geometry = new Three.BoxGeometry(100, 100, 100)
const material = new Three.MeshLambertMaterial({
  color: 0x5A8100
})
const directionalLight = new Three.DirectionalLight(0xffffff, 2);
const dirLightHelper = new Three.DirectionalLightHelper(directionalLight, 5,0xff0000);
const ambient = new Three.AmbientLight(0xffffff, 0.4);

const mesh = new Three.Mesh(geometry, material)
const camera = new Three.PerspectiveCamera(30, 1, 10, 1000)
const renderer = new Three.WebGLRenderer({
  alpha: true,
  antialias:true
})
const controls = new OrbitControls(camera, renderer.domElement)
const modelRef = ref<VueElement>();
let width : number, height : number
const initScene = () => {
  directionalLight.position.set(80, 100, 50)
  scene.add(directionalLight)
  scene.add(dirLightHelper)
  scene.add(ambient);
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
  camera.position.set(200, 200, 200)
  camera.lookAt(0, 0, 0);
  updateSize()
}
const updateSize = () => {
  camera.aspect = width / height;
  camera.updateProjectionMatrix()
  renderer.setSize(width, height);
}
onMounted(() => {
  if (!modelRef.value) return
  width = modelRef.value.clientWidth
  height = modelRef.value?.clientHeight
  initScene()
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })
  renderer.render(scene, camera)
  modelRef.value.appendChild(renderer.domElement)
})


</script>

<style scoped lang="stylus">

</style>
