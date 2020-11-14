<template>
  <div class="author-index">
     <c-icon value="icon-repair" slot="image" size="120px" ></c-icon>开发中...
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
  .author-index {
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
    padding:40px 0;
    font-size:20px;
  }
  .author-index .c-icon {
    color:var(--primary-color);
  }
</style>