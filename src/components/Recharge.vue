<template>
  <div class="task">
    <div class="header-name">API接口管理 / 充值接口管理</div>
    <div class="main">
      <a-card title="微信配置">
        <a-form
          :form="form"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item label="微信AppID">
            <a-input 
              v-decorator="['wx_appid', { rules: [{ required: true, message: '请输入appid' }] }]"
            />
          </a-form-item>
          <a-form-item label="微信商户号">
            <a-input 
              v-decorator="['wx_mech_id', { rules: [{ required: true, message: '请输入微信商户号!' }] }]"
            />
          </a-form-item>
          <a-form-item label="微信KEY值">
            <a-input 
              v-decorator="['wx_key', { rules: [{ required: true, message: '请微信KEY值!' }] }]"
            />
          </a-form-item>
          <a-form-item label="微信AppSecret">
            <a-input 
              v-decorator="['wx_AppSecret', { rules: [{ required: true, message: '请微信AppSecret!' }] }]"
            />
          </a-form-item>
          <!-- <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">确认提交</a-button>
          </a-form-item> -->
        </a-form>
      </a-card>
      <a-card :style="{marginTop:'10px'}" title="支付宝支付配置">
        <a-row>
          <a-col :span="24">
            <span>支付方式</span>
            <a-radio-group :style="{marginLeft:'10px'}" v-model="zfb_status" :defaultValue="zfb_status" buttonStyle="solid">
              <a-radio-button value="1">开启</a-radio-button>
              <a-radio-button value="2">关闭</a-radio-button>
            </a-radio-group>
          </a-col>
          <a-col :span="24" :style="{marginTop:'10px'}">
            <!-- <div><span>使用支付宝版本</span></div>
            <a-radio-group :style="{marginLeft:'10px'}" @change="onChange" v-model="zfb.edition">
              <div><a-radio value="1">新版本接口，支持php5.5.0或更高版本(阿里云空间必须7.0或以上)</a-radio></div>
              <div><a-radio  value="2">旧版本接口，可以支持php5.4或以上版本</a-radio></div>
            </a-radio-group> -->
            <a-form
            :style="{marginTop:'10px'}"
          :form="form2"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 12 }"
          @submit="handleSubmit2"
        >
          <a-form-item label="支付宝AppID">
            <a-input
              v-decorator="['zfb_appid', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item label="商户私钥">
            <a-input 
              v-decorator="['zfb_privateKey', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item label="支付宝公钥">
            <a-input
              v-decorator="['zfb_publicKey', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">确认提交</a-button>
          </a-form-item>
        </a-form>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recharge",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      form2: this.$form.createForm(this, { name: "coordinated" }),
      value: 1,
      zfb_status:''
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.id 去再次请求数据接口
      this.fetchData(to.query.index);
    }
  },
  created(){
    this.getpayConfig()
  },
  methods: {
    getpayConfig(){
      let token=sessionStorage.getItem('token')
      this.$http.post('/admin/system/payConfig',{},{
        headers:{
          token
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.code==200){
          let data=res.data.data;
          let {wx_AppSecret,wx_appid,wx_key,wx_mech_id,zfb_appid,zfb_edition,zfb_privateKey,zfb_publicKey,zfb_status}=data
          this.form.setFieldsValue({
            wx_AppSecret,wx_appid,wx_key,wx_mech_id
          })
          this.form2.setFieldsValue({
            zfb_appid,zfb_privateKey,zfb_publicKey
          })
          // this.zfb.edition=zfb_edition;
          this.zfb_status=zfb_status
        }else{
           this.$message.warning(res.data.msg);
        }
        
      })
    },
    handleSubmit2(e) {
      e.preventDefault();
      this.form.validateFields((err, value1) => {
        if (!err) {
         this.form2.validateFields((err,value2)=>{
           if(!err){
            let {wx_AppSecret,wx_appid,wx_key,wx_mech_id}=value1;
            let {zfb_appid,zfb_privateKey,zfb_publicKey}=value2;
            let zfb_status=this.zfb_status;
            let token=sessionStorage.getItem('token')
            this.$http.post('admin/system/updatePayConfig',{
             pay_config:{
                wx_AppSecret,wx_appid,wx_key,wx_mech_id,
              zfb_appid,zfb_privateKey,zfb_publicKey,zfb_status
             }
            },{
              headers:{
                token
              }
            }).then(res=>{
              if(res.data.code==200){
                 this.$message.success('提交成功');
              }else{
                 this.$message.warning(res.data.msg);
              }
            })
           }
         })
        }
      });
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      });
    },
    onChange(e) {
      console.log('radio checked', e.target.value);
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
.userImg {
  width: 100%;
  height: 120px;
  background-color: #ebebeb;
}

.ant-btn-primary {
  background-color: #01958a;
  border-color: #01958a;
}
.main-item {
  padding: 4px 0;
}
</style>
