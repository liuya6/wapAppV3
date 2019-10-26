<template>
  <div v-if="ifShow" class="flexC goTop" @click="gotop">
    <i class="iconfont">&#xe71b;</i>
    <p>TOP</p>
  </div>
</template>

<script>
export default {
  name: "goTop",
  data() {
    return {
      ifShow: false
    };
  },
  created() {
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    handleScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // console.log(scrollTop, "scrollTop");
      if (scrollTop > 300) {
        this.ifShow = true;
      } else {
        this.ifShow = false;
      }
    },
    gotop() {
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style scoped lang="less">
.goTop {
  position: fixed;
  bottom: 120px;
  right: 10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid @ThemeColor;
  flex-direction: column;
  color: #fff;
  background: @ThemeColor;
  opacity: 0.7;
  i {
    transform: rotate(180deg);
    font-size: 34px;
    margin-top: -6px;
  }
  p {
    font-size: 20px;
    margin-top: -10px;
  }
}
</style>
