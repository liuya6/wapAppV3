<template>
  <div class="body" v-title="lotteryData.title" :class="{ k3Bg: isK3 }">
    <div class="top">
      <i class="iconfont back" @click="goBack">&#xe629;</i>
      <!--标题-->
      <div @click="gameShow">
        <span>{{ $route.query.title || "-" }}</span>
        <i class="iconfont">{{ gameSwitch ? "&#xe628;" : "&#xe620;" }}</i>
      </div>
      <!--右侧功能区-->
      <ul>
        <!--购物车-->
        <li v-show="!noCart" @click="goCart">
          <i class="iconfont car">&#xe61e;</i>
          <span v-if="cartCount">{{ cartCount }}</span>
        </li>
        <!--助手-->
        <li>
          <i class="iconfont" @click="assistantShow">&#xe61f;</i>
          <transition name="fadeUp">
            <dl v-if="assistantSwitch">
              <dt></dt>
              <dd v-for="(item, i) in assistantArr(assistantList)" :key="i">
                <router-link
                    :to="{
                  name: item.urlName,
                  params: {
                    id: lotteryData.id,
                    classify: lotteryData.classify
                  },
                  query: {
                    title: lotteryData.title,
                    typeName: lotteryData.name,
                    modeType: modeType
                  }
                }"
                >
                  <b class="iconfont" v-html="item.icon"></b>
                  <span>{{ item.text }}</span>
                </router-link>
              </dd>
            </dl>
          </transition>
        </li>
      </ul>
    </div>
    <!--多模式，包含官方传统的模式-->
    <div
        class="playMode"
        key="double-mode"
        v-if="lotteryData.isDoubleMode"
        :class="{ k3Common: isK3 }"
    >
      <!--模式-->
      <div @click="modeShow">
        <span>
          {{ modeTypeTitle }}
          <i class="iconfont">{{ modeSwitch ? "&#xe628;" : "&#xe620;" }}</i>
        </span>
      </div>
      <!--玩法-->
      <div @click="playShow">
        <span>
          {{ groupData.groupName }}-{{ playData.name }}
          <i class="iconfont">{{ playSwitch ? "&#xe628;" : "&#xe620;" }}</i>
        </span>
      </div>
    </div>
    <!--单模式，六合彩模式（没有官方传统-->
    <div
        class="playModeSix"
        v-else
        key="single-mode"
        @click="playShow"
        :class="{ k3Common: isK3 }"
    >
      <span v-if="isK3" key="isK3">
        {{ playData.k3Name || playData.name }}
        <i class="iconfont">{{ playSwitch ? "&#xe628;" : "&#xe620;" }}</i>
      </span>
      <span v-else key="noK3">
        {{ groupData.groupName }}-{{ playData.name }}
        <i class="iconfont">{{ playSwitch ? "&#xe628;" : "&#xe620;" }}</i>
      </span>
    </div>
    <!-- 倒计时，投注模板 -->
    <div class="bet-content" @click="closeAll" v-if="allGroupList[0]">
      <!--页面内通知-->
      <div class="msg">
        <p ref="msg">
          {{ msg }}
        </p>
      </div>
      <!--开奖模板-->
      <component
          :is="awardTemplates"
          :award-data="awardData"
          :lotteryData="lotteryData"
          @timeOver="timeOver"
      ></component>
      <!--投注模板-->
      <component
          :is="betTemplate"
          :lottery-data="lotteryData"
          :play-data="playData"
          ref="betTemplate"
      ></component>
    </div>
    <!--底部确认-->
    <div class="footer">
      <van-button
          @click="clearAllSelected"
          :style="{ backgroundColor: '#666', color: count ? '#fff' : '#a7a7a7' }"
      >全清空</van-button
      >
      <van-button
          class="random"
          :class="{ k3Common: isK3 }"
          v-show="!noCart"
          @click="handleRandom"
          style="background-color: #666;color: #fff"
      >随机</van-button
      >
      <van-button
          class="buy"
          @click="handleBet"
          :class="{ fendan: !buyFlag, buyBig: noCart, k3Common: isK3 }"
      >{{ buy }}</van-button
      >
      <div class="footerFixed" v-show="count" :class="{ NoUser: !userInfo }">
        <div class="left">
          <h3>共计{{ count }}注,总金额{{ amount }}元</h3>
          <p v-if="userInfo">余额：{{ userInfo.coin }} 元</p>
        </div>
        <template v-if="userInfo">
          <div class="right" v-show="Number(userInfo.coin) < Number(amount)">
            <router-link :to="{ name: 'wallet' }"
            >余额不足，去充值>></router-link
            >
          </div>
        </template>
      </div>
    </div>
    <!--头部下拉彩种集-->
    <transition name="fadeUp">
      <div class="popups" v-show="gameSwitch">
        <!--
        :class="{ popupShow: gameSwitch }"
        -->
        <!--彩种分类-->
        <ul>
          <li
              v-for="(item, i) in lotteryList"
              :key="i"
              @click="changeGameList(item.gameType)"
          >
            <van-button :class="{ on: item.gameType == gameType }">
              {{ item.gameTitle }}
            </van-button>
          </li>
        </ul>
        <!--彩种分类列表-->
        <dl>
          <dd>
            <div
                v-for="(item, i) in gameDataList"
                :key="i"
                @click="choose(item.id, item.classify, item.title)"
            >
              <van-button :class="{ [isK3 ? 'k3Btn' : 'onBtn']: item.id == typeId }">
                {{ item.title }}
              </van-button>
            </div>
          </dd>
        </dl>
      </div>
    </transition>
    <!--弹出框-模式-->
    <div class="popupMode" v-show="modeSwitch" @click="modeShow">
        <ul>
          <li
              v-for="(item, i) in modeTypeList"
              :key="i"
              @click="setModeType(item)"

          >
            <van-button :class="{ onBtn: modeType == item.val }">
              {{ item.title }}
            </van-button>
          </li>
        </ul>
      </div>
    <!--弹出框-玩法-->
    <div class="popupPlay" v-show="playSwitch && !isK3" @click="closeAll">
        <ul>
          <li
              v-for="(item, i) in groupList"
              :key="i"
              @click="handleGroupData(item)"
          >
            <van-button :class="{ onBtn: groupId == item.id }">
              {{ item.groupName }}
            </van-button>
          </li>
        </ul>
        <dl>
          <dt>
            <span>{{ groupData.groupName }}</span>
          </dt>
          <dd
              v-for="(item, i) in playList"
              :key="i"
              @click="handlePlayData(item)"
          >
            <van-button :class="{ onBtn: playId == item.id }">
              {{ item.name }}
            </van-button>
          </dd>
        </dl>
      </div>
    <!--k3弹出框-->
    <transition name="fadeUp">
      <div class="k3Play" v-show="playSwitch && isK3">
        <ul>
          <li
              v-for="(item, i) in k3List(groupList)"
              :key="i"
              :class="{ k3OnBtn: playId == item.id }"
              @click="handlePlayData(item)"
          >
            <p>{{ item.k3Name }}</p>
            <span>赔率{{ item.maxBonusProp }}倍</span>
            <div>
              <i
                  v-for="(child, j) in item.imgList"
                  :key="j"
                  :class="{ jia: child === '+' }"
              >
                <img
                    v-if="child !== '+'"
                    :src="require('../../assets/img/touzi/saizi_' + child + '.png')"
                    alt=""
                />
                <span v-else>{{ child }}</span>
              </i>
            </div>
          </li>
        </ul>
      </div>
    </transition>
    <!--弹出框封盘-->
    <transition name="fadeUp">
      <div class="Seal" v-show="SealFlag">
        <ul v-if="Boolean(awardData.last)">
          <li>
            <h3>温馨提示</h3>
          </li>
          <li>
            <p>{{ periods }}期投注已结束</p>
          </li>
          <li>
            <p>是否清空选号</p>
          </li>
          <li>
            <van-button @click="clearAllSelected">清空选号</van-button>
            <van-button @click="SealFlag = false">继续选号</van-button>
          </li>
        </ul>
      </div>
    </transition>
    <!--loading-->
    <div class="loading" :class="{sK3:isK3}" v-show="loading">
      <van-loading size="50px" color="#fea24d" vertical></van-loading>
      <div>拼命加载中...</div>
    </div>
  </div>
