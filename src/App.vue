<template>
  <router-view v-if="pageLoaded"></router-view>
</template>

<script>
import CDiscuzQ from "./function/CDiscuzQ";
export default {
  created() {
    CDiscuzQ.request
      .get("/categories", {
        "fileter[createThread]": 1,
      })
      .then((res) => {
        let categories = CDiscuzQ.serializer(res)["data"];
        this.$state.categories = categories;
        this.pageLoaded = true;
      });
  },
  data() {
    return {
      pageLoaded: false,
    };
  },
  methods: {
    getCategories() {},
  },
};
</script>