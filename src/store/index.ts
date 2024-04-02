import { createStore } from 'vuex'

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
    token: ''
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
