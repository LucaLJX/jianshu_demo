
### 什么是BFC

 > BFC全称Block Formatting Context, 即块格式化上下文。
 
### 视觉格式化模型

 > 视觉格式化模型（visual formatting model）是用来处理文档并将其显示在视觉媒体上的机制。
 
 视觉格式化模型定义了盒（Box）的生成
  - 块盒
  - 行内盒
  - 匿名盒（没有名字不能被选择器选中的盒）
 
 **盒的类型由==display属性==决定**

 ### 盒分类
 
 #### 1、块盒（block box）
 
  - 当display为blcok、list-item、table时，称之为块级元素（block-level）
  - 视觉上呈现为块，竖直排列
  - 默认参与块格式化上下文
  - 每个块级元素至少生成一个块级盒，称之为主要块级盒（principal block-level box）
  - 一些元素（如 \<li\>）会生成额外的盒来放置项目符号，不过多数元素只生成一个主要块级盒
 
 #### 2、行内盒（inline box）

 - 当display为inline、inline-block、inline-table时，称之为行内级元素
 - 视觉上它将内容与其它行内元素排列为多行，典型的如段落内容，有文本(可以有多种格式譬如着重)，或图片，都是行内级元素
 - 行内元素生成行内级盒（inline-level box），参与行内格式化上下文。（参与行内格式化上下文的行内级盒称为行内盒，displlay：inline的元素都是行内盒）
 - 不参与生成行内格式化上下文的行内级盒成为原子行内级盒，这些盒由可替换行内元素，或display为inline-block、inline-table的元素生成，不能拆分成多个盒
 
 #### 3、匿名盒（anonymous box）

 - 匿名盒分==匿名块盒== 与 ==匿名行内盒==，由于没有名字，所以无法用选择器选择，他们所有属性都是inherit或初始默认值

##### 匿名盒例子

```html
<div>
    some inline text
    <p>followed by a paragraph</p>
    followed by more inline text.
</div>
```

