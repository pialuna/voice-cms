<template>
  <div id="app">
    <app-header></app-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  components: {
    appHeader: Header,
  },

  created() {
    this.$store.dispatch("initProjects");
  },
  
};
</script>

<style>
#app {
  height: 100vh;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
.el-main {
	overflow: hidden;
}
</style>

