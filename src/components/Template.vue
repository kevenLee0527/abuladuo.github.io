<template>
  <div class="task">
    <div class="header-name">模板管理 / 模板管理</div>
    <div class="main">
      <div>
        <a-icon type="profile" />文件列表
      </div>
      <a-row :style="{height:'40px',background:'#EBEBEB',lineHeight:'40px'}">
        <a-col :span="12">
          <span>文件名</span>
        </a-col>
        <a-col :span="4">
          <span>文件大小</span>
        </a-col>
        <a-col :span="4">
          <span>更新时间</span>
        </a-col>
        <a-col :span="4">
          <span>操作</span>
        </a-col>
      </a-row>
      <a-row :style="{height:'40px',borderBottom:'1px solid #EBEBEB',lineHeight:'40px'}">
        <a-col :span="12">
          <span>
            <a-icon type="folder" />PC
          </span>
        </a-col>
        <a-col :span="4">
          <span></span>
        </a-col>
        <a-col :span="4">
          <span>2020/04/17</span>
        </a-col>
        <a-col :span="4">
          <span></span>
        </a-col>
      </a-row>
      <a-row :style="{height:'40px',borderBottom:'1px solid #EBEBEB',lineHeight:'40px'}">
        <a-col :span="12">
          <span>
            <a-icon type="folder" />mobile
          </span>
        </a-col>
        <a-col :span="4">
          <span></span>
        </a-col>
        <a-col :span="4">
          <span>2020/04/17</span>
        </a-col>
        <a-col :span="4">
          <span></span>
        </a-col>
      </a-row>
      <a-row :style="{height:'40px',borderBottom:'1px solid #EBEBEB',lineHeight:'40px'}">
        <a-col :span="12">
          <span>
            <a-icon type="file" />hello.java
          </span>
        </a-col>
        <a-col :span="4">
          <span></span>
        </a-col>
        <a-col :span="4">
          <span>2020/04/17</span>
        </a-col>
        <a-col :span="4">
          <span></span>
        </a-col>
      </a-row>
      <div>
        <a-button type="primary" icon="search" @click="showModal()">新建文件</a-button>
      </div>
    </div>
    <a-modal :style="{top:'20px'}" width="900px" title="新建文件" v-model="visible" @ok="handleOk" okText="确定" cancelText="取消">
      <div></div>
      <a-row>
        <a-col :span="3">
          <span :style="{height:'32px',lineHeight:'32px'}">所在目录</span>
        </a-col>
        <a-col :span="21">
          <a-select :value="selectValue" style="width: 200px" @change="handleChange">
            <a-select-option
              v-for="(i,index) in 5"
              :key="index"
            >{{i}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row :style="{paddingTop:'10px'}">
        <a-col :span="3">
          <span :style="{height:'32px',lineHeight:'32px'}">文件名称</span>
        </a-col>
        <a-col :span="21">
          <a-input style="width: 200px"/>
        </a-col>
      </a-row>
      <a-row :style="{paddingTop:'10px'}">
        <a-col :span="24">
          <a-textarea placeholder="请输入html代码" :autoSize="{ minRows: 10, maxRows: 999 }"/>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "Template",
  data() {
    return {
      visible: false,
      selectValue:1
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.id 去再次请求数据接口
      this.fetchData(to.query.index);
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
    handleChange(value) {
      console.log(`selected ${value}`);
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
span {
  padding-left: 10px;
}
.ant-btn-primary {
  background-color: #01958a;
  border-color: #01958a;
  margin-top: 10px;
}
</style>
