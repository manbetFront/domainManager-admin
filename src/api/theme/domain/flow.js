import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'

// 域名流量概览
export function list(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/upv_list',
    method: 'post',
    params
  })
}