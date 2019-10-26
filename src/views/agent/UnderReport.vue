<template>
  <div class="underReport" v-title="'下级报表'">
    <FixHead title="下级报表"></FixHead>
    <div class="underReportContent">
      <div>
        <span v-for="(item,i) in times"
              :key="i"
              :class="{active: item.type === parameter.timeType}"
              @click="changeTime(item.type)"
              class="hold"
        >{{item.title}}</span>
      </div>
      <div>
        <span>账号</span>
        <span>等级</span>
        <span>投注人数</span>
        <span>盈利</span>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <ul v-if="underReportList && underReportList.length">
            <li v-for="(item,i) in underReportList" :key="i" class="hold" @click="[teamDetailShow = true , userDetails = item]">
              <span>{{item.nickname}}</span>
              <span>{{item.levelName}}</span>
              <span>{{item.betCount}}</span>
              <span :class="toNum(item.teamWinAmount) > 0 ?'profit':'loss'"
              >{{item.teamWinAmount}}</span>
            </li>
          </ul>
          <div v-if="noData" class="noData">
            <div class="content_box">
              <div>
                <p><img :src="commonImg('default/noData.png')" alt="" /></p>
                <h4>暂无记录</h4>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-popup v-model="teamDetailShow" position="bottom">
      <ul class="teamDetails">
        <li class="hold">
          <img src="../../assets/images/member.svg" alt="" />
          {{ userDetails.username }}
        </li>
        <li class="hold" v-show="userDetails.hasPrevPage" @click="goPrev">返回上级</li>
        <li class="hold" @click="goTeamDetail">查看报表</li>
        <li class="hold" v-show="userDetails.hasNextPage" @click="goNext">查看下级</li>
        <li class="hold" @click="teamDetailShow = false">取消</li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
  import { agentReport } from "../../api";
  const times = [
    { title: "今日" , type : "1" },
    { title: "昨日" , type : "2" },
    { title: "近一周" , type : "3" },
    { title: "近一月" , type : "4" },
  ];
  export default {
    name: "UnderReport",
    data() {
      return {
        times,
        noData: false,
        isLoading: false,
        loading: false,
        finished: false,
        underReportList: [],
        teamDetailShow: false,
        userDetails: [],
        parameter: {
          uid: "",
          page: 1,
          pageSize: 20,
          timeType: "1"
        }
      }
    },
    // created() {
    //   this.initData()
    // },
    methods: {
      changeTime(type) {
        if(this.parameter.type === type) {
          return false;
        }
        this.parameter.timeType = type;
        this.parameter.page = 1;
        this.initData()
      },
      initData() {
        agentReport(this.parameter).then(res=> {
          if(res.status) {
            this.underReportList = res.data.list;
            if (this.underReportList.length) {
              this.noData = false;
              if(this.underReportList.length >= this.parameter.pageSize) {
                this.finished = false
              }
            }else {
              this.noData = true;
            }
          }else {
            this.noData = true;
          }
        })
      },
      onRefresh() {
        this.parameter.page = 1;
        agentReport(this.parameter).then(res => {
          if(res.status) {
            this.$toast("刷新成功");
            this.underReportList = res.data.list;
            console.log("finished0");
            if(this.underReportList.length < this.parameter.pageSize) {
              console.log("finished1");
              this.finished = true;
            }else {
              console.log("finished2");
              this.finished = false;
            }
          }else {
            this.$toast("暂无更多数据");
          }
          this.isLoading = false;
        });
      },
      onLoad() {
        this.parameter.page ++;
        agentReport(this.parameter).then(res => {
          if (res.data.list && res.data.list.length) {
            this.underReportList = this.underReportList.concat(res.data.list);
            this.loading = false;
            if (res.data.list.length < this.parameter.pageSize) {
              this.finished = true;
            }else {
              this.finished = false;
            }
          } else {
            this.loading = false;
            this.finished = true;
          }
        });
      },
      goTeamDetail() {
        this.$router.push({name: "teamReport",params:{username:this.userDetails.username}});
      },
      goPrev() {
        this.parameter.page = 1;
        this.parameter.uid = this.userDetails.grandpaId;
        this.initData();
        this.teamDetailShow = false;
      },
      goNext() {
        this.parameter.page = 1;
        this.parameter.uid = this.userDetails.uid;
        this.initData();
        this.teamDetailShow = false;
      },
      initParameter() {
        this.parameter = {
          uid: "",
          page: 1,
          pageSize: 20,
          timeType: "1"
        }
      }
    },
    beforeRouteEnter(to,from,next) {
      next((vm)=>{
        if(from.name==="recommend") {
          vm.underReportList = [];
          vm.initParameter();
          vm.initData()
        }
      })
    }
  }
</script>

<style scoped lang="less">
.underReport {
  background-color: #f8f8f8;
  min-height: 100vh;
  .fixHead {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .underReportContent {
    padding-top: 260px;
    >div {
      &:first-child {
        position: fixed;
        top: 100px;
        width: 100%;
        z-index: 1;
        background-color: #fff;
        height: 80px;
        display: flex;
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
          &.active {
            background-color: @ThemeColor;
            color: #fff;
          }
        }
      }
      &:nth-child(2) {
        position: fixed;
        top: 180px;
        width: 100%;
        z-index: 1;
        background-color: #f8f8f8;
        display: flex;
        height: 80px;
        align-items: center;
        span {
          flex: 0 0 auto;
          width: 25%;
          text-align: center;
          font-size: 28px;
        }
      }
    }
    ul {
      li {
        display: flex;
        align-items: center;
        height: 80px;
        border-bottom: 1px solid #f0f0f0; /*no*/
        background-color: #fff;
        span {
          flex: 0 0 auto;
          width: 25%;
          text-align: center;
          font-size: 28px;
        }
      }
    }
  }
  .teamDetails {
    li {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
      border-bottom: 1px solid #f0f0f0; /*no*/
      font-size: 28px;
      img {
        margin-right: 20px;
      }
    }
  }
}
</style>