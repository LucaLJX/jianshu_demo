
# 小程序开发-mpvue构建小程序项目-1-踩坑

## mpvue-entry 插件引入

 - mpvue的坑
    - mpvue新增页面或者模块的时候必须重新npm run dev才可以进行更新，不支持热更新
    - mpvue所有页面模块.vue文件都需要写main.js，重复工作

 - 用途
    - 支持小程序热更新
    - 重新定义mpvue小程序页面配置

 > 参考文档： [npm-mpvue-entry](https://www.npmjs.com/package/mpvue-entry?activeTab=readme)

 > 重点参考文档： [https://github.com/F-loat/mpvue-entry](https://github.com/F-loat/mpvue-entry)

 > 参考配置文档： [mpvue-issue-F-loat的回答](https://github.com/Meituan-Dianping/mpvue/issues/590)


 - npm安装mpvue-entry依赖包

 ```shell
 npm i mpvue-entry --save
 ```

 **操作了半天，mpvue-entry的作者为了方便大家使用，开源了基于mpvue-entry的模版，大家可以直接使用这个quickStart进行构建项目**

  > mpvue-entry-quickStart 项目地址： [mpvue-entry-quickStart](https://github.com/F-loat/mpvue-quickstart)

 - mpvue-entry-quickStart 构建项目

 ```shell
  $ npm install -g vue-cli
  $ vue init F-loat/mpvue-quickstart my-project
  $ cd my-project
  $ npm install
  $ npm run dev
 ```

 ## mpvue-entry-quickStart模版使用方式

 ### 新增页面

 - 在 **src/pages/**目录下新增.vue文件
 - src/pages.js 文件新增页面路径
 - 支持热更新，无需重启

 > 参考文档： [https://github.com/F-loat/mpvue-entry](https://github.com/F-loat/mpvue-entry)

 ```javascript
 // pages.js
module.exports = [
  {
    path: 'pages/news/list', // 页面路径，同时是 vue 文件相对于 src 的路径，必填
    config: { // 页面配置，即 page.json 的内容，可选
      navigationBarTitleText: '文章列表',
      enablePullDownRefresh: true
    }
  }
]
 ```

 ### mpvue-entry 使用注意事项

 #### 分包与主包的配置

  - 主包的页面必须放在项目默认 src/pages/ 文件夹下面
  - 分包的页面配置，必须加上subPackage参数

```javascript
module.exports = [
  // 主包
  {
    path: 'pages/cardList/index', // 页面路径，同时是 vue 文件相对于 src 的路径
  }, {
    path: 'pages/card/index'
  }, 
  // 分包
  {
    path: 'packageA/logs',
    subPackage: true,
    config: { // 页面配置，即 page.json 的内容
      navigationBarTitleText: '查看启动日志'
    }
  }
]
```

## 小程序默认tabBar配置

> 参考文档： [小程序文档-配置](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html)

### 用途

 - 小程序提供的默认展示在底部的tab菜单栏

### 配置方式

 - src/main.js 文件中添加config

```javascript
// 主 main.js 文件
import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false
App.store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    // tabBar 配置
    tabBar: {
      backgroundColor: "#fafafa",
      borderStyle: "white",
      selectedColor: "#b4282d",
      color: "#666",
      list: [
        {
          pagePath: "pages/cardList/index",
          iconPath: "static/images/ic_menu_choice_nor.png",
          selectedIconPath: "static/images/ic_menu_choice_pressed.png",
          text: "cardlist"
        },
        {
          pagePath: "pages/card/index",
          iconPath: "static/images/ic_menu_choice_nor.png",
          selectedIconPath: "static/images/ic_menu_choice_pressed.png",
          text: "card"
        },
      ]
    }
  }
}
```

BY-Luca_LJX([git地址](https://github.com/LucaLJX/jianshu_demo/tree/master/%E5%B0%8F%E7%A8%8B%E5%BA%8F/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91-mpvue%E6%9E%84%E5%BB%BA%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%A1%B9%E7%9B%AE-1-%E8%B8%A9%E5%9D%91)

