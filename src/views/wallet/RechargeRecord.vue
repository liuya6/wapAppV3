<template>
  <div class="rechargeRecord" v-title="'充值记录'">
    <Header title="充值记录"></Header>
    <div class="rechargeRecordContent">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <div v-if="!rechargeArr.length && !noData" class="load">
            <van-loading size="50px" color="#fea24d" vertical></van-loading>
            <div>拼命加载中...</div>
          </div>
          <ul v-if="rechargeArr.length">
            <li v-for="(item, i) in rechargeArr" :key="i">
              <div>
                <p>充值{{ item.amount }}元</p>
                <span>订单号：{{ item.rechargeId }}</span>
              </div>
              <div>
                <p
                  :style="{
                    color:
                      item.state === 0
                        ? 'black'
                        : item.state === 1 || item.state === 9
                        ? '#59d80b'
                        : 'red'
                  }"
                >
                  {{
                    item.state === 0
                      ? "审核中"
                      : item.state === 1 || item.state === 9
                      ? "充值成功"
                      : "充值失败"
                  }}
                </p>
                <span>{{ item.mark }}</span>
              </div>
            </li>
          </ul>
          <div v-if="noData" class="noData">
            <div class="content_box">
              <div>
                <p><img :src="commonImg('default/noData.png')" alt="" /></p>
                <h4>您的充值记录是空的噢！</h4>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { rechargeRecord } from "../../api";
export default {
  name: "RechargeRecord",
  data() {
    return {
      isLoading: false, // 下拉刷新
      loading: false, // 上拉加载更多
      finished: false, // 上拉加载是否完成判断
      rechargeArr: [],
      noData: false,
      parameter: {
        offset: 0,
        pageSize: 30
      }
    };
  },
  created() {
    this.RechargeRecords();
  },
  methods: {
    RechargeRecords() {
      rechargeRecord(this.parameter).then(res => {
        if(res.status) {
          this.rechargeArr = res.data;
          if(!this.rechargeArr.length) {
            this.noData = true;
          }else {
            if(this.rechargeArr.length < this.parameter.pageSize) {
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
      rechargeRecord(this.parameter).then(res => {
        if(res.status) {
          this.$toast("刷新成功");
          this.rechargeArr = res.data;
          if(this.rechargeArr.length < this.parameter.pageSize) {
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
      rechargeRecord(this.parameter).then(res => {
        this.loading = false;
        let list;
        if (res.data && res.data.length) {
          list = res.data;
          if (
            this.rechargeArr[this.rechargeArr.length - 1].time ===
            res.data[0].time
          ) {
            list = res.data.shift();
          }
          this.rechargeArr = this.rechargeArr.concat(list);
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
.rechargeRecord {
  .headerBox {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0; /*no*/
  }
  .rechargeRecordContent {
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
