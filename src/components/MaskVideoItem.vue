<template>
  <router-link to="/v/2" class="mask-video">
    <img
      src="https://tukuimg.bdstatic.com/processed/97c3eee6b692f03974ff49c8015fcabe.jpg@s_2,w_454,h_256,q_100"
      class="video-cover"
    />
    <div class="video-info">
      <div class="thread-title ellipsis1">炸酥肉是用面粉还是淀粉，大厨教你这样调糊，外脆里嫩，金黄酥香</div>
      <div class="thread-author">厨易</div>
      <ul class="thread-statistics">
        <li class="thread-statistics-item">
          <c-icon value="icon-attention" size="16px"></c-icon>21W
        </li>
        <li class="thread-statistics-item">
          <c-icon value="icon-message" size="16px"></c-icon>83
        </li>
      </ul>
    </div>
    <div class="video-info-before-hover-mask"></div>
  </router-link>
</template>

<script>
export default {};
</script>

<style scoped>
.mask-video {
  display:block;
  position:relative;
  width:227px;
  height:128px;
  overflow:hidden;
  border-radius:5px;
}
.mask-video::before {
  content:"";
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  opacity:0;
  background:rgba(0,0,0,0.5);
  transition:opacity .2s;
}
.mask-video:hover::before {
  opacity:1;
}
.video-cover {
  width:100%;
  height:100%;
  object-fit:cover;
}
.video-info {
  position:absolute;
  z-index:2;
  top:96px;
  padding:8px 12px;
  width:100%;
  height:96px;
  transition:top .2s ease-in-out;
}
.video-info-before-hover-mask {
  content:"";
  position:absolute;
  z-index:1;
  left:0;
  bottom:0;
  height:42px;
  width:100%;
  background-image:linear-gradient(0deg,rgba(0,0,0,.5),transparent);
}
.mask-video:hover .video-info {
  top:0;
}
.thread-title {
  /* padding:8px 12px; */
  width:100%;
  line-height:20px;
  color:#fff;
  transition:all .2s ease-in-out;
}
.mask-video:hover .thread-title {
  white-space:unset;
}
.thread-author {
  margin-top:10px;
  color:#fff;
}
.thread-statistics {
  color:white;
}
.thread-statistics-item {
  display:inline-block;
  width:50%;
  font-size:12px;
}
.thread-statistics-item .c-icon {
  margin-right:3px;
  vertical-align: top;
}
</style>