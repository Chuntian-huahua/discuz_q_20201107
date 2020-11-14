<template>
  <router-link class="video-item" :to="`/v/${data._source.id}`" v-if="data&&data.type===2">
    <div class="video-left" v-if="data['type']===2">
      <img :src="data['thread-video']['cover_url']" class="video-cover" />
      <div class="video-time">{{ data['thread-video']['duration'] }}</div>
    </div>
    <div class="video-info">
      <h3 class="thread-title ellipsis2">{{ data['posts']['content'] }}</h3>
      <ul class="thread-statistics">
        <li class="thread-statistics-item">
          <c-icon value="icon-attention" size="16px"></c-icon>
          {{ data['viewCount'] }}
        </li>
        <li class="thread-statistics-item">
          <c-icon value="icon-message" size="16px"></c-icon>
          {{ data['postCount']-1 }}
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
    if (this.data&&this.data.type===2) {
      this.data["thread-video"]["duration"] = (
        Number(this.data["thread-video"]["duration"]) / 100
      ).toFixed(2);
    }
  },
};
</script>

<style scoped>
.video-item {
  display: inline-flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  border-radius: 3px;
}
.video-left {
  flex-shrink: 0;
  position: relative;
  margin-right: 16px;
  width: 146px;
  height: 83px;
  overflow: hidden;
  border-radius: 5px;
}
.video-cover {
  width: 100%;
  object-fit: cover;
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

.video-info {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.thread-title {
  margin-bottom: 20px;
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
  bottom: 18px;
  margin-top: 5px;
  height: 20px;
  width: 100%;
  opacity: 1;
  background: white;
  transition: bottom 0.3s ease-in-out, opacity 0.4s ease-in-out;
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