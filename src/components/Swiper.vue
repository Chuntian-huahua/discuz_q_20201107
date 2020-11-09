<template>
  <a-carousel
    class="swiper"
    arrows
    :autoplay="autoplay"
    :dotPosition="dotPosition"
    :style="{ width,height }"
  >
    <div slot="prevArrow" class="swiper-button swiper-prev">
      <c-icon value="icon-back"></c-icon>
    </div>
    <div slot="nextArrow" class="swiper-button swiper-next">
      <c-icon value="icon-right"></c-icon>
    </div>
    <a
      class="swiper-link"
      :href="swiperItem['link']"
      v-for="(swiperItem,swiperItemIndex) in data"
      :key="swiperItemIndex"
      :style="{ height }"
    >
      <img :src="swiperItem['image']" />
    </a>
  </a-carousel>
</template>

<script>
import { Carousel } from "ant-design-vue";
export default {
  name: "swiper",
  props: {
    data: {
      type: Array,
      default: [],
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    dotPosition: {
      type: String,
      default: "bottom",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
    },
  },
  components: {
    ACarousel: Carousel,
  },
};
</script>

<style scoped>
.swiper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--border-radius-base);
}
.swiper-link {
  height: 100%;
  overflow: hidden;
}
.swiper img {
  width: 100%;
  height: 100%;
}
.swiper-button {
  z-index: 1;
  width: 30px !important;
  height: 38px !important;
  line-height: 38px !important;
  color: white !important;
  text-align: center;
  background: rgba(0, 0, 0, 0.2) !important;
}
.swiper-prev {
  left: -100% !important;
  border-radius: 0 50% 50% 0;
  transition: left 0.3s ease-in-out;
}
.swiper:hover .swiper-prev {
  left: 0px !important;
}
.swiper-next {
  right: -100% !important;
  border-radius: 50% 0 0 50%;
  transition: right 0.3s ease-in-out;
}
.swiper:hover .swiper-next {
  right: 0px !important;
}
</style>