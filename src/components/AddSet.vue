<template>
  <div class="task">
    <div class="header-name">管理员设置 / 添加管理员</div>
    <div class="main">
      <div class="task-search-bar">
        管理搜索:
        <a-input :style="{width:'400px',display:'iline-block'}" />
        <div :style="{float:'right'}">
          <a-button :style="{marginLeft:'20px'}" type="primary" @click="showModal(0)">管理添加</a-button>
        </div>
        <table border="1" cellspacing="0">
          <thead>
            <th :style="{width:'5%'}">
              <span>ID</span>
            </th>
            <th :style="{width:'15%'}">
              <span>管理用户名</span>
            </th>
            <th :style="{width:'15%'}">
              <span>添加时间</span>
            </th>
            <th :style="{width:'15%'}">
              <span>最后登录时间</span>
            </th>
            <th :style="{width:'10%'}">
              <span>最后登录IP</span>
            </th>
            <th :style="{width:'10%'}">
              <span>角色名称</span>
            </th>
            <th :style="{width:'5%'}">
              <span>登录状态</span>
            </th>
            <th>
              <span>操作</span>
            </th>
          </thead>
          <tbody>
            <tr v-for="(item,index) in admin_user_list" :key="index">
              <td>{{item.id}}</td>
              <td>{{item.username}}</td>
              <td>{{item.add_time}}</td>
              <td>{{item.last_login_time}}</td>
              <td>{{item.last_login_ip}}</td>
              <td>{{item.group_name}}</td>
              <td>{{item.status}}</td>
              <td :style="{textAlign:'center'}">
                <a-button
                  @click="showModal(item.id,item)"
                  type="primary"
                  :style="{marginRight:'20px',height:'25px',lineHeight:'25px'}"
                >编辑</a-button>
                <a-button @click="showDelModal(item.id)"  type="primary" :style="{height:'25px',lineHeight:'25px'}">删除</a-button>
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
      </div>
      </div>
    </div> 
    <a-modal  :title="title" v-model="visible"   @ok="handleOk" okText="确定" cancelText="取消">
      <a-row  :style="{marginBottom:'10px'}">
        <a-col  :span="4">
          <span class="form-item">账户添加</span>
        </a-col>
        <a-col   :span="20">
          <a-input placeholder="请输入账号"  v-model="form.username"/>
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">输入密码</span>
        </a-col>
        <a-col :span="20">
          <a-input type='password' placeholder="请输入密码"  v-model="form.password"/>
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">重复密码</span>
        </a-col>
        <a-col :span="20">
          <a-input type='password' placeholder="请再次输入密码" v-model="form.confirm_password" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">账号状态</span>
        </a-col>
        <a-col :span="20">
          <a-radio-group v-model="form.status" :defaultValue="1" buttonStyle="solid">
            <a-radio-button :value="1">启用</a-radio-button>
            <a-radio-button :value="0">禁用</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="4">
          <span class="form-item">所属权限组</span>
        </a-col>
        <a-col :span="20">
          <a-select v-model="defaultGroup" style="width: 100%" @change="handleChange">
            <a-select-option v-for="(v) in authGroupList" :key='v.id' :value="v.id">{{v.title}}</a-select-option>           
          </a-select>
        </a-col>
      </a-row>
    </a-modal>
     <a-modal
      title="系统提示"
      :visible="visible2"
      @ok="onConfirm"
      @cancel="handleCancel"
    >
      <p>确定要删除吗？</p>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AddSet",
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      visible: false,
      title: "管理添加",
      admin_user_list: [],
      admin_user_editList: [],
      admin_editList: 11,
      adminId: 1,
      form: {
        username: "",
        password: "",
        confirm_password: "",
        status: 1,
        group_id: ""
      },
      // username:'',
      // password:'',
      // confirm_password:'',
      // status:1,
      // group_id:'',
      authGroupList: [],
      defaultGroup: "",
      visible2: false,
      page: 1,
      pagesize: 10,
      total: 1
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.id 去再次请求数据接口
      this.fetchData(to.query.index);
      this.editAdminer(to.query.index);
    }
  },
  created() {
    var token = sessionStorage.getItem("token");
    this.fetchData(token);
    // this.editAdminer(token);
    //  console.log(this.admin_user_editList);
    this.getAuthGroupList();
  },
  methods: {
    handleCancel() {
      this.visible2 = false;
    },
    // 删除
    onConfirm() {
      let token = sessionStorage.getItem("token");
      let id = this.adminId;
      this.$http
        .post(
          "/admin/admin_user/delete",
          { id },
          {
            headers: {
              token
            }
          }
        )
        .then(res => {
          // console.log(res)
          if (res.data.code == 200) {
            this.visible2 = false;
            this.$message.success("删除成功");
            this.fetchData(token);
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
    // 弹出删除模态框
    showDelModal(id) {
      this.adminId = id;
      this.visible2 = true;
    },
    clearForm() {
      this.form = {
        username: "",
        password: "",
        confirm_password: "",
        status: 1,
        group_id: ""
      };
    },
    getAuthGroupList() {
      let token = sessionStorage.getItem("token");
      this.$http
        .post(
          "/admin/admin_user/authGroupList",
          {},
          {
            headers: {
              token
            }
          }
        )
        .then(res => {
          // console.log(res)
          if (res.data.code == 200) {
            this.authGroupList = res.data.data.auth_group_list;
            (this.defaultValue = res.data.data.auth_group_list[0].title),
              (this.form.group_id = res.data.data.auth_group_list[0].id);
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
    // 弹出添加或者编辑模态框
    showModal(num, item) {
      this.clearForm();
      this.title = num == 0 ? "管理添加" : "编辑";
      this.visible = true;
      this.adminId = num;
      this.defaultGroup = "";
      // console.log(item)
      if (this.title == "编辑") {
        let token = sessionStorage.getItem("token");
        this.$http
          .post(
            "/admin/admin_user/edit",
            {
              id: item.id
            },
            {
              headers: { token }
            }
          )
          .then(res => {
            if (res.data.code == 200) {
              let data = res.data.data.admin_user;
              this.defaultGroup = item.group_name;
              this.authGroupList = res.data.data.auth_group_list;
              this.form = {
                username: data.username,
                password: data.password,
                confirm_password: data.password,
                status: data.status,
                group_id: data.group_id
              };
            }
          });
      }
    },
    handleOk(e) {
      let title = this.title;
      let token = sessionStorage.getItem("token");
      let form = this.form;
      console.log(title);
      if (!this.defaultGroup) {
        this.$message.warning("请选择权限组");
        return false;
      }
      let data = {
        username: form.username,
        password: form.password,
        confirm_password: form.confirm_password,
        status: form.status,
        group_id: form.group_id
      };
      // console.log(data)
      if (title == "管理添加") {
        this.$http
          .post("/admin/admin_user/save", data, {
            headers: {
              token
            }
          })
          .then(res => {
            if (res.data.code == 200) {
              this.visible = false;
              this.$message.success("添加成功");
              this.clearForm();
              this.fetchData(token);
            } else {
              this.$message.warning(res.data.msg);
            }
          });
      } else {
        let option = Object.assign(data, { id: this.adminId });
        this.$http
          .post("/admin/admin_user/update", option, {
            headers: {
              token
            }
          })
          .then(res => {
            // console.log(res)
            if (res.data.code == 200) {
              this.visible = false;
              this.$message.success("更新成功");
              this.clearForm();
              this.fetchData(token);
            } else {
              this.$message.warning(res.data.msg);
            }
          });
      }
    },
    handleChange(value) {
      this.form.group_id = value;
      // console.log(`selected ${value}`);
    },

    fetchData(token) {
      let data = {
        page: this.page,
        pagesize: this.pagesize
      };
      this.$http
        .post("/admin/admin_user/index", data, {
          headers: {
            token: token
          }
        })
        .then(res => {
          // console.log(res);
          if (res.data.code == 200) {
            this.total = res.data.data.total;
            let list = res.data.data.admin_user_list;
            for (let i = 0; i < list.length; i++) {
              list[i].key = list[i].id + "";
              list[i].status = list[i].status == 1 ? "在线" : "离线";
            }
            this.admin_user_list = list;
            //console.log(this.admin_user_list)
          } else {
            this.$message.warning(res.data.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 编辑
    editAdminer(token) {
      var nums = this.adminId;
      this.$http
        .post(
          "/admin/admin_user/edit/id",
          { nums },
          {
            headers: {
              token: token
            }
          }
        )
        .then(res => {
          let admin_user = res.data.data;
          // console.log(admin_user);
          this.admin_user_editList = admin_user;
        })
        .catch(err => {
          console.log(err);
        });
    },
    onChange(e) {
      this.page = e;
      let token=sessionStorage.getItem('token');
      this.fetchData(token);
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
.ant-btn-primary {
  background-color: #01958a;
  border-color: #01958a;
}
.task-search-bar {
  margin-bottom: 5px;
}
table {
  width: 100%;
  margin-top: 10px;
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
.form-item {
  height: 30px;
  line-height: 30px;
}
</style>
