<template>
  <div class="paying" @click.stop="keyboardShow = false">
    <Header title="充值金额"></Header>
    <div class="content">
      <div class="content-top">
        <div class="list">
          <p>充值金额：</p>
          <van-field
              ref="moneyInput"
              type="number"
              v-model="amount"
              :placeholder="MaxMoney"
              :border="false"
              clearable
              :readonly=isReadonly
              :class="[{error:!moneyFlag},{success:moneySuccess}]"
              maxlength="15"
              @focus="moneyFocus"
              @blur="moneyTest"
          ></van-field>
          <i class="iconfont successI" v-show="moneySuccess">&#xe71c;</i>
        </div>
        <div class="prompt">
          <p>温馨提示：建议存入特殊金额，以便款项能更好快速到账。</p>
          <em>（例：7659、12349、50000.33）</em>
        </div>
        <div class="tip" v-html="moneyTip"></div>
        <div class="list">
          <p>汇款人姓名：</p>
          <van-field
              ref="usernameInput"
              type="text"
              v-model="username"
              placeholder="请输入汇款人名称"
              :border="false"
              clearable
              :class="[{error:!usernameFlag},{success:usernameSuccess}]"
              @focus="usernameFocus"
              @blur="usernameTest"
          ></van-field>
          <i class="iconfont successI" v-show="usernameSuccess">&#xe71c;</i>
        </div>
        <div class="tip" v-html="usernameTip"></div>
        <ul v-if="rechargeMoneyList.length">
          <li v-for="item in rechargeMoneyList" :key="item"
              :class="{'on':item===amount}"
              class="hold"
              @click="[amount=item,moneySuccess=true]">
              {{'￥'+item}}
          </li>
        </ul>
        <van-button class="submitBtn btn" :class="{ disableBtn: isDisable }" @click="submit"><i class="iconfont">&#xe727;</i>到账金额{{amount || "0"}}元</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    name: "HumanPaying",
    data() {
      return {
        orderLimit: {},
        amount: "",
        username: "",
        amountFlag: true,
        moneySuccess: false,
        moneyTip: "",
        moneyFlag: true,
        usernameTip: "",
        usernameFlag: true,
        usernameSuccess: false,
      };
    },
    created() {
      console.log(this.rechargeMoneyList);
      this.orderLimit = this.$store.getters.order.rechargeMethod;
      this.$nextTick(()=> {
        if(!this.isReadonly) {
          this.$refs.moneyInput.focus();
        }
      });
      if(this.rechargeMoney) {
        this.amount = this.rechargeMoney;
        this.moneySuccess = true;
      }
      if(this.rechargeName) {
        this.username = this.rechargeName;
        this.usernameSuccess = true;
      }
    },
    computed: {
      ...mapGetters([
        "rechargeMoneyList",
        "rechargeMoneyType",
        "rechargeMoney",
        "rechargeName",
      ]),
      isDisable() {
        if(this.moneySuccess && this.usernameSuccess) {
          return false
        }else {
          return true
        }
      },
      isReadonly() {
        return this.rechargeMoneyType == 1;
      },
      rechargeMin() {
        return this.orderLimit.rechargeMin;
      },
      rechargeMax() {
        return this.orderLimit.rechargeMax;
      },
      MaxMoney() {
        if(this.orderLimit && this.orderLimit.rechargeMin) {
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
        }else {
          return "请输入金额";
        }
      },
      payWays() {
        return this.$route.params.payWay * 1;
      }
    },
    methods: {
      moneyFocus() {
        this.moneyFlag = true;
        this.moneySuccess = false;
        this.moneyTip = "";
      },
      usernameFocus() {
        this.usernameFlag = true;
        this.usernameSuccess = false;
        this.usernameTip = "";
      },
      moneyTest() {
        if(this.amount) {
          if(this.rechargeMin) {
            if(this.toNum(this.amount) < this.toNum(this.rechargeMin)) {
              this.moneyTip = `<i class="iconfont">&#xe681;</i>输入金额不得小于${this.rechargeMin}`;
              this.moneyFlag = false;
              this.moneySuccess = false;
              return false;
            }else {
              this.moneyTip = "";
              this.moneyFlag = true;
              this.moneySuccess = true;
            }
          }
          if(this.rechargeMax) {
            if(this.toNum(this.amount) > this.toNum(this.rechargeMax)) {
              this.moneyTip = `<i class="iconfont">&#xe681;</i>输入金额不得大于${this.rechargeMax}`;
              this.moneyFlag = false;
              this.moneySuccess = false;
              return false;
            }else {
              this.moneyTip = "";
              this.moneyFlag = true;
              this.moneySuccess = true;
            }
          }
        }else {
          this.moneyTip = "";
          this.moneyFlag = true;
          this.moneySuccess = false;
        }
      },
      usernameTest() {
        if(this.username) {
          if(/^[\u4e00-\u9fa5a-zA-Z]{2,}$/.test(this.username)) {
            this.usernameTip = "";
            this.usernameFlag = true;
            this.usernameSuccess = true;
          }else {
            this.usernameTip = `<i class="iconfont">&#xe681;</i>请输入2~20字之间的中英文姓名`;
            this.usernameFlag = false;
            this.usernameSuccess = false;
          }
        }else {
          this.usernameTip = "";
          this.usernameFlag = true;
          this.usernameSuccess = false;
        }
      },
      submit() {
        if (!this.amount) {
          this.moneyTip = `<i class="iconfont">&#xe681;</i>请输入金额`;
          this.moneyFlag = false;
          return false
        }else {
          if(this.rechargeMin) {
            if(this.toNum(this.amount) < this.toNum(this.rechargeMin)) {
              this.moneyTip = `<i class="iconfont">&#xe681;</i>输入金额不得小于${this.rechargeMin}`;
              this.moneyFlag = false;
              return false
            }
          }
          if(this.rechargeMax) {
            if(this.toNum(this.amount) > this.toNum(this.rechargeMax)) {
              this.moneyTip = `<i class="iconfont">&#xe681;</i>输入金额不得大于${this.rechargeMax}`;
              this.moneyFlag = false;
              return false
            }
          }
        }
        if(!this.username) {
          this.usernameTip = `<i class="iconfont">&#xe681;</i>请输入2~20字之间的中英文姓名`;
          this.usernameFlag = false;
          return false
        }else {
          if(!/^[\u4e00-\u9fa5a-zA-Z]{2,}$/.test(this.username)) {
            this.usernameTip = `<i class="iconfont">&#xe681;</i>请输入2~20字之间的中英文姓名`;
            this.usernameFlag = false;
            return false
          }
        }
        this.$store.commit("SET_RECHARGE_MONEY",this.toFixeds(this.amount));
        this.$store.commit("SET_RECHARGE_NAME",this.username);
        switch (this.payWays) {
          case 2:
            this.$router.push({ name: "scancodepaying", params: { id: this.$route.params.id } });
            break;
          default:
            this.$router.push({ name: "bankpaying", params: { id: this.$route.params.id } });
        }
      },
    }
  };
