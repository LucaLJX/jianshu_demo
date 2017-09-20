<template>
  <div class="myCropper-container">
    <div id="myCropper-workspace">
      <div class="myCropper-words" v-show="!imgCropperData.imgSrc">请点击按钮选择图片进行裁剪</div>
    </div>
    <div class="myCropper-preview" :class="isShort ? 'myCropper-preview-short' : 'myCropper-preview-long'">
      <div class="myCropper-preview-1 avatar-preview">
        <img :src="!imgCropperData.imgUploadSrc ? '/images/thumbnail/thumbnail-img.jpg' : imgCropperData.imgUploadSrc" alt="">
      </div>
      <div class="myCropper-preview-2 avatar-preview">
        <img :src="!imgCropperData.imgUploadSrc ? '/images/thumbnail/thumbnail-img.jpg' : imgCropperData.imgUploadSrc" alt="">
      </div>
      <div class="myCropper-preview-3 avatar-preview">
        <img :src="!imgCropperData.imgUploadSrc ? '/images/thumbnail/thumbnail-img.jpg' : imgCropperData.imgUploadSrc" alt="">
      </div>
      <input id="myCropper-input" type="file" :accept="imgCropperData.accept" ref="inputer" @change="handleFile">
      <Button type="ghost" class="myCropper-btn" @click="btnClick">选择图片</Button>
      <Button type="primary" class="myCropper-btn" :loading="cropperLoading" @click="crop_ok">确认</Button>
    </div>
    
    
  </div>
</template>

<script>
  var ezjsUtil = Vue.ezjsUtil;
  import Bus from './bus/bus.js' 

  export default {
    components: { Bus },
    props: {
      imgType: {
        type: String
      },
      proportionX: {
        type: Number
      },
      proportionY: {
        type: Number
      }
    },
    data () {
      return {
        imgCropperData: {
          accept: 'image/gif, image/jpeg, image/png, image/bmp',
          maxSize: 5242880,
          file: null, //上传的文件
          imgSrc: '', //读取的img文件base64数据流
          imgUploadSrc: '', //裁剪之后的img文件base64数据流
        },
        imgObj: null,
        hasSelectImg: false,
        cropperLoading: false,
        isShort: false,
      }
    },
    created: function () {
      let _this = this;
    },
    mounted: function () {
      let _this = this;
      // 初始化预览区域
      let maxWidthNum = Math.floor(300 / _this.proportionX);
      let previewWidth = maxWidthNum * _this.proportionX;
      let previewHeight = maxWidthNum * _this.proportionY;
      if (previewWidth / previewHeight <= 1.7) {
        previewWidth = previewWidth / 2;
        previewHeight = previewHeight / 2;
        _this.isShort = true;
      }
      // 设置最大预览容器的宽高
      $('.myCropper-preview-1').css('width', previewWidth + 'px');
      $('.myCropper-preview-1').css('height', previewHeight + 'px');
      // 设置中等预览容器的宽高
      $('.myCropper-container .myCropper-preview .myCropper-preview-2').css('width',( previewWidth / 2) + 'px');
      $('.myCropper-container .myCropper-preview .myCropper-preview-2').css('height', (previewHeight / 2) + 'px');
      // 设置最小预览容器的宽高
      $('.myCropper-container .myCropper-preview .myCropper-preview-3').css('width',( previewWidth / 4) + 'px');
      $('.myCropper-container .myCropper-preview .myCropper-preview-3').css('height', (previewHeight / 4) + 'px');
    },
    methods: {
      // 点击选择图片
      btnClick () {
        let _this = this;
        // 模拟input点击选择文件
        document.getElementById('myCropper-input').click();
      },
      // 选择之后的回调
      handleFile (e) {
        let _this = this;
        let inputDOM = this.$refs.inputer;
        // 通过DOM取文件数据
        _this.file = inputDOM.files[0];
        // 判断文件格式
        if (_this.imgCropperData.accept.indexOf(_this.file.type) == -1) {
          _this.$Modal.error({
            title: '格式错误',
            content: '您选择的图片格式不正确！'
          });
          return;
        }
        // 判断文件大小限制
        if (_this.file.size > 5242880) {
          _this.$Modal.error({
            title: '超出限制',
            content: '您选择的图片过大，请选择5MB以内的图片！'
          });
          return;
        }
        var reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(_this.file);
        reader.onload = function () {
          _this.imgCropperData.imgSrc = this.result;
          _this.initCropper();
        }
      },
      // 初始化剪切
      initCropper () {
        let _this = this;
        
        // 初始化裁剪区域
        _this.imgObj = $('<img src="' + _this.imgCropperData.imgSrc + '">');
        let $avatarPreview = $('.avatar-preview');
        $('#myCropper-workspace').empty().html(_this.imgObj);
        _this.imgObj.cropper({
          aspectRatio: _this.proportionX / _this.proportionY,
          preview: $avatarPreview,
          crop: function(e) {
            
          }
        });
        _this.hasSelectImg = true;
      },
      // 确认
      crop_ok () {
        let _this = this, imgToken = null, imgBase64Data = null;
        // 判断是否选择图片
        if (_this.hasSelectImg == false) {
          _this.$Modal.error({
            title: '裁剪失败',
            content: '请选择图片，然后进行裁剪操作！'
          });
          return false;
        }
        // 确认按钮不可用
        _this.cropperLoading = true;
        let $imgData = _this.imgObj.cropper('getCroppedCanvas')
        imgBase64Data = $imgData.toDataURL('image/png'); 
        // 构造上传图片的数据
        let formData = new FormData();
        // 截取字符串
        let photoType = imgBase64Data.substring(imgBase64Data.indexOf(",") + 1);
        //进制转换
				const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
					const byteCharacters = atob(b64Data);
					const byteArrays = [];
					for(let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
						const slice = byteCharacters.slice(offset, offset + sliceSize);
						const byteNumbers = new Array(slice.length);
						for(let i = 0; i < slice.length; i++) {
							byteNumbers[i] = slice.charCodeAt(i);
						}
						const byteArray = new Uint8Array(byteNumbers);
						byteArrays.push(byteArray);
					}
					const blob = new Blob(byteArrays, {
						type: contentType
					});
					return blob;
        }
        const contentType = 'image/jepg';
				const b64Data2 = photoType;
        const blob = b64toBlob(b64Data2, contentType);
        formData.append("file", blob, "client-camera-photo.png")
        formData.append("type", _this.imgType)
        // ajax上传
        $.ajax({
					url: _this.$nfs.uploadUrl,
					method: 'POST',
					data: formData,
					// 默认为true，设为false后直到ajax请求结束(调完回掉函数)后才会执行$.ajax(...)后面的代码
					async: false,
					// 下面三个，因为直接使用FormData作为数据，contentType会自动设置，也不需要jquery做进一步的数据处理(序列化)。
					cache: false,
					contentType: false,
          processData: false,
          type: _this.imgType,
					success: function(res) {
            let imgToken = res.data.token;
            _this.cropperLoading = false;
            // 传参
            Bus.$emit('getTarget', imgToken);  
					},
					error: function(error) {
            _this.cropperLoading = false;
            _this.$Modal.error({
              title: '系统错误',
              content: '请重新裁剪图片进行上传！'
            });
					}
				});
      },

    }
  }
