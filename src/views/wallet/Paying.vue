<template>
  <div class="paying flex" @click.stop="keyboardShow = false">
    <Header title="充值金额"></Header>
    <div class="content">
      <div class="content-top">
        <div>
          <van-field
              ref="moneyInput"
              type="number"
              v-model="data.amount"
              :placeholder="MaxMoney"
              :border="false"
              clearable
              :readonly=isReadonly
          ></van-field>
        </div>
        <ul v-if="rechargeMoneyList.length">
          <li v-for="item in rechargeMoneyList" :key="item" :class="{'on':item===data.amount}" @click="data.amount=item">{{'￥'+item}}</li>
        </ul>
        <van-button class="submitBtn" :class="{disableBtn:!data.amount}" @click="submit">确认</van-button>
      </div>
    </div>
    <transition name="fadeUp">
      <div class="PopupSuccess" v-show="isSuccess">
        <ul>
          <li class="iconfont">&#xe600;</li>
          <li>
            是否充值成功？
          </li>
          <li>
            稍后请查收你的账户
          </li>
          <li>
            <van-button @click="isSuccess = false">操作失败</van-button>
            <van-button
                @click="$router.push({ name: 'wallet' })"
                class="onBtn"
            >充值成功</van-button
            >
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Paying",
  data() {
    return {
      orderLimit: {},
      isSuccess: false,
      data: {
        methodId: this.$route.query.id,
        amount: ""
      }
    };
  },
  created() {
    console.log(this.$store.getters.order);
    this.orderLimit = this.$store.getters.order.rechargeMethod;
    if (!this.$route.query.id) this.$router.go(-1);
    this.$nextTick(()=>{
      if(!this.isReadonly) {
        this.$refs.moneyInput.focus();
      }
    });
    console.log(this.rechargeMoneyList,this.rechargeMoneyType);
  },
  computed: {
    ...mapGetters([
      "rechargeMoneyList",
      "rechargeMoneyType"
    ]),
    isReadonly() {
      return this.rechargeMoneyType == 1
    },
    MaxMoney() {
      if (this.orderLimit.rechargeMin && this.orderLimit.rechargeMax) {
        return `输入金额${this.orderLimit.rechargeMin}~${
          this.orderLimit.rechargeMax
        }元`;
      } else if (this.orderLimit.rechargeMin && !this.orderLimit.rechargeMax) {
        return `最低金额${this.orderLimit.rechargeMin}元`;
      } else if (!this.orderLimit.rechargeMin && this.orderLimit.rechargeMax) {
        return `最高金额${this.orderLimit.rechargeMax}元`;
      } else {
        return `请输入金额`;
      }
    }
  },
  methods: {
    submit() {
      if (!this.data.amount) {
        return this.$toast("请输入金额");
      }
      if (parseFloat(this.orderLimit.rechargeMin) > this.data.amount) {
        return this.$toast("金额不能少于" + this.orderLimit.rechargeMin + "元");
      }
      if (parseFloat(this.orderLimit.rechargeMax) < this.data.amount) {
        return this.$toast("金额不能大于" + this.orderLimit.rechargeMax + "元");
      }
      this.isSuccess = true;
      this.winOpen(
        "/api/common/pay/create/methodId/" +
          this.data.methodId +
          "/money/" +
          this.data.amount
      );
    },
  }
};
</script>
<style scoped lang="less">
  .paying {
    .content {
      padding: 46px 40px 0;
      .content-top {
        background-color: #fff;
        .submitBtn {
          margin-top: 30px;
          width: 669px;
          height: 87px;
          line-height: 87px;
          margin-left: 0;
        }
        > div {
          .borderBtm();
          height: 90px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .van-cell {
            font-size: 35px;
          }
          span {
            font-size: 30px;
            display: inline-block;
            width: 90%;
            height: 40px;
            &.placeholder{
              color: #aeaeae;
            }
          }
          b {
            display: inline-block;
            width: 40px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            border-radius: 50%;
            background-color: #e8e8e8;
            color: #c4c4c4;
            font-weight: normal;
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 50px;
          li{
            flex: 0 0 auto;
            height: 60px;
            margin-left: 13px;
            padding: 0 30px;
            .borderAll();
            box-sizing: border-box;
            margin-top: 30px;
            border-radius: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            color: #a5a5a5;
          }
          .on {
            background-color: @ThemeColor;
            color: #fff;
            border: 0;
          }
        }
      }
    }
    .PopupSuccess {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 999;
      text-align: center;

      ul {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: #fff;
        width: 550px;
        height: 550px;
        margin: auto;
        border-radius: 18px;
        overflow: hidden;
        li{
          padding: 0 30px;
        }
        li:first-child {
          color: #999;
          font-size: 190px;
          margin-top: 40px;
        }

        li:nth-child(2) {
          line-height: 58px;
          font-size: 36px;
        }

        li:nth-child(3) {
          color: #999999;
          line-height: 48px;
        }

        li:last-child {
          padding: 0;
          width: 100%;
          position: absolute;
          bottom: 30px;

          .van-button {
            display: inline-block;
            width: 228px;
            height: 88px;
            border: 1px solid #dedddb; /*no*/
            border-radius: 10px;
            line-height: 88px;
            text-align: center;
            font-size: 32px;
            &:first-child {
              margin-right: 5px;
              background-color: #f6f6f6;
            }
            &:last-child {
              margin-left: 5px;
              background: @Amount-Right-Btn;
              color: white;
            }
          }
        }
      }
    }
  }
</style>
