<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0}">
      <div class="logo" style="background-color:none;">瓜分乐管理系统V1.0</div>
      <MenusList @getMenuInfo="getMenuInfo" :list='list'></MenusList>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <div class="header-top">
          <span class="manager-type" @click="changeType(0)" :class="index==0?'selector':''">商家后台管理</span>
          <span
            class="manager-type mt2"
            @click="changeType(1)"
            :class="index==1?'selector':''"
          >APP后台管理</span>
        </div>
      <a-layout-content
        :style="{overflow: 'initial',background:'#ffffff'}"
      >
        <router-view/>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import MenusList from "@/components/MenusList";
export default {
  name: "Home",
  data() {
    return {
      index:1,
      pageUrl:'',
      list:[]
    };
  },
  components: {
    MenusList
  },
  beforeCreate(){
    
  },
  created(){
    let token=sessionStorage.getItem("token");
    this.getMenus(token)
     this.$router.push('Index')
  },
  methods: {
    getMenus(token) {
      this.$http
        .post(
          "/admin/menu/index",
          {},
          {
            headers: {
              token: token
            }
          }
        )
        .then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            this.createMenus(res.data.data)
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    createRouters(data){
       for (let i = 0; i < data.length; i++) {
        if(data[i].pid!=0){
          
        }
       }
    },
    createMenus(data) {
      let rootList=[]
      for (let i = 0; i < data.length; i++) {
        if(data[i].pid==0){
          rootList.push(data[i])
        }
      }
      if(rootList.length>0){
        for(let i=0;i<rootList.length;i++){
          let subList=[]
          for(let j=0;j<data.length;j++){
            if(data[j].pid==rootList[i].id){
               subList.push(data[j])
            }
          }
          rootList[i].subList=subList
        }
        rootList.sort(function(a,b){
          return a.id-b.id;
        })
        this.list=rootList
        this.$store.commit("createMenus", rootList);
      }
    },
    changeType:function(index){
     this.index = index;
     this.$store.commit('changeIndex',index)
     let url =this.pageUrl
     this.$router.push({
          path:url,
          query:{index:index}
    })
    //  if(index==0){
    //       let subList=[{id:12,title:'首页模板管理'},{id:14,title:'用户协议管理'}]
    //       this.list[3].subList=subList
    //   }else{
    //       let subList=[{id:12,title:'首页模板管理'},{id:13,title:'导航栏管理'},{id:14,title:'用户协议管理'}]
    //       this.list[3].subList=subList
    //  }
   },
    getMenuInfo(url){
      this.pageUrl=url
    }
  },
  
};
</script>
<style scoped>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  color: #ffffff;
  margin: 16px;
  text-align: center;
}

.header-top{
  height: 40px;
  background-color: #001529;
  position: relative;
}

.manager-type {
  position: absolute;
  display: inline-block;
  height: 40px;
  width: 100px;
  background-color: #edf0ed;
  color: #b2b5b4;
  text-align: center;
  line-height: 40px;
  top: 0;
}
.manager-type:hover {
  cursor: pointer;
}
.selector {
  background-color: #01958a;
  color: #ffffff;
}
.mt2 {
  left: 100px;
}
</style>
