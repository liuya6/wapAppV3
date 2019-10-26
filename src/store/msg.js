import store from "./index"
import loading from "../common/loading"
const { Toast } = window.vant;

// 发送消息
export function sendMsg ({state},obj) {
  const nim = window.nim;
  nim.sendCustomMsg({
    scene: obj.scene,
    to: obj.to,
    pushContent: obj.pushContent,
    content: JSON.stringify(obj.content),
    avatar: state.avatar,
    done: onSendMsgDone
  });
}

// 收到消息
export function onMsg (msg) {
  console.log(msg,"收到消息");
  store.dispatch("msgUpdate",msg);
}

// 收到自定义消息
export function onCustomMsg(msg) {
  // 处理自定义消息
  console.log("收到自定义消息",msg)
}

// 收到漫游消息
export function onRoamingMsgs (obj) {
  console.log('收到漫游消息', obj);
}

// 收到离线消息
export function onOfflineMsgs (obj) {
  console.log('收到离线消息', obj);
  // if(obj.msgs) {
  //   let msgList = obj.msgs;
  //   for(let i =0;i<msgList.length;i++) {
  //     let msgOne = msgList[i];
  //     console.log(msgOne);
  //     store.dispatch("msgUpdate",msgOne)
  //   }
  // }
}

// 获取历史消息
export function getHistoryMsg ({state}) {
  const nim = window.nim;
  nim.getHistoryMsgs({
    scene: 'team',
    to: state.to,
    limit: 50,
    done: getLocalMsgDone
  });
  function getLocalMsgDone(err,obj) {
    console.log(err,obj,"历史消息--------------------");
    let historyMsgList = obj.msgs;
    for(let i=historyMsgList.length -1;i>=0;i--) {
      let msgOne = historyMsgList[i];
      console.log(msgOne);
      store.dispatch("msgUpdate",msgOne)
    }
  }
}

// 发送成功
function onSendMsgDone (error, msg) {
  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'success';
      alert(error.message)
    } else {
      alert(error.message)
    }
  }
  console.log(msg,"发送成功");
  store.dispatch("msgUpdate",msg);
}

// 更新消息
export function msgUpdate (context,msg) {
  let message;
  if(msg.type == "custom" || msg.type == "image") {
    message = {
      type: msg.content ? JSON.parse(msg.content).type : 2,
      oriented: msg.from === store.state.Chat.userUID ? "right" : "left",
      username : msg.from,
      content: msg.type == "custom" ? JSON.parse(msg.content) : '',
      file: msg.file || "",
      txImg: msg.from === store.state.Chat.userUID ? store.state.User.userInfo.avatar : store.state.Chat.kefuAvatar
    };
  }else {
    return false
  }
  context.commit("SET_MESSAGE",message);
  window._vue.scrollBtm()
}

// 发送文件消息（图片，视频，文件）
export function sendFileMsg ({ commit }, obj) {
  const nim = window.nim;
  let { type, fileInput } = obj;
  if (!type && fileInput) {
    type = 'file';
    if (/\.(png|jpg|bmp|jpeg|gif)$/i.test(fileInput.value)) {
      type = 'image'
    } else if (/\.(mov|mp4|ogg|webm)$/i.test(fileInput.value)) {
      type = 'video'
    }
  }
  // store.dispatch('showLoading');
  commit("SET_UPLOADER_SHOW",false);
  loading.open("上传中...");
  const data = Object.assign({
    type,
    uploadprogress: function (data) {
      loading.close();
      loading.open("上传中("+data.percentageText+")");
      console.log(data.percentageText)
    },
    uploaderror: function () {
      fileInput.value = '';
      loading.close();
      Toast("上传失败");
      console.log('上传失败')
    },
    uploaddone: function(error, file) {
      fileInput.value = '';
      console.log(error);
      console.log(file);
    },
    beforesend: function (msg) {
      console.log('正在发送消息, id=', msg);
    },
    done: function (error, msg) {
      onSendMsgDone (error, msg);
      loading.close();
    }
  }, obj);
  nim.sendFile(data)
}
