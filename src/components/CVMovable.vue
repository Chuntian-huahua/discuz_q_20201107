<template>
  <div
    class="cv-movable"
    :style="{position,left:elLeft,top:elTop,zIndex,width,height,cursor:disabled?'default':'move'}"
    @mousedown.stop="mouseDown"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "426px",
    },
    height: {
      type: String,
      default: "235px",
    },
    position: {
      type: String,
      default: "fixed",
    },
    zIndex: {
      type: Number,
      default: 10,
    },
    top: {
      type: String,
      default: "300px",
    },
    left: {
      type: String,
      default: "50%",
    },
  },
  data() {
    return {
      elLeft: 200,
      elTop: 300,
    };
  },
  mounted() {
    this.elLeft = this.left;
    this.elTop = this.top;
  },
  methods: {
    mouseDown(e) {
      if (this.disabled === true) {
        return;
      }
      let clientX = e.clientX;
      let offsetLeft = e.clientX - e.offsetX;
      let clientY = e.clientY;
      let offsetTop = e.clientY - e.offsetY;
      let moveX = 0;
      let moveY = 0;
      let elWidth = e.target.offsetWidth;
      let elHeight = e.target.offsetHeight;
      document.onmousemove = (e) => {
        moveX = clientX - e.clientX;
        if (e.clientX - e.offsetX <= 0) {
          if (clientX - e.clientX <= -1 || e.clientX >= elWidth - 40) {
            this.elLeft = offsetLeft - moveX;
          } else {
            this.elLeft = 0 + "px";
          }
        } else {
          if (offsetLeft - moveX + elWidth > window.innerWidth) {
            this.elLeft = window.innerWidth - elWidth + "px";
          } else {
            this.elLeft = offsetLeft - moveX + "px";
          }
        }

        moveY = clientY - e.clientY;
        if (e.clientY - e.offsetY <= 0) {
          if (clientY - e.clientY <= -1 || e.clientY >= elHeight - 40) {
            this.elTop = offsetTop - moveY;
          } else {
            this.elTop = 0 + "px";
          }
        } else {
          if (offsetTop - moveY + elHeight > window.innerHeight) {
            this.elTop = window.innerHeight - elHeight + "px";
          } else {
            this.elTop = offsetTop - moveY + "px";
          }
        }
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
  },
  watch: {
    left() {
      this.elLeft = this.left;
    },
    top() {
      this.elTop = this.top;
    },
  },
};
</script>

<style scoped>
.cv-movable {
  position: fixed;
  background: white;
  box-shadow: var(--box-shadow-base);
}
</style>