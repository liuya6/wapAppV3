<template>
  <div class="teamContactsList">
    <FixHead title="往来记录"></FixHead>
    <div class="teamContactsListContent">
      <div class="title">
        <span>时间</span>
        <span>用户名</span>
        <span>账目信息</span>
        <span>变动金额</span>
<!--        <span>变动后金额</span>-->
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <ul v-if="teamContactsArr && teamContactsArr.length">
            <li v-for="(item,i) in teamContactsArr" :key="i">
              <span>{{(timestampToString(item.actionTime)).substr(-17)}}</span>
              <span>{{item.username}}</span>
              <span>{{item.info}}</span>
              <span :class="toNum(item.coin) > 0 ?'profit':'loss'"
              >{{toFixeds(item.coin)}}</span>
<!--              <span>{{item.userCoin}}</span>-->
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
  import { teamLog } from "../../api";
  import { mapGetters } from "vuex";
  export default {
    name: "TeamContactsList",
    data() {
      return {
        isLoading: false,
        loading: false,
        finished: false,
        teamContactsArr: [],
        parameter: {},
        noData: false
      }
    },
    created() {
      this.teamContactsArr = this.teamContactsList;
      this.parameter = { ...this.teamContactsParameter };
      if(!this.teamContactsArr || !this.teamContactsArr.length) {
        this.noData = true;
      }
    },
    destroyed() {
      this.$store.commit("SET_CONTACTS_LIST",[]);
    },
    computed: {
      ...mapGetters(["teamContactsList","teamContactsParameter"])
    },
    methods: {
      onRefresh() {
        this.parameter.page = 1;
        teamLog(this.parameter).then(res => {
          if(res.status) {
            this.$toast("刷新成功");
            this.teamContactsArr = res.data.list;
            if(this.teamContactsArr.length < this.parameter.pageSize) {
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
        teamLog(this.parameter).then(res => {
          if ( res.data.list && res.data.list.length) {
            this.teamContactsArr = this.teamContactsArr.concat(res.data.list);
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
.teamContactsList {
  background-color: #f8f8f8;
  .fixHead {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .teamContactsListContent{
    padding-top: 180px;
    .title,ul li {
      height: 80px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f0f0f0; /*no*/
      span {
        flex: 0 0 auto;
        text-align: center;
        font-size: 28px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        &:nth-child(1) {
          width: 20%;
        }
        &:nth-child(2) {
          width: 25%;
        }
        &:nth-child(3) {
          width: 35%;
        }
        &:nth-child(4) {
          width: 20%;
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