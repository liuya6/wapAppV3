<template>
  <div class="footer" :class="{zIndex:FindShow}">
    <ul>
      <li v-for="(item,i) in List" :key="i" :class="{'nav-active':item.pathName===pathName}">
        <div @click="nav(item.pathName)">
          <i
            class="iconfont"
            v-if="item.pathName!=='find'"
            v-html="item.pathName===pathName?item.onIcon:item.offIcon"
          ></i>
          <div v-if="item.pathName==='find'">
            <img :src="require('../../assets/images/find.png')" alt />
          </div>
          <p :class="{'findP':item.pathName==='find'}">{{item.title}}</p>
        </div>
        <b v-if="item.pathName==='user' &&userInfo&& userInfo.unread> 0"></b>
      </li>
    </ul>
    <template v-if="allConfig">
      <van-popup class="findPopup" v-model="FindShow" position="bottom">
        <div class="findContent">
          <dl>
            <dd v-for="(item,i) in Find" :key="i" @click="findClick(item.pathName,item.type)">
              <div>
                <img v-lazy="cdnImg(`find/${item.imgName}.png`)" alt />
              </div>
              <p>{{item.title}}</p>
            </dd>
          </dl>
          <div @click="FindShow = false">
            <div class="arrows-container">
              <div class="arrow arrow-one">
              </div>
              <div class="arrow arrow-two">
              </div>
            </div>
          </div>
        </div>
      </van-popup>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { redPacket } from "../../api";
const List = [
  { title: "首页", pathName: "home", onIcon: "&#xe6e6;", offIcon: "&#xe6e4;" },
  // {
  //   title: "大厅",
  //   pathName: "GamesLobby",
  //   onIcon: "&#xe6e2;",
  //   offIcon: "&#xe6e5;"
  // },
  {
    title: "活动",
    pathName: "activity",
    onIcon: "&#xe6e2;",
    offIcon: "&#xe6e5;"
  },
  {
    title: "发现",
    pathName: "find",
    imgSrc: require("@/assets/images/find.png")
  },
  {
    title: "充值",
    pathName: "wallet",
    onIcon: "&#xe731;",
    offIcon: "&#xe732;"
  },
  {
    title: "个人中心",
    pathName: "user",
    onIcon: "&#xe6e8;",
    offIcon: "&#xe6e7;"
  }
];
export default {
  name: "Footer",
  data() {
    return {
      List,
      Find: [
        { title: "红包", type: "redEnvelope", pathName: "redpack", imgName: "redEnvelope"},
        { title: "VIP", type: "vip", pathName: "vip", imgName: "vip" },
        { title: "签到", type: "checkIn", imgName: "checkIn" },
        { title: "余额宝", type: "balance", pathName: "yuebaoHome", imgName: "balance" },
        { title: "聊天室", type: "chat", imgName: "chat" },
        { title: "实时洗码", type: "washcode", pathName: "washcode", imgName: "washcode" },
        { title: "推荐好友", type: "share", imgName: "recommend" },
        { title: "团队管理", type: "recommend", pathName: "recommend", imgName: "recommend" },
        { title: "客服中心", type: "service", pathName: "servicePage", imgName: "service" }
      ],
      FindShow: false
    };
  },
  created() {
    this.isShow();
  },
  computed: {
    ...mapGetters(["allConfig", "userInfo"]),
    pathName() {
      return this.$router.currentRoute.name;
    },
    txUrl() {
      // console.log(window.location);
      return window.location.origin + "/register/" + this.userInfo.uid;
    }
  },
  methods: {
    nav(name) {
      if (name !== "find") {
        this.$router.push({ name: name });
      } else {
        if(!this.allConfig)  return;
        this.initFind();
        this.isShow();
        this.FindShow = true;
      }
    },
    findClick(pathName, type) {
      if (pathName === "redpack" && this.userInfo) {
        if (this.userInfo.parentId == 312) {
          // 试玩账号验证
          return this.$toast("试玩账号不能参与");
        }
        redPacket().then(res => {
          console.log(res);
          if (res.status) {
            this.$store.commit("SET_RED_PACK", res.data);
            return this.$router.push({ name: pathName });
          } else {
            return this.$toast("红包活动已结束");
          }
        });
        return false;
      }
      if (pathName) {

        if (type === "balance") {
          console.log(this.pathName);
          this.$store.commit("SET_FROM_PATHNAME",this.pathName);
          if (this.allConfig.yuebaoSwitch == "1") {
            return this.$router.push({ name: pathName });
          }
        }
        return this.$router.push({ name: pathName });
      }
      if(type === "checkIn") {
        if(this.userInfo) {
          if (this.userInfo.parentId == 312) {
            // 试玩账号验证
            return this.$toast("试玩账号不能参与");
          }
          this.$store.dispatch("getCheckInList");
          this.FindShow = false;
          this.$store.commit("SET_CHECKIN_SHOW",1);
        }else {
          this.$dialog.confirm({
            title: '提示',
            message: '您还未登录，立即登录？'
          }).then(() => {
            this.$router.push({name: "login"});
          }).catch(() => {
            // on cancel
            console.log("取消");
          });
        }
        return false;
      }
      if (type === "share") {
        if (this.userInfo) {
          if (this.userInfo.parentId == 312) {
            // 试玩账号验证
            return this.$toast("试玩账号没有推广链接噢");
          }
          this.$copyText(this.txUrl)
            .then(e => {
              console.log(e);
              this.$toast("推广链接复制成功");
              this.FindShow = false;
            })
            .catch(() => {
              console.log("取消");
              return false;
            });
        }else {
          this.$dialog.confirm({
            title: '提示',
            message: '您还未登录，立即登录？'
          }).then(() => {
            return this.$router.push({name: "login"});
          }).catch(() => {
            // on cancel
            console.log("取消");
            return false;
          });
        }
        return false;
      } else {
        this.$toast("敬请期待！");
      }
    },
    isShow() {
      let vipIndex = null;
      let washCodeIndex = null;
      let shareIndex = null;
      let recommendIndex = null;
      for(let i =0;i<this.Find.length;i++) {
        let itemOne = this.Find[i];
        if(itemOne.type === "vip") {
          vipIndex = i ;
        }
        if(itemOne.type === "washcode") {
          washCodeIndex = i ;
        }
        if(itemOne.type === "share") {
          shareIndex = i;
        }
        if(itemOne.type === "recommend") {
          recommendIndex = i;
        }
      }
      if(this.userInfo && this.userInfo.username) {
        if(this.userInfo.type == "3" && shareIndex) {
          this.Find.splice(shareIndex, 1)
        }
        if(this.userInfo.type != "3" && recommendIndex) {
          this.Find.splice(recommendIndex, 1)
        }
      }else {
        if(recommendIndex) {
          this.Find.splice(recommendIndex, 1)
        }
      }
      if(this.allConfig) {
        if (this.allConfig.isWapUserLevel !== "1" && vipIndex) {
          this.Find.splice(vipIndex, 1);
        }
        if(this.allConfig.enableWashcode !== "1" && washCodeIndex ) {
          this.Find.splice(washCodeIndex,1);
        }
        if(this.allConfig.enableTuijian !== "1" && shareIndex) {
          this.Find.splice(shareIndex,1);
        }
      }
    },
    initFind() {
      this.Find = [
        { title: "红包", type: "redEnvelope", pathName: "redpack", imgName: "redEnvelope"},
        { title: "VIP", type: "vip", pathName: "vip", imgName: "vip" },
        { title: "签到", type: "checkIn", imgName: "checkIn" },
        { title: "余额宝", type: "balance", pathName: "yuebaoHome", imgName: "balance" },
        { title: "聊天室", type: "chat", imgName: "chat" },
        { title: "实时洗码", type: "washcode", pathName: "washcode", imgName: "washcode" },
        { title: "推荐好友", type: "share", imgName: "recommend" },
        { title: "团队管理", type: "recommend", pathName: "recommend", imgName: "recommend" },
        { title: "客服中心", type: "service", pathName: "servicePage", imgName: "service" }
      ]
    }
  }
};
</script>

