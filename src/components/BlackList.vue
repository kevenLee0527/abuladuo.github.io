<template>
  <div class="task">
    <div class="header-name">会员管理 / 用户黑名单</div>
    <div class="main">
      <div class="task-search-bar">
        用户搜索:
        <a-input @keypress.enter="search"  v-model="form.name" placeholder="请输入用户名" :style="{width:'400px',display:'iline-block'}" />
        <div :style="{float:'right'}">
          会员选项:
          <a-select v-model="form.user_type" style="width: 120px" @change="handleChange">
            <a-select-option value="1">商家用户</a-select-option>
            <a-select-option value="2">普通用户</a-select-option>
          </a-select>
        </div>
      </div>
      <table border="1" cellspacing="0">
      <thead>
        <th :style="{width:'15%'}"><span>用户投头像</span> </th>
        <th :style="{width:'25%'}"><span>名称/账户/时间/认证</span></th>
        <th><span>地区/邮箱/QQ/性别</span></th>
        <th><span>拉黑原因</span></th>
        <th><span>操作</span></th>
      </thead>
      <tbody>
        
        <tr v-for="v in blackList" :key='v.business_id'>
          <td :style="{textAlign:'center'}">
            <img class="userImg" src="../assets/logo.png">
          </td>
          <td>
            <div class="item">{{v.business_username}}</div>
            <div class="item">{{v.business_phone}}</div>
            <div class="item">{{v.business_create_time}}</div>
            <div class="item nobor">
                实名认证：
                 <a-switch :checked="v.is_real_name=='否'?false:true" @change="onChange" />
            </div>
          </td>
          <td>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
            <div class="item nobor"></div>
          </td>
          <td :style="{textAlign:'left'}">
              <span :style="{padding:'5px 5px'}">该用户未进行实名认证</span>
          </td>
          <td :style="{textAlign:'center'}">
            <a-button @click="showModal(v.business_id)" type="primary" :style="{marginBottom:'5px'}">查看证件</a-button><br/>
            <a-button @click="showModal2(v.business_status,v.business_id)" type="primary">解除拉黑</a-button>
          </td>
        </tr>
      </tbody>
      </table>
      <div style="text-align:right;padding-top:4px;">
      <a-pagination
        :total="total"
        :pageSize="pagesize"
        :defaultCurrent="1"
        :style="{display:'inline-block'}"
         @change="onChange"
      />
      <span :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}">共{{Math.ceil(total/pagesize)}}页</span>
       <a-modal
        title="会员详细资料"
        width="700px"
        v-model="visible"
        @ok="handleOk"
        okText="确定"
        cancelText="取消"
      >
        <a-descriptions layout="vertical" :size="size" bordered :column="2">
          <a-descriptions-item label="用户账户">{{detail.business_phone}}</a-descriptions-item>
          <a-descriptions-item label="企业/用户名称">{{detail.business_username}}</a-descriptions-item>
          <a-descriptions-item label="性别">{{detail.business_sex}}</a-descriptions-item>
          <a-descriptions-item label="出生年月日">{{detail.business_birth}}</a-descriptions-item>
          <a-descriptions-item label="QQ">{{detail.business_qq}}</a-descriptions-item>
          <a-descriptions-item label="邮箱">{{detail.business_mail}}</a-descriptions-item>
          <a-descriptions-item label="已绑定手机号">{{detail.business_phone}}</a-descriptions-item>
          <a-descriptions-item label="紧急联系人">{{detail.business_emergency_contact}}</a-descriptions-item>
          <a-descriptions-item label="所属地区" :span="2">{{detail.business_address}}</a-descriptions-item>
          <a-descriptions-item label="详细地址" :span="2">{{detail.business_details_address}}</a-descriptions-item>

          <a-descriptions-item :span="2" label="身份证证件照片">
            <a-row>
              <a-col :span="10" :style="{textAlign:'center'}">
                <!-- <img
                  id="viewerDom"
                  @click="fangda('../assets/idcard.png')"
                  src="../assets/idcard.png"
                  :style="{width:'150px',height:'100px'}"
                /> -->
                <vue-viewer style="display: inline-block" :thumb="business_person_info_id_positive" :full="business_person_info_id_positive"></vue-viewer>
              </a-col>
              <a-col :span="4"></a-col>
              <a-col :span="10" :style="{textAlign:'center'}">
                <!-- <img src="../assets/idcard.png" :style="{width:'150px',height:'100px'}" /> -->
                <vue-viewer style="display: inline-block" :thumb="business_person_info_id_reverse" :full="business_person_info_id_reverse"></vue-viewer>
              </a-col>
            </a-row>
          </a-descriptions-item>
          <a-descriptions-item :span="2" label="营业执照信息">
            <a-row>
              <a-col :span="24" :style="{textAlign:'center'}">
                <vue-viewer style="display: inline-block" :thumb="business_licenses_info_licenses" :full="business_licenses_info_licenses"></vue-viewer>
              </a-col>
            </a-row>
          </a-descriptions-item>
        </a-descriptions>
      </a-modal>
      </div>
    </div>
  </div>
