import request from '@/utils/request'

// 权限列表
export function SystemList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/pr`,
    method: 'get',
    params
  })
}

// 新增权限
export function SystemAdd(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/pr`,
    method: 'post',
    data
  })
}


// 更新权限
export function SystemUpdate(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/pr`,
    method: 'put',
    data
  })
}


// 获取详情
export function SystemInfo(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/pr/${obj.id}`,
    method: 'get',
    params
  })
}

// 角色列表
export function roleList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/v2/groups`,
    method: 'get',
    params
  }, 'login')
}


// 用户管理删除
export function SystemUserDel(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/v2/user/del/${obj.id}`,
    method: 'post',
    data
  }, 'login')
}

// 用户管理列表
export function SystemUserList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/v2/users`,
    method: 'get',
    params
  }, 'login')
}
// 部门列表
export function SystemDepartmentsList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/v2/departmentsLevel`,
    method: 'get',
    params
  }, 'login')
}

// 用户管理新增
export function SystemUserAdd(obj) {
  let data = obj
  return request({
    url: `/api/v2/user/add`,
    method: 'post',
    data
  }, 'login')
}

// 用户管理编辑
export function SystemUserEdit(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/v2/user/edit/${obj.id}`,
    method: 'post',
    data
  }, 'login')
}
// 用户管理详情
export function SystemUserInfo(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/v2/user/edit/${obj.id}`,
    method: 'get',
    params
  }, 'login')
}

export function SystemUserUpdate(data) {
  return request({
    url: `/api/v2/user/update/${data.id}`,
    method: 'post',
    data
  }, 'login')
}


export function GetSite(data) {
  return request({
    url: `/api/group/getSite`,
    method: 'post',
    data
  })
}








// 白名单列表
export function SystemWhiteList(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/white/list`,
    method: 'post',
    data
  })
}
// 白名单删除
export function SystemWhiteDel(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/white/del`,
    method: 'post',
    data
  })
}
// 白名单新增
export function SystemWhiteAdd(obj) {
  let data = {
    ...obj
  }
  return request({
    url: `/api/white/add`,
    method: 'post',
    data
  })
}

// 获取菜单列表
export function SystemMenuList(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/vwk/get_column`,
    method: 'get',
    params
  },'login')
}
// 保存菜单列表
export function SystemMenuSave(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/vwk/menu_save`,
    method: 'post',
    params
  },'login')
}
