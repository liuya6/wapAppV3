<template>
  <div class="header">
    <div class="headerBox">
      <i class="iconfont" @click="back">&#xe629;</i>
      <span>人工客服充值</span>
<!--      <span @click.stop="moreShow = !moreShow">更多...</span>-->
<!--      <span>教程</span>-->
    </div>
<!--    <transition name="slideInDown">-->
<!--      <ul v-show="moreShow" @click.stop>-->
<!--        <li v-for="(item,i) in moreList" :key="i" class="hold">-->
<!--          <div class="moreContent">-->
<!--            <div>-->
<!--              <i class="iconfont" v-html="item.icon" :style="{color:item.color}"></i>-->
<!--            </div>-->
<!--            <p>{{item.title}}</p>-->
<!--          </div>-->
<!--        </li>-->
<!--      </ul>-->
<!--    </transition>-->
  </div>
</template>

<script>
  // const moreList = [
  //   {
  //     icon: "&#xe61d;",
  //     title: "复制消息",
  //     type: "copy",
  //     color: "#97a6d3"
  //   },
  //   {
  //     icon: "&#xe60d;",
  //     title: "新手教程",
  //     type: "copy",
  //     color: "#528e5f"
  //   },
  //   {
  //     icon: "&#xe625;",
  //     title: "投诉客服",
  //     type: "copy",
  //     color: "#f87562"
  //   }
  // ];
  export default {
    name: "ChatHeader",
    data() {
      return {
        // moreList,
        moreShow: false
      }
    },
    created () {
      window.addEventListener("click",()=>{
        if(this.moreShow) {
          this.moreShow = false
        }
      })
    }
  }
</script>

<style scoped lang="less">
.header {
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 10;
  .headerBox {
    height: 100px;
    overflow: hidden;
    background: linear-gradient(to right, #fe9739, #fd6c30);
    position: relative;
    z-index: 2;
    i {
      font-size: 46px;
      position: absolute;
      padding: 0 10px;
      left: 16px;
      line-height: 100px;
      color: #fff;
    }
    span {
      line-height: 100px;
      color: #fff;
      &:nth-child(2) {
        font-size: 42px;
      }
      &:nth-child(3) {
        position: absolute;
        right: 30px;
        font-size: 28px;
      }
    }
  }
  ul {
    position: absolute;
    top: 100px;
    width: 100%;
    height: 170px;
    display: flex;
    z-index: 1;
    background-color: #fff;
    box-shadow: 0 1px 14px 0 rgba(0, 0, 0, 0.2);
    li {
      width: 33.33%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .moreContent {
        div {
          padding-bottom: 20px;
          i {
            font-size: 55px;
          }
        }
        p {
          font-size: 30px;
        }
      }
    }
  }
}
</style>