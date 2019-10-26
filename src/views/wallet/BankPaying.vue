<template>
  <div class="body flex" v-title="'充值'">
    <Header title="充值提交"></Header>
    <div class="content" v-if="order && order.recharge && order.rechargeMethod">
      <dl>
        <dd>
          <span>发卡银行</span>
          <span>{{ order.rechargeMethod.rechargeName }}</span>
        </dd>
        <dd>
          <span>收款人</span>
          <span>{{ order.rechargeMethod.username }}</span>
          <van-button
              v-clipboard:copy="order.rechargeMethod.username"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
            复制
          </van-button>
        </dd>
        <dd>
          <span>收款账号</span>
          <span>{{ order.rechargeMethod.account }}</span>
          <van-button
              v-clipboard:copy="order.rechargeMethod.account"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
            复制
          </van-button>
        </dd>
        <dd>
          <span>备注码（必填）</span>
          <span class="color">{{order.recharge.remarkCode}}</span>
          <van-button
              v-clipboard:copy="order.recharge.remarkCode"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
            复制
          </van-button>
        </dd>
        <dd>
          <span>优惠方式</span>
          <span>{{ order.recharge.activityTitle }}</span>
        </dd>
      </dl>
      <div class="fg"></div>
      <ul>
        <li class="money">
          <span>存入金额</span>
          <span class="color">{{ rechargeMoney }}元</span>
        </li>
      </ul>
      <div class="btn">
        <van-button @click="back">上一步</van-button>
        <van-button class="onBtn" :class="{disableBtn:!rechargeMoney}" @click="submit" >提交订单</van-button>
      </div>
      <div v-if="order && order.rechargeMethod.tips" class="tips">
        <div v-html="order.rechargeMethod.tips"></div>
      </div>
      <div class="remind" v-else>
        <p>*提醒您:</p>
        <p>1，请如实填写存入时间、存入金额、存款人姓名。</p>
        <p>2，每笔转账请提交一次</p>
        <p>3，如转账金额添加零头如5003.10，便于查收，加快到账速度</p>
        <p>4，转账完成后请保留单据作为核对凭证</p>
      </div>
    </div>
  </div>
</template>

<script>
import { rechargeSubmit } from "../../api";
import { mapGetters } from "vuex";
export default {
  name: "BankPaying",
  data() {
    return {
      parameter: {
        rechargeId: "",
        methodId: this.$route.params.id,
        amount: "",
        date: "",
        payAccountNameFull: "",
      },
      select: false
    };
  },
  created() {
    if (!this.$route.params.id) this.$router.go(-1);
  },
  computed: {
    ...mapGetters(["order", "userInfo", "rechargeMoney","rechargeName"]),
    MaxMoney() {
      if (
        this.order.rechargeMethod.rechargeMin &&
        this.order.rechargeMethod.rechargeMax
      ) {
        return `${this.order.rechargeMethod.rechargeMin}-${
          this.order.rechargeMethod.rechargeMax
        }元`;
      } else if (
        this.order.rechargeMethod.rechargeMin &&
        !this.order.rechargeMethod.rechargeMax
      ) {
        return `金额最低${this.order.rechargeMethod.rechargeMin}元`;
      } else if (
        !this.order.rechargeMethod.rechargeMin &&
        this.order.rechargeMethod.rechargeMax
      ) {
        return `金额最高${this.order.rechargeMethod.rechargeMax}元`;
      } else {
        return `请输入存入金额`;
      }
    }
  },
  methods: {
    // ...mapMutations([ "TRANSFER_METHOD"]),
    submit() {
      if (!this.rechargeMoney) {
        return false;
      }
      this.parameter.rechargeId = this.order.recharge.rechargeId;
      this.parameter.date = this.timestampToString(
        this.order.recharge.actionTime
      );
      this.parameter.payAccountNameFull = "备注码：" + this.order.recharge.remarkCode + ",存款人姓名：" + this.rechargeName;
      // this.TRANSFER_METHOD(this.parameter.bankPos);
      if (this.toNum(this.order.rechargeMethod.rechargeMin) > 0) {
        if (
          this.toNum(this.parameter.amount) <
          this.toNum(this.order.rechargeMethod.rechargeMin)
        ) {
          return this.$toast(
            "充值金额不能低于" + this.order.rechargeMethod.rechargeMin + "元"
          );
        }
      }
      if (this.toNum(this.order.rechargeMethod.rechargeMax) > 0) {
        if (
          this.toNum(this.parameter.amount) >
          this.toNum(this.order.rechargeMethod.rechargeMax)
        ) {
          return this.$toast(
            "充值金额不能高于" + this.order.rechargeMethod.rechargeMax + "元"
          );
        }
      }
      this.parameter.amount = this.rechargeMoney;
      rechargeSubmit(this.parameter).then(res => {
        if (res.status) {
          this.$store.commit("SET_RECHARGE_MONEY","");
          this.$store.commit("SET_RECHARGE_NAME","");
          this.$router.push({
            name: "rechargesubmit"
          });
        } else {
          this.$toast(res.msg);
        }
      });
    },
    onCopy: function(e) {
      console.log(e);
      this.$toast("复制成功");
    },
    onError: function(e) {
      console.log(e);
      this.$toast("复制失败");
    },
  }
};
</script>

<style scoped lang="less">
.body {
  .color {
    color: @ThemeColor !important;
  }
  .headerBox {
    border-bottom: 1px solid #f0f0f0 /*no*/;
  }
  .content {
    dl {
      background-color: #fff;
      text-align: left;
      dd {
        padding-left: 20px;
        font-size: 28px;
        position: relative;
        border-bottom: 1px solid #f0f0f0;
        height: 80px;
        display: flex;
        align-items: center;

        > span:first-child {
          display: inline-block;
          width: 200px;
          white-space: normal;
          color: #666;
          /*text-align-last: justify;*/
        }
        span:nth-child(2) {
          color: #333;
          width: 415px;
        }
        .van-button {
          position: absolute;
          right: 20px;
          height: 50px;
          line-height: 50px;
          overflow: hidden;
          color: @ThemeColor;
          border-radius: 50px;
          border: 1px solid @ThemeColor; /*no*/
          padding: 0 20px;
        }
      }
    }
    .fg {
      background-color: #f7f7fa;
      height: 30px;
    }
    ul {
      background-color: #fff;
      .money {
        border-bottom: 1px solid #f0f0f0; /*no*/
        padding-left: 20px;
        font-size: 28px;
        height: 80px;
        line-height: 80px;
        span {
          &:nth-child(1) {
            display: inline-block;
            width: 200px;
            color: #666;
          }
        }
      }
    }
    .btn {
      width: 95%;
      display: flex;
      margin: 30px auto 0;
      justify-content: space-around;
      .van-button {
        display: inline-block;
        width: 333px;
        height: 86px;
        border: 1px solid #e0dcd9; /*no*/
        text-align: center;
        line-height: 86px;
        font-size: 28px;
        border-radius: 10px;
        &:nth-child(2) {
          border: 0;
          background: @Amount-Right-Btn;
          color: #fff;
        }
      }
    }
    .remind {
      text-align: left;
      padding: 23px 43px 0 30px;
      p {
        line-height: 50px;
        color: #676767;
        font-size: 27px;
      }
    }
  }
}
</style>
