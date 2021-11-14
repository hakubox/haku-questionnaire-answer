import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import qs from 'qs';
import { Dialog, Toast } from 'vant';

export function getType(val) {
  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
}

export function getToken(key): string {
  const cookie = document.cookie
    .split(';')
    .map((i) => (i ? i.trim() : ''))
    .find((str) => str.startsWith(key + '='));
  if (cookie) {
    const val = cookie?.split('=')?.[1];
    return val || '';
  } else {
    return '';
  }
}

/** 生成随机组件Id */
export function createModelId(len = 36) {
  const s: Array<string> = [];
  const hexDigits = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < len; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 26), 1);
  }
  // s[8] = s[13] = s[18] = s[23] = "-";
  const uuid = s.join('');
  return uuid;
}

/** 生成随机数字Id */
export function createNumberId(len = 36) {
  const s: Array<string> = [];
  const hexDigits = '0123456789';
  for (let i = 0; i < len; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 10), 1);
  }
  // s[8] = s[13] = s[18] = s[23] = '-';
  const uuid = s.join('');
  return uuid;
}

/**
 * 日期格式化
 * @param {Date} [date=new Date()] 日期
 * @param {string} [fmt='yyyy-MM-dd'] 格式化参数
 * @return {string} 格式化后的日期
 */
export function dateFormat(date: string | Date = new Date(), fmt: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  // @ts-ignore
  if (date == 'Invalid Date') return '';
  const o: Record<string, any> = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'H+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  let _fmt = fmt;
  if (/(y+)/.test(fmt)) _fmt = _fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(_fmt)) {
      _fmt = _fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return _fmt;
}

/** 交互数组中两段数值的位置 */
export function arrChange(arr: Array<any>, num1: number, num2: number, num1length: number = 1, num2length: number = 1) {
  if (num1 > num2) [num1, num2, num1length, num2length] = [num2, num1, num2length, num1length];

  return arr
    .slice(0, num1)
    .concat(arr.slice(num2, num2 + num2length))
    .concat(arr.slice(num1 + num1length, num2))
    .concat(arr.slice(num1, num1 + num1length))
    .concat(arr.slice(num2 + num2length));
}

/** 获取LocalStorage的值 */
export function getLocalstorge(item: string): string | null {
  return window.localStorage.getItem(item) || null;
}

//Base64转Buffer
export function base64ToBuffer(b: string): Uint8Array {
  const str = atob(b);
  const buffer = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buffer[i] = str.charCodeAt(i);
  }
  return buffer;
}

export function initAPI(api: Record<string, any>) {
  const re = {};
  const fn = (parent: any, reParent: any, url: string) => {
    if (parent) {
      Object.keys(parent).forEach((key: string) => {
        if (parent[key]) {
          if (typeof parent[key] !== 'function') {
            reParent[key] = {};
            fn(parent[key], reParent[key], `${url.endsWith('/') ? url + '/' : url}${key}`);
          } else {
            reParent[key] = parent[key].bind(`${url}/${key}/`);
          }
        }
      });
    }
  };
  fn(api, re, '');
  return re;
}

let loginExpired = false;
const default_config = {
  timeout: 30000,
};

/**
 * Get请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function get(
  url: string,
  params?: Record<string, any>,
  config: AxiosRequestConfig = {},
  _axios: AxiosInstance = axios,
): Promise<any> {
  loginExpired = false;
  return new Promise((resolve, reject) => {
    _axios
      .get(url, {
        // cancelToken: new axios.CancelToken(cancel => config.cancel = cancel),
        params: {
          ...params,
        },
        ...config,
        ...default_config,
        headers: {
          Authorization: getToken('Authorization') || '',
          ...config.headers,
        },
      })
      .then((d) => {
        if (d.data.isSuccess !== false) {
          resolve(d.data.result || d.data);
        } else {
          Toast({
            type: 'fail',
            message: d.data.errors.message,
          });
          console.error(d.data.exception);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status == 401) {
          if (!loginExpired) {
            localStorage.removeItem('Authorization');
            // message.info('登录超时，请重新登陆。');
            // notification.warning({ message: '系统提示', description: '登录超时，请重新登陆。' });
            loginExpired = true;
          } else {
            setTimeout(() => {
              loginExpired = false;
            }, 1000);
          }
          reject(err);
          return;
        }
        if (err.response && err.response.data) {
          Dialog.alert({
            title: '[Get Error]' + url,
            message: err.response.data.errMsg,
          });
          console.error(err.response.data.errMsg);
        } else if (err.message) {
          Dialog.alert({
            title: '[Get Error]' + url,
            message: err.message,
          });
          console.error(err.message);
        }
        reject(err);
      });
  });
}

/**
 * Post请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function post(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {},
  _axios: AxiosInstance = axios,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const _headers = {
      'Content-Type': 'application/json',
      Authorization: getToken('Authorization') || '',
      ...config.headers,
    };
    _axios
      .post(
        url,
        _headers['Content-Type'] == 'application/x-www-form-urlencoded'
          ? qs.stringify({
              ...params,
            })
          : {
              ...params,
            },
        {
          // cancelToken: new axios.CancelToken(cancel => config.cancel = cancel),
          ...default_config,
          ...config,
          headers: _headers,
        },
      )
      .then((d) => {
        if (d.data.isSuccess !== false) {
          resolve(d.data.result || d.data);
        } else {
          Dialog.alert({
            title: '警告',
            message: d.data.errors.message,
          });
          console.error(d.data.exception);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          Dialog.alert({
            title: '[Post Error]' + url,
            message: err.response.data.errMsg || err.response.data.title,
          });
          console.error(err.response.data.errMsg);
        } else if (err.response) {
          Dialog.alert({
            title: '[Post Error]' + url,
            message: err.message,
          });
          console.error(err.message);
        }
        reject(err);
      });
  });
}

/**
 * Upload请求
 * @param {string} url URL地址
 * @param {object} params 参数
 * @param {AxiosRequestConfig} config
 */
