<template>
  <div id="app">
    <!-- 头部 -->
    <page-header
      :position="isHomePage?'relative':'fixed'"
      :userLinks="headerUserLinks"
      @clickAvatar="showSigninModal=true"
      @logout="accountLogout"
    >
      <router-link to="/" class="header-logo" slot="logo"></router-link>
      <template v-slot:left>
        <div class="header-channel" :class="{ 'header-channel-avtive':isShowChannelBlocks }">
          <span v-show="isHomePage==false" @click.stop="showChannels">
            频道
            <c-icon :value="isShowChannelBlocks?'icon-fold':'icon-unfold'" :size="8"></c-icon>
          </span>
        </div>
      </template>
      <template v-slot:center>
        <div class="header-search">
          <input type="text" class="header-search-keyword" placeholder="拜登称将赢得竞选" />
          <button class="header-search-submit">
            <c-icon value="icon-search" :size="14"></c-icon>搜索
          </button>
        </div>
      </template>
      <template v-slot:right>
        <ul class="header-link">
          <li class="header-link-item">
            <a target="_blank" href="http://q.cooocc.com">
              <c-icon value="http://q.cooocc.com/favicon.ico" :size="20"></c-icon>源数据站
            </a>
          </li>
          <li class="header-link-item">
            <router-link to="/author/upload">
              <c-icon value="icon-upload" :size="24"></c-icon>上传视频
            </router-link>
          </li>
          <li class="header-link-item">
            <a-dropdown placement="bottomCenter">
              <span>
                <c-icon value="icon-mobile" :size="24"></c-icon>手机浏览
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
            <c-icon value="icon-we" :size="24"></c-icon>关注动态
          </li>
        </ul>
      </template>
    </page-header>
    <a-modal
      :visible="showSigninModal"
      :footer="null"
      :title="null"
      @cancel="showSigninModal=false"
    >
      <div class="signin-model-title">
        <div
          class="signin-model-title-text"
          :class="{ 'active':currentSigninMode==='login' }"
          @click="switchSigninMode('login')"
        >登录</div>
        <div
          class="signin-model-title-text"
          :class="{ 'active':currentSigninMode==='register' }"
          @click="switchSigninMode('register')"
        >注册</div>
      </div>
      <a-form :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="signin">
        <a-form-item label="用户名">
          <a-input
            v-model="loginForm.username"
            :disabled="$state.user.isLogin"
            placeholder="请输入登录用户名"
          />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password
            v-model="loginForm.password"
            :disabled="$state.user.isLogin"
            placeholder="请输入用户密码"
          />
        </a-form-item>
        <a-form-item
          v-if="$state.user.isLogin"
          :wrapper-col="{ span: 12, offset: 5 }"
          @click="showSigninModal=false"
        >您已经登录了：{{ $state.user.username }}</a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button
            type="primary"
            html-type="submit"
            :disabled="$state.user.isLogin"
          >{{ currentSigninMode==="login"?'登录':'注册' }}</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 点击频道后弹出的频道弹窗 -->
    <div class="header-channels" v-show="isShowChannelBlocks" @click.stop="channelBlockClick">
      <div class="header-channels-list">
        <ul
          class="header-channel-block"
          v-for="(channelBlock,channelBlockIndex) in channelBlocks"
          :key="channelBlockIndex"
        >
          <li
            class="header-channel-item"
            v-for="channel in channelBlock"
            :key="channel._source.id"
            @click.stop="viewChannel(channel._source.id)"
          >{{ channel.name }}</li>
        </ul>
      </div>
    </div>
    <!-- 首页悬浮频道bar -->
    <a-affix v-show="isHomePage">
      <div class="channel-bar">
        <ul class="channel-bar-list">
          <li class="channel-bar-item">
            <router-link :class="{active:currentChannelId==0}" to="/">推荐</router-link>
          </li>
          <li
            class="channel-bar-item"
            v-for="(channel,channelIndex) in channels"
            :key="channelIndex"
          >
            <router-link
              :class="{active:currentChannelId==channel._source.id}"
              :to="`/channel/${channel._source.id}`"
            >{{ channel.name }}</router-link>
          </li>
          <li class="channel-bar-item show-more-channel" v-show="channelMore.length>0">
            更多
            <ul class="channel-more">
              <li
                class="channel-item"
                v-for="(moreChannelItem) in channelMore"
                :key="moreChannelItem['name']"
              >
                <router-link
                  :class="{active:currentChannelId==moreChannelItem._source.id}"
                  :to="`/channel/${moreChannelItem._source.id}`"
                >{{ moreChannelItem.name }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </a-affix>
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- 底部 -->
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
          © 2020 COOOCC
          Powered by DiscuzQ! & Template By COOOCC
        </div>
      </div>
    </footer>
    <back-top></back-top>
  </div>
</template>

<script>
import { Dropdown, Menu, Affix, Modal, Form, Input } from "ant-design-vue";
import BackTop from "@/components/BackTop";
import PageHeader from "@/components/PageHeader";

export default {
  data() {
    return {
      isHomePage: true,
      channels: this.$state.categories,
      channelMore: [],
      channelBlocks: [],
      isShowChannelBlocks: false,
      currentChannelId: 0,
      userLinks: [
        {
          icon: "icon-round",
          text: "个人中心",
          link: "/",
        },
        {
          icon: "icon-apps",
          text: "创作中心",
          link: "/author",
        },
        {
          icon: "icon-mail",
          text: "消息中心",
          link: "/",
        },
      ],
      showSigninModal: false,
      currentSigninMode: "login",
      loginForm: {
        username: this.$state.user.username || "",
        password: "",
      },
    };
  },
  mounted() {
    if (this.$route.fullPath === "/") {
      this.isHomePage = true;
    }
    if (this.$route.params.channel_id) {
      if (this.currentChannelId != this.$route.params.channel_id) {
        this.currentChannelId = this.$route.params.channel_id;
      }
    }
    let channels = JSON.parse(JSON.stringify(this.channels));
    let blockCount = Math.ceil(channels.length / 6);
    let channelBlocks = [];
    for (let i = 0; i < blockCount; i++) {
      channelBlocks.push([...channels.slice(i * 6, (i + 1) * 6)]);
    }
    this.channelBlocks = channelBlocks;

    if (channels.length > 15) {
      this.channels = channels.slice(0, 14);
      this.channelMore = channels.slice(14);
    }
  },
  methods: {
    signin(e) {
      e.preventDefault();
      let loginForm = this.loginForm;
      if (!loginForm.username) {
        this.$message.warning("请输入用户名");
        return;
      }
      if (!loginForm.password) {
        this.$message.warning("请输入用户密码");
        return;
      }
      if (this.currentSigninMode === "login") {
        this.$dzq.request
          .postData("/login", {
            username: loginForm.username,
            password: loginForm.password,
          })
          .then((res) => {
            let userInfo = this.$dzq.user.loginSuccess(res);
            userInfo["isLogin"] = true;
            this.$state.user = userInfo;
            this.$message.success("登录成功");
            this.showSigninModal = false;
          })
          .catch((err) => {
            let errorMessages = this.$dzq.request.errors(err.errors, {
              login_failed: "Login failed",
            });
            for (let index in errorMessages) {
              this.$message.error(errorMessages[index]);
            }
          });
      } else {
        this.$dzq.request
          .postData("/register", {
            username: loginForm.username,
            password: loginForm.password,
          })
          .then(async (res) => {
            let data = this.$dzq.serializer(res)["data"];
            let userId = data["_source"]["id"];
            let userInfo = null;
            await this.$dzq.request.get("/users/" + userId).then((res) => {
              userInfo = this.$dzq.serializer(res)["data"];
            });
            data["users"] = userInfo;
            this.$dzq.user.loginSuccess(data, true);
            this.$message.success("注册成功");
            this.showSigninModal = false;
          })
          .catch((err) => {
            let errorMessages = this.$dzq.request.errors(err.errors, {
              login_failed: "Login failed",
            });
            for (let index in errorMessages) {
              this.$message.error(errorMessages[index]);
            }
          });
      }
    },
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
    viewChannel(channelId) {
      this.isShowChannelBlocks = false;
      this.$router.push("/channel/" + channelId);
    },
    switchSigninMode(mode) {
      this.currentSigninMode = mode;
    },
    accountLogout() {
      this.$dzq.user.logout();
      this.$state.user = {
        isLogin: false,
      };
    },
  },
  computed: {
    headerUserLinks() {
      if (this.$state.user.isLogin) {
        return this.userLinks;
      } else {
        return [];
      }
    },
  },
  watch: {
    "$route.fullPath"() {
      if (this.$route.params.channel_id) {
        if (this.currentChannelId != this.$route.params.channel_id) {
          this.currentChannelId = this.$route.params.channel_id;
        }
      } else {
        if (this.currentChannelId != 0) {
          this.currentChannelId = 0;
        }
      }
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
    AModal: Modal,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AInputPassword: Input.Password,
    BackTop,
    PageHeader,
  },
};
</script>

<style lang="less" scoped>
.header-logo {
  display: block;
  width: 148px;
  height: 33px;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: contain;
}

/* 频道 */
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
  border: 1px solid transparent;
  background: transparent;
  border-radius: 5px 0 0 5px;
  overflow: hidden;
}
.header-search-keyword:focus {
  border-color: var(--primary-color);
}
.header-search-submit {
  flex-shrink: 0;
  padding: 0 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
}
.header-search-submit .c-icon {
  margin-right: 5px;
}

.signin-model-title {
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 16px;
  user-select: none;
}
.signin-model-title .signin-model-title-text {
  color: #666;
  letter-spacing: 2px;
  cursor: pointer;
}
.signin-model-title .signin-model-title-text.active {
  color: #000;
  font-weight: bold;
  font-size: 22px;
}
.signin-model-title .signin-model-title-text:last-child {
  margin-left: 10px;
}

/* 右侧链接 */
.header-link {
  margin-right: 12px;
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
.header-link-item a {
  color: var(--text-color-secondary);
}
.header-link-item .c-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
}
.header-link-item:hover {
  color: var(--primary-color);
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
  color: #333;
  cursor: pointer;
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

/* 底部 */
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
