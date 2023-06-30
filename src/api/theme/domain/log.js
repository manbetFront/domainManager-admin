import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'

// 域名操作列表
export function list(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/host_log/list',
    method: 'post',
    params
  })
}