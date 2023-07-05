import { asyncRoutes, constantRoutes } from '@/router'
import { getRouters } from "@/api/menu";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route && route.name) {
    // return roles.some(role => route.meta.roles.includes(role))
    return roles.some(role => role.url === route.name);
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  let res = [];
  let tmp = {};

  routes.forEach(route => {
    const obj = { ...route }
    if (hasPermission(roles, obj)) {
      const item = roles.find(r => r.url === route.name);
      if (item) {
        tmp = {
          path: obj.path,
          name: obj.name,
          component: obj.component,
          meta: { title: item.name },
        }
        if (obj.hidden) {
          tmp.hidden = true;
        }
        if (obj.redirect) {
          tmp.redirect = obj.redirect;
        }
        if (obj.alwaysShow) {
          tmp.alwaysShow = obj.alwaysShow;
        }
        if (obj.meta.icon) {
          tmp.meta.icon = obj.meta.icon;
        }
        if (obj.meta.activeMenu) {
          tmp.meta.activeMenu = obj.meta.activeMenu;
        }
        if (obj.meta.isShowCurrency) {
          tmp.meta.isShowCurrency = obj.meta.isShowCurrency;
        }
        if (obj.meta.hasBadge) {
          tmp.meta.hasBadge = obj.meta.hasBadge;
        }
        if (obj.children) {
          tmp.children = filterAsyncRoutes(obj.children, roles)
        }
        res.push(tmp)
      }
    }
  })

  return res
}

export function expandTreeRoutes(routes = []) {
  let res = [];
  let tmp = {};

  routes.forEach(route => {
    const obj =  { ...route };
    tmp = {
      id: obj.id,
      pid: obj.pid,
      fid: obj.fid,
      name: obj.name,
      url: obj.url,
      type: obj.type,
    }
    if (obj.child && obj.child.length) {
      res = res.concat(expandTreeRoutes(obj.child));
    }
    res.push(tmp);
  })

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
  reportDownload: false,
  permissions: [],
  baseReportDownload: false,
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },

  SET_PERMISSIONS: (state, value) => {
    state.permissions = value
    // setLocalItem('_permissions', value)
  },
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      getRouters({
        pid: process.env.VUE_APP_PID
      })
      .then((res) => {
        const results = expandTreeRoutes(res.data[0]);
        commit('SET_PERMISSIONS', res.data[0])

        const accessedRoutes = [
          ...filterAsyncRoutes(asyncRoutes, results),
          { path: '*', redirect: '/404', hidden: true }
        ];
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
    
        // setLocalItem('_menu', accessedRoutes)
        // commit('SET_ROUTES', asyncRoutes)
        // resolve(asyncRoutes)
      })
      .catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
