<template>
  <q-basic
    class="question-item-singer"
    v-bind="$props"
  >
    <input type="text" :disabled="disabled" :placeholder="placeholder" :maxlength="maxlength" :value="value" @input="changeValue" />
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";

export default defineComponent({
  name: "q-singer-line",
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
    maxlength: {
      type: Number,
      default: -1
    },
    margin: {
      type: Array,
      default: () => ([0,0,0,0])
    }
  },
  data: () => ({
    inputValue: ''
  }),
  methods: {
    changeValue(e) {
      this.$emit('update:value', e.target.value);
    }
  },
  setup() {
    return {
    };
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-item-singer {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid @q-border-color;
      background-color: @q-bg-color;
      padding: 5px 10px;
      border-radius: 6px;
    }
  }
</style>