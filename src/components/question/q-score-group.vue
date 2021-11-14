<template>
  <q-basic
    class="question-score-group"
    v-bind="$props"
  >
    <div class="question-score-group-item" v-for="(item, index) in options" :key="index">
      <label>{{item.label}}</label>
      <van-rate :count="count" :disabled="disabled || item.disabled" :color="color" :allow-half="allowHalf" :size="size + 'px'" v-model:modelValue="value[index]" @change="changeValue($event, index)" />
    </div>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "q-score-group",
  components: {
  },
  props: {
    value: {
      type: Array as PropType<Number[]>,
      default: () => []
    },
    options: {
      type: Array as PropType<any>,
      default: () => []
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
    changeValue(val, index) {
      let vals = new Array(this.options.length).fill(0);
      for (let i = 0; i < this.value.length; i++) {
        vals[i] = this.value[i] ?? 0;
      }
      vals[index] = val;
      this.$emit('update:value', vals);
    }
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-score-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > .question-score-group-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      padding: 5px 10px;
    }
  }

  .van-radio-group {

  }
</style>