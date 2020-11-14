<template>
  <div class="header-wrapper">
    <header class="header" :style="{ position }">
      <div class="header-inner">
        <slot name="logo">
          <div></div>
        </slot>
        <slot name="left">
          <div></div>
        </slot>
        <slot name="center">
          <div></div>
        </slot>
        <slot name="right">
          <div></div>
        </slot>
        <div class="header-user">
          <a-dropdown placement="bottomCenter" v-if="$state.user.isLogin">
            <c-icon
              class="header-user-avatar"
              :value="$state.user.avatarUrl"
              :size="40"
              radius="50%"
            ></c-icon>
            <a-menu class="header-user-menu" slot="overlay">
              <a-menu-item
                class="header-user-menu-item"
                v-for="userLinkItem in userLinks"
                :key="userLinkItem.index"
              >
                <router-link :to="userLinkItem.link">
                  <c-icon :value="userLinkItem.icon" size="16px"></c-icon>
                  {{ userLinkItem.text }}
                </router-link>
              </a-menu-item>
              <a-menu-item class="header-user-menu-item" @click="logout">
                <c-icon value="icon-exit" size="16px"></c-icon>
                退出账户
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <div v-else @click="clickAvatar()">
            <c-icon class="header-user-avatar" value="icon-emoji" :size="40" radius="50%"></c-icon>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import { Dropdown, Menu } from "ant-design-vue";
export default {
  props: {
    position: {
      type: String,
      default: "relative",
    },
    userLinks: {
      type: Array,
      default: [],
    },
  },
  methods: {
    clickAvatar() {
      this.$emit("clickAvatar", {});
    },
    logout(){
      this.$emit("logout", {});
    }
  },
  components: {
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
  },
};
</script>

<style scoped>
.header-wrapper {
  height: 72px;
}
.header {
  position: relative;
  z-index: 999;
  width: 100%;
  height: 72px;
  background: #fff;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.05);
}

.header-inner {
  display: grid;
  grid-template-columns: 175px 100px auto 350px 40px;
  align-items: center;
  height: 100%;
  margin: 0 auto;
  width: var(--main-width);
}

.header-user-avatar {
  height: auto;
  cursor: pointer;
}
.header-user-menu {
  margin-top: 15px;
  padding: 4px !important;
}
.header-user-menu .header-user-menu-item {
  border-radius: var(--border-radius-base);
}
.header-user-menu .header-user-menu-item,
.header-user-menu .header-user-menu-item a {
  color: #333;
}
.header-user-menu .header-user-menu-item:hover {
  color: var(--primary-color);
}
.header-user-menu .header-user-menu-item .c-icon {
  margin-right: 5px;
}
</style>