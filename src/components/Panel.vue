<template>
  <div class="panel">
    <div class="panel-header">
      <slot name="header" />
      <div class="panel-header-title">
        {{ title }}
        <slot name="title" />
      </div>
      <div class="panel-header-right">
        <slot name="header-right" />
      </div>
    </div>
    <div class="panel-body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style scoped>
.panel-header {
  display:flex;
  justify-content: space-between;
  align-items:center;
  position:relative;
  margin-bottom:12px;
  padding-left:12px;
}
.panel-header::before {
  content:"";
  display:block;
  position:absolute;
  left:0;
  top:50%;
  margin-top:-9px;
  width:3px;
  height:18px;
  border-radius:1.5px;
  background:var(--primary-color);
}
.panel-header-title {
  font-size:20px;
}
</style>