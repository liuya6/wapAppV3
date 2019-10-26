<template>
  <div class="footer" :class="{open:footerOpen == '1' }">
    <div class="quickReply">
      <dl>
        <dd v-for="(item,i) in autoReply" :key="i" class="hold" @click="quickSend(item)">{{item}}</dd>
      </dl>
    </div>
    <div class="middle">
      <span @click.stop="openMenu">
        <i class="iconfont" :class="{rotate:footerOpen == '1'}">&#xe71f;</i>
      </span>
      <p :class="{active:inputActive}">
        <textarea
            :rows = "inputActive ? '2' : '1'"
            placeholder="点击输入信息..."
            @blur="inputActive = false"
            @focus="inputActive = true"
            v-model="myMessage" >
        </textarea>
      </p>
      <b @click="send">发送</b>
    </div>
    <div class="menu" @click.stop>
      <div class="list">
        <p @click="uploaderOpen">
          <i class="iconfont">&#xe648;</i>
          <span>图片</span>
        </p>
        <p @click="emojiShow = true">
          <i class="iconfont">&#xe683;</i>
          <span>表情</span>
        </p>
      </div>
      <div v-show="emojiShow" class="emoji">
        <VEmojiPicker :pack="emojisNative" labelSearch="Search" @select="onSelectEmoji"/>
        <i class="iconfont" @click="emojiShow = false">&#xe753;</i>
      </div>
    </div>
    <transition name="fadeUp">
      <div class="uploaderBox" v-show="uploaderShow" @click.stop>
        <div class="uploader">
          <h1>
            <div @click="uploaderClose">
              <i class="iconfont">&#xe629;</i>
              <span>返回</span>
            </div>
            上传支付截图
          </h1>
          <div>
            <div v-if="imgFile" class="uploaderImg">
              <img :src="imgFile" alt="" />
              <b class="iconfont" @click="imgFile = ''">&#xe622;</b>
            </div>
            <div>
              <input type="file" @change="uploaderImage" ref="inputFile" />
              <i class="iconfont">&#xe71f;</i>
            </div>
          </div>
          <div @click="uploader">
            <i class="iconfont">&#xe7f4;</i>
            <span>确认上传</span>
          </div>
          <p><b>提示：</b>返回->订单查询->订单列表；选择订单查看信息</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import VEmojiPicker from "v-emoji-picker";
  import packEmoji from "v-emoji-picker/data/emojis.js";
  import { mapGetters } from "vuex";
  import { rechargeAutoReply } from "../../api";
  export default {
    name: "ChatFooter",
    data() {
      return {
        inputActive: false,
        imgFile: "",
        myMessage: "",
        emojiShow: false
      }
    },
    created() {
      window.document.addEventListener("click",()=>{
        if(this.footerOpen =="1") {
          this.$store.commit("SET_FOOTER_OPEN",0);
          this.initScrollBtm()
        }
      })
    },
    components: {
      VEmojiPicker
    },
    computed: {
      ...mapGetters(["message","uploaderShow","to","autoReply","currentOrderId","footerOpen"]),
      emojisNative() {
        return packEmoji;
      }
    },
    methods: {
      onSelectEmoji(dataEmoji) {
        this.myMessage += dataEmoji.emoji;
      },
      openMenu() {
        if(this.footerOpen =="1") {
          this.$store.commit("SET_FOOTER_OPEN",0);
        }else {
          this.emojiShow = false;
          this.$store.commit("SET_FOOTER_OPEN",1);
        }
        this.initScrollBtm()
      },
      initScrollBtm() {
        this.$nextTick(()=> {
          this.$scroll.refresh();
          setTimeout(()=> {
            window._vue.scrollBtm()
          },30);
        });
      },
      uploaderOpen() {
        this.imgFile = "";
        this.$store.commit("SET_UPLOADER_SHOW",true)
      },
      uploaderClose() {
        this.$store.commit("SET_UPLOADER_SHOW",false);
        this.imgFile = "";
      },
      quickSend(content) {
        let parameter = {
          id: this.currentOrderId,
          recv: content
        };
        rechargeAutoReply(parameter).then(res=>{
          if(!res.status) {
            this.$toast(res.code)
          }
        })
      },
      send() {
        if(!this.myMessage) {
          return false
        }
        let msg = {
          type: 1,
          msg: this.myMessage
        };
        let msgObj = {
          type: "custom",
          scene: "team",
          to: this.to,
          content: msg,
        };
        this.$store.dispatch("sendMsg",msgObj);
        this.myMessage = "";
      },
      uploaderImage(e) {
        e = window.event || e;
        let file = e.target.files[0];
        if(file) {
          if(/\.(jpe?g|png|gif)$/i.test(file.name)) {
            console.log("111111111");
            this.file = file;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let _this = this;
            reader.onload = function() {
              _this.imgFile = this.result;
            };
          }else {
            return this.$toast("只能上传图片（jpg/png）噢！");
          }
        }
      },
      uploader() {
        if(!this.imgFile) {
          return this.$toast("请选择上传图片");
        }
        let ipt = this.$refs.inputFile;
        this.$store.dispatch('sendFileMsg', {
          scene: "team",
          to: this.to,
          fileInput: ipt
        })
      }
    }
  }
