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
      <ul class="XY28" v-if="lotteryArr.length">
        <li v-for="(item, i) in lotteryArr" :key="'l' + i">
          <div class="left">
            <span>第{{ item.number }}期</span>
          </div>
          <dl class="right">
            <dd>
              <span
                v-for="(child, j) in item.data"
                :key="'l' + j"
                :class="child === ',' ?'init':'ball'"
                >{{ child === "," ? "+" : child }}</span
              >
              <span style="font-size: 23px;background-color: white;color: #999"
                >=</span
              >
              <span class="ball">{{ allValue(item.data) }}</span>
            </dd>
          </dl>
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
    name: "HistoryNormal",
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
      allValue(data) {
        let allNum = new Number();
        data = data.split(",");
        data.map(item => {
          allNum += item * 1;
        });
        return allNum;
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
.XY28 {
  li {
    display: flex;
    height: 94px;
    line-height: 94px;
    border-bottom: 1px solid #e0dcd9;
    flex-direction: row;

    .left {
      width: 40%;
      font-size: 28px;
      span {
        color: #666;
      }
    }

    .right {
      width: 60%;
      flex: 1;
      padding-left: 20px;

      dd {
        flex: 1;

        span {
          width: 56px;
          line-height: 56px;
          border-radius: 50%;
          height: 56px;
          float: left;
          margin-top: 19px;
          background: #cfcce7;
          color: #ffffff;
          display: block;
          font-size: 30px;
          &.init {
            font-size: 35px;
            color: #999;
            background-color: #fff;
          }
        }
      }
    }
  }
}
</style>
