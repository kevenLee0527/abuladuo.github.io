<template>
  <div style="height:100%">
    <quill-editor
      :content="editorContent"
      :options="newOption"
      @change="editorChange"
      ref="newEditor"
    >
    </quill-editor>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'CourseRichText',
  props: ['text', 'editorId'],
  components: { quillEditor },
  data () {
    return {
      editorContent: '',
      uniqueId: '',
      imgPercent: 0,
      imageLoading: false,
      newOption: {
        placeholder: '请填写简介',
        history: {
          delay: 100,
          maxStack: 100,
          userOnly: false
        },
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      }
    }
  },
  methods: {
    editorChange ({ editor, html, text }) {
      this.$emit('editorChange', html)
    }
  },
  watch: {
      //监控富文本内的变化
    text: function (val) {
      this.editorContent = val
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>