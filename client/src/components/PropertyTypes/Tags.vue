 <template>
  <div class="tag-div">
    <div v-if="active">
      <el-tag
        v-for="(value, index) in tempValues"
        :key="index"
        closable
        disable-transitions
        class="bg-indigo-200"
        @close="handleClose(value)"
        size="medium"
      >
	  	{{value}}
	  </el-tag>
      <el-input
        class="input-new-tag"
        v-if="inputVisible"
        v-model="inputValue"
        ref="saveTagInput"
        size="mini"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      ></el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
		  + New Tag
	  </el-button>
    </div>
    <div v-else>
      <el-tag
        :key="value"
        v-for="value in values"
        disable-transitions
        class="bg-indigo-100 text-indigo-500"
        size="medium"
      >
	  	{{value}}
	  </el-tag>
    </div>
  </div>
</template>

<script>
export default {
  created() {
  },

  mounted() {
  },

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
      }
    }
  },

  data() {
    return {
      inputVisible: false,
      inputValue: ""
    };
  },

  methods: {
    // element ui tag methods
    handleClose(tag) {
      this.tempValues.splice(this.tempValues.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.tempValues.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },

  props: {
    item: {
      type: Object,
      required: true
    },
    tempItem: {
      type: Object,
      required: true
    },
    propertyName: {
      type: String,
      required: true
    },
    i18n: {
      type: Boolean,
      required: true
    },
    collectionId: {
      type: String
    },
    projectId: {
      type: String
    },
    active: {
      type: Boolean,
      default: false
    },
    currentLocale: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.tag-div {
  max-width: 200px;
}
.el-tag {
  margin: 3px;
}
.button-new-tag {
  margin: 3px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin: 3px;
  vertical-align: bottom;
}
</style>