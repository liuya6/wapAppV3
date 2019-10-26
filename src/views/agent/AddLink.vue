<template>
  <div class="addLink flex" v-title="'新增推广链接'">
    <Header title="新增推广链接"></Header>
    <div class="content">
      <div>
        <span>
          推广名称
        </span>
        <input type="text" v-model="parameter.name" maxlength="8" />
      </div>
      <template v-if="mySetList && mySetList.validBetSet.enable=='1'">
        <h3>{{ mySetList.validBetSet.name }}</h3>
        <ul>
          <li v-for="(item,i) in mySetList.validBetSet.list" :key="i">
            <span>{{ item.name }}</span>
            <input type="number" v-model="parameter[i+'ValidBetFandian']" />
            <span>%</span>
            <span>可设置范围{{((item[i+'MinValidBetFandian'])*1).toFixed(2)}}%-{{((item[i+'ValidBetFandian'])*1).toFixed(2)}}%</span>
          </li>
        </ul>
      </template>
      <template v-if="mySetList && mySetList.lossSet.enable=='1'">
        <h3>{{ mySetList.lossSet.name }}</h3>
        <ul>
          <li v-for="(item,i) in mySetList.lossSet.list" :key="i">
            <span>{{ item.name }}</span>
            <input type="number" v-model="parameter[i+'LossFandian']" />
            <span>%</span>
            <span>可设置范围{{((item[i+'MinLossFandian'])*1).toFixed(2)}}%-{{((item[i+'LossFandian'])*1).toFixed(2)}}%</span>
          </li>
        </ul>
      </template>
      <template v-if="mySetList && mySetList.rechargeSet.enable=='1'">
        <h3>{{ mySetList.rechargeSet.name }}</h3>
        <ul>
          <li v-for="(item,i) in mySetList.rechargeSet.list" :key="i">
            <span>{{ item.name }}</span>
            <input type="number" v-model="parameter[i+'Fandian']" />
            <span>%</span>
            <span>可设置范围{{toFixeds(item[i+'MinFandian'])}}%-{{toFixeds(item[i+'Fandian'])}}%</span>
          </li>
        </ul>
      </template>
    </div>
    <footer>
      <van-button @click="addLink">生成推广链接</van-button>
    </footer>
  </div>
</template>

<script>
  import { addLinks } from "../../api";
  import { mapGetters } from "vuex";
  export default {
    name: "AddLink",
    data() {
      return {
        parameter: {
          name: ""
        }
      }
    },
    created() {
      // if(typeof this.mySetList === 'undefined' || !this.mySetList.validBetSet) {
      //   this.$store.dispatch("getSetLists");
      // }
      this.$store.dispatch("getSetLists");
    },
    computed: {
      ...mapGetters(["mySetList"])
    },
    methods: {
      addLink() {
        if(!this.parameter.name) {
          return this.$toast("请输入推广名称")
        }else {
          if(/\s/g.test(this.parameter.name)) {
            return this.$toast("推广名称不能包括空格")
          }
        }
        if(this.mySetList.validBetSet.enable =="1") {
          let validBetSetList = this.mySetList.validBetSet.list;
          for(let i in validBetSetList) {
            if(!this.parameter[i+'ValidBetFandian']) {
              return this.$toast("请填写"+ validBetSetList[i].name + this.mySetList.validBetSet.name)
            }else {
              if(this.parameter[i+'ValidBetFandian'] < validBetSetList[i][i+'MinValidBetFandian'] || this.parameter[i+'ValidBetFandian'] > validBetSetList[i][i+'ValidBetFandian'] ) {
                return this.$toast(validBetSetList[i].name + this.mySetList.validBetSet.name + "范围在" + ((validBetSetList[i][i+'MinValidBetFandian'])*1).toFixed(2) + "%~" + ((validBetSetList[i][i+'ValidBetFandian'])*1).toFixed(2) + "之间")
              }
            }
          }
        }
        if(this.mySetList.lossSet.enable =="1") {
          let lossSetList = this.mySetList.lossSet.list;
          for(let i in lossSetList) {
            if(!this.parameter[i+'LossFandian']) {
              return this.$toast("请填写"+ lossSetList[i].name + this.mySetList.lossSet.name)
            }else {
              if(this.parameter[i+'LossFandian'] < lossSetList[i][i+'MinLossFandian'] || this.parameter[i+'LossFandian'] > lossSetList[i][i+'LossFandian'] ) {
                return this.$toast(lossSetList[i].name + this.mySetList.lossSet.name + "范围在" + ((lossSetList[i][i+'MinLossFandian'])*1).toFixed(2) + "%~" + ((lossSetList[i][i+'LossFandian'])*1).toFixed(2) + "之间")
              }
            }
          }
        }
        if(this.mySetList.rechargeSet.enable=='1') {
          let rechargeSetList = this.mySetList.rechargeSet.list;
          for(let i in rechargeSetList) {
            if(!this.parameter[i+'Fandian']) {
              return this.$toast("请填写"+ rechargeSetList[i].name + this.mySetList.rechargeSet.name)
            }else {
              if(this.parameter[i+'Fandian'] < rechargeSetList[i][i+'MinFandian'] || this.parameter[i+'Fandian'] > rechargeSetList[i][i+'Fandian'] ) {
                return this.$toast(rechargeSetList[i].name + this.mySetList.rechargeSet.name + "范围在" + ((rechargeSetList[i][i+'MinFandian'])*1).toFixed(2) + "%~" + ((rechargeSetList[i][i+'Fandian'])*1).toFixed(2) + "之间")
              }
            }
          }
        }
        // console.log(this.parameter);
        addLinks(this.parameter).then(res=>{
          this.$toast(res.msg);
          if(res.status) {
            this.$router.push({name:"tgManagement"})
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
.addLink {
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
          margin-left: 10px;
        }
        span {
          &:first-child {
            min-width: 150px;
          }
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