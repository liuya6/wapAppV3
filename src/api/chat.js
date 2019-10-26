import { fetch } from "../axios";

// 获取appkey
export function getAppKey (query) {
  return fetch({
    url:"chat/getRechargeLoginInfo",
    method: "get",
    params: query,
    loading: true
  })
}

// 获取客服列表
export function kefuList () {
  return fetch({
    url:"chat/kefuList",
    method: "get",
  })
}

// 订单查询
export function getRechargeList (query) {
  return fetch({
    url:"chat/getRechargeList",
    method: "get",
    params: query,
    loading: true
  })
}

// 自动回复
export function rechargeAutoReply (query) {
  return fetch({
    url:"chat/rechargeAutoReply",
    method: "get",
    params: query,
    loading: true
  })
}
