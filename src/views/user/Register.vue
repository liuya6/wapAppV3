<template>
  <div class="register flex" v-title="'注册'" @keyup.enter="Register">
    <Header title="注册"></Header>
    <div class="content">
      <ul>
        <li>
          <div class="mt">
            <van-field v-model="user.username" clearable placeholder="用户名5~15个的字母或数字组合"></van-field>
            <i class="iconfont">&#xe70e;</i>
          </div>
        </li>
        <li>
          <div class="mt">
            <van-field
                v-model="user.password"
                type="password"
                clearable
                placeholder="6~16位可包含大小写字母、数字、下划线_的组合"
            ></van-field>
            <i class="iconfont">&#xe70b;</i>
          </div>
        </li>
        <li>
          <div class="mt">
            <van-field v-model="user.password_confirm" type="password" clearable placeholder="请确认密码"></van-field>
            <i class="iconfont">&#xe708;</i>
          </div>
        </li>
        <li v-for="(FieldItem, i) in registerField" :key="i">
          <div v-if="FieldItem.field == 'promotionCode'">
            <div class="mt" v-if="promotionCodeShow">
              <van-field
                  clearable
                  :type="FieldItem.formtype"
                  :placeholder="'请输入'+FieldItem.name +(FieldItem.isrequired ? '(必填)' : '(选填)')"
                  v-model="user[FieldItem.field]"
                  :readonly="pCodeReadOnly && FieldItem.field == 'promotionCode'"
              ></van-field>
              <i class="iconfont" v-html="FieldItem.icon"></i>
            </div>
          </div>
          <div v-else-if="FieldItem.field == 'xcode'">
            <div class="mt" v-if="!promotionCodeShow">
              <van-field
                  clearable
                  :type="FieldItem.formtype"
                  :placeholder="'请输入'+FieldItem.name +(FieldItem.isrequired ? '(必填)' : '(选填)')"
                  v-model="user[FieldItem.field]"
                  :readonly="xcodeReadOnly && FieldItem.field == 'xcode'"
              ></van-field>
              <i class="iconfont" v-html="FieldItem.icon"></i>
            </div>
          </div>
          <div v-else-if="FieldItem.formtype != 'select'">
            <div class="mt">
              <van-field
                  clearable
                  :type="FieldItem.formtype"
                  :placeholder="'请输入'+FieldItem.name +(FieldItem.isrequired ? '(必填)' : '(选填)')"
                  v-model="user[FieldItem.field]"
                  :readonly="xcodeReadOnly && FieldItem.field == 'xcode' || pCodeReadOnly && FieldItem.field == 'promotionCode'"
              ></van-field>
              <i class="iconfont" v-html="FieldItem.icon"></i>
            </div>
          </div>
          <div v-else class="bank mt">
            <div>
              <select v-model="user[FieldItem.field]">
                <option disabled value>{{ FieldItem.tips }}</option>
                <option v-for="(item, i) in bankList" :key="i" :value="item.id">{{ item.name }}</option>
              </select>
              <i class="iconfont">&#xe70c;</i>
            </div>
          </div>
        </li>
        <li class="otherBankName" v-show="otherBankShowFlag">
          <div class="mt">
            <input type="text" placeholder="请输入银行名称" v-model="otherBankName" />
            <i class="iconfont">&#xe70c;</i>
          </div>
        </li>
        <li v-if="allConfig.isOpenSmsReg == '1'">
          <div class="mt">
            <van-field v-model="user.mobiles" center clearable placeholder="请输入常用手机号码" maxlength="11">
              <van-button
                  class="sendCode"
                  :class="setCodeFlag?'on':'wait'"
                  slot="button"
                  size="small"
                  @click="getMobilCode"
              >{{registerWaitTime>0?registerWaitTime+'秒后重新获取':'获取验证码'}}</van-button>
            </van-field>
            <i class="iconfont">&#xe713;</i>
          </div>
        </li>
        <li v-if="allConfig.isOpenSmsReg == '1'">
          <div class="mt">
            <van-field v-model="user.verifyCodes" clearable placeholder="请输入短信验证码"></van-field>
            <i class="iconfont">&#xe713;</i>
          </div>
        </li>
        <li class="code" v-else>
          <div class="mt">
            <van-field v-model="user.verifyCode" clearable placeholder="请输入验证码"></van-field>
            <i class="iconfont">&#xe713;</i>
            <div class="yanZ">
              <img :src="codeImg" alt="点击重新获取" @click="changeCode" />
            </div>
          </div>
        </li>
      </ul>
      <div class="protocol">
        <input type="checkbox" name id="keep" checked v-model="user.accept" />
        <span>我已年满18周岁，并且同意接受</span>
        <router-link to="/usertreaty">《开户条约》</router-link>
      </div>
      <div>
        <van-button class="submitBtn" @click="Register">立即注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { registerField, register, sendSms } from "../../api";
