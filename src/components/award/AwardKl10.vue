<template>
  <div class="kl10" v-if="awardData.last">
      <div>
        {{ awardData.next.actionNo || "-" }}期开奖倒计时
        <span>{{ time || "00:00:00" }}</span>
        <i class="iconfont" @click="Play">{{
          musicFlag ? "&#xe621;" : "&#xe679;"
          }}</i>
      </div>
      <i class="iconfont drop" @click="loadMore = !loadMore">{{
        loadMore ? "&#xe649;" : "&#xe64a;"
        }}</i>
      <ul :class="{ show: loadMore }">
        <li v-for="(item, index) in awardData.last" :key="index">
          <h3>{{ item.actionNo }}期</h3>
          <dl v-if="item.data" key="has-code">
            <dd
                class="ball"
                v-for="(child, i) in item.codeData"
                :key="i"
                :class="child.color"
            >
              {{ child.code }}
            </dd>
          </dl>
          <div v-else key="no-code" class="Unopened">
            <span class="ball">等</span>
            <span class="ball">待</span>
            <span class="ball">开</span>
            <span class="ball">奖</span>
          </div>
        </li>
        <li>
          <router-link
              :to="{
            name: 'bethistory',
            params: { modeName: 'HistoryKl10', id: lotteryData.id },
            query: { title: lotteryData.title }
          }"
          >
            查看更多
          </router-link>
        </li>
      </ul>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "AwardKl10",
  data() {
    return {
      loadMore: false,
      setTimer: "",
      time: ""
    };
  },
  props: {
    awardData: Object,
    timeOver: Function,
    lotteryData: Object
  },
  created() {
    this.times();
  },
  destroyed() {
    clearInterval(this.setTimer);
  },
  watch: {
    "awardData.nowTime": {
      handler(newVal, oldVal) {
        if(newVal) {
          if (newVal != oldVal) {
            clearInterval(this.setTimer);
            this.times();
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(["musicFlag"])
  },
  methods: {
    ...mapMutations(["CHANGE_MUSIC_FLAG"]),
    Play() {
      this.CHANGE_MUSIC_FLAG();
      if (!this.musicFlag) {
        this.pauseAudio();
      }
    }
  }
};
</script>

<style scoped lang="less">
.kl10 {
  position: relative;

  div:first-child {
    border-bottom: 1px solid #dedddb;
    position: relative;
    i {
      font-size: 30px;
      color: #6d6d6d;
      margin-left: 10px;
    }
  }
  div {
    background-color: #f2f2f2; /*no*/
    line-height: 54px;
    font-size: 26px;

    span {
      margin-left: 10px;
      color: #605aa4;
      font-weight: bold;
      font-family: bigFont !important;
      font-size: 30px;
    }
  }

  .drop {
    position: absolute;
    top: 80px;
    right: 230px;
    color: #6d6d6d;
    font-size: 29px;
  }

  ul {
    background-color: #f2f2f2;
    border-top: 1px solid #e0dcd9; /*no*/
    border-bottom: 1px solid #e0dcd9; /*no*/
    margin: 16px auto 24px;
    padding: 0 20px;
    height: 125px;
    overflow: hidden;
    transition: 0.5s;

    .Unopened {
      span {
        display: inline-block;
        width: 52px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        border-radius: 50%;
        color: white;
        margin-left: 12px;
        margin-top: 15px;
        margin-bottom: 10px;
      }
    }
    li {
      font-size: 26px;
      color: #999;
      border-bottom: 1px solid #dedddb;

      /*no*/
      h3 {
        line-height: 48px;
      }

      dl {
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        margin: 12px auto 12px;

        dd {
          float: left;
          width: 53px;
          height: 53px;
          border-radius: 50%;
          text-align: center;
          line-height: 53px;
          color: white;
        }
      }
    }

    li:first-child {
      h3 {
        border-bottom: 1px solid #dedddb;
        /*no*/
      }
    }

    li:last-child {
      border: 0px;
      line-height: 54px;
      font-size: 28px;

      a {
        color: #959499;
      }
    }
  }

  .show {
    height: 683px;
  }
}
</style>
