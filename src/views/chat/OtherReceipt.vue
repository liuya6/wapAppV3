<template>
  <div class="otherReceipt flex">
    <Header title="收款" color="#fff"></Header>
    <div class="otherReceiptContent content">
      <div class="qrCode" v-if="receiptDetail.rechargeType =='3'">
        <dl>
          <dt>
            <i class="iconfont" v-html="typeIcon"></i>
            {{typeText}}二维码收款
          </dt>
          <dd>
            保存二维码到相册，{{typeText}}【扫一扫】付钱
          </dd>
          <dd>
            <img :src="receiptDetail.qrcode" alt="支付二维码" />
          </dd>
          <dd>
            <span>长按图片或截图保存</span>
          </dd>
        </dl>
      </div>
      <div class="account" v-else>
        <dl>
          <dt>
            <i class="iconfont" v-html="typeIcon"></i>
            {{typeText}}账号收款
          </dt>
          <dd>复制{{typeText}}账号，{{typeText}}【转账】付钱</dd>
          <dd>
            <span>{{typeText}}账号</span>
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
            <span>{{typeText}}姓</span>
            <span>
              {{receiptDetail.accountFamilyName}}
              <b
                v-clipboard:copy="receiptDetail.accountFamilyName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >复制</b>
            </span>
          </dd>
          <dd>
            <span>{{typeText}}名</span>
            <span>
              {{receiptDetail.accountGivenName}}
              <b
                v-clipboard:copy="receiptDetail.accountGivenName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >复制</b>
            </span>
          </dd>
          <dd>
            <span>{{typeText}}姓名</span>
            <span>
              {{receiptDetail.accountName}}
              <b
                v-clipboard:copy="receiptDetail.accountName"
                v-clipboard:success="onCopy"
                v-clipboard:error="onError"
              >复制</b>
            </span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "OtherReceipt",
    created () {
      console.log(this.receiptDetail)
    },
    computed: {
      ...mapGetters(['receiptDetail']),
      typeText() {
        switch (this.toNum(this.receiptDetail.qrtype)) {
          case 1:
            return "支付宝";
          case 2:
            return "微信";
          case 3:
            return "QQ";
          case 4:
            return "云闪付";
          default:
            return "支付宝"
        }
      },
      typeIcon() {
        switch (this.toNum(this.receiptDetail.qrtype)) {
          case 1:
            return "&#xe655;";
          case 2:
            return "&#xe65b;";
          case 3:
            return "&#xe66a;";
          case 4:
            return "&#xe66e;";
          default:
            return "&#xe655;"
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
    }
  }
</script>

<style scoped lang="less">
.otherReceipt {
  background-color: #478bf6;
  .otherReceiptContent {
    .qrCode {
      dl {
        width: 700px;
        margin: 30px auto 0;
        background-color: #fff;
        box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        dt {
          line-height: 60px;
          text-align: center;
          font-size: 32px;
          border-bottom: 1px solid #dfdfdf;
          i {
            font-size: 40px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        dd {
          text-align: center;
          font-size: 30px;
          &:nth-child(2) {
            margin: 30px 0;
          }
          img {
            width: 350px;
            height: 350px;
            display: inline-block;
          }
          &:last-child {
            line-height: 100px;
            margin: 0;
            span {
              color: @Loss;
            }
          }
        }
      }
    }
    .account {
      dl {
        width: 700px;
        margin: 30px auto 0;
        background-color: #fff;
        box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
        border-radius: 8px;
        dt {
          line-height: 60px;
          text-align: center;
          font-size: 32px;
          border-bottom: 1px solid #dfdfdf;
          i {
            font-size: 40px;
            display: inline-block;
            vertical-align: middle;
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
}
</style>