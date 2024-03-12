import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistryView from "@/views/RegistryView.vue";
import CheckEmailView from "@/views/CheckEmailView.vue"
import SignView from "@/views/SignView.vue"
import MainView from "@/views/MainView.vue";

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
    name: 'mainPage',
    component: MainView

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
