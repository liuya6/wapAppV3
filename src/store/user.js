import {
  isLogin,
  myBankCard,
  signList,
  members
} from "../api";

const User = {
  state: {
    userInfo: null, //用户数据
    password: '',  //用户密码
    order: "", //充值订单数据
    // TransferMethod: "", //转账方式
    rechargeArr: [], //充值列表
    kfList: [], // 人工充值列表
    myBank: [], // 我的银行卡
    boxSum: [], // 选中金额
    bankCardId: '', //当前提现的银行卡ID
    tabStatus: 'balance', //当前Tab的状态
    aboutUsArr: '', //关于我们列表
    helpList: '', //帮助中心列表
    allBankCardList: '', // 绑定银行卡准备
    thirdList: '', //游戏记录游戏列表
    rechargeMoneyType: "",
    rechargeMoneyList: "",
    registerNow: '',
    checkInShow: false, //签到页面
    checkInList: { day:0 },
    rechargeMoney: "", // 充值的金额
    rechargeName: "", //充值人姓名
    teamThirdList: ""
  },
  getters: {
    userInfo: state => {
      return state.userInfo;
    },
    order: state => {
      return state.order;
    },
    // TransferMethod: state => {
    //   return state.TransferMethod;
    // },
    rechargeArr: state => {
      return state.rechargeArr
    },
    kfList: state => {
      return state.kfList
    },
    myBank: state => {
      return state.myBank
    },
    boxSum: state => {
      return state.boxSum
    },
    bankCardId: state => {
      return state.bankCardId
    },
    tabStatus: state => {
      return state.tabStatus
    },
    aboutUsArr: state => {
      return state.aboutUsArr;
    },
    helpList: state => {
      return state.helpList
    },
    allBankCardList: state => {
      return state.allBankCardList
    },
    thirdList: state => {
      return state.thirdList
    },
    teamThirdList: state => {
      return state.teamThirdList
    },
    rechargeMoneyList: state => {
      return state.rechargeMoneyList
    },
    rechargeMoneyType: state => {
      return state.rechargeMoneyType
    },
    fromPathName: state => {
      return state.fromPathName
    },
    checkInShow: state => {
      return state.checkInShow
    },
    checkInList: state => {
      return state.checkInList
    },
    registerNow: state => {
      return state.registerNow
    },
    password: state => {
      return state.password
    },
    rechargeMoney: state => {
      return state.rechargeMoney
    },
    rechargeName: state => {
      return state.rechargeName
    }
  },
  mutations: {
    SET_USER_INFO(state, payload) {
      state.userInfo = payload;
    },
    CLEAR_USER_INFO(state) {
      state.userInfo = null;
    },
    SET_RECHARGE_ARR(state, payload) {
      state.rechargeArr = payload
    },
    ORDERS(state, payload) {
      state.order = payload;
    },
    // TRANSFER_METHOD(state, payload) {
    //   state.TransferMethod = payload;
    // },
    SET_MY_BANK(state, payload) {
      state.myBank = payload;
    },
    SET_BOX_SUM(state, payload) {
      state.boxSum = payload;
    },
    SET_BANK_ID(state, payload) {
      state.bankCardId = payload;
    },
    SET_TAB_ID(state, payload) {
      state.tabStatus = payload;
    },
    SET_ABOUT_US(state, payload) {
      state.aboutUsArr = payload;
    },
    SET_HELP_LIST(state, payload) {
      state.helpList = payload;
    },
    SET_ALL_BANK_CARD(state, payload) {
      state.allBankCardList = payload
    },
    SET_THIRD_LIST(state, payload) {
      state.thirdList = payload;
    },
    SET_TEAM_THIRD_LIST(state, payload){
      state.teamThirdList = payload
    },
    SET_RECHARGE_LIST(state, payload) {
      state.rechargeMoneyList = payload;
    },
    SET_RECHARGE_TYPE(state, payload) {
      state.rechargeMoneyType = payload;
    },
    SET_FROM_PATHNAME(state, payload) {
      state.fromPathName = payload;
    },
    SET_CHECKIN_SHOW: (state, payload) => {
      state.checkInShow = payload;
    },
    SET_CHECKIN_LIST: (state, payload) => {
      state.checkInList = payload;
    },
    SET_REGISTERNOW(state, payload) {
      state.registerNow = payload
    },
    SET_PASSWORD(state, payload) {
      state.password = payload
    },
    SET_RECHARGE_MONEY (state, payload) {
      state.rechargeMoney = payload;
    },
    SET_RECHARGE_NAME (state, payload) {
      state.rechargeName = payload;
    },
    SET_KF_LIST (state, payload) {
      state.kfList = payload
    }
  },
  actions: {
    checkedLogin(context) {
      isLogin().then(res => {
        if (typeof res === "string") {
          return false;
        }
        if (res.status) {
          context.commit("SET_USER_INFO", res.data);
        } else {
          context.commit("SET_USER_INFO", "");
        }
      });
    },
    members(context) {
      members().then(res=> {
        if (typeof res === "string") {
          return false;
        }
        if (res.status) {
          context.commit("SET_USER_INFO", res.data);
        } else {
          context.commit("SET_USER_INFO", "");
        }
      })
    },
    getMyBank(context) {
      myBankCard().then(res => {
        console.log(res.data, "我的银行卡");
        if (res.status) {
          context.commit('SET_MY_BANK', res.data);
          if (res.data.length) {
            if (!context.getters.bankCardId) {
              context.commit('SET_BANK_ID', res.data[0].id)
            }
          } else {
            context.commit('SET_BANK_ID', '')
          }
        }
      });
    },
    getCheckInList(context) {
      signList().then(res => {
        context.commit("SET_CHECKIN_LIST", res.data);
        console.log(res.data, "签到列表")
      })
    }
  }
};

export default User;
