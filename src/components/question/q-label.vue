<template>
  <q-basic
    class="question-label"
    v-bind="$props"
  >
    <label></label>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "q-singer-line",
  components: {
  },
  props: {
    control: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: ''
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
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>