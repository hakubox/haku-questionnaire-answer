<template>
  <q-basic
    class="question-item-singer-group"
    v-bind="$props"
  >
    <div class="question-item-singer-group-item" v-for="(item, index) in options" :key="index">
      <label>{{item.label}}</label>
      <input type="text" :placeholder="placeholder" :disabled="disabled || item.disabled" :maxlength="maxlength" :value="value[index]" @input="changeValue($event, index)" />
    </div>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "q-singer-line-group",
  components: {
  },
  props: {
    value: {
      type: Array as PropType<String[]>,
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
    placeholder: {
      type: String,
      default: ''
    },
    margin: {
      type: Array,
      default: () => ([0,0,0,0])
    },
    maxlength: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    inputValue: ''
  }),
  methods: {
    changeValue(val, index) {
      let vals = new Array(this.options.length).fill('');
      for (let i = 0; i < this.value.length; i++) {
        vals[i] = this.value[i];
      }
      vals[index] = val.target.value;
      this.$emit('update:value', vals);
    }
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-item-singer-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > .question-item-singer-group-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      padding: 5px 0px 5px 10px;

      > input {
        border: 1px solid @q-border-color;
        background-color: @q-bg-color;
        padding: 5px 10px;
        border-radius: 6px;
      }
    }

    > input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid @primary-color;
    }
  }
</style>