<template>
  <div class="electronic" v-title="'游戏大厅'">
    <div class="topSearch" v-if="ifSearch">
      <div class="flexS">
        <i class="iconfont">&#xe759;</i>
        <input type="text" placeholder="输入关键字" @input="searchChange" />
      </div>
      <span @click="openSearch">取消</span>
    </div>
    <div class="top" v-else>
      <i class="iconfont i1" @click="goBack">&#xe629;</i>
      {{ gameName }}
      <i class="iconfont i2" @click="openSearch">&#xe759;</i>
    </div>
    <div class="content">
      <div class="tab">
        <div
          v-for="(item, i) in tabList"
          :class="{active:index==i}"
          :key="i"
          @click="change(i)"
          class="flexC"
        >{{item}}</div>
      </div>
      <div v-if="loading" class="ele-loading">
        <van-loading size="50px" color="#fea24d" vertical></van-loading>
        <div>拼命加载中...</div>
      </div>
      <ul v-else-if="gameList.length&&index==0">
        <li v-for="(other, j) in gameList" :key="j">
          <div>
            <i class="imgI" @click="playGame('','','',other.link)">
              <img v-lazy="imgUrl(other.img, '')" />
            </i>
            <p class="flexC" @click="like(other)">
              {{ other.title }}
              <i
                class="iconfont"
                :class="{activeLove:nowIdArr.indexOf(other.gameId)>-1}"
              >&#xe75a;</i>
            </p>
          </div>
        </li>
      </ul>
      <ul v-else-if="recommend.length&&index==1">
        <li v-for="(other, j) in recommend" :key="j">
          <div>
            <i class="imgI" @click="playGame('','','',other.link)">
              <img v-lazy="imgUrl(other.img, '')" />
            </i>
            <p class="flexC" @click="like(other,j)">
              {{ other.title }}
              <i
                class="iconfont"
                :class="{activeLove:nowIdArr.indexOf(other.gameId)>-1}"
              >&#xe75a;</i>
            </p>
          </div>
        </li>
      </ul>
      <ul v-else-if="otherArr.length&&index==2">
        <li v-for="(other, j) in otherArr" :key="j">
          <div>
            <i class="imgI" @click="playGame('','','',other.link)">
              <img v-lazy="imgUrl(other.img, '')" />
            </i>
            <p class="flexC" @click="dislike(j)">
              {{ other.title }}
              <i class="iconfont activeLove">&#xe75a;</i>
            </p>
          </div>
        </li>
      </ul>
      <div v-else-if="!otherArr.length&&index==2" class="noData" @click="goIndex0">
        <p>
          <img v-lazy="commonImg('default/noData.png')" alt />
        </p>
        <h5>您的收藏记录是空的噢!</h5>
        <div>点击前往收藏</div>
      </div>
      <div
        v-else-if="(!gameList.length&&index==0)||(!recommend.length&&index==1)"
        class="noData"
        @click="goIndex0"
      >
        <p>
          <img :src="commonImg('default/noData.png')" alt />
        </p>
        <h5>暂无数据</h5>
      </div>
    </div>
    <playStart></playStart>
  </div>
</template>

