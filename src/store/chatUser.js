import store from "./";

export function onMyInfo (user) {
  console.log("收到我的名片",user);
  store.commit("SET_USER_DETAIL",user)
}

// export function onUserInfo (user) {
//   console.log(user,store.state.Chat.userDetail,"所有用户名片");
//   // let userList = user;
//   // userList.push(store.state.Chat.userDetail);
//   // console.log(userList);
//   // store.commit("SET_USER_AVATAR_LIST",userList);
//   store.commit("SET_TIPS","连接充值客服成功");
//   let tip = {
//     type: "tips",
//     txImg: "kf.jpg",
//     content: "欢迎使用官方线上充值，下方按钮是目前可以用的充值方式，请点选您需要的充值方式"
//   };
//   store.commit("SET_MESSAGE",tip);
//   store.dispatch("getHistoryMsg")
// }
