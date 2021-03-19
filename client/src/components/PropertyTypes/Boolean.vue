 <template>
  <div class="boolean-div">
    <div v-if="active">
      <el-switch
        style="display: block"
        v-model="tempValue"
        active-color="rgba(103,194,58,.2)"
        inactive-color="rgba(245,108,108,.2)"
        :active-text="`${tempValue}`"
      ></el-switch>
    </div>
    <div v-else>
      <el-tag
        v-if="actualValue"
        type="success"
        :disable-transitions="true"
        size="small"
      >
        {{ actualValue }}
      </el-tag>
      <el-tag v-else type="danger" :disable-transitions="true" size="small">
        {{ actualValue }}
      </el-tag>
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
.boolean-div {
  width: 200px;
}
/* Element UI switch style */
.el-switch__label.is-active {
	color: #6366f1;
}
.el-switch__label{
	color: #6366f1;
}
</style>