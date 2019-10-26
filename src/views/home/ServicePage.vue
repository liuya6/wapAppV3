<template>
  <div class="servicePage" v-title="'客服中心'">
    <fixHead title="客服中心"></fixHead>
    <div class="content">
      <ul>
        <li v-for="(item, i) in list" :key="i">
          <div class="flexS" @click="go(item.title)">
            <i class="imgBox">
              <img :src="cdnImg(item.img)" alt />
            </i>
            <div class="wrap">
              <div class="text">
                <div>{{item.title}}</div>
                <p>{{item.tip}}</p>
              </div>
            </div>
            <i
              class="iconfont"
              :class="{rotateI:(openWechat&&i==2)||(openQQ&&i==1)||(openProblem&&i==3)}"
            >&#xe727;</i>
          </div>

          <div class="wechatWrap" v-if="openQQ&&item.title=='QQ客服'">
            <div class="box" v-if="allConfig.qqName1">
              <div>
                <img v-lazy="cdnImg('icons/qq0.png')" alt />
                <div class="nickname">{{allConfig.qqNickName1}}</div>
                <p>{{allConfig.qqName1}}</p>
                <div class="button" @click="qq(allConfig.qqName1)">点击进入</div>
              </div>
            </div>
            <div class="box" v-if="allConfig.qqName2">
              <div>
                <img :src="cdnImg('icons/qq1.png')" alt />
                <div class="nickname">{{allConfig.qqNickName2}}</div>
                <p>{{allConfig.qqName2}}</p>
                <div class="button" @click="qq(allConfig.qqName2)">点击进入</div>
              </div>
            </div>
            <div class="box" v-if="allConfig.qqName3">
              <div>
                <img v-lazy="cdnImg('icons/qq2.png')" alt />
                <div class="nickname">{{allConfig.qqNickName3}}</div>
                <p>{{allConfig.qqName3}}</p>
                <div class="button" @click="qq(allConfig.qqName3)">点击进入</div>
              </div>
            </div>
          </div>

          <div class="wechatWrap" v-if="openWechat&&item.title=='微信客服'">
            <div class="box" v-if="allConfig.wxName1">
              <div>
                <img v-lazy="allConfig.wxErweima1" alt />
                <div class="nickname">{{allConfig.wxNickName1}}</div>
                <p>{{allConfig.wxName1}}</p>
                <div
                  class="button"
                  v-clipboard:copy="allConfig.wxName1"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制微信号</div>
              </div>
            </div>
            <div class="box" v-if="allConfig.wxName2">
              <div>
                <img v-lazy="allConfig.wxErweima2" alt />
                <div class="nickname">{{allConfig.wxNickName2}}</div>
                <p>{{allConfig.wxName2}}</p>
                <div
                  class="button"
                  v-clipboard:copy="allConfig.wxName2"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制微信号</div>
              </div>
            </div>
            <div class="box" v-if="allConfig.wxName3">
              <div>
                <img v-lazy="allConfig.wxErweima3" alt />
                <div class="nickname">{{allConfig.wxNickName3}}</div>
                <p>{{allConfig.wxName3}}</p>
                <div
                  class="button"
                  v-clipboard:copy="allConfig.wxName3"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >复制微信号</div>
              </div>
            </div>
          </div>

          <div class="oftenProblem" v-if="openProblem&&item.title=='常见问题'">
            <div class="box" v-for="(item, i) in allConfig.oftenProblem" :key="i">
              <div class="indexBall flexC">{{i+1}}</div>
              <p>{{item.title}}</p>
              <div v-html="item.content"></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [
        {
          img: "icons/online.png",
          title: "在线客服",
          tip: "快速,便捷,及时提供沟通"
        },
        {
          img: "icons/qq.png",
          title: "QQ客服",
          tip: "海量用户的第一选择,优质的服务"
        },
        {
          img: "icons/weChat.png",
          title: "微信客服",
          tip: "一对一客服，给您最温馨的服务"
        },
        {
          img: "icons/question.png",
          title: "常见问题",
          tip: "常见问题咨询,智能,自助"
        }
      ],
      openQQ: false,
      openWechat: false,
      openProblem: false
    };
  },
  created() {
    console.log(this.allConfig, "this.allConfig");
    let noqq =
        !this.allConfig.qqName1 &&
        !this.allConfig.qqName2 &&
        !this.allConfig.qqName3,
      nowe =
        !this.allConfig.wxName1 &&
        !this.allConfig.wxName2 &&
        !this.allConfig.wxName3;
    if (noqq) {
      this.list.splice(1, 1);
      if (nowe) {
        this.list.splice(1, 1);
      }
    } else if (nowe) {
      this.list.splice(2, 1);
    }
  },
  methods: {
    go(title) {
      if (title == "在线客服") {
        this.$router.push({ name: "service" });
      } else if (title == "QQ客服") {
        this.openQQ = !this.openQQ;
        // let qq = this.allConfig.qqkefuGG;
        // window.open(
        //   "https://jlwz.cn/qq/?qq=" + qq,
        //   "_blank",
        //   "height=500, width=800, top=100, left=100"
        // );
      } else if (title == "微信客服") {
        this.openWechat = !this.openWechat;
      } else {
        this.openProblem = !this.openProblem;
      }
    },
    qq(qq) {
      window.open(
        "https://jlwz.cn/qq/?qq=" + qq,
        "_blank",
        "height=500, width=800, top=100, left=100"
      );
    },
    onCopy: function(e) {
      console.log(e);
      this.$toast("复制成功");
    },
    onError: function(e) {
      console.log(e);
      this.$toast("复制失败");
    }
  },
  computed: {
    ...mapGetters(["allConfig"])
  }
};
</script>
<style lang="less" scoped>
.servicePage {
  background: #efefef;
  min-height: 100%;
  .fixHead {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .content {
    padding: 140px 30px 30px 30px;
    ul {
      li {
        .flexS {
          background: #fff;
          width: 610px;
          margin: 30px auto 0;
          padding: 24px 40px 24px 40px;
          // box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.16);
          border-radius: 12px;
          position: relative;
          .imgBox {
            display: inline-block;
            width: 110px;
            height: 110px;
            margin-right: 40px;
          }
          .iconfont {
            position: absolute;
            font-size: 54px;
            top: 46px;
            right: 30px;
            color: #b4b4b4;
            transition: 0.4s;
          }
          .rotateI {
            transform: rotate(90deg);
          }
          .wrap {
            .text {
              div {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 8px;
              }
              p {
                font-size: 24px;
              }
            }
          }
        }
        .wechatWrap {
          width: 650px;
          height: 280px;
          padding: 20px;
          display: flex;
          background: #fff;
          border-radius: 0 0 14px 14px;
          margin-top: 8px;
          .box {
            flex: 1;
            margin-right: 16px;
            background: #efefef;
            > div {
              // width: 150px;
              margin-top: 10px;
              text-align: center;
              img {
                margin: 0 auto;
                width: 130px;
                height: 130px;
                // margin-left: 10px;
              }
              .nickname {
                color: #787472;
                padding: 8px 0;
              }
              p {
                margin-bottom: 8px;
              }
              .button {
                background: @ThemeColor;
                color: #fff;
                width: 150px;
                text-align: center;
                padding: 6px 0;
                border-radius: 40px;
                margin: 0 auto;
              }
            }
          }
          .box:last-child {
            margin-right: 0;
          }
        }
        .oftenProblem {
          width: 650px;
          padding: 20px;
          background: #fff;
          .box {
            background: #fff;
            border: 12px solid #efefef;
            position: relative;
            padding: 20px 10px 20px 66px;
            .indexBall {
              position: absolute;
              left: 16px;
              top: 26px;
              background: #747372;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              color: #fff;
            }
            p {
              font-size: 36px;
            }
            div {
              font-size: 28px;
              color: #8a8a8a;
              padding-right: 6px;
              padding-top: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
