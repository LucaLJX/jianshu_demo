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