![匿名盒演示](https://user-gold-cdn.xitu.io/2017/9/12/7a736c1dc28c124ace4ef98b555e8ed1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 三种定位方案

 > 在定位的时候，浏览器就会根据元素的盒类型和上下文对这些元素进行定位，可以说盒就是定位的基本单位。定位时，有三种定位方案，分别是==常规流==，==浮动==, 以及==绝对定位==。
 
#### 1、常规流（normal flow）

 - 在常规流中，盒一个接一个排列
    - 块级格式化上下文：竖着排列
    - 行内格式化上下文：横着排列
 - position为static或relative,且float为none时，触发常规流
 - 对于静态定位（static positioning）
    - position：static
    - 盒的位置是常规流中的位置
 - 对于相对定位（relative positioning）
    - position：relative
    - 盒偏移位置由 top、bottom、left、right属性定义
    - 即使有偏移，仍保留原有的未知，其他常规流不能占用这些位置

#### 2、浮动（float）
 
 - 盒称为浮动盒（floating boxes）
 - 位于当前行的开头或结尾
 - 会导致常规流环绕在它周边
    - 除非设置clear属性

#### 3、绝对定位（absolute positioning）
 
 - 绝对定位方案，脱离文档流
    - 盒从常规流中被移除，不影响常规流的布局
 - 其定位相对于包含它的块
    - top、bottom、left、right
 - 若元素属性为absolute或fixed
    - position：absolute
    - position：fixed
    - 元素为绝对定位元素
 - position：absolute的元素的定位
    - 相对于最近的一个relative、fixed或absolute的父元素
    - 没有以上的元素，则相对于body

### 块格式化上下文
 
 > **==块格式化上下文是页面css视觉渲染的一部分，用于决定块盒子的布局及浮动相互影响范围的一个区域==**
 
#### BFC的创建方法

 根元素或其他包含它的元素
 
  - 浮动
    - float不为none
  - 绝对定位
    - position：absolute
    - position：fixed
  - 行内块
    - display：inline-block
  - 表格单元格
    - display：table-cell
    - html表格单元格默认属性
  - overflow不为visible
  - 弹性盒flex boxes
    - display：flex
    - display：inline-flex

 **最常见的==overflow:hidden==、==float:left/right==、==position:absolute==，看到这些，说明该元素创建了一个BFC**
 
#### BFC的范围

 > 一个BFC包含创建该上下文元素的所有子元素
 
 > 但不包括创建了新BFC的子元素的内部元素
 
```html
<div id='div_1' class='BFC'>
    <div id='div_2'>
        <div id='div_3'></div>
        <div id='div_4'></div>
    </div>
    <div id='div_5' class='BFC'>
        <div id='div_6'></div>
        <div id='div_7'></div>
    </div>
</div>
```

 - BFC_1
    - 创建元素为#div_1
    - 范围包含：#div_2、#div_3、#div_4、#div_5
 - BFC_2
    - 创建元素为#div_5
    - 范围包含：#div_6、#div_7

 > 一个元素不能同时存在于两个BFC中
 
 > BFC的一个最重要的效果是，让处于BFC内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。这是利用BFC清除浮动所利用的特性。
 
#### BFC的一些特性

 - 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）
 - 处于同一个BFC中的元素相互影响，可能会发生margin collapse
 - 每个元素的margin box的左边，与容器块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
 - BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然
 - 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算
 - 浮动盒区域不叠加到BFC上

###　实例

#### 实例1

```html
<style>
 .left{
    background: #73DE80;    /* 绿色 */
    width: 200px;
    height: 200px;
    float: left;
}
.right{                        /* 粉色 */
    background: #EF5BE2;
    width:400px;
    min-height: 100px;
}
.box{
    background:#888;
    height: 100%;
    margin-left: 50px;
}
</style>
<div class='box'>
    <div class='left'> </div>
    <div class='right'> </div>
</div>
```

效果

![实例1效果图](https://user-gold-cdn.xitu.io/2017/9/12/79ca79e60ce01f6521edd5f4827a0e05?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 - 绿色#left向左浮动float：left创建了新的BFC
 - 绿色#left脱离文档流
 - 粉色#right就被定义到父元素的左上角
 - 最终绿色#left与粉色#right发生了重叠
 - 父元素并未创建BFC，所以高度不会考虑绿色#right，发生了高度坍塌
    - BFC特性6：浮动区域不叠加到BFC区域上
 
#### 实例2

```html
.BFC{
    overflow: hidden;
}

<div class='box BFC'>
    <div class='left'> </div>
    <div class='right'> </div>
</div>
```

效果

![实例2效果图](https://user-gold-cdn.xitu.io/2017/9/12/e87b60f9f1502616b1f3bf511523ab70?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 - 通过overflow：hidden对父元素创建了BFC
 - 计算高度的时候会将浮动的#right计算进去
    - BFC特性5：计算BFC高度时，浮动元素也参与计算

#### 实例3

```html
<style>
    .little{
        background: #fff;
        width: 50px;
        height: 50px;
        margin: 10px;
        float: left;
    }
</style>

<div class='box BFC'>
    <div class='left'> </div>
    <div class='right'>
        <div class='little'></div>
        <div class='little'></div>
        <div class='little'></div>
    </div>
</div>
```

效果

![实例3效果图](https://user-gold-cdn.xitu.io/2017/9/12/de6e7e8c21f62befc82db4cbcd3909bd?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 - 由于粉色#left并没有创建BFC，所以内部元素会受到外部元素样式的影响，被#right挤压到了右边
 

#### 实例4

```html
<div class='box BFC'>
    <div class='left'> </div>
    <div class='right BFC'>
        <div class='little'></div>
        <div class='little'></div>
        <div class='little'></div>
    </div>
</div>
```

效果图

![实例4效果图](https://user-gold-cdn.xitu.io/2017/9/12/6321ac6a5114233f0fd5a3e1955b270b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 - 粉色#left创建了BFC
 - 粉色#left不与绿色#right发生重叠，内部白色块处于隔离的空间
    - BFC特性4：BFC就是页面上一个隔离的独立容器
 - 白色块就不会受到外部绿色#right的影响

 > 案例参考及原文连接：
 
 > [学习BFC-考拉海购前端团队](https://juejin.im/post/59b73d5bf265da064618731d)
