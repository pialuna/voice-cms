 <template>
  <div>
    <div v-if="active">
	  <el-date-picker
      v-model="tempValue"
      type="date"
      placeholder="Pick a date"
	  size="medium">
    </el-date-picker>
    </div>
    <div v-else >
      {{ actualValue }}
    </div>
  </div>
</template>

<script>
export default {
  created() {
  },

computed: {
    actualValue() {
      if (this.i18n) {
        return this.item.i18n[this.propertyName][this.currentLocale];
      } else {
        return this.item[this.propertyName];
      }
    },
    tempValue: {
      get() {
        if (this.i18n) {
          return this.tempItem.i18n[this.propertyName][this.currentLocale];
        } else {
          return this.tempItem[this.propertyName];
        }
      },
      set(value) {
        if (this.i18n) {
          this.tempItem.i18n[this.propertyName][this.currentLocale] = value;
        } else {
          this.tempItem[this.propertyName] = value;
        }
      }
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
    collectionId: {
      type: String
    },
    projectId: {
      type: String
	},
	i18n: {
      type: Boolean,
      required: true
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
</style>