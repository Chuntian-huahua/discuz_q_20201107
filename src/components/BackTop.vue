<template>
  <div class="back-top" v-show="elShow" @click="backTop">
    <span class="back-top-text">返回顶部</span>
    <c-icon value="icon-fold"></c-icon>
  </div>
</template>

<script>
import CTools from "../function/c_tools";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      elShow: false,
    };
  },
  mounted() {
    this.elShow = this.show;
    window.onscroll = CTools.debounce((e) => {
      if (window.scrollY >= window.innerHeight / 2) {
        if (this.elShow === false) {
          this.elShow = true;
        }
      } else {
        if (this.elShow === true) {
          this.elShow = false;
        }
      }
    }, 100);
  },
  methods: {
    backTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style scoped>
.back-top {
  position: fixed;
  right: calc((100vw - var(--main-width)) / 2 - 40px);
  bottom: 25vh;
  padding-right: 34px;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  background-color: white;
  box-shadow: var(--box-shadow-base);
  transition: all 0.3s;
  overflow: hidden;
  user-select: none;
  cursor: pointer;
}
.back-top:hover {
  width: 114px;
  color: #ff4141;
  border-radius: 24px;
  background-color: #ffecec;
}
.back-top .c-icon {
  position: absolute;
  top: 0px;
  right: 3px;
  text-align: center;
  width: 34px;
  height: 34px;
}
.back-top-text {
  display: none;
  vertical-align: middle;
  padding-left: 10px;
  height: 40px;
  text-align: center;
  font-size: 16px;
  opacity: 0;
  transition: opacity 0.2s 0.3s;
}
.back-top:hover .back-top-text {
  display: block;
  opacity: 1;
}
</style>