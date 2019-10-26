<template>
  <div class="aboutWashCodeDetail" v-title="'洗码比例详情'">
    <Header :title="$route.params.title+'洗码比例'"></Header>
    <div v-if="loading" class="loading">
      <van-loading size="50px" color="#fea24d" vertical></van-loading>
      <div>拼命加载中...</div>
    </div>
    <div class="aboutWashCodeDetail-content" v-else>
      <van-tabs v-model="activeName" sticky swipeable>
        <van-tab title="当前等级">
        <dl>
          <dt>
            <span>洗码范围</span>
            <span>洗码等级</span>
            <span>洗码比例</span>
          </dt>
          <template v-if="currentWashcodeRate.length">
            <dd v-for="(item,i) in currentWashcodeRate" :key="i">
              <span>{{item.minBets}}</span>
              <span>{{item.levelName}}</span>
              <span>{{item.rate}}</span>
            </dd>
          </template>
          <template v-else>
            <dd>
              <div>
                暂无记录
              </div>
            </dd>
          </template>
        </dl>
        </van-tab>
        <van-tab title="下一等级">
          <dl>
            <dt>
              <span>洗码范围</span>
              <span>洗码等级</span>
              <span>洗码比例</span>
            </dt>
            <template v-if="nextWashcodeRate.length">
              <dd v-for="(item,j) in nextWashcodeRate" :key="j">
                <span>{{item.minBets}}</span>
                <span>{{item.levelName}}</span>
                <span>{{item.rate}}</span>
              </dd>
            </template>
            <template v-else>
              <dd>
                <div>
                  暂无记录
                </div>
              </dd>
            </template>
          </dl>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
  const list = [
    {
      title: "当前等级",
    },
    {
      title: "下一等级"
    },
  ];
  import { washCodeRateLevel } from "../../api";
  export default {
    name: "AboutWashCodeDetail",
    data() {
      return {
        list,
        activeName: "",
        parameter: {
          type: "",
          typeKey: ""
        },
        currentWashcodeRate: "",
        nextWashcodeRate: "",
        loading: true
      }
    },
    created () {
      console.log(this.$route.params.title);
      this.parameter.type = this.$route.params.type;
      this.parameter.typeKey = this.$route.params.typeKey;
      washCodeRateLevel(this.parameter).then(res=>{
        this.loading = false;
        console.log(res,"会员等级洗码比例");
        if(res.status){
          this.currentWashcodeRate = res.data.currentWashcodeRate;
          this.nextWashcodeRate = res.data.nextWashcodeRate;
        }
      })
    }
  }
</script>

<style scoped lang="less">
.aboutWashCodeDetail {
  min-height: 100%;
  background-color: #fafafa;
  .headerBox {
    background: @ThemeColor;
    color: #fff;
  }
  .aboutWashCodeDetail-content {
    padding-bottom: 34px;
    dl {
      width: 690px;
      margin: 34px auto 0;
      border: 1px solid #f1f1f1; /*no*/
      background-color: #fff;
      border-radius: 8px;
      dt {
        height: 120px;
        line-height: 120px;
        border-bottom: 1px solid #f1f1f1; /*no*/
      }
      dd {
        height: 120px;
        line-height: 120px;
        color: #999999;
        border-bottom: 1px solid #f1f1f1; /*no*/
        &:last-child {
          border: 0;
        }
        div {
          text-align: center;
          font-size: 26px;
        }
      }
      span {
        display: inline-block;
        width: 33.333%;
        text-align: center;
        font-size: 28px;
      }
    }
  }
  .loading {
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
</style>
