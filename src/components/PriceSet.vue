<template>
  <div class="task">
    <div class="header-name">财务管理 / VIP价格设置</div>
    <div class="main">
        <div class="main-item">
            <span>1个月会员价格设置：</span>
            <a-input v-model="priceData['一个月会员']" :style="{width:'400px',display:'iline-block'}" />
            <a-button @click="modifyPrice('1',priceData['一个月会员'])" :style="{marginLeft:'10px'}" type="primary">确认修改</a-button>
        </div>
        <div class="main-item">
            <span>3个月会员价格设置：</span>
            <a-input v-model="priceData['三个月会员']" :style="{width:'400px',display:'iline-block'}" />
            <a-button @click="modifyPrice('2',priceData['三个月会员'])" :style="{marginLeft:'10px'}" type="primary">确认修改</a-button>
        </div>
        <div class="main-item">
            <span>1年会员价格设置：</span>
            <a-input v-model="priceData['一年会员']" :style="{width:'400px',display:'iline-block'}" />
            <a-button @click="modifyPrice('1',priceData['一年会员'])" :style="{marginLeft:'10px'}" type="primary">确认修改</a-button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PriceSet",
  data() {
    return {
       priceData:{}
    };
  },
  watch: {
    '$route': function (to, from) {
　　　　// 拿到目标参数 to.query.id 去再次请求数据接口
　　　　this.fetchData(to.query.index)
　　}
  },
  created(){
    this.fetchData()
  },
  methods: {
    fetchData(){
      let token=sessionStorage.getItem('token')
      this.$http.post('/admin/system/packageChange',{},{
        headers:{
          token
        }
      }).then(res=>{
        // console.log(res);
        if(res.data.code==200){
            this.priceData=res.data.data
        }else{
            this.$message.warning(res.data.msg)
        }
      })
    },
    modifyPrice(vip_type,present_price){
      let token=sessionStorage.getItem('token');
      let data={
        vip_type,
        present_price
      }
      this.$http.post('/admin/system/updateVipPrice',data,{
        headers:{
          token
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
           this.$message.success('修改成功')
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    }
  }
};
</script>
<style scoped>
.task {
  background-color: #ffffff;
}

.header-name {
  height: 40px;
  border-top: 1px solid #e6e8ea;
  background-color: #edeff1;
  line-height: 40px;
  padding-left: 5px;
}
.userImg{
  width: 100%;
  height: 120px;
  background-color: #EBEBEB;
}

.ant-btn-primary{
    background-color: #01958a;
    border-color: #01958a;
}
.main-item{
    padding:4px 0;
}
</style>
