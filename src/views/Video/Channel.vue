<template>
  <div class="video-channel">
    <div class="channel-header">
      <Swiper class="header-swiper" :data="swipers" width="471px" height="266px"></Swiper>
      <div class="header-recommend-videos">
        <mask-video-item
          v-for="threadItem in recommendThreads"
          :key="threadItem._source.id"
          :data="threadItem"
        ></mask-video-item>
      </div>
    </div>
    <!-- 时下热门 -->
    <panel class="video-panel">
      <span class="panel-title" slot="title">时下热门</span>
      <div class="video-list" v-show="hotThreads.length>0">
        <video-item
          v-for="threadItem in hotThreads"
          :key="threadItem._source.id"
          :data="threadItem"
        />
      </div>
      <a-empty description="还没有视频捏" v-show="hotThreads.length===0"></a-empty>
    </panel>
    <!-- 当前频道下的所有视频 每页1000条 -->
    <panel class="video-panel">
      <span class="panel-title" slot="title">更多精选</span>
      <div class="video-list" v-show="threads.length>0">
        <video-item v-for="threadItem in threads" :key="threadItem._source.id" :data="threadItem" />
      </div>
      <a-empty description="还没有视频捏" v-show="threads.length===0"></a-empty>
    </panel>
    <a-pagination
      class="all-video-pagination"
      simple
      :default-current="currentThreadPage"
      :total="threadTotalCount"
      :defaultPageSize="1000"
      :hideOnSinglePage="true"
    />
  </div>
</template>

<script>
import Swiper from "@/components/Swiper";
import Panel from "@/components/Panel";
import VideoItem from "@/components/VideoItem";
import MaskVideoItem from "@/components/MaskVideoItem";
import { Pagination, Empty } from "ant-design-vue";
import CTools from "../../function/c_tools";
export default {
  mounted() {
    this.categoryId = this.$route.params.channel_id;
    this.getRecommendThreads();
    this.getHotVideoThreads();
    this.getThreadVideos();
    CTools.distanceBottom(300, this.getThreadVideos);
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
      categoryId: 0,
      recommendThreads: [],
      hotThreads: [],
      threads: [],
      currentThreadPage: 1,
      currentThreadLoadPage: 0,
      currentThreadLoadLimit: 5,
      currentThreadLoadFinished: false,
      currentThreadLoadLoading: false,
      threadTotalCount: 0,
    };
  },
  methods: {
    getRecommendThreads() {
      this.$dzq.request
        .get("/threads", {
          include: "threadVideo,user",
          "filter[type]": 2,
          "filter[isDeleted]": "no",
          "page[limit]": 6,
          "filter[categoryId]": this.categoryId,
          "filter[isApproved]": 1,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res);
          this.recommendThreads = threads["data"];
        });
    },
    getHotVideoThreads() {
      this.$dzq.request
        .get("/threads", {
          include: "threadVideo",
          "filter[type]": 2,
          "filter[isDeleted]": "no",
          "page[limit]": 5,
          "filter[categoryId]": this.categoryId,
          "filter[isApproved]": 1,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res);
          this.hotThreads = threads["data"];
        });
    },
    getThreadVideos() {
      if (
        this.currentThreadLoadFinished === true ||
        this.currentThreadLoadLoading === true
      ) {
        return;
      }
      this.currentThreadLoadLoading = true;
      this.currentThreadLoadPage++;
      this.$dzq.request
        .get("/threads", {
          include: "threadVideo",
          "filter[type]": 2,
          "filter[isDeleted]": "no",
          "page[limit]": this.currentThreadLoadLimit,
          "page[number]": this.currentThreadLoadPage,
          "filter[categoryId]": this.categoryId,
          "filter[isApproved]": 1,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res);
          if (threads["data"].length < this.currentThreadLoadLimit) {
            this.currentThreadLoadFinished = true;
          }
          this.threads = this.threads.concat(threads["data"]);
          this.currentThreadLoadLoading = false;
          this.threadTotalCount = threads.meta.threadCount;
        });
    },
  },
  watch: {
    "$route.params.channel_id"() {
      this.recommendThreads = [];
      this.threads = [];
      this.hotThreads = [];
      this.categoryId = this.$route.params.channel_id;
      this.currentThreadLoadPage = 0;
      this.currentThreadPage = 1;
      this.currentThreadLoadLoading = false;
      this.currentThreadLoadFinished = false;
      this.getRecommendThreads();
      this.getHotVideoThreads();
      this.getThreadVideos();
    },
  },
  components: {
    Swiper,
    Panel,
    VideoItem,
    MaskVideoItem,
    APagination: Pagination,
    AEmpty: Empty,
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
  margin-top: 20px;
  text-align: center;
}
</style>