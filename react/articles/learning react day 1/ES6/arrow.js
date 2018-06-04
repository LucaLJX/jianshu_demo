/*
箭头函数 + 变量默认值
*/
let fun_1 = (x = 2) => console.log(x)

fun_1() // 2
fun_1('3') // '3'

/*
箭头函数需要传多个参数，用括号代表参数部分
*/ 
let fun_2 = (num1, num2) => {return num1 + num2;}
let result_2 = fun_2(3, 4)
console.log(result_2)

/*
由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错
*/
let fun_3 = (id, name) => ({id: id, name: name})
let result_3 = fun_3('2', 'liu')
console.log(result_3)