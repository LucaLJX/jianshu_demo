
## mac下安装mongodb

### brew

#### 安装brew

```shell

# 安装brew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

```

#### brew 的用法

 - brew update  更新brew；
 - brew install {应用名，如git} 安装软件
 - brew cask install {应用名，如git} 也是下载安装，与上面的区别，请查看https://www.zhihu.com/question/22624898
 - 更多用法请 brew help

### 安装mongodb

```shell
sudo brew install mongodb
```

#### 安装遇到的问题

 在安装的时候，会报出以下错误
 
 ```shell
 Running Homebrew as root is extremely dangerous and no longer supported. As Homebrew does not drop...
 ```
 
 这种个情况是因为没有根目录的访问权限导致的，这时候需要添加访问权限
 
 参考：
 - [homebrew无法安装，提示不能在根目录下使用](http://www.caotama.com/77920.html)
 - [homebrew无法安装](https://blog.csdn.net/maindek/article/details/76164955)
 
 ```shell
 sudo chown -R $(whoami) /usr/local
 ```
 
 这时候也有可能报以下错误
 
 ```shell
 Operation not permitted
 ```
 
 解决方案是在恢复模式下进行授权
 
 > [Mac root Operation not permitted解决方案](https://blog.csdn.net/kaka_caroline/article/details/79955860)
 

### 启动mongodb

 > 推荐大家使用config进行启动
 
 新建mongod.config文件
 
 ```config
 systemLog:
  destination: file
  path: /Users/luca_ljx/LJX/DB/testdb/log/testDB.log
storage:
  dbPath: /Users/luca_ljx/LJX/DB/testdb/db
 ```
 
 启动
 
 ```shell
 mongod --config /Users/xxx/DB/testdb/mongod.conf 
 ```
 
 