export function upload(
  url: string,
  params: Record<string, any>,
  config: AxiosRequestConfig = {},
  _axios: AxiosInstance = axios,
): Promise<any> {
  return new Promise((resolve, reject) => {
    const _params = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      _params.append(key, value);
    });
    _axios
      .post(url, _params, {
        // cancelToken: new axios.CancelToken(cancel => config.cancel = cancel),
        ...config,
        headers: {
          Authorization: getToken('Authorization') || '',
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      })
      .then((d) => {
        resolve(d.data);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          Dialog.alert({
            title: '[Upload Error]' + url,
            message: err.response.data.errMsg || err.response.data.title,
          });
          console.error(err.response.data.errMsg);
        } else if (err.response) {
          Dialog.alert({
            title: '[Upload Error]' + url,
            message: err.message,
          });
          console.error(err.message);
        }
        reject(err);
      });
  });
}

/** 获取默认的分页参数 */
export function getPagination(config: Record<string, any> = {}): Record<string, any> {
  return {
    pageSizeOptions: ['10', '20', '40'],
    showQuickJumper: true,
    showSizeChanger: true,
    defaultCurrent: 1,
    current: 1,
    defaultPageSize: 10,
    ...config,
  };
}

/** 将数字插入千分位符 */
export function thousandNum(money: number | string): string {
  if (!isNaN(Number(money))) {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    throw new TypeError('添加千分位符失败，当前参数为：' + money);
  }
}

/** 筛选对象的属性 */
export function filterObj(
  obj: Record<string, any>,
  outKeys: string[] = [],
  inKeys: string[] = [],
): Record<string, any> {
  let keys = Object.keys(obj);
  if (outKeys.length) {
    keys = keys.filter((i) => !outKeys.includes(i));
  }
  if (inKeys.length) {
    keys = keys.filter((i) => inKeys.includes(i));
  }
  // @ts-ignore
  return Object.assign.apply({}, [{}].concat(keys.map((i) => ({ [i]: obj[i] }))));
}

/** 获取Url参数 */
export function getParams() {
  return new URLSearchParams(location.search.replace(/\?/gi, ''));
}

function fakeClick(obj) {
  const ev = document.createEvent('MouseEvents');
  ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  obj.dispatchEvent(ev);
}

/** 下载文件 */
export function downLoadFile(name: string, data: string) {
  const urlObject = window.URL || window.webkitURL || window;
  const export_blob = new Blob([data]);
  const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  save_link.setAttribute('href', urlObject.createObjectURL(export_blob));
  save_link.setAttribute('download', name);
  fakeClick(save_link);
}

/** 递归函数 */
export function recursive(
  formVariables: Array<Record<string, any>>,
  callback?: {
    filter?: (variable: Record<string, any>, chain: Array<Record<string, any>>) => boolean;
    map?: (variable: Record<string, any>, chain: Array<Record<string, any>>) => any;
  },
  childField: string = 'children',
): Array<Record<string, any>> {
  if (!callback) {
    return formVariables;
  }

  const _list: Array<Record<string, any>> = [];

  // 递归
  const _cb = (newParent: Record<string, any>, parent: Record<string, any>, chain: Array<Record<string, any>>) => {
    if (callback?.filter?.(newParent, chain) === false) {
      return;
    }
    const _item = {
      ...parent,
      children: [],
    };
    chain.push(_item);
    if (parent?.children?.length) {
      for (let i = 0; i < parent.children.length; i++) {
        _cb(_item, parent.children[i], chain);
      }
    }
    newParent.children.push(callback.map?.(_item, chain) || _item);
  };

  formVariables.forEach((item) => {
    const _item = {
      ...item,
      children: [],
    };
    if (callback?.filter?.(_item, []) === false) {
      return;
    }

    if (item?.children?.length) {
      for (let i = 0; i < item.children.length; i++) {
        _cb(_item, item.children[i], [_item]);
      }
    }

    _list.push(callback.map?.(_item, [_item]) || _item);
  });

  return _list;
}

export function getBoxModel(arr: [number, number, number, number]) {
  return [
    arr[0] + 'px',
    arr[1] + 'px',
    arr[2] + 'px',
    arr[3] + 'px'
  ].join(' ');
}

export default {
  getToken,
  dateFormat,
  getLocalstorge,
  initAPI,
  get,
  post,
  getPagination,
  thousandNum,
  getParams,
  downLoadFile,
  recursive,
  filterObj,
};
