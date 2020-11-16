<template>
  <div class="video-page">
    <a-row type="flex" justify="space-between" v-if="pageLoaded">
      <a-col ref="videoPageLeft" :span="18">
        <div class="left-col">
          <a-alert
            message="当前视频审核中"
            type="warning"
            style="margin-bottom:10px;"
            banner
            v-if="thread.isApproved==0"
          ></a-alert>
          <div class="thread-video-wrapper">
            <c-v-movable
              :position="videoFixed?'fixed':'static'"
              width="auto"
              :height="videoFixed?'240px':'488px'"
              :z-index="9999"
              top="300px"
              :left="videoFixedLeft"
              :disabled="!videoFixed"
            >
              <video-player
                class="thread-video"
                :style="{ width:videoFixed?'430px':'100%',height:videoFixed?'240px':'100%' }"
                :fileid="thread['thread-video']['file_id']"
                :appid="appId"
                :controls="!videoFixed"
                :controlBar="{progressControl:true}"
                :bigPlayButton="!videoFixed"
                :play="videoPlay"
                :pause="!videoPlay"
                @pause="videoPlay=false"
                @play="videoPlay=true"
                v-if="thread.isApproved&&thread['thread-video']['file_id']"
              >
                <div v-show="videoFixed">
                  <div
                    class="thread-video-mini-operate"
                    @mousemove.stop
                    @click="videoPlay=true"
                    v-show="videoPlay===false"
                  >
                    <c-icon
                      class="thread-video-mini-operate-item"
                      value="icon-playfill"
                      size="30px"
                      radius="50%"
                    ></c-icon>
                  </div>
                  <div
                    class="thread-video-mini-operate"
                    @mousemove.stop
                    @click="videoPlay=false"
                    v-show="videoPlay"
                  >
                    <c-icon
                      class="thread-video-mini-operate-item"
                      value="icon-pause"
                      size="30px"
                      radius="50%"
                    ></c-icon>
                  </div>
                  <div class="thread-video-mini-mask"></div>
                </div>
              </video-player>
            </c-v-movable>
          </div>

          <div class="video-info">
            <h2 class="thread-title ellipsis1">{{ thread.posts.content }}</h2>
            <div class="thread-details">
              <div>{{ thread.viewCount }}次播放 | 发布时间：{{ thread.createdAt }}</div>
              <ul class="thread-operate">
                <li class="thread-operate-item" @click="likeThread">
                  <c-icon
                    :value="thread.posts.isLiked?'icon-appreciatefill':'icon-appreciate'"
                    size="22px"
                  ></c-icon>
                  {{ thread.posts.likeCount }}
                </li>
                <li class="thread-operate-item" @click="favoriteThread">
                  <c-icon :value="thread.isFavorite?'icon-favorfill':'icon-favor'" size="22px"></c-icon>
                  {{ thread.isFavorite?'已收藏':'收藏' }}
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
                <img :src="thread['users']['avatarUrl']" class="author-avatar" />
              </router-link>
              <div class="thread-author-info">
                <p class="thread-author-username">
                  <router-link to="/user/1">{{ thread['users'].username }}</router-link>
                </p>
                <p
                  class="thread-author-detail"
                >{{ thread['users'].signature }} | {{ thread['users'].fansCount }}粉丝</p>
              </div>
              <a-button type="primary" class="thread-author-follow">
                <c-icon value="icon-add" size="14px"></c-icon>关注
              </a-button>
            </div>
          </div>
          <div class="thread-posts">
            <h3 class="thread-posts-title">
              <c-icon value="icon-message" size="22px"></c-icon>
              {{ posts.length }}条评论
            </h3>
            <div class="thread-posts-publish" v-if="$state.user.isLogin">
              <img class="thread-posts-publish-author-avatar" :src="$state.user.avatarUrl" />
              <div class="thread-posts-publish-main">
                <comment-input
                  placeholder="说说你的看法"
                  :autoSize="{ minRows: 5, maxRows: 7 }"
                  :value="commentValue"
                  @reply="sendComment"
                  :loading="sendLoading"
                />
              </div>
            </div>
            <ul class="thread-posts-list">
              <post-item
                class="thread-post-item"
                :has-comment="true"
                :data="postItem"
                v-for="postItem in posts"
                :key="postItem._source.id"
                :thread-id="threadId"
              />
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
            <l-f-video-item
              class="next-video-item"
              v-for="threadItem in relatedThreads"
              :key="threadItem._source.id"
              :data="threadItem"
            ></l-f-video-item>
          </div>
        </panel>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Switch, Dropdown, Input, Alert } from "ant-design-vue";
import Panel from "@/components/Panel";
import LFVideoItem from "@/components/LFVideoItem";
import CommentInput from "@/components/CommentInput";
import PostItem from "@/components/PostItem";
import VideoPlayer from "@/components/VideoPlayer";
import CVMovable from "@/components/CVMovable";
import CTools from "../../function/c_tools";
import serializer from "../../function/CDiscuzQ/serializer";
import Config from "../../config";

