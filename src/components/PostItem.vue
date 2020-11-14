<template>
  <div class="post-item" v-if="data">
    <router-link class="post-author-avatar-link" to="/user/1">
      <img :src="userAvatar" class="post-author-avatar" />
    </router-link>
    <div class="post-info">
      <h3 class="post-author-username">
        <router-link to="/user/1">{{ userName }}</router-link>
        <span class="post-publish-time">{{ data.createdAt }}</span>
        <a-spin class="post-loading" size="small" :spinning="showLoadingIcon" />
      </h3>
      <div class="post-content" v-html="data.contentHtml"></div>
      <ul class="post-operate">
        <li class="post-operate-item" @click="likePost">
          <c-icon :value="data.isLiked?'icon-appreciatefill':'icon-appreciate'" size="18px"></c-icon>
          {{ data.likeCount }}
        </li>
        <li class="post-operate-item" @click="showCommentInput=!showCommentInput">回复</li>
      </ul>
      <comment-input
        placeholder="说说你的看法"
        :autoSize="{ minRows: 5, maxRows: 7 }"
        v-show="showCommentInput"
        :loading="replyLoading"
        @reply="sendReply"
      ></comment-input>
      <div
        class="post-show-comment"
        v-if="hasComment&&isCheckAllComment"
        v-show="isHiddenComment"
        @click="isHiddenComment=false"
      >
        展开回复
        <c-icon value="icon-right" size="14px"></c-icon>
      </div>
      <div class="post-comments" v-if="hasComment" v-show="data.replyCount>0">
        <ul class="post-comment-list" v-show="showPostComment">
          <post-item
            class="post-comment-item"
            v-for="commentItem in coments"
            :key="commentItem._source.id"
            :data="commentItem"
            :thread-id="threadId"
          />
        </ul>
        <div class="post-comment-load" @click="viewAllComments" v-show="showLoadCommentButton">
          {{ isCheckAllComment?'加载更多':`查看全部${data.replyCount}条回复` }}
          <c-icon value="icon-right" size="14px"></c-icon>
        </div>
      </div>
      <p
        class="post-comment-hidden"
        v-if="hasComment&&isHiddenComment===false"
        @click="isHiddenComment=true"
        v-show="isCheckAllComment"
      >
        收起回复
        <c-icon value="icon-fold" size="14px"></c-icon>
      </p>
    </div>
  </div>
</template>

