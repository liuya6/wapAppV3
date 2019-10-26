<template>
  <div class="tgManagement flex" v-title="'推广管理'">
    <div class="top">
      <i class="iconfont back" @click="$router.push({name:'recommend'})">&#xe629;</i>
      <span v-for="(item,i) in tabTitle" :key="i"
            :class="{on:activeType === item.type}"
            @click.stop="changeTab(item.type)"
      >{{item.title}}</span>
      <i class="iconfont right" @click="addLnk">&#xe71f;</i>
    </div>
    <template v-if="activeType === 'share'">
      <div class="content share">
        <div>
          <span>推广名称</span>
          <span>生成时间</span>
          <span>状态</span>
          <span>操作</span>
        </div>
        <ul v-if="tgManagementList.length">
          <li
              v-for="(item,i) in tgManagementList"
              :key="i"
          >
            <!--
              @click="tgDetails(item)"
            -->
            <div>
              <span>{{item.name}}</span>
              <span>{{timestampToString(item.createtime)}}</span>
              <span :class="{highlight:toNum(item.memberRegisterCount) > 0}">注册（{{item.memberRegisterCount}}）</span>
              <span @click="delLink(item.id,item.name)">删除推广码</span>
            </div>
            <div>
              <div @click="qrCodes(item)">
                <p>
                  <vue-qr :text="myUrl+'/register/?promotionCode='+ item.code"  crossOrigin="anonymous" dotScale="1" />
                </p>
                <span>
                点击放大保存
              </span>
              </div>
              <div>
                <p>
                  <span>我的游戏代理返点</span>
                  <span class="red hold"
                        @click="$router.push({name:'rebateDetail',params:{id: item.id}})"
                  >查看详情</span>
                </p>
                <p>
                  <span>{{ myUrl+'/register/?promotionCode='+item.code }}</span>
                  <span class="blue hold"
                        v-clipboard:copy="myUrl+'/register/?promotionCode='+item.code"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                  >分享邀请链接</span>
                </p>
                <p>
                  <span>我的邀请ID：<b>{{ item.code }}</b></span>
                  <span class="theme hold"
                        v-clipboard:copy="item.code"
                        v-clipboard:success="onCopy"
                        v-clipboard:error="onError"
                  >复制邀请ID</span>
                </p>
              </div>
            </div>
            <div class="kh" v-show="isKh" @click.stop="gotoKh(item)">
              <div>
                <i class="iconfont">&#xe71f;</i>
                <span>点击直接开户</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="noData" v-if="noData">
          <div class="content_box">
            <div>
              <p><img :src="commonImg('default/noData.png')" alt="" /></p>
              <h4>暂无记录</h4>
            </div>
          </div>
        </div>
      </div>
      <footer>
        <h3>温馨提示：</h3>
        <p>
          1.推荐使用二维码推广，如您复制推广链接进行推广，请提醒用户使用浏览器打开，以防被微信或QQ拦截！
        </p>
        <p>
          2.最多只能添加10条链接。
        </p>
      </footer>
    </template>
    <template v-else>
      <div class="kh content">
        <ul>
          <li>
            <van-field v-model="user.username" clearable placeholder="用户名5~15个的字母或数字组合"></van-field>
            <i class="iconfont">&#xe70e;</i>
          </li>
          <li>
            <van-field
                v-model="user.password"
                type="password"
                clearable
                placeholder="6~18个可包含大小写字母、数字、下划线_的组合"
            ></van-field>
            <i class="iconfont">&#xe70b;</i>
          </li>
          <li>
            <van-field v-model="user.password_confirm" type="password" clearable placeholder="请确认密码"></van-field>
            <i class="iconfont">&#xe708;</i>
          </li>
          <li class="code">
            <van-field v-model="user.verifyCode" clearable placeholder="请输入验证码"></van-field>
            <i class="iconfont">&#xe713;</i>
            <div class="yanZ">
              <img :src="codeImg" alt="点击重新获取" @click="changeCode" />
            </div>
          </li>
        </ul>
        <div class="btnBox">
          <van-button class="submitBtn" @click="goKh">立即注册</van-button>
        </div>
      </div>
    </template>