export default {
  data() {
    return {
      pageLoaded: false,
      thread: null,
      threadId: null,
      reload: false,
      commentValue: "",
      relatedThreads: [],
      posts: [],
      appId: Config.TovAppId,
      sendLoading: false,
      videoFixedLeft: "200px",
      videoPlay: false,
      videoFixed: false,
    };
  },
  created() {
    this.threadId = this.$route.params.thread_id;
  },
  mounted() {
    this.getThreads();
    this.getRelatedThreads();
    this.getThreadPosts();
    CTools.onScroll(
      () => {
        let el = this.$refs["videoPageLeft"]["$el"];
        this.videoFixedLeft =
          el["scrollWidth"] + el["offsetLeft"] - 426 - 30 + "px";
      },
      window.innerHeight * 0.1,
      null,
      true
    );
    CTools.onScroll(
      () => {
        this.videoFixed = true;
        // let el = this.$refs["videoPageLeft"]["$el"];
        // this.videoFixedLeft =
        //   el["scrollWidth"] + el["offsetLeft"] - 426 - 30 + "px";
      },
      window.innerHeight,
      null,
      false,
      null,
      () => {
        this.videoFixed = false;
      }
    );
  },
  methods: {
    getThreads() {
      this.pageLoaded = false;
      this.$dzq.request
        .get("/threads/" + this.threadId, {
          include: ["user", "firstPost", "threadVideo"],
        })
        .then((res) => {
          let thread = this.$dzq.serializer(res);
          thread = thread["data"];
          if (thread["isDeleted"] === true) {
            this.$message.error("视频不存在");
            this.$router.go(-1);
            return;
          }
          thread["posts"]["content"] = String(
            thread["posts"]["content"]
          ).trim();
          this.thread = thread;
          this.pageLoaded = true;
        });
    },
    getRelatedThreads() {
      this.$dzq.request
        .get("/threads/relate/" + this.threadId, {
          limit: 20,
          include: ["firstPost", "threadVideo"],
          "filter[type]": 2,
        })
        .then((res) => {
          let threads = this.$dzq.serializer(res);
          threads = threads["data"];
          this.relatedThreads = threads;
        });
    },
    getThreadPosts() {
      this.$dzq.request
        .get("/posts", {
          include:
            "user,replyUser,images,thread,user.groups,thread.category,thread.firstPost,lastThreeComments,lastThreeComments.user,lastThreeComments.replyUser,deletedUser,lastDeletedLog,lastThreeComments.images",
          "filter[thread]": this.threadId,
          "filter[isApproved]": 1,
          "filter[isDeleted]": "no",
          "filter[isComment]": "no",
          sort: "-createdAt",
          "page[number]": 1,
          "page[limit]": 5,
        })
        .then((res) => {
          let searializerData = this.$dzq.serializer(res);
          if (searializerData["data"].length > 0) {
            let postComments = searializerData["included"]["comment-posts"];
            let postsData = searializerData["data"];
            for (let id in postsData) {
              if (postsData[id]["lastThreeComments"].length > 0) {
                for (let index in postsData[id]["lastThreeComments"]) {
                  let commenId = postsData[id]["lastThreeComments"][index];
                  postsData[id]["lastThreeComments"][index] =
                    postComments[postsData[id]["lastThreeComments"][index]];
                }
              }
            }
            this.posts = postsData;
          }
        });
    },
    sendComment(content) {
      if (!this.$state.user.isLogin) {
        this.$message.warning("请登录后重试");
        return;
      }
      if (!content) {
        this.$message.warning("请输入内容");
        return;
      }
      this.sendLoading = true;
      this.$dzq.request
        .postData(
          "/posts",
          {
            content,
          },
          {
            thread: {
              type: "threads",
              id: this.threadId,
            },
          }
        )
        .then((res) => {
          let post = this.$dzq.serializer(res);
          post = post["data"];
          this.posts.unshift(post);
          this.sendLoading = false;
        })
        .catch((err) => {
          this.sendLoading = false;
        });
    },
    likeThread() {
      this.$dzq.request
        .patchData("/posts/" + this.thread.posts._source.id, {
          isLiked: !this.thread.posts.isLiked,
        })
        .then((res) => {
          if (this.thread.posts.isLiked) {
            this.thread.posts.likeCount--;
          } else {
            this.thread.posts.likeCount++;
          }
          this.thread.posts.isLiked = !this.thread.posts.isLiked;
        });
    },
    favoriteThread() {
      this.$dzq.request
        .patchData("/threads/" + this.thread._source.id, {
          isFavorite: true,
        })
        .then((res) => {
          this.thread.isFavorite = !this.thread.isFavorite;
        });
    },
  },
  watch: {
    "$route.params.thread_id"() {
      this.posts = [];
      this.threadId = this.$route.params.thread_id;
      this.getThreads();
      this.getRelatedThreads();
      this.getThreadPosts();
    },
  },
  components: {
    Panel,
    LFVideoItem,
    CommentInput,
    PostItem,
    VideoPlayer,
    CVMovable,
    ASwitch: Switch,
    ADropdown: Dropdown,
    AInput: Input,
    AAlert: Alert,
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

.thread-video-wrapper {
  height: 100%;
  height: 488px;
  background: black;
  border-radius:5px;
  overflow: hidden;
}
.thread-video {
  width: 100%;
}
.thread-video-mini {
  width: 100%;
  height: 100%;
}
.thread-video-mini-operate {
  position: absolute;
  z-index: 12;
  bottom: 10px;
  right: 10px;
}
.thread-video-mini-operate-item {
  display: block;
  padding: 5px 15px;
  color: white;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.thread-video-mini-mask {
  position: absolute;
  z-index: 11;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

/* 悬浮视频 */
.pip-player {
  position: fixed;
  z-index: 10;
  top: 300px;
  left: 60%;
  width: 426px;
  height: 240px;
  background: white;
  box-shadow: var(--box-shadow-base);
  cursor: move;
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
  user-select: none;
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
  margin: 0 20px 0 12px;
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
