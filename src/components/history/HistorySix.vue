<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
    >
      <div v-if="!lotteryArr.length && !noData" class="load">
        <van-loading size="50px" color="#fea24d" vertical></van-loading>
        <div>拼命加载中...</div>
      </div>
      <ul class="six" v-if="lotteryArr.length">
        <li v-for="(item, i) in lotteryArr" :key="i">
          <p>
            <span>第{{ item.number }}期</span>
          </p>
          <p>
            <span
              v-for="(child, j) in handleCodeItem(item.codeData)"
              :key="j"
              :style="{ backgroundColor: child.color }"
              :class="{ add: child.code === '+' }"
            >
              {{ child.code }}
            </span>
          </p>
          <p>
            <span
              v-for="(child, j) in handleCodeItem(item.codeData)"
              :key="j"
              :class="{ reduce: child.zodiac === '-' }"
            >
              {{ child.zodiac }}
            </span>
          </p>
        </li>
      </ul>
      <div v-if="noData" class="noData">
        <div class="content_box">
          <div>
            <p><img :src="commonImg('default/noData.png')" alt="记录为空" /></p>
            <h4>暂无记录</h4>
          </div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
  import { lotteryHistory } from "../../api";
  export default {
    name: "HistorySix",
    data() {
      return {
        isLoading: false, // 下拉刷新
        loading: false, // 上拉加载更多
        finished: false, // 上拉加载是否完成判断
        lotteryArr: [],
        noData: false,
        parameter: {
          pageSize: 30,
          offset: 0,
          typeId: this.$route.params.id
        }
      };
    },
    created() {
      this.lotteryHistoryStart();
    },
    methods: {
      handleCodeItem(codeArr) {
        let arr = [];
        for (let i = 0; i < codeArr.length; i++) {
          if (i === codeArr.length - 1) {
            arr.push({ code: "+", color: "", zodiac: "-" });
          }
          arr.push(codeArr[i]);
        }
        return arr;
      },
      lotteryHistoryStart() {
        lotteryHistory(this.parameter).then(res => {
          if(res.status) {
            this.lotteryArr = res.data;
            if(!this.lotteryArr.length) {
              this.noData = true;
            }else {
              if(this.lotteryArr.length<this.parameter.pageSize) {
                this.finished = true;
              }else {
                this.finished = false;
              }
              this.noData = false;
            }
          }else {
            this.noData = true;
          }
        });
      },
      onRefresh() {
        this.parameter.offset = 0;
        lotteryHistory(this.parameter).then(res => {
          if(res.status) {
            this.$toast("刷新成功");
            this.lotteryArr = res.data;
          }else {
            this.$toast("暂无更多数据");
          }
          this.isLoading = false;
        });
      },
      onLoad() {
        this.parameter.offset += this.parameter.pageSize;
        lotteryHistory(this.parameter).then(res => {
          let list;
          if (res.data.length) {
            list = res.data;
            if (
              this.lotteryArr[this.lotteryArr.length - 1].time ===
              res.data[0].time
            ) {
              list = res.data.shift();
            }
            this.lotteryArr = this.lotteryArr.concat(list);
            this.loading = false;
          } else {
            this.loading = false;
            this.finished = true;
          }
        });
      },
    }
  };
</script>

<style lang="less" scoped>
.six {
  .add {
    margin-left: 0 !important;
  }
  .reduce {
    opacity: 0;
    margin-left: 0 !important;
  }
  span:last-child {
    margin-left: 0 !important;
  }
  li {
    height: 170px;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #e0dcd9;

    p {
      flex: 1;
      b {
        color: #666;
      }
    }

    p:first-child {
      line-height: 56px;
      font-size: 28px;
      color: #444444;
    }

    p:nth-child(2) {
      padding-left: 60px;

      .add {
        background-color: #fff;
        color: #95949a;
        font-size: 50px;
      }

      span {
        display: block;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        line-height: 54px;
        text-align: center;
        margin-left: 23px;
        float: left;
        color: white;
        font-size: 28px;
      }
    }

    p:nth-child(3) {
      padding-left: 60px;

      .add {
        background-color: #fff;
        color: #95949a;
        font-size: 50px;
      }

      span {
        display: block;
        width: 54px;
        height: 54px;
        border-radius: 50%;
        line-height: 54px;
        text-align: center;
        margin-left: 23px;
        float: left;
        color: #959499;
        font-size: 28px;
      }
    }
  }
}
</style>
