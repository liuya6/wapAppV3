<template>
  <div class="withdrawRecord" v-title="'提现记录'">
    <Header title="提现记录"></Header>
    <div class="withdrawRecordContent">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <div v-if="!withdrawArr.length && !noData" class="load">
            <van-loading size="50px" color="#fea24d" vertical></van-loading>
            <div>拼命加载中...</div>
          </div>
          <ul v-if="withdrawArr.length">
            <li v-for="(item, i) in withdrawArr" :key="i">
              <div>
                <p>提现{{ item.amount }}元</p>
                <span>{{ timestampToString(item.actionTime) }}</span>
              </div>
              <div>
                <p
                  :style="{
                    color:
                      item.state === 1
                        ? 'black'
                        : item.state === 0
                        ? '#59d80b'
                        : 'red'
                  }"
                >
                  {{
                    item.state === 1
                      ? "处理中"
                      : item.state === 0
                      ? "提现成功"
                      : "提现失败"
                  }}
                </p>
                <span>{{ item.bankName }}</span>
              </div>
            </li>
          </ul>
          <div v-if="noData" class="noData">
            <div class="content_box">
              <div>
                <p><img :src="commonImg('default/noData.png')" alt="" /></p>
                <h4>您的提现记录是空的噢！</h4>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { withdrawalsRecord } from "../../api";
export default {
  name: "WithdrawalsRecord",
  data() {
    return {
      bottomStatus: false, //上拉动画
      topStatus: false, //下拉动画
      allLoaded: false, //上拉加载更多 无数据时的状态
      withdrawArr: [],
      noData: false,
      parameter: {
        offset: 0,
        pageSize: 20
      }
    };
  },
  mounted() {
    this.withdrawalsRecordS();
  },
  methods: {
    withdrawalsRecordS() {
      withdrawalsRecord(this.parameter).then(res => {
        if(res.status) {
          this.withdrawArr = res.data;
          if(!this.withdrawArr.length) {
            this.noData = true;
          }else {
            if(this.withdrawArr.length < this.parameter.pageSize) {
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
      withdrawalsRecord(this.parameter).then(res => {
        if(res.status) {
          this.$toast("刷新成功");
          this.withdrawArr = res.data;
          if(this.withdrawArr.length < this.parameter.pageSize) {
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
      withdrawalsRecord(this.parameter).then(res => {
        this.loading = false;
        let list;
        if (res.data && res.data.length) {
          list = res.data;
          if (
            this.withdrawArr[this.withdrawArr.length - 1].time ===
            res.data[0].time
          ) {
            list = res.data.shift();
          }
          this.withdrawArr = this.withdrawArr.concat(list);
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
  .withdrawRecord {
    .headerBox {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0; /*no*/
    }
    .withdrawRecordContent {
      padding-top: 100px;
      .van-pull-refresh {
        min-height: calc(100vh - 110px);
      }
      ul {
        overflow: hidden;

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
                background: @ThemeColor;
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
            top: 38px;
            font-size: 40px;
            color: #dedddb;
          }
        }
      }
    }
  }
</style>
