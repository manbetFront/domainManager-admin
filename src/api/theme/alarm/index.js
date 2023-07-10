import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'

// 异常回报列表
export function reportList(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/health_list',
    method: 'post',
    params
  })
}

// 异常推广域名上报
export function alarmReport(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/unhealthReport',
    method: 'post',
    params
  })
}

// 异常回报处理
export function alarmHandle(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/fixUnhealth',
    method: 'post',
    params
  })
}

// 域名回报处理日志
export function reportLog(obj) {
  const params = {
    ...obj
  }
  // params.platform = getSiteData()
  return request({
    url: '/api/agent_host/fixedUnhealthList',
    method: 'get',
    params
  })
}