import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentIndex:1,
    currentName:'',
    pageUrl:'',
    isLogin:sessionStorage.getItem("isLogin"),
    token:sessionStorage.getItem("token"),
    menus:sessionStorage.getItem("menus")
  },
  mutations: {
    createMenus(state,provider){
      state.menus=provider
      sessionStorage.setItem("menus",provider)
    },
    changeIndex(state,index){
      state.currentIndex=index

    },
    changeName(state,name){
      state.currentName=name

    },
    changePageUrl(state,pageUrl){
      state.pageUrl=pageUrl

    },
    userLogin(state,provider){
      state.isLogin=true
      state.token=provider
      sessionStorage.setItem("isLogin",true);
      sessionStorage.setItem("token",provider);
    },
    userLogout(state,provider){
      state.isLogin=false
      state.token=provider
      sessionStorage.setItem("isLogin",false);
      sessionStorage.setItem("token","");
    }
  },
  actions: {
  },
  modules: {
  }
})
