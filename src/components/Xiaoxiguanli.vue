<template>
  <div class="task">
    <div class="header-name">消息管理中心 / 消息管理</div>
    <div class="main">
      <a-card title="消息配置">
        <a-form
          :form="form"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 12 }"
          @submit="handleSubmit"
        >
          <a-form-item label="消息内容">
            <a-input 
              v-decorator="['message', { rules: [{ required: true, message: '请输入消息内容!' }] }]"
            />
          </a-form-item>
          <a-form-item label="消息提示">
            <a-select 
              v-decorator="[
          'automatic_prompt',
          { rules: [{ required: true, message: '请选择消息提示!' }] },
        ]"
        placeholder="请选择消息提示"
           >
            <a-select-option value="1">
          自动提示
        </a-select-option>
        <a-select-option value="2">
          不自动提示
        </a-select-option>
            </a-select>
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
  created() {
    this.systemMessage();
  },
  methods: {
    systemMessage() {
      let token = sessionStorage.getItem("token");
      this.$http
        .post(
          "/admin/system/systemMessage",
          {},
          {
            headers: {
              token
            }
          }
        )
        .then(res => {
          if (res.data.code == 200) {
            console.log(res);
            let {message,message_id,automatic_prompt}=res.data.data;
            automatic_prompt=automatic_prompt==1?'自动提示':'不自动提示'
            this.form.setFieldsValue({
              message,automatic_prompt
            });
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, value) => {
        if (!err) {
          //  console.log(value)
          let token = sessionStorage.getItem("token");
          let {
            message,
            automatic_prompt
          } = value;
          this.$http
            .post(
              "/admin/system/updateSystemMessage",
              {
                message,
                automatic_prompt
              },
              {
                headers: {
                  token
                }
              }
            )
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success("提交成功");
              } else {
                this.$message.warning(res.data.msg);
              }
            });
        }
      });
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
