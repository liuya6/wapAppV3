<template>
  <div class="teamContacts flex" v-title="'团队往来记录'">
    <Header title="团队往来记录"></Header>
    <div class="content">
      <div class="hold" @click="typesShow = true">
        <span>类型</span>
        <div>
          <span>{{typeTitle}}</span>
          <i class="iconfont">&#xe63d;</i>
        </div>
      </div>
      <div>
        <span>账号</span>
        <van-field v-model="parameter.username" clearable placeholder="请输入用户名"></van-field>
      </div>
      <div class="hold" @click="calendarShow = true">
        <span>查询时间</span>
        <span>{{ parameter.startTime }} - {{ parameter.endTime }}</span>
        <i class="iconfont">&#xe63d;</i>
      </div>
      <div class="title">
        快速选择日期
      </div>
      <div>
        <van-button
            v-for="(item,i) in times"
            :key="i"
            :class="{active:item.type===timeActive}"
            @click="changeTime(item.type,item.startTime,item.endTime)"
        >{{ item.title }}</van-button>
      </div>
    </div>
    <footer>
      <van-button @click="search">查询</van-button>
    </footer>
    <van-popup v-model="typesShow" position="bottom" class="type">
      <h3>选择类型</h3>
      <ul>
        <li v-for="(item,i) in typeList" :key="i"
            class="hold"
            :class="{active: parameter.billType == item.type}"
            @click="[typesShow = false,typeTitle=item.title,parameter.billType = item.type]"
        >{{item.title}}</li>
      </ul>
    </van-popup>
    <calendar
        ref="myCalendar"
        @change="onChange"
        :show.sync="calendarShow"
        mode="during"
        :defaultDate="defaultDate"
        :monthNames="monthNames"
        :weekNames="weekNames"
    ></calendar>
  </div>
</template>

<script>
  import { teamLog } from "../../api";
  import dayjs from 'dayjs';
  const times = [
    {
      title: "今日",
      type: "1",
      startTime: dayjs().format('YYYY-MM-DD'),
      endTime: dayjs().add(1, 'day').format('YYYY-MM-DD')
    },
    {
      title: "昨日",
      type: "2",
      startTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
      endTime: dayjs().format('YYYY-MM-DD')
    },
    {
      title: "近一周",
      type: "3",
      startTime: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      endTime: dayjs().format('YYYY-MM-DD')
    },
    {
      title: "近一月",
      type: "4",
      startTime: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
      endTime: dayjs().format('YYYY-MM-DD'),
    }
  ];
  const typeList = [
    {
      title: "全部",
      type: "0"
    },
    {
      title: "充值",
      type: "10"
    },
    {
      title: "提现",
      type: "20"
    },
    {
      title: "返点",
      type: "30"
    },
    {
      title: "派奖",
      type: "40"
    },
    {
      title: "撤单",
      type: "50"
    },
    {
      title: "投注",
      type: "60"
    },
    {
      title: "额度转换",
      type: "70"
    },
    {
      title: "活动",
      type: "80"
    },
    {
      title: "其他",
      type: "90"
    },
  ];
  export default {
    name: "TeamContacts",
    data () {
      return {
        times,
        timeActive: "1",
        typesShow : false,
        typeList,
        typeTitle: "全部",
        calendarShow: false,
        defaultDate: [dayjs(), dayjs().add(1, 'day')],
        monthNames:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekNames: ['一', '二', '三', '四', '五', '六', '日'],
        dataTime: "",
        parameter: {
          startTime: dayjs().format('YYYY-MM-DD'),
          endTime: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          // timeType: "",
          billType: "0",
          username: "",
          page: 1,
          pageSize: 20
        }
      }
    },
    methods: {
      changeTime(type,startTime,endTime) {
        this.timeActive = type;
        // this.parameter.timeType = type;
        this.parameter.startTime = startTime;
        this.parameter.endTime = endTime;
        this.defaultDate = [startTime,endTime];
        this.$nextTick(()=>{
          this.$refs.myCalendar.$children[0].init();
        });
      },
      onChange(date) {
        this.dataTime = date.map((item) => item.format('YYYY-MM-DD'));
        if(date.length > 1) {
          console.log(this.dataTime);
          this.calendarShow = false;
          this.parameter.startTime = this.dataTime[0];
          this.parameter.endTime = this.dataTime[1];
          // this.parameter.timeType = "0";
          this.timeActive = "0";
        }
      },
      search() {
        // if(!this.parameter.username) {
        //   return this.$toast("请填写查询账号")
        // }
        console.log(this.parameter);
        teamLog(this.parameter).then(res=>{
          if(res.status) {
            if(res.data.list) {
              this.$store.commit("SET_CONTACTS_LIST",res.data.list);
            }else {
              this.$store.commit("SET_CONTACTS_LIST",[]);
            }
            this.$store.commit("SET_CONTACTS_PARAMETER",this.parameter);
            this.$router.push({name:"teamContactsList"})
          }else {
            this.$toast(res.msg);
          }
        })
      },
      initData() {
        this.typeTitle = "全部";
        this.defaultDate = [dayjs(), dayjs().add(1, 'day')];
        this.timeActive = "1";
        this.parameter = {
          startTime: dayjs().format('YYYY-MM-DD'),
          endTime: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          billType: "0",
          username: "",
          page: 1,
          pageSize: 20
        };
        this.$nextTick(()=>{
          this.$refs.myCalendar.$children[0].init();
        });
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if(from.name === "recommend") {
          vm.initData()
        }
      })
    }
  }
</script>

<style scoped lang="less">
.teamContacts {
  background-color: #f8f8f8;
  .headerBox {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .active{
    background-color: @ThemeColor !important;
    color: #fff !important;
  }
  .content {
    >div:not(.title) {
      background-color: #fff;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #f0f0f0; /*no*/
      text-indent: 30px;
      color: #666;
      padding-right: 30px;
      span {
        font-size: 28px;
      }
      .van-cell {
        width: 490px;
        height: 60px;
        padding: 0 10px 0 20px;
        border: 1px solid #f0f0f0; /*no*/
        font-size: 28px;
        display: flex;
        align-items: center;
        &:after {
          content: none;
        }
      }
      i {
        font-size: 30px;
        color: #999999;
        margin-left: 20px;
      }
      &:nth-child(5) {
        height: 80px;
        justify-content: start;
        align-items: center;
        .van-button {
          width: 100px;
          height: 60px;
          background-color: #f0f0f0;
          margin-left: 20px;
          border-radius: 5px;
          text-align: center;
          line-height: 60px;
          text-indent: 0;
          color: #666;
        }
      }
    }
    .title {
      text-indent: 30px;
      font-size: 30px;
      height: 60px;
      line-height: 60px;
      position: relative;
      padding-top: 20px;
      color: #666;
      &:before {
        content: " ";
        position: absolute;
        left: 0;
        top: 46%;
        width: 5px;
        height: 30px;
        background-color: @ThemeColor;
      }
    }
  }
  footer {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #f0f0f0; /*no*/
    .van-button {
      width: 700px;
      background: @Login-Btn-Bg;
      color: #fff;
      font-size: 32px;
      border-radius: 10px;
    }
  }
  .type {
    h3 {
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 30px;
      background-color: #f8f8f8;
      border-bottom: 1px solid #f0f0f0; /*no*/
    }
    ul {
      max-height: 600px;
      overflow-y: scroll;
      li {
        height: 80px;
        line-height: 80px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0; /*no*/
        box-sizing: border-box;
        color: #666;
        font-size: 28px;
        &:last-child {
          border: 0;
        }
      }
    }
  }
}
</style>