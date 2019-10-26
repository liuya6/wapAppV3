import store from "./index";

const NIM = window.NIM;

import { sendMsg, msgUpdate, sendFileMsg, getHistoryMsg, onMsg, onOfflineMsgs, onRoamingMsgs } from "./msg";
import { onMyInfo } from "./chatUser";
const { Toast } = window.vant;

const chat = {
  state: {
    currentOrderId: "", //当前订单id
    appKey:"",      // key
    userUID: "",    // 我的uid
    sdkToken: "",   // token值
    to: "",         // 客服account
    kefuAvatar: "", // 客服头像
    kefuNickname: "", // 客服名称
    autoReply: "",  // 自动回复消息
    userDetail: "", // 我的名片
    // avatarList: "", // 用户列表
    uploaderShow: false, // 上传图片显示
    footerOpen: false, // 底部发送
    tips: "连接中，请稍等...",
    welcome: "",
    receiptDetail: "",  // 收款号码详情
    message: []
  },
  getters: {
    message: state => {
      return state.message
    },
    appKey: state=> {
      return state.appKey
    },
    userUID: state=> {
      return state.userUID
    },
    sdkToken: state=> {
      return state.sdkToken
    },
    to: state=> {
      return state.to
    },
    autoReply: state=> {
      return state.autoReply
    },
    userDetail: state=> {
      return state.userDetail
    },
    uploaderShow: state=> {
      return state.uploaderShow
    },
    tips: state=> {
      return state.tips
    },
    welcome: state=> {
      return state.welcome
    },
    currentOrderId: state => {
      return state.currentOrderId
    },
    receiptDetail: state => {
      return state.receiptDetail
    },
    footerOpen: state => {
      return state.footerOpen
    },
    kefuAvatar: state => {
      return state.kefuAvatar
    },
    kefuNickname: state => {
      return state.kefuNickname
    }
  },
  mutations: {
    SET_INIT_MESSAGE:(state) => {
      state.message = [];
    },
    SET_MESSAGE:(state,payload) => {
      state.message.push(payload)
    },
    UPDATE_USER_UID (state, payload) {
      state.appKey = payload.appKey;
      state.userUID = payload.userUID;
      state.sdkToken = payload.sdkToken;
      state.autoReply = payload.autoReply;
      state.to = payload.to;
      state.kefuAvatar = payload.kefuAvatar;
      state.kefuNickname = payload.kefuNickname;
      console.log(payload,"chat-----------------------------------------data");
    },
    SET_USER_DETAIL (state, userDetail) {
      state.userDetail = userDetail
    },
    SET_UPLOADER_SHOW(state, payload) {
      state.uploaderShow = payload
    },
    SET_TIPS(state, payload) {
      state.tips = payload
    },
    SET_WELCOME(state,payload) {
      state.welcome = payload
    },
    SET_CURRENT_ORDER_ID(state, payload) {
      state.currentOrderId = payload
    },
    SET_RECEIPT_DETAIL(state, payload) {
      state.receiptDetail = payload
    },
    SET_FOOTER_OPEN(state, payload){
      state.footerOpen = payload
    }
  },
  actions: {
    initSDK({state}) {
      if(window.nim) {
        window.nim.disconnect()
      }
      window.nim = NIM.getInstance({
        debug: true,
        appKey: state.appKey,
        account: state.userUID,
        token: state.sdkToken,
        transports: ['websocket'],
        // db: false,
        syncSessionUnread: true,
        syncRobots: true,
        autoMarkRead: true, // 默认为true.
        onconnect: function onConnect (event) {
          // if (loginInfo) {
            // 连接上以后更新uid
            console.log("SDK连接成功！",event);
          //   commit('UPDATE_USER_UID', loginInfo)
          // }
        },
        onmyinfo: onMyInfo,
        onupdatemyinfo: onMyInfo,
        // onusers: onUserInfo,
        // onupdateuser: onUserInfo,
        onerror: function onError (event) {
          // alert(JSON.stringify(event))
          console.log(JSON.stringify(event));
          Toast('网络连接状态异常');
          // 跳转到登录
          // location.href = config.loginUrl
        },
        onwillreconnect: function onWillReconnect () {
          console.log(event)
          // 正在重连
        },
        ondisconnect: function onDisconnect (error) {
          switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
              // pageUtil.turnPage('帐号或密码错误', 'login')
              console.log("账号密码错误");
              break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
              // var map = {
              //   PC: '电脑版',
              //   Web: '网页版',
              //   Android: '手机版',
              //   iOS: '手机版',
              //   WindowsPhone: '手机版'
              // };
              // var str = error.from;
              // var errorMsg = `你的帐号于${formatDate(new Date())}被${(map[str] || '其他端')}踢出下线，请确定帐号信息安全!`;
              // pageUtil.turnPage(errorMsg, 'login')
              console.log("你的帐号于其他端被提出下线，请确定帐号信息安全");
              Toast("你的帐号于其他端被提出下线，请确定帐号信息安全！");
              break;
            default:
              break
          }
        },
        onroamingmsgs: onRoamingMsgs,
        onofflinemsgs: onOfflineMsgs,
        onmsg: onMsg,
        onsyncdone: function onSyncDone () {
          store.commit("SET_TIPS","连接充值客服成功");
          let tip = {
            type: 1,
            oriented: "left",
            txImg: state.kefuAvatar,
            content: {
              msg: state.welcome || "欢迎光临"
            }
          };
          store.commit("SET_MESSAGE",tip);
          store.dispatch("getHistoryMsg")
        }
      })
    },
    sendMsg,
    msgUpdate,
    sendFileMsg,
    getHistoryMsg,
  }
};

export default chat;
