console.log(window,"window-----------------------");
const Vue = window.Vue;
import App from './App.vue'
import router from './router'
import store from './store'
import "./style/index.less"
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import { exchangeAllToLottery } from "./api";
const { Dialog } = window.vant;

const VueLazyload = window.VueLazyload;
Vue.use(VueLazyload, {
  loading: require("./assets/images/loading.gif"),
});

const BScroll = window.BScroll;
Vue.prototype.initScroll = function() {
  let wrapper = document.getElementsByClassName("chatContent")[0];
  let _scroll =  new BScroll(wrapper,{
    scrollY: true,
    mouseWheel: true,
    click: true
  });
  Vue.prototype.$scroll = _scroll;
};

Vue.prototype.scrollBtm = function() {
  let _box = document.getElementsByClassName("chatScroll")[0].childNodes;
  let _btmBox = _box[_box.length - 1];
  let _btmChild = _btmBox.childNodes;
  let activeBox;
  this.$nextTick(()=>{
    activeBox = _btmChild[_btmChild.length -1];
    this.$nextTick(()=> {
      this.$scroll.scrollToElement(activeBox,300,true,true);
      // this.$scroll.refresh();
    })
  });
};

const requireComponent = require.context(
  // 其组件目录的相对路径
  "./components/common",
  // 是否查询其子目录
  true
  // 匹配基础组件文件名的正则表达式
  // /Base[A-Z]\w+\.(vue|js)$/
);
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    camelCase(
      // 获取和目录深度无关的文件名
      fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  // 全局注册组件
  Vue.component(
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，
    // 那么就会优先使用 `.default`，
    // 否则回退到使用模块的根。
    componentConfig.default || componentConfig
  );
});

import BetFunc from "./common/betFunc";
Vue.use(BetFunc);

// 日历
import Calendar from 'vue-mobile-calendar'
Vue.use(Calendar);

//复制模块
const VueClipboard = window.VueClipboard;
Vue.use(VueClipboard);

// 二维码
import VueQr from "vue-qr";
Vue.component("vue-qr", VueQr);

Vue.prototype.$_eval = function(fn) {
  return new Function("return " + fn)();
};

Vue.prototype.bankNum = function(card) {
  return card
    .replace(/\s/g, "")
    .replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** $2");
};

Vue.directive("focus", {
  //全局input聚焦
  inserted: function(el) {
    el.focus();
  }
});

Vue.prototype.toNum = function(data) {
  if(data === "") {
    return undefined
  }
  return data * 1
};

Vue.prototype.cancel = function(){
  // 获取缓存的 请求取消标识 数组，取消所有关联的请求
  let cancelArr = window.axiosCancel;
  // console.log(cancelArr,"delete");
  cancelArr.forEach((ele, index) => {
    // console.log(ele,index,"delete");
    ele.cancel("取消了请求");  // 在失败函数中返回这里自定义的错误信息
    delete window.axiosCancel[index]
  })
};

Vue.prototype.playGame = function(classify,typeKey,isHall,link = false,title = "",id = false) {
  console.log(classify,typeKey,isHall,link,title,id);
  if (classify === "CP") {
    if (link) {
      console.log(link, typeKey);
      if (!this.$store.getters.userInfo) {
        Dialog.confirm({
          title: '提示',
          message: '您还未登录，立即登录？'
        }).then(() => {
          // on confirm
          return router.push({
            name: "login",
            query: { redirect: router.currentRoute.fullPath }
          });
        }).catch(() => {
          // on cancel
          return false;
        });
        return false;
      }
      if(this.$store.getters.userInfo.parentId == 312) {
        return this.$toast("试玩账号无法进入")
      }
      sessionStorage.setItem('pathName',this.$route.name);
      exchangeAllToLottery().then(res=>{
        console.log(res);
        this.$store.commit("SET_GAME_URL", link);
        this.$store.commit("SET_PLAY_START_SHOW",true)
      });
      return false;
    }
    exchangeAllToLottery().then(res=> {
      console.log(res);
    });
    return this.$router.push({
      name: "hall"
    })
  } else {
    if (isHall) {
      console.log(typeKey,classify);
      return this.$router.push({
        name: "electronicGames",
        params: { typeKey, classify }
      });
    }
    if (!link) {
      return this.$toast("敬请期待");
    }
    if (!this.$store.getters.userInfo) {
      Dialog.confirm({
        title: '提示',
        message: '您还未登录，立即登录？'
      }).then(() => {
        return router.push({
          name: "login",
          query: { redirect: router.currentRoute.fullPath }
        });
      }).catch(() => {
        return false;
      });
      return false;
    }
    if(this.$store.getters.userInfo.parentId == 312) {
      return this.$toast("试玩账号无法进入")
    }
    sessionStorage.setItem('pathName',this.$route.name);
    exchangeAllToLottery().then(res=>{
      console.log(res);
      this.$store.commit("SET_GAME_URL", link);
      this.$store.commit("SET_PLAY_START_SHOW",true)
    })
  }
};

