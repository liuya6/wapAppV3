<template>
  <div class="recommend flex" v-title="'团队管理'">
    <Header title="团队管理" :isSlot="true" rightTitle="团队说明" rightTo="/teamRule" color="#fff">
      <i class="back iconfont" @click="$router.push({name:'user'})">&#xe629;</i>
    </Header>
    <div class="content">
      <div class="top">
        <ul>
          <li>今日佣金{{toFixeds(teamCountData.selfPromotionCommission || "0.00")}}元</li>
          <li>
            <div>
              <p>有效推荐好友</p>
              <span>{{teamCountData.childCount || "0"}}位</span>
            </div>
            <div>
              <p>好友今日有效投注额</p>
              <span>{{toFixeds(teamCountData.betAmount || "0.00")}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="btm">
        <div>
          <div v-for="(item,i) in btmList" :key="i">
            <van-cell-group>
              <van-cell is-link center :to="item.to">
                <template slot="title">
                  <i class="iconfont" v-html="item.icon"></i>
                  <span>{{item.title}}</span>
                </template>
              </van-cell>
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { teamCount } from "../../api";
const btmList = [
  {
    title: "推广管理",
    icon: "&#xe62f;",
    to: "/tgManagement"
  },
  {
    title: "团队成员",
    icon: "&#xe61d;",
    to: "/teamMember"
  },
  {
    title: "团队报表",
    icon: "&#xe6ae;",
    to: "/teamReport"
  },
  {
    title: "下级报表",
    icon: "&#xe654;",
    to: "/underReport"
  },
  {
    title: "团队投注记录",
    icon: "&#xe62a;",
    to: "/teamBetRecord"
  },
  {
    title: "团队往来记录",
    icon: "&#xe605;",
    to: "/teamContacts"
  },
  {
    title: "我的返点",
    icon: "&#xe60b;",
    to: "/myRebate"
  },
];
export default {
  name: "recommend",
  data() {
    return {
      btmList,
    };
  },
  created() {
    if(typeof this.mySetList === 'undefined' || !this.mySetList.validBetSet) {
      this.$store.dispatch("getSetLists");
    }
    this.initTeamCount()
  },
  computed: {
    ...mapGetters(["mySetList","teamCountData"])
  },
  methods: {
    initTeamCount() {
      teamCount().then(res=>{
        if(res.status) {
          this.$store.commit("SET_TEAM_COUNT_DATA",res.data)
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
.recommend {
  background-color: rgb(248, 248, 248);
  .headerBox {
    background: @Amount-Out-Btn;
  }
  .content {
    background: url("../../assets/images/team.jpg") no-repeat;
    background-size: 100%;
    padding-bottom: 50px;
    .top {
      width: 700px;
      margin: 350px auto 0;
      position: relative;
      z-index: 1;
      border-radius: 20px;
      overflow: hidden;
      background-color:rgb(248, 248, 248) ;
      box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
      ul {
        li {
          &:first-child {
            height: 100px;
            background: @Recommend-title;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 32px;
            color: #fff;
            letter-spacing: 5px;
          }
          &:nth-child(2) {
            display: flex;
            overflow: hidden;
            div {
              background-color: #fff;
              width: 50%;
              flex: 0 0 auto;
              text-align: center;
              box-sizing: border-box;
              padding-bottom: 20px;
              &:first-child {
                border-right: 1px solid #f0f0f0; /*no*/
              }
              p {
                color: #333;
                padding-top: 15px;
                font-size: 26px;
              }
              span {
                color: @ThemeColor;
                font-size: 26px;
              }
            }
          }
        }
      }
    }
    /*.fg {*/
    /*  background-color:rgb(248, 248, 248) ;*/
    /*  height: 20px;*/
    /*}*/
    .btm {
      background-color:rgb(248, 248, 248) ;
      box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.08);
      width: 700px;
      margin: 20px auto 0;
      border-radius: 10px;
      overflow: hidden;
      > div {
        div {
          .van-cell-group {
            .van-cell {
              padding: 20px;
              .van-cell__title {
                display: flex;
                align-items: center;
                i {
                  font-size: 35px;
                  color: @ThemeColor;
                }
                span {
                  margin-left: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
