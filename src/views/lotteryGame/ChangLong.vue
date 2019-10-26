<template>
  <div class="changLong" v-title="'长龙助手'">
    <Header title="长龙助手" rightI="&#xe61c;" rightTo="/changlonglegend"></Header>
    <div class="changLongContent">
      <van-tabs v-model="changLongActive" :sticky="true" swipeable>
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-tab title="最新长龙">
            <div v-if="!changLongArr.length" class="load">
              <van-loading size="50px" color="#fea24d" vertical></van-loading>
              <div>拼命加载中...</div>
            </div>
            <ul v-else class="changLong-list">
              <li v-for="(item, i) in changLongArr" :key="i">
                <div>
                  <img v-lazy="item.img" />
                </div>
                <div>
                  <h3>{{ item.title }}</h3>
                  <p>
                    <span>{{ item.actionNo }}</span>
                    <Timer
                        :time="item.endTime - item.nowTime"
                        :typeId="item.typeId"
                        @changLongTimeOver="changLongTimeOver"
                    ></Timer>
                  </p>
                  <p>
                <span>{{ item.weiTitle }}</span
                ><span :class="item.className">{{ item.weiName }}</span
                  ><span>{{ item.weiNum }}期</span>
                  </p>
                </div>
                <div :class="{ disable: disableId.indexOf(item.typeId) >= 0 }">
                  <b
                      v-for="(child, j) in item.items"
                      :key="j"
                      @click="
                  selecting(
                    j,
                    item.id,
                    item.data_ftime,
                    child.actionData,
                    child.bonusProp,
                    item.playedGroupId,
                    item.playedId,
                    item.typeId,
                    item.actionNo,
                    item.endTime,
                    item.title
                  )
                "
                      :class="{
                  onBtn: isOn.indexOf(item.id) >= 0 && isOn.indexOf(j) >= 0
                }"
                  >
                    <p>{{ child.name }}</p>
                    <span>赔率{{ child.bonusProp }}</span>
                  </b>
                </div>
              </li>
            </ul>
          </van-tab>
          <van-tab title="我的投注">
            <div v-if="!lotteryArr.length && !noData" class="load">
              <van-loading size="50px" color="#fea24d" vertical></van-loading>
              <div>拼命加载中...</div>
            </div>
            <ul class="record"  v-else>
              <li v-for="(item, i) in lotteryArr" :key="i">
                <router-link
                    :to="{
                name: 'lotterydetails',
                params: { classify: item.classify },
                query: { id: item.id }
              }"
                >
                  <div>
                    <p>{{ item.title }}<b v-show="item.zhuihao">追</b></p>
                    <span>第{{ item.actionNo }}期</span>
                  </div>
                  <div>
                    <p>{{ item.amount }}元</p>
                    <span :class="{ WinningColor: item.status === 21 }">{{
                  item.info
                }}</span>
                  </div>
                  <i class="iconfont">&#xe727;</i>
                </router-link>
              </li>
            </ul>
            <div class="lookMore" v-if="lotteryArr.length">更多记录请到<router-link to="/record">投注记录</router-link>查看</div>
            <div v-if="noData" class="noData">
              <div class="content_box">
                <div>
                  <p><img :src="commonImg('default/noData.png')" alt="记录为空" /></p>
                  <h4>您的游戏记录是空的噢！</h4>
                  <p>"赶紧去买几注，今天您的运气很好！！！"</p>
                </div>
              </div>
            </div>
          </van-tab>
        </van-pull-refresh>
      </van-tabs>
    </div>
    <div class="footer" v-show="changLongActive < 1">
      <div>
        <span @click="[isOn = [],code.beiShu = '']">清空</span>
        <span>共{{ code.actionNum || 0 }}注，</span>
        <span>最高可中{{ (code.beiShu * code.bonusProp).toFixed(2) }}元</span>
      </div>
      <div @click="buy">
        马上投注
      </div>
      <div v-show="code.actionNum">
        <span>每注金额</span>
        <input type="text" maxlength="7" v-model="code.beiShu" />
        元，请输入要投注的金额
      </div>
    </div>
    <div class="Popup" v-if="popupFlag">
      <ul>
        <li class="iconfont" style="color: #58d70a;font-size: 120px">
          &#xe62c;
        </li>
        <li>
          <span style="color: #666666">下注成功</span>
          <div style="color: #999999;font-size: 16px;margin-top: 2%;">
            <p>{{ lotteryTitle }}第{{ para.actionNo }}期</p>
            <p>投注金额：{{ code.beiShu }}元</p>
          </div>
        </li>
        <li>
          <van-button style="color: #666666" @click="goRecord"
            >查看记录</van-button
          >
          <van-button @click="initData" class="onBtn">继续购彩</van-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { changLongList, lotteryBuy, lotteryRecord } from "../../api";