Vue.prototype.timestampToString = function(timestamp = new Date(),control) {
  //解析时间戳
  if (timestamp) {
    let time = new Date(timestamp * 1000);
    if(control) {
      time = new Date(timestamp)
    }
    let y = time.getFullYear();
    let M = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    M = M < 10 ? "0" + M : M;
    d = d < 10 ? "0" + d : d;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return y + "-" + M + "-" + d + " " + h + ":" + m + ":" + s;
  } else {
    return "";
  }
};

Vue.prototype.timeNoYear = function(timestamp = new Date()) {
  //解析时间戳
  if (timestamp) {
    let time = new Date(timestamp * 1000);
    let M = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    M = M < 10 ? "0" + M : M;
    d = d < 10 ? "0" + d : d;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return M + "-" + d + " " + h + ":" + m + ":" + s;
  } else {
    return "";
  }
};

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

Vue.prototype.back = function() {
  //全局返回
  if (window.history.length < 3) {
    return router.push({ name: "home" });
  }
  router.go(-1);
};

Vue.filter("timeRun", function(timeVal) {
  if (timeVal > 0) {
    let house =
      parseInt(timeVal / 60 / 60) >= 10
        ? parseInt(timeVal / 60 / 60)
        : "0" + parseInt(timeVal / 60 / 60);
    let mins =
      parseInt((timeVal / 60) % 60) >= 10
        ? parseInt((timeVal / 60) % 60)
        : "0" + parseInt((timeVal / 60) % 60);
    let sec = timeVal % 60 >= 10 ? timeVal % 60 : "0" + (timeVal % 60);
    return house + ":" + mins + ":" + sec;
  } else {
    return "开奖中...";
  }
});

Vue.filter("activityTime", function (timeVal) {
  if (timeVal > 0) {
    let getHour = parseInt(timeVal / 60 / 60);
    let day = parseInt(getHour / 24) == 0 ? '' : parseInt(getHour / 24) + ' 天 ';
    let hour = getHour % 24 >= 10 ? getHour % 24 : "0" + getHour % 24;
    let mins =
      parseInt((timeVal / 60) % 60) >= 10 ?
      parseInt((timeVal / 60) % 60) :
      "0" + parseInt((timeVal / 60) % 60);
    let sec = timeVal % 60 >= 10 ? timeVal % 60 : "0" + (timeVal % 60);
    return day + hour + " 时 " + mins + " 分 " + sec + " 秒";
  }
});

Vue.prototype.imgUrl = function(url, type = "") {
  //图片地址获取
  if (type === "Lottery") {
    // 带有图片格式
    if (url.indexOf('/images') >= 0) {
      return url;
    } else {
      return `/images${url}`;
    }
  } else if (type === "lottery") {
    return `/images/lottery/${url}.png`;
  } else {
    return `${url}`;
  }
};

Vue.prototype.toFixeds = function(data,fixNum = 2) {
  if(data === "") {
    return undefined
  }
  return (data*1).toFixed(fixNum*1)
};

Vue.prototype.cdnImg = function(type) {
  return `${this.$store.getters.allConfig.staticZhpUrl}${type}`
};

Vue.prototype.commonImg = function(type) {
  return `${this.$store.getters.allConfig.staticUrl}${type}`
};

Vue.prototype.winOpen = function(url) {
  this.$store.commit("SET_PLAY_START_SHOW",false);
  window.open(url);
};

Vue.directive("title", {
  // 指令的定义
  inserted: function(el, binding) {
    let titles = router.app.$options.store.getters.webName;
    if (binding.value !== "") {
      titles = binding.value + " - " + titles;
    }
    document.title = titles;
  },
  update: function(el, binding) {
    if(router.currentRoute.name === "bet"){
      let titles = router.app.$options.store.getters.webName;
      if (binding.value !== "") {
        titles = binding.value + " - " + titles;
      }
      document.title = titles;
    }
  },
});

