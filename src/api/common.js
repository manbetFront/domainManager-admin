
import request from '@/utils/request'

// 获取路由
export const GetCurrency = (data) => {

  return request({
    url: '/api/bank/getCurrency',
    method: 'post',
    data
  })
}
