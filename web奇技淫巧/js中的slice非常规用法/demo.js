// 深拷贝、
const a = [1, 2, 3]
let b = a
b[1] = 'qwer'

console.log(a) // [1, 'qwer', 3]
console.log(b) // [1, 'qwer', 3]

const c = [1, 2, 3]
let d = c.slice(0)
d[1] = 'abcd'

console.log(c) // [1, 2, 3]
console.log(d) // [1, 'abcd', 3]

// 类型转换
const e = {
  name: 'luck',
  age: 22
}

const f = [1, 2, 3]

console.log(e.slice(0)) // TypeError: a.slice is not a function

console.log([].slice.call(e, 0)) // []

console.log([].slice.call(f, 0)) // [1, 2, 3]
