<template>
  <div class="myRebate flex" v-title="'我的返点'">
    <Header title="我的返点"></Header>
    <div class="content">
      <template v-if="myAgentSet && myAgentSet.validBetSet.enable=='1'">
        <h3>{{myAgentSet.validBetSet.name}}</h3>
        <ul>
          <li v-for="(item,i) in myAgentSet.validBetSet.list" :key="i">
            <span>{{item.name}}</span>
            <span>{{toFixeds(item[i+"ValidBetFandian"])}}%</span>
          </li>
        </ul>
      </template>
      <template v-if="myAgentSet && myAgentSet.lossSet.enable=='1'">
        <h3>{{myAgentSet.lossSet.name}}</h3>
        <ul>
          <li v-for="(item,i) in myAgentSet.lossSet.list" :key="i">
            <span>{{item.name}}</span>
            <span>{{toFixeds(item[i+"LossFandian"])}}%</span>
          </li>
        </ul>
      </template>
      <template v-if="myAgentSet && myAgentSet.rechargeSet.enable=='1'">
        <h3>{{myAgentSet.rechargeSet.name}}</h3>
        <ul>
          <li v-for="(item,i) in myAgentSet.rechargeSet.list" :key="i">
            <span>{{item.name}}</span>
            <span>{{toFixeds(item[i+"Fandian"])}}%</span>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex"
  export default {
    name: "MyRebate",
    data() {
      return {}
    },
    created () {
      this.$store.dispatch("getMyFdSet");
    },
    computed: {
      ...mapGetters(["myAgentSet"])
    }
  }
</script>

<style scoped lang="less">
.myRebate {
  background-color: #f8f8f8;
  .headerBox {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .content {
    h3 {
      font-size: 26px;
      height: 70px;
      line-height: 70px;
      text-indent: 20px;
    }
    ul {
      background-color: #fff;
      display: flex;
      flex-wrap: wrap;
      &:last-child {
        border-bottom: 1px solid #f0f0f0; /*no*/
        li {
          border: 0;
        }
      }
      li {
        flex: 0 0 auto;
        width: 50%;
        height: 80px;
        line-height: 80px;
        text-indent: 20px;
        border-bottom: 1px solid #f0f0f0; /*no*/
        font-size: 28px;
        display: flex;
        justify-content: space-between;
        span {
          &:nth-child(2) {
            padding-right: 50px;
          }
        }
      }
    }
  }
}
</style>