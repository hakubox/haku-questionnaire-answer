<template>
  <q-basic
    class="question-dropdown"
    v-bind="$props"
  >
    <div
      class="question-dropdown-input"
      :disabled="disabled"
      @click="showDialogPicker()"
    >
      <span v-if="value">{{value ? options.find(i => i.value == value).label : ''}}</span>
      <span class="placeholder" v-else>{{placeholder}}</span>
    </div>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker
        :columns="options.map(i => i.label)"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </q-basic>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, toRefs } from "vue";
import VConsole from 'vconsole';

export default defineComponent({
  name: "q-dropdown",
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
      default: '请选择'
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
      type: Array as PropType<any[]>,
      default: () => []
    }
  },
  methods: {
    onConfirm(val, index) {
      console.log(val);
      this.showPicker = false;
      this.$emit('update:value', this.options[index].value);
    },
    showDialogPicker() {
      if (!this.disabled) {
        this.showPicker = true;
      }
    }
  },
  mounted() {
    const vConsole = new VConsole({ maxLogNumber: 1000 });
  },
  setup() {
    let state = reactive({
      /** 是否显示弹出框 */
      showPicker: false,
    });

    return {
      ...toRefs(state)
    }
  }
});
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';

  .question-dropdown {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > .question-dropdown-input {
      position: relative;
      height: 34px;
      line-height: 32px;
      width: 100%;
      box-sizing: border-box;
      padding: 0px 30px 0px 10px;
      background-color: white;
      border: 1px solid @q-border-color;
      background-color: @q-bg-color;
      border-radius: 6px;

      > .placeholder {
        color: #969799;
      }

      &:before {
        position: absolute;
        content: '\e65e';
        font: normal normal normal 14px/1 'vant-icon';
        right: 8px;
        top: 9px;
      }
    }
  }

  .van-radio-group {

  }
</style>