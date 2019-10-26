import { fetch } from "../axios";

// 推广团队说明
export function description() {
  return fetch({
    url: "MemberPromotion/description",
    method: "get",
    loading: true
  })
}

// 推广链接返点比例
export function getSetList() {
  return fetch({
    url: "MemberPromotion/getSetList",
    method: "get",
  })
}

// 添加推广链接
export function addLinks(query) {
  return fetch({
    url: "MemberPromotion/addLinks",
    method: "post",
    data: query,
    loading: true
  })
}

// 推广链接详情
export function getLinks(query) {
  return fetch({
    url: "MemberPromotion/getLinks",
    method: "get",
    params: query,
    loading: true
  })
}

// 推广链接列表
export function getLinksList() {
  return fetch({
    url: "MemberPromotion/getLinksList",
    method: "get",
    loading: true
  })
}

// 我的推广返点
export function getMySet() {
  return fetch({
    url: "MemberPromotion/getMySet",
    method: "get",
    loading: true
  })
}

// 团队投注记录
export function betRecordList(query) {
  return fetch({
    url: "MemberPromotion/betRecordList",
    method: "get",
    params: query,
    loading: true
  })
}

// 团队成员列表
export function getMembers(query) {
  return fetch({
    url: "MemberPromotion/getMemberList",
    method: "get",
    params: query,
    loading: true
  })
}

// 团队报表
export function teamReport(query) {
  return fetch({
    url: "MemberPromotion/teamReport",
    method: "get",
    params: query,
    loading: true
  })
}

// 删除推广链接
export function deleteLinks(query) {
  return fetch({
    url: "MemberPromotion/deleteLinks",
    method: "post",
    data: query,
    loading: true
  })
}

// 修改推广链接
export function modifyLinks(query) {
  return fetch({
    url: "MemberPromotion/modifyLinks",
    method: "post",
    data: query,
    loading: true
  })
}

// 团队往来记录
export function teamLog(query) {
  return fetch({
    url: "MemberPromotion/teamLog",
    method: "get",
    params: query,
    loading: true
  })
}

// 下级报表
export function agentReport(query) {
  return fetch({
    url: "MemberPromotion/agentReport",
    method: "get",
    params: query,
    loading: true
  })
}

// 下级报表
export function teamCount() {
  return fetch({
    url: "MemberPromotion/teamCount",
    method: "get",
  })
}

// 直接开户
export function registerKh(query) {
  return fetch({
    url: "MemberPromotion/register",
    method: "post",
    data: query,
    loading: true
  })
}

