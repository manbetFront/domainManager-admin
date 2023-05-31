import request from '@/utils/request'
// 领取查询主题1
export function recordAList(obj) {
  let data = {
    type: "a",
    ...obj
  }
  return request({
    url: '/gred/api/theme/record/index',
    method: 'post',
    data
  })
}

// 单个补发主题
export function reissueSingle(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/gred/api/theme/record/single',
    method: 'post',
    data
  })
}

// 多个补发主题
export function reissueMore(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/gred/api/theme/record/batch',
    method: 'post',
    data
  })
}


// 领取查询主题2
export function recordBList(obj) {
  let data = {
    type: "b",
    ...obj
  }
  return request({
    url: '/gred/api/theme/record/index',
    method: 'post',
    data
  })
}

