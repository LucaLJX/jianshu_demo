# ES6、ES7 async、await函数详解

## 概念

 > async 函数就是Generator 函数的语法糖

## 解决问题

 - 回调地狱问题
 - Generator 函数的执行必须靠执行器的问题

## 与Generator 函数的区别

 - 内置执行器

 > Generator 函数的执行必须靠执行器，所以才有了co模块，而async函数自带执行器。也就是说，async函数的执行，与普通函数一模一样，只要一行。

 - 更好的语义

 > async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。

 - 更广的适用性

 > co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。

 - 返回值是 Promise

 > async函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用then方法指定下一步的操作。

 ## 示例

 ```javascript
  // 定义async中需要调用的promise对象函数
  function testResult () {
    // 必须return一个promis对象，否则会等同于一个同步操作
    return new Promise(function (resolve, reject) {
      // 内部可以是一个http请求等异步操作
      $.post('xxx', function (res, err) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  }

  // 定义一个async函数
  // 函数定义前必须加 async 关键词
  async function testFun () {
    const result1 = await testResult();
  }

  // async 函数的调用跟普通函数一样
  testFun();
 ```

 > [es 6 入门 - async函数](http://es6.ruanyifeng.com/#docs/async)

 扩展阅读：

 > [es 6 入门 - generator函数](http://es6.ruanyifeng.com/#docs/generator)

 > [CSDN - asnyc函数详解](https://blog.csdn.net/y491887095/article/details/80807845)

 ## asnyc函数的异常处理

 ```javascript
 async function doCheck(){
    let result;
    try{
         result = await check();
    }
    catch(e){
        console.log('error occurs');
    }  
}
 ```