<!--    <van-popup v-model="operating" class="popup" position="bottom">-->
<!--      <ul>-->
<!--        <li @click="qrCodes" class="hold">查看二维码</li>-->
<!--        <li class="hold"-->
<!--            v-clipboard:copy="myUrl+'/register/?promotionCode='+activeArr.code"-->
<!--            v-clipboard:success="onCopy"-->
<!--            v-clipboard:error="onError"-->
<!--        >复制推广链接</li>-->
<!--        <li @click="$router.push({name:'rebateDetail',params:{id: activeArr.id}})" class="hold">返点详情</li>-->
<!--        <li class="hold" @click="delLink">删除推广码</li>-->
<!--      </ul>-->
<!--    </van-popup>-->
    <transition name="fadeUp">
      <div v-if="imgShow" class="imgShow" @click="imgShow = false">
        <QrCode :myUrl="myUrl+'/register/?promotionCode='+activeArr.code" :code="activeArr.code"></QrCode>
      </div>
    </transition>
  </div>
</template>

<script>
  const tabTitle = [
    {
      title: "分享链接",
      type: "share"
    },
    {
      title: "直接开户",
      type: "kh"
    }
  ];
  import { getLinksList, deleteLinks, registerKh } from "../../api";
  export default {
    name: "TgManagement",
    data() {
      return {
        tabTitle,
        tgManagementList: [],
        operating: false,
        imgShow: false,
        noData: false,
        activeArr: [],
        myUrl: window.location.origin,
        activeType: "share",
        isKh: false,
        codeImg: "",
        user: {
          username: "",
          password: "",
          password_confirm: "",
          verifyCode: "",
          promotionCode: ""
        }
      }
    },
    created() {
      this.getLinksLists();
      window.addEventListener("click",()=>{
        if(this.isKh) {
          this.isKh = false;
        }
      })
    },
    methods: {
      changeTab(type) {
        if(type === "share") {
          this.isKh = false;
          this.activeType = type;
        }else {
          this.isKh = !this.isKh;
        }
      },
      changeCode() {
        this.user.verifyCode = "";
        this.codeImg = "/api/auth/captcha?" + Math.random();
      },
      goKh() {
        if (!this.user.username) {
          return this.$toast("用户名不能为空");
        } else {
          if (!/^[a-zA-Z0-9_-]{5,15}$/.test(this.user.username)) {
            return this.$toast("请按照要求填写用户名（5~15个字母或数字）");
          }
        }
        if (!this.user.password || !this.user.password_confirm) {
          return this.$toast("密码不能为空");
        } else {
          if (
            !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,18}$/.test(
              this.user.password
            )
          ) {
            return this.$toast("请按要求填写密码（6~16个包含大小写字母、数字、下划线_的组合）");
          } else {
            if (this.user.password !== this.user.password_confirm) {
              return this.$toast("两次输入的密码不同");
            }
          }
        }
        if (!this.user.verifyCode) {
          return this.$toast("请输入验证码");
        }
        this.user.promotionCode = this.activeArr.code;
        registerKh(this.user).then(res=>{
          this.$toast(res.msg);
          if(res.status) {
            this.activeType = "share";
            this.getLinksLists()
          }else {
            this.changeCode()
          }
        })
      },
      gotoKh(arr) {
        this.activeArr = arr;
        this.activeType = "kh";
        this.codeImg = "/api/auth/captcha";
        this.user = {
          username: "",
          password: "",
          password_confirm: "",
          verifyCode: "",
          promotionCode: ""
        }
      },
      qrCodes(arr) {
        this.activeArr = arr;
        // this.operating = false;
        this.imgShow = true;
      },
      getLinksLists() {
        getLinksList().then(res=>{
          console.log(res);
          if(res.status) {
            this.tgManagementList = res.data.list;
            if(!this.tgManagementList.length) {
              this.noData = true;
            }else {
              this.noData = false;
            }
          }
        })
      },
      // tgDetails(arr) {
      //   // this.operating = true;
      //   this.activeArr = arr;
      // },
      delLink(id,name) {
        this.$dialog.confirm({
          title: "提示",
          message: "确定删除名称为"+name+"的推广链接吗?"
        }).then(()=>{
          deleteLinks({id:id}).then(res=>{
            console.log(res);
            this.operating = false;
            if(res.status) {
              this.$toast("删除成功");
              this.getLinksLists()
            }else {
              this.$toast("删除失败");
            }
          })
        }).catch(()=>{
          console.log("取消");
        })
      },
      addLnk() {
        if(this.tgManagementList.length >= 10) {
          return this.$toast("最多只能添加10条推广链接噢！")
        }
        this.$router.push({name:"addLink"})
      },
      onCopy: function() {
        this.$toast("复制成功");
        this.operating = false;
      },
      onError: function() {
        this.$toast("复制失败");
      },
    }
  }
