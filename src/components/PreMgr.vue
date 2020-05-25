<template>
  <div class="task">
    <div class="header-name">管理员设置 / 权限组设置</div>
    <div class="main">
      <div class="nav-bar">
        <a-button @click="cz(0)" type="primary" icon="plus" :style="{marginRight:'10px'}">添加</a-button>
        <a-button @click="cz(1)" type="primary" icon="build" :style="{marginRight:'10px'}">授权</a-button>
        <a-button @click="cz(2)" type="primary" icon="form" :style="{marginRight:'10px'}">编辑</a-button>
        <a-button @click="cz(3)" type="primary" icon="delete">删除</a-button>
      </div>
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :style="{marginTop:'5px'}"
        :pagination="false"
        :columns="columns"
        :dataSource="data"
        size="small"
      ></a-table>
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
      <a-modal :title="title" v-model="visible" @ok="hideModal" okText="确认" cancelText="取消">
        <div v-if="index==0||index==2">
          <a-row :style="{marginBottom:'10px'}">
            <a-col :span="4">
              <span class="form-item">名称</span>
            </a-col>
            <a-col :span="20">
              <a-input placeholder="请输入名称" v-model="name" />
            </a-col>
          </a-row>
          <a-row :style="{marginBottom:'10px'}">
            <a-col :span="4">
              <span class="form-item">状态</span>
            </a-col>
            <a-col :span="20">
              <a-radio-group v-model="status" defaultValue="1" buttonStyle="solid">
                <a-radio-button :value="1">启用</a-radio-button>
                <a-radio-button :value="0">禁用</a-radio-button>
              </a-radio-group>
            </a-col>
          </a-row>
        </div>
        <div v-else>
          <a-tree
            checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @select="onSelect"
            :selectedKeys="selectedKeys"
            :treeData="treeData"
          />
        </div>
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
  </div>
</template>

<script>
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },
  {
    title: "名称",
    dataIndex: "title",
    key: "title"
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status"
  }
];
const treeData = [
  {
    title: "系统管理",
    key: "0",
    children: [
      {
        title: "网站信息",
        key: "0-0"
      }
    ]
  },
  {
    title: "任务管理",
    key: "1",
    children: [
      {
        title: "全部任务管理",
        key: "1-0"
      },
      {
        title: "申述审核管理",
        key: "1-1"
      },
      {
        title: "任务栏目管理",
        key: "1-2"
      },
      {
        title: "任务类型添加",
        key: "1-3"
      }
    ]
  },
  {
    title: "会员管理",
    key: "2",
    children: [
      {
        title: "全部用户管理",
        key: "2-0"
      },
      {
        title: "黑名单管理",
        key: "2-1"
      }
    ]
  }
];
export default {
  name: "PreMgr",
  data() {
    return {
      data: [],
      columns,
      selectedRowKeys: [],
      visible: false,
      visible2: false,
      index: 0,
      title: "",
      name: "",
      status: 0,

      // 树
      expandedKeys: ["0-0"],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData,
      page:1,
      pagesize:10,
      total:1
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.index 去再次请求数据接口
      this.fetchData();
    },
    checkedKeys(val) {
      // console.log("onCheck", val);
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    clearForm() {
      this.name = "";
      this.status = 1;
    },
    //权限列表
    fetchData() {
      let token = sessionStorage.getItem("token");
       let data = {
        page: this.page,
        pagesize: this.pagesize
      };
      this.$http
        .post(
          "/admin/admin_user/authGroupList",
          data,
          {
            headers: {
              token: token
            }
          }
        )
        .then(res => {
          // console.log(res)
          if(res.data.code==200){
            this.total=res.data.data.total
            let list = res.data.data.auth_group_list;
          for (let i = 0; i < list.length; i++) {
            list[i].key = list[i].id + "";
            list[i].status = list[i].status == 1 ? "已启用" : "禁止";
          }
          this.data = list;
          }else{
             this.$message.warning(res.data.msg);
          }
          
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确认删除
    onConfirm() {
      let token = sessionStorage.getItem("token");
      let data = {
        id: this.selectedRowKeys[0]
      };
      this.$http
        .post("/admin/auth_group/delete", data, {
          headers: {
            token: token
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.visible2 = false;
            this.$message.success("删除成功");
            this.fetchData();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
    //隐藏删除弹框
    handleCancel() {
      this.visible2 = false;
    },
    // 点击添加、授权、编辑、删除按钮
    cz(index) {
      this.index = index;
      // console.log(index);
      this.title = index == 0 ? "添加" : index == 1 ? "授权" : "编辑";
      if (index == 0) {
        this.showModal();
        this.clearForm();
      } else {
        let num = this.selectedRowKeys.length;
        if (num == 0) {
          this.$message.warning("请先选择需要修改的行");
        } else if (num > 1) {
          this.$message.warning("只能选择一行");
        } else {
          if (index == 3) {
            //删除
            this.visible2 = true;
            this.clearForm();
          } else if(index==1){
            this.showModal()
            this.checkedKeys=[]
          }else if (index == 2) {
            this.showModal();
            this.setInpedit();
          } else {
            this.showModal();
          }
        }
      }
    },
    // 给编辑弹框的表单赋值
    setInpedit() {
      if (this.selectedRowKeys.length == 1) {
        for (var i = 0; i < this.data.length; i++) {
          if (this.selectedRowKeys[0] == this.data[i].id) {
            this.name = this.data[i].title;
            this.status = this.data[i].status == "已启用" ? 1 : 0;
          }
        }
      }
    },
    // 勾选复选框发生改变时执行
    onSelectChange(selectedRowKeys) {
      console.log(this.data);
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 弹出框
    showModal() {
      this.visible = true;
    },
    // 点击弹出框的确认按钮执行的方法
    hideModal() {
      // console.log('下标',this.index);
      let index = this.index;
      let token = sessionStorage.getItem("token");
      // 添加
      if (index == 0) {
        let data = {
          title: this.name,
          status: this.status
        };
        this.$http
          .post("/admin/auth_group/save", data, {
            headers: {
              token: token
            }
          })
          .then(res => {
            if (res.data.code == 200) {
              this.visible = false;
              this.$message.success("添加成功");
              this.fetchData();
            } else {
              this.$message.warning(res.data.msg);
            }
          });
        // 授权
      } else if (index == 1) {
        let checkedKeys=this.checkedKeys.join()
        let data={
           id: this.selectedRowKeys[0],
           auth_rule_ids:checkedKeys
        }
        console.log(data)
       this.$http.post('/admin/auth_group/updateAuthGroupRule',data,{
         headers:{
           token
         }
       }).then(res=>{
         if(res.data.code=='200'){
           this.$message.success('授权成功');
           this.visible=false
         }else{
           this.$message.warning(res.date.msg)
         }
       })


        // 编辑
      } else if (index == 2) {
        let data = {
          id: this.selectedRowKeys[0],
          title: this.name,
          status: this.status
        };
        console.log(token);
        this.$http
          .post("/admin/auth_group/update", data, {
            headers: {
              token: token
            }
          })
          .then(res => {
            console.log(res);
            if (res.data.code == 200) {
              this.visible = false;
              this.$message.success("编辑成功");
              this.fetchData();
            } else {
              this.$message.warning(res.data.msg);
            }
          });
      }
    },
    onExpand(expandedKeys) {
      console.log("onExpand", expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      console.log("onCheck", checkedKeys);
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      console.log("onSelect", info);
      this.selectedKeys = selectedKeys;
    },
     onChange(e) {
      this.page = e;
      this.fetchData();
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
.form-item {
  height: 30px;
  line-height: 30px;
}
</style>
