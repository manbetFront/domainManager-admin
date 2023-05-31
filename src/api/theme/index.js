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
