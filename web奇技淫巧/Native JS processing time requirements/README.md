# 原生JS获取日期段及时间比较的骚操作（基本操作）

## 需求描述

> 日常开发中，经常会遇到以下对于时间（日期）的操作需求：

 - 格式化时间为 **‘年-月-日’** 或者 **'年-月-日 时:分:秒'**
 - 比较两段时间的大小
 - 获取两段时间（日期）中间的所有时间段（日期）

## 质疑

### 来自路人甲大佬的质疑

> 路人甲大佬： 为啥不用day.js或者moment.js这些现成的库

### 来自作者弱弱的回应

现在最流行的day.js轻量库以及moment.js都可以实现以上功能，但是moment.js有12kb大小，day.js仅仅2kb大小，为了时间数据的格式化引入day.js完全没有问题，但是后两个功能的实现需要引入moment.js，作者认为还不如自己写一套。

## 功能实现

### 时间格式化的实现

> 此功能无非调用原生js的Date对象的 **getFullYear()** 、 **getMonth()** 、 **getDate()** 等方法获取值之后的拼接，在这里不做赘述

### 比较两段时间的大小

 - 笨办法

> 之前作者开发中只碰到了比较两段日期的先后顺序作校验，所以采取了以下本办法

Demo 1 - 比较两天大小（笨办法）

```js
const day1 = '2018-11-12'
const day2 = '2018-10-22'

function compareDate (day1, day2) {
  const day1Num = parseInt((day1.split('-').join('')), 10)
  const day2Num = parseInt((day2.split('-').join('')), 10)
  const differenceCount = day2Num - day1Num
  console.log(differenceCount)  // -90
  let result =  differenceCount === 0 ?
    'the same day' : differenceCount > 0 ?
      'the day1 is earlier than the day2' :
        'the day2 is earlier than the day1'
  return result
}

console.log(compareDate(day1, day2)) // the day2 is earlier than the day1
```

问题：这种方法虽然达到了比较两个日期的大小，但是其中的差值是需要进一步处理的，不是很严谨，而且涉及要计算小时的差值，则完全没有办法使用

 - 利用js原生Date对象的 **getTime()** 换算处理

Demo 1 - 比较两天大小（利用换算成距 1970 年 1 月 1 日之间的毫秒数）

 ```js
 function newCompareDate (day1, day2) {
  const day1Date = new Date(day1)
  const day1Time = day1Date.getTime()
  const day2Date = new Date(day2)
  const day2Time = day2Date.getTime()
  const differenceCount = day2Time - day1Time
  console.log(differenceCount)  // -1814400000
  let result =  differenceCount === 0 ?
    'the same day' : differenceCount > 0 ?
      'the day1 is earlier than the day2' :
        'the day2 is earlier than the day1'
  return result
}

console.log(newCompareDate(day1, day2)) // the day2 is earlier than the day1
 ```

 **利用js提供的getTime()方法换算成“距 1970 年 1 月 1 日之间的毫秒数”然后进行差值计算，如果要得到小时数或者天数，则进行进一步计算即可**

### 获取两段时间（日期）中间的所有时间段（日期）

 - 利用getTime()方法进行递增计算

 demo 2

 ```js
 function getAllDateArr (begin, end) {
  let arr = []
  let beginArr = begin.split('-')
  let endArr = end.split('-')
  let beginDate = new Date()
  beginDate.setUTCFullYear(parseInt(beginArr[0], 10), parseInt(beginArr[1], 10) - 1, parseInt(beginArr[2], 10))
  let endDate = new Date()
  endDate.setUTCFullYear(parseInt(endArr[0], 10), parseInt(endArr[1], 10) - 1, parseInt(endArr[2], 10))
  let beginSec = db.getTime() - 24 * 60 * 60 * 1000
  let endSec = de.getTime()
  for (let i = beginSec; i < endSec; i++) {
    i = i + 24 * 60 * 60 * 1000
    // 使用day.js格式化日期
    arr.push(dayjs(new Date(i)).format('YYYY-MM-DD'))
  }
  return arr
}

getAllDateArr('2018-11-12', '2018-12-12')
 ```

 ## 结语

 > 以上功能除了day.js之外，其他功能如果引入moment.js则差不多需要14kb内存大小，但自己实现不到20行代码则可以实现功能，所以依赖第三方库有时候可以考虑自己手动实现。

 ### 小tips

 > 作者在之前的一个国际项目中碰到一个问题：在国内前端处理好数据发送到后端，后端存储后如果在其他时区获取使用此时间，会出现时间显示的误差，原因是因为前后端时区不统一的问题，当时的解决方案是前端解决，前端只要在存储及显示的时候，获取本地的时区然后进行时间的换算即可。

 BY--LucaLJX ([LucaLJX的github](https://github.com/LucaLJX/jianshu_demo))