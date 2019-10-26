<template>
  <div class="sscDx5d">
    <h3>
      手动输入号码，至少输入1个{{this.limitNum}}位数号码组成一注。
    </h3>
    <div>
      <textarea v-model="codeSelected"></textarea>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  export default {
    props: {
      classify: Number,
      playData: Object,
      options: [Object, Array]
    },
    data() {
      return {
        config: {
          unique: false, // 号码唯一
          required: false, // 每个位置必选
          limit: [], // 号码限制,
          delimiter: "-", // 分隔符
        },
        limitNum: 2,
        codeSelected: "", // 已选号码
      };
    },
    computed: {
      ...mapGetters(["oldCodeList"]),
    },
    watch: {
      codeSelected(newVal) {
        this.codeSelected = newVal.replace(/[^\r\n0-9]/g,'');
        this.betCount();
        if(this.codeSelected.length) {
          this.codeSelected = this.codeSelected.match(new RegExp("\\d{1,"+this.limitNum+"}", "g")).join(this.config.delimiter)
        }
      }
    },
    created() {
      if (this.oldCodeList.length > 0) {
        this.codeSelected = this.oldCodeList;
      }
    },
    methods: {
      betCount() {
        // 注数统计
        let count = Math.floor((this.codeSelected.replace(/[^\r\n0-9]/g,'')).length / this.limitNum);
        this.$store.dispatch("setCount", count);
      }
    }
  };
</script>
<style lang="less" scoped>
  .sscDx5d {
    h3 {
      font-size: 24px;
      color: #666;
    }
    textarea {
      margin-top: 20px;
      width: 90%;
      height: 300px;
      border-radius: 10px;
      font-size: 26px;
      padding: 10px;
      border-color: #dfdcda;
    }
  }
</style>

