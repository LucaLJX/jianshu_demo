// 获取图片基本信息
export function wxGetImgInfo (imgUrl) {
  return new Promise(async function (resolve, reject) {
    wx.getImageInfo({
      src: imgUrl,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

// 下载文件
export function wxDownloadFile (fileUrl) {
  return new Promise(async function (resolve, reject) {
    wx.downloadFile({
      url: fileUrl,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

// 获取设备基本信息
export function wxGetSystemInfo () {
  return new Promise(async function (resolve, reject) {
    wx.getSystemInfo({
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

// canvas画布转图片
export function wxCanvasToTempFilePath (canvasObj) {
  return new Promise(async function (resolve, reject) {
    wx.canvasToTempFilePath({
      x: canvasObj.x,
      y: canvasObj.y,
      width: canvasObj.width,
      height: canvasObj.height,
      destWidth: canvasObj.destWidth,
      destHeight: canvasObj.destHeight,
      canvasId: canvasObj.canvasId,
      fileType: canvasObj.fileType ? canvasObj.fileType : 'png',
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

// 保存图片到本地
export function wxSaveImageToPhotosAlbum (filePath) {
  return new Promise(async function (resolve, reject) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: function (res) {
        
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}