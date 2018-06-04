# learning react day 1

## 利用react官方工具构建react项目

### react-create-app cli

```shell
# 安装工具
$ npm / cnpm install -g create-react-app
# 创建react项目
$ create-react-app proName
# 启动
$ cd ./proName/
$ npm start
```

### 预制ES6语法熟悉

#### 箭头函数

 > demo 参见目录下'./ES6/arrow.js'

 > [ES6入门-箭头函数](http://es6.ruanyifeng.com/?search=%E6%A8%A1%E7%89%88%E5%AD%97%E9%9D%A2%E9%87%8F&x=0&y=0#docs/function#箭头函数)

#### 类

 > demo 参见目录下'./ES6/class.js'

 > [ES6入门-类class](http://es6.ruanyifeng.com/?search=%E6%A8%A1%E7%89%88%E5%AD%97%E9%9D%A2%E9%87%8F&x=0&y=0#docs/class)

 > ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。

 > 基本上，ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。

 > Point类除了构造方法，还定义了一个toString方法。注意，定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。另外，方法之间不需要逗号分隔，加了会报错。

 ```javascript
 class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};
 ```

 #### 模版字符串

 > demo 参见目录下'./ES6/templateLiteral.js'

 > [ES6入门-模版字符串](http://es6.ruanyifeng.com/?search=%E6%A8%A1%E7%89%88%E5%AD%97%E9%9D%A2%E9%87%8F&x=0&y=0#docs/string#模板字符串)

 > 模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。