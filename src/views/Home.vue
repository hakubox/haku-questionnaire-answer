<template>
  <div>
    <div class="page-home" :class="{ 'answer-success': answerSuccess }">
      <!-- 问卷标题 -->
      <div class="form-header">
        <h2 class="form-title">{{formConfig.formTitle}}</h2>
        <p v-if="formConfig.headerContent" class="form-header-content">{{formConfig.headerContent}}</p>
      </div>
      <!-- 问卷内容 -->
      <!-- <p v-for="(item, index) in controls" :key="index">{{item.name}}</p> -->
      <div class="form-content">
        <van-empty v-if="isInit && controls.length == 0" image="search" :description="errorMsg || '暂未配置问卷'" />
        <component
          v-bind="item.attrs"
          :control="item"
          :is="item.name"
          v-model:value="resultData[item.id]"
          v-for="(item, index) in controls"
          :key="index"
          :index="item.index"
        ></component>
      </div>
      <!-- 提交问卷按钮 -->
      <div class="form-footer" v-if="controls.length > 0">
        <van-button :disabled="answerSuccess" type="default" round style="width: 40%;" @click="reset">重置</van-button>
        <van-button :disabled="answerSuccess" type="primary" round block @click="submit">提交问卷</van-button>
      </div>
    </div>

    <van-dialog
      v-model:show="showQRCode"
      title="分享二维码"
      :show-confirm-button="false"
      :close-on-click-overlay="true"
      @opened="onQRCodeOpen"
    >
      <canvas :id="'canvas-' + qid"></canvas>
    </van-dialog>

    <van-dialog v-model:show="successDialogShow"
      :show-confirm-button="false"
    >
      <div class="sweet-alert showSweetAlert visible">
        <div class="sa-icon sa-success animate" style="display: block;">
          <span class="sa-line sa-tip animateSuccessTip"></span>
          <span class="sa-line sa-long animateSuccessLong"></span>
          <div class="sa-placeholder"></div>
          <div class="sa-fix"></div>
        </div>
      </div>
      <p style="margin: 0px 0px 30px 0px;">感谢您的参与！</p>
    </van-dialog>

  </div>
</template>

<script lang="ts">
import { defineProps, withDefaults, reactive, ref, toRefs, defineComponent } from "vue";
import { createModelId, get, post } from "@/tools/common";
import { Dialog, Toast } from "vant";
import { toCanvas, toSJIS } from "qrcode";
import '@/assets/sweetalert.css';

import * as dd from 'dingtalk-jsapi';

