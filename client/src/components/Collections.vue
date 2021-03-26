<template>
  <div>
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

    <!-- Dialog: Create a new Collection -->
    <el-dialog :visible.sync="dialogVisible">
      <span slot="title">
        <h4 class="text-xl"><i class="el-icon-tickets mr-2"></i>Create New Collection</h4>
      </span>
      <!-- Name -->
      <div class="bg-white border-b p-2 pb-4 mb-4">
        <div slot="header" class="clearfix">
          <h5 class="mb-4 font-semibold">Name</h5>
        </div>
        <el-input
          v-model="collectionName"
          placeholder="Collection Name"
        ></el-input>
      </div>
      <!-- Name End -->
      <!-- Locales -->
      <div class="bg-white border-b p-2 pb-4 mb-4">
        <div slot="header" class="clearfix">
          <h5 class="mb-4 font-semibold">Locales or Languages</h5>
        </div>
        <el-tag
          :key="locale"
          v-for="locale in locales"
          closable
          :disable-transitions="false"
          @close="handleLocaleClose(locale)"
          class="mr-1"
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
      </div>
      <!-- Locales End -->
      <!-- Properties -->
      <div class="bg-white border-b p-2 pb-4 mb-4">
        <div slot="header" class="">
          <h5 class="mb-4 font-semibold">Properties (Columns)</h5>
        </div>
        <div
          v-for="(property, index) in properties"
          :key="index"
          class="border-b mb-2 p-2 flex"
        >
          <div class="w-full flex-col mb-2">
            <h6 class="mb-2">{{ index + 1 }}. Column</h6>
            <div class="flex justify-between items-center mb-1">
              <div class="flex items-center">
                <el-tag
                  size="default"
                  class="bg-indigo-100 border-indigo-200 mr-1"
                >
                  <i class="el-icon-edit text-indigo-500"></i>
                </el-tag>
                <el-tooltip content="The name of this property (column)">
                  <el-input
                    v-model="property.name"
                    placeholder="Column Name"
                    size="small"
                    class="prop-field"
                  ></el-input>
                </el-tooltip>
              </div>
              <el-button
                @click.native.prevent="removeProperty(property)"
                icon="el-icon-delete"
                circle
                size="mini"
              ></el-button>
            </div>
            <div class="flex items-center mb-1">
              <el-tag class="bg-indigo-100 border-indigo-200 mr-1">
                <i :class="icon(property.type)" class="text-indigo-500"></i>
              </el-tag>
              <el-tooltip
                content="What type of content can be saved in this property (column)?"
              >
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
              </el-tooltip>
            </div>
            <div class="flex items-center mb-1">
              <el-tag
                size="default"
                class="bg-indigo-100 border-indigo-200 mr-1"
              >
                <i class="el-icon-location text-indigo-500"></i>
              </el-tag>
              <el-tooltip
                content="Internationalization: Will this property's content be different for each locale/language?"
              >
                <el-switch
                  v-model="property.i18n"
                  active-color="#6366F1"
                ></el-switch>
              </el-tooltip>
            </div>
          </div>
        </div>
		<button
          @click="newProperty"
          class="ml-2 rounded-full px-2 text-lg cursor-pointer tracking-wider border-indigo-500 border-2 bg-indigo-500 text-white hover:bg-indigo-100 hover:text-indigo-500 transition ease-out duration-200"
        >
         +
        </button>
      </div>
      <!-- Properties End -->
      <span slot="footer" class="dialog-footer">
		  <button
          @click="dialogVisible = false"
          class="mx-1 rounded-full py-2 px-3 uppercase text-xs font-bold cursor-pointer tracking-wider text-indigo-500 border-indigo-500 border-2 hover:bg-indigo-100 transition ease-out duration-200"
        >
          Cancel
        </button>
		<button
          @click="createCollection"
          class="mx-1 rounded-full py-2 px-4 uppercase text-xs font-bold cursor-pointer tracking-wider border-indigo-500 border-2 bg-indigo-500 text-white hover:bg-indigo-100 hover:text-indigo-500 transition ease-out duration-200"
        >
          Create 
        </button>
      </span>
    </el-dialog>
    <!-- Dialog End -->
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
          icon: "chat-dot-round",
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
          name: "key",
          type: "textfield",
          i18n: false,
        },
        {
          name: "",
          type: "textarray",
          i18n: true,
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