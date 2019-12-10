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