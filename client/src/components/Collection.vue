 <template>
  <div>
    <el-menu :default-active="collection.name" class="el-menu-demo" mode="horizontal">
      <el-menu-item v-for="coll in collections" :key="coll._id" :index="coll.name">
        <router-link
          :to="{ path: '/projects/' + projectId + '/collections/' + coll._id }"
          replace
          activeClass="active"
          tag="li"
        >{{coll.name}}</router-link>
      </el-menu-item>
    </el-menu>

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
          <el-input v-model="propertyName" placeholder="Property Name (Column Name)"></el-input>
        </el-card>
        <el-card>
          <h5>Type</h5>
          <div>
            <el-tag>
              <i :class="icon(propertyType)"></i>
            </el-tag>
            <el-tooltip content="The type of content that can be saved in this property (column).">
              <el-select v-model="propertyType" placeholder="Type" class="prop-field" size="small">
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
              placement="top">
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

    <h2>{{ collection.name }}</h2>
    <!-- edit not implemented -->
    <!-- <el-button
            @click="collectionDialogVisible = true"
            class="edit-button"
            size="mini"
            icon="el-icon-edit"
            circle
    ></el-button>-->

    <el-input v-model="search" size="small" placeholder="Type to search" class="searchbar">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <!-- Variables -->
    <!-- <div v-if="variables" class="variables">
      <div v-for="(variable, index) in variables" :key="index">
        <span style="width:100px;">
          <el-tag size="mini" style="width:100px;">{{ variables[index].name }}</el-tag>
        </span>
        <el-input size="mini" style="width:200px;" v-model="variables[index].value"></el-input>
      </div>
    </div> -->

    <el-button type="primary" circle icon="el-icon-plus" @click="newItem" class="add-button"></el-button>

    <div class="overflow-table">
      <!-- locale tabs -->
      <div v-loading="loading">
        <el-tabs v-model="currentLocale">
          <el-tab-pane
            v-for="locale in collection.locales"
            :key="locale"
            :name="locale"
            :label="locale"
          >
            <span slot="label" style="padding: 0 20px">
              <i class="el-icon-location"></i>
              {{locale}}
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <table>
        <thead>
          <tr>

            <!-- Operations Column with Buttons -->
            <th></th>

            <!-- optional ID column header field (just for debugging). 
            the data field <td>_id</td> is in Item.vue-->
            <!-- <th>_id</th> -->

            <!-- a Column for each Item Property -->
            <th v-for="(property, index) in properties" :key="index">
              <!-- type icon, i18n icon -->
              <div class="prop-name">
                {{ property.name }}
                <el-tag size="mini" type="info">
                  <i :class="icon(property.type)"></i>
                </el-tag>
                <el-tag v-if="property.i18n" size="mini">
                  <i class="el-icon-location"></i>
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
</template>

<script>
import Item from "./Item.vue";

export default {
  // local components
  components: {
    itemComponent: Item
  },

  async created() {
    // initialize this Collection in the store
    await this.$store.dispatch("initCollection", {
      projectId: this.projectId,
      collectionId: this.collectionId
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
          icon: "document-remove"
        },
        {
          value: "textarray",
          label: "Text Array",
          icon: "tickets"
        },
        {
          value: "urlfield",
          label: "URL",
          icon: "link"
        },
        {
          value: "audiourl",
          label: "Audio URL",
          icon: "headset"
        },
        {
          value: "imageurl",
          label: "Image URL",
          icon: "picture"
        },
        {
          value: "boolean",
          label: "Boolean",
          icon: "open"
        },
        {
          value: "checkbox",
          label: "Checkbox",
          icon: "check"
        },
        {
          value: "tags",
          label: "Tags",
          icon: "copy-document"
        },
        {
          value: "date",
          label: "Date",
          icon: "date"
        }
      ]
    };
  },

  methods: {
    // get associated icon of this property type
    icon(propType) {
      const obj = this.types.find(obj => obj.value === propType);
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
        collectionId: this.collectionId
      });
    },

    // open a new Item. the opened new item gets saved in vuex store, but not in DB
    // as long as it is not saved in DB, it has the "not saved"-tag
    newItem() {
      this.$store.dispatch("newItem", {
        projectId: this.projectId,
        collectionId: this.collectionId
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
        item =>
          !this.search ||
          JSON.stringify(item)
            .toLowerCase()
            .includes(this.search.toLowerCase())
      );
    }
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
            value: ''
          });
        }
        return variables;
	  },
	  set(array) {
		  this.variables = array;
	  }
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
    }
  }
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
.searchbar {
  display: block;
  margin-bottom: 20px;
  width: 300px;
}
.overflow-table {
  overflow: auto;
}
table {
  width: 100%;
  font-size: 14px;
  border-spacing: 0;
}
thead {
  /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.1); */
  border-bottom: 2px solid #eee;
}
th {
  background: #fafafa;
  position: sticky;
  top: 0;
  z-index: 10;
  text-align: left;
  padding: 3px;
}
.prop-name {
  padding: 0 4px;
}
.prop-type {
  background-color: #f6f6f6;
  color: #aaa;
  font-size: 80%;
  font-weight: 200;
  padding: 0 4px;
  margin: 5px 0;
}
/* Element UI */
.el-alert {
  margin-top: 10px;
}
.el-textarea {
  width: 90%;
  margin-right: 5px;
}
</style>