</script>

<style scoped lang="less">
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: #f6f6f6;
  &.open {
    height: 400px;
  }
  .quickReply {
    position: absolute;
    top: -100px;
    z-index: 1;
    background-color: #f2f2f2;
    height: 100px;
    dl {
      max-width: 100vw;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      overflow-x: scroll;
      dd {
        border: 1px solid #fea24d; /*no*/
        border-radius: 10px;
        margin: 20px 0 20px 20px;
        padding: 10px 20px;
        white-space: nowrap;
        color: #ff4f31;
        font-size: 28px;
        background-color: #fff;
      }
    }
  }
  .middle {
    display: flex;
    align-items: center;
    height: 100px;
    >span {
      flex: 0 0 auto;
      display: inline-block;
      border: 2px solid #fea24d; /*no*/
      border-radius: 50%;
      /*padding: 2px;*/
      margin: 0 20px;
      width: 55px;
      height: 55px;
      text-align: center;
      line-height: 55px;
      i {
        display: inline-block;
        font-size: 45px;
        color: #ff4f31;
        &.rotate {
          transform: rotate(45deg);
        }
      }
    }
    >p {
      flex: 1;
      border-bottom: 2px solid silver;
      padding-left: 10px;
      height: 80px;
      display: flex;
      align-items: center;
      &.active {
        border-bottom-color: #fea24d;
      }
      textarea {
        width: 100%;
        height: 50px;
        font-size: 28px;
        border: 0;
        background-color: #f6f6f6;
      }
    }
    >b {
      width: 140px;
      height: 80px;
      background-color: #fea24d;
      text-align: center;
      border-radius: 7px;
      line-height: 80px;
      color: #fff;
      margin: 0 10px;
      font-size: 30px;
      font-weight: normal;
    }
  }
  .menu {
    width: 100%;
    height: 300px;
    background-color: #fff;
    position: relative;
    border-top: 1px solid #f0f0f0; /*no*/
    box-sizing: border-box;
    .list {
      width: 100%;
      height: 100%;
      display: flex;
      p {
        flex: 0 0 auto;
        width: 150px;
        height: 150px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        i {
          font-size: 55px;
          color: #666;
        }
        span {
          font-size: 26px;
          margin-top: 5px;
          color: #999;
        }
      }
    }
    .emoji {
      position: absolute;
      bottom: 0;
      z-index: 10;
      i {
        position: absolute;
        right: 0;
        top: 0;
        width: 10%;
        height: 50px;
        font-size: 40px;
        line-height: 50px;
        text-align: center;
        /*color: #999;*/
        color: #ff4f31;
      }
    }
  }
  .uploaderBox {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
    z-index: 2;
    .uploader {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      h1 {
        background-color: #333;
        color: #fff;
        text-align: center;
        height: 80px;
        line-height: 80px;
        font-size: 30px;
        overflow: hidden;
        div {
          position: absolute;
          left: 20px;
          height: 80px;
          i {
            font-size: 30px;
          }
        }
      }
      div {
        &:nth-child(2) {
          width: 350px;
          height: 350px;
          margin: 30px auto;
          position: relative;
          background-color: #f0f0f0;
          border-radius: 10px;
          div {
            &.uploaderImg {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              right: 0;
              z-index: 3;
              img {
                width: 100%;
                height: 100%;
              }
              b {
                position: absolute;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.6);
                font-size: 35px;
                font-weight: normal;
                color: #fff;
                padding: 5px;
              }
            }
            input {
              width: 350px;
              height: 350px;
              opacity: 0;
              position: relative;
              z-index: 2;
            }
            i {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%,-50%);
              margin: auto;
              font-size: 180px;
              color: #cdcdcd;
            }
          }
        }
        &:nth-child(3) {
          width: 300px;
          height: 60px;
          background-color: #ff4f31;
          margin: 0 auto 30px;
          color: #fff;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          i {
            font-size: 40px;
          }
        }
      }
      p {
        white-space: nowrap;
        padding: 0 30px;
        margin-bottom: 30px;
        color: #666;
        b {
          color: #ff4f31;
        }
      }
    }
  }
}
</style>
