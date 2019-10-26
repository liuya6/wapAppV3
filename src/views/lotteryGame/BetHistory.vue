<template>
  <div class="betHistory">
    <Header :title="$route.query.title+'-历史开奖'"></Header>
    <div class="betHistoryContent">
      <components :is="modeName"></components>
    </div>
  </div>
</template>

<script>
const HistoryK3 = () => import("@/components/history/HistoryK3");
const HistoryNormal = () => import("@/components/history/HistoryNormal");
const HistoryPk10 = () => import("@/components/history/HistoryPk10");
const HistorySix = () => import("@/components/history/HistorySix");
const HistoryXy28 = () => import("@/components/history/HistoryXy28");
const HistoryKl10 = () => import("@/components/history/HistoryKl10");

export default {
  name: "BetHistory",
  data() {
    return {
      modeName: this.$route.params.modeName
    };
  },
  components: {
    HistoryK3,
    HistoryNormal,
    HistoryPk10,
    HistorySix,
    HistoryXy28,
    HistoryKl10
  }
};
</script>
<style scoped lang="less">
  .betHistory {
    text-align: center;
    .headerBox {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #f0f0f0; /*no*/
    }
    .betHistoryContent {
      padding-top: 100px;
    }
  }
</style>
