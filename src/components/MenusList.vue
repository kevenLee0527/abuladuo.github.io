<template>
  <div class="menu-bar">
    <a-menu :defaultSelectedKeys="[122]" :theme="theme" mode="inline" :openKeys="openKeys" @openChange="onOpenChange">
      <a-sub-menu :key="item.id" v-for="item in list">
        <span slot="title">
          <a-icon :type="item.icon" />
          <span>{{item.title}}</span>
        </span>
        <a-menu-item @click="goto(subItem.name)" :key="subItem.id" v-for="subItem in item.subList">{{subItem.title}}</a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
export default {
  name: "MenusList",
  data() {
    return {
      theme: "dark",
      rootSubmenuKeys: [121,123,128,132,137,140,143,146],
      openKeys: [121],
    };
  },
  methods: {
    goto(url){
        this.$router.push({
          path:url,
          query:{index:1}
        })
        this.$emit("getMenuInfo", url);
    },
    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    }
  },
  props: ["list"] //父组件向子组件传值用props(即子组件接收父组件的值用props)
};
</script>
<style scoped>
.ant-menu.ant-menu-dark .ant-menu-item-selected,
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background: #01958a;
}
</style>