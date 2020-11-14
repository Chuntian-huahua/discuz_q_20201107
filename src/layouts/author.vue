<template>
  <div class="author-layout">
    <page-header position="fixed" :userLinks="userLinks" @logout="accountLogout">
      <template v-slot:logo>
        <router-link to="/" class="header-logo" slot="logo"></router-link>
      </template>
      <template v-slot:right>
        <ul class="header-link" v-if="$state.user.isLogin">
          <li class="header-link-item">
            <router-link to="/">
              <c-icon value="icon-notice" size="24px"></c-icon>
            </router-link>
          </li>
        </ul>
      </template>
    </page-header>

    <main class="page-main">
      <a-row v-if="$state.user.isLogin">
        <a-col class="page-aside" :span="4">
          <aside class="page-aside-main">
            <img
              :src="$state.user.avatarUrl"
              class="user-avatar"
            />
            <p class="user-username">{{ $state.user.username }}</p>
            <div class="user-desc ellipsis1">
              <c-icon value="icon-form" size="14px"></c-icon>{{ $state.user.signature||"居然没写个性签名😔" }}
            </div>
            <router-link to="/author/upload">
              <a-button class="upload-video" type="primary">上传作品</a-button>
            </router-link>
            <ul class="aside-nav">
              <li class="aside-nav-item aside-nav-item-active">
                <router-link to="/author">
                  <c-icon value="icon-apps" size="15px"></c-icon>首页
                </router-link>
              </li>
              <li class="aside-nav-item">
                <router-link to="/author/upload">
                  <c-icon value="icon-file" size="15px"></c-icon>作品管理
                </router-link>
              </li>
              <li class="aside-nav-item">
                <router-link to="/author">
                  <c-icon value="icon-rank" size="15px"></c-icon>数据分析
                </router-link>
              </li>
              <li class="aside-nav-item">
                <router-link to="/author">
                  <c-icon value="icon-recharge" size="15px"></c-icon>收益分析
                </router-link>
              </li>
            </ul>
          </aside>
        </a-col>
        <a-col class="page-content" :span="19">
          <router-view></router-view>
        </a-col>
      </a-row>
      <a-empty
        style="padding-top:40px;"
        description="需要登录后才可以发布视频"
        :image-style="{
      height: '180px',
    }"
        v-else
      >
        <img src="../assets/images/no_login.png" slot="image" style="width:300px;height:auto;" />
      </a-empty>
    </main>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import { Empty } from "ant-design-vue";
export default {
  data() {
    return {
      userLinks: [
      ],
    };
  },
  methods: {
    accountLogout() {
      this.$dzq.user.logout();
      this.$state.user = {
        isLogin: false,
      };
      this.$router.replace("/");
    },
  },
  components: {
    PageHeader,
    AEmpty: Empty,
  },
};
</script>

<style scoped>
.header-logo {
  display: block;
  width: 220px;
  height: 28px;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: contain;
}

.header-link {
  display: flex;
  justify-content: flex-end;
  margin-right: 55px;
}
.header-link-item a {
  color: #333;
}

.page-main {
  min-height: calc(100vh - 72px);
  background-color: #f7f7f7;
}
.page-aside {
  position: relative;
  min-height: calc(100vh - 72px + 40px);
  border-right: 1px solid rgba(0, 0, 0, 0.09);
  background: white;
}
.page-aside-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  width: 224px;
}
.user-avatar {
  margin-top: 37px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f5f5f5;
}
.user-username {
  margin-top: 24px;
  opacity: 0.9;
  font-size: 18px;
  color: #000;
  line-height: 18px;
}
.user-desc {
  margin-top: 10px;
  padding: 0px 10px 29px;
  width: 100%;
  font-size: 14px;
  letter-spacing: 0px;
  text-align: center;
  color: #000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.user-desc .c-icon {
  vertical-align: top;
  margin-right: 4px;
}
.upload-video {
  margin-top: 23.3px;
}
.aside-nav {
  margin-top: 24px;
  width: 100%;
}
.aside-nav-item {
  margin-bottom: 10px;
  font-size: 14px;
  color: #000;
}
.aside-nav-item:hover,
.aside-nav-item-active {
  background-color: #f7f7f7;
}
.aside-nav-item a {
  display: block;
  padding-left: 68px;
  width: 100%;
  height: 38px;
  line-height: 38px;
  color: #000;
}
.aside-nav-item .c-icon {
  margin-right: 9px;
}

.page-content {
  margin: 20px;
  min-height: 100px;
  background: white;
  border-radius: 8px;
}
</style>