import { mapGetters } from "vuex";
const TabList = [
  {
    title: "最新长龙",
    type: "cl"
  },
  {
    title: "我的投注",
    type: "my"
  }
];
export default {
  name: "Changlong",
  data() {
    return {
      TabList,
      isLoading: false,
      changLongActive: sessionStorage.getItem("changLongIndex") * 1 || 0,
      changLongArr: [],
      time: [],
      changLongArrTimer: null,
      isOn: [],
      popupFlag: false,
      lotteryTitle: "",
      disableId: [],
      code: {
        actionData: "",
        actionNum: "",
        beiShu: "",
        bonusProp: "",
        fanDian: 0,
        mode: 1,
        orderId: "",
        playedGroup: "",
        playedId: "",
        type: "",
        weiShu: 0
      },
      para: {
        actionNo: "",
        kjTime: "",
        type: ""
      },
      parameter: {
        pageSize: 20,
        offset: 0,
        status: 0,
        timeType: 0,
        typeId: 0
      },
      lotteryArr: [],
      noData: false,
      loading: false
    };
  },
  created() {
    if (this.changLongActive > 0) {
      this.parameter.offset = 0;
      this.loading = false;
      this.lotteryRecords();
    } else {
      if (!this.changLongArr.length) {
        this.initChangLongList();
        this.clearChangLongArrTimer();
        this.changLongArrTimer = setInterval(() => {
          this.initChangLongList();
        }, 10000);
      }
    }
  },
  destroyed() {
    this.clearChangLongArrTimer();
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    isOn(newVal) {
      if (newVal.length) {
        this.code.actionNum = 1;
      } else {
        this.code.actionNum = 0;
      }
    },
    changLongActive(newVal) {
      console.log(newVal,"长龙");
      sessionStorage.setItem("changLongIndex",newVal);
      if (newVal > 0) {
        this.parameter.offset = 0;
        this.loading = false;
        this.lotteryRecords();
      } else {
        if (!this.changLongArr.length) {
          this.initChangLongList();
          this.clearChangLongArrTimer();
          this.changLongArrTimer = setInterval(() => {
            this.initChangLongList();
          }, 10000);
        }
      }
    },
  },
  methods: {
    goRecord() {
      this.changLongActive = 1;
      this.initData()
    },
    onRefresh() {
      if(this.changLongActive > 0) {
        new Promise(resolve => {
          console.log(this);
          lotteryRecord(this.parameter).then(res => {
            this.isLoading = false;
            if(res.status) {
              this.lotteryArr = res.data;
              resolve(res.data);
              if (!this.lotteryArr.length) {
                this.noData = true;
              } else {
                this.noData = false;
              }
            }
          });
        }).then(res=> {
          if (res.length) {
            this.$toast("刷新成功");
          } else {
            this.$toast("暂无更多数据");
          }
          this.isLoading = false;
        })
      }else {
        this.clearChangLongArrTimer();
        changLongList().then(res => {
          this.isLoading = false;
          if (res.status) {
            this.disableId = [];
            this.changLongArr = res.data;
          }
          this.$toast("刷新成功")
        });
        this.changLongArrTimer = setInterval(() => {
          this.initChangLongList();
        }, 10000);
      }
    },
    initChangLongList() {
      changLongList().then(res => {
        if (res.status) {
          this.disableId = [];
          this.changLongArr = res.data;
        }
      });
    },
    lotteryRecords() {
      lotteryRecord(this.parameter).then(res => {
        if(res.status) {
          this.lotteryArr = res.data;
          if (!this.lotteryArr.length) {
            this.noData = true;
          } else {
            this.noData = false;
          }
        }
      });
    },
    changLongTimeOver(typeId) {
      if (this.disableId.indexOf(typeId) <= 0) {
        this.disableId.push(typeId);
      }
      if (this.code.type == typeId) {
        this.initData();
        this.isOn = [];
      }
    },
    selecting(
      j,
      id,
      data_ftime,
      actionData,
      bonusProp,
      playedGroup,
      playedId,
      typeId,
      actionNo,
      endTime,
      title
    ) {
      if (this.disableId.indexOf(typeId) >= 0) {
        this.$toast("该玩法在封单中哦");
      } else {
        if (this.isOn.indexOf(id) >= 0 && this.isOn.indexOf(j) >= 0) {
          this.initData();
          this.isOn = [];
        } else {
          this.isOn = [id, j];
          this.lotteryTitle = title;
          this.code.actionData = actionData;
          this.code.bonusProp = bonusProp;
          this.code.orderId = parseInt(new Date() - 2147486647 * 623);
          this.code.playedGroup = playedGroup;
          this.code.playedId = playedId;
          this.code.type = typeId;
          this.para.type = typeId;
          this.para.actionNo = actionNo;
          this.para.kjTime = endTime * 1 + data_ftime * 1;
        }
      }
    },
    buy() {
      if (!this.code.beiShu) {
        return this.$toast("请输入投注金额");
      }
      let code = [];
      code.push(this.code);
      let buyData = {
        code,
        para: { ...this.para },
        is_combine: 0
      };
      lotteryBuy(buyData).then(res => {
        if (res.status) {
          this.popupFlag = true;
          this.isOn = [];
        } else {
          this.$toast(res.msg);
        }
      });
    },
    initData() {
      /* 初始化数据 */
      this.popupFlag = false;
      this.code = {
        actionData: "",
        actionNum: "",
        beiShu: "",
        bonusProp: "",
        fanDian: 0,
        mode: 1,
        orderId: "",
        playedGroup: "",
        playedId: "",
        type: "",
        weiShu: 0
      };
      this.para = {
        actionNo: "",
        kjTime: "",
        type: ""
      };
    },
    clearChangLongArrTimer() {
      clearInterval(this.changLongArrTimer);
      this.changLongArrTimer = null;
    }
  }
};
</script>

