<template>
  <div class="betRecord">
    <Header :title="$route.query.title+'-投注记录'"></Header>
    <div class="betRecordContent">
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
          <ul v-if="lotteryArr.length">
            <li v-for="(item, i) in lotteryArr" :key="i"
                class="hold"
                @click="$router.push({name: 'lotterydetails', params: { classify: item.classify },query: { id: item.id }})">
                <div>
                  <p>
                    {{ item.title }}
                    <b v-show="item.zhuihao">追</b>
                  </p>
                  <span>第{{ item.actionNo }}期</span>
                </div>
                <div>
                  <p>{{ item.amount }}元</p>
                  <span :class="{ WinningColor: item.status === 21 }">{{
                  item.info
                }}</span>
                </div>
                <i class="iconfont">&#xe727;</i>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-if="noData" class="noData">
      <div class="content_box">
        <div>
          <p>
            <img :src="commonImg('default/noData.png')" alt />
          </p>
          <h4>您的游戏记录是空的噢！</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { lotteryRecord } from "../../api";
export default {
  name: "BetRecord",
  data() {
    return {
      isLoading: false, // 下拉刷新
      loading: false, // 上拉加载更多
      finished: false, // 上拉加载是否完成判断
      lotteryArr: [],
      noData: false,
      parameter: {
        pageSize: 20,
        offset: 0,
        status: 0,
        timeType: 0,
        typeId: this.$route.params.id
      }
    };
  },
  created() {
    this.lotteryRecordsStart();
  },
  methods: {
    lotteryRecordsStart() {
      lotteryRecord(this.parameter).then(res => {
        if(res.status) {
          this.lotteryArr = res.data;
          if (this.lotteryArr.length) {
            if(this.lotteryArr.length < this.parameter.pageSize) {
              this.finished = true;
            }else {
              this.finished = false;
            }
          }else {
            this.noData = true;
          }
        }else {
          this.noData = true;
        }
      });
    },
    onRefresh() {
      this.parameter.offset = 0;
      lotteryRecord(this.parameter).then(res => {
        if(res.status) {
          this.$toast("刷新成功");
          this.lotteryArr = res.data;
          if(this.lotteryArr.length < this.parameter.pageSize) {
            this.finished = true;
          }else {
            this.finished = false;
          }
        }else {
          this.$toast("暂无更多数据");
        }
        this.isLoading = false;
      });
    },
    onLoad() {
      this.parameter.offset += this.parameter.pageSize;
      lotteryRecord(this.parameter).then(res => {
        if (res.data && res.data.length) {
          this.lotteryArr = this.lotteryArr.concat(res.data);
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
<style scoped lang="less">
  .betRecord {
    .headerBox {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0; /*no*/
    }
    .betRecordContent {
      padding-top: 100px;
      ul {
        li {
          overflow: hidden;
          border-bottom: 1px solid #f0f0f0; /*no*/
          position: relative;

          a {
            display: block;
            overflow: hidden;
          }

          div {
            float: left;
            text-align: left;
            padding: 10px 0 10px 20px;

            p {
              line-height: 50px;
              font-size: 30px;

              b {
                display: inline-block;
                font-weight: normal;
                width: 36px;
                height: 36px;
                text-align: center;
                line-height: 36px;
                font-size: 20px;
                color: white;
                background-color: @ThemeColor;
                border-radius: 50%;
                margin-left: 8px;
                vertical-align: middle;
              }
            }

            span {
              color: #999999;
              line-height: 50px;
              font-size: 26px;
            }
          }

          div:nth-child(2) {
            float: right;
            margin-right: 63px;
            text-align: right;
          }

          i {
            position: absolute;
            right: 10px;
            top: 42px;
            font-size: 29px;
            color: #dedddb;
          }
        }
      }
    }
  }
</style>