<script>
import CommentInput from "@/components/CommentInput";
import { Spin } from "ant-design-vue";
export default {
  name: "post-item",
  props: {
    data: {
      type: Object,
      default: null,
    },
    hasComment: {
      type: Boolean,
      default: false,
    },
    threadId: {
      type: Number | String,
      required: true,
    },
  },
  data() {
    return {
      showCommentInput: false,
      isCheckAllComment: false,
      isHiddenComment: false,
      allComments: [],
      allCommentsPage: 0,
      allCommentsLimit: 5,
      allCommentsLoading: false,
      allCommentsFinished: false,
      replyLoading: false,
      showLoadingIcon: false,
    };
  },
  methods: {
    async viewAllComments() {
      if (this.isCheckAllComment) {
        this.getComments();
      } else {
        await this.getComments();
        this.isCheckAllComment = true;
        this.isHiddenComment = false;
      }
    },
    async getComments() {
      this.showLoadingIcon = true;
      if (this.allCommentsLoading || this.allCommentsFinished) {
        return;
      }
      this.allCommentsLoading = true;
      this.allCommentsPage++;
      await this.$dzq.request
        .get("/posts", {
          include: [""],
          "filter[reply]": this.data._source.id,
          "filter[isComment]": "yes",
          "filter[isApproved]": 1,
          "page[limit]": this.allCommentsLimit,
          "page[number]": this.allCommentsPage,
        })
        .then((res) => {
          let comments = this.$dzq.serializer(res);
          comments = comments["data"];
          if (comments.length < this.allCommentsLimit) {
            this.allCommentsFinished = true;
          }
          this.allComments.push(...comments);
          this.allCommentsLoading = false;
          this.showLoadingIcon = false;
        });
    },
    sendReply(content) {
      if (this.hasComment === false) {
        this.$message.error("暂时不支持回复评论的回复");
        return;
      }

      if (!this.$state.user.isLogin) {
        this.$message.warning("请登录后重试");
        return;
      }
      if (!content) {
        this.$message.warning("请输入内容");
        return;
      }
      this.replyLoading = true;
      this.$dzq.request
        .postData(
          "/posts",
          {
            content,
            replyId: this.data._source.id,
            isComment: true,
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
          if (this.isCheckAllComment) {
            this.allComments.unshift(post);
          } else {
            this.data.lastThreeComments.unshift(post);
          }

          this.replyLoading = false;
        })
        .catch((err) => {
          this.replyLoading = false;
        });
    },
    likePost() {
      this.showLoadingIcon = true;
      this.$dzq.request
        .patchData("/posts/" + this.data._source.id, {
          isLiked: !this.data.isLiked,
        })
        .then((res) => {
          if (this.data.isLiked) {
            this.data.likeCount--;
          } else {
            this.data.likeCount++;
          }
          this.data.isLiked = !this.data.isLiked;
          this.showLoadingIcon = false;
        });
    },
  },
  computed: {
    showPostComment() {
      if (this.isCheckAllComment === false) {
        return true;
      } else {
        return !this.isHiddenComment;
      }
    },
    coments() {
      if (
        this.isCheckAllComment ||
        (this.data.lastThreeComments &&
          this.data.lastThreeComments.length === 0)
      ) {
        return this.allComments;
      } else {
        return this.data.lastThreeComments;
      }
    },
    showLoadCommentButton() {
      if (this.allCommentsFinished) {
        return false;
      } else if (this.isHiddenComment === false && this.data.replyCount > 3) {
        return true;
      }
    },
    userAvatar() {
      if (this.data.users) {
        return this.data.users.avatarUrl;
      } else if (this.data.user && this.data.user.users) {
        return this.data.user.users.avatarUrl;
      } else {
        return "";
      }
    },
    userName() {
      if (this.data.users) {
        return this.data.users.username;
      } else if (this.data.user && this.data.user.users) {
        return this.data.user.users.username;
      } else {
        return "";
      }
    },
  },
  components: {
    CommentInput,
    ASpin: Spin,
  },
};
</script>

<style scoped>
.post-item {
  display: flex;
  justify-content: space-between;
  user-select: none;
}
.post-author-avatar-link {
  flex-shrink: 0;
  margin-right: 15px;
}
.post-author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
}
.post-info {
  flex-grow: 1;
}
.post-author-username a {
  font-size: 16px;
  color: #000;
}
.post-publish-time {
  margin-left: 10px;
  font-size: 100%;
  color: #666;
}
.post-loading {
  margin-left: 10px;
}
.post-content {
  margin-top: 10px;
  white-space: pre-wrap;
}
.post-operate {
  margin: 10px 0;
}
.post-operate-item {
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
  width: 60px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}
.post-operate-item:hover {
  color: var(--primary-color);
}
.post-operate-item .c-icon {
  margin-right: 5px;
}
.post-show-comment {
  margin: 14px 0;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}
.post-show-comment:hover {
  color: var(--primary-color);
}
.post-comments {
  border: radius 5px;
  background: #f7f7f7;
  transition: height 0.15s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.post-comment-list {
  padding: 0 16px;
  border-radius: 8px;
}
.post-comment-item {
  padding-top: 16px;
}
.post-comment-item .post-info::after {
  content: "";
  display: block;
  height: 1px;
  margin-top: 16px;
  background: #ebebeb;
}
.post-comment-item:last-child .post-info::after {
  opacity: 0;
}
.post-comment-load {
  padding: 15px 64px;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  border-top: 1px solid #ebebeb;
}
.post-comment-hidden {
  margin: 14px 49px;
  text-align: center;
  color: #888;
  cursor: pointer;
  user-select: none;
}
.post-comment-load:hover,
.post-comment-hidden:hover {
  color: var(--primary-color);
}
</style>