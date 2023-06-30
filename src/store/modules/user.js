import { login, logout } from '@/api/login'
import { getUserSite } from '@/api/theme/order/rate'
import { getToken, setToken, removeToken, setUser, getUser, setRole, setSiteData } from '@/utils/auth'

import { Notification } from 'element-ui'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    siteDataArr: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_SITE_DATA: (state, siteDataArr) => {
      state.siteDataArr = siteDataArr
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      return new Promise((resolve, reject) => {
        login({
          //           pid: process.env.NODE_ENV === 'development' ? 52 : '*',
          pid: process.env.VUE_APP_PID,
          username,
          password,
          ...userInfo
        }).then(res => {
          if (res.code === 0) {
            let _string = ''
            if (res.data.auth_group_list.length>0) {
              const _arr = res.data.auth_group_list.map(item => {
                return item.name
              })
              localStorage.setItem('sitaData', _arr.toString())
              _string = encodeURIComponent(_arr.toString())
            }
            setRole(_string)
            setToken(res.data.access_token)
            setUser(username)
            commit('SET_TOKEN', res.data.token)
            resolve(res)
          } else if ([402, 407].includes(res.code)) {
            resolve(res)
          } else {
            Notification.error({
              title: res.msg
            })

            reject(res)
          }
        }).catch(error => {
          console.log('我是错误的')
          reject(error)
        })
      })
    },
    // 获取站点getUserSite
    getUserSiteData({ commit }) {
      return new Promise((resolve, reject) => {
        getUserSite({
          groups: localStorage.getItem('sitaData')
        }).then(res => {
          if (res.status === 200) {
            const siteArr = res.data.map(item => {
              return item.site
            })
            commit('SET_SITE_DATA', siteArr.toString())
            // 保存站点数组
            setSiteData(siteArr.toString())
            // end===
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        // 二次修改 抛出用户信息，不进行请求
        const _res = {
          'msg': '操作成功',
          'code': 200,
          'permissions': [
            '*:*:*'
          ],
          'roles': [
            'admin'
          ],
          'user': {
            'searchValue': null,
            'createBy': 'admin',
            'createTime': '2018-03-16 11:33:00',
            'updateBy': null,
            'updateTime': null,
            'remark': '管理员',
            'dataScope': null,
            'params': {},
            'userId': 1,
            'deptId': 103,
            'userName': 'admin',
            'nickName': 'dancen',
            'email': 'dancen@ecoph.com',
            'phonenumber': '15888888888',
            'sex': '1',
            'avatar': '',
            'password': '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2',
            'salt': null,
            'status': '0',
            'delFlag': '0',
            'loginIp': '127.0.0.1',
            'loginDate': '2018-03-16T11:33:00.000+0800',
            'dept': {
              'searchValue': null,
              'createBy': null,
              'createTime': null,
              'updateBy': null,
              'updateTime': null,
              'remark': null,
              'dataScope': null,
              'params': {},
              'deptId': 103,
              'parentId': 101,
              'ancestors': null,
              'deptName': '研发部门',
              'orderNum': '1',
              'leader': 'dancen',
              'phone': null,
              'email': null,
              'status': '0',
              'delFlag': null,
              'parentName': null,
              'children': []
            },
            'roles': [
              {
                'searchValue': null,
                'createBy': null,
                'createTime': null,
                'updateBy': null,
                'updateTime': null,
                'remark': null,
                'dataScope': '1',
                'params': {},
                'roleId': 1,
                'roleName': '管理员',
                'roleKey': 'admin',
                'roleSort': '1',
                'status': '0',
                'delFlag': null,
                'flag': false,
                'menuIds': null,
                'deptIds': null,
                'admin': true
              }
            ],
            'roleIds': null,
            'postIds': null,
            'admin': true
          }
        }
        const user = _res.user
        const avatar = user.avatar === '' ? require('@/assets/image/profile.jpg') : process.env.VUE_APP_BASE_API + user.avatar
        if (_res.roles && _res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', _res.roles)
          commit('SET_PERMISSIONS', _res.permissions)
        } else {
          commit('SET_ROLES', ['ROLE_DEFAULT'])
        }
        commit('SET_NAME', getUser())
        commit('SET_AVATAR', avatar)
        resolve(_res)
        return
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
