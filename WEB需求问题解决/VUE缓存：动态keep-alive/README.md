# VUE缓存：动态keep-alive

> 路总归是有的，就看愿不愿意剑走偏锋了。

## 场景

在最近的开发中，设计有A、B、C三个页面，试想这样一个场景需求：

 - 离开B页面进入C页面，缓存B页面数据（keepAlive: true）
 - 离开B页面进入A页面，不缓存B页面数据（keepAlive: false)

## 概念

  - keep-alive
    - keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和 transition 相似，keep-alive 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。
    - [keep-alive: vue文档](https://cn.vuejs.org/v2/api/#keep-alive)

  - 组件内的守卫 - beforeRouteLeave
    - 导航离开该组件的对应路由时调用
    - 可以访问组件实例 `this`
    - [组件内的守卫: vue-router 文档](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB)

## 前置背景：keep-alive 组件实现

  - 路由元信息内添加特定字段如：keepAlive

```js
  const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { 
            keepAlive: true 
          }
        }
      ]
    }
  ]
})
```

  - 父组件内根据路由中的keepAlive字段动态使用keep-alive标签

```jsx
  class Home extends Vue {

    get keepAlive () {
      // 获取当前路由的元信息中的keepAlive字段
      return this.$route.meta.keepAlive
    }

    private render () {
      return (
        <div>
          {
            !this.keepAlive && <router-view />
          }
          <keep-alive>
            {
              this.keepAlive && <router-view/>
            }
          </keep-alive>
        </div>
      )
    }
  }

  export default Home
```

## 思路

由于现在组件的keep-alive是动态根据路由元信息中的keepAlive字段进行动态使用的，所以只要动态改变对应路由元信息的keepAlive字段就可以实现动态缓存。

## 实现方案

### 方案一

- 利用beforeRouteLeave改变from的keepAlive实现（原思路，网络解决方案之一，有bug）

```js
beforeRouteLeave (to: any, from: any, next: any) {
  // 导航离开该组件的对应路由时调用
  // 判断是否是去往页面 C 
  if (to.name !== 'C') {
    // 不是去 C 页面，不缓存
    from.meta.keepAlive = false
  } else {
    // 是去 C 页面，缓存
    from.meta.keepAlive = true
  }
  next()
}
```

**bug：首次去C页面，再返回B页面，B并没有缓存，第二次再进入C页面，B页面缓存，且进A页面并不能清除B页面的缓存**

### 方案二（网络方案）

 - $destroy()销毁

```js
beforeRouteLeave (to: any, from: any, next: any) {
  // 导航离开该组件的对应路由时调用
  // 判断是否是去往页面 C 
  if (to.name !== 'C') {
    // 不是去 C 页面，不缓存
    this.$destroy()
  }
  next()
}
```

**bug：销毁之后永远不会被缓存**

### 方案三（网络方案）

 - 根据源码看来缓存的组件都会设置一个cache属性，可以通过代码强行移除掉。缺点就是没有彻底销毁依旧占内存
 - [具体实现参考](https://segmentfault.com/a/1190000015845117)

### 方案四（最优解）

 - 利用keep-alive的include属性，利用vuex动态控制include达到动态管理缓存
 - 这边不做赘述，网上有很多相关示例代码，且原理很简单

 ## 特殊场景以上方案均不可实现下的解决方案

 ### 特殊场景

  - 此次项目为移动端项目，并未用到keep-alive的include属性，且如果要加入，则项目很多配置需要修改，比较麻烦

 ### 解决方案

  - 解决方案与上面的方案一类似
  - 区别：
    - 不操作beforeRouteLeave中的from对象改变keepAlive
    - 直接操作this.$router中对应路由元信息的keepAlive

```js
// 操作指定name的路由的元信息
private changeKeepAlive (parentName: string, name: string, keepAlive: boolean) {
  // @ts-ignore
  this.$router.options.routes.map((item: any) => {
    if (item.name === parentName) {
      item.children.map((a: any) => {
        if (a.name === name) {
          a.meta.keepAlive = keepAlive
        }
      })
    }
  })
}

beforeRouteLeave (to: any, from: any, next: any) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (to.name === 'C') {
      this.changeKeepAlive('Home', 'B', true)
    } else {
      this.changeKeepAlive('Home', 'B', false)
    }
    next()
  }
```

**经测试，这种解决方案就不会出现方案一的bug**

BY--LucaLJX ([LucaLJX的github](https://github.com/LucaLJX/jianshu_demo))
