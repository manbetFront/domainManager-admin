import request from '@/utils/request'
// 列表
export function domainList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: '/api/pu',
    method: 'get',
    params
  })
}

// 新增
export function domainAdd(obj) {
  let data = {
    ...obj
  }
  return request({
    url: '/api/pu',
    method: 'post',
    data
  })
}

// 联动
export function domainField(obj) {
  let params = {
    ...obj
  }
  return request({
    url: '/api/pu_field',
    method: 'get',
    params
  })
}
// 域名详情
export function domainInfo(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/pu/${obj.id}`,
    method: 'get',
    params
  })
}
// 域名更新
export function domainUpdate(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/pu`,
    method: 'put',
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
