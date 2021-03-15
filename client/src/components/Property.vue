<template>
  <div>
    <div v-if="plaintext">{{ item[propertyName] }}</div>
    <div v-if="boolean">
      <boolean-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></boolean-component>
    </div>
    <div v-if="checkbox">
      <checkbox-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></checkbox-component>
    </div>
    <div v-if="textfield">
      <textfield-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></textfield-component>
    </div>
    <div v-if="urlfield">
      <urlfield-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></urlfield-component>
    </div>
    <div v-if="audiourl">
      <audio-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></audio-component>
    </div>
    <div v-if="imageurl">
      <image-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></image-component>
    </div>
    <div v-if="textarray">
      <!-- textarray: pass down response-text-variables -->
      <textarray-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
        :variables="variables"
      ></textarray-component>
    </div>
    <div v-if="tags">
      <tags-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></tags-component>
    </div>
    <div v-if="date">
      <date-component
        :item="item"
        :tempItem="tempItem"
        :collectionId="collectionId"
        :projectId="projectId"
        :propertyName="propertyName"
        :i18n="i18n"
        :active="active"
        :currentLocale="currentLocale"
      ></date-component>
    </div>
  </div>
</template>

<script>
import Textfield from "./PropertyTypes/Textfield.vue";
import UrlField from "./PropertyTypes/UrlField.vue";
import AudioUrl from "./PropertyTypes/AudioUrl.vue";
import ImageUrl from "./PropertyTypes/ImageUrl.vue";
import TextArray from "./PropertyTypes/TextArray.vue";
import BooleanComponent from "./PropertyTypes/Boolean.vue";
import Checkbox from "./PropertyTypes/Checkbox.vue";
import DateComponent from "./PropertyTypes/Date.vue";
import Tags from "./PropertyTypes/Tags.vue";

export default {
  components: {
    textfieldComponent: Textfield,
    urlfieldComponent: UrlField,
    audioComponent: AudioUrl,
    imageComponent: ImageUrl,
    textarrayComponent: TextArray,
    booleanComponent: BooleanComponent,
    checkboxComponent: Checkbox,
    tagsComponent: Tags,
    dateComponent: DateComponent,
  },

  data() {
    return {
      plaintext: this.propertyType === "plaintext",
      textfield: this.propertyType === "textfield",
      urlfield: this.propertyType === "urlfield",
      audiourl: this.propertyType === "audiourl",
      imageurl: this.propertyType === "imageurl",
      textarray: this.propertyType === "textarray",
      boolean: this.propertyType === "boolean",
      checkbox: this.propertyType === "checkbox",
      tags: this.propertyType === "tags",
      date: this.propertyType === "date",
    };
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
    propertyType: {
      type: String,
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
      required: true,
    },
    projectId: {
      type: String,
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
    // variables obj array, only for TextArray
    variables: {
      type: Array,
      required: false,
    },
  },
};
</script>
