# 小程序开发-简明文档-Part 1

### hidden 与 wx:if

小程序 **hidden** 和 **wx:if** 等同于vue中的 **v-show** 与 **v-if**

```html
<!-- hidden -->
<view hidden="{{ isHidden }}"></view>

<!-- wx:if -->
<view wx:if="{{ isHidden }}"></view>

<!-- 扩展用法 -->
<!-- wx:else -->
<view wx:if="{{ isHidden === 1 }}"></view>
<view wx:elseif="{{ isHidden === 2 }}"></view>
<view wx:else></view>
```

### wx:for

小程序 **wx:for** 等同于vue中的 **v-for**

 - items 、 item
    - 小程序默认元素的item, index属性，不需要像vue一样指定
 - wx:key
    - 小程序也需要指定元素的key值，否则会警告
 - wx:for-item 、 wx:for-index
    - 小程序可以指定元素的变量名

```html
<!-- 不改变变量名 -->
<!-- 默认是item、index -->
<view wx:for="{{ users }}" wx:key="{{ index }}">
  <text>{{ index }}: {{ item.name }}</text>
</view>
<!-- 改变变量名 -->
<view wx:for="{{ users }}" wx:for-item="user" wx:for-index="id" wx:key="{{ id }}">
  <text>{{ id }}: {{ user.name }}</text>
</view>
```

### 小程序原生数组的处理

  小程序中修改数据不可以像普通js文件中一样直接 **key = value** 格式进行赋值，必须调用小程序自带的 **setData()** 函数进行数据更新

 - 数组的赋值

```javascript
Page({
  data: {
    list: []
  },
  initList: function () {
    let newList = [1, 2, 3]
    // 直接赋值不奏效
    // this.list = [...newList]
    // 调用 setData() 函数进行赋值
    this.setData({
      list: newList
    })
  }
})
```

 - 数组的追加
    - 小程序中对数组进行push操作是无效的

```javascript
Page({
  data: {
    list: [],
    list2: [1, 2, 3]
  },
  // 构建新数组，进行替换
  addList: function () {
    let _this = this
    let newList = []
    this.data.list2.map(item => {
      newList.push(item)
    })
    // 直接在list上操作无效
    // _this.data.list2.map(item => {
    //   _this.data.list.push(item)
    // })
    // 此方法无效
    this.setData({
      list: newList
    })
  },
  // 数组拼接构建新数组，然后替换
  addList: function () {
    let _this = this
    this.setData({
      list: this.data.list.concat(this.data.list2)
    })
  }
})
```

 - 数组的删除与清空

 数组删除可以直接在原数组上进行操作

 ```javascript
 Page({
  data: {
    list: [1, 2, 3]
  },
  // 删除最后一位
  initList: function () {
    this.setData({
      list: this.data.list.splice(0, this.data.list.length - 1)
    })
  },
  // 数组清空
  resetList: function () {
    this.setData({
      list: []
    })
  }
})
 ```

 - 数组指定项赋值

 ```javascript
Page({
  data: {
    list: [
      {
        name: '小明',
        age: 22
      },
      {
        name: '小王',
        age: 21
      }
    ]
  },
  // 修改小王的年龄 （第二个人的年龄）
  initList: function () {
    this.setData({
      'list[1].name': 23
    })
  },
  // 修改小王的年龄 （第二个人的年龄）
  initListByIndex: function (index) {
    this.setData({
      'list[' + index + '].name': 23
    })
  },
})
 ```
