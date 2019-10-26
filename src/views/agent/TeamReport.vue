<template>
  <div class="teamReport flex" v-title="'团队报表'">
    <Header title="团队报表"></Header>
    <div class="content">
      <div>
        <span
          v-for="(item,i) in times"
          :key="i"
          :class="{active: item.type === parameter.timeType}"
          @click="[parameter.timeType = item.type,searchTeamReport()]"
          class="hold"
        >{{item.title}}</span>
      </div>
      <div>
        <span>账号</span>
        <van-field v-model="parameter.username" clearable placeholder="请输入用户名"></van-field>
        <van-button @click="searchTeamReport">搜索</van-button>
      </div>
      <div class="fg"></div>
      <ul>
        <li v-for="(item, i) in teamReportList" :key="i">
          <p>{{ teamReportArr[item.type] || "0"}}</p>
          <span>{{ item.title }}</span>
        </li>
      </ul>
      <div class="tip">
        <h3>温馨提示：</h3>
        <p>1.推广佣金（下级）和推广佣金（自身）统计该账号自己获得的佣金；</p>
        <p>2.下级人数（即时）统计该账号的所有下级人数，不含该账号；</p>
        <p>3.其余栏位为查询账号与其所有下级的数据之和；</p>
        <p>4.不统计升级日期之前数据；</p>
      </div>
    </div>
  </div>
</template>

<script>
import { teamReport } from "../../api";
const teamReportList = [
  { title: "投注金额", type:"betAmount" },
  { title: "中奖金额", type:"winAmount" },
  // { title: "所得优惠金额", type:"giveAmount" },
  { title: "团队佣金", type:"teamCommissionAmount" },
  { title: "团队盈利", type:"teamWinAmount" },
  { title: "投注人数", type:"betCount" },
  { title: "充值人数", type:"rechargeCount" },
  { title: "注册人数", type:"registerCount" },
  { title: "下级人数（即时）", type:"childCount" },
  { title: "充值金额", type:"rechargeAmount" },
  { title: "提现金额", type:"cashAmount" },
  { title: "推广佣金（自身）", type:"selfPromotionCommission" },
  { title: "推广佣金（下级）", type:"childPromotionCommission" }
];
const times = [
  { title: "今日" , type : "1" },
  { title: "昨日" , type : "2" },
  { title: "近一周" , type : "3" },
  { title: "近一月" , type : "4" },
];
export default {
  name: "TeamReport",
  data() {
    return {
      times,
      teamReportList,
      active: "0",
      parameter: {
        username: "",
        timeType: "1"
      },
      teamReportArr: {}
    }
  },
  created() {
    if(this.$route.params.username) {
      this.parameter.username = this.$route.params.username
    }
    this.searchTeamReport()
  },
  methods: {
    searchTeamReport() {
      teamReport(this.parameter).then(res=> {
        console.log(res);
        if(res.status) {
          this.teamReportArr = res.data;
        }else {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.teamReport {
  .headerBox {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .content {
    >div {
      &:first-child {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        span {
          display: inline-block;
          width: 130px;
          height: 60px;
          background-color: #f0f0f0;
          text-align: center;
          line-height: 60px;
          margin-left: 30px;
          font-size: 28px;
          border-radius: 5px;
          margin-top: 15px;
          color: #333;
          &.active {
            background-color: @ThemeColor;
            color: #fff;
          }
        }
      }
      &:nth-child(2) {
        display: flex;
        align-items: center;
        height: 80px;
        margin: 20px 0;
        >span:first-child {
          padding-left: 30px;
          padding-right: 15px;
          font-size: 32px;
        }
        .van-cell {
          width: 450px;
          height: 60px;
          padding: 0 10px 0 20px;
          border: 1px solid #f0f0f0; /*no*/
          font-size: 28px;
          display: flex;
          align-items: center;
          &:after {
            content: none;
          }
        }
        .van-button {
          margin-left: 30px;
          background-color: @ThemeColor;
          width: 130px;
          height: 50px;
          text-align: center;
          line-height: 40px;
          color: #fff;
          border-radius: 5px;
          font-size: 28px;
        }
      }
    }
    .fg {
      height: 30px;
      background-color: #f8f8f8;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: start;
      li {
        flex: 0 0 auto;
        width: 30%;
        height: 120px;
        margin-top: 20px;
        margin-left: 19px;
        background-color: #f8f8f8;
        text-align: center;
        font-size: 28px;
        p {
          color: #fea24d;
          margin-top: 20px;
          margin-bottom: 5px;
        }
        span {
          color: #666;
          font-size: 24px;
        }
      }
    }
    .tip {
      margin: 40px 0;
      color: @ThemeColor;
      padding: 0 30px;
      line-height: 40px;
    }
  }
}
</style>