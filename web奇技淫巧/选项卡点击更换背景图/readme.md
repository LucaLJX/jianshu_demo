### 开发环境

- vue、jquery

### 需求

- 点击某个选项，其选项图标改变，且鼠标移出之后，保持背景图片改变的效果

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2296703-8a070ead2309f214.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 简单分析

- 选项的图标分为两种状态：未选中、选中状态，有一些还需加上一个hover状态
- hover可以用css实现，但是如果选项过多，则代码过于冗长

### 实现方案

- 选中状态的选项动态加上特殊类名用于标识
- 同一选项的图片命名为aaa-1.png、aaa-2.png的状态
- 利用jquery甄别特殊类名的方法，给拥有特殊类名的选项动态改变背景图片

### 主要代码实现

#### 1.结构代码

```vue-html
<ul>
    <li class="item-0" :class="{'item-active' : active == 0}" @click="changeActive(0)"></li>
    <li class="item-1" :class="{'item-active' : active == 1}" @click="changeActive(1)"></li>
    <li class="item-2" :class="{'item-active' : active == 2}" @click="changeActive(2)"></li>
</ul>
```

#### 2.vue-js代码
```js
export default {
  data () {
    return {
      active: 0
    }
  },
  methods: {
    // 改变active值
    changeActive (index) {
      this.active = index;
      this.watchActive();
    },
    // 判断特殊类名：item-active,增加对应的样式
    watchActive () {
      for (var i = 0; i < 4; i++) {
        var checkClass = 'item-' + i.toString();
        var isActive = $('.' + checkClass).hasClass('item-active');
        if (isActive == false) {
          // 未被选中的选项，背景图为 xxx-1.png
          $('.' + checkClass).css('background-image', 'url("./image/' + checkClass + '-1.png")');
        } else {
          // 被选中的选项，背景图为 xxx-2.png
          $('.' + checkClass).css('background-image', 'url("./image/' + checkClass + '-2.png")');
        }
      }
    },
  }
}
```
------------------------ 分割线 --------------------------------
2017.08.19

### 开发环境

 - 纯 jquery环境

### 源码查看地址

> github: 

### 主要代码实现

#### 1.html代码

```html
<div class="menu">
    <ul>
        <li class="item-0 item item-active" onclick="clickItem(0)">选项卡一</li>
        <li class="item-1 item" onclick="clickItem(1)">选项卡二</li>
        <li class="item-2 item" onclick="clickItem(2)">选项卡三</li>
    </ul>
</div>
```

#### 2.js代码

```javascript
$(document).ready(function () {
    watch();
});

function watch () {
    var length = $('.menu ul li').length;
    for (var i = 0; i < length; i++) {
        var checkClass = 'item-' + i.toString();
        var hasActive = $('.' + checkClass).hasClass('item-active');
        if (hasActive) {
            $('.' + checkClass).css('background-image', 'url("./icons/' + checkClass + '-red.png")');
        } else {
            $('.' + checkClass).css('background-image', 'url("./icons/' + checkClass + '-blue.png")')
        }
    }
}

function clickItem (index) {
    var length = $('.menu ul li').length;
    for (var i = 0; i < length; i++) {
        var clickClass = 'item-' + i.toString();
        if (index == i) {
            $('.' + clickClass).addClass('item-active');
        } else {
            $('.' + clickClass).removeClass('item-active');
        }
    }
    watch ();
}
```

> 如果有新的好方法，会持续更新。。。

  BY--LucaLJX