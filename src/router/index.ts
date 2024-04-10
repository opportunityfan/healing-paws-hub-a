import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegistryView from "@/views/RegistryView.vue";
import CheckEmailView from "@/views/CheckEmailView.vue"
import SignView from "@/views/SignView.vue"
import LearnView from "@/views/LearnViews/LearnView.vue";
import MainView from "@/views/MainView.vue";
import GuideView from "@/views/GuideView.vue";
import ArchiveView from "@/views/ArchiveViews/ArchiveView.vue";
import ExamView from "@/views/ExamView.vue";
import AffairView from "@/views/LearnViews/AffairView.vue";
import AffairSearchView from "@/views/LearnViews/AffairSearchView.vue";
import AffairNodeEditView from "@/views/LearnViews/AffairNodeEditView.vue"
import ArchiveDetailView from "@/views/ArchiveViews/ArchiveDetailView.vue";
import ArchiveSearchResultsView from "@/views/ArchiveViews/ArchiveSearchResultsView.vue";
import ExamLink from "@/views/ExamLink.vue";
import store from "@/store";
import InstrumentSearchView from "@/views/LearnViews/InstrumentSearchView.vue";
import InstrumentView from "@/views/LearnViews/InstrumentView.vue";
import AffairNodeView from "@/views/LearnViews/AffairNodeView.vue";
import EditView from "@/views/UserView/EditView.vue";
import ExamStart from "@/views/ExamStart.vue";
import ExamTest from "@/views/ExamTest.vue";
import ExamRecordView from "@/views/ExamRecordView.vue";
import RoleSelectView from "@/views/UserView/RoleSelectView.vue";
import ArchiveManagementView from "@/views/ArchiveViews/ArchiveManagementView.vue"
import ExamManageView from "@/views/ExamManageView.vue";
import ExamAddView from "@/views/ExamAddView.vue";
import ExamUpdateView from "@/views/ExamUpdateView.vue";
import SubjectView from "@/views/SubjectView.vue";
import SubjectAddView from "@/views/SubjectAddView.vue";
import SubjectUpdateView from "@/views/SubjectUpdateView.vue";
import ManageMainView from "@/views/ManageViews/ManageMainView.vue";
import AffairManageSearchView from "@/views/ManageViews/AffairManageViews/AffairManageSearchView.vue";
import AffairManageView from "@/views/ManageViews/AffairManageViews/AffairManageView.vue";
import AffairNodeMangeView from "@/views/ManageViews/AffairManageViews/AffairNodeMangeView.vue";

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
        path: '/roleSelect',
        name: 'roleSelectPage',
        component: RoleSelectView
      },
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
        path: '/affair/:affairId',
        name: 'affairPage',
        component: AffairView,
        props: true
      },
      {
        path: '/affairNode/:nodeId',
        name: 'affairNodePage',
        component: AffairNodeView,
        props: true
      },
      {
        path: '/affair-node-edit/:nodeId',
        name: 'affair-node-edit',
        component: AffairNodeEditView,
        props: true
      },
      {
        path: '/instrumentSearch',
        name: 'instrumentSearchPage',
        component: InstrumentSearchView
      },
      {
        path: '/instrument/:instrumentId',
        name: 'instrumentPage',
        component: InstrumentView,
        props: true
      },
      {
        path: '/guide',
        name: 'guidePage',
        component: GuideView
      },
      {
        path: '/archive',
        name: 'archivePage',
        component: ArchiveView,
      },
      {
        path: '/archiveDetail/:archiveId',
        name: 'archiveDetailPage',
        component: ArchiveDetailView
      },
      {
        path: '/archive/:diseaseNames',
        name: 'archiveSearchResults',
        component: ArchiveSearchResultsView
      },
      {
        path: '/archive/management',
        name: 'archiveManagementPage',
        component: ArchiveManagementView
      },
      {
        path: '/exam',
        name: 'examPage',
        component: ExamView
      },
      {
        path: '/examLink',
        name: 'examLink',
        component: ExamLink
      },
      {
        path: '/edit',
        name: 'editPage',
        component: EditView
      },
      {
        path: '/examStart/:id',
        name: 'examStart',
        component: ExamStart
      },
      {
        path: '/examTest/:id',
        name: 'examTest',
        component: ExamTest
      },
      {
        path: '/examRecord/:id',
        name: 'examRecord',
        component: ExamRecordView
      },
      {
        path: '/examManage',
        name: 'examManage',
        component: ExamManageView
      },
      {
        path: '/examAdd',
        name: 'examAdd',
        component: ExamAddView
      },
      {
        path: '/examUpdate/:id',
        name: 'examUpdate',
        component: ExamUpdateView
      },
      {
        path: '/subject',
        name: 'subject',
        component: SubjectView
      },
      {
        path: '/subjectAdd',
        name: 'subjectAdd',
        component: SubjectAddView
      },
      {
        path: '/subjectUpdate/:id',
        name: 'subjectUpdate',
        component: SubjectUpdateView
      },
      {
        path:'/manageMain',
        name:'manageMainPage',
        component: ManageMainView
      },
      {
        path:'/affairManageSearch',
        name:'affairManageSearchPage',
        component: AffairManageSearchView
      },
      {
        path:'/affairManage/:affairId',
        name:'affairManagePage',
        component: AffairManageView,
        props: true
      },
      {
        path:'/affairNodeManage/:affairNodeId',
        name:'affairNodeManagePage',
        component: AffairNodeMangeView,
        props: true
      }
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
    if(to.name==='learnPage'||to.name==='guidePage'||to.name==='archivePage'||to.name==='examPage'||to.name==='editPage'||to.name==='manageMainPage'){
      store.state.ifBackKey = false
    }else {
      store.state.ifBackKey = true
    }

    console.log(from.path)
    next()
  }
})
export default router
