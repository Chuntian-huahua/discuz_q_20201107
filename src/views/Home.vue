<template>
  <div class="home">
    <div class="home-recommend">
      <a-carousel class="recommend-swiper" arrows autoplay dotPosition="top">
        <div slot="prevArrow" class="recommend-swiper-button recommend-swiper-prev">
          <c-icon value="icon-back"></c-icon>
        </div>
        <div slot="nextArrow" class="recommend-swiper-button recommend-swiper-next">
          <c-icon value="icon-right"></c-icon>
        </div>
        <router-link class="recommend-swiper-link" to="/">
          <img
            src="https://pic.rmb.bdstatic.com/baidu-rmb-video-cover-1/2020-8/1598620789888/2b1fc9f72cfe.jpg"
          />
        </router-link>
        <router-link class="recommend-swiper-link" to="/">
          <img
            src="https://tukuimg.bdstatic.com/processed/1f8804e918af81229d1d7d01400dedb7.jpg@s_2,w_681,h_381,q_100,f_webp"
          />
        </router-link>
      </a-carousel>
      <div class="recommend-video">
        <mask-video-item
          v-for="threadItem in recommendThreads"
          :data="threadItem"
          :key="threadItem._source.id"
        ></mask-video-item>
      </div>
    </div>
    <Panel
      :ref="`channel_${channelIndex}`"
      class="video-panel"
      v-for="(channel,channelIndex) in channels"
      :key="channel._source.id"
    >
      <router-link
        class="channel-name"
        :to="`/channel/${channel._source.id}`"
        slot="title"
      >{{ channel.name }}</router-link>
      <router-link class="channel-more" slot="header-right" :to="`/channel/${channel._source.id}`">
        更多
        <c-icon value="icon-right" size="14px"></c-icon>
      </router-link>
      <ul class="video-list">
        <li v-for="iindex in 5" :key="iindex">
          <video-item></video-item>
        </li>
      </ul>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import MaskVideoItem from "@/components/MaskVideoItem";
import VideoItem from "@/components/VideoItem";
import { Carousel } from "ant-design-vue";
import CTools from "../function/c_tools";
export default {
  name: "Home",
  data() {
    return {
      recommendThreads: [],
      channels: [],
    };
  },
  created() {
    this.getRecommendVideoThread();
    let channels = JSON.parse(JSON.stringify(this.$state.categories));
    for (let index in channels) {
      channels[index]["__loaded"] = false;
    }
    this.channels = channels;
  },
  mounted() {
    let refs = this.$refs;
    let categoriesDom = [];
    for (let name in refs) {
      if (/channel_\d+/.test(name)) {
        let el = refs[name][0]["$el"];
        CTools.onScroll(
          (windowScrollTop) => {
            console.log(windowScrollTop);
          },
          el.offsetTop - window.innerHeight,
          null,
          true
        );
      }
    }
  },
  methods: {
    getRecommendVideoThread() {
      this.$dzq.request
        .get("/threads", {
          include: "threadVideo,user",
          "filter[isDeleted]": "no",
          "filter[type]": 2,
          "page[limit]": 6,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res)["data"];
          this.recommendThreads = threads;
        });
    },
  },
  components: {
    Panel,
    MaskVideoItem,
    VideoItem,
    ACarousel: Carousel,
  },
};
</script>

<style scoped>
.home {
  margin: 25px auto;
  width: var(--main-width);
}

.channel-name {
  font-size: 26px;
  color: #000;
}
.channel-more {
  color: #888;
}

.home-recommend {
  display: grid;
  justify-content: space-between;
  grid-template-columns: 471px 713px;
}

.recommend-swiper {
  width: 471px;
  height: 266px;
  overflow: hidden;
  border-radius: var(--border-radius-base);
}
.recommend-swiper-link {
  height: 266px;
  overflow: hidden;
}
.recommend-swiper img {
  width: 100%;
  height: 100%;
}
.recommend-swiper-button {
  z-index: 1;
  width: 30px !important;
  height: 38px !important;
  line-height: 38px !important;
  color: white !important;
  text-align: center;
  background: rgba(0, 0, 0, 0.2) !important;
}
.recommend-swiper-prev {
  left: -100% !important;
  border-radius: 0 50% 50% 0;
  transition: left 0.3s ease-in-out;
}
.recommend-swiper:hover .recommend-swiper-prev {
  left: 0px !important;
}
.recommend-swiper-next {
  right: -100% !important;
  border-radius: 50% 0 0 50%;
  transition: right 0.3s ease-in-out;
}
.recommend-swiper:hover .recommend-swiper-next {
  right: 0px !important;
}

.recommend-video {
  display: grid;
  justify-content: space-between;
  align-content: space-between;
  grid-template-columns: repeat(3, 225px);
}

.video-panel {
  margin-top: 24px;
}
.video-list {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(5, 225px);
}
</style>
