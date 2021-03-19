 <template>
  <div class="boolean-div">
    <div v-if="active">
      <el-checkbox v-model="tempValue"></el-checkbox>
    </div>
    <div v-else>
      <el-checkbox v-model="actualValue" disabled></el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  created() {},

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
      },
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
    collectionId: {
      type: String,
    },
    projectId: {
      type: String,
    },
    i18n: {
      type: Boolean,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    currentLocale: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
/* Element UI checkbox style */
/* not checked */
.el-checkbox__input .el-checkbox__inner {
  background-color: #e0e7ff;
  border-color: #6366f1;
}
.el-checkbox__input .el-checkbox__inner::after {
  border-color: #6366f1;
  border-width: 3px;
}
/* not checked, disabled */
.el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: #e0e7ff;
  border-color: #6366f1;
  cursor: not-allowed;
}
/* checked */
.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #e0e7ff;
  border-color: #6366f1;
  color: #6366f1;
}
.el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #6366f1;
  border-width: 3px;
}
/* checked, disabled */
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #6366f1;
  border-color: #6366f1;
  color: #6366f1;
}
.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #ffffff;
  border-width: 1px;
}
</style>