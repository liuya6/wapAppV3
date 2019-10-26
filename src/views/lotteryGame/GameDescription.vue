<template>
  <div class="gameDescription" v-title="'玩法说明'">
    <Header title="玩法说明"></Header>
    <div class="content">
      <div class="content_title">
        {{ playData.name }}-{{ playData.playName }}
      </div>
      <div class="content_middle" v-html="playData.info"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "GameDescription",
  data() {
    return {
      description: ""
    };
  },
  computed: {
    ...mapGetters(["playData"])
  }
};
</script>

<style scoped lang="less">
.gameDescription {
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
  .content {
    margin-top: 100px;
    padding: 0 20px 50px;
    .content_title {
      font-size: 30px;
      line-height: 70px;
      font-weight: bold;
    }
    .content_middle {
      font-size: 30px;
      line-height: 50px;
      text-align: left;
    }
  }
}
</style>
