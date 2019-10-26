<template>
  <div class="chat">
    <ChatHeader></ChatHeader>
    <div class="chatContent"  :class="{ open: footerOpen == '1' }">
      <div class="chatScroll">
        <div>
          <span class="tips">{{tips}}</span>
        </div>
        <div>
          <span class="time">{{ userDetail && userDetail.createTime ? timestampToString(userDetail.createTime,1): ""}}</span>
        </div>
        <ul>
          <li v-for="(item,i) in message" :key="i">
            <template v-if="item.type=='1' || item.type == '2' || item.type=='3'">
              <div :class="item.oriented">
                <span class="imgBox">
                  <img :src="item.txImg" alt="" />
                </span>
                <div class="MsgContent">
                  <template v-if="item.type =='1'">
                    <p v-html="character(item.content.msg)"></p>
                  </template>
                  <template v-else-if="item.type == '2'">
                    <p class="imgP" @click="showImg(item.file ? item.file.url : item.content.msg)">
                      <ImgLoading :src="item.file ? item.file.url : item.content.msg" alt="" />
                    </p>
                  </template>
                  <template v-else>
                    <p v-html="item.content.msg"></p>
                  </template>
                  <b class="triangle"></b>
                </div>
              </div>
            </template>
            <template v-else>
              <template v-if="item.content.rechargeType =='1'">
                <div class="bank">
                   <span class="imgBox">
                     <img :src="item.txImg" alt="" />
                   </span>
                  <div class="bankContent" @click="goReceipt(item.content)">
                    <div>
                      <div>
                        <div>
                          <img :src="item.content.banklogo" alt="">
                        </div>
                        <div>
                          <p>银行卡充值</p>
                          <span>点击开始充值</span>
                        </div>
                      </div>
                      <p>收款</p>
                    </div>
                    <b class="triangle"></b>
                  </div>
                </div>
              </template>
              <template v-if="item.content.rechargeType =='2'">
                <div class="zfbMsg">
                  <span class="imgBox">
                    <img :src="item.txImg" alt="" />
                  </span>
                  <div class="zfbMsgContent" @click="goReceipt(item.content)">
                    <div>
                      <div>
                        <div>
                          <img :src="item.content.banklogo" alt="">
                        </div>
                        <div>
                          <p>支付宝充值</p>
                          <span>点击开始充值</span>
                        </div>
                      </div>
                      <p>收款</p>
                    </div>
                    <b class="triangle"></b>
                  </div>
                </div>
              </template>
              <template v-if="item.content.rechargeType =='3'">
                <div class="qrCode">
                  <span class="imgBox">
                     <img :src="item.txImg" alt="" />
                  </span>
                  <div class="qrCodeContent" @click="goReceipt(item.content)">
                    <div>
                      <div>
                        <div>
                          <img :src="item.content.banklogo" alt="">
                        </div>
                        <div>
                          <p>扫码充值</p>
                          <span>点击开始充值</span>
                        </div>
                      </div>
                      <p>收款</p>
                    </div>
                    <b class="triangle"></b>
                  </div>
                </div>
              </template>
            </template>
          </li>
        </ul>
      </div>
    </div>
    <ChatFooter></ChatFooter>
  </div>