</script>

<style lang="less" scoped>
  .myCropper-container {
    height: 400px;
  }
  .myCropper-container #myCropper-input {
    width: 0px;
    height: 0px;
  }
  .myCropper-container #myCropper-workspace {
    width: 500px;
    height: 400px;
    border: 1px solid #dddee1;
    float: left;
  }
  // 裁剪图片未选择图片的提示文字
  .myCropper-container #myCropper-workspace .myCropper-words{
    text-align: center;
    font-size: 18px;
    padding-top: 180px;
  }
  // 裁剪图片的预览区域
  .myCropper-container .myCropper-preview-long {
    width: 300px;
  }
  .myCropper-container .myCropper-preview-short {
    width: 200px;
  }
  .myCropper-container .myCropper-preview {
    float: left;
    height: 400px;
    margin-left: 10px;
  }
  .myCropper-container .myCropper-preview .myCropper-preview-1 {
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #dddee1;
    box-shadow: 3px 3px 3px #dddee1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .myCropper-container .myCropper-preview .myCropper-preview-2 {
    margin-top: 20px;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #dddee1;
    box-shadow: 3px 3px 3px #dddee1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .myCropper-container .myCropper-preview .myCropper-preview-3 {
    margin-top: 20px;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #dddee1;
    box-shadow: 3px 3px 3px #dddee1;
    img {
      width: 100%;
      height: 100%;
    }
  }
  // 按钮
  .myCropper-btn {
    float: left;
    margin-top: 20px;
    margin-right: 10px;
  }
</style>
