import { fetch } from "../axios";
//  洗码列表
// export function washCodeList() {
//   return fetch({
//     url: "/Memberwashcode/washCodeList",
//     method: "get",
//   })
// }

// 领取洗码金额
export function getWashcode() {
  return fetch({
    url: "/Memberwashcode/getWashcode",
    method: "post",
  })
}

// 洗码统计
export function washCodeStatistics() {
  return fetch({
    url: "/Memberwashcode/washCodeStatistics",
    method: "get",
  })
}

// 洗码比例分类
export function washCodeRateList() {
  return fetch({
    url: "/Memberwashcode/washCodeRateList",
    method: "get",
  })
}

// 洗码等级比例
export function washCodeRateLevel(query) {
  return fetch({
    url: "/Memberwashcode/washCodeRateLevel",
    method: "get",
    params: query
  })
}


