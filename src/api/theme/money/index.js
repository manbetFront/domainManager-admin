import request from '@/utils/request'
// 列表
export function moneyList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: '/api/pc',
    method: 'get',
    params
  })
}
// 渠道类别与账户
export function moneyType(obj) {
  let params = {
    ...obj
  }
  return request({
    url: '/api/pc_field',
    method: 'get',
    params
  })
}

// 新增金流
export function moneyAdd(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/pc',
    method: 'post',
    data
  })
}

// 修改金流
export function moneyUpdate(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/pc',
    method: 'put',
    data
  })
}

// 金流详情
export function moneyInfo(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/pc/${obj.id}`,
    method: 'get',
    params
  })
}