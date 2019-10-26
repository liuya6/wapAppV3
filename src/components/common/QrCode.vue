<template>
  <div class="qrContainer">
    <div class="qrImg" @click.stop>
      <img :src="QrImg" alt="" crossOrigin="anonymous" />
    </div>
    <div class="box" ref="box">
      <img :src="QrBg" alt="分享背景图" class="qrBgImg" crossOrigin="anonymous" />
      <img :src="codeImg" class="qrImg" alt="" crossOrigin="anonymous" />
      <span class="code">{{ code }}</span>
    </div>
    <vue-qr :text="myUrl" margin="0" :callback="callback" style="display: none" crossOrigin="anonymous" dotScale="1" />
  </div>
</template>

<script>
// import html2canvas from 'html2canvas';
const html2canvas = window.html2canvas;
export default {
  name: "QrCode",
  data() {
    return {
      QrBg: require("../../assets/images/qrbg.png"),
      QrImg: "",
      codeImg: ""
    }
  },
  props: {
    myUrl: String,
    code: String
  },
  methods: {
    callback(dataUrl) {
      if(dataUrl) {
        this.codeImg = dataUrl;
        let _this = this;
        this.$nextTick(()=>{
          html2canvas(this.$refs.box,{
            allowTaint: false,
            useCORS: true,
          }).then(function(canvas) {
            _this.QrImg =  URL.createObjectURL(_this.base64ToBlob(canvas.toDataURL()));
          });
        })
      }
    },
    base64ToBlob(code) {
      let parts = code.split(';base64,');
      let contentType = parts[0].split(':')[1];
      let raw = window.atob(parts[1]);
      let rawLength = raw.length;
      let uInt8Array = new Uint8Array(rawLength);
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {type: contentType});
    }
  }
}
</script>

<style scoped lang="less">
.qrContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .qrImg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 550px;
    height: 600px;
    z-index: 10;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 550px;
    height: 600px;
    z-index: 1;
    img {
      z-index: 3;
    }
    .qrBgImg {
      width: 100%;
      height: 100%;
    }
    .qrImg {
      position: absolute;
      width: 140px;
      height: 140px;
      top: 428px;
      left: 143px;
    }
    .code {
      position: absolute;
      font-size: 30px;
      top: 435px;
      left: 241px;
    }
  }
}
</style>