<style scoped lang="less">
.footer {
  height: 100px;
  &.zIndex{
    z-index: 102 !important;
  }
  ul {
    height: 100px;
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    .borderTop();
    li {
      float: left;
      width: 20%;
      height: 100%;
      list-style: none;
      text-align: center;
      position: relative;
      z-index: 1;
      > b {
        position: absolute;
        width: 20px;
        height: 20px;
        right: 50px;
        top: 5px;
        border-radius: 50%;
        background-color: @red;
        opacity: 0.8;
      }
      > div {
        display: block;
        font-size: 0;
        color: @FontColor-Foot;

        i {
          font-size: 45px;
          line-height: 62px;
        }
        p {
          font-size: 22px;
        }
        div {
          width: 115px;
          height: 57px;
          border-radius: 0 0 115px 115px;
          position: absolute;
          left: 50%;
          bottom: 42px;
          transform: translate(-50%);
          background-color: #fff;
          .borderBtm();
          img {
            position: absolute;
            left: 7px;
            bottom: 7px;
            width: 100px;
            height: 100px;
          }
        }
        .findP {
          margin-top: 62px;
        }
      }
    }
    .nav-active {
      color: @ThemeColor;
      i {
        color: @ThemeColor;
      }
      p {
        color: @ThemeColor;
      }
    }
  }
  .findPopup {
    width: 100%;
    .findContent {
      width: 100%;
      background-color: #fff;
      padding-bottom: 50px;
      dl {
        display: flex;
        flex-wrap: wrap;
        padding-top: 60px;
        dd {
          flex: 0 0 auto;
          width: 25%;
          text-align: center;
          margin-bottom: 50px;
          div {
            display: inline-block;
            width: 128px;
            height: 128px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          p {
            text-align: center;
            font-size: 28px;
          }
        }
      }
      > div {
        text-align: center;
        width: 70px;
        height: 70px;
        margin: auto;
        img {
          width: 100%;
          height: 100%;
        }
        .arrows-container {
          display: flex;
          position: relative;
          width: 50px;
          height: 50px;
        }

        .arrow {
          width: 40px;
          height: 40px;
          /*padding: 10px;*/
          box-shadow: 2px -2px black inset;
          transform: rotate(-45deg);
          /*opacity: 0;*/
          position: absolute;
        }

        .arrow-one {
          animation: arrowMovement 2s ease-in-out infinite;
        }

        .arrow-two {
          animation: arrowMovement 2s 1s ease-in-out infinite;
        }

        @keyframes arrowMovement {
          0% {
            top: 0;
            opacity: 0;
          }
          70% {
            opacity: 1;
          }
          100% {
            top: 30px;
            opacity: 0;
          }
        }
      }
    }
  }
}
</style>
