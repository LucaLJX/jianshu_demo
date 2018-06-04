/*
ES5 生成实例
*/
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

console.log(p); // Print {x: 1, y: 2}
console.log(p.toString()); // (1, 2)
console.log(typeof(p)); // object

/*
ES6 生成实例
*/ 
/*
注意：
Point类除了构造方法，还定义了一个toString方法。注意，定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。
*/ 
class PrintES6 {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
  // 定义类的方法，不需要加function关键字，且不能用逗号相隔
  toString () {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var pES6 = new PrintES6(5, 6);
console.log(pES6); // PrintES6 {x: 5, y: 6}
console.log(pES6.toString()); // (5, 6)
console.log(typeof(pES6)); // object