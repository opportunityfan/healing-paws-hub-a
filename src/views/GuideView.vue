<template>
  <div class="full">
    <HLoading :load="initScene">
      <div ref="modelRef" class="full" style="min-width: 0; min-height: 0">
        <div
            class="department_brief_bar border-radius-regular flex-column"
            v-if="data.currentDepartmentBriefIndex !== -1"
            :style="{
              top: data.barTop + 'px',
              left: data.barLeft + 'px',
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
            <div class="box-icon department-goto" @click="goto('/department/' + data.departmentList[data.currentDepartmentBriefIndex].id)">
              <i class='bx bx-chevron-right'></i>
            </div>
          </div>
        </div>
      </div>
    </HLoading>
  </div>
</template>

<script setup lang="ts">
import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VueElement, ref, reactive} from "vue";
import HLoading from "@/components/HLoading.vue";
import {getDepartmentBrief, DepartmentBrief, goto} from "@/assets/api";

const modelRef = ref<VueElement>();

const data = reactive<{
  currentDepartmentBriefIndex: number,
  departmentList: DepartmentBrief[],
  barTop: number,
  barLeft: number,
  barWidth: number,
  barHeight: number,
  loaded: boolean
}>({
  currentDepartmentBriefIndex: -1,
  departmentList: [],
  barTop: 0,
  barLeft: 0,
  barWidth: 200,
  barHeight: 200,
  loaded: false
})

const onLoad = () => {
  data.loaded = true
}

class GuideScene {
  scene: Three.Scene;
  camera: Three.PerspectiveCamera;
  renderer: Three.WebGLRenderer;
  controls: OrbitControls;
  width: number;
  height: number
  beforeUpdate: (() => void)[];
  constructor() {
    this.scene = new Three.Scene()
    this.camera = new Three.PerspectiveCamera(30, 1, 0.1, 10)
    this.renderer = new Three.WebGLRenderer({
      alpha: true,
      antialias:true
    })
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.beforeUpdate = []
    this.width = 0
    this.height = 0
    this.controls.maxPolarAngle = Math.PI/2 - 0.1
    this.controls.minDistance = 1
    this.controls.maxDistance = 5
    this.controls.screenSpacePanning = true
    this.camera.position.set(2, 2, 2)
    this.camera.lookAt(0, 0, 0);
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
      const intersects = raycaster.intersectObjects(this.scene.children)
      if (intersects.length > 0) {
        console.log(intersects[0])
        if ((intersects[0].object as any).click) {
          (intersects[0].object as any).click()
        }
      }
    })
    this.render()
  }
  add(object : GuideObject) {
    this.scene.add(object.getObject3D())
  }
  addObject3D(object : Three.Object3D) {
    this.scene.add(object)
  }
  onClick(f : (event : MouseEvent) => void) {
    Object.assign(this.scene, {click : f})
  }
  update() {
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
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
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

class Plane implements GuideObject {
  static geometry = new Three.PlaneGeometry(1, 1)
  static material = new Three.Material()
  plane: Three.Mesh;
  constructor() {
    this.plane = new Three.Mesh(Plane.geometry, Plane.material)
  }
  getObject3D(): Three.Object3D {
    return this.plane
  }
}

const scene = new GuideScene()

const loadResources = () : Promise<void> => {
  return new Promise<void>((resolve) => {
    const temp = new Three.MeshStandardMaterial({
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      map: new Three.TextureLoader().load(require("@/assets/material/Tiles074_1K-PNG/Tiles074_1K-PNG_Color.png")),
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      normalMap: new Three.TextureLoader().load(require("@/assets/material/Tiles074_1K-PNG/Tiles074_1K-PNG_NormalGL.png")),
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      roughnessMap: new Three.TextureLoader().load(require("@/assets/material/Tiles074_1K-PNG/Tiles074_1K-PNG_Roughness.png")),
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      // displacementMap: new Three.TextureLoader().load(require("@/assets/material/Tiles074_1K-PNG/Tiles074_1K-PNG_Displacement.png"))
    })
    if (temp.map && temp.normalMap && temp.roughnessMap) {
      temp.map.minFilter = Three.LinearMipmapNearestFilter
      temp.map.wrapT = Three.RepeatWrapping
      temp.map.wrapS = Three.RepeatWrapping
      temp.map.repeat.set(3, 3)
      temp.normalMap.minFilter = Three.LinearMipmapNearestFilter
      temp.normalMap.wrapT = Three.RepeatWrapping
      temp.normalMap.wrapS = Three.RepeatWrapping
      temp.normalMap.repeat.set(3, 3)
      temp.roughnessMap.minFilter = Three.LinearMipmapNearestFilter
      temp.roughnessMap.wrapT = Three.RepeatWrapping
      temp.roughnessMap.wrapS = Three.RepeatWrapping
      temp.roughnessMap.repeat.set(3, 3)
      // temp.displacementMap.minFilter = Three.LinearMipmapNearestFilter
      // temp.displacementMap.wrapT = Three.RepeatWrapping
      // temp.displacementMap.wrapS = Three.RepeatWrapping
      // temp.displacementMap.repeat.set(3, 3)
    }
    Plane.material = temp
    resolve()
  })
}

const loadData = async () => {
  data.departmentList = await getDepartmentBrief()
}

const initScene = async () => {
  await loadResources()
  await loadData()
  scene.onClick((event : MouseEvent) => {
    data.currentDepartmentBriefIndex = -1
    data.barTop = event.offsetY
    data.barLeft = event.offsetX
    if (data.barLeft + data.barWidth > scene.width) {
      data.barLeft -= data.barWidth
    }
    if (data.barTop + data.barHeight > scene.height) {
      data.barTop -= data.barHeight
    }
    data.loaded = false
  })
  const directionalLight = new Three.PointLight(0xffffff, 2);
  const ambient = new Three.AmbientLight(0xffffff, 2);
  directionalLight.position.set(-2, 2, -2)
  scene.addObject3D(directionalLight)
  scene.addObject3D(ambient);
  for (let i = 0; i < data.departmentList.length; ++i) {
    const mark = new Mark()
    if (data.departmentList[i].position)
      mark.group.position.set(data.departmentList[i].position.x, data.departmentList[i].position.y, data.departmentList[i].position.z)
    mark.onClick(() => {
      data.currentDepartmentBriefIndex = i
    })
    scene.add(mark)
  }
  const mainPlane = new Plane();
  mainPlane.plane.position.set(0, 0, 0)
  mainPlane.plane.scale.set(2, 2, 1)
  mainPlane.plane.lookAt(0, 10, 0)
  scene.add(mainPlane)
  scene.onBeforeUpdate(() => {
    directionalLight.position.set(-scene.camera.position.x, 2, -scene.camera.position.z)
  })
  scene.initialize()
}
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
