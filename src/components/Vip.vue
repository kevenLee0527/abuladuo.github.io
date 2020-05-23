<template>
  <div class="task">
    <div class="header-name">会员管理 / VIP权益说明</div>
    <div class="main">
      <a-textarea
      placeholder="暂无权益说明"
      :style="{height:'300px'}"
      :value="content"
    />
    <div :style="{textAlign:'right',paddingTop:'4px'}">
        <!-- <a-button type="primary">确认修改</a-button> -->
    </div>
    </div>
  </div>
</template>

<script>
let token=sessionStorage.getItem('token')
export default {
  name: "Vip",
  data() {
    return {
      content:'11'
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
    fetchData() {
      this.$http.post('/admin/article/edit',{
        id:19
      },{
        headers:{token}
      }).then(res=>{
        // console.log(res);
        if(res.data.code==200){
          this.content=res.data.data.article.content
        }
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`);
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
.ant-btn-primary{
    background-color: #01958a;
    border-color: #01958a;
}
</style>
