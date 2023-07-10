import { getOrderNotice } from '@/api/pay-check'
import { setOrderTopic, getOrderTopic } from '@/utils/auth'
import { withdrawAddressList, /*rateList,*/ /*moneyList,*/ orderList,payChangeRecord } from '@/api/theme/order/rate'
import { proExpireList } from '@/api/theme/domain/promotion'
import { mainExpireList } from '@/api/theme/domain/main'
import { reportList } from '@/api/theme/alarm/index'
import { getSiteData } from '@/utils/auth'

const state = {
  topic: getOrderTopic(),
  subscribeNums: null,
  whiteData: [],
  numData1: 0,
  numData2: 0,
  numData3: 0,
  numData4: 0,
  numData6: 0,
  reportMqtt: [],
  fixMqtt: [],
  hasAlarmReport: false,
  hasAlarmLog: false,
  alarmHandleId: 0,
}

const mutations = {
  SET_NUMS: (state, data) => {
    state.subscribeNums = data
  },
  SET_TOPIC: (state, data) => {
    state.topic = data
    setOrderTopic(data)
  },
  SET_WHITE_ADDRESS: (state, whiteData) => {
    state.whiteData = whiteData
  },
  SET_NUMS1: (state, data) => {
    state.numData1 = data
  },
  SET_NUMS2: (state, data) => {
    state.numData2 = data
  },
  SET_NUMS3: (state, data) => {
    state.numData3 = data
  },
  SET_NUMS4: (state, data) => {
    state.numData4 = data
  },
  SET_NUMS6: (state, data) => {
    state.numData6 = data
  },
  SET_REPORT_MQTT:(state, data) => {
    state.reportMqtt = data
  },
  SET_FIX_MQTT:(state, data) => {
    state.fixMqtt = data
  },
  SET_HAS_ALARM_REPORT:(state, data) => {
    state.hasAlarmReport = data
  },
  SET_HAS_ALARM_LOG:(state, data) => {
    state.hasAlarmLog = data
  },
  SET_ALARM_HANDLE_ID:(state, data) => {
    state.alarmHandleId = data
  },
}

const actions = {
  // 获取支付审核通知
  // fetchOrderNotice({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     getOrderNotice()
  //       .then(res => {
  //         const topic = Object.keys(res.data || {})[0]
  //         commit('SET_NUMS', res.data[topic])
  //         commit('SET_TOPIC', topic)
  //         resolve(res)
  //       })
  //       .catch(error => {
  //         reject(error)
  //       })
  //   })
  // },
  // 快过期推广域名列表
  getNumber1({ commit }) {
    proExpireList().then(response => {
      if (response.code === 200) {
        commit('SET_NUMS1', response.data.length)
      }
    })
  },
  // 快过期跳转域名列表
  getNumber2({ commit }) {
    mainExpireList().then(response => {
      if (response.code === 200) {
        commit('SET_NUMS2', response.data.length)
      }
    })
  },
  // 异常回报列表 未处理数量
  getNumber3({ commit }) {
    reportList({ platform: getSiteData().toString()}).then(response => {
      if (response.code === 200) {
        commit('SET_NUMS3', response.data.total)
      }
    })
  },

  //刷新 异常回报列表 未处理数量
  refreshNumber3({ commit }, total) {
    commit('SET_NUMS3', total)
  },

  // 支付金额变更记录
  getNumber4({ commit }) {
    payChangeRecord({ page: 1, page_size: 10, if_change_num: 2 }).then(response => {
      if (response.status === 200) {
        commit('SET_NUMS4', response.data.total)
      }
    })
  },

  // 提现地址设置存储
  getWithdraw({ commit }) {
    return new Promise((resolve, reject) => {
      withdrawAddressList()
        .then(res => {
          commit('SET_WHITE_ADDRESS', res.data)
          commit('SET_NUMS6', res.data.length)
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  setReportMqtt({ commit }, data) {
    commit('SET_REPORT_MQTT', data)
  },

  setFixMqtt({ commit }, data) {
    commit('SET_FIX_MQTT', data)
  },

  setHasAlarmReport({ commit }, data) {
    commit('SET_HAS_ALARM_REPORT', data)
  },

  setHasAlarmLog({ commit }, data) {
    commit('SET_HAS_ALARM_LOG', data)
  },

  setAlarmHandleId({ commit }, data) {
    commit('SET_ALARM_HANDLE_ID', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
