<template>
  <q-basic
    class="question-score"
    v-bind="$props"
  >
    <van-rate :count="count" :disabled="disabled" :color="color" :allow-half="allowHalf" :size="size + 'px'" :modelValue="value" @change="changeValue" />
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { getBoxModel } from "@/tools/common";

export default defineComponent({
  name: "q-score",
  components: {
  },
  props: {
    value: {
      type: Number,
      default: 0
    },
    control: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    margin: {
      type: Array,
      default: () => ([0,0,0,0])
    },
    color: {
      type: String,
      default: '#FFD21E',
      required: true
    },
    count: {
      type: Number,
      default: 5,
      required: true
    },
    size: {
      type: Number,
      default: 20,
      required: true
    },
    allowHalf: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  methods: {
    changeValue(val) {
      this.$emit('update:value', val);
    },
    getBoxModel
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-score {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .van-radio-group {

  }
</style>