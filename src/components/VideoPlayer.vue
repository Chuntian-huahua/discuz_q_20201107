<template>
  <div class="video-player" v-show="show">
    <slot />
    <video class="video" :id="videoId" preload="auto" playsinline webkit-playsinline x5-playsinline></video>
  </div>
</template>

<script>
let TCPLayer = null;
export default {
  props: {
    fileid: String,
    appid: String | Number,
    controls: {
      type: Boolean,
      default: true,
    },
    bigPlayButton: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    preload: {
      type: String,
      default: "auto",
    },
    swf: {
      type: String,
      default: "",
    },
    posterImage: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "zh-CN",
    },
    languages: {
      type: Object,
      default: null,
    },
    controlBar: {
      type: Object,
      default: null,
    },
    plugins: {
      type: Object,
      default: null,
    },
    hlsConfig: {
      type: Object,
      default: null,
    },
    currentTime: {
      type: Number,
      default: null,
    },
    dispose: {
      type: Boolean,
      default: false,
    },
    play: {
      type: Boolean,
      default: false,
    },
    pause: {
      type: Boolean,
      default: false,
    },
    volume: {
      type: Array,
      default: null,
    },
    poster: {
      type: String,
      default: null,
    },
    requestFullscreen: {
      type: Boolean,
      default: null,
    },
    exitFullscreen: {
      type: Boolean,
      default: null,
    },
  },
  data() {
    return {
      show: true,
      alreadyStarted: true,
      playing: false,
      fullscreen: false,
      videoId: Date.now(),
    };
  },
  created() {
    this.videoId = "tcbVideo_" + Date.now();
    if (TCPLayer) {
      TCPLayer.dispose();
    }
  },
  mounted() {
    this.reloadPlayer();
  },
  methods: {
    reloadPlayer() {
      let options = {
        fileID: this.fileid,
        appID: this.appid,
        psign: "",
        bigPlayButton: this.bigPlayButton,
        controls: this.controls,
        autoplay: this.autoplay,
        loop: this.loop,
        muted: this.muted,
        preload: this.preload,
        swf: this.swf,
        posterImage: this.posterImage,
        language: this.language,
      };
      if (this.languages) {
        options["languages"] = this.languages;
      }
      if (this.controlBar) {
        options["controlBar"] = this.controlBar;
      }
      if (this.plugins) {
        options["plugins"] = this.plugins;
      }
      if (this.hlsConfig) {
        options["hlsConfig"] = this.hlsConfig;
      }
      TCPLayer = TCPlayer(this.videoId, options);
      if (this.currentTime !== null) {
        TCPLayer.currentTime(this.currentTime);
      }
      const that = this;

      TCPLayer.on("play", function () {
        this.playing = true;
        that.$emit("play", arguments);
      });
      TCPLayer.on("ready", function () {
        that.$emit("duration", TCPLayer.duration());
        if (that.$listeners.hasOwnProperty("ready")) {
          that.$emit("ready", arguments);
        }
      });
      if (this.poster) {
        TCPLayer.poster(this.poster);
        this.$emit("getPoster", TCPLayer.poster());
      }
      if (this.volume) {
        TCPLayer.volume(this.volume);
      }
      if (this.$listeners.hasOwnProperty("playing")) {
        TCPLayer.on("playing", function () {
          that.$emit("playing", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("loadstart")) {
        TCPLayer.on("loadstart", function () {
          that.$emit("loadstart", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("durationchange")) {
        TCPLayer.on("durationchange", function () {
          that.$emit("durationchange", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("loadedmetadata")) {
        TCPLayer.on("loadedmetadata", function () {
          that.$emit("loadedmetadata", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("loadeddata")) {
        TCPLayer.on("loadeddata", function () {
          that.$emit("loadeddata", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("progress")) {
        TCPLayer.on("progress", function () {
          that.$emit("progress", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("canplay")) {
        TCPLayer.on("canplay", function () {
          that.$emit("canplay", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("canplaythrough")) {
        TCPLayer.on("canplaythrough", function () {
          that.$emit("canplaythrough", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("error")) {
        TCPLayer.on("error", function () {
          that.$emit("error", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("pause")) {
        TCPLayer.on("pause", function () {
          that.$emit("pause", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("ratechange")) {
        TCPLayer.on("ratechange", function () {
          that.$emit("ratechange", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("seeked")) {
        TCPLayer.on("seeked", function () {
          that.$emit("seeked", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("seeking")) {
        TCPLayer.on("seeking", function () {
          that.$emit("seeking", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("timeupdate")) {
        TCPLayer.on("timeupdate", function () {
          that.$emit("timeupdate", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("volumechange")) {
        TCPLayer.on("volumechange", function () {
          that.$emit("volumechange", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("waiting")) {
        TCPLayer.on("waiting", function () {
          that.$emit("waiting", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("ended")) {
        TCPLayer.on("ended", function () {
          that.$emit("ended", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("resolutionswitching")) {
        TCPLayer.on("resolutionswitching", function () {
          that.$emit("resolutionswitching", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("resolutionswitched")) {
        TCPLayer.on("resolutionswitched", function () {
          that.$emit("resolutionswitched", arguments);
        });
      }
      if (this.$listeners.hasOwnProperty("fullscreenchange")) {
        TCPLayer.on("fullscreenchange", function () {
          that.$emit("fullscreenchange", arguments);
        });
      }
    },
    playVideo() {
      this.playing = true;
      this.alreadyStarted = true;
      TCPLayer.play();
    },
  },
  watch: {
    controls() {
      this.show = false;
      if (this.controls) {
        TCPLayer.controlBar.el_.style.visibility = "visible";
      } else {
        TCPLayer.controlBar.el_.style.visibility = "hidden";
      }
      setTimeout(() => {
        this.show = true;
      }, 200);
    },
    play() {
      if (this.play === true) {
        TCPLayer.play();
      }
    },
    pause() {
      if (this.pause == true) {
        TCPLayer.pause();
      }
    },
    requestFullscreen() {
      if (this.requestFullscreen === true) {
        TCPLayer.requestFullscreen();
        this.$emit("isFullscreen", TCPLayer.isFullscreen());
      }
    },
    exitFullscreen() {
      if (this.exitFullscreen === true) {
        TCPLayer.exitFullscreen();
        this.$emit("isFullscreen", TCPLayer.isFullscreen());
      }
    },
    dispose() {
      if (this.dispose === true) {
        TCPLayer.dispose();
      }
    },
  },
};
</script>

<style scoped>
.video-player {
  position: relative;
  background: black;
}
.video {
  position: relative;
  z-index: 9;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: var(--border-radius-base);
  background: black;
  object-fit: unset;
}
</style>