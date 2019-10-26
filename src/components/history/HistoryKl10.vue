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
      <ul class="kl10" v-if="lotteryArr.length">
        <li v-for="(item, i) in lotteryArr" :key="'l' + i">
          <P class="date">
            <span>第{{ item.number }}期</span>
          </P>
          <p class="num">
            <span
              class="ball"
              v-for="(child, j) in item.codeData"
              :key="j"
              :class="child.color"
              >{{ child.code }}</span
            >
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
  name: "HistoryKl10",
  data() {
    return {
      isLoading: false, // 下拉刷新
      loading: false, // 上拉加载更多
      finished: false, // 上拉加载是否完成判断
      noData: false,
      lotteryArr: [],
      parameter: {
        pageSize: 20,
        offset: 0,
        typeId: this.$route.params.id
      }
    };
  },
  created() {
    this.lotteryHistoryStart();
  },
  methods: {
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
.kl10 {
  .date {
    span {
      color: #999999;
    }
  }
  li {
    width: 100%;
    border-bottom: 1px solid #dedddb;

    .date {
      line-height: 78px;
      font-size: 29px;
      text-align: left;
      padding-left: 38px;
    }

    .num {
      overflow: hidden;
      margin-bottom: 20px;

      span {
        display: block;
        width: 53px;
        height: 53px;
        float: left;
        margin-left: 33px;
        line-height: 53px;
        background-color: #cfcce9;
        color: white;
        border-radius: 50%;
        font-size: 30px;
      }
      span:first-child {
        margin-left: 38px;
      }
    }
  }
}
</style>
