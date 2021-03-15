 <template>
  <div class="url-div">
    <div v-if="active">
      <el-input
        v-model="tempValue"
        :placeholder="propertyName"
        type="url"
        size="medium"
      ></el-input>
    </div>
    <div v-else class="url-div">
      <img :src="actualValue" :alt="actualValue" class="image" />
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
.image {
  width: 100px;
}
.url-div {
  padding: 5px 0 5px 0;
}
audio {
  height: 35px;
}
.url {
  color: #607cc4;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>