<template>
  <div class="home">
    <h1>Home</h1>
    <p>This is your Dashboard!</p>

    <projects-component></projects-component>

  </div>
</template>

<script>
import Projects from "./Projects.vue";

export default {
  components: {
    projectsComponent: Projects
  },
};
</script>

<style scoped>
.home {
  padding: 20px;
  height: 100vh;
}
</style>