
# learning mongodb day 1

> 基础学习来源： [菜鸟教程(RUNOOB.COM)](http://www.runoob.com/mongodb/mongodb-tutorial.html)

### 安装与启动
 
#### windows 环境

 - 遇到的问题

    - mongod commond not found
      - 需要配置windows的全局变量path
    - 使用config文件启动的时候，报log文件should be file
      - 在指定的log文件夹新建log文件，并在conf文件中指向这个文件
  
 - 配置文件示例

 >参考： [http://www.cnblogs.com/zlslch/p/6935377.html](http://www.cnblogs.com/zlslch/p/6935377.html)

 **注意：3.2版本之后httpinterface参数废弃**

 mongod.conf

```shell
systemLog:
  destination: file
  path: E:\LucaLJX\data\testDB\log\testDB.log
storage:
  dbPath: E:\LucaLJX\data\testDB\db
```

 [配置文件编写参考](https://www.cnblogs.com/phpandmysql/p/7763394.html)

 - 启动

```shell
mongod --config xxxxxx
```

>操作参考：[https://blog.csdn.net/zhangpengfei104/article/details/52368237](https://blog.csdn.net/zhangpengfei104/article/details/52368237)


### 给数据库创建登录账号密码

```shell
show dbs 
use admin
db.createUser()...
```

### 基础使用

#### 创建数据库

 - 语法

```javascript
use DATABASE_NAME
```

 - 注意，需要在新建的数据库里面插入数据，才会展示新建的这个数据库

#### 查看当前所有数据库

 - 语法

```shell
show dbs
```

#### 删除数据库

 - 语法

```javascript
db.dropDatabase()
```

**删除数据库跟删除集合，都需要切换到要删除的这个数据库或者集合,集合是数据库的子集**

#### 创建集合

 - 语法

```javascript
db.createCollection(name, options)

// name: 要创建的集合的名称
// option: 可选参数，指定有关内存大小及索引的选项
```

 - options
    - capped
      - boolean
      - 可选
      - 如果是true，则创建固定集合（即有固定大小的集合，当达到最大值的时候，会自动覆盖最早的文档）
      - 如果是true，必须指定**size**参数
    - autoIndexId
      - boolean
      - 可选
      - 如果是true，则自动在_id字段创建索引，默认false
    - size
      - number
      - 可选
      - 为固定集合指定一个最大值，以字节计
      - 如果capped为true，则需要指定此字段
    - max
      - number
      - 可选
      -指定固定集合中包含文档的最大数量

#### 删除集合

 - 语法

```javascript
db.collection.drop()
```

 > 如果删除成功，则返回true，否则返回false

 demo

```javascript
//  选中数据库
use mydb
//  查看哪些集合
show collections
//  删除指定集合
db.xxx.drop()
``` 

#### 插入文档

 - mongodb使用**insert()** 或者 **save()** 方法向集合中插入文档
 - 文档的数据结构和JSON基本一样

 - 语法

```javascript
db.xxx.insert(xxx)
// insert()接收参数为要插入的内容，可以是变量，也可以直接在方法中写
```

#### 更新文档

 > mongodb使用 **update()** 和 **save()** 来更新集合中的文档

  - update()
  
  用于更新已存在的文档

  语法
```javascript
  db.collection.update(
   <query>,
   <update>,
   {
    upsert: <boolean>,
    multi: <boolean>,
    writeConcern: <document>
   }
  )
```
  参数说明

  > 1.query : update的查询条件，类似sql update查询内where后面的。

  > 2.update : update的对象和一些更新的操作符（如$,$inc...）等，也可以理解为sql update查询内set后面的
    
  > 3.upsert : 可选，这个参数的意思是，如果不存在update的记录，是否插入objNew,true为插入，默认是false，不插入。

  > 4.multi : 可选，mongodb 默认是false,只更新找到的第一条记录，如果这个参数为true,就把按条件查出来多条记录全部更新。

  > 5.writeConcern :可选，抛出异常的级别。

 - save()

 save() 方法通过传入的文档来替换已有文档

 语法
```javascript
db.collection.save(
   <document>,
   {
     writeConcern: <document>
   }
)
```
  参数说明

  > document : 文档数据。

  > writeConcern :可选，抛出异常的级别。

  更多示例

```javascript
// 只更新第一条记录：

db.col.update( { "count" : { $gt : 1 } } , { $set : { "test2" : "OK"} } );

// 全部更新：

db.col.update( { "count" : { $gt : 3 } } , { $set : { "test2" : "OK"} },false,true );

// 只添加第一条：

db.col.update( { "count" : { $gt : 4 } } , { $set : { "test5" : "OK"} },true,false );

// 全部添加加进去:

db.col.update( { "count" : { $gt : 5 } } , { $set : { "test5" : "OK"} },true,true );

// 全部更新：

db.col.update( { "count" : { $gt : 15 } } , { $inc : { "count" : 1} },false,true );

// 只更新第一条记录：

db.col.update( { "count" : { $gt : 10 } } , { $inc : { "count" : 1} },false,false );
```

[教程：mongodb更新文档](http://www.runoob.com/mongodb/mongodb-update.html)

#### 删除文档

 - 语法

```javascript
db.collection.remove(
   <query>,
   <justOne>
)
```
参数说明：

  > query :（可选）删除的文档的条件。

  > justOne : （可选）如果设为 true 或 1，则只删除一个文档。

  > writeConcern :（可选）抛出异常的级别。

**remove()语法必须传query参数，可以是｛｝，不传的话会报错**  

demo
```javascript
// 删除检索条件为title是remove的文档（全部删除）
db.test.remove({title: 'remove'})
// 删除检索条件为title是remove的文档（只删除1个）
db.test.remove({title: 'remove'}, 1)
```

 - 语法

```javascript
db.xxx.update({xxx:xxx}, {$pop: {key: }});
```

注意：db.xxx.find()可以查看集合下所有的文档

#### 查询文档

> mongodb查询文档使用find()

 语法

```javascript
  db.collection.find(query, projection)

  // 也可以用findOne()进行查询
  db.collection.findOne(query, projection)

  // 等价于
  db.collection.find().limit(1)
```

参数说明

  > query ：可选，使用查询操作符指定查询条件

  > projection ：可选，使用投影操作符指定返回的键。查询时返回文档中所有键值， 只需省略该参数即可（默认省略）。

 - and 查询

语法
```javascript
  db.col.find({key1:value1, key2:value2}).pretty()
```

demo
```javascript
//  以下实例通过 by 和 title 键来查询 菜鸟教程 中 MongoDB 教程 的数据

db.col.find({"by":"菜鸟教程", "title":"MongoDB 教程"}).pretty()

// 以上实例中类似于 WHERE 语句：WHERE by='菜鸟教程' AND title='MongoDB 教程'
```

 - or 查询

 > MongoDB OR 条件语句使用了关键字 $or

 语法
 ```javascript
 db.col.find(
   {
      $or: [
         {key1: value1}, {key2:value2}
      ]
   }
  ).pretty()
 ```

 demo
 ```javascript
 // 以下实例中，我们演示了查询键 by 值为 菜鸟教程 或键 title 值为 MongoDB 教程 的文档。

  db.col.find({$or:[{"by":"菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()

 ```

 - and 和 or 联合使用

 demo
 ```javascript
 // 以下实例演示了 AND 和 OR 联合使用，类似常规 SQL 语句为： 'where likes>50 AND (by = '菜鸟教程' OR title = 'MongoDB 教程')'

 db.col.find({"likes": {$gt:50}, $or: [{"by": "菜鸟教程"},{"title": "MongoDB 教程"}]}).pretty()

 ```

 #### 条件操作（大于、小于、大于等于、小于等于）

  - 大于
    - $gt
  - 小于
    - $lt
  - 大于等于
    - $gte
  - 小于等于
    - $lte
  - 不等于
    - $ne
  - 等于
    - $eq

 demo
 ```javascript
 // 获取 "col" 集合中 "likes" 大于 100 的数据

 db.col.find({"likes" : {$gt : 100}})

 // 另外一个例子
 // 获取"col"集合中 "likes" 大于100，小于 200 的数据
 // 类似SQL语句： Select * from col where likes>100 AND  likes<200;

 db.col.find({likes : {$lt :200, $gt : 100}})
 ```

 #### $type操作符

 > 具体对应表格请查询 [$type查询表](http://www.runoob.com/mongodb/mongodb-operators-type.html)

 #### limit()与skip()

 - limit()

 > limit()方法接受一个数字参数，该参数指定从MongoDB中读取的记录条数。

 语法
```javascript
  db.COLLECTION_NAME.find().limit(NUMBER)
```

 - skip()

 > 使用skip()方法来跳过指定数量的数据，skip方法同样接受一个数字参数作为跳过的记录条数。

 语法
 ```javascript
  db.COLLECTION_NAME.find().limit(NUMBER).skip(NUMBER)
 ```

 demo
 ```javascript
  // 以下实例只会显示第二条文档数据

  db.col.find({},{"title":1,_id:0}).limit(1).skip(1)
 ```

 > limit() 和 skip() 结合即可以实现分页操作

 #### sort() - mongodb排序

 > 在MongoDB中使用使用sort()方法对数据进行排序，sort()方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而-1是用于降序排列。

 语法
 ```javascript
 db.COLLECTION_NAME.find().sort({KEY:1})
 ```

 > skip(), limilt(), sort()三个放在一起执行的时候，执行的顺序是先 sort(), 然后是 skip()，最后是显示的 limit()。


BY-[Luca_LJX](https://github.com/LucaLJX/jianshu_demo/tree/master/%E6%95%B0%E6%8D%AE%E5%BA%93/lerning%20mongoDB%20day%201)