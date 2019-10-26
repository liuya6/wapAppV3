<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
    >
      <div v-if="!lotteryArr.length && !noData" class="load">
        <van-loading size="50px" color="#fea24d" vertical></van-loading>
        <div>拼命加载中...</div>
      </div>
      <ul class="K3" v-if="lotteryArr.length">
        <li v-for="(item, i) in lotteryArr" :key="'l' + i">
          <span>{{ item.number }}期</span>
          <div>
            <span v-for="(child, j) in item.codeData" :key="j">
              <img
                :src="
                  require('../../assets/img/touzi/touzi_0' + child.code + '.png')
                "
                alt=""
              />
            </span>
          </div>
        </li>
      </ul>
      <div v-if="noData" class="noData">
        <div class="content_box">
          <div>
            <p><img :src="commonImg('default/noData.png')" alt="记录为空" /></p>
            <h4>暂无记录</h4>
          </div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
  import { lotteryHistory } from "../../api";
  export default {
    name: "HistoryK3",
    data() {
      return {
        isLoading: false, // 下拉刷新
        loading: false, // 上拉加载更多
        finished: false, // 上拉加载是否完成判断
        lotteryArr: [],
        noData: false,
        parameter: {
          pageSize: 30,
          offset: 0,
          typeId: this.$route.params.id
        }
      };
    },
    created() {
      this.lotteryHistoryStart();
    },
    methods: {
      lotteryHistoryStart() {
        lotteryHistory(this.parameter).then(res => {
          if(res.status) {
            this.lotteryArr = res.data;
            if(!this.lotteryArr.length) {
              this.noData = true;
            }else {
              if(this.lotteryArr.length<this.parameter.pageSize) {
                this.finished = true;
              }else {
                this.finished = false;
              }
              this.noData = false;
            }
          }else {
            this.noData = true;
          }
        });
      },
      onRefresh() {
        this.parameter.offset = 0;
        lotteryHistory(this.parameter).then(res => {
          if(res.status) {
            this.$toast("刷新成功");
            this.lotteryArr = res.data;
          }else {
            this.$toast("暂无更多数据");
          }
          this.isLoading = false;
        });
      },
      onLoad() {
        this.parameter.offset += this.parameter.pageSize;
        lotteryHistory(this.parameter).then(res => {
          let list;
          if (res.data.length) {
            list = res.data;
            if (
              this.lotteryArr[this.lotteryArr.length - 1].time ===
              res.data[0].time
            ) {
              list = res.data.shift();
            }
            this.lotteryArr = this.lotteryArr.concat(list);
            this.loading = false;
          } else {
            this.loading = false;
            this.finished = true;
          }
        });
      },
    }
  };
</script>

<style lang="less" scoped>
ul {
  overflow: hidden;
  transition: 0.5s;

  li {
    text-align: center;
    color: #959499;
    font-size: 28px;
    overflow: hidden;
    border-bottom: 1px solid #dfdcda;
    height: 94px;
    line-height: 94px;
    span {
      color: #666;
    }
    div {
      float: right;
      margin-right: 80px;

      span {
        display: inline-block;
        vertical-align: top;
        width: 90px;
        height: 90px;
        margin-top: 4px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
