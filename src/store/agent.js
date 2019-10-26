import { getMySet, getSetList } from "../api"
const agent = {
  state: {
    myAgentSet: "",
    mySetList: "",
    teamDetail: "",
    teamBetRecordList: "",
    teamBetRecordParameter: "",
    teamContactsList: "",
    teamContactsParameter: "",
    teamCountData: ""
  },
  getters: {
    myAgentSet: state => {
      return state.myAgentSet
    },
    mySetList: state => {
      return state.mySetList
    },
    teamDetail: state => {
      return state.teamDetail
    },
    teamBetRecordList: state => {
      return state.teamBetRecordList
    },
    teamBetRecordParameter: state => {
      return state.teamBetRecordParameter
    },
    teamContactsList: state => {
      return state.teamContactsList
    },
    teamContactsParameter: state => {
      return state.teamContactsParameter
    },
    teamCountData: state => {
      return state.teamCountData
    }
  },
  mutations: {
    SET_MY_AGENT_SET: (state,payload) =>{
      state.myAgentSet = payload
    },
    SET_MY_SET_LIST: (state,payload) =>{
      state.mySetList = payload
    },
    SET_TEAM_DETAIL: (state,payload) =>{
      state.teamDetail = payload
    },
    SET_TEAM_BET_RECORD_LIST: (state,payload) => {
      state.teamBetRecordList = payload;
    },
    SET_TEAM_BET_RECORD_PARAMETER: (state,payload) => {
      state.teamBetRecordParameter = payload;
    },
    SET_CONTACTS_LIST: (state,payload) => {
      state.teamContactsList = payload;
    },
    SET_CONTACTS_PARAMETER: (state,payload) => {
      state.teamContactsParameter = payload;
    },
    SET_TEAM_COUNT_DATA: (state,payload) => {
      state.teamCountData = payload
    }
  },
  actions: {
    getMyFdSet({commit}) {
      getMySet().then(res=> {
        console.log(res,"返点设置");
        if(res.status) {
          commit("SET_MY_AGENT_SET",res.data);
        }
      })
    },
    getSetLists({commit}) {
      getSetList().then(res=> {
        console.log(res,"返点比例");
        if(res.status) {
          commit("SET_MY_SET_LIST",res.data);
        }
      })
    }
  }
};

export default agent;