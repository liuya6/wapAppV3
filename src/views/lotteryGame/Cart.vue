<template>
  <div class="betCart flex" v-title="'购物车'">
    <div class="top">
      <i class="iconfont" @click="back">&#xe629;</i>
      购物车
      <span @click="clearCartCode">清空</span>
      <div v-if="cartCode.length">
        开奖倒计时
        <b>{{ time || "00:00:00" }}</b>
      </div>
    </div>
    <div class="content" v-if="cartCode.length || cartExpired.length">
      <dl class="content_top" v-if="cartCode.length">
        <dt>
          当前期
          <span>{{ awardNext.actionNo }}</span
          >期
        </dt>
        <dd v-for="(item, i) in cartCode" :key="i">
          <div>
            <input
              type="checkbox"
              :id="i"
              :checked.sync="item.selected"
              @change="handleSelected(i, item)"
            />
            <label :for="i"></label>
          </div>
          <div>
            <h3>{{ item.groupPlayName }}</h3>
            <p>{{ item.code }}</p>
            <span>
              <b>{{ item.count }}</b
              >注， 共计 <b>{{ item.amount }}</b
              >元
            </span>
          </div>
          <i class="iconfont" @click="handleDelete(i)">&#xe663;</i>
        </dd>
      </dl>
      <!--过期列表-->
      <dl class="content_btm" v-if="cartExpired.length">
        <dt>已过期</dt>
        <dd v-for="(item, i) in cartExpired" :key="'e' + i">
          <div>
            <input
              type="checkbox"
              :id="'e' + i"
              :checked.sync="item.selected"
              disabled
            />
            <label :for="'e' + i"></label>
          </div>
          <div>
            <h3>{{ item.groupPlayName }}</h3>
            <p>{{ item.code }}</p>
            <span>
              <b>{{ item.count }}</b
              >注，共计 <b>{{ item.amount }}</b
              >元
            </span>
          </div>
          <i class="iconfont" @click="handleDelete(i, true)">&#xe663;</i>
          <span class="change" @click="handleRecover(i, item)">
            改买 当前期
            <b class="iconfont">&#xe682;</b>
          </span>
        </dd>
      </dl>
    </div>
    <div v-if="!cartCode.length && !cartExpired.length" class="noData">
      <div class="content_box">
        <div>
          <p><img :src="commonImg('default/noData.png')" alt="" /></p>
          <h4>您的购物车是空的噢！</h4>
        </div>
      </div>
    </div>
    <div class="footer" v-if="cartCode.length">
      <div>
        <input
          type="checkbox"
          id="all"
          @click="checkedAll"
          :checked="cartCode.length === checkedList.length"
        />
        <label for="all"></label>
        全选
      </div>
      <div>{{ totalCount }}注，合计：{{ cartAmount }}元</div>
      <van-button @click="handleBuy" :class="{ fendan: !buyFlag }" class="onBtn">{{
        buy
      }}</van-button>
    </div>
    <!--封盘提醒-->
    <div class="Seal" v-show="SealFlag">
      <ul>
        <li>
          <h3>温馨提示</h3>
        </li>
        <li>
          <p>{{ awardData.last[0].actionNo }}期投注已结束</p>
        </li>
        <li>
          <p>是否清空选号</p>
        </li>
        <li>
          <van-button @click="clearCart">清空</van-button>
          <van-button @click="SealFlag = false">继续选号</van-button>
        </li>
      </ul>
    </div>
    <!--购买成功提示-->
    <div class="Popup" v-show="popupFlag">
      <ul>
        <li class="iconfont" style="color: #58d70a;font-size: 120px;">
          &#xe62c;
        </li>
        <li>
          <span style="color: #666">下注成功</span>
          <div style="color: #999;font-size: 16px;margin-top: 2%;">
            <p>{{ msgText.title }}第{{ msgText.actionNo }}期</p>
            <p>投注金额：{{ msgText.amount }}元</p>
          </div>
        </li>
        <li>
          <van-button
            @click="
              $router.push({
                name: 'betrecord',
                params: { id: $route.params.id },
                query: { title: lotteryData.title }
              })
            "
            style="color: #666666"
            >查看记录</van-button
          >
          <van-button @click="$router.go(-1)" class="onBtn">继续购彩</van-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { lotteryBuy, lotteryAward } from "../../api";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "Cart",
  data() {
    return {
      typeId: this.$route.params.id,
      time: "",
      SealFlag: false,
      buy: "确认结算",
      buyFlag: true,
      timer: "",
      setTimer: "",
      popupFlag: false,
      checkedList: [],
      msgText: ""
    };
  },
  computed: {
    ...mapGetters([
      /* user.js */
      "userInfo",
      /* lottery.js */
      "lotteryData",
      "groupData",
      "playData",
      "awardNext",
      /* cart.js */
      "cartCode",
      "cartExpired",
      "cartCount",
      "cartAmount",
      "awardData",
      "lotteryData"
    ]),
    totalCount() {
      let count = 0;
      for (let i in this.cartCode) {
        if (this.cartCode[i].selected) {
          count += this.cartCode[i].count;
        }
      }
      return count;
    },
    unselectedCart() {
      return this.cartCode.filter(v => {
        return !v.selected;
      });
    }
  },
  created() {
    this.getLotteryAward();
    this.checkedInitial();
    console.log(this.cartCode);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.setTimer);
  },
  methods: {
    ...mapMutations(["CHANGE_IS_RUN", "CLEAR_OLD_CODE"]),
    ...mapActions([
      /* user */
      "checkedLogin",
      /* cart */
      "setCartCode",
      "addCartCode",
      "deleteCartCode",
      "setCartExpired",
      "addCartExpired",
      "deleteCartExpired",
      "modifyCartItem",
      "clearCartCode",
      "setAwardData"
    ]),
    checkedInitial() {
      for (let i = 0; i < this.cartCode.length; i++) {
        if (this.cartCode[i].selected) {
          this.$set(this.checkedList, i, i);
        }
      }
    },
    checkedAll(e) {
      e = window.event || e;
      let checkedFlag = e.target.checked;
      if (checkedFlag) {
        for (let i = 0; i < this.cartCode.length; i++) {
          this.checkedList[i] = i;
          this.modifyCartItem({
            index: i,
            newValue: {
              selected: true
            }
          });
        }
      } else {
        for (let i = 0; i < this.cartCode.length; i++) {
          this.checkedList = [];
          this.modifyCartItem({
            index: i,
            newValue: {
              selected: false
            }
          });
        }
      }
    },
    clearCart() {
      this.clearCartCode();
      this.SealFlag = false;
    },
    handleSelected(index, item) {
      this.modifyCartItem({
        index: index,
        newValue: {
          selected: !item.selected
        }
      });
      console.log(index);
      let Index = this.checkedList.indexOf(index);
      if (Index >= 0) {
        this.checkedList.splice(Index, 1);
      } else {
        this.checkedList.push(index);
      }
      console.log(this.checkedList);
    },
    handleDelete(index, expired = false) {
      if (expired) {
        this.deleteCartExpired(index);
      } else {
        this.deleteCartCode(index);
      }
      console.log(index, expired, typeof expired, "【handleDelete】");
    },
    handleRecover(index, item) {
      this.addCartCode(item);
      this.deleteCartExpired(index);
    },
    handleExpired() {
      let arr = this.cartExpired.concat(this.cartCode);
      this.setCartExpired(arr);
      this.setCartCode([]);
    },
    handleBuy() {
      if (!this.totalCount) {
        return this.$toast("请选择购买的号码");
      }
      let buyData = {
        code: [],
        para: {
          type: this.lotteryData.id,
          actionNo: this.awardNext.actionNo,
          kjTime: this.awardNext.actionTime
        },
        zhuiHao: "",
        is_combine: 0
      };
      buyData.code = this.buyCodeSplice();
      this.CLEAR_OLD_CODE([]);
      lotteryBuy(buyData).then(res => {
        if (!res.status) {
          return this.$toast({
            message: res.msg,
            position: "middle"
          });
        }
        this.msgText = res.data;
        this.popupFlag = true;
        this.setCartCode(this.unselectedCart);
      });
    },
    getLotteryAward() {
      lotteryAward({ typeId: this.typeId }).then(res => {
        if (res.status) {
          this.setAwardData(res.data);
          this.times();
        }
      });
    },
    timeOver(time) {
      clearInterval(this.timer);
      if (this.cartCount) {
        this.SealFlag = true;
      }
      if (time > 0) {
        this.timer = setInterval(() => {
          time--;
          this.buy = "封单(" + time + "S)";
          this.buyFlag = false;
          if (time <= 0) {
            clearInterval(this.timer);
            this.handleExpired();
            this.getLotteryAward();
            this.buy = "确认结算";
            this.buyFlag = true;
            this.SealFlag = false;
          }
        }, 1000);
      }
    },
    times() {
      this.CHANGE_IS_RUN(1);
      clearInterval(this.setTimer);
      let that = this;
      if (this.awardData.next.actionTime && this.awardData.nowTime) {
        var time = this.awardData.next.actionTime - this.awardData.nowTime;
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
              that.timeOver(time);
              that.CHANGE_IS_RUN(0);
            }
            if (time <= 0) {
              that.time = "00:00:00";
            }
          }
        }, 1000);
      }
    }
  }
};
</script>
<style scoped lang="less">
.betCart {
  text-align: center;

  .top {
    height: 100px;
    line-height: 100px;
    font-size: 42px;
    background: #fff;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    position: relative;

    i {
      position: absolute;
      left: 16px;
      font-size: 46px;
      padding: 0 10px;
    }

    span {
      position: absolute;
      right: 40px;
      font-size: 29px;
    }

    div {
      position: absolute;
      top: 100px;
      color: #999999;
      font-size: 26px;
      text-align: center;
      width: 100%;
      line-height: 53px;
      border-bottom: 1px solid #ededed;
      z-index: 100;

      b {
        color: @Forget-Pwd-Color;
      }
    }
  }

  .content {
    flex: 1;
    overflow-y: scroll;
    background-color: #f6f6f6;

    .content_box {
      margin-top: 350px;
      div {
        p {
          text-align: center;
          img {
            display: inline-block;
            width: 220px;
            height: 100%;
          }
        }

        h4 {
          color: #666;
          font-size: 37px;
          line-height: 80px;
          font-weight: bold;
        }

        p {
          font-size: 28px;
          color: #bebebe;
        }
      }
    }

    dl {
      background-color: #fff;
      margin-top: 85px;
      text-align: left;

      dt {
        border-top: 1px solid #f0f0f0; /*no*/
        border-bottom: 1px solid #f0f0f0; /*no*/
        line-height: 80px;
        padding-left: 20px;
        font-size: 30px;
        color: #444444;
        letter-spacing: 1px; /*no*/
        span {
          color: @Forget-Pwd-Color;
        }
      }

      .fd {
        color: #999999;

        span {
          color: #999;
        }
      }

      dd {
        overflow: hidden;
        padding-top: 10px;
        padding-bottom: 27px;
        border-bottom: 1px solid #f0f0f0; /*no*/
        padding-left: 20px;
        position: relative;

        div {
          float: left;
          font-size: 27px;

          input {
            display: none;
          }

          input + label {
            display: inline-block;
            vertical-align: top;
            width: 45px;
            height: 45px;
            text-align: center;
            line-height: 45px;
            background: @ThemeColor;
            border-radius: 50%;
            margin-top: 55px;
            margin-left: 27px;
          }

          input:checked + label::before {
            content: "\2714";
            font-size: 29px;
            color: white !important;
          }

          h3 {
            line-height: 55px;
          }

          p {
            line-height: 55px;
          }

          span {
            line-height: 38px;

            b {
              color: @red;
            }
          }
        }

        div:nth-child(2) {
          margin-left: 47px;
        }

        i {
          position: absolute;
          right: 40px;
          top: 20px;
          font-size: 38px;
          color: #dfdbda;
        }
      }
    }

    .content_btm {
      margin-top: 40px;
      color: #999999 !important;

      b {
        color: #999;
      }

      label {
        background-color: #999;
      }

      dd {
        position: relative;

        .change {
          position: absolute;
          right: 40px;
          bottom: 28px;
          color: @ThemeColor;
          font-size: 28px;
          b {
            color: @ThemeColor;
            font-size: 28px;
          }
        }
      }
    }
  }

  .footer {
    height: 103px;
    border-top: 1px solid #adabac; /*no*/
    background-color: #3d3d3d;
    color: white;
    line-height: 103px;
    font-size: 26px;

    div {
      float: left;

      input {
        display: none;
      }

      input + label {
        display: inline-block;
        vertical-align: top;
        width: 45px;
        height: 45px;
        text-align: center;
        line-height: 45px;
        background: @Amount-Right-Btn;
        border-radius: 50%;
        margin-top: 28px;
        margin-left: 21px;
        margin-right: 5px;
      }

      input:checked + label::before {
        content: "\2714";
        font-size: 30px;
        color: #fff !important;
      }
    }

    div:nth-child(2) {
      color: @ThemeColor;
      text-align: right;
      width: 400px;
      padding-right: 28px;
    }

    .van-button {
      float: right;
      width: 185px;
      height: 103px;
      font-size: 30px;
    }

    .fenDan {
      background-color: #a1a1a1;
    }
  }
}
</style>
