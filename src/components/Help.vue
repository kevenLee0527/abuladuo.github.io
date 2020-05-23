<template>
  <div class="task">
    <div class="header-name">内容管理 / 帮助中心</div>
    <div class="main">
        <div class="task-search-bar">
        标题搜索:
        <a-input :style="{width:'400px',display:'iline-block'}" />
        <div :style="{float:'right'}">
          <a-button :style="{marginLeft:'20px'}" type="primary" @click="showModal">添加帮助</a-button>
        </div>
        <table border="1" cellspacing="0">
      <thead>
        <th :style="{width:'5%'}"><span>ID</span> </th>
        <th><span>帮助名称</span></th>
        <th><span>发布时间</span></th>
        <th :style="{width:'10%'}"><span>排列顺序</span></th>
        <th><span>浏览页面</span></th>
        <th><span>操作</span></th>
      </thead>
      <tbody>
        <tr v-for="(item,index) in list" :key="index">
            <td>1</td>
            <td>注册会员大礼包</td>
            <td>2020/1/2 11:43:20</td>
            <td>1</td>
            <td>点击浏览</td> 
            <td :style="{textAlign:'center'}">
                <a-button type="primary" :style="{marginRight:'20px',height:'25px',lineHeight:'25px'}">编辑</a-button>
                <a-button type="primary" :style="{height:'25px',lineHeight:'25px'}">删除</a-button>
            </td>
        </tr>
      </tbody>
      </table>
      <div style="text-align:right;padding-top:4px;">
      <a-pagination
        :total="5"
        :pageSize="1"
        :defaultCurrent="1"
        :style="{display:'inline-block'}"
      />
      <span :style="{height:'30px',display:'inline-block',lineHeight:'30px',position:'relative',top:'-11px',padding:'0 2px'}">共5页</span>
      </div>
      </div>
    </div>
    <a-modal :style="{top:'20px'}" width="900px" title="添加帮助" v-model="visible" @ok="handleOk" okText="确定" cancelText="取消">
      <a-row>
        <a-col :span="3">
          <span :style="{height:'32px',lineHeight:'32px'}">标题</span>
        </a-col>
        <a-col :span="21">
          <a-input style="width: 200px"/>
        </a-col>
      </a-row>
      <a-row :style="{paddingTop:'10px'}">
        <a-col :span="24">
          <richText :text="content" @editorChange="editorChange" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import richText from "@/components/CourseRichText";
export default {
  name: "Help",
  components: { richText },
  data() {
    return {
       list:[1,2,3,4,5],
       visible: false,
       content: ""
    };
  },
  watch: {
    '$route': function (to, from) {
　　　　// 拿到目标参数 to.query.id 去再次请求数据接口
　　　　this.fetchData(to.query.index)
　　}
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
    },
    editorChange: function(html) {
      this.content = html;
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
.ant-btn-primary{
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
tbody td{
  text-align: center;
}
table,
th,
td {
  border: 1px solid #ebebeb;
}
</style>
