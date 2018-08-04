# 小程序开发-常用api汇总

## 页面跳转api

 - wx.navigateTo()
  
 > 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。

 **需要跳转的应用内非 tabBar 的页面的路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'**

 **注意：目前页面路径最多只能十层。**

```javascript
wx.navigateTo({
  // 跳转的路径
  url: '../login/login?id='+e.currentTarget.id,
  // 调用成功的回调函数
  success: function (e) {
    console.log(e)
  },
  // 调用失败的回调函数
  fail: function (e) {},
  // 调用结束的回调函数（成功、失败都会执行）
  complete: function (e) {}
})
```

 - wx.redirectTo(OBJECT)

 > 关闭当前页面，跳转到应用内的某个页面。

 **需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'**

 示例代码同 **wx.navigateTo()** 

 - wx.reLaunch(OBJECT)

 > 关闭所有页面，打开到应用内的某个页面。

 **需要跳转的应用内页面路径 , 路径后可以带参数。参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'，如果跳转的页面路径是 tabBar 页面则不能带参数**

 示例代码同 **wx.navigateTo()** 

 - **wx.switchTab(OBJECT)**

 > **跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面**

 **需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数**

 - **wx.navigateBack(OBJECT)**

 > 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。

 **delta: 返回的页面数，如果 delta 大于现有页面数，则返回到首页。**

 ```javascript
 wx.navigateBack({
   delta: num // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
 })
 ```

 ### 页面跳转注意点

 - **wx.navigateTo 和 wx.redirectTo 不允许跳转到 tabbar 页面，只能用 wx.switchTab 跳转到 tabbar 页面**
 - **tabbar 页面无法传参，如果需要传参，可以尝试使用全局变量**
 - **tabbar 页面跳转，导航栏不会出现返回按钮，使用 wx.navigateTo 返回按钮会自动出现**

 ## 参数传递与获取

 由于小程序页面跳转的相关限制，在参数传递上，有三种解决方案，根据不同的使用场景选择对应的解决方案。

  1. 小程序页面路由（原生）传参
  2. 小程序全局变量传参
  3. mpvue （vuex） store传参 - 不做赘述

 - url传参

 ```html
 <!-- wxml -->
 <!-- 通过标签内url跳转 -->
 <navigator url="/page/navigate/navigate?title=navigate" hover-class="navigator-hover">跳转到新页面</navigator>
 ```

 ```javascript
  wx.navigateTo({
    url: 'test?id=1' // 参数： id = 1
  })
 ```

 - 从url中取参

 > [小程序生命周期onload()中取参](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)

 ```javascript
  onLoad (query) {
    console.log(query); // {id: 1}
  },
 ```

 > mpvue 方法取参

```javascript
console.log(this.$root.$mp.query.id); // 1
```

 