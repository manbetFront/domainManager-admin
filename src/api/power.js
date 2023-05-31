


import request from '@/utils/request'

// 权限列表
export function PowerList(data) {
  return request({
    url: `/api/group/list`,
    method: 'post',
    data
  })
}

// add
export function PowerAdd(data) {
  return request({
    url: `/api/group/create`,
    method: 'post',
    data
  })
}


// add
export function PowerEdit(data) {
  return request({
    url: `/api/group/update`,
    method: 'post',
    data
  })
}


//delete
export function PowerDel(data) {

  return request({
    url: `/api/group/delete`,
    method: 'post',
    data
  })
}


// update
export function PowerUpdate(data) {

  return request({
    url: `/api/group/set`,
    method: 'post',
    data
  })
}


