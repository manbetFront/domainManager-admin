import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'

// 主域名设置列表
export function list(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/main_host/list',
    method: 'post',
    params
  })
}

// 主域名设置列表--创建
export function create(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/main_host/create',
    method: 'post',
    params
  })
}

// 主域名设置列表--编辑
export function update(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/main_host/update',
    method: 'post',
    params
  })
}

// 主域名设置列表--删除
export function del(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/main_host/delete',
    method: 'post',
    params
  })
}

// 快过期主域名列表
export function mainExpireList(obj) {
    const params = {
      ...obj
    }
    params.platform = getSiteData().toString();
    return request({
      url: '/api/main_host/expire',
      method: 'post',
      params
    })
  }