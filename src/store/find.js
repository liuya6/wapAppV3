const find = {
  state: {
    getVip: '',
    washCodeRateArr: [],
    washCodeDetail: ""
  },
  getters: {
    getVip: state => {
      return state.getVip;
    },
    washCodeRateArr: state => {
      return state.washCodeRateArr
    },
    washCodeDetail: state => {
      return state.washCodeDetail
    }
  },
  mutations: {
    CHANGE_VIP: (state, payload) => {
        console.log(payload,"find.js--------------------");
        state.getVip = payload;
    },
    SET_WASH_CODE_RATE_ARR: (state,payload) => {
      state.washCodeRateArr = payload;
    },
    SET_WASH_CODE_DETAIL: (state,payload) => {
      state.washCodeDetail = payload;
    }
  },
  actions: {
    // getWashCodeRateList({commit}){
    //   washCodeRateList().then(res=> {
    //     console.log(res,"washCodeRateArr洗码比例分类");
    //     if(res.status) {
    //       commit("SET_WASH_CODE_RATE_ARR",res.data)
    //     }
    //   })
    // }
  }
};

export default find;
