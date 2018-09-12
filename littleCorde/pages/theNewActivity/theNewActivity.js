let app  = getApp();
Page({
  data: {
    actionSheetHidden: true, //分享上拉菜单开关
    spuCanvas: true, //卡片开关
    flag: true,
    spuCanvasImage: "",
    canvasImg2: "",
     hiGoFlag: true,
  },
  onLoad:function(){
    var that = this;
    that.getActive()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })
    wx.getImageInfo({
      src: 'https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the2018newactivity59.jpg',
      success: function (res) {
        that.setData({
          spuCanvasImage: res.path
        })
      }
    })
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/theNewActivity/theNewActivity'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.downloadFile({
          url: res.data,
          success: function (data) {
            that.setData({
              canvasImg2: data.tempFilePath
            })
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: "有趣的经典又不失童稚的风采 许你一夏天的精致优雅 ~",
      path: 'pages/theNewActivity/theNewActivity',
      success: function (res) {
        that.setData({
          actionSheetHidden: true
        })
      },
    }
  },
  getActive: function () {
    var that = this;
    wx.request({
      url: app.api.getActiveFlag,
      success: function (res) {
        if (res.data.status == 2000) {
          if (res.data.data.flag) {
            that.setData({
              hiGoFlag: true
            })
          } else {
            that.setData({
              hiGoFlag: false
            })
          }
        }
      }
    })
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        flag: false
      })
    }, 2000)
  },
  shareList: function () {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
  },
  disapper: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag
    if (!flag) {
      that.setData({
        flag: true
      })
    } else {
      that.setData({
        flag: false
      })
    }
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  bindItemTap: function () {
    var that = this;
    const timer = setInterval(function () {
      if (that.data.canvasImg2 == "") {

      } else {
        clearInterval(timer)
        that.setData({
          actionSheetHidden: true,
          spuCanvas: false,
        })
        const ctx = wx.createCanvasContext('spuCanvas');
        const grd = ctx.createLinearGradient(0, 0, 280, 430)
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#ffffff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, 280, 430)
        ctx.setFillStyle("black")
        ctx.drawImage(that.data.spuCanvasImage, 0, 0, 280, 280)
        ctx.drawImage(that.data.canvasImg2, 100, 300, 80, 80)
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 400)
        ctx.save()
        ctx.draw()
      }
    }, 500)
  },
  cancelSpuCanvasImg: function () {
    var that = this;
    that.setData({
      actionSheetHidden: true,
      spuCanvas: true,
    })
  },
  saveSpuCanvasImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 280,
      height: 430,
      destWidth: 560,
      destHeight: 860,
      quality: "1",
      fileType: "png",
      canvasId: 'spuCanvas',
      success: function (res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function () {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                wx.showToast({
                  title: '保存成功',
                })
                that.setData({
                  actionSheetHidden: true,
                  spuCanvas: true,
                  isScorll: "auto"
                })
              },
              fail: function (res) {
                wx.showToast({
                  title: '保存失败',
                })
              }
            })
          },
          fail: function (res) {
            wx.showLoading({
              title: res,
            })
          }
        })
      }
    })
  },
  go: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    switch (id) {
      case "1":
        that.setData({
          toView: 'inToViewA'
        })
        break;
      case "2":
        that.setData({
          toView: 'inToViewB'
        })
        break;
      case "3":
        that.setData({
          toView: 'inToViewC'
        })
        break;
      case "4":
        that.setData({
          toView: 'inToViewD'
        })
        break;
      case "5":
        that.setData({
          toView: 'inToViewE'
        })
        break;
      case "6":
        that.setData({
          toView: 'inToViewF'
        })
        break;
      case "7":
        that.setData({
          toView: 'inToViewG'
        })
        break;
    }
  },
  goIndex:function(){
    wx.switchTab({
      url: '../home/index',
    })
  },
  goSpecial:function(e){
    var pageCome = e.currentTarget.dataset.come;
    var specialId = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    if (timeStamp > time){
      wx.navigateTo({
        url: '../newStyle/newStyle?specialId=' + specialId+'&pageCome='+ pageCome,
      })
    }else{
      wx.showToast({
        title: '敬请期待',
      })
    }
  },
  goNew:function(){
    wx.showToast({
      title: '敬请期待',
    })
  },
  goBobo:function(e){
    var pageCome = e.currentTarget.dataset.come;
    var specialId = e.currentTarget.dataset.id;
    var time = e.currentTarget.dataset.time;
    var timeStamp = Math.round(new Date().getTime() / 1000);
    if (timeStamp > time) {
      wx.navigateTo({
        url: '../newStyle/newStyle?specialId=' + specialId + '&pageCome=' + pageCome,
      })
    } else {
      wx.navigateTo({
        url: '../brandBoBo/brandBoBo',
      })
    }
  }
})