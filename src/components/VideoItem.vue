<template>
  <router-link class="video-item" :to="`/v/${data._source.id}`" v-if="data">
    <div class="video-header">
      <img :src="data['thread-video']['cover_url']" class="video-cover" />
      <div class="video-time">{{ data['thread-video']['duration'] }}</div>
    </div>
    <div class="video-footer">
      <h3 class="thread-title ellipsis2">{{ data['posts']['content'] }}</h3>
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
  created() {
    this.data["thread-video"]["duration"] = Number(
      this.data["thread-video"]["duration"] / 100
    ).toFixed(2);
  },
};
</script>

<style scoped>
.video-item {
  display: inline-block;
  width: 100%;
  border-radius: 3px;
}
.video-header {
  position: relative;
  height: 128px;
  overflow: hidden;
  border-radius: 5px;
}
.video-cover {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}
.video-item:hover .video-cover {
  transform: scale(1.1);
}
.video-time {
  position: absolute;
  right: 6px;
  bottom: 6px;
  padding: 2px 4px;
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.8);
}

.video-footer {
  position: relative;
  margin-top: 10px;
  height: 58px;
  width: 100%;
  overflow: hidden;
}
.thread-title {
  height: 40px;
  line-height: 20px;
  width: 100%;
  font-size: 100%;
  overflow: hidden;
}
.video-item:hover .thread-title {
  color: var(--primary-color);
}
.thread-statistics {
  position: absolute;
  bottom: 18px;
  left: 0;
  margin-top: 5px;
  height: 20px;
  width: 100%;
  opacity: 1;
  background: white;
  transition: bottom 0.3s ease-in-out, opacity 0.4s ease-in-out;
}
.video-item:hover .thread-statistics {
  bottom: 0px;
  opacity: 0;
}
.thread-statistics-item {
  display: inline-block;
  width: 50%;
  font-size: 12px;
  color: #000;
}
.thread-statistics-item .c-icon {
  margin-right: 3px;
  vertical-align: top;
}
</style>