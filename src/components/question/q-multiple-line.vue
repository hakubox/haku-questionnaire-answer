<template>
  <q-basic
    class="question-item-multiple"
    v-bind="$props"
  >
    <textarea type="text" :disabled="disabled" :placeholder="placeholder" :value="value" @input="changeValue"></textarea>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "q-multiple-line",
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
    }
  },
  methods: {
    changeValue(e) {
      this.$emit('update:value', e.target.value);
    }
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-item-multiple {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > textarea {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid @q-border-color;
      background-color: @q-bg-color;
      padding: 5px 10px;
      border-radius: 6px;
    }
  }
</style>