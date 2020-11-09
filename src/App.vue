<template>
  <div id="app">
    <header class="header" :style="{position:isHomePage?'relative':'fixed'}">
      <div class="header-inner">
        <router-link to="/" class="header-logo"></router-link>
        <div class="header-channel" :class="{ 'header-channel-avtive':isShowChannelBlocks }">
          <span v-show="isHomePage==false" @click.stop="showChannels">
            频道
            <c-icon :value="isShowChannelBlocks?'icon-fold':'icon-unfold'" :size="8"></c-icon>
          </span>
        </div>
        <div class="header-search">
          <input type="text" class="header-search-keyword" placeholder="拜登称将赢得竞选" />
          <button class="header-search-submit">
            <c-icon value="icon-search" :size="14"></c-icon>搜索
          </button>
        </div>
        <ul class="header-link">
          <li class="header-link-item">
            <c-icon value="icon-upload" :size="24"></c-icon>upload
          </li>
          <li class="header-link-item">
            <a-dropdown placement="bottomCenter">
              <span>
                <c-icon value="icon-mobile" :size="24"></c-icon>upload
              </span>
              <div class="header-mobile-qrcode" slot="overlay">
                <span class="header-mobile-title">扫码下载好看APP</span>
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdQAAAHUAQMAAAC56UsvAAAABlBMVEX/QUH///8HJnqwAAACUElEQVR42u3cQW7DMAxEUd3A97+lb6C2qSUOSbsFuukE+EYQpI6eV5ZKkXTG/PNxDizWzp5jH3G1z5PH/Drz+nANe32IwVispdV58TVA7PWu42UiYLGO9kz39nXzryPd+WUwFuts11zQP9NXWOzb2fztdebAYt/E6r5yDYtYZQfhv8U5WKyDrdvDH1+P+1As1sG21F/Mhe9ZMFP08pgnxGId7Fq0Nd0XGZIhV2v5QCzWzq6v6ixYr7jsvlROpGCxhvb+Ph+jVxIj9sZi/WzdIa589bZRlFnvWKyvnbOk9Wpyr8QqE4t1teeInN4qxFyx905lH7Ou51isp5WlWwuI6YaX9HUMxmI97d5IjrSS75NlcCz7WKybXUv3XuHTdjLn+m5qi1islZVmvLq877S2JP1qrILFutmR2pb2RUo3SP8vgMXaWW1eOm7icI1V9jazpk2wWBOb8yT1uYARqeyYI9oKgsW62ZnX7aO1KmnXdK6VY7GOtqX1oigzRu3le+qjxmL/3eYMSZkXfc84z7rfxGKNrNznKTdSaovayNRbqbFYJ5v6lIRoRUar6hqrYLFGNmf5ntb5WrUZWKyl1f1jaZOWljyNyVP5Bou1sqUckzeYqSsvhytYrKOds6c+eu9HKZSPp8dysdj/tbuD9O4HOjTRl+rjWKyr7et8lGBaY2pN/WGxbrbUx3PIHU+7SKyCxb6B1Qe1Sq5P2vZqXgWL9bR9UpSU9czPhmOxhrY9rnIzBfKzLaWUg8X62LqXnDmnfabe6Z4bxGKN7J8PLNbOfgCFhWzALvp1XgAAAABJRU5ErkJggg=="
                />
                iPhone Android
              </div>
            </a-dropdown>
          </li>
          <li class="header-link-item">
            <c-icon value="icon-we" :size="24"></c-icon>subscribe
          </li>
          <li class="header-link-item user-list">
            <a-dropdown placement="bottomCenter">
              <c-icon
                value="https://pic.rmb.bdstatic.com/bjh/user/8332461672aadc1660ab21db2b580a1b.jpeg?x-bce-process=image/resize,m_lfit,w_100,h_100"
                :size="40"
                radius="50%"
              ></c-icon>
              <a-menu class="header-user-menu" slot="overlay">
                <a-menu-item class="header-user-menu-item">
                  <c-icon value="icon-round" size="16px"></c-icon>个人中心
                </a-menu-item>
                <a-menu-item class="header-user-menu-item">
                  <c-icon value="icon-apps" size="16px"></c-icon>创作中心
                </a-menu-item>
                <a-menu-item class="header-user-menu-item">
                  <c-icon value="icon-mail" size="16px"></c-icon>消息中心
                </a-menu-item>
                <a-menu-item class="header-user-menu-item">
                  <c-icon value="icon-exit" size="16px"></c-icon>退出登录
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </li>
        </ul>
      </div>
      <div class="header-channels" v-show="isShowChannelBlocks" @click.stop="channelBlockClick">
        <div class="header-channels-list">
          <ul
            class="header-channel-block"
            v-for="(channelBlock,channelBlockIndex) in channelBlocks"
            :key="channelBlockIndex"
          >
            <li class="header-channel-item" v-for="channel in channelBlock" :key="channel.id">
              <router-link to="/v">{{ channel.text }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <div class="header-placeholder" v-show="isHomePage==false"></div>
    <a-affix v-show="isHomePage">
      <div class="channel-bar">
        <ul class="channel-bar-list">
          <li
            class="channel-bar-item"
            v-for="(channel,channelIndex) in channels"
            :key="channelIndex"
          >
            <router-link :class="{active:channelIndex==1}" to="/channel/yingshi">{{ channel.text }}</router-link>
          </li>
          <li class="channel-bar-item show-more-channel" v-if="channelMore.length>0">
            更多
            <ul class="channel-more">
              <li
                class="channel-item"
                v-for="(moreChannelItem,moreChannelItemIndex) in channelMore"
                :key="moreChannelItem['name']"
              >
                <router-link
                  :class="{active:moreChannelItemIndex==1}"
                  to="/channel/yingshi"
                >{{ moreChannelItem.text }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </a-affix>
    <router-view />
    <footer class="footer">
      <div class="footer-about">
        <div class="footer-about-inner layout">
          <ul class="footer-about-list">
            <li class="footer-about-item">
              <router-link to="/">品牌合作</router-link>
            </li>
            <li class="footer-about-item">
              <router-link to="/">品牌合作</router-link>
            </li>
            <li class="footer-about-item">
              <router-link to="/">隐私政策</router-link>
            </li>
            <li class="footer-about-item">
              <router-link to="/">帮助与反馈</router-link>
            </li>
            <li class="footer-about-item">
              <router-link to="/">用户协议</router-link>
            </li>
            <li class="footer-about-item">
              <router-link to="/">使用百度须知</router-link>
            </li>
          </ul>
          <div class="footer-about-code">
            <div class="footer-about-code-left">
              <h3 class="footer-about-code-title">扫码下载客户端</h3>
              <p class="footer-about-code-text">分享美好 看见世界</p>
            </div>
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdQAAAHUAQMAAAC56UsvAAAABlBMVEUAAAD///+l2Z/dAAACTUlEQVR42u3cQW7DMAxEUd3A97+lb8A2qS0OKaUFsukE+EYQJI6eu7EEmqQ64u3jHFisnT3HPPJq3yePeJx5friGPT/kYCzW0uq8eAwQe73reJkIWKyjPcu9fd3891Hu/DYYi3W291zQr+UnLPbjbP31OnNgsR9i9bnyHpaxygzC/4pzsFgH2x8Pf329fA7FYh3skvrLufAzC6JELy/zhFisg70XbU33ZYZkyNWWfCAWa2f1PtdA5X7lZeelNJGCxVrajLSPKImRpZKYsTcW62ZvVcKVMWYh5vp6lHcs1tZmzUXXc03utVglsFhju1vkrwseJRTXiB2LdbTz4fHscbWWY/R5UwuOWKybnWfm/Z8tTBKitEwgFutoa1jSFu2W69vUFrFYM6s3eetZmu3T2ROyDbyxWCebab0ZsURoaSYvqw17WKyfzZ90M0tkebHE3m2+YLFmNsdomC2VF/1QWkGwWENbO07bdq2cHWutHIv1s9rasTadrpXH7KPGYt3s0sukMXbvd1r2J2KxbrbNgtLLdGSlRmvl5c9hsU62tXxoiTxz17V/r2UIsVgXuyzvGX5HrvN6vsQzWKyVjc222dJKveRMSpyDxVpZ6TWN9o9oWldeDVewWEerx7nbWhibQvl4tS0Xi/1f21J80QuLGbSM3nqKxRpaXed7kmRpTN20WGOxVrat1TXkntu4WvUci3W3c9iudzp04wAW62/P0RIgPWUdy95wLNbNRslO76dA3dvScn1YrI/tz5KxqZWPMTYtTFism337wGLt7BcOoXzuYAD95QAAAABJRU5ErkJggg=="
              class="footer-about-code-img"
            />
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="layout">
          © 2020 Baidu 京ICP证030173号
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000002000001"
            target="_blank"
          >京公网安备11000002000001</a> 京网文（2017）2863-327号 Powered by DiscuzQ! & Template By COOOCC
        </div>
      </div>
    </footer>
    <back-top></back-top>
  </div>
</template>

<script>
import { Dropdown, Menu, Affix } from "ant-design-vue";
import BackTop from "@/components/BackTop";

export default {
  data() {
    return {
      isHomePage: true,
      channels: [
        {
          id: "recommend",
          text: "推荐",
        },
        {
          id: "yingshi",
          text: "影视",
        },
        {
          id: "yinyue",
          text: "音乐",
        },
        {
          id: "vlog",
          text: "VLog",
        },
        {
          id: "youxi",
          text: "游戏",
        },
        {
          id: "gaoxiao",
          text: "搞笑",
        },
        {
          id: "zongyi",
          text: "综艺",
        },
        {
          id: "yule",
          text: "娱乐",
        },
        {
          id: "dongman",
          text: "动漫",
        },
        {
          id: "shenghuo",
          text: "生活",
        },
        {
          id: "guangchangwu",
          text: "广场舞",
        },
        {
          id: "meishi",
          text: "美食",
        },
        {
          id: "chongwu",
          text: "宠物",
        },
        {
          id: "sannong",
          text: "三农",
        },
        {
          id: "junshi",
          text: "军事",
        },
        {
          id: "shehui",
          text: "社会",
        },
        {
          id: "tiyu",
          text: "体育",
        },
        {
          id: "keji",
          text: "科技",
        },
        {
          id: "shishang",
          text: "时尚",
        },
        {
          id: "qiche",
          text: "汽车",
        },
        {
          id: "qinzi",
          text: "亲子",
        },
        {
          id: "jiaoyu",
          text: "教育",
        },
        {
          id: "wenhua",
          text: "文化",
        },
        {
          id: "lvyou",
          text: "旅游",
        },
        {
          id: "miaodong",
          text: "秒懂",
        },
      ],
      channelMore: [],
      channelBlocks: [],
      isShowChannelBlocks: false,
    };
  },
  mounted() {
    if (this.$route.fullPath === "/") {
      this.isHomePage = true;
    }
    let channels = this.channels;
    let blockCount = Math.ceil(channels.length / 6);
    let channelBlocks = [];
    for (let i = 0; i < blockCount; i++) {
      channelBlocks.push([...channels.slice(i * 6, (i + 1) * 6)]);
    }
    this.channelBlocks = channelBlocks;
    if (channels.length > 15) {
      let channelMore = [];
      for (let i = 15; i < channels.length; i++) {
        channelMore.push(channels[i]);
      }
      channels.splice(15, channels.length - 15);
      this.channelMore = channelMore;
    }
  },
  methods: {
    clickHideChannelBlock() {
      if (this.isShowChannelBlocks === true) {
        this.isShowChannelBlocks = false;
        document.removeEventListener("click", this.clickHideChannelBlock);
      }
    },
    showChannels() {
      if (this.isShowChannelBlocks === false) {
        document.addEventListener("click", this.clickHideChannelBlock);
      }

      this.isShowChannelBlocks = !this.isShowChannelBlocks;
    },
    channelBlockClick() {
      this.isShowChannelBlocks = true;
    },
  },
  watch: {
    "$route.fullPath"() {
      if (this.$route.fullPath === "/" || this.$route.name === "VideoChannel") {
        if (this.isHomePage === false) {
          this.isHomePage = true;
        }
      } else {
        if (this.isHomePage === true) {
          this.isHomePage = false;
        }
      }
    },
  },
  components: {
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AAffix: Affix,
    BackTop,
  },
};
</script>

<style lang="less" scoped>
.header {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 72px;
  background: #fff;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.05);
}
.header-placeholder {
  width: 100%;
  height: 72px;
  background: #fff;
}

.header-inner {
  display: grid;
  grid-template-columns: 175px 100px auto 390px;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  width: var(--main-width);
}

.header-logo {
  display: block;
  width: 148px;
  height: 33px;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: contain;
}

.header-channel {
  font-size: 14px;
  cursor: pointer;
}

.header-channel:hover,
.header-channel-avtive {
  color: var(--primary-color);
}

/* 搜索 */
.header-search {
  display: flex;
  justify-self: center;
  width: 400px;
  height: 38px;
  background-color: #f5f5f5;
  border-radius: 5px;
  overflow: hidden;
}
.header-search-keyword {
  padding-left: 25px;
  width: 100%;
  outline: none;
  border: none;
  background: transparent;
}
.header-search-submit {
  flex-shrink: 0;
  padding: 0 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--primary-color);
  border: none;
}
.header-search-submit .c-icon {
  margin-right: 5px;
}

/* 右侧链接 */
.header-link {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: var(--text-color-secondary);
}
.header-link-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 12px;
  min-width: 48px;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
}
.header-link-item .c-icon {
  display: block;
  height: 32px;
}
.header-link-item:hover {
  color: var(--primary-color);
}
.user-list > .c-icon {
  height: auto;
}
.header-mobile-qrcode {
  padding: 10px 0;
  width: 110px;
  text-align: center;
  font-size: 10px;
  background: white;
  border-radius: 5px;
  box-shadow: var(--box-shadow-base);
}
.header-mobile-qrcode .header-mobile-title {
  color: red;
}
.header-mobile-qrcode > img {
  display: block;
  margin: 5px auto;
  width: 80px;
  height: 80px;
}
.header-user-menu {
  padding: 4px !important;
}
.header-user-menu .header-user-menu-item {
  color: #333;
  border-radius: var(--border-radius-base);
}
.header-user-menu .header-user-menu-item:hover {
  color: var(--primary-color);
}
.header-user-menu .header-user-menu-item .c-icon {
  margin-right: 5px;
}

