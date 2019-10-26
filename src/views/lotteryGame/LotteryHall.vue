<template>
  <div class="hall flex">
    <Header title="官方彩" :isSlot="true">
      <i class="iconfont back" @click="$router.push({name:'GamesLobby'})">&#xe629;</i>
    </Header>
    <div class="content" v-if="newAllGame.length">
      <dl>
        <dd
            v-for="(lottery, i) in newAllGame"
            :key="i"
            @click="changeLottery(lottery.gameType)"
        >
          <van-button
              :class="{ ons: lotteryType === lottery.gameType }"
          >
            {{ lottery.gameTitle }}
          </van-button>
        </dd>
      </dl>
      <ul>
        <li v-for="(itemOne, j) in currentGameList" :key="j">
          <van-button
              @click="
                  playLottery(
                    itemOne.gameId,
                    itemOne.classify,
                    itemOne.title
                  )
                "
          >
            <i>
              <img v-lazy="itemOne.img" />
            </i>
            <p>{{ itemOne.title }}</p>
          </van-button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from "vuex"
  export default {
    name: "Hall",
    data() {
      return {
        lotteryType: 1
      }
    },
    created () {
      console.log(this.newAllGame,"官方彩列表")
    },
    computed: {
      ...mapGetters(["newAllGame"]),
      currentGameList () {
        return this.newAllGame.filter(item=> item.gameType === this.lotteryType)[0].gameData
      }
    },
    methods: {
      changeLottery(type) {
        this.lotteryType = type;
      },
    }
  }
</script>
<style scoped lang="less">
.hall {
  .content {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-top: 1px solid #f0f0f0; /*no*/

    dl {
      overflow: hidden;
      width: 20%;
      height: 100%;
      background-color: #f6f6f6;

      dd {
        text-align: center;
        height: 113px;
        line-height: 113px;
        overflow: hidden;
        font-size: 30px;
        color: #666;
        .van-button {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          background-color: #f6f6f6;
          &.ons {
            background-color: #ffffff;
          }
        }
      }
    }

    ul {
      flex: 1;
      overflow-y: scroll;

      li {
        float: left;
        overflow: hidden;
        width: 33.333%;
        text-align: center;
        margin: 20px 0;
        .van-button {
          height: auto;
          i {
            display: inline-block;
            width: 120px;
            height: 120px;
          }

          p {
            font-size: 28px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
