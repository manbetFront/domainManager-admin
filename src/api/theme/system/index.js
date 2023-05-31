import request from '@/utils/request'

// 权限列表
export function systemList(obj) {
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
export function systemAdd(obj) {
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
export function systemUpdate(obj) {
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
export function systemInfo(obj) {
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
export function systemUserDel(obj) {
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
export function systemUserList(obj) {
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
export function systemDepartmentsList(obj) {
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
export function systemUserAdd(obj) {
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
export function systemUserInfo(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/v2/user/edit/${obj.id}`,
    method: 'get',
    params
  }, 'login')
}



// 白名单列表
export function systemWhiteList(obj) {
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
export function systemWhiteDel(obj) {
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
export function systemWhiteAdd(obj) {
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
export function systemMenuList(obj) {
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
export function systemMenuSave(obj) {
  let params = {
    ...obj
  }
  return request({
    url: `/api/vwk/menu_save`,
    method: 'post',
    params
  },'login')
}
