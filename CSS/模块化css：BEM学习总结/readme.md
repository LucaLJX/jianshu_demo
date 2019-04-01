# 模块化css： BEM学习总结

> 参考文章： [编写模块化CSS：BEM--大漠](https://www.w3cplus.com/css/css-architecture-1.html)

### BEM规范

 **使用‘block’、‘element’、‘modifier’来修饰元素**

```css
.block { /* styles */ }
.block__element { /* styles */ }
.block--modifier { /* styles */ }
```

### 一个例子

```html
<form class="form">
  <div class="form__action">
    <button class="button">Primary button</button>
    <button class="button--secondary">Secondary button</button>
  </div>
</form>
```

```css
.button {
  padding: 10px 0;
  background-color: red;
}
.button--secondary {
  padding: 10px 0;
  background-color: blue;
}
```

 - **'.form'** 是一个块 -- **block** 块
 - **'.form__action'** 中的 **'__action'** 可以看出是 **'.form'** 的一个子元素 -- **element** 元素
 - **'.button--secondary'** 中的 **'--secondary'** 可以看出是 **'.button'** 的一个样式的修改 -- **modifier** 修饰符

### BEM做了什么

 - 让class的数量尽可能少
 - 用开发人员能够立即知道class的样式应用在了哪里，且做出修改不会影响其他内容