 <template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900">
      {{ projectName }}
    </h2>

    <div class="mt-4">
      <div class="flex">
        <router-link
          v-for="coll in collections"
          :key="coll._id"
          :index="coll.name"
          :to="{ path: '/projects/' + projectId + '/collections/' + coll._id }"
          replace
          class="rounded pt-3 pb-3.5 px-4"
          activeClass="bg-white shadow-tab"
          >
		  {{ coll.name }}
		</router-link>
      </div>

      <div class="bg-white shadow rounded-lg py-2 px-4 -mt-1">
        <div class="flex justify-between">
          <el-tabs v-model="currentLocale">
            <el-tab-pane
              v-for="locale in collection.locales"
              :key="locale"
              :name="locale"
              :label="locale"
            >
              <span class="px-2" slot="label">
                <i class="el-icon-location"></i>
                {{ locale }}
              </span>
            </el-tab-pane>
          </el-tabs>

          <div class="flex my-2">
            <input
              v-model="search"
              type="search"
              name="search"
              placeholder="Search"
              class="bg-gray-50 shadow-inner mr-2 h-10 pl-6 pr-4 rounded-full text-sm focus:outline-none"
            />

            <button
              @click="newItem"
              class="rounded-full py-2 px-3 uppercase text-xs font-bold cursor-pointer tracking-wider text-indigo-500 border-indigo-500 border-2 hover:bg-indigo-500 hover:text-white transition ease-out duration-200"
            >
              New Item
            </button>
          </div>
        </div>

        <div class="overflow-auto">
          <table class="w-full table-auto text-sm">
            <thead class="text-left bg-purple-50 border border-gray-200 rounded shadow">
              <tr>
                <!-- a Column for each Item Property -->
                <th
                  class="px-4 py-4"
                  v-for="(property, index) in properties"
                  :key="index"
                >
                  <!-- type icon, i18n icon -->
                  <div class="flex items-center text-indigo-900 pl-2">
                    {{ property.name }}
                    <el-tag size="mini" class="bg-gray-200 border-gray-300 ml-1">
                      <i :class="icon(property.type)" class="text-gray-500"></i>
                    </el-tag>
                    <el-tag
                      v-if="property.i18n"
                      size="mini"
                      class="bg-indigo-100 border-indigo-200 ml-1"
                    >
                      <i class="el-icon-location text-indigo-500"></i>
                    </el-tag>
                  </div>
                </th>

                <!-- add new property (column) to collection (currently not working) -->
                <!-- <th>
              		<el-button
						circle
						icon="el-icon-plus"
						size="small"
						@click="createPropDialogVisible = true"
              		></el-button>
            	</th>  -->

                <!-- Operations Column with Buttons -->
                <th></th>
              </tr>
            </thead>

            <tbody>
              <!-- the item.data object is passed down to item-component as the prop "item",
          		which contains every relevant item data (and not the itemID or collectionID)-->
              <item-component
                v-for="item in filteredData()"
                :key="item._id"
                :_id="item._id"
                :item="item.data"
                :properties="properties"
                :currentLocale="currentLocale"
                :variables="variables"
                :collectionId="collectionId"
                :projectId="projectId"
                :active="activeItemId === item._id"
                @setActive="activeItemId = item._id"
                @unsetActive="activeItemId = null"
              ></item-component>
            </tbody>
          </table>
        </div>
      </div>
    </div>

	<!-- Dialog Create New Property -->
    <el-dialog :visible.sync="createPropDialogVisible">
      <span slot="title">
        <h4>
          <i class="el-icon-document-copy"></i> Create new Property (Column)
        </h4>
      </span>
      <div>
        <el-card>
          <h5>Name</h5>
          <el-input
            v-model="propertyName"
            placeholder="Property Name (Column Name)"
          >
          </el-input>
        </el-card>
        <el-card>
          <h5>Type</h5>
          <div>
            <el-tag>
              <i :class="icon(propertyType)"></i>
            </el-tag>
            <el-tooltip
              content="The type of content that can be saved in this property (column)."
            >
              <el-select
                v-model="propertyType"
                placeholder="Type"
                class="prop-field"
                size="small"
              >
                <el-option
                  v-for="type in types"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                ></el-option>
              </el-select>
            </el-tooltip>
          </div>
        </el-card>
        <el-card>
          <h5>Internationalization</h5>
          <div>
            <el-tag size="medium">
              <i class="el-icon-location"></i>
            </el-tag>
            <el-tooltip
              content="Internationalization: This property's content will be different for each locale/language."
              placement="top"
            >
              <el-switch v-model="propertyI18n"></el-switch>
            </el-tooltip>
          </div>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createPropDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="createProperty">Create</el-button>
      </span>
    </el-dialog>
    <!-- Dialog End  -->

  </div>
