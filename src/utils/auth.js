import Cookies from 'js-cookie'
import { uniqueArr } from './index'

const TokenKey = 'Admin-Token'
const UserKey = 'username'
const roleKey = 'role'
const orderTopicKey = 'order-topic'
const siteArr = 'siteTExt'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUser() {
  return Cookies.get(UserKey)
}

export function setUser(username) {
  return Cookies.set(UserKey, username)
}

export function removeUser() {
  return Cookies.remove(UserKey)
}

export function getRole() {
  return Cookies.get(roleKey)
}

export function setRole(role) {
  return Cookies.set(roleKey, role)
}

export function removeRole() {
  return Cookies.remove(roleKey)
}

export function setOrderTopic(topic) {
  return Cookies.set(orderTopicKey, topic)
}

export function getOrderTopic() {
  return Cookies.get(orderTopicKey)
}
// 新增
export function setSiteData(site) {
  return Cookies.set(siteArr, site)
}

export function getSiteData() {
  return uniqueArr(Cookies.get(siteArr).split(',')); //Cookies.get(siteArr)
}
// ===============end

export function removeOrderTopic() {
  return Cookies.remove(orderTopicKey)
}
