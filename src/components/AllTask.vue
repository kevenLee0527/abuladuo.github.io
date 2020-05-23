<template>
  <div class="task">
    <div class="header-name">任务管理 / 全部任务</div>
    <div class="main">
      <div class="task-search-bar">
        任务搜索:
        <a-input v-model="keyword" @keypress.enter="search" placeholder="请输入任务名称" :style="{width:'400px',display:'iline-block'}" />
        <div :style="{float:'right'}">
          分类选项:
          <a-select defaultValue="lucy" style="width: 120px" @change="handleChange">
            <a-select-option value="jack">Jack</a-select-option>
            <a-select-option value="lucy">Lucy</a-select-option>
          </a-select>
        </div>
      </div>
      <table border="1" cellspacing="0">
        <thead>
          <th :style="{width:'15%'}">
            <span>投放主题</span>
          </th>
          <th :style="{width:'25%'}">
            <span>任务ID/标题/账户/分类/类型</span>
          </th>
          <th>
            <span>编号/时间/佣金/追加</span>
          </th>
          <th><span>订单状态</span></th>
          <th>
            <span>查看任务详情</span>
          </th>
          <th>
            <span>操作</span>
          </th>
        </thead>
        <tbody>
          <tr v-for="(item,index) in taskList" :key="index">
            <td>
              <img class="userImg" :src="item.task_thumb" />
            </td>
            <td>
              <div class="item">{{item.task_title}}</div>
              <div class="item">{{item.business_phone}}</div>
              <div class="item">{{item.task_type_name}}</div>
              <div class="item nobor">{{item.task_class_name}}</div>
            </td>
            <td>
              <div class="item">{{item.task_number}}</div>
              <div class="item">{{item.task_create_time}}</div>
              <div class="item">{{item.task_base_price}}</div>
              <div class="item nobor">{{item.task_append_price}}</div>
            </td>
            <td style="text-align:center">
                {{getStatus(item.task_status)}}
            </td>
            <td :style="{textAlign:'center'}">
              <a-button @click="showModal(item.task_id)" type="primary">查看任务信息</a-button>
            </td>
            <td :style="{textAlign:'center'}">
              <a-button
                @click="recommend(item.task_id,item.task_is_recommend)"
                type="primary"
                :style="{marginBottom:'5px'}"
              >{{item.task_is_recommend==0?'推荐任务':'取消推荐'}}</a-button>
              <br />
              <a-button @click="pullOff(item.task_id,item.task_status)" type="primary">{{item.task_status==0?"上架任务":"下架任务"}}</a-button>
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
        <span
          :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}"
        >共{{Math.ceil(total/pagesize)}}页</span>
      </div>
    </div>
    <a-modal :title="title" v-model="visible" @ok="handleOk" okText="确定" cancelText="取消">
      <!-- <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">投放主题</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="投放主题" v-model="form.task_thumb" />
        </a-col>
      </a-row> -->
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">任务标题</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入任务标题" v-model="form.task_title" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">任务链接</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入任务链接" v-model="form.task_link" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">淘口令</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入淘口令" v-model="form.task_taokoling" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">任务类型</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入任务类型" v-model="form.task_type_name" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">任务区域</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请选择任务区域" v-model="form.area_name" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">完成天数</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请选择完成天数" v-model="form.close_time" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">基础价格</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入基础价格" v-model="form.task_base_price" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">追加金额</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入追加金额" v-model="form.task_append_price" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">提示内容</span>
        </a-col>
        <a-col :span="20">
          <a-input placeholder="请输入提示内容" v-model="form.task_tips_content" />
        </a-col>
      </a-row>
      <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">任务发布的图片</span>
        </a-col>
        <a-col :span="20">
          <img class="userImg" :src="form.task_thumb_arr" />
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="4">
          <span class="form-item">任务订单类型</span>
        </a-col>
        <a-col :span="20">
          <a-select v-model="form.task_type_name" style="width: 100%" @change="handleChange">
            <a-select-option
              v-for="v in TaskTypeList"
              :key="v.task_type_id"
              :value="v.task_type_id"
            >{{v.task_type_name}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <!-- <a-row :style="{marginBottom:'10px'}">
        <a-col :span="4">
          <span class="form-item">任务状态</span>
        </a-col>
        <a-col :span="20">
          <a-radio-group v-model="form.status" :defaultValue="1" buttonStyle="solid">
            <a-radio-button :value="1">正常任务</a-radio-button>
            <a-radio-button :value="0">被下架任务</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row> -->
    </a-modal>
  
  </div>
</template>

<script>
export default {
  name: "AllTask",
  data() {
    return {
      list: [1, 2, 3, 4, 5],
      visible: false,
      title: "任务添加",
      taskList: [],
      form: {
        task_thumb: "",
        task_id: "",
        task_title: "",
        task_link: "",
        task_taokoling: "",
        task_type_name: "",
        area_name: "",
        close_time: "",
        task_base_price: "",
        task_append_price: "",
        task_tips_content: "",
        task_thumb_arr: ""
      },
      defaultGroup: "",
      visible2: false,
      TaskTypeList: [],
      task_type_id: "",
      page: 1,
      pagesize: 10,
      keyword: "",
      total: 0
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
    this.getTaskTypeList();
  },
  methods: {
    search() {
      this.page = 1;
      this.fetchData();
    },
    getStatus(status){
      let str='';
      switch (status){
        case 0:
        str='已发布任务';
        break;
        case 1:
        str='等待审核';
        case 2:
        str='已通过审核';
        case -1:
        str='未通过审核';
        case -2:
        str='被取消任务';
        case -3:
        str='已超时任务';
        break;
        case 3:
        str='验收任务';
        break;
        case 4:
        str='验收通过';
        case -4:
        str='验收未通过';
        break;
        case 5:
        str='任务回收站';
        case 6:
        str='被关闭任务';
        break
      }
      return str
    },
    fetchData() {
      let page = this.page;
      let pagesize = this.pagesize;
      let keyword = this.keyword;
      let token = sessionStorage.getItem("token");

      this.$http
        .post(
          "/admin/task/index?page=" +
            page +
            "&pagesize=" +
            pagesize +
            "&keyword=" +
            keyword +
            "&status=1",
          {},
          {
            headers: {
              token: token
            }
          }
        )
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.total = res.data.data.total;
            let arr = res.data.data;
            this.taskList = arr.data;
            // console.log(arr.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCancel() {
      this.visible2 = false;
    },
    // 弹出添加或者编辑模态框
    showModal(num) {
      console.log(num);
      this.clearForm();
      this.title = "查看任务信息";
      this.visible = true;
      // if (this.title == "查看任务信息") {
      let token = sessionStorage.getItem("token");
      console.log(token);
      this.$http
        .post(
          "/admin/task/taskInfo",
          {
            task_id: num
          },
          {
            headers: { token }
          }
        )
        .then(res => {
          //   console.log(res)
          if (res.data.code == 200) {
            let data = res.data.data.task_info;
            //   console.log(data);
            this.form = {
              task_id: data.task_id,
              task_title: data.task_title,
              task_link: data.task_link,
              task_taokoling: data.task_taokoling,
              task_type_name: data.task_type_name,
              area_name: data.area_name,
              close_time: data.close_time,
              task_base_price: data.task_base_price,
              task_append_price: data.task_append_price,
              task_tips_content: data.task_tips_content,
              task_thumb_arr: data.task_thumb_arr[0][0]
            };
          }
        });
      // }
    },
    handleOk(e) {
      this.visible = false;
    },
    //   上架||下架任务
    pullOff(task_id, task_status) {
      console.log(task_id, task_status);
      let is_status = task_status == 0 ? 1 : 0;
      let token = sessionStorage.getItem("token");
      this.$confirm({
        title: task_status==0?'上架任务':'下架任务',
        content:task_status==0?"确定上架任务吗?":"确定下架任务吗",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          let data = {
            task_id,
            is_status
          };
          this.$http
            .post("/admin/task/is_status", data, {
              headers: {
                token
              }
            })
            .then(res => {
              //   console.log(res);
              if (res.data.code == 200) {
                let msg = is_status == 1 ? "上架成功" : "下架成功";
                this.$message.success(msg);
                this.fetchData();
              } else {
                this.$message.warning(res.data.msg);
              }
            });
        }
      });
    },
    //   推荐任务
    recommend(task_id, task_is_recommend) {
      let is_recommend = task_is_recommend == 0 ? 1 : 0;
      let token = sessionStorage.getItem("token");
      this.$confirm({
        title: "推荐任务",
        content:is_recommend==0? "确定取消推荐吗":"确定推荐任务吗?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          let data = {
            task_id,
            is_recommend
          };
          this.$http
            .post("/admin/task/is_recommend", data, {
              headers: {
                token
              }
            })
            .then(res => {
              //   console.log(res);
              if (res.data.code == 200) {
                let msg = is_recommend == 1 ? "推荐成功" : "已取消推荐";
                this.$message.success(msg);
                this.fetchData();
              } else {
                this.$message.warning(res.data.msg);
              }
            });
        }
      });
    },
    getTaskTypeList() {
      let token = sessionStorage.getItem("token");
      this.$http
        .post(
          "/admin/task_type/taskTypeList",
          {},
          {
            headers: { token }
          }
        )
        .then(res => {
          //   console.log(res)
          if (res.data.code == 200) {
            this.TaskTypeList = res.data.data.task_type;
          } else {
            this.$message.warning(res.data.msg);
          }
        });
    },
    clearForm() {
      this.form = {
        task_id: "",
        task_title: "",
        task_link: "",
        task_taokoling: "",
        task_type_name: "",
        area_name: "",
        close_time: "",
        task_base_price: "",
        task_append_price: "",
        task_tips_content: ""
      };
    },
    handleChange(value) {
      console.log(`selected ${value}`);
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
}
</style>
