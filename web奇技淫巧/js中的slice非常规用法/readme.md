
 ## 数组的splice方法

 ### 用法一 数组的深拷贝

 #### 例子

 ```javascript
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
 ```

 ### 用法二 对于非数组的未知参数进行类型转换，防止调用数组方法的时候报错

 #### 例子

 ```javascript
 const a = {
   name: 'luck',
   age: 22
 }

 const b = [1, 2, 3]

 console.log(a.slice(0)) // TypeError: a.slice is not a function

 console.log([].slice.call(a, 0)) // []

 console.log([].slice.call(b, 0)) // [1, 2, 3]
 ```