</script>

<style scoped lang="less">
.tgManagement {
  background-color: #f8f8f8;
  .top {
    background: @Amount-Out-Btn;
    width: 100%;
    height: 100px;
    overflow: hidden;
    color: #fff;
    text-align: center;
    line-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 28px;
      display: inline-block;
      width: 130px;
      height: 60px;
      line-height: 60px;
      background-color: @ThemeColor;
      color: #fff;
      &:nth-child(2) {
        border-radius: 60px 0 0 60px;
      }
      &:nth-child(3) {
        border-radius: 0 60px 60px 0;
      }
      &.on {
        background-color: #fff;
        color: #333;
      }
    }
    i {
      font-size: 46px;
    }
    .back {
      position: absolute;
      padding: 0 10px;
      left: 16px;
    }
    .right {
      position: absolute;
      top: 0;
      right: 20px;
      padding: 0 10px;
    }
  }
  .share {
    >div:not(.noData) {
      display: flex;
      height: 80px;
      align-items: center;
      span {
        flex: 0 0 auto;
        width: 25%;
        text-align: center;
        font-size: 28px;
      }
    }
    ul {
      li {
        background-color: #fff;
        border-bottom: 1px solid #f0f0f0; /*no*/
        padding-bottom: 10px;
        position: relative;
        /*margin-bottom: 10px;*/
        >div {
          width: 100%;
          &.kh {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            div {
              display: flex;
              flex-direction: column;
              text-align: center;
              i {
                font-size: 200px;
                color: #fff;
              }
              span {
                color: #fff;
                font-size: 28px;
              }
            }
          }
          &:nth-child(1) {
            height: 100px;
            display: flex;
            align-items: center;
            font-size: 28px;
            span {
              flex: 0 0 auto;
              width: 25%;
              text-align: center;
              white-space: normal;
              color: #666;
              &:first-child {
                color: @Loss;
              }
              &:last-child {
                color: @red;
              }
              &.highlight {
                color: @ThemeColor;
              }
            }
          }
          &:nth-child(2) {
            display: flex;
            justify-content: space-around;
            >div {
              text-align: center;
              &:nth-child(1) {
                border: 1px solid #eaeaea; /*no*/
                padding: 5px;
                text-align: center;
                p {
                  width: 180px;
                  height: 180px;
                  margin: auto;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
                span {
                  font-size: 24px;
                  color: #333;
                }
              }
              &:nth-child(2) {
                text-align: left;
                font-size: 25px;
                p {
                  margin-bottom: 15px;
                  &:last-child {
                    margin-bottom: 0;
                  }
                  span {
                    &:nth-child(1) {
                      display: inline-block;
                      width: 280px;
                      height: 60px;
                      background-color: #e2e2e2;
                      line-height: 60px;
                      padding-left: 10px;
                      border-radius: 8px;
                      color: #333;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      b {
                        color: @ThemeColor;
                      }
                    }
                    &:nth-child(2) {
                      display: inline-block;
                      width: 200px;
                      height: 60px;
                      vertical-align: top;
                      margin-left: 10px;
                      text-align: center;
                      line-height: 60px;
                      color: #fff;
                      border-radius: 8px;

                      &.red {
                        background-color: @red;
                      }
                      &.blue {
                        background-color: @Loss;
                      }
                      &.theme {
                        background-color: @ThemeColor;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  footer {
    padding: 20px;
    color: @red;
    line-height: 40px;
  }
  .kh {
    background-color: #fff;
    ul {
      padding-left: 20px;
      li {
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
    .van-cell.van-field {
      width: 695px;
      border-radius: 90px;
      background-color: @Login-Input-Bg;
      padding-left: 95px;
      font-size: 30px;
    }
    .btnBox {
      margin-top: 100px;
    }
  }
  /*.popup {*/
  /*  ul {*/
  /*    li {*/
  /*      height: 100px;*/
  /*      line-height: 100px;*/
  /*      text-align: center;*/
  /*      border-bottom: 1px solid #f0f0f0; !*no*!*/
  /*      color: #333;*/
  /*      font-size: 26px;*/
  /*      &:last-child {*/
  /*        border: none;*/
  /*      }*/

  /*    }*/
  /*  }*/
  /*}*/
  .imgShow {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.6);
  }
}
</style>