export default defineComponent({
  created() {
      console.log('init')
    this.init();
  },
  methods: {
      ready: function(callback) {
          // 如果jsbridge已经注入则直接调用
          if ((window as any).AlipayJSBridge) {
              callback && callback();
          } else {
              // 如果没有注入则监听注入的事件
              document.addEventListener('AlipayJSBridgeReady', callback, false);
          }
      },
    /** 生成二维码 */
    onQRCodeOpen() {
      toCanvas(document.querySelector('#canvas-' + this.qid), location.href, {
        toSJISFunc: toSJIS,
        // errorCorrectionLevel: 'high',
        width: 300
      }, err => {
        console.log(err);
      });
    },
    /** 重置答卷 */
    reset() {
      Dialog.confirm({
        title: '提示',
        message: '是否确认重置答卷？',
        closeOnClickOverlay: true,
      }).then(d => {
        Toast({ message: '答卷已重置' });
        let _re: Record<string, any> = {};
        Object.keys(this.resultData).forEach(key => {
          if (this.resultData[key] instanceof Array) {
            _re[key] = [];
          }
        });
        this.resultData = _re;
      }).catch(err => {

      });
    },
    /** 提交答卷 */
    submit() {
      let nullControls: any[] = [];
      let nullCheck = this.controls.every(control => {
        let isCheck = true;
        if (control.attrs.required) {
          switch (control.category) {
            case 'single-text':
            case 'multiple-text':
            case 'rate':
            case 'single-choice':
            case 'dropdown':
              isCheck = this.resultData[control.id];
              break;
            case 'rate-group':
            case 'single-text-group':
              isCheck = this.resultData[control.id]?.length == control.attrs.options.length && this.resultData[control.id].every(i => i);
              break;
            case 'multiple-choice':
              isCheck = this.resultData[control.id]?.length;
              break;
          }
          if (!isCheck) {
            nullControls.push(control);
          }
          return isCheck;
        }
        return true;
      });
      if (!nullCheck) {
        Toast.fail('填写未完成');
        return;
      }
      Toast.loading({
        duration: 0,
        forbidClick: true,
        message: '问卷提交中...',
      });
      post('/fnd/ivt/submmitQue', {
        qid: this.formConfig.id,
        sourceId: 'browser',
        userId: this.userId,
        // submitTime: '',
        bizData: navigator.userAgent,
        details: Object.entries(this.resultData).map(([key, value]) => {
          const control = this.controls.find(i => i.id == key);
          const category = control.category;
          switch (category) {
            case 'single-text':
            case 'multiple-text':
            case 'rate':
              return {
                sid: control.attrs.id,
                oid: control.attrs.oid,
                answer: value
              };
            case 'rate-group':
            case 'single-text-group':
              return value.map((option, index) => ({
                sid: control.attrs.id,
                oid: control.attrs.options[index].oid,
                answer: option
              }));
            case 'single-choice':
            case 'dropdown':
              return {
                sid: control.attrs.id,
                oid: value,
                answer: control.attrs.options.find(i => i.oid == value).label
              };
            case 'multiple-choice':
              return value.map(option => ({
                sid: control.attrs.id,
                oid: option,
                answer: control.attrs.options.find(i => i.oid == option).label
              }));
            default:
              break;
          }
          return {};
        }).flat()
      }).then(d => {
        if (d.code != '0') {
          Toast.fail('问卷提交失败：' + d.desc);
        } else {
          this.successDialogShow = true;
          this.answerSuccess = true;
        }
        localStorage.removeItem('userId');
      }).catch(err => {
        Toast.fail(err);
      }).finally(() => {
        Toast.clear();
      });
    },
    /** 初始化 */
    init() {
      var hash = location.href.substr(location.href.lastIndexOf('?') + 1).replace('#/', '').replace('%23/', '');
      let query = Object.assign.apply({}, [{}, ...hash.substr(hash.indexOf('?') + 1).split('&').map(i => ({[i.split('=')[0]]: i.split('=')[1]}))])

      // let query = Object.assign.apply({}, [{}, ...location.hash.substr(location.hash.indexOf('?') + 1).split('&').map(i => ({[i.split('=')[0]]: i.split('=')[1]}))]);
        this.qid = query.qid;
          this.isInit = true;
          let layout = {
    "formConfig": {
        "id": "",
        "canvasTitle": "主页",
        "formTitle": "测试问卷",
        "headerContent": "",
        "remark": "",
        "width": 375,
        "headerHeight": 48,
        "deviceId": "iphone678",
        "footer": {
            "isShow": true,
            "submitButtonText": "提交",
            "cancelButton": false,
            "cancelButtonText": "取消"
        },
        "controlIndex": 1,
        "formTheme": "default",
        "autoSave": true
    },
    "controls": {
        "name": "main",
        "direction": "row",
        "children": [
            {
                "id": "ogtdqegdim",
                "control": "",
                "icon": "iconfont icon-textBox",
                "category": "single-text",
                "name": "q-singer-line",
                "title": "单行问答题",
                "propertyEditors": {},
                "attrs": {
                    "visible": true,
                    "label": "单行问答题",
                    "placeholder": "请输入",
                    "maxlength": 1000,
                    "disabled": false,
                    "required": true,
                    "remark": "",
                    "margin": [
                        0,
                        0,
                        0,
                        0
                    ],
                    "id": "ogtdqegdim"
                }
            },
            {
                "id": "yhpvzzvchq",
                "control": "",
                "icon": "iconfont icon-panelList",
                "category": "single-text-group",
                "name": "q-singer-line-group",
                "title": "单行问答组",
                "propertyEditors": {},
                "attrs": {
                    "visible": true,
                    "label": "单行问答组",
                    "placeholder": "请输入",
                    "maxlength": 1000,
                    "disabled": false,
                    "required": true,
                    "remark": "",
                    "options": [
                        {
                            "value": "1",
                            "label": "题目 1"
                        },
                        {
                            "value": "2",
                            "label": "题目 2"
                        },
                        {
                            "value": "3",
                            "label": "题目 3"
                        }
                    ],
                    "margin": [
                        0,
                        0,
                        0,
                        0
                    ],
                    "id": "yhpvzzvchq"
                }
            },
            {
                "id": "nlpgybeidh",
                "control": "",
                "icon": "iconfont icon-score",
                "category": "rate-group",
                "name": "q-score-group",
                "title": "多项评分题",
                "propertyEditors": {},
                "attrs": {
                    "visible": true,
                    "label": "多项评分题",
                    "placeholder": "请输入",
                    "color": "#FFD21E",
                    "size": 20,
                    "count": 5,
                    "allowHalf": false,
                    "maxlength": 1000,
                    "disabled": false,
                    "required": true,
                    "remark": "",
                    "options": [
                        {
                            "value": "1",
                            "label": "评分 1"
                        },
                        {
                            "value": "2",
                            "label": "评分 2"
                        },
                        {
                            "value": "3",
                            "label": "评分 3"
                        }
                    ],
                    "margin": [
                        0,
                        0,
                        0,
                        0
                    ],
                    "id": "nlpgybeidh"
                }
            }
        ]
    }
};
          this.formConfig = layout.formConfig;
          this.formConfig.id = query.qid;
          document.title = this.formConfig.formTitle + '答题页';
            let ua: any = navigator.userAgent.toLowerCase()
            if(ua.match(/DingTalk/i) == "dingtalk"){//如果使用钉钉打开
                dd.ready(()=>{
                    dd.biz.navigation.setTitle({
                        title: this.formConfig.formTitle + '答题页'
                    })
                })
            }else if(ua.match(/Alipay/i)=="alipay"){ //如果使用支付宝打开
                this.ready(function(){
                    (window as any).AlipayJSBridge.call('setTitle', {
                        title: document.title
                    });
                });
            }

          // 将value替换为oid
          this.controls = layout.controls.children.map(i => {
            if (i.attrs.options) {
              i.attrs.options = i.attrs.options.map(i => ({
                ...i,
                value: ''
              }));
            }
            return i;
          });
          let _index = 1;
          this.controls.forEach(i => {
            if (i.name != 'q-label') {
              i.index = _index++;
            }
          });
          this.answerSuccess = true;

          // 获取授权 （1为微信）
        //   if (d.data.ivtMethod == '1') {

        //     // 获取用户详情
        //     if (this.userId) {
        //       // 获取当前用户是否提交过问卷
        //       get('/fnd/ivt/checkAlreadyAnswer', {
        //         qid: this.qid,
        //         userId: this.userId
        //       }).then(d => {
        //         if (d.code == '0' && d.data) {
        //           this.answerSuccess = true;
        //           Dialog.alert({
        //             title: '提示',
        //             message: '当前用户已填写过该问卷。',
        //           });
        //         }
        //       });
        //     } else {
        //       if (!query.userId) {
        //         Dialog.alert({
        //           title: '警告',
        //           message: '当前页面未获取到用户信息。',
        //         });
        //         this.answerSuccess = true;
        //         return;
        //       }
        //       this.userId = query.userId;
        //       localStorage.setItem('userId', this.userId);

        //       // 获取当前用户是否提交过问卷
        //       get('/fnd/ivt/checkAlreadyAnswer', {
        //         qid: this.qid,
        //         userId: this.userId
        //       }).then(d => {
        //         if (d.code == '0' && d.data) {
        //           this.answerSuccess = true;
        //           Dialog.alert({
        //             title: '提示',
        //             message: '当前用户已填写过该问卷。',
        //           });
        //         }
        //       });
        //     }
        //   }
    }
  },
  setup() {
    const state = reactive({
      /** 问卷Id */
      qid: '',
      /** 表单配置 */
      formConfig: {} as Record<string, any>,
      /** 返回数据 */
      resultData: {} as Record<string, any>,
      /** 问题列表 */
      controls: [] as any[],
      /** 是否显示二维码 */
      showQRCode: false,
      /** 回答完毕弹出提示框 */
      successDialogShow: false,
      /** 回答完毕 */
      answerSuccess: false,
      /** 是否初始化 */
      isInit: false,
      /** 查询问卷错误信息 */
      errorMsg: '',
      /** 当前用户userId */
      userId: localStorage.getItem('userId') ?? '',
    });

    return {
      ...toRefs(state),
    }
  }
});
</script>

