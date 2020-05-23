<template>
  <div class="task">
    <div class="header-name">API接口管理 / 提现接口管理</div>
    <div class="main">
      <a-card title="微信支付配置">
        <a-col :span="24" :style="{marginBottom:'10px'}">
            <span>支付方式</span>
            <a-radio-group :style="{marginLeft:'10px'}" defaultValue="a" buttonStyle="solid">
              <a-radio-button value="a">开启</a-radio-button>
              <a-radio-button value="b">关闭</a-radio-button>
            </a-radio-group>
          </a-col>
        <a-form
          :form="form"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 12 }"
          @submit="handleSubmit"
        >
          <a-form-item label="微信AppID">
            <a-input
              v-decorator="['appid', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item label="AppSecret">
            <a-input
              v-decorator="['number', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item label="微信MCH_ID">
            <a-input
              v-decorator="['number', { rules: [{ required: true, message: 'Please input your note!' }] }]"
            />
          </a-form-item>
          <a-form-item label="微信KEY值">
            <a-input
              v-decorator="['key', { rules: [{ required: true, message: 'Please input your note!' }] }]"
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
  name: "Deposit",
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      value: 1
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.id 去再次请求数据接口
      this.fetchData(to.query.index);
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
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
