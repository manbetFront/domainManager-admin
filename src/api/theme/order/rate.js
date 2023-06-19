import request from '@/utils/request'
import qs from 'qs'
import { getSiteData,getUser } from '@/utils/auth'
// 汇率管理列表
export function rateList(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/exchangeList',
    method: 'get',
    params
  })
}
// 汇率管理添加币种
export function addRate(obj) {
  const data = {
    ...obj
  }
  data.platform = getSiteData()
  return request({
    url: '/api/block/add',
    method: 'post',
    data
  })
}
// 汇率管理上架下架
export function rateHighLow(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/updateStatus',
    method: 'get',
    params
  })
}
// 汇率管理删除
export function rateDelete(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/delete',
    method: 'get',
    params
  })
}
// 汇率管理编辑
export function rateEdit(obj) {
  const data = {
    ...obj
  }
  return request({
    url: '/api/block/updateInfo',
    method: 'post',
    data
  })
}
// 钱包列表
export function moneyList(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/walletAddressList',
    method: 'get',
    params
  })
}
// 使用中的钱包
export function useWalletAddressList(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/useWalletAddressList',
    method: 'get',
    params
  })
}
// 钱包列表上下架与编辑
export function updateWalletAddress(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/updateWalletAddress',
    method: 'get',
    params
  })
}
// 钱包列表删除钱包
export function deleteWalletAddress(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/deleteWalletAddress',
    method: 'get',
    params
  })
}

// =======================================================================================\
// 订单审核状态
export function orderCheckStatus(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/examineType',
    method: 'get',
    params
  })
}
// 设置订单审核状态
export function orderEditStatus(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/updateExamineType',
    method: 'get',
    params
  })
}
// 存币创建订单
export function createDepositOrder(obj) {
  const data = {
    ...obj
  }
  return request({
    url: '/api/block/createDepositOrder',
    method: 'post',
    data
  })
}
// 修改订单金额
export function changeOrderMoney(obj) {
  const data = {
    ...obj
  }
  data.operation_name = getUser()
  return request({
    url: '/api/block/changeOrderMoney',
    method: 'post',
    data
  })
}
// 订单列表
export function orderList(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/orderList',
    method: 'get',
    params
  })
}
// 没汇率修改订单金额
export function changeOrderMoneyWithNoRate(obj) {
  const data = {
    ...obj
  }
  data.operation_name = getUser()
  return request({
    url: '/api/block/changeOrderMoneyWithNoRate',
    method: 'post',
    data
  })
}
// ============================================================================
// 添加提币地址
export function addWithdrewAddress(obj) {
  const data = {
    ...obj
  }
  data.platform = getSiteData()
  return request({
    url: '/api/block/addWithdrewAddress',
    method: 'post',
    data
  })
}
// 提币地址列表
export function withdrawAddressList(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/withdrawAddressList',
    method: 'get',
    params
  })
}
// 更新提币地址
export function updateWithdrawAddress(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/updateWithdrawAddress',
    method: 'get',
    params
  })
}
// 删除提币地址
export function deleteWithdrawAddress(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/block/deleteWithdrawAddress',
    method: 'get',
    params
  })
}

// 提币创建订单
export function createWithdrawOrder(obj) {
  const data = {
    ...obj
  }
  data.first_name = getUser()
  return request({
    url: '/api/block/createWithdrawOrder',
    method: 'post',
    data
  })
}
// 提币审核
export function examineWithdrawOrder(obj) {
  const data = {
    ...obj
  }
  return request({
    url: '/api/block/examineWithdrawOrder',
    method: 'post',
    data
  })
}
// 提币列表
export function getWithdrawList(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/withdrawList',
    method: 'get',
    params
  })
}
// 存币审核
export function saveCoinCheck(obj) {
  const data = {
    ...obj
  }
  data.operation_name = getUser()
  return request({
    url: '/api/block/examineDepositOrder',
    method: 'post',
    data
  })
}
// 订单历史支付记录
export function getOrderRecord(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/orderListAlreadyComplete',
    method: 'get',
    params
  })
}
// 订单历史支付记录
export function getUserSite(obj) {
  const params = {
    ...obj
  }
  return request({
    url: '/api/getUserSite',
    method: 'get',
    params
  })
}
// 支付金额变更记录
export function payChangeRecord(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/orderListIsChangeMoney',
    method: 'get',
    params
  })
}
// 提币审核记录
export function withdrawListAlreadyExamine(obj) {
  const params = {
    ...obj
  }
  params.platform = getSiteData()
  return request({
    url: '/api/block/withdrawListAlreadyExamine',
    method: 'get',
    params
  })
}
//下载接口==================================================

// 钱包列表下载
export function walletAddressListDownload(param) {
  return process.env.VUE_APP_BASE_API + '/api/block/walletAddressListDownload?' + qs.stringify(param)
}
// 订单历史支付记录下载
export function orderListAlreadyCompleteDownLoad(param) {
  return process.env.VUE_APP_BASE_API + '/api/block/orderListAlreadyCompleteDownLoad?' + qs.stringify(param)
}
// 支付金额变更记录下载
export function orderListIsChangeMoneyDownload(param) {
  return process.env.VUE_APP_BASE_API + '/api/block/orderListIsChangeMoneyDownload?' + qs.stringify(param)
}
//提币审核记录下载
export function withdrawListAlreadyExamineDownload(param) {
  return process.env.VUE_APP_BASE_API + '/api/block/withdrawListAlreadyExamineDownload?' + qs.stringify(param)
}
