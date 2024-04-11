import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyload from "@/plugins/lazyload";
import "animate.css"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueCountdown from '@chenfengyuan/vue-countdown';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';


// highlightjs
import hljs from 'highlight.js';

import { definedCodeMirror } from '@/codeMirror'
import rightClick from "@/plugins/rightClick";
import clickOutside from "@/plugins/clickOutside";


VMdEditor.Codemirror = definedCodeMirror

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});

VMdEditor.use(createKatexPlugin())

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});

VMdPreview.use(createKatexPlugin())

createApp(App)
    .use(store)
    .use(router)
    .use(lazyload)
    .use(rightClick)
    .use(clickOutside)
    .use(ElementPlus)
    .use(VMdEditor)
    .use(VMdPreview)
    .component(VueCountdown.name, VueCountdown)
    .mount('#app')