/* 频道选择 */
.header-channels {
  position: absolute;
  z-index: 999;
  left: 0;
  top: 72px;
  width: 100%;
  // height: 80px;
  background: hsla(0, 0%, 100%, 0.97);
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
}
.header-channels-list {
  margin: 0 auto;
  width: var(--main-width);
}
.header-channel-block {
  position: relative;
  float: left;
  width: 240px;
  padding: 12px 15px;
  ::after {
    content: "";
    display: block;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -18px;
    width: 1px;
    height: 36px;
    background: #b3b3b3;
  }
  :last-child::after {
    display: none;
  }
}
.header-channel-item {
  float: left;
  width: 70px;
  line-height: 2;
  text-align: center;
}
.header-channel-item a {
  color: #333;
}

/* 频道bar */
.channel-bar {
  position: relative;
  z-index: 1000;
  height: 40px;
  width: 100%;
  background-color: #f7f7f7;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.08);
}
.channel-bar-list {
  position: relative;
  margin: 0 auto;
  width: var(--main-width);
  height: 100%;
}
.channel-bar-item {
  float: left;
  width: 75px;
  height: 100%;
  line-height: 40px;
  text-align: center;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}
.channel-bar-item a {
  display: block;
  position: relative;
  height: 100%;
  width: 100%;
  color: #333;
}
.channel-bar-item a.active {
  font-weight: bold;
  color: var(--primary-color) !important;
}
.channel-bar-item a.active::after {
  content: "";
  display: inline-block;
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -9px;
  width: 18px;
  height: 3px;
  border-radius: 1.5px;
  background-color: var(--primary-color);
  -webkit-box-shadow: 0 2px 4px 0 rgba(255, 65, 65, 0.4);
  box-shadow: 0 2px 4px 0 rgba(255, 65, 65, 0.4);
}
.show-more-channel {
  height: 100%;
}
.show-more-channel:hover {
  color: var(--primary-color);
}
.channel-more {
  display: none;
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 10;
  height: 40px;
  line-height: 40px;
  background: white;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.16);
  border-radius: var(--border-radius-base);
}
.show-more-channel:hover .channel-more {
  display: block;
}
.channel-more .channel-item {
  float: left;
  width: 75px;
  text-align: center;
}
.channel-more .channel-item a {
  width: 100%;
  height: 100%;
  color: #000;
}
.channel-more .channel-item a:hover {
  color: var(--primary-color);
}

