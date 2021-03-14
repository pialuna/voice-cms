 <template>
  <div class="project">
    <h2>{{ project.name }}</h2>
	<p>Project Dashboard </p>
	
    <div>
      <collections-component
	  	:projectId="projectId"
	  ></collections-component>
    </div>
  </div>
</template>

<script>
import Collections from "./Collections.vue";

export default {
//  local components
    components: {
      collectionsComponent: Collections
    },

  async created() {
    await this.$store.dispatch("initProject", {
		projectId: this.projectId
	});
  },

  // get from route
  props: ["projectId"],

  computed: {
    project() {
      return this.$store.getters.project(this.projectId); // get project by id
    }, 
    collections() {
      return this.project.collections;
    }
  }
};
</script>

<style scoped>
.project {
  padding: 20px;
}
</style>