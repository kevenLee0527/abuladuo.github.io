<template>
  <div class="task">
    <div class="header-name">会员管理 / 全部会员</div>
    <div class="main">
      <div class="task-search-bar">
        用户搜索:
        <a-input @keypress.enter="search" v-model='business_username' placeholder="请输入用户名" :style="{width:'400px',display:'iline-block'}" />
        <div :style="{float:'right'}">
          会员选项:
          <a-select :defaultValue="1" style="width: 120px" @change="handleChange">
            <a-select-option :value="1">商家用户</a-select-option>
            <a-select-option :value="2">普通用户</a-select-option>
          </a-select>
        </div>
      </div>
      <table border="1" cellspacing="0">
        <thead>
          <th :style="{width:'15%'}">
            <span>用户头像</span>
          </th>
          <th :style="{width:'22%'}">
            <span>用户名称/用户账户/VIP剩余时间</span>
          </th>
          <th :style="{width:'23%'}">
            <span>注册时间/最后登录时间/最后登录IP</span>
          </th>
          <th>
            <span>登录状态/实名认证/头像审核</span>
          </th>
          <th>
            <span>查看详情/拉黑用户/会员赠送</span>
          </th>
        </thead>
        <tbody>
          <tr v-for='v in customData' :key='v.business_id'>
            <td :style="{textAlign:'center'}">
              <img class="userImg" :src="v.business_avator?v.business_id:image" />
            </td>
            <td>
              <div class="item">用户名称：{{v.business_username}}</div>
              <div class="item">用户账户：{{v.business_phone}}</div>
              <div class="item nobor">VIP剩余时间：{{v.vip_time_remaining}}</div>
            </td>
            <td>
              <div class="item">注册时间：{{v.business_create_time}}</div>
              <div class="item">最后登录时间：{{v.business_last_time}}</div>
              <div class="item nobor">最后登录IP：{{v.business_last_ip}}</div>
            </td>
            <td>
              <div class="item">登录状态：{{v.login_status}}</div>
              <div class="item">实名认证：{{v.is_real_name}}</div>
              <div class="item nobor">头像审核：{{v.business_is_avatar}}</div>
            </td>
            <td>
              <div class="item">
                <a-button @click="showModal(v.business_id)" :style="{marginLeft:'20px'}" type="primary">查看详情</a-button>
              </div>
              <div class="item">
                <a-button @click="showModal2(v.business_status,v.business_id)" :style="{marginLeft:'20px'}" type="primary">{{v.business_status==1?'拉黑用户':'恢复正常'}}</a-button>
              </div>
              <div class="item nobor">
                <a-input-number
                  :style="{marginLeft:'20px',width:'50px'}"
                  size="small"
                  :min="1"
                  :max="100000"
                  v-model="v.gift_duration"
                  @change="onChange"
                />个月
                <a-button
                  @click='giveVip(v.business_id,v.gift_duration)'
                  :style="{marginLeft:'10px',height:'24px',lineHeight:'24px'}"
                  type="primary"
                >确认</a-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <a-modal
        title="拉黑用户"
        v-model="visible2"
        @ok="handleOk"
        okText="确定"
        cancelText="取消"
      >
      <div>拉黑原因</div>
      <a-textarea placeholder="填写内容不能超过155个字" autoSize :maxLength="155"/>
      </a-modal>
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
      <div style="text-align:right;padding-top:4px;">
        <a-pagination
          :total="5"
          :pageSize="1"
          :defaultCurrent="1"
          :style="{display:'inline-block'}"
        />
        <span
          :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}"
        >共5页</span>
      </div>
    </div>
  </div>
</template>

<script>
 let token=sessionStorage.getItem('token');
export default {
  name: "User",
  data() {
    return {
      visible: false,
      visible2: false,
      size: "small",
      image:
        "https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3427452369,2586833644&fm=173&app=25&f=JPEG?w=580&h=347&s=908FF35A050626E2428C001E030090D6",
      user_type:1,
      customData:[],//用户数据
      business_username:'', //用户名,
      detail:{   //用户详情

      },
      business_person_info_id_positive:'',
      business_person_info_id_reverse:'',
      business_licenses_info_licenses:''
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
    fetchData(name) {
     
      let data={
        user_type:this.user_type,
        name:name?name:null
      }
      // console.log(data,token)
      this.$http
        .post("/admin/user/index", data, {
          headers: {
            token
          }
        })
        .then(res => {
          // console.log(res);
          if(res.data.code==200){
            this.customData=res.data.data.data;
            // console.log(this.customData)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
    },
    // 搜索
    search(){
      let business_username=this.business_username;
      this.fetchData(business_username)
    },
    // 会员赠送
    giveVip(user_id,gift_duration){
      let user_type=this.user_type;
      let data={
        user_type,gift_duration,user_id
      }
      console.log(data)
      if(!gift_duration){
        this.$message.warning('请选择赠送时长');
        return false
      }
      this.$http.post('/admin/user/giveVip',data,{
        headers:{
          token
        }
      }).then(res=>{
        console.log(res);
        if(res.data.code==200){
          this.$message.success('赠送成功');
          this.fetchData()
        }else{
          this.$message.warning(res.data.msg)
        }
      })
    },
    //切换用户
    handleChange(value) {
      this.user_type=value;
      this.fetchData()
    },
    onChange(value) {
      console.log("changed", value);
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
        console.log(res);
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
      let status_type=business_status==1?2:1;
      let user_type=this.user_type;
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
    fangda(item) {
      ViewerDom.show();
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
.userImg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
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
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
</style>
