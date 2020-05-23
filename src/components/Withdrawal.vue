<template>
  <div class="task">
    <div class="header-name">财务管理 / 用户提现明细</div>
    <div class="main">
      <div class="from_wrap">
        <div class="task-search-bar">
          编号搜索:
          <a-input
            v-model="order_sn_keyword"
            placeholder="请输入提现编号"
            :style="{width:'400px',display:'iline-block'}"
          />
          <a-button @click="search" :style="{marginLeft:'10px'}" type="primary">搜索</a-button>
        </div>
        <div>
          <a-button @click="classify('0')" :style="{marginLeft:'10px'}" type="primary">全部</a-button>
          <a-button @click="classify('1')" :style="{marginLeft:'10px'}" type="primary">申请中</a-button>
          <a-button @click="classify('2')" :style="{marginLeft:'10px'}" type="primary">同意申请</a-button>
          <a-button @click="classify('3')" :style="{marginLeft:'10px'}" type="primary">申请失败</a-button>
        </div>
      </div>
      <table border="1" cellspacing="0">
        <thead>
          <th>
            <span>商户账号</span>
          </th>
          <th>
            <span>商户名称</span>
          </th>
          <th>
            <span>提现编号</span>
          </th>
          <th>
            <span>提现金额</span>
          </th>
           <th>
            <span>提现状态</span>
          </th>
           <th>
            <span>操作</span>
          </th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in withdrawList" :key="index">
            <td>{{item.withdrawal_account}}</td>
            <td>{{item.business_name}}</td>
            <td>{{item.order_sn}}</td>
            <td>{{item.money}}</td>
            <td>{{showStatus(item.status)}}</td>
            <td>
              <a-button @click="verify(item.id,2,item.status)" :style="{marginLeft:'10px'}" type="primary">通过</a-button>
              <a-button @click="verify(item.id,3,item.status)" :style="{marginLeft:'10px'}" type="primary">拒绝</a-button>
            </td>
          </tr>
        </tbody>
      </table>
      <div :style="{textAlign:'right'}">共计：{{withdraw_total}}元</div>
      <div style="text-align:right;padding-top:4px;">
        <a-pagination
          :total="total"
          :pageSize="pagesize"
          :defaultCurrent="1"
          :style="{display:'inline-block'}"
           @change="onChange"
        />
        <span
          :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}"
        >共5页</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Withdrawal",
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      checked: true,
      page: 1,
      pagesize: 10,
      status: "0",
      order_sn_keyword: "",
      withdrawList: [],
      total:0,
      withdraw_total:''
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
    // 审核是通过还是拒绝
    verify(withdraw_id,status_type,status){
      if(status==3 && status_type==3){
        this.$message.warning('当前状态处于拒绝状态');
        return false
      }
      let data={
        withdraw_id,status_type
      }
	  console.log(data)
      let token=sessionStorage.getItem('token')
      this.$http.post('/admin/order/withdrawList',data,{
        headers:{
          token
        }
      }).then(res=>{
        if(res.data.code==200){
			this.$message.success('操作成功');
			this.fetchData()
		}else{
			this.$message.success('操作失败')
		}
      })
    },
    // 根据状态码确定返回状态
    showStatus(status){
      let str=''
      switch (status) {
        case 1:
          str='申请中'
          break;
        case 2:
          str='同意申请'
          break;
        case 3:
          str='申请失败'
          break;
      }
      return str
    },
    // 获取提现列表
    fetchData(id) {
      let token = sessionStorage.getItem("token");
      this.status='0'
      let { page, pagesize, status } = this;
      let data = {
        page,
        pagesize,
        status,
        order_sn_keyword: id ? id : null
      };
      this.$http
        .post("/admin/order/withdrawList", data, {
          headers: {
            token
          }
        })
        .then(res => {
          if(res.data.code==200){
			  let data = res.data.data;
			  this.withdrawList = data.withdraw_list.data;
			  this.total=data.withdraw_list.total;
			  this.withdraw_total=data.withdraw_total
		  }else{
			  this.$message.warning(res.data.msg)
		  }
        });
    },
    // 分页功能
    onChange(e) {
      this.page=e;
      this.fetchData()
    },
    // 搜索功能
    search(){
       let order_sn_keyword=this.order_sn_keyword;
       this.page=1;
       this.pagesize=10
       this.fetchData(order_sn_keyword)
    },
    // 分类按钮 全部 申请中 同意申请 申请失败
    classify(status){
      let token = sessionStorage.getItem("token");
      this.page=1;
      this.pagesize=10
      let id=this.order_sn_keyword;
      let data = {
        page:this.page,
        pagesize:this.pagesize,
        status,
        order_sn_keyword: id ? id : null
      };
      // console.log(data);
      this.$http
        .post("/admin/order/withdrawList", data, {
          headers: {
            token
          }
        })
        .then(res => {
          let data = res.data.data;
          this.withdrawList = data.withdraw_list.data;
          this.total=data.withdraw_list.total;
          this.withdraw_total=data.withdraw_total 
        });
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
.from_wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
table {
  width: 100%;
}
thead th {
  width: 16.6%;
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
</style>
