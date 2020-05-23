<template>
  <div class="login">
    <div class="from">
      <div class="login-from-tit">瓜分乐后台管理</div>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
        :style="{textAlign:'center'}"
      >
        <a-form-item>
          <a-input
            :style="{width:'250px'}"
            v-decorator="[
          'username',
          { rules: [{ required: true, message: '请输入账号' }] },
        ]"
            placeholder="账号"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            :style="{width:'250px'}"
            v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码' }] },
        ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            :style="{width:'130px',position:'relative',left:'-10px'}"
            v-decorator="[
              'verify',
              { rules: [{ required: true, message: '请输入验证码' }] },
            ]"
          />
          <img
            class="codeImg"
            @click="getCode"
            :style="{width:'100px',height:'32px'}"
            :src="codeUrl"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            :loading="loading"
            :style="{width:'250px'}"
            type="primary"
            html-type="submit"
            class="login-form-button"
          >登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loading: false
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  created() {
    this.$http
      .post("/admin/login/verifyCode", {})
      .then(res => {
        if (res.data.code == 200) {
          this.codeUrl = res.data.data.vcode;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          //console.log(values);
          this.loading = true;
          var params = new URLSearchParams();
          params.append("username", values.username);
          // params.append("password", values.password);
          params.append("verify", values.verify);
          this.$http
            .post("/admin/login/login", params)
            .then(res => {
              this.loading = false;
              //console.log(res);
              if (res.data.code == 200) {
                this.$store.commit("userLogin", res.data.data.token);
                this.$router.push("/Index");
              } else {
                this.$warning({
                  title: "系统提示",
                  content: res.data.msg
                });
              }
            })
            .catch(err => {
              this.loading = false;
              console.log(err);
            });
        }
      });
    },
    getCode() {
      this.$http
        .post("/admin/login/verifyCode", {})
        .then(res => {
          if (res.data.code == 200) {
            this.codeUrl = res.data.data.vcode;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.login {
  background-color: #01958a;
  overflow: hidden;
  height: 100vh;
  position: fixed;
  top: 0;
  width: 100%;
}
.from {
  position: absolute;
  width: 350px;
  height: 400px;
  background-color: #ffffff;
  top: 0;
  bottom: 0;
  margin-top: auto;
  margin-bottom: auto;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  border-radius: 5px;
}
.login-from-tit {
  text-align: center;
  font-weight: bold;
  color: #01958a;
  padding: 20px 0;
  font-size: 30px;
}
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.ant-btn-primary {
  background-color: #01958a;
  border-color: #01958a;
}
.codeImg:hover {
  cursor: pointer;
}
</style>