 <template>
  <div class="textarray-div">
    <div v-if="active">
      <div
        v-for="(value, index) in tempValues"
        :key="index"
        class="flex items-center"
      >
        <!-- input field -->
        <el-input
          v-model="tempValues[index]"
          type="textarea"
          autosize
          placeholder="text"
          class="min-w-full"
        >
        </el-input>
        <!-- delete -->
        <el-button
          @click="remove(value)"
          icon="el-icon-delete"
          circle
          size="mini"
          class="flex-none"
        ></el-button>
      </div>
      <el-button
        @click="add()"
        icon="el-icon-plus"
        circle
        size="mini"
      ></el-button>
    </div>
    <div v-else class="textarray">
      <div v-for="(value, index) in values" :key="index">
        <!-- display text with highlighted {{variables}} -->
        <span v-if="value.includes('{{')" v-html="parsedString(value)"> </span>
        <!-- else there are no {{variables}} -->
        <span v-else>
          {{ value }}
        </span>
        <hr
          v-if="values.length > 1 && index != values.length - 1"
          class="array-hr"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {},

  mounted() {},

  computed: {
    values() {
      if (this.i18n) {
        return JSON.parse(
          JSON.stringify(this.item.i18n[this.propertyName][this.currentLocale])
        );
      } else {
        return JSON.parse(JSON.stringify(this.item[this.propertyName]));
      }
    },
    tempValues: {
      get() {
        if (this.i18n) {
          return this.tempItem.i18n[this.propertyName][this.currentLocale];
        } else {
          return this.tempItem[this.propertyName];
        }
      },
      set(array) {
        if (this.i18n) {
          this.tempItem.i18n[this.propertyName][this.currentLocale] = array;
        } else {
          this.tempItem[this.propertyName] = array;
        }
      },
    },
    parsedString() {
      return (value) => {
        return this.parseVariables(value);
      };
    },
  },

  methods: {
    // display the {{variables}} in texts as highlighted tags
    parseVariables(value) {
      let openTag =
        '<span class="el-tag el-tag--mini bg-indigo-100 text-indigo-500">';
      const closeTag = "</span>";
      const matches = value.match(/{{(\w+)}}/g);
      let string = value;
      if (!this.variables || !matches) {
        string = string.replace(/{{/g, openTag).replace(/}}/g, closeTag);
        return string;
      }
      for (const match of matches) {
        const regex = new RegExp(match, "g");
        const variableObj = this.variables.find(
          (variableObj) => "{{" + variableObj.name + "}}" === match
        );
        if (variableObj.value) {
          // if there is an entered value for a variable, the variable tag is displayed different
          openTag = `<span class="el-tag el-tag--info" style="color: #333;">
			   	<span class="el-tag el-tag--mini" style="margin: 0 10px 0 0;">
			  	<i class="el-icon-edit"></i>
			  </span>`;
          string = string.replace(
            regex,
            openTag + variableObj.value + closeTag
          );
        } else {
          string = string.replace(/{{/g, openTag).replace(/}}/g, closeTag);
        }
      }
      return string;
    },

    add() {
      this.tempValues.push("");
    },
    remove(value) {
      this.tempValues.splice(this.tempValues.indexOf(value), 1);
    },
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
    tempItem: {
      type: Object,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    i18n: {
      type: Boolean,
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
    variables: {
      type: Array,
      required: false,
    },
  },
};
</script>

<style>
.el-button {
  margin: 3px;
}
.textarray {
  padding: 5px 0 5px 0;
}
.array-hr {
  margin: 5px 0 5px 0;
  padding: 0;
}
.textarray-div {
  min-width: 150px;
  max-width: 500px;
}
.el-textarea {
  width: 90%;
}
</style>