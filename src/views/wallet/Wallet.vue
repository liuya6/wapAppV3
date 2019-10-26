<template>
  <div class="wallet flex" v-title="'充值'">
    <div class="header">
      <span>充值</span>
      <i class="iconfont" @click="directionsShow = true">&#xe717;</i>
      <b @click="$router.push({name:'rechargerecord'})">充值记录</b>
    </div>
    <div class="content">
      <van-tabs swipeable @change="change" v-model="activeIndex">
          <van-tab v-for="item in tabTitle" :key="item.type" :title="item.title">
            <div v-if="activeType === 'assist'" class="assist">
              <dl>
                <dt>
                  <span @click="$router.push({name:'orderTrack'})">订单查询</span>
                </dt>
                <dd v-for="(item,i) in kfList" :key="i">
                  <div>
                    <div>
                      <img v-lazy="item.kefuAvatar" alt="" />
                    </div>
                    <div>
                      <p>{{item.kefuName}}</p>
                      <p>
                        <i class="iconfont">&#xe728;</i>
                        <i class="iconfont">&#xe728;</i>
                        <i class="iconfont">&#xe728;</i>
                        <i class="iconfont">&#xe728;</i>
                        <i class="iconfont">&#xe728;</i>
                      </p>
                      <p>{{item.kefuRemark}}</p>
                    </div>
                  </div>
                  <div @click="matchKf(item.kefuId)">
                    <van-button>进入充值</van-button>
                  </div>
                </dd>
              </dl>
            </div>
            <div v-else-if="activeType === 'online'" class="online">
              <van-cell-group >
                <van-cell
                    v-for="(item,i) in rechargeArr.online"
                    :title="item.title"
                    is-link
                    :key="i"
                    icon=""
                    @click="showTabList(item.data,item.type)">
                  <img v-lazy="item.typeImg" alt="">
                </van-cell>
              </van-cell-group>
            </div>
            <div v-else class="human">
              <van-cell-group >
                <van-cell
                  v-for="(item,i) in rechargeArr.human"
                  :title="item.title"
                  is-link
                  :key="i"
                  icon=""
                  @click="showTabList(item.data,item.type)"
                >
                  <img v-lazy="item.typeImg" alt="">
                </van-cell>
              </van-cell-group>
            </div>
          </van-tab>
        </van-tabs>
    </div>
    <van-popup v-model="tipsShow" class="tips">
      <div>
        <h3>提示</h3>
        <div>
          <p>您有未完成的订单！</p>
          <div>
            <van-button @click="newOrder">新建订单</van-button>
            <van-button @click="$router.push({name:'orderTrack'})">去查看</van-button>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="popupShow" class="popup" position="bottom">
      <ul>
        <li
            @click="gotoPay(item.payWay, item.id,item.rechargeMoney,item.rechargeMoneyType,item.type)"
            v-for="(item, i) in TabList"
            :key="i"
        >
          <div>
            <img v-lazy="item.rechargeImg" alt="" />
          </div>
          <div>
            <p>{{ item.rechargeName }}</p>
            <span>{{ item.desc }}</span>
          </div>
        </li>
      </ul>
    </van-popup>
    <transition name="fadeUp">
      <div class="directions" v-show="directionsShow">
        <dl>
          <dt>
            充值小贴士
            <i class="iconfont" @click="directionsShow = false">&#xe71a;</i>
          </dt>
          <dd>充值</dd>
          <dd>付款成功后5分钟内到账，如遇网络延迟的情况请耐心等待5~10分钟，如还未到账请及时联系客服。</dd>
          <dd>*建议您使用高效安全的“官方线上充值”</dd>
          <dd>
            <van-button to="/servicePage">
              联系客服
            </van-button>
          </dd>
        </dl>
      </div>
    </transition>
    <transition name="fadeUp">
      <div class="notice" v-show="noticeShow">
        <dl>
          <dt>
            <img src="../../assets/img/rechargeNotice.png" alt="">
          </dt>
          <dd v-html="allConfig.wapRechargeNotice"></dd>
          <dd>
            <input type='checkbox' id='keep' v-model="doNotShow" />
            <label For='keep'>今日不再提醒</label>
          </dd>
          <dd @click="notShow">
            <van-button>
              我知道了
            </van-button>
          </dd>
        </dl>
      </div>
    </transition>
    <Footer></Footer>
    <CheckIn></CheckIn>
  </div>
