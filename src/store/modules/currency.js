import { GetCurrency } from '@/api/common'

const currency = {
  state: {
    currency: []
  },

  mutations: {
    SET_CURRENCY: (state, val) => {
      state.currency = val
    }
  },

  actions: {
    // 登录
    GetCurrencyList({ commit }) {
      return new Promise((resolve, reject) => {
        GetCurrency().then(res => {
          resolve(res.data || [])
        }).catch(error => {
          console.log('我是错误的')
          reject(error)
        })
      })
    }
  }
}

export default currency
