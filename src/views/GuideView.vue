<template>
  <div class="full">
    <HLoading :load="initScene">
      <div ref="modelRef" class="full" style="min-width: 0; min-height: 0">
        <transition
            name="animate__animated animate__fade"
            enter-active-class="animate__fadeIn"
            leave-active-class="animate__fadeOut"
            mode="out-in"
        >
          <div
              class="department_brief_bar border-radius-regular flex-column"
              v-if="data.currentDepartmentBriefIndex !== -1 && !inAnimation"
              style="top: 55%; left: 55%"
              :style="{
              width: (data.barWidth - 6) + 'px',
              height: (data.barHeight - 6) + 'px'
            }"
          >
            <div style="width: 100%; height: 80%; position: relative">
              <transition
                  name="animate__animated animate__fade"
                  enter-active-class="animate__fadeIn"
                  leave-active-class="animate__fadeOut"
                  mode="out-in"
              >
                <div class="loading-block" v-if="!data.loaded">
                  <div class="center">
                    <div class="spinner1"></div>
                  </div>
                </div>
              </transition>
              <div class="department-background full">
                <img class="center" :src="data.departmentList[data.currentDepartmentBriefIndex].pic" @load="onLoad" style="height: 100%; width: 100%; object-fit: cover" alt>
              </div>
            </div>
            <div style="flex-grow: 1; position: relative; width: 100%; justify-content: center" class="flex-row">
              <div class="text-bold-inverse">
                {{ data.departmentList[data.currentDepartmentBriefIndex].departmentName }}
              </div>
              <div class="box-icon department-goto">
                <i class='bx bx-chevron-right'></i>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </HLoading>
  </div>
</template>

<script setup lang="ts">
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import {VueElement, ref, reactive, onUnmounted} from "vue";
import HLoading from "@/components/HLoading.vue";
import {getDepartmentBrief, DepartmentBrief} from "@/assets/api";
import {Vector3} from "three";

const modelRef = ref<VueElement>();

const data = reactive<{
  currentDepartmentBriefIndex: number,
  departmentList: DepartmentBrief[],
  barWidth: number,
  barHeight: number,
  loaded: boolean
}>({
  currentDepartmentBriefIndex: -1,
  departmentList: [],
  barWidth: 200,
  barHeight: 200,
  loaded: false
})

const onLoad = () => {
  data.loaded = true
}

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

// class Plane implements GuideObject {
//   static geometry = new Three.PlaneGeometry(1, 1)
//   static material = new Three.Material()
//   plane: Three.Mesh;
//   constructor() {
//     this.plane = new Three.Mesh(Plane.geometry, Plane.material)
//     this.plane.receiveShadow = true
//   }
//   getObject3D(): Three.Object3D {
//     return this.plane
//   }
// }

class Wall implements GuideObject {
  static material = new Three.MeshStandardMaterial({
    color: '#FFFFFF'
  })
  static geometry = new Three.BoxGeometry(1, 0.3, 0.02)
  mesh : Three.Mesh;
  group : Three.Group
  constructor() {
    this.mesh = new Three.Mesh(Wall.geometry, Wall.material)
    this.group = new Three.Group()
    this.group.add(this.mesh)
    this.mesh.position.set(0, 0.15, 0)
    this.mesh.receiveShadow = true
    this.mesh.castShadow = true
  }
  getObject3D() : Three.Object3D {
    return this.group
  }
}

const scene = new GuideScene()

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

const inAnimation = ref<boolean>(false)
let animationDuration = 0
let roughness = 0
let targetPosition = new Vector3()
let targetRotation = new Three.Quaternion()
let originPosition = new Vector3()
let originRotation = new Three.Quaternion()

const moveCamera = (position : Three.Vector3, lookAt : Three.Vector3, duration : number) => {
  if (inAnimation.value) return
  originPosition = scene.camera.position.clone()
  originRotation = new Three.Quaternion();
  originRotation.setFromEuler(scene.camera.rotation)
  targetPosition = position.clone()
  roughness = Math.log(50) / duration;
  const rotateVector = lookAt.clone()
  rotateVector.addScaledVector(position, -1).normalize();
  targetRotation = new Three.Quaternion();
  targetRotation.setFromUnitVectors(new Vector3(0 ,0, -1) , rotateVector)
  animationDuration = duration
  inAnimation.value = true
  scene.disableControl()
}

const resetCamera = (duration : number) => {
  if (inAnimation.value) return
  targetPosition = originPosition.clone()
  targetRotation = originRotation.clone()
  roughness = Math.log(50) / duration;
  animationDuration = duration
  inAnimation.value = true
  scene.disableControl()
}

const initScene = async () => {
  await loadResources()
  await loadData()
  scene.onClick((event : MouseEvent) => {
    if (!inAnimation.value && data.currentDepartmentBriefIndex != -1) {
      resetCamera(1)
      data.currentDepartmentBriefIndex = -1
    }
    data.loaded = false
  })
  const spotLight = new Three.SpotLight(0xffffff, 5);
  spotLight.castShadow = true
  spotLight.shadow.mapSize.set(1024, 1024)
  const ambient = new Three.AmbientLight(0xffffff, 1);
  spotLight.position.set(0, 2, 0)
  spotLight.lookAt(0, 0, 0)
  scene.addObject3D(spotLight)
  scene.addObject3D(ambient);
  for (let i = 0; i < data.departmentList.length; ++i) {
    const mark = new Mark()
    if (data.departmentList[i].position)
      mark.group.position.set(data.departmentList[i].position.x, data.departmentList[i].position.y, data.departmentList[i].position.z)
    mark.onClick(() => {
      if (inAnimation.value) return
      data.currentDepartmentBriefIndex = i
      moveCamera(new Three.Vector3(mark.group.position.x, 2, mark.group.position.z), new Three.Vector3(mark.group.position.x, -0.5, mark.group.position.z), 1)
    })
    scene.add(mark, 1)
  }
  scene.onBeforeUpdate(() => {
    if (inAnimation.value) {
      const delta = scene.deltaTime
      animationDuration -= delta
      if (animationDuration <= 0) {
        animationDuration = 0
        inAnimation.value = false
        if (data.currentDepartmentBriefIndex === -1) scene.enableControl()
      } else {
        const rate = delta * roughness
        scene.camera.position.lerp(targetPosition, rate)
        const currentQuaternion = new Three.Quaternion()
        currentQuaternion.setFromEuler(scene.camera.rotation)
        currentQuaternion.slerp(targetRotation, rate)
        scene.camera.rotation.setFromQuaternion(currentQuaternion)
      }
    }
  })
  scene.initialize()
}

onUnmounted(() => {
  scene.dispose()
})
</script>

<style scoped lang="stylus">
.department_brief_bar
  position absolute
  width 200px
  height 200px
  background-color var(--grey-color)
  overflow hidden
  box-shadow 0 0 3px 3px rgba(0, 0, 0, 0.2)

.post-background
  top 0
  left 0
  transition all 0.2s
  z-index -1
  overflow hidden

.loading-block
  background-color var(--theme-color-dark)
  position absolute
  width 100%
  height 100%
  z-index 10

.department-goto
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 26px;
  color: var(--white-color)
  &:hover
    color var(--grey-color-bright)
</style>
