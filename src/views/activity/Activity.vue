<template>
  <div class="activity" v-title="'活动'">
    <fixHead title="活动" rightTitle="申请记录" rightTo="/applyactivitylist" :isSlot="true"></fixHead>
    <div class="content1">
      <van-tabs v-model="active" :swipe-threshold=5 swipeable @change="changeTab">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-tab v-for="(arr,i) in allConfig.activityNavList" :key="i" :class="{vanTab5:i>4}">
            <div slot="title">{{arr.name}}</div>
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
              :immediate-check="false"
            >
              <div v-for="(item,i) in activity" :key="i" class="wrap">
                <div @click="toActivityContent(item.content)">
                <img v-if="item.endTime==0" :src="cdnImg('icons/always.png')" alt />
                <img v-else-if="item.startTime>newDate" :src="cdnImg('icons/soon.png')" alt />
                <img v-else-if="item.endTime>0&&item.endTime>=newDate" :src="cdnImg('icons/now.png')" alt />
                <img v-else :src="cdnImg('icons/end.png')" alt />
                <div class="banner">
                  <ImgLoading :src="item.image" alt />
                </div>
                <div class="headTitle">{{item.title}}</div>
                <div class="description">{{item.description}}</div>
                <div class="time" v-if="item.startTime>newDate">
                  距离活动开始：
                  <activityTimer :time="item.startTime - newDate" @changeDate="changeDate"></activityTimer>
                </div>
                <div class="time" v-else-if="item.endTime>0&&item.endTime>=newDate">
                  距离活动结束：
                  <activityTimer :time="item.endTime - newDate" @changeDate="changeDate"></activityTimer>
                </div>
                  <!--
                   :class="{'radiu':showIndex!==i}"
                  -->
                <div class="flexB">
                  <div class="title">
                    <p>查看详情</p>
                  </div>
                  <!--
                  :class="{'rotate':showIndex===i}"
                  -->
                  <i class="iconfont" >&#xe727;</i>
                </div>
                </div>
<!--                <div :class="[i === showIndex ? 'show1' : 'hide1']" class="activityDetail">-->
<!--                  <div v-html="item.content"></div>-->
<!--                </div>-->
              </div>
            </van-list>
          </van-tab>
        </van-pull-refresh>
      </van-tabs>
    </div>
    <goTop></goTop>
    <Footer></Footer>
    <CheckIn></CheckIn>
  </div>
</template>

<script>
import { activity } from "../../api";
import { mapGetters } from "vuex";
import ImgLoading from "../../components/common/ImgLoading";
export default {
  name: "Activity",
  components: { ImgLoading },
  data() {
    return {
      newDate: "",
      isLoading: false,
      loading: false,
      finished: false,
      active: 0,
      showIndex: "",
      parameter: {
        type: "",
        page: 1,
        pageSize: 10
      },
      activity: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["allConfig"])
  },
  methods: {
    changeDate(){
      this.newDate = parseInt(new Date().getTime() / 1000);
    },
    toActivityContent(content) {
      this.$store.commit("SET_ACTIVITY_CONTENT",content);
      this.$router.push({name:"activitycontent"})
    },
    changeTab(index) {
      this.activity = [];
      this.parameter.page = 1;
      this.parameter.type = this.allConfig.activityNavList[index].type;
      this.init();
    },
    init() {
      this.newDate = parseInt(new Date().getTime() / 1000);
      activity(this.parameter).then(res => {
        if (res.status) {
          this.activity = res.data.list;
          if (res.data.list.length < this.parameter.pageSize) {
            this.finished = true;
          } else {
            this.finished = false;
          }
        }
      });
    },
    onRefresh() {
      this.parameter.page = 1;
      this.finished = false;
      let that = this;
      new Promise(function(resolve) {
        activity(that.parameter).then(res => {
          if (res.status) {
            that.activity = res.data.list;
            resolve(res.data.list);
          }
        });
      }).then(res => {
        if (res.length) {
          that.$toast("刷新成功");
        } else {
          that.$toast("暂无更多数据");
        }
        that.isLoading = false;
      });
    },
    onLoad() {
      this.parameter.page++;
      activity(this.parameter).then(res => {
        if (res.data.list.length) {
          console.log(res.data.list, "加载更多");
          this.activity = this.activity.concat(res.data.list);
          this.loading = false;
        } else {
          this.loading = false;
          this.finished = true;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.activity {
  .fixHead {
    background: #fff;
  }
  .content1 {
    padding: 210px 0 80px 0;
    .wrap {
      position: relative;
      margin: 0 22px 40px 22px;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 2px 3px rgba(0, 0, 0, 0.24);
      >div{
        > img {
          position: absolute;
          right: 0;
          width: 120px;
        }
      }
      .banner {
        height: 220px;
        margin: 0 auto 20px;
      }
      .headTitle {
        color: #cf453a;
        font-size: 30px;
        padding-left: 20px;
      }
      .description,
      .time {
        color: #999999;
        font-size: 24px;
        line-height: 30px;
        letter-spacing: 1px;
      }
      .description {
        padding: 20px 0 30px 20px;
      }
      .time {
        padding: 0 0 30px 20px;
        span {
          color: red;
        }
      }
      .flexB {
        padding: 26px 20px 26px 20px;
        border-top: 1.6px solid #e1e1e1;
        background: #fff;
        .title {
          display: flex;
          p {
            font-size: 26px;
            color: #282828;
          }
        }
        i {
          font-size: 34px;
          color: #cccccc;
          transition: 0.4s;
        }
      }
      .radiu {
        border-radius: 0 0 18px 18px;
      }
    }
    .activityDetail {
      margin: auto;
      background: #fff;
      overflow: hidden;
      line-height: 40px;
      letter-spacing: 2px;
      height: 0;
      max-height: 0;
      transition: 2s;
      width: 650px;
      border-radius: 0 0 15px 15px;
      table {
        width: 100%;
      }
      .application {
        width: 97%;
        height: 50px;
        display: block;
        line-height: 50px;
        margin: 20px auto;
        background: @red;
        color: #fff;
        border: 0;
        outline: none;
      }
      .gray {
        background: gray;
      }
      img {
        max-width: 100%;
      }
      .MsoNormalTable {
        max-width: 100% !important;
      }
    }
    /*.show1 {*/
    /*  max-height: 25000px;*/
    /*  height: auto;*/
    /*  transition: 3s;*/
    /*  overflow: hidden;*/
    /*}*/
    /*.hide1 {*/
    /*  max-height: 0;*/
    /*  height: 0;*/
    /*  transition: 3s;*/
    /*}*/
  }
  .footer {
    position: fixed;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: 100px;
  }
}
</style>
