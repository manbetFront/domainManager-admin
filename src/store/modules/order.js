import { getOrderNotice } from '@/api/pay-check'
import { setOrderTopic, getOrderTopic } from '@/utils/auth'
import { withdrawAddressList, rateList, moneyList, orderList,payChangeRecord } from '@/api/theme/order/rate'

const state = {
  topic: getOrderTopic(),
  subscribeNums: null,
  whiteData: [],
  numData1: 0,
  numData2: 0,
  numData3: 0,
  numData4: 0,
  numData6: 0
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
  }
}

const actions = {
  // 获取支付审核通知
  fetchOrderNotice({ commit }) {
    return new Promise((resolve, reject) => {
      getOrderNotice()
        .then(res => {
          const topic = Object.keys(res.data || {})[0]
          commit('SET_NUMS', res.data[topic])
          commit('SET_TOPIC', topic)
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // 汇率管理
  getNumber1({ commit }) {
    rateList({ page: 1, page_size: 10 }).then(response => {
      if (response.status === 200) {
        commit('SET_NUMS1', response.data.total)
      }
    })
  },
  // 钱包管理
  getNumber2({ commit }) {
    moneyList({ page: 1, page_size: 10 }).then(response => {
      if (response.status === 200) {
        commit('SET_NUMS2', response.data.total)
      }
    })
  },
  // 虚拟币支付审核
  getNumber3({ commit }) {
    orderList({ page: 1, page_size: 10 }).then(response => {
      if (response.status === 200) {
        commit('SET_NUMS3', response.data.total)
      }
    })
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
