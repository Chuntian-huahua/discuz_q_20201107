<template>
  <div class="home">
    <a-alert
      message="目前是可以浏览视频、发布视频、注册、登录、切换频道等，部分功能可以前往 q.cooocc.com 操作后回到这里浏览效果，例如帖子回复等"
      banner
    ></a-alert>
    <a-collapse accordion style="margin:10px 0;">
      <a-collapse-panel key="1" header="更新记录">
        <ul class=updated-log>
          <li>
            2020-11-16
            <ol>
              <li>增加滚动到一定距离显示视频小弹窗</li>
            </ol>
          </li>
          <li>
            2020-11-15
            <ol>
              <li>增加主题的点赞功能</li>
              <li>增加主题的收藏功能</li>
            </ol>
          </li>
           <li>
            2020-11-14
            <ol>
              <li>增加帖子的回复功能</li>
              <li>增加帖子的评论点赞功能</li>
              <li>发布视频增加频道选择</li>
            </ol>
          </li>
          <li>
            2020-11-07：开始制作
          </li>
        </ul>
      </a-collapse-panel>
    </a-collapse>
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
      :data-index="channelIndex"
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
      <ul class="video-list" v-show="channel.__loaded">
        <li v-for="thread in channel.threads" :key="thread._source.id">
          <video-item :data="thread"></video-item>
        </li>
      </ul>
      <ul class="video-list" v-show="channel.__loaded===false">
        <a-skeleton
          avatar
          :paragraph="{ rows: 4 }"
          v-for="index in 5"
          :key="index"
          :active="channel.__loading"
        />
      </ul>
      <a-empty class="channel-video-empty" v-show="channel.__loaded&&channel.threads.length===0">
        <span slot="description">该频道下还没有视频哦</span>
      </a-empty>
    </Panel>
  </div>
</template>

<script>
import Panel from "@/components/Panel";
import MaskVideoItem from "@/components/MaskVideoItem";
import VideoItem from "@/components/VideoItem";
import { Carousel, Skeleton, Empty, Collapse } from "ant-design-vue";
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
      channels[index]["__loading"] = false;
      channels[index]["threads"] = [];
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
          () => {
            let index = Number(el.dataset.index);
            if (this.channels[index]["__loaded"] === false) {
              this.getCategoryVideoThread(
                this.channels[index]["_source"]["id"],
                index
              );
            }
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
          "filter[isApproved]": 1,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res)["data"];
          this.recommendThreads = threads;
        });
    },
    getCategoryVideoThread(categoryId, index) {
      if (this.channels[index]["__loading"] === true) {
        return;
      }
      this.channels[index]["__loading"] = true;
      this.$dzq.request
        .get("/threads", {
          include: "threadVideo",
          "filter[isDeleted]": "no",
          "filter[isApproved]": 1,
          "filter[type]": 2,
          "page[limit]": 5,
          "filter[categoryId]": categoryId,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res)["data"];
          this.channels[index]["threads"] = threads;
          this.channels[index]["__loaded"] = true;
          this.channels[index]["__loading"] = false;
        });
    },
  },
  components: {
    Panel,
    MaskVideoItem,
    VideoItem,
    ACarousel: Carousel,
    ASkeleton: Skeleton,
    AEmpty: Empty,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
  },
};
</script>

<style scoped>
.home {
  margin: 25px auto;
  width: var(--main-width);
}

.updated-log>li {
  margin-bottom:10px;
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