<style lang="less">
  @import '~@/assets/less/question.less';
  
  .page-home {
    // display: flex;
    // flex-direction: column;
    box-sizing: border-box;
    // height: 100vh;

    &.answer-success {

      > .form-content {

        &:before {
          content: '';
          position: absolute;
          display: block;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          z-index: 99999;
        }
      }
    }

    > .form-header {
      flex-grow: 0;

      > .form-title {
        margin: 0px;
        padding-top: 0.83em;
        padding-bottom: 0.83em;
      }

      > .form-header-content {
        text-align: left;
        padding: 0px 15px;
        color: #999999;
        font-size: 14px;
      }
    }
    > .form-content {
      position: relative;
      flex-grow: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 0px 15px 15px 15px;
    }
    > .form-footer {
      display: flex;
      flex-grow: 0;
      padding: 15px;

      > button {

        + button {
          margin-left: 15px;
        }
      }
    }
  }

  .question-item {
    box-sizing: border-box;
    padding: 5px 15px 15px 15px;
    background-color: white;
    border-radius: 7px;
    box-shadow: 0px 5px 5px 0px rgba(175, 213, 255, 0.3);

    > .label {
      text-align: left;
      margin-top: 5px;
      margin-bottom: 5px;

      > .label-index {
        display: inline-block;
        padding-right: 2px;
      }

      > p {
        margin: 0px;
        display: inline;
      }
    }

    &.question-label {

      > .label {

        &:before {
          content: none;
        }
      }
    }

    + .question-item {
      margin-top: 15px !important;
    }
  }
</style>