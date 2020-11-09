<template>
  <div class="video-page">
    <a-row type="flex" justify="space-between">
      <a-col :span="18">
        <div class="left-col">
          <video-player class="thread-video" :fileid="videoId">
          </video-player>
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
                    <router-link to="/" class="dropdown-overlay" slot="overlay">举报</router-link>
                  </a-dropdown>
                </li>
              </ul>
            </div>
            <div class="thread-author">
              <router-link to="/user/1">
                <img
                  src="https://pic.rmb.bdstatic.com/fa8a02c6084744885a01a63c1b9d3c33.jpeg@s_2,w_272,h_272,q_80"
                  class="author-avatar"
                />
              </router-link>
              <div class="thread-author-info">
                <p class="thread-author-username">
                  <router-link to="/user/1">看看你的兔子</router-link>
                </p>
                <p class="thread-author-detail">波动影视旗下帐号 | 17万粉丝</p>
              </div>
              <a-button type="primary" class="thread-author-follow">
                <c-icon value="icon-add" size="14px"></c-icon>关注
              </a-button>
            </div>
          </div>
          <div class="thread-posts">
            <h3 class="thread-posts-title">
              <c-icon value="icon-message" size="22px"></c-icon>324条评论
            </h3>
            <div class="thread-posts-publish">
              <img
                class="thread-posts-publish-author-avatar"
                src="https://pic.rmb.bdstatic.com/bjh/user/8332461672aadc1660ab21db2b580a1b.jpeg?x-bce-process=image/resize,m_lfit,w_100,h_100"
              />
              <div class="thread-posts-publish-main">
                <comment-input
                  placeholder="说说你的看法"
                  :autoSize="{ minRows: 5, maxRows: 7 }"
                  :value="commentValue"
                  @change="commentValue=$event"
                />
              </div>
            </div>
            <ul class="thread-posts-list">
              <post-item class="thread-post-item" :has-comment="true" />
            </ul>
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
import { Switch, Dropdown, Input } from "ant-design-vue";
import Panel from "@/components/Panel";
import LFVideoItem from "@/components/LFVideoItem";
import CommentInput from "@/components/CommentInput";
import PostItem from "@/components/PostItem";
import VideoPlayer from "@/components/VideoPlayer";

export default {
  data() {
    return {
      threadId: null,
      videoId: "5285890809629935806",
      reload: false,
      commentValue: "123",
    };
  },
  methods: {
  },
  components: {
    Panel,
    LFVideoItem,
    CommentInput,
    PostItem,
    VideoPlayer,
    ASwitch: Switch,
    ADropdown: Dropdown,
    AInput: Input,
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
.thread-author {
  display: flex;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #ebebeb;
}
.author-avatar {
  flex-shrink: 0;
  width: 54px;
  height: 54px;
  border-radius: 50%;
}
.thread-author-info {
  flex-grow: 1;
  margin-left: 12px;
}
.thread-author-username a {
  color: #000;
  font-size: 18px;
  font-weight: bold;
}
.thread-author-detail {
  font-size: 16px;
  color: #666;
}
.thread-author-follow {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 评论 */
.thread-posts {
  margin-top: 20px;
  padding-left: 15px;
}
.thread-posts-publish {
  display: flex;
  justify-content: space-between;
}
.thread-posts-title {
  margin-bottom: 18px;
  font-size: 20px;
  font-weight: 400;
  color: #000;
}
.thread-posts-title .c-icon {
  margin-right: 5px;
}
.thread-posts-publish-author-avatar {
  margin-right: 23px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
.thread-posts-publish-main {
  flex-grow: 1;
}

/* 评论列表 */
.thread-post-item {
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid #ebebeb;
}

.right-ad-space {
  margin-bottom: 28px;
  height: 174px;
}

.next-video-item {
  margin-bottom: 16px;
}
</style>