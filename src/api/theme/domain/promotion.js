import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'

// 推广域名设置列表
export function list(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/list',
    method: 'post',
    params
  })
}

// 推广域名设置列表--创建
export function create(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/create',
    method: 'post',
    params
  })
}

// 推广域名设置列表--编辑
export function update(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/update',
    method: 'post',
    params
  })
}

// 推广域名设置列表--删除
export function del(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/delete',
    method: 'post',
    params
  })
}

// 快过期推广域名列表
export function proExpireList(obj) {
    const params = {
      ...obj
    }
    params.platform = getSiteData()
    return request({
      url: '/api/agent_host/expire',
      method: 'post',
      params
    })
  }