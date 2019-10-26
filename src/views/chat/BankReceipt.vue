<template>
  <div class="bankReceipt flex">
    <Header title="收款" color="#fff"></Header>
    <div class="bankReceiptContent content">
      <dl>
        <dt>
          <i class="iconfont">&#xe623;</i>
          <span>银行卡收款</span>
        </dt>
        <dd>
          可使用支付宝，微信【转账到银行卡】功能付钱
        </dd>
        <dd>
          <span>
            银行卡姓名
          </span>
          <span>
            {{receiptDetail.accountName}}
            <b
              v-clipboard:copy="receiptDetail.accountName"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</b>
          </span>
        </dd>
        <dd>
          <span>
            银行卡号
          </span>
          <span>
            {{receiptDetail.accountNo}}
            <b
              v-clipboard:copy="receiptDetail.accountNo"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</b>
          </span>
        </dd>
        <dd>
          <span>
            开户银行
          </span>
          <span>
            {{receiptDetail.bankname}}
            <b
              v-clipboard:copy="receiptDetail.bankname"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            >复制</b>
          </span>
        </dd>
<!--        <dd>-->
<!--          <span>开户支行</span>-->
<!--          <span>-->
<!--            浙江-杭州-杭州支行-->
<!--            <b-->
<!--              v-clipboard:copy="'浙江-杭州-杭州支行'"-->
<!--              v-clipboard:success="onCopy"-->
<!--              v-clipboard:error="onError"-->
<!--            >复制</b>-->
<!--          </span>-->
<!--        </dd>-->
      </dl>
      <dl>
        <dt>
          <i class="iconfont">&#xe717;</i>
          温馨提示
        </dt>
        <dd>
          支持各种银行，支付宝，微信的银行卡转账
        </dd>
        <dd>支付宝转到银行卡功能路径：打开支付宝>转账>转到银行卡</dd>
        <dd>微信转到银行卡功能路径：打开微信>右上角+号>收付款>转到银行卡</dd>
      </dl>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "BankReceipt",
    computed: {
      ...mapGetters(['receiptDetail'])
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
    }
  }
</script>

<style scoped lang="less">
.bankReceipt {
  background-color: #e9b428;
  .bankReceiptContent {
    dl {
      width: 700px;
      margin: 30px auto 0;
      background-color: #fff;
      box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      &:nth-child(2) {
        dd {
          line-height: 50px;
          margin-top: 20px;
          margin-bottom: 20px;
          &:last-child {
            padding-bottom: 20px;
          }
        }
      }
      dt {
        line-height: 60px;
        text-align: center;
        font-size: 30px;
        border-bottom: 1px solid #dfdfdf;
        i {
          font-size: 30px;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
      }
      dd {
        display: flex;
        justify-content: space-between;
        line-height: 80px;
        padding: 0 52px;
        font-size: 28px;
        &:nth-child(2) {
          justify-content: center;
        }
        span {
          &:nth-child(1) {
            color: #999;
          }
          b {
            font-weight: normal;
            color: @Loss;
          }
        }
      }
    }
  }
}
</style>