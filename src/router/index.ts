import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistryView from "@/views/RegistryView.vue";
import CheckEmailView from "@/views/CheckEmailView.vue"
import SignView from "@/views/SignView.vue"
import LearnView from "@/views/LearnViews/LearnView.vue";
import MainView from "@/views/MainView.vue";
import GuideView from "@/views/GuideView.vue";
import ArchiveView from "@/views/ArchiveView.vue";
import ExamView from "@/views/ExamView.vue";
import AffairView from "@/views/LearnViews/AffairView.vue";
import AffairSearchView from "@/views/LearnViews/AffairSearchView.vue";
import ExamLink from "@/views/ExamLink.vue";
import store from "@/store";
import InstrumentSearchView from "@/views/LearnViews/InstrumentSearchView.vue";
import InstrumentView from "@/views/LearnViews/InstrumentView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'main',
    redirect: '/login'
  },
  {
    path: '/sign',
    name: 'sign',
    component: SignView,
    redirect: '/login',
    children: [
      {
        path: '/login',
        name: 'login',
        component: LoginView
      },
      {
        path:'/registry',
        name:'registry',
        component: RegistryView
      },
      {
        path:'/check-email',
        name:'check-email',
        component: CheckEmailView
      }
    ]
  },
  {
    path: '/main',
    name: 'mainView',
    component: MainView,
    redirect:'/learn',
    children: [
      {
        path: '/learn',
        name: 'learnPage',
        component: LearnView
      },
      {
        path: '/affairSearch',
        name: 'affairSearchPage',
        component: AffairSearchView
      },
      {
        path: '/affair',
        name: 'affairPage',
        component: AffairView
      },
      {
        path: '/instrumentSearch',
        name: 'instrumentSearchPage',
        component: InstrumentSearchView
      },
      {
        path: '/instrument',
        name: 'instrumentPage',
        component: InstrumentView
      },
      {
        path: '/guide',
        name: 'guidePage',
        component: GuideView
      },{
        path: '/archive',
        name: 'archivePage',
        component: ArchiveView,

      },{
        path: '/exam',
        name: 'examPage',
        component: ExamView
      },
      {
        path: '/examLink',
        name: 'examLink',
        component: ExamLink
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to,from,next)=>{
  if(store.state.online&&to.name==='login'){
    next(false)
  }else{

    if(to.name==='learnPage'||to.name==='guidePage'||to.name==='archivePage'||to.name==='examPage'){
      store.state.ifBackKey = false
    }else {
      store.state.ifBackKey = true
    }
    next()
  }
})
export default router