import { mapGetters } from "vuex";
import { Base64 } from "js-base64";
export default {
  name: "Register",
  data() {
    return {
      codeImg: "",
      registerField: [],
      bankList: [],
      xcode: "",
      promotionCode: "",
      otherBankShowFlag: false,
      otherBankName: "",
      registerWaitTime: 0,
      setCodeFlag: false,
      timer: 0,
      userPhone: "",
      user: {
        username: "",
        password: "",
        password_confirm: "",
        verifyCode: "",
        accept: true,
        name: "",
        qq: "",
        mobile: "",
        email: "",
        coinPassword: "",
        bankId: "",
        cardNo: "",
        weixin: "",
        xcode: "",
        promotionCode: "",
        mobileNum: "",
        mobiles: "",
        verifyCodes: ""
      },
      promotionCodeShow: false
    };
  },
  watch: {
    "user.bankId": {
      handler(newVal) {
        if (newVal === 10000) {
          this.otherBankShowFlag = true;
          return;
        }
        this.otherBankShowFlag = false;
      },
      deep: true
    },
    "user.mobiles": {
      handler(val) {
        if (val.length >= 11) {
          if (this.registerWaitTime <= 0) {
            this.setCodeFlag = true;
          } else {
            this.setCodeFlag = false;
          }
        } else {
          this.setCodeFlag = false;
        }
      }
    }
  },
  created() {
    this.codeImg = "/api/auth/captcha";
    registerField().then(res => {
      this.setXcode();
      this.setPromotionCode();
      let list = res.data.paramsList;
      this.registerField = list;
      for (let i = 0; i < list.length; i++) {
        let tempField = list[i].field;
        if (tempField === "xcode") {
          this.user[tempField] = this.xcode;
        } else if(tempField === "promotionCode") {
          this.user[tempField] = this.promotionCode;
        }else {
          this.user[tempField] = "";
        }
      }
      this.bankList = res.data.bankList;
    });
    if (localStorage.getItem("RegisterWaitTime")) {
      this.registerWaitTime = localStorage.getItem("RegisterWaitTime");
      if (this.registerWaitTime > 0) {
        this.times();
      }
    }
  },
  updated() {
    if(this.userInfo) {
      return this.$router.push({name:"home"})
    }
  },
  computed: {
    ...mapGetters(["userInfo","allConfig"]),
    xcodeReadOnly() {
      return !!this.xcode;
    },
    pCodeReadOnly() {
      return !!this.promotionCode;
    }
  },
  methods: {
    bankName(bank) {
      for (let i = 0; i < this.bankList.length; i++) {
        let bankListOne = this.bankList[i];
        if (bankListOne.id === bank) {
          return bankListOne.name;
        }
      }
    },
    setXcode() {
      let xcode =
        this.$route.path.split("/register/")[1] ||
        this.$route.params.xcode ||
        "";
      if (xcode !== "") {
        this.setCookie("xcode", xcode, 1);
      }
      if (!xcode) {
        let cookieXcode = this.getCookie("xcode") || "";
        if (cookieXcode !== "" && /^[1-9]\d*$/.test(cookieXcode)) {
          xcode = cookieXcode;
        }
        if (xcode !== "" && !/^[1-9]\d*$/.test(xcode)) {
          xcode = "";
        }
      }
      this.xcode = xcode;
    },
    setPromotionCode() {
      let promotionCode = this.$route.query.promotionCode || "";
      if (promotionCode !== "") {
        this.setCookie("promotionCode", promotionCode, 1);
      }
      if (!promotionCode) {
        let cookiePromotionCode = this.getCookie("promotionCode") || "";
        if (cookiePromotionCode !== "" && /^[0-9a-zA-Z]+$/.test(cookiePromotionCode)) {
          promotionCode = cookiePromotionCode;
        }
        if (promotionCode !== "" && !/^[0-9a-zA-Z]+$/.test(promotionCode)) {
          promotionCode = "";
        }
      }
      if(promotionCode) {
        this.promotionCodeShow = true
      }else {
        this.promotionCodeShow = false
      }
      this.promotionCode = promotionCode;
      console.log(this.promotionCode);
    },
    changeCode() {
      this.user.verifyCode = "";
      this.codeImg = "/api/auth/captcha?" + Math.random();
    },
    getMobilCode() {
      if (this.registerWaitTime > 0) {
        return false;
      }
      if (!this.user.mobiles) {
        return this.$toast("请输入常用手机号码");
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.user.mobiles)) {
          return this.$toast("请输入正确的手机号");
        }
      }
      this.registerWaitTime = 60;
      this.times();
      sendSms({ mobile: this.user.mobiles }).then(res => {
        this.$toast(res.msg);
      });
    },
    times() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.registerWaitTime--;
        localStorage.setItem("RegisterWaitTime", this.registerWaitTime);
        if (this.registerWaitTime <= 0) {
          this.registerWaitTime = 0;
          clearInterval(this.timer);
          if (this.user.mobiles.length >= 11) {
            this.setCodeFlag = true;
          } else {
            this.setCodeFlag = false;
          }
        }
      }, 1000);
    },
    Register() {
      if (!this.user.username) {
        return this.$toast("用户名不能为空");
      } else {
        if (!/^[a-zA-Z0-9_-]{5,15}$/.test(this.user.username)) {
          return this.$toast("请按照要求填写用户名（5~15位字母或数字）");
        }
      }
      if (!this.user.password || !this.user.password_confirm) {
        return this.$toast("密码不能为空");
      } else {
        if (
          !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,16}$/.test(
            this.user.password
          )
        ) {
          return this.$toast("请按要求填写密码（6~16位包含大小写字母、数字、下划线_的组合）");
        } else {
          if (this.user.password !== this.user.password_confirm) {
            return this.$toast("两次输入的密码不同");
          }
        }
      }
      if(this.allConfig.isOpenSmsReg =="1") {
        if(!this.user.mobiles) {
          return this.$toast("请输入常用手机号");
        }
        if(!this.user.verifyCodes) {
          return this.$toast("请输入短信验证码");
        }
      }else {
        if (!this.user.verifyCode) {
          return this.$toast("请输入验证码");
        }
      }
      for (var i = 0; i < this.registerField.length; i++) {
        var item = this.registerField[i];
        if (item.isrequired) {
          if (!this.user[item.field]) {
            return this.$toast("请输入" + item.name);
          } else {
            if (item.pattern) {
              if (!this.$_eval(item.pattern).test(this.user[item.field])) {
                return this.$toast(item.errortips);
              }
            }
          }
        }
      }
      if (!this.user.accept) {
        return this.$toast("请阅读并同意法律声明");
      }
      let users = { ...this.user };
      if (this.otherBankShowFlag) {
        if (!/^([\u4e00-\u9fa5]){4,10}$/.test(this.otherBankName)) {
          return this.$toast("请输入正确的开户银行名称");
        }
        users.bankName = this.otherBankName;
      } else {
        users = {
          ...this.user,
          bankName: this.bankName(this.user.bankId)
        };
      }
      console.log(users, "注册数据--------------");
      register(users).then(res => {
        if (res.status) {
          this.$store.commit("SET_USER_INFO", res.data);
          this.$store.commit("SET_MY_BANK", []);
          this.$store.commit("SET_REGISTERNOW", true);
          this.$store.commit("SET_PASSWORD", Base64.encode(this.user.password));
            this.$router.replace({
              path: "/user"
            });
        } else {
          this.changeCode();
        }
        this.$toast(res.msg);
      });
    }
  }
};
</script>

