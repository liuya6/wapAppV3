<template>
  <div class="orderTrack flex">
    <Header title="订单查询"></Header>
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <ul v-if="rechargeList">
            <li v-for="(item,i) in rechargeList" :key="i">
              <div>
                <p>充值专员：{{item.kefuName}}</p>
                <p>订单时间：{{timestampToString(item.createTime)}}</p>
                <p>订单状态：<b>{{ item.status > 0 ?"已完成":"未完成" }}</b></p>
              </div>
              <div>
                <p>充值金额：{{ item.money }}元</p>
                <van-button @click="goChat(item.id)">进入聊天</van-button>
              </div>
            </li>
          </ul>
        </van-list>
      </van-pull-refresh>
      <div v-if="noData" class="noData">
        <div class="content_box">
          <div>
            <p><img :src="commonImg('default/noData.png')" alt="" /></p>
            <h4>您的订单是空的噢！</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRechargeList, getAppKey } from "../../api";
export default {
  name: "OrderTrack",
  data() {
    return {
      isLoading: false,
      loading: false,
      finished: false,
      rechargeList: [],
      noData: false,
      parameter: {
        page: 1
      },
      getAppKeyParameter: {
        id: 0,
        forceCreate: 0
      }
    }
  },
  created () {
    this.initData()
  },
  methods: {
    goChat(id) {
      this.getAppKeyParameter.id = id;
      getAppKey(this.getAppKeyParameter).then(res=>{
        console.log(res);
        if(res.status) {
          this.changeChatDetails(res)
        }else {
          this.$toast("此订单已关闭")
        }
      })
    },
    initData() {
      getRechargeList(this.parameter).then(res=>{
        console.log(res);
        if(res.status) {
          this.rechargeList = res.data.list;
          if(this.rechargeList.length) {
            this.noData = false
          }else {
            this.noData = true
          }
        }
      })
    },
    onRefresh() {
      this.parameter.page = 1;
      let that = this;
      new Promise(function (resolve) {
        getRechargeList(that.parameter).then(res => {
          console.log(res.data,'刷新');
          if(res.status){
            that.rechargeList = res.data.list;
            resolve(res.data.list);
            if (!that.rechargeList.length) {
              that.noData = true;
            } else {
              that.noData = false;
            }
          }
        });
      }).then(res=>{
        if (res.length) {
          that.$toast("刷新成功");
        } else {
          that.$toast("暂无更多数据");
        }
        that.isLoading = false;
      })
    },
    onLoad() {
      this.parameter.page ++;
      getRechargeList(this.parameter).then(res=>{
        if (res.data.list.length) {
          this.rechargeList = this.rechargeList.concat(res.data.list);
          this.loading = false;
        } else {
          this.loading = false;
          this.finished = true;
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
.orderTrack {
  .content {
    background-color: #f1f1f1;
    .van-pull-refresh {
      min-height: calc( 100vh - 100px);
    }
    ul {
      li {
        background-color: #fff;
        width: 634px;
        margin: 22px auto 0;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        border-radius: 8px;
        box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
        &:last-child {
          margin-bottom: 22px;
        }
        div {
          p {
            font-size: 25px;
            color: #666;
            line-height: 40px;
            b {
              font-weight: normal;
              color: #ff4f31;
            }
          }
          .van-button {
            width: 160px;
            height: 56px;
            border-radius: 5px;
            background: linear-gradient(to right,#e3413d,#fd8e5e);
            text-align: center;
            color: #fff;
          }
          &:nth-child(2) {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