</template>

<script>
  import { rechargeBefore, rechargeApply, getAppKey,kefuList } from "../../api";
  import { mapGetters,mapMutations,mapActions } from "vuex";
  const tabTitle = [
    { title: "辅助充值", type: "assist" },
    { title: '自助充值', type: "online" },
    { title: '人工充值', type: "human" }
  ];
  export default {
    name: "Wallet",
    data() {
      return{
        popupShow: false,
        directionsShow: false,
        noticeShow: true,
        doNotShow: false,
        tipsShow: false,
        tabTitle,
        money: '',
        activeType: "assist",
        activeIndex: "0",
        TabList: [],
        imgType: '',
        kefuIds: ""
      }
    },
    created() {
      this.initData();
      let doNotShow = this.$cookies.get("doNotShow");
      if(doNotShow) {
        this.noticeShow = false;
      }
    },
    activated() {
      this.initData()
    },
    computed: {
      ...mapGetters(['rechargeArr','kfList','allConfig']),
    },
    methods: {
      ...mapMutations(['SET_RECHARGE_ARR']),
      ...mapActions(['SubmitOrders']),
      initData() {
        if(typeof this.kfList === 'undefined' || !this.kfList.length) {
          this.initKfList()
        }
        if(typeof this.rechargeArr === 'undefined' || !this.rechargeArr.online) {
          this.initRechargeArr()
        }
      },
      initRechargeArr() {
        rechargeBefore().then(res=>{
          console.log(res.data,'充值列表');
          if(res.status) {
            this.SET_RECHARGE_ARR(res.data)
          }
        })
      },
      initKfList() {
        kefuList().then(res=>{
          console.log(res,"客服列表");
          if(res.status) {
            this.$store.commit("SET_KF_LIST",res.data);
          }
        });
      },
      change(index) {
        this.activeType = this.tabTitle[index].type;
      },
      showTabList(data,imaType) {
        console.log(data);
        this.TabList = data;
        this.popupShow = true;
        this.imgType = imaType;
      },
      gotoPay(payWay, id,rechargeMoney,rechargeMoneyType,type) {
        console.log(rechargeMoney,rechargeMoneyType,type);
        rechargeApply({ methodId: id }).then(res => {
          if(res.status) {
            let rechargeMoneyList = [];
            if(rechargeMoney){
              if(rechargeMoney instanceof Array) {
                rechargeMoneyList = rechargeMoney;
              }else {
                rechargeMoneyList.push(rechargeMoney);
              }
            }else {
              rechargeMoneyList = ""
            }
            this.$store.commit("ORDERS", res.data);
            this.$store.commit("SET_RECHARGE_TYPE",rechargeMoneyType);
            this.$store.commit("SET_RECHARGE_LIST",rechargeMoneyList);
            this.$store.commit("SET_RECHARGE_MONEY","");
            this.$store.commit("SET_RECHARGE_NAME","");
            switch (payWay) {
              case 1:
                this.$router.push({ name: "paying", query: { id: id } });
                break;
              default:
                this.$router.push({name:"humanpaying", params:{ payWay:payWay, id: id ,type: type }});
            }
          }else {
            this.$toast(res.msg)
          }
        });
      },
      notShow() {
        if(this.doNotShow) {
          this.$cookies.set("doNotShow",1,this.currentDay());
        }
        this.noticeShow = false;
      },
      matchKf(id) {
        getAppKey({kefuId:id}).then(res=>{
          console.log(res,"客服信息");
          if(res.status){
            if(res.data.existOldOrder > 0){
              this.tipsShow = true;
              this.kefuIds = id;
            }else {
              this.changeChatDetails(res)
            }
          }
        })
      },
      newOrder() {
        let parameter = {
          kefuId: this.kefuIds,
          id: 0,
          forceCreate: 1
        };
        getAppKey(parameter).then(res=>{
          console.log(res);
          if(res.status) {
            this.changeChatDetails(res)
          }
        })
      },
    }
  }
