import { createStore } from 'vuex'
import {TalkHistory} from "@/assets/api";

export default createStore({
  state: {
    back_title: "",
    online: false,
    sidebar_fold: false,
    email_for_registry: " ",
    avatar_url: require("@/assets/avatar.jpg"),
    nick_name: "NickName",
    email: "3336970253@qq.com",
    ifBackKey: false,
    token: '',
    role:'',
    permission:'',
    talkBarAppend: false,
    talkHistories: new Array<TalkHistory>()
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