/* 脚步 */
.footer {
  margin-top: 46px;
  width: 100%;
  background: #f2f2f2;
}
.footer-about {
  height: 188px;
  width: 100%;
  background: #f2f2f2;
}
.footer-about-inner {
  display: flex;
  padding-top: 55px;
  width: 1000px;
}
.footer-about-list {
  margin-left: 65px;
  height: 74px;
  width: 60%;
}
.footer-about-item {
  float: left;
  margin-bottom: 24px;
  width: 33.3%;
  color: #666;
}
.footer-about-item a {
  color: inherit;
}
.footer-about-code {
  position: relative;
  padding-left: 65px;
  height: 74px;
  width: 40%;
  overflow: hidden;
}
.footer-about-code::before {
  content: "";
  display: block;
  position: absolute;
  top: 5px;
  left: 0;
  width: 1px;
  height: 56px;
  background-color: #979797;
}
.footer-about-code-left {
  float: left;
  color: #666;
  width: 120px;
}
.footer-about-code-title {
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
}
.footer-about-code-text {
  font-size: 12px;
}
.footer-about-code-img {
  float: left;
  width: 72px;
  height: 72px;
}

.footer-copyright {
  width: 100%;
  height: 52px;
  line-height: 52px;
  text-align: center;
  color: #999;
  font-size: 12px;
  background: #444;
}
.footer-copyright a {
  color: #aaa;
}
</style>
