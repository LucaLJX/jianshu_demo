
## 基于cropper.js封装vue在线图片裁剪组件

### 效果预览

![效果图](cropper-demo.jpg)

[github:demo下载](https://github.com/LucaLJX/jianshu_demo/tree/master/WEB%E7%B1%BB%E5%BA%93%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8%E6%A1%88%E4%BE%8B/%E5%9F%BA%E4%BA%8Ecropper.js%E5%B0%81%E8%A3%85vue%E5%9C%A8%E7%BA%BF%E5%9B%BE%E7%89%87%E8%A3%81%E5%89%AA%E7%BB%84%E4%BB%B6)

### cropper.js

 > [github:cropper.js](https://github.com/fengyuanchen/cropper)
 
 > [官网（demo）](http://fengyuanchen.github.io/cropper/)

#### cropper.js 安装

  - npm或bower安装

```shell
npm install cropper
# or
bower install cropper
```
 - clone下载：[下载地址](https://github.com/fengyuanchen/cropper.git)

```shell
git clone https://github.com/fengyuanchen/cropper.git
```

#### 引用cropper.js

 - 主要引用cropper.js跟cropper.css两个文件

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<link  href="/path/to/cropper.css" rel="stylesheet">
<script src="/path/to/cropper.js"></script>
```

 **注意：必须先引入jquery文件，才能使用cropper.js插件**

#### 简单使用

 - 构建截图所要用到的div容器

```html
<!-- Wrap the image or canvas element with a block element (container) -->
<div>
  <img id="image" src="picture.jpg">
</div>
```

 - 添加容器的样式，让img填充满整个容器（很重要）

```css
/* Limit image width to avoid overflow the container */
img {
  max-width: 100%; /* This rule is very important, please do not ignore this! */
}
```

 - 调用cropper.js方法，初始化截图控件

```javascript
$('#image').cropper({
  aspectRatio: 16 / 9,
  crop: function(e) {
    // Output the result data for cropping image.
    console.log(e.x);
    console.log(e.y);
    console.log(e.width);
    console.log(e.height);
    console.log(e.rotate);
    console.log(e.scaleX);
    console.log(e.scaleY);
  }
});
```

 > 其他详细api请参考：[github:cropper.js](https://github.com/fengyuanchen/cropper#options)

### 封装成vue组件

#### 封装成vue组件中需解决的问题
 
 - cropper.js相关
    - 模拟input框点击选择图片并对选择的图片进行格式、大小限制
    - 重新选择图片裁剪
    - 确认裁剪并获取base64格式的图片信息
 - vue相关
    - 非父子组件之间的通信问题

#### 模拟input框点击选择图片并对选择的图片进行格式、大小限制

 - 构建一个隐藏的input标签，然后模拟点击此input，从而达到能选择图片的功能

```html
<!-- input框 -->
<input id="myCropper-input" type="file" :accept="imgCropperData.accept" ref="inputer" @change="handleFile">
```

```javascript
//模拟点击
document.getElementById('myCropper-input').click();
```

 - 给input绑定一个监听内容变化的方法，拿到上传的文件，并进行格式、大小校验

```javascript
// imgCropperData: {
//   accept: 'image/gif, image/jpeg, image/png, image/bmp',
// }
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
}
```
> [参考:从0开始做一个的Vue图片/ 文件选择(上传)组件[基础向]](http://blog.csdn.net/lucky_lxg/article/details/67634265)

#### 重新选择图片裁剪

 - 当第一次选择图片之后，肯定会面临需要重选图片的问题，那么就会面临如何替换掉裁剪框中的图片，上面的步骤选择了图片后通过[FileRender()](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)方法拿到了图片的主要信息，现在就需要重新构建裁剪框就可以解决问题了，查看cropper.js给出的[官方demo](https://github.com/fengyuanchen/cropper/blob/master/examples/crop-avatar/index.html)，发现官方是使用动态添加裁剪容器的方法，进行操作的，这里我们仿照官方进行实现。

```javascript
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
  }
```

#### 确认裁剪并获取base64格式的图片信息

```javascript
let $imgData = _this.imgObj.cropper('getCroppedCanvas')
imgBase64Data = $imgData.toDataURL('image/png'); 
```

#### 构造用于上传的数据

```javascript
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
```

#### **非父子组件之间的通信问题**

 > 在之前的项目中，常用到父子组件之间的通信传参，一般用两种方法

  - 在router里面放置参数，然后通过调用$route.params.xxx或者$route.query.xxx进行获取
  - 通过props进行通信

 **这里我们使用eventBus进行组件之间的通信**

##### 步骤

 1.声明一个bus组件用于B组件把参数传递给A组件

```javascript
//bus.js
import Vue from 'vue';  
export default new Vue();
```

 2.在A组件中引用bus组件，并实时监听其参数变化

```javascript
// A.vue
import Bus from '../../components/bus/bus.js'

export default {
  components: { Bus },
  data () {},
  created: function () {
    Bus.$on('getTarget', imgToken => {  
      var _this = this;
      console.log(imgToken);
      ...  
    });  
  }
}
```

 3.B组件中同样引用bus组件，来把参数传给A组件

```javascript
// B.vue
// 传参
Bus.$emit('getTarget', imgToken); 
```

参考： 
 
 - [vue-$on](https://cn.vuejs.org/v2/guide/components.html#使用-v-on-绑定自定义事件)
 - [vue-$emit](https://cn.vuejs.org/v2/api/#vm-emit)
 - [vue.js之路(4)——vue2.0s中eventBus实现兄弟组件通信](http://blog.csdn.net/u013034014/article/details/54574989?locationNum=2&fps=1)

### vue选图截图插件完整代码

```html
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

```