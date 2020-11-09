<template>
  <div class="video-channel">
    <div class="channel-header">
      <Swiper class="header-swiper" :data="swipers" width="471px" height="266px"></Swiper>
      <div class="header-recommend-videos">
        <mask-video-item v-for="index in 6" :key="index"></mask-video-item>
      </div>
    </div>
    <!-- 时下热门 -->
    <panel class="video-panel">
      <span class="panel-title" slot="title">Hot video</span>
      <div class="video-list">
        <video-item v-for="index in 5" :key="index" />
      </div>
    </panel>
    <!-- 当前频道下的所有视频 每页1000条 -->
    <panel class="video-panel">
      <span class="panel-title" slot="title">More videos</span>
      <div class="video-list">
        <video-item v-for="index in videoCount" :key="index" />
      </div>
    </panel>
    <a-pagination class="all-video-pagination" simple :default-current="1" :total="3000" :defaultPageSize="1000" />
  </div>
</template>

<script>
import Swiper from "@/components/Swiper";
import Panel from "@/components/Panel";
import VideoItem from "@/components/VideoItem";
import MaskVideoItem from "@/components/MaskVideoItem";
import { Pagination } from "ant-design-vue";
import CTools from "../../function/c_tools";
export default {
  mounted() {
    CTools.onScroll(
      500,
      () => {
        console.log(this.videoCount);
        this.videoCount += 20;
      },
      150
    );
  },
  data() {
    return {
      swipers: [
        {
          image:
            "https://pic.rmb.bdstatic.com/baidu-rmb-video-cover-1/2020-8/1598620789888/2b1fc9f72cfe.jpg",
          link:
            "https://haokan.baidu.com/videoui/page/pc/toplist?sfrom=haokan_web_banner",
        },
        {
          image:
            "https://tukuimg.bdstatic.com/processed/22805d8187aac824ff419f3b2be60798.jpeg@s_2,w_681,h_381,q_100,f_webp",
          link: "https://haokan.baidu.com/v?vid=3416810756704124845&tab=yinyue",
        },
        {
          image:
            "https://tukuimg.bdstatic.com/processed/9add95495b989656e083f97caafa5aba.jpeg@s_2,w_681,h_381,q_100,f_webp",
          link: "https://haokan.baidu.com/v?vid=4274877402651156258&tab=yinyue",
        },
      ],
      videoCount: 20,
      videos: [],
    };
  },
  components: {
    Swiper,
    Panel,
    VideoItem,
    MaskVideoItem,
    APagination: Pagination,
  },
};
</script>

<style scoped>
.video-channel {
  margin: 25px auto;
  width: var(--main-width);
}

.channel-header {
  display: grid;
  justify-content: space-between;
  grid-template-columns: 471px 713px;
}
.header-recommend-videos {
  display: grid;
  justify-content: space-between;
  align-content: space-between;
  grid-template-columns: repeat(3, 225px);
}

.video-panel {
  margin-top: 24px;
}
.panel-title {
  font-size: 26px;
}
.video-list {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(5, 225px);
}
.all-video-pagination {
  margin-top:20px;
  text-align:center;
}
</style>