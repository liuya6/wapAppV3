<template>
  <div class="fmLottery" v-if="recommendLottery">
    <ul>
      <li v-for="(item,i) in recommendLottery"
          :key="i"
          @click="playLottery(item.id,item.classify,item.title)"
      >
        <van-cell is-link>
          <template slot="title">
            <div class="left">
              <i class="imgBox">
                <img v-lazy="item.img" alt="" />
              </i>
              <div class="detail">
                <div>
                  <span>{{item.title}}</span>
                  <span>{{item.description}}</span>
                  <div><Timer :time="item.actionTime - item.nowTime"></Timer></div>
                </div>
                <div>
                  <span>第{{item.actionNo}}期</span>
                  <span>开奖号</span>
                </div>
              </div>
            </div>
            <div class="right">
              <template v-if="item.code && item.code.length">
                <span v-for="(code,j) in item.code.split(',')" :key="j">{{code}}</span>
              </template>
              <template v-else>
                <span>等</span>
                <span>待</span>
                <span>开</span>
                <span>奖</span>
              </template>
            </div>
          </template>
        </van-cell>
      </li>
    </ul>
    <div v-if="recommendQG" class="recommendQG" @click="playGame(recommendQG.classify,recommendQG.typeKey,recommendQG.isHall,recommendQG.link,recommendQG.title)">
      <van-cell is-link>
        <template slot="title">
          <div class="left">
            <i class="imgBox">
              <img :src="recommendQG.img" alt="" />
            </i>
            <div>
              <p>{{recommendQG.title}}</p>
              <span>{{recommendQG.content}}</span>
            </div>
          </div>
          <div class="right">
            <van-button>去游戏</van-button>
          </div>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
  import { recommendGame } from "../../api";
  export default {
    name: "FmLottery",
    data() {
      return {
        recommendLottery: "",
        recommendQG: "",
        timer: null
      }
    },
    created () {
      this.recommendGames();
      this.times();
    },
    destroyed() {
      clearInterval(this.timer);
    },
    watch: {
      $route(val) {
        console.log(val,"fm---------------");
        if(val.name == "home") {
          this.times();
        }else {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
    methods: {
      recommendGames() {
        recommendGame().then(res=>{
          console.log(res,"福民首页彩票数据-----------------------");
          if(res.status) {
            this.recommendLottery = res.data.recommendLottery;
            if(!this.recommendQG){
              this.recommendQG = res.data.recommendQG;
            }
          }
        })
      },
      times() {
        if(this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
        this.timer = setInterval(()=>{
          this.recommendGames();
        },9000)
      }
    }
  }
</script>

<style scoped lang="less">
.fmLottery {
  width: 100%;
  ul {
    width: 100%;
    li {
      border-bottom: 1px solid #f0f0f0; /*no*/
      .van-cell {
        padding: 10px 0;
        line-height: normal;
        height: 110px;
        .van-cell__title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .left {
            display: flex;
            align-items: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            .imgBox {
              display: inline-block;
              width: 70px;
              height: 70px;
              border-radius: 50%;
              margin: 0 12px 0 15px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .detail {
              div {
                &:nth-child(1) {
                   > span {
                    color: #c1bdc5;
                    &:nth-child(1) {
                      color: #333;
                    }
                    &:nth-child(2) {
                      font-size: 22px;
                      margin-left: 8px;
                    }
                  }
                  div {
                    span {
                      font-size: 22px;
                      color: #c1bdc5;
                    }
                  }
                }
                &:nth-child(2) {
                  font-size: 22px;
                  color: #c1bdc5;
                }
              }
            }
          }
          .right {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 20px;
            flex-wrap: wrap;
            width: 210px;
            span {
              width: 35px;
              height: 35px;
              border: 1px solid #ffd89c; /*no*/
              background: @ThemeColor;
              color: #fff;
              text-align: center;
              line-height: 35px;
              border-radius: 50%;
              font-size: 22px;
            }
          }
        }
        .van-icon {
          display: none;
        }
      }
    }
  }
  .recommendQG {
    border-bottom: 1px solid #f0f0f0; /*no*/
    .van-cell {
      padding: 10px 0;
      line-height: normal;
      height: 110px;
      .van-cell__title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .imgBox {
            display: inline-block;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin: 0 12px 0 15px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          div {
            p {
              color: #333;
            }
            span {
              color: #c1bdc5;
              font-size: 22px;
            }
          }
        }
        .right {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 210px;
          margin-right: 20px;
          .van-button {
            display: inline-block;
            width: 150px;
            height: 60px;
            background-color: @ThemeColor;
            border-radius: 60px;
            color: #fff;
          }
        }
      }
      .van-icon {
        display: none;
      }
    }
  }
}
</style>
