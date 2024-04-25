<template>
  <div class="full">
    <HLoading :load="initScene">
      <div ref="modelRef" class="full" style="min-width: 0; min-height: 0"></div>
    </HLoading>
  </div>
</template>

<script setup lang="ts">
import HLoading from "./HLoading.vue"
import * as Three from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {onUnmounted, reactive, ref, VueElement} from "vue";
import {DepartmentBrief, getDepartmentBrief} from "@/assets/api";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";

// eslint-disable-next-line no-undef
const props = defineProps<{
  id: string
  modelValue: {
    x : number
    y : number
    z : number
  }
}>()

// eslint-disable-next-line no-undef
const emits = defineEmits(['update:modelValue'])

const data = reactive<{
  departmentList: DepartmentBrief[]
}>({
  departmentList: []
})

const modelRef = ref<VueElement>();

class GuideScene {
  scene: Three.Scene[];
  camera: Three.PerspectiveCamera;
  renderer: Three.WebGLRenderer;
  controls: OrbitControls;
  width: number;
  height: number;
  renderID: number;
  clock: Three.Clock;
  deltaTime : number
  beforeUpdate: (() => void)[];
  constructor() {
    this.scene = [new Three.Scene(), new Three.Scene()]
    this.camera = new Three.PerspectiveCamera(30, 1, 0.1, 100)
    this.renderer = new Three.WebGLRenderer({
      alpha: true,
      antialias:true
    })
    this.beforeUpdate = []
    this.width = 0
    this.height = 0
    this.renderID = 0
    this.clock = new Three.Clock()
    this.deltaTime = 0
    this.camera.position.set(3.3, 1.63, 3.36)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.camera.lookAt(0, -0.5, 0)
    this.controls.target = new Three.Vector3(0, -0.5, 0)
    this.controls.maxPolarAngle = Math.PI/2 - 0.3
    this.controls.minDistance = 2
    this.controls.maxDistance = 10
    this.controls.enablePan = false
    this.renderer.shadowMap.enabled = true
    this.renderer.autoClearColor = false
    this.renderer.autoClearDepth = false
  }
  initialize() {
    this.renderer.setPixelRatio(window.devicePixelRatio)
    if (modelRef.value) modelRef.value.appendChild(this.renderer.domElement)
    this.renderer.domElement.addEventListener('click' ,(event : MouseEvent) => {
      if ((this.scene as any).click) {
        (this.scene as any).click(event)
      }
      const px = event.offsetX
      const py = event.offsetY
      const x = (px / this.width) * 2 - 1;
      const y = -(py / this.height) * 2 + 1;
      const raycaster = new Three.Raycaster()
      raycaster.setFromCamera(new Three.Vector2(x, y), this.camera)
      const intersects = raycaster.intersectObjects(this.scene)
      if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; ++i) {
          if ((intersects[i].object as any).click !== undefined) {
            (intersects[i].object as any).click()
          }
        }
      }
    })
    this.render()
  }
  add(object : GuideObject, index = 0) {
    this.scene[index].add(object.getObject3D())
  }
  addObject3D(object : Three.Object3D, index = 0) {
    this.scene[index].add(object)
  }
  onClick(f : (event : MouseEvent) => void) {
    Object.assign(this.scene, {click : f})
  }
  update() {
    this.deltaTime = this.clock.getDelta()
    if (!modelRef.value) return
    this.width = modelRef.value?.clientWidth
    this.height = modelRef.value?.clientHeight
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height);
    for (let f in this.beforeUpdate) this.beforeUpdate[f]()
  }
  onBeforeUpdate(f : () => void) {
    this.beforeUpdate.push(f)
  }
  render() {
    this.update()
    this.renderer.clearColor()
    for (let i = 0; i < this.scene.length; ++i) {
      this.renderer.clearDepth()
      this.renderer.render(this.scene[i], this.camera)
    }
    this.renderID = requestAnimationFrame(this.render.bind(this))
  }
  enableControl() {
    this.controls.enableRotate = true
  }
  disableControl() {
    this.controls.enableRotate = false
  }
  dispose() {
    cancelAnimationFrame(this.renderID)
    this.renderer.domElement.addEventListener('click', () => { return }, false)
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}

interface GuideObject {
  getObject3D() : Three.Object3D
}

class Mark implements GuideObject {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  static markTexture = new Three.TextureLoader().load(require("@/assets/location.png"))
  static material = new Three.SpriteMaterial({
    map: Mark.markTexture
  })
  group: Three.Group;
  sprite: Three.Sprite;
  constructor() {
    this.sprite = new Three.Sprite(Mark.material)
    this.sprite.scale.set(0.1, 0.1, 1)
    this.group = new Three.Group()
    this.group.add(this.sprite)
    this.sprite.position.set(0, 0.05, 0)
  }
  onClick(f : () => void) {
    Object.assign(this.sprite, {click : f})
  }
  getObject3D() {
    return this.group;
  }
}

const scene = new GuideScene()

const currentMark = new Mark()

const loadResources = async () => {
  const loader = new OBJLoader();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const model = await loader.loadAsync("/model.obj")
  scene.addObject3D(model)
  model.position.set(0.5, -0.5, 0.5)
  model.scale.set(0.007, 0.007, 0.007)
  // model.children[0].receiveShadow = true
  // model.children[0].castShadow = true
}

const loadData = async () => {
  data.departmentList = await getDepartmentBrief()
}

const initScene = async () => {
  await loadResources()
  await loadData()
  scene.onClick((event : MouseEvent) => {
    const px = event.offsetX
    const py = event.offsetY
    const x = (px / scene.width) * 2 - 1;
    const y = -(py / scene.height) * 2 + 1;
    const raycaster = new Three.Raycaster()
    raycaster.setFromCamera(new Three.Vector2(x, y), scene.camera)
    const point = new Three.Vector3()
    raycaster.ray.intersectPlane(new Three.Plane(new Three.Vector3(0, 1, 0)), point)
    emits('update:modelValue', {x: point.x, y: point.y, z: point.z})
  })
  const spotLight = new Three.SpotLight(0xffffff, 5);
  spotLight.castShadow = true
  spotLight.shadow.mapSize.set(1024, 1024)
  const ambient = new Three.AmbientLight(0xffffff, 1);
  spotLight.position.set(0, 2, 0)
  spotLight.lookAt(0, 0, 0)
  scene.addObject3D(spotLight)
  scene.addObject3D(ambient);
  for (let i = 0; i < data.departmentList.length; ++i)
    if (data.departmentList[i].id != props.id) {
      const mark = new Mark()
      if (data.departmentList[i].position)
        mark.group.position.set(data.departmentList[i].position.x, data.departmentList[i].position.y, data.departmentList[i].position.z)
      scene.add(mark, 1)
    }
  currentMark.sprite.material = new Three.SpriteMaterial({
    map: Mark.markTexture,
    color: '#FF0000'
  })
  scene.add(currentMark)
  scene.onBeforeUpdate(() => {
    currentMark.group.position.set(props.modelValue.x, props.modelValue.y, props.modelValue.z)
  })
  scene.initialize()
}

onUnmounted(() => {
  scene.dispose()
})
</script>

<style scoped>

</style>