</template>

<script>
import Item from "./Item.vue";

export default {
  // local components
  components: {
    itemComponent: Item,
  },

  async created() {
    // initialize this Collection in the store
    await this.$store.dispatch("initCollection", {
      projectId: this.projectId,
      collectionId: this.collectionId,
    });
  },

  mounted() {
    this.currentLocale = this.locales[0];
  },

  updated() {
    this.loading = false;
  },

  data() {
    return {
      loading: true,
      // the item currently being edited
      activeItemId: null,
      // shown locale of the properties that have i18n
      currentLocale: "de",
      search: "",
      createPropDialogVisible: false,
      collectionDialogVisible: false,
      // for creating new Property
      propertyName: "",
      propertyType: "textfield",
      propertyI18n: false,
      // to do: outsource this type data (also used in Collections.vue and in the store)
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
    };
  },

  methods: {
    // get associated icon of this property type
    icon(propType) {
      const obj = this.types.find((obj) => obj.value === propType);
      return "el-icon-" + obj.icon;
    },
    editCollection() {
      // to do: edit Collection name and properties
    },
    // to do: debug "createProperty" feature or replace it through "editCollection"
    createProperty() {
      this.createPropDialogVisible = false;
      this.propertyName = this.propertyName.toLowerCase().replace(/\s/g, "");
      this.$store.dispatch("createProperty", {
        name: this.propertyName,
        type: this.propertyType,
        i18n: this.propertyI18n,
        projectId: this.projectId,
        collectionId: this.collectionId,
      });
    },

    // open a new Item. the opened new item gets saved in vuex store, but not in DB
    // as long as it is not saved in DB, it has the "not saved"-tag
    newItem() {
      this.$store.dispatch("newItem", {
        projectId: this.projectId,
        collectionId: this.collectionId,
      });
      this.activeItemId = "new";
    },

    // search result
    // to do: should filteredData be a computed value?
    filteredData() {
      if (!this.items) {
        return;
      }
      return this.items.filter(
        (item) =>
          !this.search ||
          JSON.stringify(item).toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  // getting ids from route
  props: ["projectId", "collectionId"],

  computed: {
    // for getting all {{variables}} of the response texts
    variables: {
      get() {
        const content = JSON.stringify(this.collection);
        const matches = content.match(/{{(\w+)}}/g);
        if (!matches) {
          return [];
        }
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
        const uniques = matches.filter(onlyUnique);
        const variables = [];
        for (const value of uniques) {
          const v = value.replace("{{", "").replace("}}", "");
          variables.push({
            name: v,
            value: "",
          });
        }
        return variables;
      },
      set(array) {
        this.variables = array;
      },
    },

    projectName() {
      const project = this.$store.getters.project(this.projectId);
      return project.name;
    },
    collection() {
      return this.$store.getters.collection(this.projectId, this.collectionId);
    },
    properties() {
      return this.collection.properties;
    },
    locales() {
      return this.collection.locales;
    },
    items() {
      return this.collection.items;
    },
    // all collections of the project
    collections() {
      return this.$store.getters.collections(this.projectId) || [];
    },
  },
};
</script>

<style scoped>
.variables {
  padding: 5px;
  margin: 20px 0;
}
.add-button {
  margin: 5px 0 15px 0;
}
/* Element UI */
.el-alert {
  margin-top: 10px;
}
.el-textarea {
  width: 90%;
  margin-right: 5px;
}
.el-tabs__header {
  margin: 0;
}
/* Element UI slinding tabs style */
/*
.el-tabs__active-bar{
	background-color: #6366f1;
}
.el-tabs__item .is-active .is-top{
	background-color: #6366f1;

	color: #6366f1;
}
.el-tabs__item.is-active .el-icon-location{
	color: #6366f1;
}
*/
</style>