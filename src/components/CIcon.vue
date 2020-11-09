<template>
  <span class="c-icon" :style="{borderRadius:isImage?'unset':borderRadius}">
    <img :src="value" v-if="isImage" :style="{width:elWidth,height:elHeight,borderRadius}" />
    <i :class="[prefix,value]" v-else :style="{'font-size':fontSize}"></i>
  </span>
</template>

<script>
export default {
  name: "c-icon",
  props: {
    prefix: {
      type: String,
      default: "iconfont",
    },
    value: {
      type: String,
      default: "",
    },
    size: {
      type: Number | String,
      default: null,
    },
    width: {
      type: Number | String,
      default: null,
    },
    height: {
      type: Number | String,
      default: null,
    },
    radius: {
      type: Number | String,
      default: null,
    },
  },
  data() {
    return {
      isImage: false,
      elWidth: 0,
      elHeight: 0,
      fontSize: 0,
      borderRadius: "unset",
    };
  },
  created() {
    if (/(https?|base64)/.test(this.value)) {
      this.isImage = true;
    }
    if (this.size !== null) {
      if (typeof this.size === "number") {
        this.fontSize = `${this.size}px`;
      } else {
        this.fontSize = this.size;
      }
      if (this.isImage) {
        this.elHeight = this.elWidth = this.fontSize;
      }
    } else if (this.width || this.height) {
      if (typeof this.height === "number") {
        this.elHeight = `${this.height}px`;
      }
      if (typeof this.width === "number") {
        this.elWidth = `${this.width}px`;
      }
      this.fontSize = this.elWidth = this.elHeight = this.height || this.width;
    } else {
      this.fontSize = this.elHeight = this.elWidth = "20px";
    }
    if (this.radius !== null) {
      if (typeof this.radius === "number") {
        this.borderRadius = `${this.radius}px`;
      } else {
        this.borderRadius = this.radius;
      }
    }
  },
};
</script>

<style scoped>
.c-icon {
  /* display: inline-block; */
  overflow: hidden;
}
</style>