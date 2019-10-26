<template>
  <div class="teamRule flex" v-title="'团队说明'">
    <Header title="团队说明"></Header>
    <div class="content" v-html="descriptions.content">
      <div class="img">
        <img src="../../assets/images/dl.png" alt="" />
      </div>
      <div class="text">
        <h1>
          当您能看到这个页面，说明您的账号既可以自己投注，也可以发展下级玩家组建团队，赚取返点佣金。
        </h1>
        <h3>
          如何赚取返点？
        </h3>
        <p>
          您可获得的返点，等于自身返点与下级返点的差值，如自身投注返点A%，下级投注返点B%，您将能获得下级投注金额A%-B%的返点，如下级投注100元，您将会获得100*（A%-B%）元。此下级再发展下级，无论发展了几级，您都能从他们那获得返点差A%-B%。点击推广管理，可查看自身返点，也可为下级设置返点。
        </p>
        <h3>
          如何为下级开户，组建团队？
        </h3>
        <p>
          点击推广管理，进入添加链接页面，先为您的下级设置返点，设置成功后会生成一条推广链接和二维码，将推广链接或二维码发送给您的下级注册，注册成功后他就是您的下级会员，点击团队成员，就能查看他注册的账号；您的下级也能继续发展下级，形成裂变式增长，轻松赚取巨额收益。
        </p>
        <h3>
          怎么查看团队发展情况？
        </h3>
        <p>
          可在团队报表、下级报表、交易明细查看团队的发展情况。
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { description } from "../../api";
  export default {
    name: "TeamRule",
    data() {
      return {
        descriptions: ""
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData() {
        description().then(res=>{
          if(res.status) {
            this.descriptions = res.data[0]
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
.teamRule {
  .headerBox {
    background: @Amount-Out-Btn;
    color: #fff;
  }
}
</style>