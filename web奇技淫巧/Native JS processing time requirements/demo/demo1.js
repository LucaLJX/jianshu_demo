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