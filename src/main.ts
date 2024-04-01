import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyload from "@/plugins/lazyload";
import "animate.css"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(store).use(router).use(ElementPlus).use(lazyload).mount('#app')
