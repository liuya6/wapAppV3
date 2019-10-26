<template>
  <div class="activityDetail flex" v-title="'活动申请详情'">
    <Header title="活动申请详情"></Header>
    <ul class="content">
      <li>
        <p>
          <span>活动名称</span>
          <span>{{ activityArr.title }}</span>
        </p>
        <p>
          申请状态<span
            :style="{
              color:
                activityArr.status == 0
                  ? 'blue'
                  : activityArr.status == 1
                  ? '#9a9a9a'
                  : 'red'
            }"
            >{{ activityArr.status | changeStatus }}</span
          >
        </p>
        <p>
          申请时间 <span>{{ timestampToString(activityArr.createtime) }}</span>
        </p>
        <p>
          备注信息 <span>{{ activityArr.info }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import { getActivityDetail } from "../../api";
export default {
  name: "ApplyActivityDetail",
  data() {
    return {
      activityArr: "",
      id: this.$route.params.id
    };
  },
  created() {
    this.initial();
  },
  activated() {
    this.id = this.$route.params.id;
    this.initial();
  },
  filters: {
    changeStatus: function(value) {
      switch (value) {
        case 0:
          return "待处理";
        case 1:
          return "已处理";
        default:
          return "已拒绝";
      }
    }
  },
  methods: {
    initial() {
      getActivityDetail({ id: this.id }).then(res => {
        if (res.status) {
          this.activityArr = res.data;
        }
      });

    }
  }
};
</script>
<style lang="less" scoped>
.activityDetail {
  height: 100%;
  background: #f5f5f5;
  .headerBox {
    border-bottom: 1px solid #f0f0f0; /*no*/
  }
  ul{
    text-align: left;
    font-size: 30px;
    li {
      background: #fff;
      p {
        line-height: 80px;
        padding-left: 20px;
        border-bottom: 1px solid #eaeaea; /*no*/
        overflow: hidden;
        span {
          margin-left: 150px;
        }
        &:nth-child(1) {
          span {
            &:nth-child(1) {
              float: left;
              margin-left: 0;
            }
            &:nth-child(2) {
              display: block;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
}
</style>
