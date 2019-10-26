<template>
  <div class="login" v-title="'登录'" @keyup.enter="userNameLogin">
    <Header title="登录" rightTitle="免费试玩" :rightClick="Play" :isSlot="true">
      <i @click="goBack" class="iconfont back">&#xe629;</i>
    </Header>
    <div class="login-content">
      <ul class="user_name">
        <li>
          <van-field v-model="userName.username" clearable placeholder="请输入用户名"></van-field>
          <i class="iconfont">&#xe70e;</i>
        </li>
        <li>
          <van-field v-model="userName.password" :type="showPwd?'text':'password'" clearable placeholder="请输入密码"></van-field>
          <i class="iconfont">&#xe70b;</i>
          <i class="iconfont"
             :class="{ showP:showPwd }"
             @click="showPwd = !showPwd"
          >
            {{ showPwd?"&#xe722;":"&#xe723;"}}
          </i>
        </li>
        <li>
          <van-field v-model="userName.verifyCode" clearable placeholder="请输入验证码"></van-field>
          <i class="iconfont">&#xe713;</i>
          <div class="yanZ" @click="changeCodeImg">
            <img :src="codeImg" alt="点击重新获取" />
          </div>
        </li>
        <li>
          <div>
            <input type="checkbox" id="keep" v-model="keep" />
            <label for="keep">记住密码</label>
          </div>
          <router-link to="/servicePage">忘记密码？</router-link>
        </li>
        <li>
          <van-button class="submitBtn" @click="userNameLogin">登录</van-button>
          <van-button class="sw" @click="$router.push({name: 'register'})">立即注册</van-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { goLogin, Play, redPacket } from "../../api";
import { Base64 } from "js-base64";
import { mapGetters } from "vuex";
export default {
  name: "Login",
  data() {
    return {
      keep: false,
      codeImg: "",
      fromUrl: this.$route.query.redirect || "/",
      showPwd: false,
      userName: {
        username: "",
        password: "",
        verifyCode: ""
      }
    };
  },
  created() {
    this.codeImg = "/api/auth/captcha";
    this.userName.username = this.$cookies.get("username")
      ? Base64.decode(this.$cookies.get("username"))
      : "";
    if (this.$cookies.get("password")) {
      this.keep = true;
      this.userName.password = Base64.decode(this.$cookies.get("password"));
    }
    if (localStorage.getItem("loginWaitTime")) {
      this.loginWaitTime = localStorage.getItem("loginWaitTime");
      if (this.loginWaitTime > 0) {
        this.times();
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    changeCodeImg() {
      this.userName.verifyCode = "";
      this.codeImg = "/api/auth/captcha?" + Math.random();
    },
    userNameLogin() {
      /* 字段验证 */
      if (!this.userName.username) {
        return this.$toast("用户名不能为空");
      }
      if (!this.userName.password) {
        return this.$toast("密码不能为空");
      }
      if (!this.userName.verifyCode) {
        return this.$toast("请输入验证码");
      }
      /* 设置cookie */
      this.$cookies.set(
        "username",
        Base64.encode(this.userName.username),
        "7d"
      );
      if (this.keep) {
        this.$cookies.set(
          "password",
          Base64.encode(this.userName.password),
          "7d"
        );
      } else {
        if (this.$cookies.get("password")) this.$cookies.remove("password");
      }
      /* 登录 */
      goLogin(this.userName).then(res => {
        if (res.status) {
          this.$store.commit("SET_PASSWORD",Base64.encode(this.userName.password));
          this.$store.commit("SET_USER_INFO", res.data);
          this.$store.commit("SET_MY_BANK", []);
          if(this.fromUrl && this.fromUrl !== "/register" && this.fromUrl === "/redpack"){
            redPacket().then(res => {
              if (res.status) {
                this.$store.commit("SET_RED_PACK", res.data);
                return this.$router.replace({ path: this.fromUrl });
              } else {
                return this.$router.replace({ path: "/user" });
              }
            });
          }else {
            this.$router.replace({
              path: this.fromUrl
            });
          }
        } else {
          this.changeCodeImg();
          this.$toast(res.msg);
        }
      });
    },
    Play() {
      Play().then(res => {
        if (res.status) {
          this.$store.commit("SET_USER_INFO", res.data);
          this.$store.commit("SET_MY_BANK", []);
          this.$toast("试玩账号注册成功");
          if (this.fromUrl && this.fromUrl !== "/register" && this.fromUrl !== "/redpack" && this.fromUrl !== "/vip" && this.fromUrl !== "/yuebaoHome") {
            this.$router.replace({
              path: this.fromUrl
            });
          } else {
            this.$router.push({
              name: "home"
            });
          }
        } else {
          this.$toast(res.msg);
        }
      });
    },
  }
};
</script>

<style scoped lang="less">
.login {
  position: relative;
  .headerBox {
    color: #333;
    border-bottom: 1px solid #f0f0f0; /*no*/
  }
  .login-content {
    .user_name {
      padding-left: 20px;
      li {
        margin-top: 50px;
        overflow: hidden;
        position: relative;
        i {
          color: @ThemeColor;
          font-size: 50px;
          position: absolute;
          left: 30px;
          top: 50%;
          transform: translate(0, -50%);
          &:nth-child(3) {
            left: inherit;
            right: 120px;
            color: #aeaeae;
            &.showP {
              color: @ThemeColor;
            }
          }
        }
        &:nth-child(3) {
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
        &:nth-child(4) {
          margin-top: 30px;
          height: 35px;
          line-height: 35px;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          div {
            display: flex;
            align-items: center;
            input[type="checkbox"] {
              width: 28px;
              height: 28px;
              line-height: 28px;
              -webkit-appearance: none;
              .borderAll();
              text-align: center;
              margin: 0 10px 0 10px;
            }
            input[type="checkbox"]:checked {
              border: 1px solid @ThemeColor;
              background: #fff;
              color: @ThemeColor;
              line-height: 28px;
              &::after {
                content: "\2714";
                color: @ThemeColor;
                line-height: 28px;
              }
            }
            label {
              font-size: 25px;
            }
          }
          a {
            margin-right: 40px;
            font-size: 28px;
            color: @Forget-Pwd-Color;
          }
        }
      }
    }
    .submitBtn {
      margin-top: 15px;
    }
    .sw {
      margin-top: 30px;
      width: 690px;
      height: 90px;
      line-height: 90px;
      text-align: center;
      border: 1px solid @Loss; /*no*/
      border-radius: 90px;
      font-size: 38px;
      color: @Loss;
    }
    .van-cell.van-field {
      width: 695px;
      border-radius: 90px;
      background-color: @Login-Input-Bg;
      padding-left: 95px;
      font-size: 30px;
    }
  }
  .submitBtn {
    margin: 0;
  }
}
</style>
