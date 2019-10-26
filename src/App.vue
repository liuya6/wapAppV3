<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <div v-if="allConfig">
      <audio :src="`${allConfig.staticUrl}music/stop-time.mp3`" id="eventAudio" loop="loop" preload="auto"></audio>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      jackpotTimer: null
    };
  },
  // beforeCreate() {
  //   if (sessionStorage.getItem("nowUserAgent") == null) {
  //     if (
  //       window.navigator.userAgent.match(
  //         /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  //       )
  //     ) {
  //       sessionStorage.setItem("nowUserAgent", "移动");
  //     } else {
  //       sessionStorage.setItem("nowUserAgent", "PC");
  //     }
  //   }
  // },
  created() {
    window._vue = this;
    this.$store.dispatch("checkedLogin");
    this.$store.dispatch("getAllConfig");
    this.$store.dispatch("newAllGames");
    this.$store.dispatch("getLotteryLists");
    this.jackpotRun();
    sessionStorage.touchstartNum = "1";
    this.$nextTick(() => {
      window.document.addEventListener("touchstart", () => {
        let Audios = document.getElementById("eventAudio");
        if (sessionStorage.touchstartNum == "1") {
          Audios.load();
          sessionStorage.touchstartNum = "0";
        }
      });
    });
  },
  destroyed() {
    sessionStorage.removeItem("store");
    sessionStorage.clear();
  },
  computed: {
    ...mapGetters(["userInfo","allConfig","message"])
  },
  watch: {
    $route(newRouter) {
      let routerName = newRouter.name;
      if (
        routerName !== "bet" &&
        routerName !== "confirmpurchase" &&
        routerName !== "chasingcode"
      ) {
        if (this.oldCodeList.length) {
          this.CLEAR_OLD_CODE([]);
        }
      }
      if (routerName === "home") {
        this.jackpotRun();
      } else {
        clearInterval(this.jackpotTimer);
      }
      console.log(newRouter);
      if(routerName !== "chat" && routerName !== "otherReceipt" && routerName!=="bankReceipt") {
        console.log("111111111111111");
        if(window.nim) {
          window.nim.disconnect()
        }
        if(this.message) {
          this.$store.commit("SET_INIT_MESSAGE")
        }
      }
      if(newRouter.meta.keepAlive) {
        let documentTitles = newRouter.meta.DocumentTitle ? newRouter.meta.DocumentTitle + "-" + this.allConfig.webName : this.allConfig.webName;
        document.title = documentTitles;
      }
    },
  },
  methods: {
    jackpotRun() {
      clearInterval(this.jackpotTimer);
      this.jackpotTimer = setInterval(() => {
        this.$store.dispatch("jackpots");
      }, 10000);
    }
  }
};
</script>
