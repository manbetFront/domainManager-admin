import request from '@/utils/request'

// 获取路由
export const getRouters = (obj) => {
  let params = {
    ...obj
  }
  return request({
    url: '/api/vwk/login_column_tree',
    method: 'get',
    params
  },'login')
}