</template>

<script>
  import {
    lotteryAward,
    lotteryGroup,
    lotteryRandom,
    getMessage
  } from "../../api";
  import { mapGetters, mapActions, mapMutations } from "vuex";
  import { modeTypeList, assistantList } from "../../common/data";

  const AwardNormal = () => import("@/components/award/AwardNormal");
  const AwardSix = () => import("@/components/award/AwardSix");
  const AwardPk10 = () => import("@/components/award/AwardPk10");
  const AwardK3 = () => import("@/components/award/AwardK3");
  const AwardXy28 = () => import("@/components/award/AwardXy28");
  const AwardKl10 = () => import("@/components/award/AwardKl10");
  const BetOfficial = () => import("../lotteryFrame/BetOfficial");
  const BetTradition = () => import("../lotteryFrame/BetTradition");
  const BetSix = () => import("../lotteryFrame/BetSix");

  export default {
    name: "Bet",
    components: {
      AwardNormal,
      AwardSix,
      AwardPk10,
      AwardK3,
      AwardXy28,
      AwardKl10,
      BetOfficial,
      BetTradition,
      BetSix
    },
    data() {
      return {
        /* 静态数据 */
        assistantList, // 助手列表
        modeTypeList, // 模式列表
        /* 显示/隐藏开关 */
        assistantSwitch: false, // 助手
        gameSwitch: false, // 彩种下拉
        modeSwitch: false, // 官方传统下拉框
        playSwitch: false, // 游戏玩法下拉框
        SealFlag: false, // 封单
        /* 索引ID */
        gameType: 1, // 游戏类型
        typeId: this.$route.params.id, // 彩种ID
        modeType: this.$route.query.modeType || 1, // 玩法模式
        /* 动态数据 */
        buy: "购买",
        buyFlag: true,
        allGroupList: [], // 玩法列表，官方+传统，需过滤
        betTimer: null, //未开奖定时器
        timer: null, //封盘定时器
        awardTemplates: "",
        msg: "",
        msgTimer: null,
        loading: true
      }
    },
    computed: {
      ...mapGetters([
        "userInfo",
        "lotteryData",
        "groupData",
        "playData",
        "awardData",
        "awardNext",
        "count",
        "amount",
        "cartCount",
        "isRun",
        "musicFlag",
        "oldCodeList",
        "lotteryList"
      ]),
      gameDataList() {
        for (let i in this.lotteryList) {
          if (this.lotteryList[i].gameType == this.gameType) {
            return this.lotteryList[i].gameData;
          }
        }
        return [];
      },
      modeTypeTitle() {
        for (let i in this.modeTypeList) {
          if (this.modeTypeList[i].val == this.modeType) {
            return this.modeTypeList[i].title;
          }
        }
        return "-";
      },
      groupList() {
        return this.allGroupList.filter(item => {
          return this.modeType == item.modeType;
        });
      },
      playList() {
        for (let i in this.groupList) {
          if (this.groupList[i].id == this.groupId) {
            return this.groupList[i].play;
          }
        }
        return [];
      },
      groupId() {
        return this.groupData.id || 0;
      },
      playId() {
        return this.playData.id || 0;
      },
      betTemplate() {
        if (
          this.lotteryData.classify === 11 ||
          this.lotteryData.classify === 10
        ) {
          return "BetSix"; // 六合彩
        }
        if (this.modeType == 1) {
          return "BetTradition"; // modeType=1 传统
        } else {
          return "BetOfficial"; // modeType=0 官方
        }
      },
      isSix() {
        return this.lotteryData.classify == 10 || this.lotteryData.classify == 11;
      },
      isSpecial() {
        // 特殊
        let playId = this.playData.id;
        let groupId = this.groupData.id;
        return groupId == 139 || groupId == 140 || playId == 345;
      },
      noCart() {
        return (
          this.lotteryData.classify == 10 ||
          this.lotteryData.classify == 11 ||
          this.modeType == 1
        );
      },
      isK3() {
        return this.$route.params.classify == 9;
      },
      periods() {
        return this.awardData.last[0].actionNo || "";
      },
      num() {
        if (this.isK3) {
          return "50";
        } else {
          return "5";
        }
      }
    },
    watch: {
      $route(to, from) {
        if (to.params.id !== from.params.id) {
          this.getLotteryGroup();
          this.getLotteryAward();
        }
      },
      /* 彩种分类重置到当前彩种所属分类 */
      gameSwitch(boolean) {
        if (boolean) {
          this.resetGameType();
        }
      },
      awardData(newVal) {
        console.log(newVal);
        if (newVal.last && newVal.last[0].data) {
          clearInterval(this.betTimer);
        } else {
          if (!this.betTimer) {
            this.betTimer = setInterval(() => {
              // console.log("未开奖持续请求");
              this.getLotteryAward();
            }, 5000);
          }
        }
      },
      playList(newVal) {
        if (newVal.length < 2) {
          this.closeAll();
        }
      }
    },
    created() {
      /* step1:获取玩法列表 */
      this.getLotteryGroup();
      /* step2:获取开奖倒计时 */
      this.getLotteryAward();
      /* step4:获取系统返点 */
      this.setSysRebates();
      /* 倒计时模板切换 */
      this.awardTemplate();
      /*实时消息*/
      // this.getMessages();
    },
    beforeDestroy() {
      clearInterval(this.betTimer);
      clearInterval(this.timer);
      clearInterval(this.msgTimer);
      this.betTimer = null;
      this.timer = null;
    },
    methods: {
      ...mapMutations([
        "CHANGE_IS_RUN",
        "CLEAR_OLD_CODE"
      ]),
      ...mapActions([
        "checkedLogin",
        "setSysRebates",
        /* lottery */
        "setLotteryData",
        "setGroupData",
        "setPlayData",
        "setAwardData",
        "setSysRebates",
        /* bet */
        "clearBetCode",
        /* cart */
        "clearCartCode"
      ]),
      /* 玩法列表 */
      getLotteryGroup() {
        // 初始化数据
        this.loading = true;
        this.setGroupData({});
        this.setPlayData({});
        this.setAwardData({});
        console.log(this.playData,this.groupData,"getLotteryGroup-------11111111111111111111");
        lotteryGroup({ typeId: this.typeId }).then(res => {
          if (res.status) {
            this.loading = false;
            this.allGroupList = res.data.group;
            if (res.data.lottery.isDoubleMode) {
              this.modeType = 1;
              if (this.$route.query.modeType) {
                this.modeType = this.$route.query.modeType;
              }
            } else {
              this.modeType = 0;
            }
            this.setLotteryData(res.data.lottery);
            this.resetGameType();
            if (this.$route.query.groupId && this.$route.query.playId) {
              for (let i =0;i<this.groupList.length;i++) {
                let groupItem = this.groupList[i];
                if(groupItem.id == this.$route.query.groupId) {
                  this.setGroupData(this.groupList[i]);
                  for(let j =0;j<this.playList.length;j++) {
                    let playItem = this.playList[j];
                    if(playItem.id == this.$route.query.playId) {
                      this.setPlayData(this.playList[j]);
                      return false;
                    }
                  }
                }
              }
            } else {
              this.setGroupData(this.groupList[0]);
              this.setPlayData(this.playList[0]);
            }
          }
        });
      },
      /* 开奖倒计时 */
      getLotteryAward() {
        lotteryAward({ typeId: this.$route.params.id, num: this.num }).then(
          res => {
            console.log(res, "开奖信息-----------------");
            if (res.status) {
              this.setAwardData(res.data);
            }
          }
        );
      },
      /* 倒计时模板切换 */
      awardTemplate() {
        switch (Number(this.$route.params.classify)) {
          case 4:
            this.awardTemplates = "AwardKl10";
            break;
          case 6:
          case 12: // PK10
            this.awardTemplates = "AwardPk10";
            break;
          case 9: // 快3
            this.awardTemplates = "AwardK3";
            break;
          case 10: // 幸运28
            this.awardTemplates = "AwardXy28";
            break;
          case 11: // 六合彩
            this.awardTemplates = "AwardSix";
            break;
          default:
            this.awardTemplates = "AwardNormal";
            break;
        }
      },
      /* 六合彩走势图判断 */
      assistantArr(data) {
        let Arr = [];
        for (let i = 0; i < data.length; i++) {
          if (this.lotteryData.classify === 11) {
            if (i !== 1) {
              Arr.push(data[i]);
            }
          } else {
            Arr.push(data[i]);
          }
        }
        return Arr;
      },
      /* 倒计时结束 */
      timeOver(time) {
        clearInterval(this.timer);
        if (this.count) {
          this.SealFlag = true;
        }
        if (time > 0) {
          if (this.musicFlag) {
            setTimeout(() => {
              this.playAudio();
            }, 0);
          }
          this.timer = setInterval(() => {
            time--;
            this.buy = "封单(" + time + "S)";
            this.buyFlag = false;
            if (time <= 0) {
              this.pauseAudio();
              this.getLotteryAward();
              clearInterval(this.timer);
              this.buy = "购买";
              this.buyFlag = true;
              this.SealFlag = false;
            }
          }, 1000);
        }
      },
      /* 随机选号 */
      handleRandom() {
        if(!this.$store.getters.awardData.last) return this.$toast("该彩种维护中...");
        let tplVm = this.$refs.betTemplate.$refs.childTemplate;
        lotteryRandom({ playId: this.playId }).then(res => {
          if (res.status) {
            tplVm.randomCode2Selected(res.data.actionData, tplVm.titleList);
          } else {
            this.$toast(res.msg);
          }
        });
      },
      /* 购买 */
      handleBet() {
        if(!this.$store.getters.awardData.last) return this.$toast("该彩种维护中...");
        if (!this.userInfo) {
          return this.$router.push({
            path: "/login",
            query: { redirect: this.$router.currentRoute.fullPath }
          });
        }
        if (!this.buyFlag) {
          return this.$toast({
            message: "封单中",
            position: "middle"
          });
        }
        if (!this.count) {
          return this.$toast({
            message: "还未选号",
            position: "middle"
          });
        }
        if (this.playData.maxCount && this.count > this.playData.maxCount) {
          return this.$toast({
            message:
              `投注不符合规则! [` +
              this.playData.name +
              `] 玩法最高注数 [` +
              this.playData.maxCount +
              `注]`,
            position: "middle"
          });
        }
        let tplVm = this.$refs.betTemplate.$refs.childTemplate;
        if (this.isSix && !this.isSpecial) {
          tplVm.addBetSixCode();
        } else {
          tplVm.addBetCode();
        }
        this.pauseAudio();
        return this.$router.push({
          name: "confirmpurchase",
          params: { id: this.typeId, classify: this.$route.params.classify },
          query: { modeType: this.modeType }
        });
      },
      /* 清空全部选号 */
      clearAllSelected() {
        let tplVm = this.$refs.betTemplate.$refs.childTemplate;
        tplVm.initSelected();
        this.SealFlag = false;
      },
      /* 玩法外层 */
      handleGroupData(obj, e) {
        this.clearAllSelected();
        this.CLEAR_OLD_CODE([]);
        e = window.event || e;
        e.stopPropagation();
        this.$router.replace({
          name: "bet",
          query: {
            modeType: this.$route.query.modeType,
            groupId: obj.id,
            playId: obj.play[0].id,
            title: this.$route.query.title
          }
        });
        this.setGroupData(obj);
        this.setPlayData(this.playList[0]);
      },
      /* 玩法内层 */
      handlePlayData(obj) {
        this.clearAllSelected();
        this.CLEAR_OLD_CODE([]);
        this.$router.replace({
          name: "bet",
          query: {
            modeType: this.$route.query.modeType,
            groupId: this.isK3 ? obj.groupId : this.$route.query.groupId,
            playId: obj.id,
            title: this.$route.query.title
          }
        });
        if (this.isK3) {
          this.setGroupData({ id: obj.groupId });
        }
        this.setPlayData(obj);
        this.playShow();
      },
      /* 重置头部彩种集合gameType */
      resetGameType() {
        switch (this.lotteryData.classify) {
          case 1:
          case 5:
            this.gameType = 1;
            break;
          case 2:
            this.gameType = 2;
            break;
          case 6:
          case 12:
            this.gameType = 3;
            break;
          case 9:
            this.gameType = 4;
            break;
          case 11:
            this.gameType = 5;
            break;
          default:
            this.gameType = 6;
            break;
        }
      },
      /* 助手显示/隐藏 */
      assistantShow() {
        let isShow = this.assistantSwitch;
        this.closeAll();
        this.assistantSwitch = !isShow;
      },
      /* 彩种显示/隐藏 */
      gameShow() {
        let isShow = this.gameSwitch;
        this.closeAll();
        this.gameSwitch = !isShow;
      },
      /* 模式显示 */
      modeShow() {
        let isShow = this.modeSwitch;
        this.closeAll();
        this.modeSwitch = !isShow;
      },
      /* 玩法显示 */
      playShow() {
        let isShow = this.playSwitch;
        this.closeAll();
        this.playSwitch = !isShow;
      },
      /* 切换游戏分类列表 */
      changeGameList(gameType) {
        console.log(gameType);
        this.gameType = gameType;
      },
      /* 设置玩法模式 */
      setModeType(item) {
        this.CLEAR_OLD_CODE([]);
        this.$router.push({
          name: "bet",
          query: { modeType: item.val, title: this.$route.query.title }
        });
        this.modeType = item.val;
        this.setGroupData(this.groupList[0]);
        this.setPlayData(this.playList[0]);
      },
      /* 头部切换游戏 */
      choose(id, classify, title) {
        this.pauseAudio();
        this.clearAllSelected();
        this.CLEAR_OLD_CODE([]);
        clearInterval(this.betTimer);
        clearInterval(this.timer);
        this.betTimer = null;
        this.timer = null;
        // let that = this;
        this.$router.replace({
          name: "bet",
          params: { id: id, classify: classify },
          query: { title: title }
        });
        this.awardTemplate();
        this.clearCartCode();
        this.buy = "购买";
        this.buyFlag = true;
        this.typeId = id;
        this.gameSwitch = false;
        this.resetGameType();
      },
      /* 全部关闭 */
      closeAll(e) {
        e = window.event || e;
        e.stopPropagation();
        this.assistantSwitch = false; // 助手
        this.gameSwitch = false; // 彩种下拉
        this.modeSwitch = false; // 官方传统下拉框
        this.playSwitch = false; // 游戏玩法下拉框
      },
      /* K3选项调整 */
      k3List(list) {
        let titleList = [];
        let imgList = [];
        for (let i = 0; i < list.length; i++) {
          let listOne = list[i];
          let startTitle = listOne.groupName;
          let groupId = listOne.id;
          let childTitle = "";
          let bonusProp = "";
          let bonusPropArr = [];
          for (let j = 0; j < listOne.play.length; j++) {
            let child = listOne["play"][j];
            childTitle = child.name;
            bonusProp = child.bonusProp;
            if (startTitle == childTitle) {
              childTitle = "";
            } else {
              childTitle = "-" + childTitle;
            }
            if (child.options) {
              for (let i in child.options) {
                bonusPropArr.push(child.options[i].bonusProp);
              }
              bonusPropArr.sort((a, b) => {
                return b - a;
              });
              if (bonusPropArr[0] !== bonusPropArr[bonusPropArr.length - 1]) {
                bonusProp =
                  bonusPropArr[bonusPropArr.length - 1] + "~" + bonusPropArr[0];
              } else {
                bonusProp = bonusPropArr[0];
              }
            }
            switch (startTitle + childTitle) {
              case "大小单双":
                imgList = ["01", "+", "03", "+", "05"];
                break;
              case "和值":
                imgList = ["01", "+", "01", "+", "01"];
                break;
              case "三连号-通选":
                imgList = ["01", "+", "02", "+", "03"];
                break;
              case "三同号-通选":
                imgList = ["01", "+", "01", "+", "01"];
                break;
              case "三同号-单选":
                imgList = ["01", "+", "01", "+", "01"];
                break;
              case "三不同号-标准":
                imgList = ["04", "+", "05", "+", "06"];
                break;
              case "三不同号-胆拖":
                imgList = ["02", "+", "04", "+", "06"];
                break;
              case "二同号-复选":
                imgList = ["01", "+", "01", "+", "06"];
                break;
              case "二同号-单选":
                imgList = ["01", "+", "01", "+", "06"];
                break;
              case "二不同号-标准":
                imgList = ["01", "+", "04", "+", "04"];
                break;
              case "二不同号-胆拖":
                imgList = ["01", "+", "04", "+", "04"];
                break;
            }
            titleList.push({
              k3Name: startTitle + childTitle,
              maxBonusProp: bonusProp,
              imgList: imgList,
              groupId: groupId,
              ...child
            });
          }
        }
        return titleList;
      },
      /* 返回 */
      goBack() {
        this.pauseAudio();
        this.$router.push({ name: "hall" });
        this.clearAllSelected();
        this.CLEAR_OLD_CODE([]);
      },
      /* 购物车 */
      goCart() {
        if(!this.$store.getters.awardData.last) return this.$toast("该彩种维护中...");
        this.$router.push({ name: 'cart', params: { id: this.lotteryData.id } });
      },
      /*页面内通知*/
      getMessages() {
        let timers;
        if (this.userInfo) {
          this.msgTimer = setInterval(() => {
            getMessage().then(res => {
              let num = 0;
              // console.log(res, "页面通知-----------------------------");
              if (res.data.msg) {
                this.msg = res.data.msg["0"].content;
                this.$refs.msg.className = "showMsg";
                timers = setInterval(() => {
                  num++;
                  if (num >= 3) {
                    this.$refs.msg.className = "";
                    clearInterval(timers);
                  }
                }, 1000);
              } else {
                clearInterval(timers);
              }
            });
          }, 10000);
        } else {
          clearInterval(this.msgTimer);
        }
      }
    }
  };