</script>

<style scoped lang="less">
  .paying {
    .headerBox {
      border-bottom: 1px solid #f0f0f0; /*no*/
    }
    .content {
      padding: 46px 40px 0;
      .content-top {
        background-color: #fff;
        .tip {
          height: 50px;
          display: flex;
          align-items: center;
          font-size: 25px;
          color: @red;
        }
        .submitBtn {
          margin-top: 30px;
          width: 669px;
          height: 87px;
          line-height: 87px;
          margin-left: 0;
          font-size: 30px;
          position: relative;
          i {
            position: absolute;
            right: 10px;
            font-size: 40px;
          }
        }
        .list {
          position: relative;
          overflow: hidden;
          p {
            font-size: 28px;
          }
          .successI {
            position: absolute;
            right: 40px;
            font-size: 30px;
            top: 50%;
            transform: translate(-50%,0);
            color: #3ada45;
          }
          .van-cell {
            font-size: 28px;
            border: 1px solid #cdcdcd; /*no*/
            margin: 20px 0;
            border-radius: 10px;
          }
          .error {
            border-color: @red !important;
          }
          .success {
            border-color: #3ada45 !important;
          }
          span {
            font-size: 30px;
            display: inline-block;
            width: 90%;
            height: 40px;
            &.placeholder {
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
        .prompt {
          border: 0;
          display: block;
          p {
            color: @ThemeColor;
            font-size: 25px;
            margin-top: 10px;
          }
          em {
            display: inline-block;
            font-style: normal;
            color: #666;
            font-size: 23px;
            padding-top: 10px;
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 50px;
          li {
            flex: 0 0 auto;
            height: 60px;
            margin-left: 15px;
            padding: 0 30px;
            .borderAll();
            box-sizing: border-box;
            margin-top: 30px;
            border-radius: 60px;
            text-align: center;
            line-height: 60px;
            font-size: 30px;
            color: #a5a5a5;
            overflow: hidden;
          }
          .on {
            background-color: @ThemeColor;
            color: #fff;
            border: 0;
          }
        }
      }
    }
  }
</style>

