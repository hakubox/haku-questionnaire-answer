<template>
  <div class="page-callback">
    <van-loading class="callback-loading" size="24px">页面加载中...</van-loading>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref, toRefs } from "vue";
import { Dialog, Toast } from "vant";
import '@/assets/sweetalert.css';
import { get } from "@/tools/common";

/** url头参数 */
const hash = location.href.substr(location.href.lastIndexOf('?') + 1).replace('#/', '');
let query = Object.assign.apply({}, [{}, ...hash.substr(hash.indexOf('?') + 1).split('&').map(i => ({[i.split('=')[0]]: i.split('=')[1]}))])

get('/account/getLoginUrl', {
  // 代表微信
  thirdAcctType: 2,
  backUrl: location.href.substr(0, location.href.indexOf('?')) + '?qid=' + query.qid + '#/'
}).then(d => {
  if (d.code != '0') {
    Dialog.alert({
      title: '警告',
      message: d.desc
    });
    return;
  }
  location.href = d.data.replace('#wechat_redirect', '&wechat_redirect#/');
});
</script>

<style lang="less" scoped>
  .page-callback {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .callback-loading {

  }
</style>