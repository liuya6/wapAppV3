<template>
  <div class="activityContent">
    <Header title="活动详情"></Header>
    <div class="content" v-html="activityContent"></div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { appllyActivity } from "../../api"
  export default {
    name: "ActivityContent",
    computed: {
      ...mapGetters(['activityContent'])
    },
    created() {
      this.Click();
    },
    mounted() {
      this.$nextTick(()=> {
        window.scrollTo(0, 0);
      })
    },
    methods: {
      getApplication(id) {
        appllyActivity({ articleId: id })
          .then(res => {
            this.$toast(res.msg);
          })
          .catch(err => {
            console.log(err);
            this.$toast("活动申请失败");
          });
      },
      Click () {
        this.$nextTick(()=> {
          let that = this;
          let id;
          let ApplyBtn = document.querySelectorAll(".apply");
          console.log(ApplyBtn);
          if(!ApplyBtn.length) return;
          for (let i =0;i<ApplyBtn.length;i++){
            let btnOne = ApplyBtn[i];
            btnOne.onclick = function() {
              id = this.getAttribute("id");
              if (!id) {
                id = this.getAttribute("data-id");
              }
              that.getApplication(id);
            }
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
.activityContent {
  .headerBox {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    z-index: 999;
  }
  .content {
    padding: 100px 30px 30px;
  }
}
</style>
