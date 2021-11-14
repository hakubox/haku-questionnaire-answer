<template>
  <template
    :style="{ margin: getBoxModel($attrs.margin) }"
    class="question-item"
    :class="{ required: $attrs.required }"
  >
    <label class="label" v-html="label"></label>
    <slot><q-blank /></slot>
  </template>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { getBoxModel } from "@/tools/common";

export default defineComponent({
  name: "q-basic",
  props: {
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => ([])
    }
  },
  data: () => ({
  }),
  methods: {
    getLabel() {
      let showLabel = true;
      if ((this.$attrs as any).control.category == 'label') {
        showLabel = false;
      }
      if (showLabel) {
        return this.$attrs.index + '. ' + this.label;
      } else {
        return this.label;
      }
    },
    getBoxModel
  }
});
</script>