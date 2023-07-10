import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'

// 跳转域名设置列表
export function list(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/main_host_detail_list',
    method: 'get',
    params
  })
}

// 跳转域名设置列表--编辑
export function update(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/main_host_detail_update',
    method: 'post',
    params
  })
}