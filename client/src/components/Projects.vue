<template>
  <div>
    <!-- Dialog: Create a new Project -->
    <el-dialog :visible.sync="dialogVisible">
      <span slot="title">
        <h4><i class="el-icon-tickets"></i> Create New Project</h4>
      </span>
      <!-- Name -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h5>Name</h5>
        </div>
        <el-input v-model="projectName" placeholder="Project Name"></el-input>
      </el-card>
      <!-- Name End -->
      <!-- Locales -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h5>Locales or Languages</h5>
        </div>
        <el-tag
          :key="locale"
          v-for="locale in locales"
          closable
          :disable-transitions="false"
          @close="handleLocaleClose(locale)"
          >{{ locale }}</el-tag
        >
        <el-input
          class="input-new-tag"
          v-if="localeInputVisible"
          v-model="localeInputValue"
          ref="saveTagInput"
          size="mini"
          @keyup.enter.native="handleLocaleInputConfirm"
          @blur="handleLocaleInputConfirm"
        ></el-input>
        <el-button
          v-else
          class="button-new-tag"
          size="small"
          @click="showLocaleInput"
          >+ New Locale</el-button
        >
      </el-card>
      <!-- Locales End -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createProject">Create</el-button>
      </span>
    </el-dialog>
    <!-- Dialog End -->

    <el-card class="projects-overview">
      <h2>Projects Overview</h2>
      <el-button
        type="primary"
        icon="el-icon-plus"
        circle
        @click="openDialog"
        class="add-button"
      ></el-button>
      <div v-for="project in projects" :key="project._id">
        <router-link :to="'/projects/' + project._id">
          <el-card class="box-card">
            <h4>
              <a>{{ project.name }}</a>
            </h4>
          </el-card>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  // projects already get initializied by App created()

  computed: {
    projects() {
      return this.$store.getters.projects; // get all projects
    },
  },

  methods: {
    openDialog() {
      this.dialogVisible = true;
      // to do: this.locales should not be defined here?
      this.locales = ["en"];
    },
    async createProject() {
      this.dialogVisible = false;
      // action to store
      await this.$store.dispatch("createProject", {
        projectName: this.projectName,
        locales: this.locales,
      });
    },
    // Locale Tags Methods (ElementUI)
    handleLocaleClose(locale) {
      this.locales.splice(this.locales.indexOf(locale), 1);
    },
    showLocaleInput() {
      this.localeInputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleLocaleInputConfirm() {
      let localeInputValue = this.localeInputValue;
      if (localeInputValue) {
        this.locales.push(localeInputValue);
      }
      this.localeInputVisible = false;
      this.localeInputValue = "";
    },
  },

  data() {
    return {
      dialogVisible: false,
      projectName: "",
      // Locale Tags Data
      locales: [],
      localeInputVisible: false,
      localeInputValue: "",
    };
  },
};
</script>

<style scoped>
.projects-overview {
  background-color: aliceblue;
  padding: 20px;
}
.el-card {
  margin-bottom: 10px;
}
</style>