<template>
  <div class="task">
    <div class="header-name">API接口管理 / 充值接口管理</div>
    <div class="main">
      <a-card title="短信配置">
        <a-form
          :form="form"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 12 }"
          @submit="handleSubmit"
        >
          <a-form-item label="accessKeyId">
            <a-input 
              v-decorator="['accessKeyId', { rules: [{ required: true, message: '请输入accessKeyId' }] }]"
            />
          </a-form-item>
          <a-form-item label="accessKeySecret">
            <a-input 
              v-decorator="['accessKeySecret', { rules: [{ required: true, message: 'accessKeySecret!' }] }]"
            />
          </a-form-item>
          <a-form-item label="模板code1">
            <a-input 
              v-decorator="['模板code1', { rules: [{ required: true, message: '模板code1!' }] }]"
            />
          </a-form-item>
           <a-form-item label="模板code2">
            <a-input 
              v-decorator="['模板code2', { rules: [{ required: true, message: '模板code2!' }] }]"
            />
          </a-form-item>
           <a-form-item label="模板code3">
            <a-input 
              v-decorator="['模板code3', { rules: [{ required: true, message: '模板code3!' }] }]"
            />
          </a-form-item>
           <a-form-item label="模板code4">
            <a-input 
              v-decorator="['模板code4', { rules: [{ required: true, message: '模板code4!' }] }]"
            />
          </a-form-item>
           <a-form-item label="模板code5">
            <a-input 
              v-decorator="['模板code5', { rules: [{ required: true, message: '模板code5!' }] }]"
            />
          </a-form-item>
           <a-form-item label="模板code6">
            <a-input 
              v-decorator="['模板code6', { rules: [{ required: true, message: '模板code6!' }] }]"
            />
          </a-form-item>
           <a-form-item label="签名">
            <a-input 
              v-decorator="['签名', { rules: [{ required: true, message: '签名!' }] }]"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">确认提交</a-button>
          </a-form-item>
        </a-form>
      </a-card>
     
    </div>
  </div>
</template>

<script>
export default {
  name: "Recharge",
  data() {
    return {
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  created(){
    this.smsConfig()
  },
  methods:{
    smsConfig(){
      let token=sessionStorage.getItem('token')
      this.$http.post('/admin/system/smsConfig',{},{
        headers:{
          token
        }
      }).then(res=>{
        if(res.data.code==200){
          let {accessKeySecret,accessKeyId,模板code1,模板code2,模板code3,模板code4,模板code5,模板code6,签名}=res.data.data;
           this.form.setFieldsValue({
             accessKeySecret,accessKeyId,模板code1,模板code2,模板code3,模板code4,模板code5,模板code6,签名
           })
        }else{
          this.$message.warning(res.data.msg);
        }
      })
    },
    handleSubmit(e){
      e.preventDefault();
       this.form.validateFields((err,value)=>{
         if(!err){
          //  console.log(value)
           let token=sessionStorage.getItem('token')
           let {accessKeySecret,accessKeyId,模板code1,模板code2,模板code3,模板code4,模板code5,模板code6,签名}=value;
           this.$http.post('/admin/system/updateSmsConfig',{
             sms_config:{
               accessKeySecret,accessKeyId,模板code1,模板code2,模板code3,模板code4,模板code5,模板code6,签名
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
