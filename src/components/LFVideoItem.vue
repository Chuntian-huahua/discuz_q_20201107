<template>
  <router-link class="video-item" to="/v/1">
    <div class="video-left">
      <img
        src="https://tukuimg.bdstatic.com/processed/3ae7f6ff024c9dd4dd25eeb383b06715.jpeg@s_2,w_454,h_256,q_100"
        class="video-cover"
      />
      <div class="video-time">14:57</div>
    </div>
    <div class="video-info">
      <h3 class="thread-title ellipsis2">神枪手潜伏山上 ，瞄准鬼子的最高军官，将战事引到最高点</h3>
      <ul class="thread-statistics">
        <li class="thread-statistics-item">
          <c-icon value="icon-attention" size="16px"></c-icon>21W
        </li>
        <li class="thread-statistics-item">
          <c-icon value="icon-message" size="16px"></c-icon>83
        </li>
      </ul>
    </div>
  </router-link>
</template>

<script>
export default {};
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