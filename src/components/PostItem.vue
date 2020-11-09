<template>
  <div class="post-item">
    <router-link class="post-author-avatar-link" to="/user/1">
      <img
        src="https://himg.bdimg.com/sys/portrait/item/wise.1.12a9cf0b.u6hZDT9lc2-OZG7h36b0Fw.jpg?time=6414"
        class="post-author-avatar"
      />
    </router-link>
    <div class="post-info">
      <h3 class="post-author-username">
        <router-link to="/user/1">百度网友2a4a8ca</router-link>
        <span class="post-publish-time">08月30日</span>
      </h3>
      <div class="post-content">什么电视</div>
      <ul class="post-operate">
        <li class="post-operate-item">
          <c-icon value="icon-appreciate" size="18px"></c-icon>225
        </li>
        <li class="post-operate-item" @click="showCommentInput=!showCommentInput">回复</li>
      </ul>
      <comment-input
        placeholder="说说你的看法"
        :autoSize="{ minRows: 5, maxRows: 7 }"
        v-show="showCommentInput"
      ></comment-input>
      <div class="post-show-comment" v-if="hasComment&&isCheckAllComment" v-show="isHiddenComment" @click="isHiddenComment=false">
        Show Comment
        <c-icon value="icon-right" size="14px"></c-icon>
      </div>
      <div class="post-comments" v-if="hasComment">
        <ul class="post-comment-list" v-show="showPostComment">
          <post-item class="post-comment-item" v-for="index in 5" :key="index" />
        </ul>
        <div class="post-comment-load" @click="viewAllComments" v-show="isHiddenComment===false">
          {{ isCheckAllComment?'See more':'See All 69 comments' }}
          <c-icon value="icon-right" size="14px"></c-icon>
        </div>
      </div>
      <p
        class="post-comment-hidden"
        v-if="hasComment&&isHiddenComment===false"
        @click="isHiddenComment=true"
        v-show="isCheckAllComment"
      >
        Hidden comment
        <c-icon value="icon-fold" size="14px"></c-icon>
      </p>
    </div>
  </div>
</template>

<script>
import CommentInput from "@/components/CommentInput";
export default {
  name: "post-item",
  props: {
    hasComment: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showCommentInput: false,
      isCheckAllComment: false,
      isHiddenComment: false,
    };
  },
  methods: {
    viewAllComments() {
      if (this.isCheckAllComment) {
        // this.isHiddenComment = false;
      } else {
        this.isCheckAllComment = true;
        this.isHiddenComment = false;
      }
    },
  },
  computed: {
    showPostComment() {
      if (this.isCheckAllComment === false) {
        return true;
      } else if (this.isCheckAllComment === true) {
        return !this.isHiddenComment;
      }
    },
  },
  components: {
    CommentInput,
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