Vue.directive("move",{
  inserted:function (el, binding, vnode) {
    let startX;
    let moveX;
    let maxX;
    let flag = false;
    el.ontouchstart = function(e) {
      e = window.event || e;
      startX = e.changedTouches[0].clientX;
      maxX = vnode.children[vnode.children.length-1].elm.clientWidth;
      if(el.style.left == -maxX+"px") {
        flag = true;
      }
    };
    el.ontouchmove = function (e) {
      e= window.event || e;
      moveX = e.changedTouches[0].clientX - startX;
      // console.log(moveX);
      if(moveX < 0) {
        el.style.left = parseInt(moveX) + "px";
        if(Math.abs(moveX) >= maxX) {
          el.style.left = -maxX + "px";
        }
      }else {
        if(flag) {
          e.stopPropagation();
          el.style.left = "0px"
        }
      }
    };
    el.ontouchend = function () {
      flag = false;
      if(moveX <0 && Math.abs(moveX) > ( maxX *(2/3))) {
        el.style.left = -maxX + "px";
      }else {
        if(el.style.left == (-maxX+"px")) {
          return;
        }
        el.style.left = 0 + "px";
      }
    };
  },
});

Vue.prototype.playAudio = () => {
  let Audios = document.getElementById("eventAudio");
  Audios.play();
};
Vue.prototype.pauseAudio = () => {
  let Audios = document.getElementById("eventAudio");
  Audios.pause();
};

Vue.prototype.times = function() {
  this.$store.commit("CHANGE_IS_RUN", 1);
  clearInterval(this.setTimer);
  let that = this;
  let time = null;
  // console.log(this.awardData,"main-times-------------");
  if(this.awardData && this.awardData.next && this.awardData.nowTime) {
    time = this.awardData.next.actionTime - this.awardData.nowTime;
  }
  if (time > 0) {
    this.setTimer = setInterval(function() {
      time--;
      if (time / 60 > 60) {
        var house =
          parseInt(time / 60 / 60) >= 10
            ? parseInt(time / 60 / 60)
            : "0" + parseInt(time / 60 / 60);
        var mins =
          parseInt((time / 60) % 60) >= 10
            ? parseInt((time / 60) % 60)
            : "0" + parseInt((time / 60) % 60);
      }
      let min =
        parseInt(time / 60) >= 10
          ? parseInt(time / 60)
          : "0" + parseInt(time / 60);
      let sec = time % 60 >= 10 ? time % 60 : "0" + (time % 60);
      if (house) {
        that.time = house + ":" + mins + ":" + sec;
        return;
      } else {
        that.time = "00:" + min + ":" + sec;
      }
      if (time <= that.lotteryData.data_ftime) {
        if (that.$store.getters.isRun) {
          that.$emit("timeOver", time);
          that.$store.commit("CHANGE_IS_RUN", 0);
        }
        if (time <= 0) {
          that.time = "00:00:00";
        }
      }
    }, 1000);
  }
};

Vue.prototype.currentDay = function() {
  let curDate = new Date();
  //当前时间戳
  let curTamp = curDate.getTime();
  //当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
  let curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1;
  //当日已经过去的时间（毫秒）
  let passedTamp = curTamp - curWeeHours;
  //当日剩余时间
  let leftTamp = 24 * 60 * 60 * 1000 - passedTamp;
  let time = new Date(leftTamp + curTamp);
  time.setTime(leftTamp + curTamp);
  return time
};

Vue.prototype.playLottery = function(id,classify,title){
  this.$router.push({
    name: "bet",
    params: { id: id, classify: classify },
    query: { title: title }
  });
};

Vue.prototype.changeChatDetails = function(res) {
  let loginInfo = {
    appKey : res.data.appKey,
    userUID : res.data.account,
    sdkToken: res.data.token,
    autoReply: res.data.autoReply,
    to: res.data.kefuAccount,
    kefuAvatar: res.data.kefuAvatar,
    kefuNickname: res.data.kefuNickname,
  };
  this.$store.commit("UPDATE_USER_UID",loginInfo);
  this.$store.commit("SET_CURRENT_ORDER_ID",res.data.id);
  this.$store.commit("SET_WELCOME",res.data.welcome);
  this.$router.push({name:"chat"})
};

Vue.prototype.character = function(str) {
  return str.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>')
};

window.onresize = setHtmlFontSize;
function setHtmlFontSize() {
  const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  const htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = htmlWidth / 10 + 'px';
}
setHtmlFontSize();

import "lib-flexible/flexible.js"; // 移动端自适应
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
