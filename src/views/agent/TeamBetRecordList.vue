<template>
  <div class="teamBetRecordList">
    <FixHead title="投注记录"></FixHead>
    <div class="teamBetRecordListContent">
      <div class="title">
        <span>时间</span>
<!--        <span>订单号</span>-->
        <span>用户名</span>
        <span>玩法</span>
        <span>有效投注</span>
        <span>盈亏</span>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <ul v-if="teamBetRecordArr && teamBetRecordArr.length">
            <li v-for="(item,i) in teamBetRecordArr" :key="i">
              <span>{{(timestampToString(item.time)).substr(-17)}}</span>
<!--              <span>{{item.round.substr(-6)}}</span>-->
              <span>{{item.username}}</span>
              <span>{{item.title}}</span>
              <span>{{toFixeds(item.cellScore)}}</span>
              <span :class="toNum(item.win) > 0 ?'profit':'loss'"
              >{{item.win > 0 ? toFixeds(item.win) : item.win}}</span>
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
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { betRecordList } from "../../api";
  export default {
    name: "TeamBetRecordList",
    data() {
      return {
        isLoading: false,
        loading: false,
        finished: false,
        teamBetRecordArr: [],
        parameter: {},
        noData: false
      }
    },
    created() {
      this.teamBetRecordArr = this.teamBetRecordList;
      this.parameter = { ...this.teamBetRecordParameter };
      console.log(this.teamBetRecordArr);
      if(!this.teamBetRecordArr || !this.teamBetRecordArr.length){
        this.noData = true;
      }else {
        this.noData = false;
      }
    },
    destroyed() {
      this.$store.commit("SET_TEAM_BET_RECORD_LIST",[]);
    },
    computed: {
      ...mapGetters(["teamBetRecordList","teamBetRecordParameter"])
    },
    methods: {
      onRefresh() {
        this.parameter.page = 1;
        betRecordList(this.parameter).then(res => {
          if(res.status) {
            this.$toast("刷新成功");
            this.teamBetRecordArr = res.data.list;
            if(this.teamBetRecordArr.length < this.parameter.pageSize) {
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
        this.parameter.page ++;
        betRecordList(this.parameter).then(res => {
          if ( res.data.list && res.data.list.length) {
            this.teamBetRecordArr = this.teamBetRecordArr.concat(res.data.list);
            this.loading = false;
          } else {
            this.loading = false;
            this.finished = true;
          }
        });
      }
    }
  }
</script>

<style scoped lang="less">
.teamBetRecordList {
  background-color: #f8f8f8;
  .fixHead {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .teamBetRecordListContent {
    padding-top: 180px;
    .title,ul li {
      height: 80px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f0f0f0; /*no*/
      span {
        flex: 0 0 auto;
        width: 19%;
        text-align: center;
        font-size: 28px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        &:nth-child(1) {
          width: 24%;
        }
      }
    }
    .title {
      position: fixed;
      width: 100%;
      top: 100px;
      z-index: 1;
      background-color: #f8f8f8;
    }
    ul {
      li {
        background-color: #fff;
      }
    }
  }
}
</style>