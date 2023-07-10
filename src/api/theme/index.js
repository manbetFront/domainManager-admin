import request from '@/utils/request'


// 上传图片
export function updateImg(data) {
  return request({
    url: `/api/admin/upload`,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取当前用户未读消息
export function getUnreadMsg(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/getUnreadMsg',
    method: 'get',
    params
  })
}

// 上报当前用户已读消息
export function reportReadMsg(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/reportReadMsg',
    method: 'get',
    params
  })
}