</script>
<style scoped lang="less">
  .body {
    text-align: center;
    height: 100%;
    &.k3Bg {
      background-color: #0e7347;
    }
    .k3Common {
      background: #22563f !important;
      border: 0 !important;
      div {
        border: none !important;
      }
    }
    .top {
      color: #333;
      height: 100px;
      background: #fff;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;

      .back {
        float: left;
        margin-left: 16px;
        padding: 0 10px;
        font-size: 46px;
        text-align: left;
        line-height: 100px;
        cursor: pointer;
      }

      div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        line-height: 100px;

        span {
          font-size: 42px;
        }

        i {
          font-size: 25px;
          margin-left: 10px;
        }
      }

      ul {
        width: 180px;
        float: right;

        li {
          float: left;
          height: 100px;
          line-height: 100px;

          i {
            font-size: 50px;
          }
        }

        li:first-child {
          position: relative;

          .car {
            color: #333;
          }

          span {
            position: absolute;
            width: 40px;
            height: 40px;
            background-color: red;
            border-radius: 50%;
            top: 12px;
            right: -15px;
            line-height: 40px;
            text-align: center;
            color: white;
          }
        }

        li:nth-child(2) {
          margin-left: 50px;
          position: absolute;
          right: 25px;

          a {
            display: block;
            color: white;
          }

          dl {
            background-color: #5c5b57;
            position: absolute;
            top: 100px;
            left: -210px;
            width: 282px;
            border-radius: 15px;

            dt {
              position: absolute;
              top: -30px;
              right: 32px;
              width: 0;
              height: 0;
              border: 15px solid transparent;
              border-bottom-color: #5c5b57;
            }

            dd {
              overflow: hidden;
              text-align: left;

              b {
                font-size: 38px;
                font-weight: normal;
                float: left;
                margin: 0 28px 0 26px;
              }

              span {
                display: block;
                font-size: 29px;
                border-bottom: 1px solid #8b8d8c;
                overflow: hidden;
              }
            }

            dd:last-child {
              span {
                border: none;
              }
            }
          }
        }
      }
    }
    .playMode {
      position: fixed;
      top: 100px;
      width: 100%;
      z-index: 999;
      height: 75px;
      background: @Amount-Right-Btn;
      border-top: 1px solid #f0f0f0;
      div {
        float: left;
        width: 49.69%;
        height: 75px;
        color: white;
        text-align: center;
        line-height: 75px;
        font-size: 30px;
        border-right: 1px solid #eee; /*no*/
        position: relative;
        i {
          margin-left: 10px;
        }
      }
      div:last-child {
        border-right: 0;
      }
    }
    .playModeSix {
      position: fixed;
      top: 100px;
      width: 100%;
      z-index: 999;
      height: 75px;
      background: @Amount-Right-Btn;
      border-top: 1px solid #f0f0f0;
      span {
        line-height: 75px;
        color: white;
        font-size: 32px;
        i {
          margin-left: 10px;
        }
      }
    }
    /*.popupShow {*/
    /*  height: 100% !important;*/
    /*}*/
    .popupMode {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      margin-top: 175px;
      ul {
        width: 100%;
        height: 122px;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        justify-content: space-around;
        align-items: center;
        li {
          width: 186px;
          height: 46px;
          line-height: 46px;
          .van-button {
            width: 100%;
            height: 100%;
            text-align: center;
            border: 1px solid #dfdcda; /*no*/
            border-radius: 10px;
            font-size: 28px;
          }
        }
      }
    }
    .popupPlay {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      margin-top: 175px;
      ul {
        background-color: #fff;
        overflow: hidden;
        padding: 23px 20px 36px;
        display: flex;
        flex-wrap: wrap;
        li {
          .van-button {
            width: 160px;
            height: 72px;
            line-height: 72px;
            border-radius: 10px;
            border: 1px solid #dfdcda; /*no*/
            margin-top: 20px;
            margin-left: 12px;
            font-size: 28px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      dl {
        overflow: hidden;
        background-color: #fff;
        padding-bottom: 20px;
        dt {
          span {
            display: flex;
            text-indent: 50px;
            margin: 10px auto;
            width: 91%;
          }
          span::after,
          span::before {
            border-top: 1px solid #dfdcda; /*no*/
            content: "";
            flex: 1;
            position: relative;
            top: 15px;
          }
        }
        dd {
          .van-button {
            font-size: 28px;
            width: 160px;
            height: 72px;
            line-height: 72px;
            border-radius: 10px;
            border: 1px solid #dfdcda; /*no*/
            float: left;
            margin-top: 20px;
            margin-left: 12px;
            overflow: hidden;
          }
          &:nth-of-type(4n + 1) {
            .van-button {
              margin-left: 35px;
            }
          }
        }
      }
    }
    .k3Play {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #22563f;
      margin-top: 175px;
      border-top: 1px solid #0e7347; /*no*/
      z-index: 99;

      ul {
        overflow: hidden;
        li {
          overflow: hidden;
          width: 200px;
          height: 200px;
          float: left;
          margin-left: 35px;
          margin-top: 33px;
          border: 1px solid rgba(255, 255, 255, 0.3); /*no*/
          &.k3OnBtn {
            border-color: #ee6600;
          }
          p {
            color: white;
            margin-top: 23px;
            line-height: 46px;
            font-size: 27px;
          }
          span {
            line-height: 47px;
            font-size: 23px;
            white-space: nowrap;
            color: #989a99;
          }
          div {
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            padding: 0 15px;
            margin-top: 20px;
            i {
              height: 40px;
              width: 40px;
              font-style: normal;
              img {
                width: 100%;
                height: 100%;
              }
              span {
                line-height: 40px;
                font-weight: bold;
              }
            }
            .jia {
              width: 15px;
              height: 40px;
              text-align: center;
            }
          }
        }
      }
    }
    .popups {
      background-color: white;
      width: 100%;
      position: fixed;
      top: 0;
      margin-top: 100px;
      overflow: hidden;
      transition: 0.3s;
      z-index: 999;
      box-sizing: border-box;
      border-top: 1px solid #f0f0f0;
      height: 100%;
      ul {
        width: 148px;
        background-color: #f2f0f3;
        height: 100%;
        float: left;
        li {
          height: 102px;
          line-height: 102px;
          font-size: 27px;
          text-align: center;
          .van-button {
            width: 100%;
            height: 100%;
            background-color: #f2f0f3;
            &.on {
              background-color: white;
            }
          }
        }

      }

      dl {
        overflow: hidden;

        dd {
          display: flex;
          flex-wrap: wrap;
          div {
            margin-top: 16px;
            margin-left: 22px;
            border-radius: 10px;
            overflow: hidden;
            border: 1px solid #dfdcda; /*no*/
            box-sizing: border-box;
            .van-button {
              width: 168px;
              height: 72px;
              line-height: 72px;
              font-size: 27px;
              overflow: hidden;
              span {
                color: #999;
              }
              &.k3Btn {
                background-color: #22563f;
                span {
                  color: #fff;
                }
              }
            }
          }
        }
        .show {
          display: block;
        }
      }
    }
    .bet-content {
      padding: 100px 0 104px;
      .msg {
        padding-top: 75px;
        text-align: left;
        p {
          line-height: 70px;
          height: 0;
          font-size: 29px;
          padding-left: 30px;
          background-color: rgba(167, 167, 167, 0.7);
          color: #fff;
          transition: 0.3s;
        }
        .showMsg {
          height: 70px;
        }
      }
    }
    .footer {
      width: 100%;
      height: 104px;
      background-color: #3d3d3d;
      border-top: 1px solid #545454; /*no*/
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: nowrap;
      position: fixed;
      bottom: 0;

      .van-button {
        flex: 0 0 auto;
        display: inline-block;
        width: 190px;
        color: white;
        font-size: 35px;
        text-align: center;
        height: 90px;
        line-height: 90px;
        border-radius: 10px;
      }

      .buy {
        width: 300px;
        background: @Amount-Right-Btn;
      }
      .buyBig {
        width: 500px !important;
        transition: 0.3s;
        background: @Amount-Right-Btn;
      }
      .NoUser {
        height: 60px !important;
      }
      .footerFixed {
        height: 100px;
        position: absolute;
        bottom: 100px;
        background-color: rgba(0, 0, 0, 0.6);
        width: 100%;

        .left {
          width: 50%;
          height: 100%;
          float: left;
          text-align: left;
          margin-left: 18px;
          h3 {
            margin-top: 10px;
            font-size: 27px;
            color: white;
            margin-bottom: 5px;
          }
          p {
            color: @ThemeColor;
            font-size: 28px;
            line-height: 40px;
          }
        }
        .right {
          float: right;
          width: 40%;
          height: 100%;
          line-height: 104px;
          a {
            display: block;
            text-align: center;
            width: 100%;
            height: 100%;
            color: #d97b21;
            font-size: 26px;
          }
        }
      }
    }
    .loading {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      z-index: 10000;
      &.sK3 {
        color: #fff;
      }
      .van-loading {
        display: inline-block;
        margin-bottom: 15px;
      }
    }
  }
</style>
