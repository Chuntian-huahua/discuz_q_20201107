<template>
  <router-link :to="`/v/${data['_source']['id']}`" class="mask-video" v-if="data">
    <img :src="data['thread-video']['cover_url']" class="video-cover" />
    <div class="video-info">
      <div class="thread-title ellipsis1">{{ data['posts']['content'] }}</div>
      <div class="thread-author">{{ data['users']['username'] }}</div>
      <ul class="thread-statistics">
        <li class="thread-statistics-item">
          <c-icon value="icon-attention" size="16px"></c-icon>
          {{ data['viewCount'] }}
        </li>
        <li class="thread-statistics-item">
          <c-icon value="icon-message" size="16px"></c-icon>
          {{ data['postCount'] }}
        </li>
      </ul>
    </div>
    <div class="video-info-before-hover-mask"></div>
  </router-link>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
};
</script>

<style scoped>
.mask-video {
  display: block;
  position: relative;
  width: 227px;
  height: 128px;
  overflow: hidden;
  border-radius: 5px;
}
.mask-video::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s;
}
.mask-video:hover::before {
  opacity: 1;
}
.video-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.video-info {
  position: absolute;
  z-index: 2;
  top: 96px;
  padding: 8px 12px;
  width: 100%;
  height: 96px;
  transition: top 0.2s ease-in-out;
}
.video-info-before-hover-mask {
  content: "";
  position: absolute;
  z-index: 1;
  left: 0;
  bottom: 0;
  height: 42px;
  width: 100%;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.5), transparent);
}
.mask-video:hover .video-info {
  top: 0;
}
.thread-title {
  /* padding:8px 12px; */
  width: 100%;
  line-height: 20px;
  color: #fff;
  transition: all 0.2s ease-in-out;
}
.mask-video:hover .thread-title {
  white-space: unset;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.thread-author {
  margin-top: 10px;
  color: #fff;
}
.thread-statistics {
  color: white;
}
.thread-statistics-item {
  display: inline-block;
  width: 50%;
  font-size: 12px;
}
.thread-statistics-item .c-icon {
  margin-right: 3px;
  vertical-align: top;
}
</style>