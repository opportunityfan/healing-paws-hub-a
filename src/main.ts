import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyload from "@/plugins/lazyload";
import "animate.css"
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCountdown from '@chenfengyuan/vue-countdown';

createApp(App)
    .use(store)
    .use(router)
    .use(lazyload)
    .use(mavonEditor)
    .use(ElementPlus)
    .component(VueCountdown.name, VueCountdown)
    .mount('#app')
