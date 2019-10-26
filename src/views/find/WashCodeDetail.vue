<template>
  <div class="washCodeDetail" v-title="'实时洗码详情'">
    <Header :title="$route.params.title"></Header>
    <div class="content">
      <div class="title">
        <span>{{$route.params.title}}洗码总额</span>
        <span>{{($route.params.money*1).toFixed(2)}}</span>
      </div>
      <dl>
        <dt>
          <span>游戏名称</span>
          <span>未结有效投注额</span>
          <span>当前洗码比例</span>
          <span>洗码金额</span>
        </dt>
        <dd v-for="(item,i) in washCodeDetail" :key="i">
          <span>{{item.name}}</span>
          <span>{{(item.totalBetAmount*1).toFixed(2)}}</span>
          <span>{{item.rate}}</span>
          <span>{{(item.totalWashcodeAmount*1).toFixed(2)}}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "washCodeDetail",
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['washCodeDetail'])
  }
}
</script>

<style scoped lang="less">
.washCodeDetail {
  .headerBox {
    background: @ThemeColor;
    color: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  .content {
    padding-top: 100px;
    .title {
      height: 164px;
      line-height: 164px;
      font-size: 42px;
      text-align: center;
      span {
        &:nth-child(2) {
          color: @red;
          margin-left: 10px;
        }
      }
    }
    dl {
      dt {
        height: 80px;
        line-height: 80px;
        background-color: #f1f1f1;
        border-bottom: 1px solid #dbdbdb; /*no*/
        border-top: 1px solid #dbdbdb; /*no*/
      }
      dd {
        line-height: 80px;
        &:nth-of-type(2n) {
          background-color: rgb(247, 247, 247);
        }
      }
      span {
        display: inline-block;
        text-align: center;
        font-size: 26px;
        &:nth-child(1){
          width: 22%;
        }
        &:nth-child(2){
          width: 31%;
        }
        &:nth-child(3){
          width: 25%;
        }
        &:nth-child(4){
          width: 22%;
        }
      }
    }
  }
}
</style>
