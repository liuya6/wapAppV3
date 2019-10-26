<template>
  <div class="aboutWashCode" v-title="'洗码比例'">
    <Header title="洗码比例"></Header>
    <div class="aboutWashCodeContent" v-if="washCodeRate">
      <van-tabs v-model="activeName" sticky swipeable @change="change">
        <van-tab v-for="(item,i) in tabList" :key="i" :title="item.title" :name="item.type">
          <div class="detail">
            <div class="title">
              <div>
                <i class="iconfont">&#xe612;</i>
                <span>游戏厅洗码明细</span>
              </div>
<!--              <ul>-->
<!--                <li v-for="(list,k) in gameList" :key="k">-->
<!--                  {{list}}-->
<!--                </li>-->
<!--              </ul>-->
            </div>
            <dl v-for="(item,i) in washCodeRate" :key="i">
              <dt :class="i">
                <span>{{item.typeName}}</span>
              </dt>
              <dd v-for="(child,j) in item.list" :key="j">
                <div>
                  <span>{{child.name}}</span>
                  <span>{{child.rate}}</span>
                </div>
              </dd>
            </dl>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div v-else class="loading">
      <van-loading size="50px" color="#fea24d" vertical></van-loading>
      <div>拼命加载中...</div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { washCodeRateList } from "../../api";
  export default {
    name: "AboutWashCode",
    data() {
      return {
        activeName: "0",
        tabList: [
          { title: "当前等级",type: "currentWashcodeRate" },
          { title: "下一等级",type: "nextWashcodeRate" }
        ],
        washCodeRate: ''
      }
    },
    created () {
      washCodeRateList().then(res=> {
        console.log(res,"washCodeRateArr洗码比例分类");
        if(res.status) {
          this.$store.commit("SET_WASH_CODE_RATE_ARR", res.data);
          this.washCodeRate = res.data.currentWashcodeRate;
        }
      })
    },
    computed: {
      ...mapGetters(["washCodeRateArr"]),
      // gameList() {
      //   let list = [];
      //   for (let [key, value] of Object.entries(this.washCodeRateArr.currentWashcodeRate )) {
      //     console.log(`${key}: ${value.typeName}`);
      //     list.push(value.typeName.replace("游戏",""))
      //   }
      //   console.log(list);
      //   return list;
      // }
    },
    methods: {
      change(index) {
        this.washCodeRate = this.washCodeRateArr[index];
      }
    }
  }
</script>

<style scoped lang="less">
.aboutWashCode {
  min-height: 100%;
  background: #f1f1f1;
  .headerBox {
    background: @ThemeColor;
    color: #fff;
  }
  .aboutWashCodeContent {
    .detail {
      padding: 30px 25px;
      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28px;
        > div {
          display: flex;
          align-items: center;
          i {
            color: #a185fd;
            font-size: 35px;
            margin-right: 5px;
          }
          span {
            color: #333;
          }
        }
        ul {
          display: flex;
          li {
            font-size: 22px;
            color: #666666;
            padding: 0 10px 0 10px;
            position: relative;
            &:last-child {
              &:after {
                content: none;
              }
            }
            &:after {
              content: "";
              width: 1px; /*no*/
              height: 20px;
              position: absolute;
              background-color: #838080;
              right: 0;
              top: 50%;
              transform: translate(0,-50%);
            }
          }
        }
      }
      dl {
        margin-top: 24px;
        border: 1px solid #e5e9f2; /*no*/
        border-bottom: none;
        box-sizing: border-box;
        overflow: hidden;
        background-color: #fff;
        box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
        dt {
          height: 89px;
          line-height: 89px;
          font-size: 28px;
          background-color: #f6f6f6;
          color: #666666;
          padding-left: 37px;
          position: relative;
          &:after {
            content: "";
            width: 5px;
            height: 36px;
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translate(0,-50%);
          }
          &.lottery {
            &:after {
              background-color: #dc001a;
            }
          }
          &.chess {
            &:after {
              background-color: #1978fa;
            }
          }
          &.slots {
            &:after {
              background-color: @ThemeColor;
            }
          }
          &.casino {
            &:after {
              background-color: #1b7606;
            }
          }
          &.fishing {
            &:after {
              background-color: #05edda ;
            }
          }
          &.sports {
            &:after {
              background-color: #a029fb;
            }
          }
        }
        dd {
          float: left;
          width: 50%;
          height: 90px;
          border-bottom: 1px solid #dddada; /*no*/
          position: relative;
          &:after {
            content: "";
            width: 1px;
            height: 58px;
            background-color: #dddada;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translate(0,-50%);
          }
          &:last-child {
            border-bottom: none;
            &:after {
              content: none;
            }
          }
          &:nth-of-type(2n) {
            border-bottom: 1px solid #dddada; /*no*/
          }
          div {
            height: 60px;
            position: absolute;
            top: 50%;
            left: 36px;
            transform: translate(0,-50%);
            span {
              display: block;
              height: 30px;
              line-height: 30px;
              font-size: 24px;
            }
          }
        }
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
