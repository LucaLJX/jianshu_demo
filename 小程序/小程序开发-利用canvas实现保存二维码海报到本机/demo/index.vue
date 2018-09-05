<template>
  <!-- container -->
  <div class="container">
    <div class="canvas-container">
      <canvas canvas-id="qrcode-canvas" :style="{width: canvas.width + 'px', height: canvas.height + 'px'}"></canvas>
      <button type="primary" plain="true" @click="downLoadImg"> 保存二维码 </button>
    </div>
  </div>
</template>

<script>

import { wxGetImgInfo, wxDownloadFile, wxGetSystemInfo, wxCanvasToTempFilePath, wxSaveImageToPhotosAlbum } from 'utils/wx'

export default {
  data() {
    return {
      qrCode: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2380141186,3414535665&fm=27&gp=0.jpg',
      cardDetail: {
        name: 'LucaLJX',
        header: '/static/images/header.jpg',
        position: '前端开发',
        tel: '177xxxxx354',
        email: 'https://github.com/LucaLJX/jianshu_demo'
      },
      // ---------
      text: '长按识别二维码',
      systemInfo: {
        systemWidth: 0,
      },
      imgPath: {
        bgImg: '/static/images/cardDetail/qrCodeBg.png',
        logo: '/static/images/cardDetail/logo.png',
        qrCode: '',
        headerImg: '/static/images/header.jpg'
      },
      canvas: {
        width: 0,
        height: 0
      },
      qrCodeImgPath: '',
    };
  },
  mounted() {
    let _this = this;
    _this.getPhoneSystemInfo();
  },
  methods: {
    // 获取手机基本信息
    async getPhoneSystemInfo () {
      let _this = this;
      let systemInfoRes = await wxGetSystemInfo();
      _this.canvas.width = systemInfoRes.screenWidth;
      _this.canvas.height = 912 / 750 * _this.canvas.width;
      _this.storageQrcode();
    },
    // 缓存远程图片
    async storageQrcode () {
      let _this = this;
      // 背景图url转path
      // let bgRes = await wxGetImgInfo(_this.bgImg);
      // _this.imgPath.bgImg = bgRes.path;
      // Logo url转path
      // let logoRes = await wxGetImgInfo(_this.logo);
      // _this.imgPath.logo = logoRes.path;
      
      // 头像 url转path
      // let headerImgRes = await wxGetImgInfo(_this.cardDetail.header);
      // _this.imgPath.headerImg = headerImgRes.path;
      // 二维码 url转path
      let qrCodeRes = await wxGetImgInfo(_this.qrCode);
      _this.imgPath.qrCode = qrCodeRes.path;
      console.log(_this.imgPath);
      _this.initCanvas(_this.canvas.width);
    },


    // initCanvas
    initCanvas (variableVal) {
      let _this = this;
      const variableNum = variableVal / 750; // 根据设备宽度算出一个rpx为多少px
      const ctx = wx.createCanvasContext('qrcode-canvas');
      // 清除画布上矩形的内容
      ctx.clearRect(0, 0, 0, 0);
      // 绘制上部card背景图
      const bgImgDesc = {
        url: _this.imgPath.bgImg,
        left: 0,
        top: 0,
        width: 750 * variableNum,
        height: 912 * variableNum
      };
      ctx.drawImage(bgImgDesc.url, bgImgDesc.left, bgImgDesc.top, bgImgDesc.width, bgImgDesc.height);

      // 绘制右上角头像
      const headerDesc = {
        url: _this.imgPath.headerImg,
        left: 520 * variableNum,
        top: 80 * variableNum,
        width: 115 * variableNum,
        height: 115 * variableNum
      };
      ctx.drawImage(headerDesc.url, headerDesc.left, headerDesc.top, headerDesc.width, headerDesc.height);

      // 绘制二维码
      const qrCodeDesc = {
        url: _this.imgPath.qrCode,
        left: 213 * variableNum,
        top: 450 * variableNum,
        width: 324 * variableNum,
        height: 324 * variableNum
      };
      ctx.drawImage(qrCodeDesc.url, qrCodeDesc.left, qrCodeDesc.top, qrCodeDesc.width, qrCodeDesc.height);
      
      // 绘制名字
      const nameDesc = {
        text: _this.cardDetail.name,
        fontSize: 36 * variableNum,
        color: '#4F5E6F',
        left: 102 * variableNum,
        top: 200 * variableNum
      };
      console.log(nameDesc);
      ctx.setFillStyle(nameDesc.color);
      ctx.setFontSize(nameDesc.fontSize);
      ctx.fillText(nameDesc.text, nameDesc.left, nameDesc.top);

      // 绘制职位
      const positionDesc = {
        text: _this.cardDetail.position,
        fontSize: 28 * variableNum,
        color: '#4F5E6F',
        left: 102 * variableNum,
        top: 250 * variableNum
      };
      ctx.setFillStyle(positionDesc.color);
      ctx.setFontSize(positionDesc.fontSize);
      ctx.fillText(positionDesc.text, positionDesc.left, positionDesc.top);

      // 绘制手机号
      const telDesc = {
        text: _this.cardDetail.tel,
        fontSize: 28 * variableNum,
        color: '#4F5E6F',
        left: 102 * variableNum,
        top: 320 * variableNum
      };
      ctx.setFillStyle(telDesc.color);
      ctx.setFontSize(telDesc.fontSize);
      ctx.fillText(telDesc.text, telDesc.left, telDesc.top);

      // 绘制邮箱
      const emailDesc = {
        text: _this.cardDetail.email,
        fontSize: 28 * variableNum,
        color: '#4F5E6F',
        left: 102 * variableNum,
        top: 360 * variableNum
      };
      ctx.setFillStyle(emailDesc.color);
      ctx.setFontSize(emailDesc.fontSize);
      ctx.fillText(emailDesc.text, emailDesc.left, emailDesc.top);

      // 绘制文字提示
      const textDesc = {
        text: _this.text,
        fontSize: 24 * variableNum,
        color: '#C5CDD6',
        left: 285 * variableNum,
        top: 840 * variableNum
      };
      ctx.setFillStyle(textDesc.color);
      ctx.setFontSize(textDesc.fontSize);
      ctx.fillText(textDesc.text, textDesc.left, textDesc.top);

      ctx.draw(false, function () {
        _this.saveImg();
      });
    },

    // 将canvas转为图片
    async saveImg () {
      let _this = this;
      const canvasObj = {
        x: 0,
        y: 0,
        width: _this.canvas.width,
        height: _this.canvas.height,
        destWidth: _this.canvas.width * 4,
        destHeight: _this.canvas.height * 4,
        canvasId: 'qrcode-canvas',
        fileType: 'png'
      };
      let imgRes = await wxCanvasToTempFilePath(canvasObj);
      _this.qrCodeImgPath = imgRes.tempFilePath;
    },

    
    // 保存图片到本机
    async downLoadImg () {
      let _this = this;
      let saveRes = await wxSaveImageToPhotosAlbum(_this.qrCodeImgPath);
      if (saveRes.errMsg === 'saveImageToPhotosAlbum:ok') {
        wx.showToast({
          duration: 3000,
          icon: 'none',
          title: '保存图片成功！',
          mask: true
        });
      } else {
        wx.showToast({
          duration: 3000,
          icon: 'none',
          title: '保存图片失败，请重试！',
          mask: true
        });
      }
    },
  }
};
</script>

<style lang="less" scoped>
.canvas-container {
  width: 740rpx;
  height: 1200rpx;
}
</style>
