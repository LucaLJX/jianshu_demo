export default {
  init: function (){
    console.log("初始化bing地图脚本...");
    // bing map key
    const bingUesrKey = 'AgzeobkGvmpdZTFuGa7_6gkaHH7CXHKsFiTQlBvi55x-QLZLh1rSjhd1Da9bfPhD';
    const BingMap_URL = 'http://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=' + bingUesrKey;
    return new Promise((resolve, reject) => {
      if(typeof Microsoft !== "undefined") {
        resolve(Microsoft);
        return true;
      }

      // 插入script脚本
      let scriptNode = document.createElement("script");
      scriptNode.setAttribute("type", "text/javascript");
      scriptNode.setAttribute("src", BingMap_URL);
      document.body.appendChild(scriptNode);

      // 等待页面加载完毕回调
      let timeout = 0;
      let interval = setInterval(() => {
        // 超时10秒加载失败
        if(timeout >= 20) {
          reject();
          clearInterval(interval);
          console.error("bing地图脚本初始化失败...");
        }
        // 加载成功
        if(typeof Microsoft !== "undefined") {
          resolve(Microsoft);
          clearInterval(interval);
          console.log("bing地图脚本初始化成功...");
        }
        timeout += 1;
      }, 500);
    });
  }
}  