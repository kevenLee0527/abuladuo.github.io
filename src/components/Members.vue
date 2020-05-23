<template>
  <div class="task">
    <div class="header-name">财务管理 / 用户充值明细</div>
    <div class="main">
        <div class="task-search-bar">
        编号搜索:
        <a-input v-model="orderid" placeholder="请输入提现编号" :style="{width:'400px',display:'iline-block'}" />
        <a-button @click="search" :style="{marginLeft:'10px'}" type="primary">搜索</a-button>
      </div>
      <table border="1" cellspacing="0">
      <thead>
        <th><span>充值账户</span> </th>
        <th><span>充值编号</span></th>
        <th><span>充值时间</span></th>
        <th><span>用户名称</span></th>
        <th><span>充值金额</span></th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in rechargeList" :key="index">
            <td>{{item.withdrawal_account}}</td>
            <td>{{item.orderid}}</td>
            <td>{{item.createtime}}</td>
            <td>{{item.package_name}}</td>
            <td>{{item.amount}}</td> 
        </tr>
      </tbody>
      </table>
      <div :style="{textAlign:'right'}">共计：{{recharge_total}}元</div>
      <div style="text-align:right;padding-top:4px;">
      <a-pagination
        :total="total"
        :pageSize="pagesize"
        :defaultCurrent="1"
        :style="{display:'inline-block'}"
        @change="onChange"
      />
      <span :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}">共{{Math.ceil(total/pagesize)}}页</span>
      </div>
    </div>
    <p>{{total}}</p>
  </div>
</template>

<script>
export default {
  name: "TopUpDetail",
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      checked: true,
      page: 1,
      pagesize:10,
      pay_for:1,
      total:1,
      rechargeList:[],
      orderid:'',
      recharge_total:''
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.id 去再次请求数据接口
      this.fetchData(to.query.index);
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData(id) {
      let token = sessionStorage.getItem("token");
      let { page, pagesize,pay_for } = this;
      let data = {
        page,
        pagesize,
        pay_for,
        order_sn_keyword:id?id:null
      };
      this.$http
        .post("/admin/order/rechargeList", data, {
          headers: {
            token
          }
        })
        .then(res => {
        //   console.log(res)
          if(res.data.code==200){
            let data=res.data.data.recharge_list
            this.rechargeList=data.data;
            this.total=data.total
            this.recharge_total=res.data.data.recharge_total
          }else{
             this.$message.warning(res.data.msg);
          }
        });
    },
   search(){
     let orderid=this.orderid;
       this.page=1;
      //  this.pagesize=10
       this.fetchData(orderid)
    
   },
   onChange(e){
    //    console.log(e)
       this.page=e;
       this.fetchData()
   }
   
  }
};
</script>
<style scoped>
.task {
  background-color: #ffffff;
}
.task-search-bar {
  margin-bottom: 5px;
}
table {
  width: 100%;
}
thead th {
  width: 20%;
  color: #252525;
  text-align: center;
}

thead {
  background-color: #f3f5f7;
}
tbody td {
  text-align: center;
}
table,
th,
td {
  border: 1px solid #ebebeb;
}
.header-name {
  height: 40px;
  border-top: 1px solid #e6e8ea;
  background-color: #edeff1;
  line-height: 40px;
  padding-left: 5px;
}
.userImg {
  width: 100%;
  height: 120px;
  background-color: #ebebeb;
}
.item {
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #e6e8ea;
  padding-left: 10px;
}
.nobor {
  border-bottom: none;
}
.ant-btn-primary {
  background-color: #01958a;
  border-color: #01958a;
}
.ant-switch-checked {
  background-color: #01958a;
}
.task-search-bar {
  margin-bottom: 5px;
}
</style>
