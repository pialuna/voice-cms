 <template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">
		{{ project.name }}
	</h2>
	
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