import axios from 'axios'
import {tokenName} from '@/globalVars.js'
import {showToast, closeToast} from 'vant'
const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: {
        
    }
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    config.params.tkid = sessionStorage.getItem(tokenName)

    showToast({
        type: 'loading',
        message: '加载中...',
        forbidClick: true,
        duration: 0,
    })
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    closeToast()
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    let {flag = 1, message = ''} = response.data
    switch(flag) {
        case '-20'://登录过期
            sessionStorage.removeItem(tokenName)
            // 跳到登录页
            return {}
            break
    }
    return response.data
  }, function (error) {
    closeToast()
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
// instance.initGet = instance.get

// 重写get方法
instance.get = (url = '', params = {}, config = {}) => {
    config.params = {
        ...config.params,
        ...params,
    }
    instance.get(url, config)
}

export default instance