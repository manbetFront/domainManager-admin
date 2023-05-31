import request from '@/utils/request'

// 列表
export function orderList(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/po',
    method: 'get',
    params
  })
}

// 上传图片
export function updateImg(data) {
  return request({
    url: `/api/filer`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }, 'image')
}

// 首页信息
export function homeInfo(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/user/summary',
    method: 'get',
    params
  })
}
// 标签设置
export function setTags(obj) {
  const data = {
    ...obj
  }
  return request({
    url: '/api/order/set_tags',
    method: 'post',
    data
  })
}

// 新增订单
export function addOrder(obj) {
  const data = {
    ...obj
  }
  return request({
    url: '/api/po',
    method: 'post',
    data
  })
}

// 订单详情
export function orderInfo(obj) {
  const params = {
    ...obj
  }
  return request({
    url: `/api/po/${obj.id}`,
    method: 'get',
    params
  })
}

// 审核订单
export function confirmOrder(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/po_update',
    method: 'get',
    params
  })
}

// 角色下拉框
export function roleList(obj) {
  const data = {
    ...obj
  }
  return request({
    url: '/api/po/getGroups',
    method: 'post',
    data
  })
}
