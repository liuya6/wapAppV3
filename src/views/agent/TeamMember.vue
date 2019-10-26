<template>
  <div class="teamMember flex" v-title="'团队成员'">
    <Header title="团队成员"></Header>
    <div class="content">
      <div>
        <span>账号</span>
        <span>等级</span>
        <span>最后登录时间</span>
        <span>下级人数</span>
      </div>
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
      >
        <ul>
          <li v-for="(item,i) in memberList" :key="i" class="hold" @click="[teamDetailShow = true , userDetails = item]">
            <span>{{item.username}}</span>
            <span>{{item.levelName}}</span>
            <span>{{timestampToString(item.loginTime) || "暂无记录"}}</span>
            <span :class="{highlight:toNum(item.childCount)>0}">{{item.childCount}}</span>
          </li>
        </ul>
      </van-list>
      <div class="noData" v-if="noData">
        <div class="content_box">
          <div>
            <p><img :src="commonImg('default/noData.png')" alt="" /></p>
            <h4>暂无记录</h4>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="teamDetailShow" position="bottom">
      <ul class="teamDetails">
        <li class="hold">
          <img src="../../assets/images/member.svg" alt="" />
          {{ userDetails.username }}
        </li>
        <li class="hold" v-show="userDetails.hasPrevPage" @click="goPrev">返回上级</li>
        <li class="hold" @click="goTeamDetail">返点详情</li>
        <li class="hold" v-show="userDetails.hasNextPage" @click="goNext">查看下级</li>
        <li class="hold" @click="teamDetailShow = false">取消</li>
      </ul>
    </van-popup>
  </div>
</template>

<script>
import { getMembers } from "../../api";
import { mapGetters } from "vuex"
export default {
  name: "teamMember",
  data() {
    return {
      noData: false,
      memberList: [],
      loading: false,
      finished: false,
      teamDetailShow: false,
      userDetails: "",
      prevUid: "",
      parameter: {
        uid: "",
        username: "",
        page: 1,
        pageSize: 20
      }
    }
  },
  // created() {
  //   this.initData();
  // },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    initData() {
      getMembers(this.parameter).then(res=> {
        if(res.status) {
          this.memberList = res.data.list;
          console.log(this.memberList);
          if(!this.memberList.length) {
            this.noData = true;
          }else {
            if(this.memberList.length >= this.parameter.pageSize) {
              this.finished = false
            }
            this.noData = false;
          }
        }
      })
    },
    onLoad() {
      this.parameter.page ++;
      getMembers(this.parameter).then(res=>{
        if (res.data.list.length) {
          this.memberList = this.memberList.concat(res.data.list);
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
      })
    },
    goTeamDetail() {
      this.$store.commit("SET_TEAM_DETAIL",this.userDetails);
      this.$router.push({name: "teamDetail"});
    },
    goPrev() {
      this.parameter.page = 1;
      this.parameter.uid = this.userDetails.grandpaId;
      this.initData();
      this.teamDetailShow = false
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
        username: "",
        page: 1,
        pageSize: 20
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if(from.name === "recommend") {
        vm.memberList = [];
        vm.initParameter();
        vm.initData()
      }
    });
  }
}
</script>

<style scoped lang="less">
.teamMember {
  background-color: #f8f8f8;
  .headerBox {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .content {
    >div{
      &:nth-child(1) {
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
        justify-content: space-between;
        height: 80px;
        align-items: center;
        background-color: #fff;
        border-bottom: 1px solid #f0f0f0; /*no*/
        span {
          flex: 0 0 auto;
          width: 25%;
          text-align: center;
          font-size: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          &.highlight {
            color: @ThemeColor;
          }
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
