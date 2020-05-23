<template>
  <div class="task">
    <div class="header-name">内容管理 / 注册协议书</div>
    <div class="main">
      <richText :text="content" @editorChange="editorChange" />
      <a-button :style="{marginTop:'10px'}" type="primary" @click="tj">确认提交</a-button>
    </div>
  </div>
</template>

<script>
import richText from "@/components/CourseRichText";
export default {
  name: "Protocol",
  components: { richText },
  data() {
    return {
      content: ""
    };
  },
  watch: {
    $route: function(to, from) {
      // 拿到目标参数 to.query.id 去再次请求数据接口
      this.fetchData(to.query.index);
    }
  },
  methods: {
    editorChange: function(html) {
      this.content = html;
    },
    tj(){

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
</style>