</template>

<script>
let token=sessionStorage.getItem('token');
export default {
  name: "BlackList",
  data() {
    return {
        checked:false,
        size: "small",
        form:{
          name:'',
          user_type:'1'
        },
        blackList:[],
        pagesize:10,
        page:1,
        total:0,
        visible:false,
        visible2:false,
        detail:{},
        business_person_info_id_positive:'',
        business_person_info_id_reverse:'',
        business_licenses_info_licenses:''
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
    fetchData(name) {
      let data={
        name:name?name:null,
        user_type:this.form.user_type,
        business_status:2,
        pagesize:this.pagesize,
        page:this.page
      }
      // console.log(data)
      this.$http.post('/admin/user/index',data,{
        headers:{token}
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
          this.blackList=res.data.data.data;
          this.total=res.data.data.total
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    showModal(business_id) {
      this.visible = true;
      this.detail={};
      this.business_person_info_id_positive='';
          this.business_person_info_id_reverse='';
          this.business_licenses_info_licenses=''
      // this.user_id=business_id;  
      this.$http.post('/admin/user/viewDetails',{
        user_id:business_id,
      },{
        headers:{
          token
        }
      }).then(res=>{
        // console.log(res);
        if(res.data.code==200){
          let data=res.data.data
          this.detail=data;
          this.business_person_info_id_positive=data.user_personInfo.business_person_info_id_positive;
          this.business_person_info_id_reverse=data.user_personInfo.business_person_info_id_reverse;
          this.business_licenses_info_licenses=data.user_licensesInfo.business_licenses_info_licenses
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleOk(e) {
      // console.log(e);
      this.visible = false;
    },
    showModal2(business_status,user_id) {
      // this.visible2 = true;
      let status_type=1
      let user_type=this.form.user_type;
      let data={
        user_type,status_type,user_id
      }
      this.$http.post('/admin/user/userStatus',data,{
        headers:{
          token
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
          let msg=status_type==1?'恢复正常':'拉黑成功'
          this.$message.success(msg);
          this.fetchData()
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleOk2(e) {
      console.log(e);
      this.visible2 = false;
    },
    handleChange(value) {
      console.log(`selected ${value}`);
    },
   onChange(e){
       this.page=e;
       this.fetchData()
   },
    search(){
      let name=this.form.name;
      this.page=1;
      this.fetchData(name)
    },
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
  padding: 5px 0;
  text-align: center;
}
thead {
  background-color: #f3f5f7;
}
tbody td span {
  color: #595959;
  margin-left: 5px;
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
.userImg{
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #EBEBEB;
}
.item{
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #e6e8ea;
  padding-left: 10px;
}
.nobor{
  border-bottom: none;
}
.ant-switch-checked {
    background-color: #01958a;
}
.ant-btn-primary{
    background-color: #01958a;
    border-color: #01958a;
}
</style>
