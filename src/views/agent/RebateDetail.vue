<template>
  <div class="RebateDetail flex" v-title="'返点详情'">
    <Header title="返点详情"></Header>
    <div class="content" v-if="rebateDetailList && rebateDetailList.id">
      <div>
        <span>
          推广名称
        </span>
        <input type="text" v-model="parameter.name" maxlength="8" />
      </div>
      <template v-if="rebateDetailList && rebateDetailList.validBetSet.enable=='1'">
        <h3>{{rebateDetailList.validBetSet.name}}</h3>
        <ul>
          <li v-for="(item,i) in rebateDetailList.validBetSet.list" :key="i">
            <span>{{item.name}}</span>
            <input type="text" v-model="parameter[i + 'ValidBetFandian']"/>
            <span>%</span>
            <span>可设置范围{{toFixeds(item[i+"MinValidBetFandian"])}}-{{toFixeds(item[i+"MaxValidBetFandian"])}}%</span>
          </li>
        </ul>
      </template>
      <template v-if="rebateDetailList && rebateDetailList.lossSet.enable=='1'">
        <h3>{{rebateDetailList.lossSet.name}}</h3>
        <ul>
          <li v-for="(item,i) in rebateDetailList.lossSet.list" :key="i">
            <span>{{item.name}}</span>
            <input type="text" v-model="parameter[i + 'LossFandian']" />
            <span>%</span>
            <span>可设置范围{{toFixeds(item[i+"MinLossFandian"])}}-{{toFixeds(item[i+"MaxLossFandian"])}}%</span>
          </li>
        </ul>
      </template>
      <template v-if="rebateDetailList && rebateDetailList.rechargeSet.enable=='1'">
        <h3>{{rebateDetailList.rechargeSet.name}}</h3>
        <ul>
          <li v-for="(item,i) in rebateDetailList.rechargeSet.list" :key="i">
            <span>{{item.name}}</span>
            <input type="text" v-model="parameter[i + 'Fandian']"/>
            <span>%</span>
            <span>可设置范围{{toFixeds(item[i+"MinFandian"])}}-{{toFixeds(item[i+"MaxFandian"])}}%</span>
          </li>
        </ul>
      </template>
    </div>
    <footer>
      <van-button @click="modifyLink">确定</van-button>
    </footer>
  </div>
</template>

