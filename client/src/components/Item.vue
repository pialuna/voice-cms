 <template>
  <tr
    :class="
      'hover:bg-indigo-50 border-b border-gray-200 transition ease-out duration-200 tablerow ' 
	  + tablerow
    "
  >
    <td v-for="(property, index) in properties" :key="index" class="px-2 py-6">
      <!-- the objects "item" and "tempItem" are passed down to property-component.
      item: for knowing the true value, that's in the store and db. 
      tempItem: a copy of "item" for editing and caching. -->
      <property-component
        :item="item"
        :tempItem="tempItem"
        :propertyType="property.type"
        :propertyName="property.name"
        :collectionId="collectionId"
        :projectId="projectId"
        :active="active"
        :i18n="property.i18n"
        :currentLocale="currentLocale"
        :variables="variables"
      ></property-component>
    </td>

    <!-- BUTTONS -->
    <td class="buttons-td">
      <div class="buttons-div">
        <!-- edit button -->
        <div v-if="!active">
          <el-button
            @click="editItem(item)"
            class="edit-button"
            size="mini"
            icon="el-icon-edit"
            circle
          ></el-button>
          <span v-if="_id === 'new'">
            <el-tag type="info" size="mini"> not saved </el-tag>
          </span>
        </div>
        <!-- cancel, delete, save button -->
        <div v-else>
          <el-button
            @click="cancel(item)"
            icon="el-icon-close"
            circle
            size="mini"
          ></el-button>
          <el-button
            @click="deleteItem(item)"
            icon="el-icon-delete"
            type="danger"
            plain
            circle
            size="mini"
          ></el-button>
          <el-button
            @click="saveItem(item)"
            icon="el-icon-check"
            type="primary"
            circle
            size="mini"
          ></el-button>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import Property from "./Property.vue";

export default {
  components: {
    propertyComponent: Property,
  },

  props: {
    // "item" is here the item.data object from the store,
    // which contains every relevant property of the item (and not the itemID or collectionID)
    item: {
      type: Object,
      required: true,
    },
    _id: {
      type: String,
      required: true,
    },
    properties: {
      type: Array,
      required: true,
    },
    collectionId: {
      type: String,
    },
    projectId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
    currentLocale: {
      type: String,
      required: true,
    },
    // variables obj array ? only for TextArray ?
    variables: {
      type: Array,
      required: false,
    },
  },

  created() {
    // no dispatch action like "initItem" needed, since all items get initialized in Collection.vue
  },

  updated() {
    if (this._id === "new") {
      // for the "not saved" tag
      this.tablerow = "new-item";
    }
  },

  data() {
    return {
      // deep copy of this.item. for editing and caching
      tempItem: JSON.parse(JSON.stringify(this.item)),
      tablerow: "",
    };
  },

  methods: {
    editItem() {
      console.log(`edit item: ${this._id}`);
      this.$emit("setActive");
    },

    cancel() {
      this.$emit("unsetActive");
      this.tempItem = JSON.parse(JSON.stringify(this.item));
    },

    async saveItem() {
      console.log(`save item: ${this._id}`);
      this.$emit("unsetActive");
      // action to store
      await this.$store.dispatch("saveItem", {
        item: {
          _id: this._id,
          data: this.tempItem,
        },
        projectId: this.projectId,
        collectionId: this.collectionId,
      });
    },

    async deleteItem() {
      console.log(`delete item: ${this._id}`);
      this.$emit("unsetActive");
      // action to store
      await this.$store.dispatch("deleteItem", {
        itemId: this._id,
        projectId: this.projectId,
        collectionId: this.collectionId,
      });
    },
  },
};
</script>

<style scoped>
.new-item {
  background-color: #f6f6f6;
}
.tablerow > td > .buttons-div > div > .edit-button {
  visibility: hidden;
}
.tablerow:hover > td > .buttons-div > div > .edit-button {
  visibility: visible;
  transition: 2s;
}
.el-button--mini.is-circle {
  margin: 3px;
}
</style>
