## betterScroll.js 封装下拉刷新、上拉加载组件（踩坑）

### betterScroll.js 原理

> betterScroll.js 滚动原理。 -- [ betterScroll官网 ](https://better-scroll.github.io/docs/zh-CN/guide/#%E6%BB%9A%E5%8A%A8%E5%8E%9F%E7%90%86)

![示意图](./image/betterScroll.png)

此示例图展示了betterScroll.js的滚动原理，基本上理解这张图就可以解决此类库开发使用中碰到的绝大多数问题。

```html
<!-- 示例结构 -->
  <div class='wrapper'>
    <div class='content'>
      <ul>
        <li>word word word word</li>
        <li>word word word word</li>
        ...
        <li>word word word word</li>
        <li>word word word word</li>
      </ul>
    </div>
  </div>
```

如上示例代码，betterScroll.js只有当内容区域 - **‘content’** 部分的高度超过容器区域 - **‘wrapper’** 的高度，才会触发滚动，而只有触发betterScroll.js的滚动，才可以使用对用的下拉、上拉功能。

### betterScroll.js 封装类库中碰到的问题及解决方案

#### 1.betterScroll初始化之后无法触发滚动的问题

此问题如上文 **原理** 中已经作出了解释，在开发的过程中，务必初始化 **‘wrapper’** 容器，且保证子内容 **‘content’** 的高度超过父级容器。

 - 若内容为空，如何触发滚动下拉刷新

 实际开发中很多列表为空，此时 **‘content’** 无法通过其子内容自动撑开到超过父容器的程度，则此时需要利用css的计算属性对其高度进行赋值

 **设置为比父容器的 100% 多 1px 的高度即可**

 ```css
 .content {
   min-height: calc(100% + 1px);
 }
 ```

 - **‘content’** 已设置为比父容器高1px的情况，还是无法触发下拉（滚动）

这种情况往往是因为草率地设置了父级 **‘wrapper’** 的高度为100%，而 **‘wrapper’** 的父级并没有设置高度从而其无法继承父级高度，需要子级撑开导致的

**实际开发中建议手动利用css属性设置父级wrapper的高度，一般开发中都可以设置为全屏，即 100vh**

```css
.wrapper {
  height: 100vh;
}
```

### 基于 betterScroll.js 设计封装下拉刷新、上拉加载组件的小tips

```html
<!-- 示例结构 -->
  <div class='wrapper'>
    <!-- 下拉提示 -->
    <div>
      下拉刷新。。。
      ...
    </div>
    <div class='content'>
      <ul>
        <li>word word word word</li>
        <li>word word word word</li>
        ...
        <li>word word word word</li>
        <li>word word word word</li>
      </ul>
      <!-- 上拉提示 -->
      <div>
        上拉加载。。。
        ...
      </div>
    </div>
  </div>
```

 #### 1. 文字提示

 - 建议将下拉刷新的文字提示与 **‘content’** 平级且绝对定位到顶部，设置层级低于 **‘content’** 

 - 建议将上拉加载的文字提示至于内容的底部，切勿脱离文档流

 #### 2. 下拉刷新状态
  
  建议计算手指下拉的距离，以用于提示：“释放刷新数据”

  建议下拉刷新分为四个状态，如下：

```javascript
  before: '下拉刷新', // 手指下拉，放开前，超出触发刷新距离前
  pulling: '释放刷新数据', // 手指下拉，放开前，超出触发刷新距离后
  loading: '加载中...', // 手指放开，ajax请求数据完成前
  finished: '加载完成' // 手指放开，ajax请求数据完成后
```

 #### 3. 暴露betterScroll.js 的refresh方法，以主动触发

  > betterScroll.js refresh()方法。 -- [ refresh() ](https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-api.html#%E6%96%B9%E6%B3%95)

  > refresh(): 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常

  - 使用场景

  **非下拉加载触发页面的数据更新（dom更新），如果不调用refresh方法重新计算，则‘content’的高度会保持dom更新之前的状态，最终导致滚动错乱**


### 核心代码

```tsx
import { Component, Prop, Vue } from 'vue-property-decorator'
// bscroll
import BScroll from '@better-scroll/core'
// @ts-ignore
import PullDown from '@better-scroll/pull-down'
// @ts-ignore
import Pullup from '@better-scroll/pull-up'
import _ from 'lodash'
import './index.scss'

BScroll.use(PullDown)
BScroll.use(Pullup)

const TIME_BOUNCE = 500
const TIME_STOP = 500
const PULLDOWN_THRESHOLD = 50
const PULLUP_THRESHOLD = 10
const STOP = 50
const PULLDOWN_TIPS = {
  before: '下拉刷新',
  pulling: '释放刷新数据',
  loading: '加载中...',
  finished: '加载完成'
}
const PULLUP_TIPS = {
  before: '上拉加载更多',
  loading: '加载中...'
}

export interface PullConfig {
  threshold: number // 配置顶部下拉的距离来决定刷新时机
  stop?: number // 回弹停留的距离
}

export interface CoordinateVo {
  x: number
  y: number
}

export interface TipsConfigVo {
  before: string
  pulling?: string
  loading: string
  finished?: string
}

@Component({
  name: 'PullRefresh'
})
export default class PullRefresh extends Vue {

  // 是否支持下拉刷新
  @Prop({ default: true })
  private pullDown!: boolean

  // 是否支持上拉加载
  @Prop({ default: true })
  private pullUp!: boolean

  // z-index 配置
  @Prop({ default: 100 })
  private zIndex!: number

  // pullDown 组件配置
  @Prop({ default: () => {
    return {
      threshold: PULLDOWN_THRESHOLD, // 配置顶部下拉的距离来决定刷新时机
      stop: STOP // 回弹停留的距离
    }
  } })
  private pullDownConfig!: PullConfig

  // pullUp 组件配置
  @Prop({ default: () => {
    return {
      threshold: PULLUP_THRESHOLD // 配置顶部下拉的距离来决定刷新时机
    }
  } })
  private pullUpConfig!: PullConfig

  // 是否无更多数据 - 只有开启Pullup的情况下传
  @Prop({ default: false })
  private noMore!: boolean

  @Prop({ default: '无更多数据' })
  private noMoreTips!: string

  // 下拉、上拉操作结束后的停留时间
  @Prop({ default: TIME_STOP })
  private stayTime!: number

  @Prop({ default: () => PULLDOWN_TIPS })
  private pullDownTips!: TipsConfigVo

  @Prop({ default: () => PULLUP_TIPS })
  private pullUpTips!: TipsConfigVo

  @Prop({ default: true })
  private empty!: boolean

  // 状态 下拉之前
  private beforePullDown: boolean = true
  // 状态 下拉过程中
  private isPullingDown: boolean = false
  private bscroll: any = _.noop
  private pullDownY: number = 0
  // 状态 上拉之前
  private isPullUpLoad: boolean = false
  // 状态 上拉过程中
  private pullUpLoading: boolean = false

  private get tipsStyle () {
    return {
      'z-index': this.zIndex
    }
  }

  private get contentStyle () {
    return {
      'z-index': this.zIndex + 1,
      'padding-bottom': this.noMore || this.pullUp ? '50px' : 0
    }
  }

  private get showNoMoreTips () {
    return this.noMore && this.pullUp && !this.empty
  }

  private get pullingDownOut () {
    return this.pullDownY > this.pullDownConfig.threshold
  }

  /**
   * 更新better scroll的dom
   */
  public refreshDom () {
    return new Promise((resolve, reject) => {
      this.bscroll.refresh()
      resolve()
    })
  }

  private mounted () {
    this.$nextTick(() => {
      this.initBscroll()
    })
  }

  /**
   * 初始化
   */
  private initBscroll () {
    const config = {
      scrollY: true,
      bounce: {
        top: this.pullDown ? true : false,
        bottom: this.pullUp ? true : false
      },
      bounceTime: TIME_BOUNCE,
      pullDownRefresh: this.pullDown ? this.pullDownConfig : false,
      pullUpLoad: this.pullUp ? this.pullUpConfig : false
    }
    this.bscroll = new BScroll(this.$refs.PullRefreshWrapper as HTMLElement, config)
    if (this.pullDown) {
      this.bscroll.on('pullingDown', this.pullingDownHandler)
    }
    if (this.pullUp) {
      this.bscroll.on('pullingUp', this.pullingUpHandler)
    }
    this.bscroll.on('scroll', this.scrollHandler)
  }

  /**
   * 下拉滚动持续触发
   * @param pos 滚动过程中的坐标
   */
  private scrollHandler (pos: CoordinateVo) {
    this.pullDownY = pos.y
  }

  /**
   * 下拉滚动结束触发
   */
  private async pullingDownHandler () {
    this.beforePullDown = false
    this.isPullingDown = true
    // 触发刷新操作
    await this.refeashData()
    // 下拉过程结束，进入回弹状态
    this.isPullingDown = false
    this.finishPullDown()
  }

  /**
   * 下拉触发pullDown事件
   */
  private async refeashData () {
    return new Promise((resolve, reject) => {
      this.$emit('pullDown', resolve)
    })
  }

  /**
   * 上拉触发pullUp事件
   */
  private getMore () {
    return new Promise((resolve, reject) => {
      this.$emit('pullUp', resolve)
    })
  }

  /**
   * 下拉结束后调用的方法，用于处理停留时间等
   */
  private async finishPullDown () {
    const stopTime = this.stayTime
    await new Promise(resolve => {
      setTimeout(() => {
        this.bscroll.finishPullDown()
        resolve()
      }, stopTime)
    })
    setTimeout(() => {
      this.beforePullDown = true
      this.bscroll.refresh()
    }, TIME_BOUNCE)
  }

  /**
   * 上拉触发的事件
   */
  private async pullingUpHandler () {
    if (this.noMore || this.empty) return false
    this.isPullUpLoad = true
    this.pullUpLoading = true
    await this.getMore()
    this.pullUpLoading = false
    this.bscroll.finishPullUp()
    this.bscroll.refresh()
    this.isPullUpLoad = false
  }

  /**
   * 上拉提示文字
   */
  private upTips () {
    if (!this.pullUp || this.empty) return null
    const upTips = this.pullUpTips
    let tips = ''
    if (this.noMore) {
      tips = this.noMoreTips
    } else {
      tips = !this.isPullUpLoad && !this.pullUpLoading ? upTips.before : upTips.loading
    }
    return <p class='PullRefresh_upTips'>{ tips }</p>
  }

  /**
   * 下拉提示文字
   */
  private downTips () {
    if (!this.pullDown) return null
    const downTipsConfig = this.pullDownTips
    let tips = ''
    if (this.beforePullDown && !this.isPullingDown) {
      tips = this.pullingDownOut ? downTipsConfig.pulling! : downTipsConfig.before
    } else {
      tips = this.isPullingDown ? downTipsConfig.loading : downTipsConfig.finished!
    }
    return <p class='PullRefresh_downTips' style={this.tipsStyle}>{ tips }</p>
  }

  protected render () {
    return <div class='PullRefreshComponent'>
      <div class='PullRefresh'>
        <div class='PullRefresh_wrapper' ref='PullRefreshWrapper'>
          <div class='PullRefresh_content' style={this.contentStyle}>
            {
              this.$slots.default
            }
            <div v-show={this.showNoMoreTips} class='PullRefresh_noMore'>{ this.noMoreTips }</div>
            {
              this.upTips()
            }
          </div>
          {
            this.downTips()
          }
        </div>
      </div>
    </div>
  }
}
```

```scss
.PullRefreshComponent {
  height: 100%;

  .PullRefresh {
    height: 100%;

    &_wrapper {
      position: relative;
      height: 100%;
      overflow: hidden;
    }

    &_downTips {
      z-index: 100;
      position: absolute;
      height: 50px;
      line-height: 50px;
      top: 0;
      width: 100%;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    &_upTips {
      height: 50px;
      line-height: 50px;
      width: 100%;
      position: absolute;
      bottom: 0;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    &_content {
      background-color: #fff;
      position: relative;
      z-index: 101;
      min-height: calc(100% + 1px);
    }

    &_noMore {
      position: absolute;
      height: 50px;
      line-height: 50px;
      bottom: 0;
      text-align: center;
      width: 100%;
    }
  }
}

```

BY--LucaLJX ([LucaLJX的github](https://github.com/LucaLJX/jianshu_demo))
