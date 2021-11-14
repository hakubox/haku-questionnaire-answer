

<template>
  <q-basic
    class="question-item-single-choice"
    :layout="layout"
    v-bind="$props"
  >
    <van-radio-group :modelValue="value" :disabled="disabled" @change="changeValue" direction="horizontal">
      <van-radio
        v-for="(item, index) in options"
        :disabled="disabled || item.disabled"
        :key="item.value"
        :name="item.value"
        @click="changeValue(item.value, index)"
      >{{item.label}}</van-radio>
    </van-radio-group>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "q-single-choice",
  components: {
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    control: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    margin: {
      type: Array,
      default: () => ([0,0,0,0])
    },
    options: {
      type: Array as PropType<any>
    },
    layout: {
      type: String
    }
  },
  data: () => ({
    inputValue: ''
  }),
  methods: {
    changeValue(val) {
      console.log(val);
      this.$emit('update:value', val);
    }
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-item-single-choice {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > :deep(.label) {
      margin-bottom: 0px !important;
    }

    > textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid @primary-color;
    }
  }

  .van-radio-group {

    > .van-radio {
      margin-top: 10px;
    }
  }
</style>