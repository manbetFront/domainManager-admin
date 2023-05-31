import axios from 'axios'
import qs from 'qs'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getUser, getRole } from '@/utils/auth'

const getBaseURL = stage => {
  let res = ''

  if (stage === 'image') {
    res = process.env.VUE_APP_BASE_API_IMAGE
  } else if (stage === 'login') {
    res = process.env.VUE_APP_BASE_API_LOGIN
  } else {
    // if (process.env.VUE_APP_TITLE === 'DEV') {
    //   res = process.env.VUE_APP_PROXY
    // } else {

    // }
    res = process.env.VUE_APP_BASE_API
  }
  return res
}

const config = {
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: process.env.VUE_APP_PROXY ? process.env.VUE_APP_PROXY : process.env.VUE_APP_BASE_API,
  timeout: 0, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    // "Cache-Control": "no-cache",
    // 'Access-Control-Allow-Headers': 'Content-Type',
    // 'Content-Type': 'application/json;charset=utf-8'
  }
}
// 创建axios实例
const _axios = axios.create(config)
// request拦截器
_axios.interceptors.request.use(
  config => {
    if (
      config.method !== 'get' &&
      config.headers['Content-Type'] !== 'multipart/form-data'
    ) {
      config.data = qs.stringify(config.data)
    }
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers['token'] = getToken()
      config.headers['group'] = getRole()
      config.headers['user'] = getUser()
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
_axios.interceptors.response.use(
  res => {
    // 二次修改 直接返还结果 不进行判断
    // return res.data
    const code = res.data.code
    // if ([3, 406, 400].includes(code)) {
    if ([3, 406].includes(code)) {
      MessageBox.confirm('登录状态已过期,请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.href = '/login' // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else {
      return res.data
    }
  },
  error => {
    if (error.response && error.response.status === 400) {
      store.dispatch('FedLogOut').then(() => {
        location.href = '/login' // 为了重新实例化vue-router对象 避免bug
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

const request = (data, stage = null) => {
  const reqData = {
    ...data
  }
  reqData.url = getBaseURL(stage) + reqData.url
  return _axios(reqData)
}

export default request
