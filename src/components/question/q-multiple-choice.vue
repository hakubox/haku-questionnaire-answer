

<template>
  <q-basic
    class="question-item-multiple-choice"
    :layout="layout"
    v-bind="$props"
  >
    <van-checkbox-group :modelValue="value" :max="max" @change="changeValue" direction="horizontal">
      <van-checkbox
        v-for="(item, index) in options"
        :key="item.value"
        :name="item.value"
        :disabled="disabled || item.disabled || (max != 0 && value.length >= max && !value.includes(item.value))"
        shape="square"
        @click="changeValueByUser(item, index)"
      >{{item.label}}</van-checkbox>
    </van-checkbox-group>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "q-multiple-choice",
  components: {
  },
  props: {
    value: {
      type: Array as PropType<String[]>,
      default: () => []
    },
    control: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    margin: {
      type: Array,
      default: () => ([0,0,0,0])
    },
    options: {
      type: Array as PropType<string[]>,
      required: true
    },
    layout: {
      type: String
    },
    max: {
      type: Number,
      required: true
    }
  },
  methods: {
    changeValue(val) {
      this.$emit('update:value', val);
    },
    changeValueByUser(val, index) {
      if (val.disabled) return;
      let vals = [...this.value];
      let _index = vals.indexOf(val.value);
      if (_index >= 0) {
        vals.splice(_index, 1);
      } else if (vals.length < this.max || this.max == 0) {
        vals.push(val.value);
      }
      this.$emit('update:value', vals);
    }
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-item-multiple-choice {
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

  .van-checkbox-group {

    > .van-checkbox {
      margin-top: 10px;
    }
  }
</style>