<template>
  <div class="rechargeSubmit flex">
    <Header title="提交完成"></Header>
    <div class="content">
      <div class="img">
        <img src="../../assets/images/success.png" alt="" />
      </div>
      <div>
        <span>备注码:</span>
        <span>{{ order.recharge.remarkCode }}</span>
        <van-button
            v-clipboard:copy="order.recharge.remarkCode"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">
          复制
        </van-button>
      </div>
      <div>
        请务必在转账备注填写<b>备注码</b>否则可能不及时到账！
      </div>
      <div class="btn">
        <van-button @click="$router.push({ name: 'wallet' })">完成</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "rechargeSubmit",
    computed: {
      ...mapGetters(["order"])
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
.rechargeSubmit {
  .content {
    text-align: center;
    div {
      display: flex;
      justify-content: center;
      &:nth-child(1) {
        margin: 30px 0;
      }
      &:nth-child(2) {
        font-size: 40px;
        display: flex;
        align-items: center;
        span {
          &:nth-child(2) {
            color: @ThemeColor;
          }
        }
        .van-button {
          height: 60px;
          padding: 0 40px;
          border-radius: 30px;
          margin-left: 30px;
          font-size: 40px;
          border: 1px solid @ThemeColor; /*no*/
        }
      }
      &:nth-child(3) {
        margin-top: 60px;
        font-size: 36px;
        display: block;
        b {
          color: @red;
          font-weight: normal;
        }
      }
    }
    .btn {
      margin-top: 280px;
      .van-button {
        display: block;
        margin: auto;
        width: 670px;
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-size: 30px;
        border-radius: 10px;
        background: @Amount-Right-Btn;
        color: #fff;
      }
    }
  }
}
</style>