<script>
import { thirdHall } from "../../api";
export default {
  name: "ElectronicGames",
  data() {
    return {
      tabList: ["全部游戏", "热门推荐", "我的收藏"],
      allList: [],
      gameList: [],
      recommend: [],
      index: 0,
      otherArr: [],
      nowIdArr: [],
      searchArr: [],
      title: "",
      ifSearch: false,
      searchGameTitle: "",
      loading: true
    };
  },
  created() {
    this.initHall();
    let likeArr = localStorage.getItem("likeArr");
    let idArr = localStorage.getItem("idArr");
    if (likeArr) {
      this.otherArr = JSON.parse(likeArr);
    }
    if (idArr) {
      this.nowIdArr = JSON.parse(idArr);
    }
  },
  beforeDestroy() {
    this.gameList = [];
    this.allList = [];
    this.recommend = []
  },
  computed: {
    gameName() {
      switch (this.$route.params.classify) {
        case "BY":
          return this.$route.params.typeKey + "捕鱼";
        default:
          return this.$route.params.typeKey + "电子";
      }
    }
  },
  methods: {
    openSearch() {
      this.ifSearch = !this.ifSearch;
    },
    searchChange(e) {
      if (!e.target.value) return (this.gameList = this.allList);
      let arr = [];
      this.allList.forEach(element => {
        if (element.title.indexOf(e.target.value) > -1) {
          arr.push(element);
        }
      });
      this.gameList = arr;
    },
    goIndex0() {
      this.index = 0;
      console.log(this.gameList)
    },
    initHall() {
      thirdHall({
        typeKey: this.$route.params.typeKey,
        classify: this.$route.params.classify
      }).then(res => {
        this.loading = false;
        this.gameList = res.data.list;
        this.allList = res.data.list;
        this.recommend = res.data.recommend;
      });
    },
    goBack() {
      this.gameList = [];
      this.$router.go(-1);
    },
    change(i) {
      this.index = i;
    },
    like(other) {
      let index = this.nowIdArr.indexOf(other.gameId);
      if (index > -1) {
        this.otherArr.splice(index, 1);
        this.nowIdArr.splice(index, 1);
        let idArr = JSON.parse(localStorage.getItem("idArr"));
        idArr.splice(index, 1);
        localStorage.setItem("idArr", JSON.stringify(idArr));
        let likeArr = JSON.parse(localStorage.getItem("likeArr"));
        likeArr.splice(index, 1);
        localStorage.setItem("likeArr", JSON.stringify(likeArr));
        return;
      }
      let likeArr = JSON.parse(localStorage.getItem("likeArr"));
      let idArr = JSON.parse(localStorage.getItem("idArr"));
      if (idArr) {
        idArr.push(other.gameId);
        this.nowIdArr = idArr;
        localStorage.setItem("idArr", JSON.stringify(idArr));
      } else {
        let empty = [];
        empty.push(other.gameId);
        this.nowIdArr = empty;
        localStorage.setItem("idArr", JSON.stringify(empty));
      }
      if (likeArr) {
        likeArr.push(other);
        this.otherArr = likeArr;
        localStorage.setItem("likeArr", JSON.stringify(likeArr));
      } else {
        let empty = [];
        empty.push(other);
        this.otherArr = empty;
        localStorage.setItem("likeArr", JSON.stringify(empty));
      }
    },
    dislike(j) {
      this.otherArr.splice(j, 1);
      this.nowIdArr.splice(j, 1);
      let idArr = JSON.parse(localStorage.getItem("idArr"));
      idArr.splice(j, 1);
      localStorage.setItem("idArr", JSON.stringify(idArr));
      let likeArr = JSON.parse(localStorage.getItem("likeArr"));
      likeArr.splice(j, 1);
      localStorage.setItem("likeArr", JSON.stringify(likeArr));
    }
  }
};
</script>

<style scoped lang="less">
.electronic {
  .top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 37px;
    background-color: #fff;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    text-align: center;
    z-index: 1;

    .i1 {
      position: absolute;
      padding: 0 10px;
      left: 16px;
      font-size: 46px;
    }

    span {
      color: white;
      font-weight: normal;
      position: absolute;
      right: 25px;
      font-size: 30px;
    }
    .i2 {
      position: absolute;
      right: 30px;
      top: 0;
      font-size: 56px;
    }
  }
  .topSearch {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    font-size: 37px;
    background-color: #fff;
    color: #333;
    border-bottom: 1px solid #f0f0f0;
    z-index: 1;
    display: flex;
    div {
      width: 600px;
      // border-radius: 35px;
      // background: @ThemeColor;
      height: 80px;
      margin-top: 10px;
      margin-left: 40px;

      i {
        font-size: 56px;
        margin-right: 40px;
        color: @ThemeColor;
      }
      input {
        height: 60px;
        line-height: 60px;
        max-width: 400px;
        font-size: 34px;
        border: 0;
      }
    }
  }
  .content {
    padding-top: 100px;
    .tab {
      display: flex;
      margin: 0 auto;
      width: 600px;
      border-radius: 35px;
      margin-top: 20px;
      overflow: hidden;
      z-index: 10;
      div {
        background: #ffca98;
        flex: 1;
        height: 70px;
        color: rgb(129, 129, 129);
        border-right: 1px solid #fff;
        font-size: 26px;
      }
      div:last-child {
        border-right: 0;
      }
      .active {
        background: @ThemeColor;
        color: #fff;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;

      li {
        overflow: hidden;
        width: 25%;
        text-align: center;
        margin: 10px 0;

        div {
          .imgI {
            display: inline-block;
            width: 120px;
            height: 120px;
            line-height: 120px;

            img {
              display: inline-block;
              vertical-align: middle;
              width: 100%;
              height: 100%;
            }
          }

          p {
            font-size: 24px;
            color: #666;
            margin: 8px 0;
            i {
              font-size: 30px;
              color: rgb(167, 167, 167);
              margin: 5px 0 0 5px;
            }
          }
          .activeLove {
            color: @ThemeColor;
          }
        }
      }
    }
    .noData {
      text-align: center;
      z-index: 1;
      h5 {
        margin-top: 20px;
        font-size: 28px;
      }
      div {
        margin: 20px auto 0;
        width: 200px;
        height: 60px;
        line-height: 60px;
        font-size: 28px;
        color: #fff;
        background: @ThemeColor;
        border-radius: 10px;
      }
    }
    .ele-loading {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      .van-loading {
        display: inline-block;
        margin-bottom: 15px;
      }
    }
  }
}
::-webkit-scrollbar {
  display: none;
}
</style>