<script>
  import { getLinks, modifyLinks } from "../../api";
  export default {
    name: "RebateDetail",
    data() {
      return {
        rebateDetailList: [],
        parameter: {
          id: "",
          name: ""
        }
      }
    },
    created() {
      this.parameter.id = this.$route.params.id;
      this.initDetails()
    },
    methods: {
      initDetails() {
        getLinks({id:this.$route.params.id}).then(res=>{
          if(res.status) {
            this.rebateDetailList = res.data;
            this.initParameter()
          }
        })
      },
      modifyLink() {
        if(!this.parameter.name) {
          return this.$toast("请输入推广名称")
        }else {
          if(/\s/g.test(this.parameter.name)) {
            return this.$toast("推广名称不能包括空格")
          }
        }
        console.log(this.parameter);
        if(this.rebateDetailList.validBetSet.enable =="1") {
          let validBetSetList = this.rebateDetailList.validBetSet.list;
          for(let i in validBetSetList) {
            if(!this.parameter[i+'ValidBetFandian']) {
              return this.$toast("请填写"+ validBetSetList[i].name + this.rebateDetailList.validBetSet.name)
            }else {
              if(this.parameter[i+'ValidBetFandian'] < validBetSetList[i][i+'MinValidBetFandian'] || this.parameter[i+'ValidBetFandian'] > validBetSetList[i][i+'MaxValidBetFandian'] ) {
                return this.$toast(validBetSetList[i].name + this.rebateDetailList.validBetSet.name + "范围在" + this.toFixeds(validBetSetList[i][i+'MinValidBetFandian']) + "%~" + this.toFixeds(validBetSetList[i][i+'MaxValidBetFandian']) + "%之间")
              }
            }
          }
        }
        if(this.rebateDetailList.lossSet.enable =="1") {
          let lossSetList = this.rebateDetailList.lossSet.list;
          for(let i in lossSetList) {
            if(!this.parameter[i+'LossFandian']) {
              return this.$toast("请填写"+ lossSetList[i].name + this.rebateDetailList.lossSet.name)
            }else {
              if(this.parameter[i+'LossFandian'] < lossSetList[i][i+'MinLossFandian'] || this.parameter[i+'LossFandian'] > lossSetList[i][i+'MaxLossFandian'] ) {
                return this.$toast(lossSetList[i].name + this.rebateDetailList.lossSet.name + "范围在" + this.toFixeds(lossSetList[i][i+'MinLossFandian']) + "%~" + this.toFixeds(lossSetList[i][i+'MaxLossFandian']) + "%之间")
              }
            }
          }
        }
        if(this.rebateDetailList.rechargeSet.enable=='1') {
          let rechargeSetList = this.rebateDetailList.rechargeSet.list;
          for(let i in rechargeSetList) {
            if(!this.parameter[i+'Fandian']) {
              return this.$toast("请填写"+ rechargeSetList[i].name + this.rebateDetailList.rechargeSet.name)
            }else {
              if(this.parameter[i+'Fandian'] < rechargeSetList[i][i+'MinFandian'] || this.parameter[i+'Fandian'] > rechargeSetList[i][i+'MaxFandian'] ) {
                return this.$toast(rechargeSetList[i].name + this.rebateDetailList.rechargeSet.name + "范围在" + this.toFixeds(rechargeSetList[i][i+'MinFandian']) + "%~" + this.toFixeds(rechargeSetList[i][i+'MaxFandian']) + "%之间")
              }
            }
          }
        }
        modifyLinks(this.parameter).then(res=>{
          this.$toast(res.msg);
        })
      },
      initParameter() {
        this.parameter.name = this.rebateDetailList.name;
        if(this.rebateDetailList.validBetSet.enable == "1") {
          let list = this.rebateDetailList.validBetSet.list;
          for(let i in list) {
            this.parameter[i+"ValidBetFandian"] = list[i][i+"ValidBetFandian"]
          }
        }
        if(this.rebateDetailList.lossSet.enable == "1") {
          let list = this.rebateDetailList.lossSet.list;
          for(let i in list) {
            this.parameter[i+"LossFandian"] = list[i][i+"LossFandian"]
          }
        }
        if(this.rebateDetailList.rechargeSet.enable == "1") {
          let list = this.rebateDetailList.rechargeSet.list;
          for(let i in list) {
            this.parameter[i+"Fandian"] = list[i][i+"Fandian"]
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
.RebateDetail {
  background-color: #f8f8f8;
  .headerBox {
    background: @Amount-Out-Btn;
    color: #fff;
  }
  .content {
    div {
      height: 80px;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding-left: 20px;
      font-size: 28px;
      color: #666;
      span {
        margin-right: 20px;
      }
      input {
        border: 1px solid #f0f0f0;
        padding-left: 15px;
        height: 40px;
        margin-left: 25px;
      }
    }
    h3 {
      padding-left: 15px;
      height: 60px;
      line-height: 60px;
      background-color: #f8f8f8;
      font-size: 24px;
      color: #666;
    }
    ul {
      background-color: #fff;
      li {
        height: 80px;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding-left: 20px;
        font-size: 28px;
        border-bottom: 1px solid #f0f0f0; /*no*/
        color: #666;
        &:last-child {
          border: none;
        }
        input {
          border: 1px solid #f0f0f0;
          padding-left: 15px;
          width: 150px;
          height: 50px;
          margin-left: 60px;
        }
        span {
          &:last-child {
            font-size: 22px;
            color: #999;
          }
          &:nth-last-child(2) {
            margin: 0 20px;
          }
        }
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
}
</style>