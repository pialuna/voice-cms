<template>
  <div>
    <!-- Dialog: Create a new Collection -->
    <el-dialog :visible.sync="dialogVisible">
      <span slot="title">
        <h4><i class="el-icon-tickets"></i>Create New Collection</h4>
      </span>
      <!-- Name -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h5>Name</h5>
        </div>
        <el-input
          v-model="collectionName"
          placeholder="Collection Name"
        ></el-input>
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
      <!-- Properties -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h5>Properties (Columns)</h5>
        </div>
        <div v-for="(property, index) in properties" :key="index">
          <div class="new-prop">
            <el-input
              v-model="property.name"
              placeholder="Property (Column) Name"
              size="small"
              class="prop-field"
            ></el-input>
            <el-tooltip
              content="The type of content that can be saved in this property (column)."
            >
              <div>
                <el-tag>
                  <i :class="icon(property.type)"></i>
                </el-tag>
                <el-select
                  v-model="property.type"
                  placeholder="Type"
                  size="small"
                  class="prop-field"
                >
                  <el-option
                    v-for="propType in types"
                    :key="propType.value"
                    :label="propType.label"
                    :value="propType.value"
                  ></el-option>
                </el-select>
              </div>
            </el-tooltip>

            <el-tooltip
              content="Internationalization: This property's content will be different for each locale/language."
            >
              <div>
                <el-tag size="default">
                  <i class="el-icon-location"></i>
                </el-tag>
                <el-switch v-model="property.i18n"></el-switch>
              </div>
            </el-tooltip>
            <el-button
              @click.native.prevent="removeProperty(property)"
              icon="el-icon-delete"
              circle
              size="mini"
            ></el-button>
          </div>
          <hr v-if="properties.length > 1" class="array-hr" />
        </div>
        <el-button
          @click.native.prevent="newProperty"
          icon="el-icon-plus"
          circle
          size="mini"
        ></el-button>
      </el-card>
      <!-- Properties End -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createCollection">Create</el-button>
      </span>
    </el-dialog>
    <!-- Dialog End -->

    <div class="bg-white shadow rounded-lg p-8 mt-8">
      <div class="flex justify-between items-center pb-6 mb-8 border-b">
        <h3 class="text-xl font-bold text-gray-900">Collections</h3>
        <button
          @click="openDialog"
          class="rounded-full py-2 px-3 uppercase text-xs font-bold cursor-pointer tracking-wider text-indigo-500 border-indigo-500 border-2 hover:bg-indigo-500 hover:text-white transition ease-out duration-200"
        >
          New Collection
        </button>
      </div>
      <div v-for="collection in collections" :key="collection._id">
        <router-link
          :to="{
            path: '/projects/' + projectId + '/collections/' + collection._id,
          }"
          replace
        >
          <div class="mb-6">
            <h4 class="font-bold mb-2">
              <a>{{ collection.name }}</a>
            </h4>
            <div class="flex flex-wrap">
              <div
                class="mr-1 mb-1"
                v-for="(property, index) in collection.properties"
                :key="index"
              >
                <el-tag size="small" type="info">
                  <i :class="icon(property.type)"></i>
                  {{ property.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // get from route
  props: ["projectId"],

  created() {
    // currently the whole project with collections gets loaded, so initCollections in store is not needed
    // this.$store.dispatch("initCollections", {
    //   projectId: this.projectId
    // });
  },
  mounted() {},

  updated() {
    this.loading = false;
  },

  methods: {
    openDialog() {
      this.dialogVisible = true;
      // to do: this.locales should not be defined here?
      this.locales = this.projectLocales;
    },
    async createCollection() {
      this.dialogVisible = false;
      this.properties.forEach((property) => {
        property.name = property.name.toLowerCase().replace(/\s/g, "");
      });
      // action to store
      await this.$store.dispatch("createCollection", {
        collectionName: this.collectionName,
        properties: this.properties,
        locales: this.locales,
        projectId: this.projectId,
      });
    },
    newProperty() {
      this.properties.push({
        name: "",
        type: "textfield",
        i18n: false,
      });
    },
    removeProperty(property) {
      const index = this.properties.indexOf(property);
      this.properties.splice(index, 1);
    },
    icon(propType) {
      const obj = this.types.find((obj) => obj.value === propType);
      return "el-icon-" + obj.icon;
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
      loading: true,
      dialogVisible: false,
      collectionName: "",
      // to do: outsource this type data (also used in Collection.vue and in the store)
      types: [
        {
          value: "textfield",
          label: "Textfield",
          icon: "document-remove",
        },
        {
          value: "textarray",
          label: "Text Array",
          icon: "tickets",
        },
        {
          value: "urlfield",
          label: "URL",
          icon: "link",
        },
        {
          value: "audiourl",
          label: "Audio URL",
          icon: "headset",
        },
        {
          value: "imageurl",
          label: "Image URL",
          icon: "picture",
        },
        {
          value: "boolean",
          label: "Boolean",
          icon: "open",
        },
        {
          value: "checkbox",
          label: "Checkbox",
          icon: "check",
        },
        {
          value: "tags",
          label: "Tags",
          icon: "copy-document",
        },
        {
          value: "date",
          label: "Date",
          icon: "date",
        },
      ],
      properties: [
        {
          name: "",
          type: "textfield",
          i18n: false,
        },
      ],
      // Locale Tags Data
      locales: [],
      localeInputVisible: false,
      localeInputValue: "",
    };
  },

  computed: {
    collections() {
      return this.$store.getters.collections(this.projectId);
    },
    projectLocales() {
      const project = this.$store.getters.project(this.projectId);
      return project.locales;
    },
  },
};
</script>