</template>
<script>
const { ImagePreview } = window.vant;
import { mapGetters } from "vuex";
export default {
  name: 'Chat',
  created() {
    console.log("created");
    this.$nextTick(()=>{
      this.initScroll()
    });
  },
  activated() {
    console.log("activated");
    if(!this.message.length) {
      this.$nextTick(()=>{
        this.initScroll()
      });
      this.$store.commit("SET_TIPS","连接中，请稍等...");
      this.$store.commit("SET_USER_DETAIL","");
      this.$store.dispatch("initSDK");
    }
  },
  computed: {
    ...mapGetters(["message","userDetail","tips","footerOpen"])
  },
  methods: {
    goReceipt(msg) {
      this.$store.commit("SET_RECEIPT_DETAIL",msg);
      this.$nextTick(()=>{
        if(msg.rechargeType == "1") {
          this.$router.push({name:"bankReceipt"})
        }else {
          this.$router.push({name:"otherReceipt"})
        }
      })
    },
    showImg(url) {
      ImagePreview({
        images: [url],
        closeOnPopstate: true,
        showIndex: false
      });
    }
  }
}
</script>
<style scoped lang="less">
.chat {
  background-color: #f2f2f2;
  .chatContent {
    height: calc(100vh - 200px);
    overflow: hidden;
    margin-top: 100px;
    /*transition: 0.3s;*/
    &.open {
      height: calc(100vh - 500px);
    }
    .chatScroll {
      min-height: calc(100vh - 195px);
      >div {
        text-align: center;
        .tips {
          display: inline-block;
          background-color: #aaaaaa;
          margin: 10px 0;
          border-radius: 10px;
          padding: 10px 20px;
          color: #fff;
          font-size: 28px;
        }
        .time {
          font-size: 26px;
        }
      }
      ul {
        li {
          margin: 20px 20px;
          &:last-child {
            padding-bottom: 270px;
          }
          .left {
            display: flex;
            overflow: hidden;
            .imgBox {
              flex: 0 0 auto;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .MsgContent {
              max-width: calc(100vw - 240px);
              text-align: left;
              margin-left: 20px;
              position: relative;
              p {
                display: inline-block;
                text-align: left;
                border-radius: 5px;
                padding: 15px;
                font-size: 28px;
                line-height: 50px;
                background-color: #fff;
                margin-top: 5px;
                word-break: break-all;
                &.imgP {
                  min-width: 100px;
                  min-height: 100px;
                }
                img {
                  max-width: calc(100vw - 260px);
                }
              }
              .triangle {
                position: absolute;
                left: -23px;
                top: 40px;
                transform: translate(0,-50%);
                border: 6px solid transparent; /*no*/
                border-right-color: #fff;
              }
            }
          }
          .right {
            overflow: hidden;
            .imgBox {
              flex: 0 0 auto;
              float: right;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .MsgContent {
              max-width: calc(100vw - 240px);
              float: right;
              text-align: right;
              margin-right: 20px;
              position: relative;
              p {
                display: inline-block;
                background-color: rgb(158, 234, 106);
                border-radius: 5px;
                text-align: left;
                padding: 15px;
                font-size: 28px;
                line-height: 50px;
                word-break:break-all;
                &.imgP {
                  min-width: 100px;
                  min-height: 100px;
                }
                img {
                  max-width: calc(100vw - 260px);
                }
              }
              .triangle {
                position: absolute;
                right: -23px;
                top: 40px;
                transform: translate(0,-50%);
                border: 6px solid transparent; /*no*/
                border-left-color: rgb(158, 234, 106);
              }
            }
          }
          .zfbMsg {
            display: flex;
            overflow: hidden;
            .imgBox {
              flex: 0 0 auto;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .zfbMsgContent {
              text-align: left;
              margin-left: 20px;
              max-width: calc(100vw - 240px);
              background-color: #fff;
              border-radius: 5px;
              position: relative;
              >div {
                text-align: center;
                overflow: hidden;
                > div {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  padding: 20px;
                  background: linear-gradient(to bottom,#5db8fe,#bd80ff);
                  border-radius: 5px;
                  div {
                    color: #fff;
                    &:nth-child(1) {
                      width: 80px;
                      height: 80px;
                      line-height: 80px;
                      img {
                        width: 100%;
                        display: inline-block;
                        vertical-align: middle;
                      }
                    }
                    &:nth-child(2) {
                      padding: 0 30px;
                      text-align: left;
                      p {
                        font-size: 32px;
                      }
                    }
                  }
                }
                >p {
                  text-align: left;
                  line-height: 40px;
                  text-indent: 20px;
                  color: #999;
                }
              }
              .triangle {
                position: absolute;
                left: -25px;
                top: 40px;
                transform: translate(0,-50%);
                border: 6px solid transparent; /*no*/
                border-right-color: #5db8fe;
              }
            }
          }
          .qrCode {
            display: flex;
            overflow: hidden;
            .imgBox {
              flex: 0 0 auto;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .qrCodeContent {
              text-align: left;
              margin-left: 20px;
              max-width: calc(100vw - 240px);
              background-color: #fff;
              border-radius: 5px;
              position: relative;
              >div {
                text-align: center;
                overflow: hidden;
                > div {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  padding: 20px;
                  background: linear-gradient(to bottom,#5db8fe,#bd80ff);
                  border-radius: 5px;
                  div {
                    color: #fff;
                    &:nth-child(1) {
                      width: 80px;
                      height: 80px;
                      line-height: 80px;
                      img {
                        width: 100%;
                        display: inline-block;
                        vertical-align: middle;
                      }
                    }
                    &:nth-child(2) {
                      padding: 0 30px;
                      text-align: left;
                      p {
                        font-size: 32px;
                      }
                    }
                  }
                }
                >p {
                  text-align: left;
                  line-height: 40px;
                  text-indent: 20px;
                  color: #999;
                }
              }
              .triangle {
                position: absolute;
                left: -25px;
                top: 40px;
                transform: translate(0,-50%);
                border: 6px solid transparent; /*no*/
                border-right-color: #5db8fe;
              }
            }
          }
          .bank {
            display: flex;
            overflow: hidden;
            .imgBox {
              flex: 0 0 auto;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              overflow: hidden;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .bankContent {
              text-align: left;
              margin-left: 20px;
              max-width: calc(100vw - 240px);
              background-color: #fff;
              border-radius: 5px;
              position: relative;
              >div {
                text-align: center;
                overflow: hidden;
                > div {
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  align-items: center;
                  padding: 20px;
                  background: linear-gradient(to bottom,#5db8fe,#bd80ff);
                  border-radius: 5px;
                  div {
                    color: #fff;
                    &:nth-child(1) {
                      width: 80px;
                      height: 80px;
                      line-height: 80px;
                      img {
                        width: 100%;
                        display: inline-block;
                        vertical-align: middle;
                      }
                    }
                    &:nth-child(2) {
                      text-align: left;
                      margin-left: 20px;
                      p {
                        font-size: 32px;
                      }
                      span {
                        font-size: 24px;
                      }
                    }
                  }
                }
                >p {
                  text-align: left;
                  line-height: 40px;
                  text-indent: 20px;
                  color: #999;
                }
              }
              .triangle {
                position: absolute;
                left: -25px;
                top: 40px;
                transform: translate(0,-50%);
                border: 6px solid transparent; /*no*/
                border-right-color: #5db8fe;
              }
            }
          }
        }
      }
    }
  }
}
</style>