</script>

<style scoped lang="less">
.wallet {
  .header{
    width: 100%;
    height: 100px;
    overflow: hidden;
    text-align: center;
    position: relative;
    span {
      font-size: 42px;
      line-height: 100px;
    }
    i {
      font-size: 46px;
      position: absolute;
      top: 0;
      padding: 0 10px;
      left: 20px;
      line-height: 100px;
    }
    b {
      position: absolute;
      right: 20px;
      font-weight: normal;
      font-size: 30px;
      padding-top: 30px;
    }
  }
  .content {
    .assist {
      dl {
        padding: 0 30px;
        border-top: 1px solid #f0f0f0;
        dt {
          text-align: center;
          margin-top: 30px;
          span {
            color: @ThemeColor;
            font-size: 24px;
            border-bottom: 1px solid @ThemeColor;
          }
        }
        dd {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 0;
          border-bottom: 1px solid #f0f0f0;
          > div {
            display: flex;
            align-items: center;
            div {
              &:nth-child(1) {
                width: 110px;
                height: 110px;
                margin-right: 32px;
                border-radius: 50%;
                overflow: hidden;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              p {
                &:nth-child(1) {
                  font-size: 30px;
                }
                &:nth-child(2) {
                  margin: 10px 0;
                }
                &:nth-child(3) {
                  color: #999;
                }
                i {
                  color: @ThemeColor;
                }
              }
            }
            .van-button {
              width: 180px;
              height: 60px;
              line-height: 60px;
              background: @Amount-Right-Btn;
              color: #fff;
              border-radius: 60px;
            }
          }
        }
      }
    }
    .tabTitle{
      overflow: hidden;
      .borderBtm();
      height: 100px;
      display: flex;
      align-items: center;
      div{
        float: left;
        width: 50%;
        text-align: center;
        span {
          font-size: 32px;
          color: @Bill-Font-Color;
          border-bottom: 4px solid transparent;
          padding-bottom: 10px;
        }
        .on {
          color: @ThemeColor;
          border-bottom-color: @ThemeColor;
        }
      }
    }
  }
  .popup {
    ul {
      width: 100%;
      height: 580px;
      background-color: #fff;
      overflow-y: scroll;

      li {
        border-bottom: 1px solid #f0f0f0; /*no*/
        overflow: hidden;
        padding: 37px 0 37px 40px;
        div {
          float: left;
          text-align: left;

          p {
            font-size: 30px;
            line-height: 50px;
          }

          span {
            color: #999999;
          }
        }

        div:first-child {
          width: 90px;
          height: 90px;
          margin-right: 30px;
          line-height: 120px;

          img {
            width: 100%;
            display: inline-block;
          }
        }
        div:nth-child(2) {
          width: 550px;
          overflow: hidden;
        }
      }
    }
  }
  .PopupSuccess {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;
    text-align: center;

    ul {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: #fff;
      width: 550px;
      height: 550px;
      margin: auto;
      border-radius: 18px;
      overflow: hidden;
      li{
        padding: 0 30px;
      }
      li:first-child {
        color: #999;
        font-size: 200px;
        margin-top: 40px;
      }

      li:nth-child(2) {
        line-height: 58px;
        font-size: 36px;
      }

      li:nth-child(3) {
        color: #999999;
        line-height: 48px;
      }

      li:last-child {
        padding: 0;
        width: 100%;
        position: absolute;
        bottom: 30px;

        span {
          display: inline-block;
          width: 228px;
          height: 88px;
          border: 1px solid #dedddb; /*no*/
          border-radius: 10px;
          line-height: 88px;
          text-align: center;
          font-size: 32px;
        }

        span:first-child {
          margin-right: 5px;
          background-color: #f6f6f6;
        }

        span:last-child {
          margin-left: 5px;
          background: @Amount-Right-Btn;
          color: white;
        }
      }
    }
  }
  .directions{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;
    dl {
      width: 590px;
      height: 600px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      border-radius: 18px;
      overflow: hidden;
      background-color: #fff;
      dt {
        background: @Amount-Right-Btn;
        line-height: 100px;
        font-size: 32px;
        color: #fff;
        text-align: center;
        i {
          font-size: 30px;
          position: absolute;
          right: 30px;
        }
      }
      dd {
        padding: 0 30px;
        &:nth-child(2) {
          margin-top: 40px;
          margin-bottom: 30px;
          font-size: 32px;
        }
        &:nth-child(3) {
          font-size: 28px;
          line-height: 45px;
        }
        &:nth-child(4){
          color: @red;
          margin-top: 50px;
          margin-bottom: 66px;
        }
        &:last-child {
          padding: 0;
          text-align: center;
          margin: auto;
          width: 300px;
          height: 82px;
          line-height: 82px;
          border-radius: 82px;
          font-size: 28px;
          overflow: hidden;
          .van-button {
            width: 100%;
            height: 100%;
            background: @Amount-Right-Btn;
            color: #fff;
          }
        }
      }
    }
  }
  .notice {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 999;
    dl {
      width: 590px;
      height: 838px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      border-radius: 15px;
      overflow: hidden;
      dt {
        height: 170px;
        background-color: red;
        img {
          width: 100%;
          height: 100%;
        }
      }
      dd{
        margin: 0 30px;
        line-height: 50px;
        font-size: 28px;
        p {
          b {
            color: @red;
          }
        }
        &:nth-child(2) {
          margin-top: 30px;
        }
        &:nth-child(5) {
          margin-top: 30px;
          margin-bottom: 30px;
        }
        &:last-child {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translate(-50%,0);
          margin: 0;
          width: 380px;
          height: 82px;
          text-align: center;
          line-height: 82px;
          .van-button {
            width: 100%;
            height: 100%;
            background: @Amount-Right-Btn;
            border-radius: 82px;
            color: #fff;
          }
        }
        input[type='checkbox'] {
          width: 28px;
          height: 28px;
          line-height: 28px;
          display: inline-block;
          vertical-align: middle;
          -webkit-appearance:none;
          .borderAll();
          text-align: center;
          margin: 0 10px 0 10px;
        }
        input[type=checkbox]:checked {
          border: 1px solid @ThemeColor;
          background: #fff;
          color: @ThemeColor;
          line-height: 28px;
          &::after {
            content: '\2714';
            color: @ThemeColor;
            line-height: 28px;
          }
        }
        label {
          font-size: 25px;
          display: inline-block;
          vertical-align: middle;
          color: @Bill-Font-Color-Pale;
        }
      }
    }
  }
  .tips {
    width: 542px;
    padding: 0;
    border-radius: 5px;
    div {
      h3 {
        background-color: @ThemeColor;
        text-align: center;
        height: 90px;
        line-height: 90px;
        font-size: 35px;
        color: #fff;
      }
      >div {
        padding: 0 30px;
        p {
          line-height: 90px;
          font-size: 28px;
          font-weight: bold;
          color: #000;
        }
        div {
          display: flex;
          justify-content: space-between;
          margin-bottom: 65px;
          padding: 0;
          .van-button {
            width: 200px;
            height: 82px;
            line-height: 82px;
            text-align: center;
            box-sizing: border-box;
            border-radius: 10px;
            font-size: 28px;
            &:nth-child(1) {
              border: 1px solid #aeaeae; /*no*/
              color: #000;
            }
            &:nth-child(2) {
              background-color: @ThemeColor;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