<style scoped lang="less">
.changLong {
  text-align: center;
  .top {
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 42px;
    color: #333;
    background: #fff;
    /*border-bottom: 1px solid #f0f0f0;*/
    i {
      &:first-child {
        position: absolute;
        left: 16px;
        font-size: 46px;
        padding: 0 10px;
      }
      &:last-child {
        position: absolute;
        right: 20px;
        font-size: 45px;
      }
    }
    span {
      color: white;
      font-weight: normal;
      position: absolute;
      right: 25px;
      font-size: 30px;
    }
  }
  .changLongContent {
    .changLong-list {
      li {
        background-color: #fff;
        overflow: hidden;
        margin: 20px;
        text-align: left;
        box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
        border-radius: 10px;
        position: relative;
        border: 1px solid #f0f0f0;
        &:last-child {
          margin-bottom: 180px;
        }
        & > div {
          display: inline-block;
          vertical-align: top;
          overflow: hidden;
          &:nth-child(1) {
            width: 100px;
            height: 100px;
            margin: 20px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          &:nth-child(2) {
            h3 {
              font-size: 30px;
              color: #666;
              margin-top: 15px;
            }
            p {
              &:nth-child(2) {
                line-height: 30px;
                span {
                  display: inline-block;
                  overflow: hidden;
                  font-size: 25px;
                  &:nth-child(1) {
                    width: 200px;
                  }
                  &:last-child {
                    color: @ThemeColor;
                  }
                }
              }
              &:nth-child(3) {
                span {
                  margin-right: 5px;
                  padding: 3px 8px;
                  text-align: center;
                  color: #fff;
                  &:nth-child(1) {
                    background-color: #c9c9c9;
                  }
                  &:nth-child(3) {
                    background-color: @red;
                  }
                }
              }
            }
          }
          &:nth-child(3) {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
            b {
              border: 1px solid #ededed; /*no*/
              float: left;
              width: 110px;
              padding: 20px 0;
              text-align: center;
              border-radius: 10px;
              margin-right: 10px;
              vertical-align: middle;
              font-weight: normal;
              overflow: hidden;
              p {
                color: @ThemeColor;
                margin-bottom: 5px;
                white-space: nowrap;
                font-size: 28px;
              }
              span {
                white-space: nowrap;
                color: #989898;
                display: block;
                overflow: hidden;
                transform: scale(0.95);
              }
            }
          }
        }
      }
    }
    .record {
      li {
        overflow: hidden;
        border-bottom: 1px solid #f0f0f0; /*no*/
        position: relative;
        a {
          display: block;
          overflow: hidden;
        }

        div {
          float: left;
          text-align: left;
          padding: 10px 0 10px 20px;

          p {
            line-height: 50px;
            font-size: 30px;

            b {
              display: inline-block;
              font-weight: normal;
              width: 36px;
              height: 36px;
              text-align: center;
              line-height: 36px;
              font-size: 20px;
              color: white;
              background-color: @ThemeColor;
              border-radius: 50%;
              margin-left: 8px;
              vertical-align: middle;
            }
          }

          span {
            color: #999999;
            line-height: 50px;
            font-size: 26px;
          }
        }
        div:nth-child(1) {
          span {
            display: inline-block;
            width: 400px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        div:nth-child(2) {
          padding-left: 0;
          float: right;
          margin-right: 63px;
          text-align: right;
        }

        i {
          position: absolute;
          right: 10px;
          top: 38px;
          font-size: 40px;
          color: #dedddb;
        }
      }
    }
    .lookMore {
      white-space: nowrap;
      font-size: 28px;
      line-height: 80px;
      a {
        display: inline-block;
        color: @Loss;
      }
    }
  }
  .footer {
    position: fixed;
    width: 100%;
    bottom: 0;
    display: flex;
    height: 88px;
    line-height: 88px;
    div {
      float: left;
      height: 100%;
      &:nth-child(1) {
        flex: 1;
        background-color: black;
        span {
          float: left;
          color: #fff;
          font-size: 25px;
          &:first-child {
            color: #ffaf36;
            font-size: 30px;
            margin: 0 20px;
          }
        }
      }
      &:nth-child(2) {
        width: 180px;
        font-size: 28px;
        background: @Amount-Right-Btn;
        color: #fff;
      }
      &:nth-child(3) {
        position: absolute;
        width: 100%;
        height: 70px;
        bottom: 88px;
        background-color: #f9f7e9;
        border-top: 1px solid #ededed;
        line-height: 70px;
        text-align: left;
        color: #666;
        span {
          margin-left: 20px;
        }
        input {
          width: 100px;
          height: 40px;
          border: 1px solid #dfdfdf;
          border-radius: 2px;
          margin: 0 10px;
          text-indent: 8px;
        }
      }
    }
  }
}
</style>