<style scoped lang="less">
.register {
  .headerBox {
    border-bottom: 1px solid #f0f0f0; /*no*/
  }
  ul {
    padding-left: 20px;
    li {
      overflow: hidden;
      .mt {
        margin-top: 50px;
        position: relative;
        overflow: hidden;
        i {
          color: @ThemeColor;
          font-size: 50px;
          position: absolute;
          left: 30px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }
      .sendCode {
        width: 100%;
        text-align: center;
        font-size: 27px;
        padding: 0 10px;
        color: #333;
        background-color: #eee;
        &.on {
          color: #fff;
          background-color: @ThemeColor;
        }
        &.wait {
          color: #333;
          background-color: #eee;
        }
      }
      &.code {
        position: relative;
        .van-cell.van-field {
          width: 468px;
          float: left;
        }
        .yanZ {
          width: 192px;
          height: 64px;
          position: absolute;
          top: 50%;
          right: 40px;
          transform: translate(0, -50%);
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .protocol {
    margin-top: 30px;
    color: #666666;
    font-size: 26px;
    margin-bottom: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    input[type="checkbox"] {
      width: 28px;
      height: 28px;
      -webkit-appearance: none;
      .borderAll();
      text-align: center;
      margin: 0 10px;
    }
    input[type="checkbox"]:checked {
      border: 1px solid @ThemeColor;
      background: #fff;
      color: @ThemeColor;
      line-height: 28px;
      &::after {
        content: "\2714";
        color: @ThemeColor;
      }
    }
    a {
      color: @ThemeColor;
    }
  }
  .submitBtn {
    margin-bottom: 50px;
  }
  .van-cell.van-field {
    width: 695px;
    border-radius: 90px;
    background-color: @Login-Input-Bg;
    padding-left: 95px;
    font-size: 30px;
  }
  .bank,
  .otherBankName {
    width: 695px;
    height: 90px;
    border-radius: 90px;
    background-color: @Login-Input-Bg;
    font-size: 30px;
    display: flex;
    align-items: center;
    input,
    select {
      width: 80%;
      margin-left: 95px;
      border: 0;
      background-color: @Login-Input-Bg;
      font-size: 30px;
    }
    select {
      outline: none;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
  }
}
</style>
