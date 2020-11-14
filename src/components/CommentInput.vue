<template>
  <div class="comment-input">
    <a-input
      type="textarea"
      v-bind="$attrs"
      :maxLength="maxLength"
      v-model="values"
      @change="inputValue"
    ></a-input>
    <ul class="comment-input-operate">
      <li class="comment-input-operate-item comment-input-emoji">
        <c-icon value="icon-emoji" size="22px"></c-icon>表情
      </li>
      <li class="comment-input-operate-item comment-input-submit">
        <span class="comment-input-text-count">{{ values.length }}/{{ maxLength }}</span>
        <a-button type="primary" @click="$emit('reply',values)" :loading="loading">回复</a-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { Input } from "ant-design-vue";
export default {
  props: {
    maxLength: {
      tpye: Number,
      default: 500,
    },
    value: String,
    loading:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      values: this.value || "",
    };
  },
  methods: {
    inputValue(e) {
      this.$emit("change", this.values);
    },
  },
  components: {
    AInput: Input,
  },
};
</script>

<style scoped>
.comment-input > textarea {
  overflow-y: auto !important;
  resize: none;
}
.comment-input-operate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.comment-input-operate-item {
  display: flex;
  align-items: center;
  color: #999;
}
.comment-input-emoji .c-icon {
  margin-right: 4px;
}
.comment-input-emoji:hover {
  color: var(--primary-color);
  cursor: pointer;
}
.comment-input-text-count {
  margin-right: 15px;
  color: #999;
}
</style>