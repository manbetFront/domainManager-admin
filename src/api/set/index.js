import request from '@/utils/request'

// 设置主题一列表
export function setAList() {

  return request({
    url: '/gred/api/theme/a/setting/index',
    method: 'post'
  })
}

// 编辑主题一
export function setAEdit(id) {
  return request({
    url: `/gred/api/theme/a/setting/edit/${id}`,
    method: 'get'
  })
}

// 保存主题一编辑
export function setASave(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/gred/api/theme/a/setting/edit/${obj.id}`,
    method: 'post',
    data
  })
}

// 设置主题二列表
export function setBList() {

  return request({
    url: '/gred/api/theme/b/setting/index',
    method: 'post'
  })
}

// 编辑主题二
export function setBEdit(id) {
  return request({
    url: `/gred/api/theme/b/setting/edit/${id}`,
    method: 'get'
  })
}

// 保存主题二编辑
export function setBSave(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/gred/api/theme/b/setting/edit/${obj.id}`,
    method: 'post',
    data
  })
}

// 获取活动展示时间信息
export function activityTime(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/gred/api/activity/index`,
    method: 'post',
    data
  })
}

// 获取活动展示时间信息
export function saveActivityTime(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/gred/api/activity/edit/${obj.id}`,
    method: 'post',
    data
  })
}