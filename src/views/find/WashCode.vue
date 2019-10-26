<template>
  <div class="washCode" v-title="'实时洗码'">
    <div class="header">
      <i class="iconfont" @click="back">&#xe629;</i>
      <span>实时洗码</span>
      <div @click="$router.push({name:'aboutwashcode'})">
        <i class="iconfont">&#xe681;</i>
        <span>洗码比例</span>
      </div>
    </div>
    <div class="washCode-content" v-if="washCodeArr">
      <div class="title">
        <span>洗码总额</span>
        <span>{{toFixeds(washcodeCoin)}}</span>
        <van-button @click="getWashCodeMoney">一键领取</van-button>
      </div>
      <ul>
        <li v-for="(item,i) in washCodeArr" :key="i">
          <van-cell-group>
            <van-cell :value="toFixeds(item.totalWashcodeAmount)" is-link @click="goDetail(item.list,item.typeName,item.totalWashcodeAmount)">
              <template slot="title">
                <img v-lazy="item.typeImg" alt="" />
                {{item.typeName}}
              </template>
            </van-cell>
          </van-cell-group>
        </li>
      </ul>
      <div class="prompt">
        温馨提示：由于数据庞大部分游戏洗码不能及时，请耐心等待，正常一小时内会完成洗码，如有疑问请咨询<span @click="$router.push({name:'servicePage'})">在线客服</span>。
      </div>
    </div>
    <div v-else class="loading">
      <van-loading size="50px" color="#fea24d" vertical></van-loading>
      <div>拼命加载中...</div>
    </div>
  </div>
</template>

<script>
  import { washCodeStatistics,getWashcode } from "../../api";
  export default {
    name: "WashCode",
    data() {
      return {
        washcodeCoin: "",
        washCodeArr: ""
      }
    },
    created () {
      this.initWashCode();
    },
    methods: {
      goDetail(list,title,money) {
        this.$store.commit("SET_WASH_CODE_DETAIL",list);
        this.$router.push({name:'washcodedetail',params:{title:title,money:money}})
      },
      getWashCodeMoney() {
        if(this.toNum(this.washcodeCoin) <=0) {
          return this.$toast("金额不能小于1元");
        }
        getWashcode().then(res=>{
          console.log(res);
          this.$toast(res.msg);
          if(res.status) {
            this.initWashCode()
          }
        })
      },
      initWashCode() {
        washCodeStatistics().then(res=>{
          console.log(res);
          if(res.status) {
            this.washCodeArr = res.data.list;
            this.washcodeCoin = res.data.washcodeCoin;
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
.washCode {
  .header {
    width: 100%;
    height: 100px;
    line-height: 100px;
    position: fixed;
    left: 0;
    top: 0;
    background: @ThemeColor;
    text-align: center;
    font-size: 42px;
    color: #fff;
    z-index: 1;
    > i {
      position: absolute;
      font-size: 46px;
      left: 16px;
      padding: 0 10px;
    }
    > div {
      position: absolute;
      right: 30px;
      top: 0;
      font-size: 26px;
      i {
        font-size: 34px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
      }
    }
  }
  .washCode-content {
    padding-top: 100px;
    .title {
      height: 164px;
      line-height: 164px;
      position: relative;
      >span {
        font-size: 42px;
        &:nth-child(1) {
          margin-left: 40px;
          margin-right: 10px;
        }
        &:nth-child(2) {
          color: @red;
        }
      }
      .van-button {
        position: absolute;
        right: 32px;
        top: 50%;
        transform: translate(0,-50%);
        width: 193px;
        height: 64px;
        background-image: linear-gradient(90deg,
        #edc9a7 1%,
        #dda14b 100%),
        linear-gradient(
            #f67f3e,
            #f67f3e);
        background-blend-mode: normal,
        normal;
        border-radius: 10px;
        color: #7f500e;
      }
    }
    ul {
      border-top: 1px solid #f0f0f0; /*no*/
      li {
        border-bottom: 1px solid #f0f0f0;/*no*/
        .van-cell-group {
          .van-cell {
            height: 144px;
            display: flex;
            align-items: center;
            .van-cell__title {
              display: flex;
              font-size: 30px;
              color: #333;
              align-items: center;
              font-weight: bold;
              img {
                width: 65px;
                height: 65px;
                margin-right: 30px;
              }
            }
            .van-cell__value {
              font-size: 35px;
              color: #333333;
              margin-right: 20px;
            }
            .van-icon {
              font-size: 60px;
            }
          }
        }
      }
    }
    .prompt {
      padding: 0 38px;
      margin-top: 50px;
      color: #050505;
      font-size: 26px;
      span {
        color: @Forget-Pwd-Color;
      }
    }
  }
  .loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .van-loading {
      display: inline-block;
      margin-bottom: 15px;
    }
  }
}
</style>
