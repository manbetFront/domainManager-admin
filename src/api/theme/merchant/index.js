import request from '@/utils/request'
// 列表
export function domainList(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/merchant/list',
    method: 'post',
    data
  })
}

// 订单列表
export function orderList(params) {
  return request({
    url: '/api/merchant/order_list',
    method: 'get',
    params
  })
}


// 审核订单
export function confirmOrder(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/merchant/order_audit',
    method: 'post',
    data
  })
}
// 订单详情
export function orderInfo(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/merchant/order_info',
    method: 'post',
    data
  })
}


// 新增
export function domainAdd(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/merchant/add_url',
    method: 'post',
    data
  })
}



// 域名更新
export function domainUpdate(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/merchant/update`,
    method: 'post',
    data
  })
}

// 获取站点
export function domainGetSite(obj) {
  let params = {
    ...obj
  }
  return request({
    url: '/api/pu_site',
    method: 'get',
    params
  })
}
