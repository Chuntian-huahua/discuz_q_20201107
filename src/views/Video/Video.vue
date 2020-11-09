<template>
  <div class="video-page">
    <a-row type="flex" justify="space-between">
      <a-col :span="18">
        <div class="left-col">
          <video
            class="thread-video"
            id="player-container-id"
            preload="auto"
            playsinline
            webkit-playsinline
            x5-playsinline
          ></video>
          <div class="video-info">
            <h2 class="thread-title ellipsis1">可怕危机终于爆发，印度这次捂不住，印媒炒作：将会有大事发生</h2>
            <div class="thread-details">
              <div>50万次播放 | 发布时间：2020年8月18日</div>
              <ul class="thread-operate">
                <li class="thread-operate-item">
                  <c-icon value="icon-appreciate" size="22px"></c-icon>3971
                </li>
                <li class="thread-operate-item">
                  <c-icon value="icon-favor" size="22px"></c-icon>收藏
                </li>
                <li class="thread-operate-item">
                  <c-icon value="icon-forward" size="22px"></c-icon>分享
                </li>
                <li class="thread-operate-item">
                  <c-icon value="icon-mobile" size="22px"></c-icon>用手机看
                </li>
                <li class="thread-operate-item">
                  <a-dropdown placement="bottomCenter">
                    <c-icon value="icon-more" size="22px"></c-icon>
                    <router-link to="/" class="dropdown-overlay" slot="overlay">
                      举报
                    </router-link>
                  </a-dropdown>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="6">
        <img src="../../assets/ad_images/1.png" class="right-ad-space" />
        <panel title="接下来播放">
          <div class="autoplay-next" slot="header-right">
            自动播放
            <a-switch size="small"></a-switch>
          </div>
          <div class="next-videos">
            <l-f-video-item class="next-video-item" v-for="index in 8" :key="index"></l-f-video-item>
          </div>
        </panel>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Switch, Dropdown } from "ant-design-vue";
import Panel from "@/components/Panel";
import LFVideoItem from "@/components/LFVideoItem";

let TCPLayer = null;
export default {
  data() {
    return {
      threadId: null,
      videoId: "5285890809629935806",
      reload: false,
    };
  },
  created() {
    if (TCPLayer) {
      TCPLayer.dispose();
    }
    this.threadId = this.$route.params.thread_id;
  },
  mounted() {
    this.reloadPlayer();
  },
  methods: {
    reloadPlayer() {
      TCPLayer = TCPlayer("player-container-id", {
        /**player-container-id 为播放器容器ID，必须与html中一致*/
        fileID: this.videoId /**请传入需要播放的视频fileID 必须 */,
        appID: "1500002358" /**请传入点播账号的appID 必须 */,
        psign: "",
        bigPlayButton: false,
        /**其他参数请在开发文档中查看 */
      });
    },
  },
  components: {
    Panel,
    LFVideoItem,
    ASwitch: Switch,
    ADropdown: Dropdown,
  },
};
</script>

<style scoped>
.video-page {
  margin: 40px auto;
  width: var(--main-width);
}
.left-col {
  margin-right: 32px;
}
.thread-video {
  width: 100%;
  height: 488.25px;
  object-fit: unset;
  overflow: hidden;
  border-radius: var(--border-radius-base);
  background: black;
}
.video-info {
  margin-top: 18px;
}
.thread-title {
  font-size: 22px;
  max-height: 60px;
  line-height: 30px;
}
.thread-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 33px;
  margin-top: 15px;
  color: #666;
}
.thread-operate {
  display: flex;
}
.thread-operate-item {
  display: flex;
  align-items: center;
  margin-left: 16px;
  font-size: 13px;
  color: #000;
  cursor: pointer;
}
.thread-operate-item:hover {
  color: var(--primary-color);
}
.thread-operate-item .c-icon {
  margin-right: 3px;
  font-size: 22px;
}

.right-ad-space {
  margin-bottom: 28px;
  height: 174px;
}

.next-video-item {
  margin-bottom: 16px;
}
</style>