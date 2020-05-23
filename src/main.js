import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ImageViewer from 'vue2-viewer';
import VueQuillEditor from 'vue-quill-editor'
import './views/css/quill.core.css'
import './views/css/quill.snow.css'
import './views/css/quill.bubble.css'
import axios from 'axios'
axios.defaults.baseURL="https://api.guafenle.com"
// axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.prototype.$http=axios
Vue.use(VueQuillEditor)
Vue.use(ImageViewer)
Vue.use(Antd)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
