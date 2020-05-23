import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'login'},
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/Index',
        name: 'Index',
        component: () => import('@/components/Index.vue')
      },
      {
        path: '/AllTask',
        name: 'AllTask',
        component: () => import('@/components/AllTask.vue')
      },
      {
        path: '/User',
        name: 'User',
        component: () => import('@/components/User.vue')
      },
      {
        path: '/Audit',
        name: 'Audit',
        component: () => import('@/components/Audit.vue')
      },
      {
        path: '/Programa',
        name: 'Programa',
        component: () => import('@/components/Programa.vue')
      },
      {
        path: '/Type',
        name: 'Type',
        component: () => import('@/components/Type.vue')
      },
      {
        path: '/BlackList',
        name: 'BlackList',
        component: () => import('@/components/BlackList.vue')
      },
      {
        path: '/Vip',
        name: 'Vip',
        component: () => import('@/components/Vip.vue')
      },
      {
        path: '/yonghuchongzhimingxi',
        name: 'yonghuchongzhimingxi',
        component: () => import('@/components/TopUpDetail.vue')
      },
      {
        path: '/Members',
        name: 'Members',
        component: () => import('@/components/Members.vue')
      },
      {
        path: '/Withdrawal',
        name: 'Withdrawal',
        component: () => import('@/components/Withdrawal.vue')
      },
      {
        path: '/AddSet',
        name: 'AddSet',
        component: () => import('@/components/AddSet.vue')
      },
      {
        path: '/Template',
        name: 'Template',
        component: () => import('@/components/Template.vue')
      },
      {
        path: '/Protocol',
        name: 'Protocol',
        component: () => import('@/components/Protocol.vue')
      },
      {
        path: '/Notice',
        name: 'Notice',
        component: () => import('@/components/Index.vue')
      },
      {
        path: '/Regulation',
        name: 'Regulation',
        component: () => import('@/components/Regulation.vue')
      },
      {
        path: '/Help',
        name: 'Help',
        component: () => import('@/components/Help.vue')
      },
      {
        path: '/About',
        name: 'About',
        component: () => import('@/components/About.vue')
      },
      {
        path: '/Recharge',
        name: 'Recharge',
        component: () => import('@/components/Recharge.vue')
      },
      {
        path: '/Deposit',
        name: 'Deposit',
        component: () => import('@/components/Deposit.vue')
      },
      {
        path: '/PreMgr',
        name: 'PreMgr',
        component: () => import('@/components/PreMgr.vue')
      },
      {
        path: '/Daunxinjiekou',
        name: 'Daunxinjiekou',
        component: () => import('@/components/Daunxinjiekou.vue')
      },
      {
        path: '/Xiaoxiguanli',
        name: 'Xiaoxiguanli',
        component: () => import('@/components/Xiaoxiguanli.vue')
      },
      {
        path:'/PriceSet',
        name:'PriceSet',
        component: () => import('@/components/PriceSet.vue'),
      },
      {
        path:'/TopUpDetail',
        name:'TopUpDetail',
        component: () => import('@/components/TopUpDetail.vue'),
      },
      {
        path: '*',
        name: 'Error',
        component: () => import('@/components/Error.vue')
      }
    ]
  }

]
const router = new VueRouter({
  mode: 'history',
  routes
})

/*
*  to:跳转到的地方
*  from：来自哪里
*  next:执行跳转
*/
router.beforeEach((to, from, next) => {
  next()
  // if(to.path==='/login'){
  //   next();
  // }else{
  //    //从vuex中获取数据
  //    let flag=sessionStorage.getItem("isLogin")
  //    if(flag==null||flag==''||flag==false){
  //     next({path: '/login'});
  //    }else{
  //      let menus=sessionStorage.getItem("menus")
  //      console.log(menus)
  //     //  let flag=false
  //     //  for(let i=0;i<menus.length;i++){
  //     //     let subList=menus[i].subList
  //     //     console.log(subList)
  //     //     for(let j=0;j<subList.length;j++){
  //     //       if(subList[j].name==to.paht){
  //     //         flag=true
  //     //       }
  //     //     }
  //     //  }
  //     //  if(flag){
  //       //  }else{
  //         //   next({path: '/Error'});
  //         //  }
  //            next()
  //    }
  // }
})

export default router
