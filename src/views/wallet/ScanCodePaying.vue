<style scoped lang="less">
.body {
  .headerBox {
    border-bottom: 1px solid #f0f0f0; /*no*/
  }
  .content {
    .content-top {
      border-bottom: 1px solid #f0f0f0;
      text-align: center;
      > div {
        display: flex;
        justify-content: center;
        &:nth-child(1) {
          color: @ThemeColor;
          font-size: 28px;
          line-height: 80px;
        }
        &:nth-child(2) {
          img {
            width: 400px;
            height: 400px;
          }
        }
        &:nth-child(3) {
          color: #000;
          font-size: 28px;
          margin-top: 10px;
        }
        &:nth-child(4) {
          height: 80px;
          font-size: 40px;
          display: flex;
          align-items: center;
          span {
            color: #666;
          }
          b {
            color: @ThemeColor;
          }
          .van-button {
            margin-left: 20px;
            height: 40px;
            border-radius: 40px;
            border: 1px solid @ThemeColor; /*no*/
            padding: 0 20px;
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
        font-size: 30px;
        border-radius: 10px;
        &:nth-child(2) {
          border: 0;
          background: @Amount-Right-Btn;
          color: white;
        }
      }
    }
    dl {
      text-align: left;
      padding: 23px 43px 0 30px;
      dd {
        line-height: 50px;
        color: #676767;
        font-size: 27px;
      }
    }
  }
}
</style>
<template>
  <div class="body flex" v-title="'充值'">
    <Header title="充值金额"></Header>
    <div class="content" v-if="order && order.recharge && order.rechargeMethod">
      <div class="content-top">
        <div>支付金额：¥{{rechargeMoney}}</div>
        <div class="img" >
          <img :src="order.rechargeMethod.image" alt="支付二维码##" />
        </div>
        <div>长按或截图将二维码保存到相册进行扫码</div>
        <div>
          <span>备注码（必填）：</span>
          <b>{{order.recharge.remarkCode}}</b>
          <van-button
              v-clipboard:copy="order.recharge.remarkCode"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError">
            复制
          </van-button>
        </div>
      </div>
      <div class="btn">
        <van-button @click="back">上一步</van-button>
        <van-button @click="submit" :class="{disableBtn:!rechargeMoney}">提交订单</van-button>
      </div>
      <div v-if="order && order.rechargeMethod.tips" class="tips">
        <div v-html="order.rechargeMethod.tips"></div>
      </div>
      <dl v-else>
        <dd>*扫码步骤:</dd>
        <dd>1，请自行截屏或长按保存二维码图片到相册。</dd>
        <dd>2，进入{{ text }}APP，打开扫一扫。</dd>
        <dd>3，在扫一扫中点击右上角，选择“从相册选择二维码”选取截屏的图片。</dd>
        <dd>
          4，输入你欲充值的金额并进行转账。如充值未及时到账，请联系在线客服。
        </dd>
        <dd>5，在{{ text }}支付完成后，请点击“提交订单”提交审核。</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { rechargeSubmit } from "../../api";
import { mapGetters } from "vuex";
export default {
  name: "ScanCodePaying",
  data() {
    return {
      parameter: {
        rechargeId: "",
        amount: "",
        date: "",
        payAccountNameFull: "",
        bankPos: ""
      }
    };
  },
  created() {
    if (!this.$route.params.id) this.$router.go(-1);
  },
  computed: {
    ...mapGetters(["order","rechargeMoney","rechargeName"]),
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
    },
    text() {
      switch (this.order.rechargeMethod.type) {
        case 10:
          return "微信";
        case 20:
          return "支付宝";
        case 30:
          return "QQ";
        default:
          return "云闪付";
      }
    }
  },
  methods: {
    onCopy: function(e) {
      console.log(e);
      this.$toast("复制成功");
    },
    onError: function(e) {
      console.log(e);
      this.$toast("复制失败");
    },
    submit() {
      if(!this.rechargeMoney) {
        return false;
      }
      this.parameter.rechargeId = this.order.recharge.rechargeId;
      this.parameter.date = this.timestampToString(
        this.order.recharge.actionTime
      );
      this.parameter.payAccountNameFull = "备注码：" + this.order.recharge.remarkCode + ",存款人姓名：" + this.rechargeName;
      if (parseFloat(this.order.rechargeMethod.rechargeMin) > 0) {
        if (
          this.rechargeMoney <
          parseFloat(this.order.rechargeMethod.rechargeMin)
        ) {
          return this.$toast(
            "充值金额不能低于" + this.order.rechargeMethod.rechargeMin + "元"
          );
        }
      }
      if (parseFloat(this.order.rechargeMethod.rechargeMax) > 0) {
        if (
          this.rechargeMoney >
          parseFloat(this.order.rechargeMethod.rechargeMax)
        ) {
          return this.$toast(
            "充值金额不能高于" + this.order.rechargeMethod.rechargeMax + "元"
          );
        }
      }
      this.parameter.amount = this.rechargeMoney;
      console.log(this.parameter,"充值提交参数");
      rechargeSubmit(this.parameter).then(res => {
        if (res.status) {
          this.$router.push({
            name: "rechargesubmit"
          });
        } else {
          this.$toast(res.msg);
        }
      });
    }
  }
};
</script>
