<template>
  <div class="video-player">
    <div class="big-play-button" @click="playVideo" v-show="alreadyStarted===false||playing===false">
      <c-icon :value="playing?'icon-zanting':'icon-playfill'" size="40px" @click="playVideo"></c-icon>
    </div>
    <video
      class="video"
      id="player-container-id"
      preload="auto"
      playsinline
      webkit-playsinline
      x5-playsinline
    ></video>
  </div>
</template>

<script>
let TCPLayer = null;
export default {
  props: {
    fileid: String,
    appid:String|Number
  },
  data() {
    return {
      alreadyStarted: true,
      playing: false,
    };
  },
  created() {
    if (TCPLayer) {
      TCPLayer.dispose();
    }
  },
  mounted() {
    this.reloadPlayer();
  },
  methods: {
    reloadPlayer() {
      TCPLayer = TCPlayer("player-container-id", {
        /**player-container-id 为播放器容器ID，必须与html中一致*/
        fileID: this.fileid /**请传入需要播放的视频fileID 必须 */,
        appID:this.appid /**请传入点播账号的appID 必须 */,
        psign: "",
        bigPlayButton: false,
        /**其他参数请在开发文档中查看 */
      });
    },
    playVideo() {
      this.playing = true;
      this.alreadyStarted=true;
      TCPLayer.play();
    },
  },
};
</script>

<style scoped>
.video-player {
  position: relative;
}
.big-play-button {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 22px;
  width: 80px;
  height: 80px;
  margin: auto;
  color: white;
  background: rgba(0, 0, 0, 0.38);
  border-radius: 50%;
  cursor: pointer;
}
.video {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--border-radius-base);
  background: black;
  object-fit: unset;
}
</style>