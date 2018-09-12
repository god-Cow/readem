var app = getApp()
Page({
  data: {
    groupId:"",
    orderSn:"",
    groupCode:"",
    countDownHour: 0, //倒计时
    countDownMinute: 0,
    countDownSecond: 0,
    spuCanvas: true, //卡片开关
  },
  onLoad:function(options){
    var that = this;
    that.setData({
      token: wx.getStorageSync("token"),
      phoneType: wx.getStorageSync("phoneType")
    })
    var path = options.path;
    var scene = decodeURIComponent(options.scene)
    if (path != null && path != "" && path != undefined) {
      that.setData({
        groupId: path.split("_")[0],
        orderSn: path.split("_")[1],
      })
      that.getList()
    }
    if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
      wx.request({
        url: app.api.changeUrl,
        data: {
          id: scene
        },
        success: function (res) {
          if (res.data != null) {
            var qrCodePath = res.data;
            qrCodePath = qrCodePath.substring(5);
            that.setData({
              groupId: qrCodePath.split("_")[0],
              orderSn: qrCodePath.split("_")[1],
            })
            that.getList()
          }
        }
      })
    }
  },
  getList:function(){
    var that = this;
    wx.request({
      url: app.api.getOrderParcelInfoByOrderSn,
      data: {
        orderSn: that.data.orderSn,
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6"
      },
      success: function (res) {
        console.info(res)
        if (res.data.status == 2000) {
          var spuId = res.data.data[0].list[0].spuId;
          wx.request({
            url: app.api.getGoodsDetail,
            data: {
              spuId: spuId
            },
            success: function (res) {
              if (res.data.status == 2000) {
                that.setData({
                  shopInfo: res.data.data.categorySaleGoodsResult,
                  spuId: spuId
                })
                wx.getImageInfo({
                  src: that.data.shopInfo.imgs[0],
                  success: function (res) {
                    that.setData({
                      spuCanvasImage: res.path
                    })
                  }
                })
                wx.request({
                  url: app.api.getMemberIsIntroducer,
                  data: {
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    channel: 6,
                  },
                  success: function (res) {
                    if (res.data.status == 2000) {
                      if (res.data.data.outcome == false) {
                        that.setData({
                          groupCode: ""
                        })
                        that.showLmg("");
                      } else {
                        if (res.data.data.introducer.status == 2) {
                          that.setData({
                            groupCode: res.data.data.introducer.introduceCode
                          })
                          that.showLmg(that.data.groupCode);
                        } else {
                          that.setData({
                            groupCode: ""
                          })
                          that.showLmg("");
                        }
                      }
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    wx.request({
      url: app.api.getGroupInfo,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: that.data.groupId,
        activeId: "",
        groupType: "4",
        activeStatus: "1",
      },
      dataType: "json",
      method: "GET",
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            time: data.data.data.endTime,
            groupNumber: parseInt(2) - parseInt(data.data.data.number),
            status: data.data.data.status,
          })
          that.getData()
        }
      }
    })
  },
  getData: function () {
    var that = this;
    var interval = setInterval(function () {
      var totalSecond = that.data.time - Date.parse(new Date()) / 1000;
      var day = Math.floor(totalSecond / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      var hr = Math.floor((totalSecond - Math.floor(totalSecond / 3600 / 24) * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      var min = Math.floor((totalSecond - Math.floor(totalSecond / 3600 / 24) * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      var sec = totalSecond - Math.floor(totalSecond / 3600 / 24) * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      that.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      if (totalSecond < 0) {
        that.setData({
          countDownDay: "0",
          countDownHour: '0',
          countDownMinute: '0',
          countDownSecond: '0',
        });
      }
    }.bind(this), 1000);
  },
  goIndex:function(){
    wx.switchTab({
      url: '../home/index',
      success:function(){
        var page = getCurrentPages().pop();
        if(page == undefined || page == null) return;
        page.onLoad()
      }
    })
  },
  goOrderSn:function(){
    var that = this;
    wx.navigateTo({
      url: '../orderInfo/orderInfo?orderId=' + that.data.orderSn,
    })
  },
  onShareAppMessage:function(){
    var that = this;
    return {
      title: that.data.shopInfo.goodsName,
      path: 'pages/shareGroupOrder/shareGroupOrder?path=' + that.data.groupId + "_" + that.data.spuId + "_" + that.data.groupCode,
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          },
        });
      },
      fail: function (res) {
      }
    }
  },
  showLmg:function(d){
    var that = this;
    var groupCode = d;
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/shareGroupOrder/shareGroupOrder?path=' + that.data.groupId + "_" + that.data.spuId + "_" + groupCode
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
              canvasImg1: data.tempFilePath
            })
          }
        })
      }
    })
  },
  pictureShare:function(){
    var that = this;
    var title = that.data.shopInfo.goodsName;
    if (/^[\u4e00-\u9fa5]/.test(title)) {
      if (title.length > 20) {
        title = title.substring(0, 20) + "..."
      }
    } else {
      if (title.length > 40) {
        title = title.substring(0, 40) + "..."
      }
    }
    const timer = setInterval(function () {
      if (that.data.canvasImg1 == "") {

      } else {
        clearInterval(timer)
        that.setData({
          spuCanvas: false,
        })
        const ctx = wx.createCanvasContext('spuCanvas');
        const grd = ctx.createLinearGradient(0, 0, 280, 400)
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#ffffff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, 280, 400)
        ctx.setFillStyle("black")
        ctx.drawImage(that.data.spuCanvasImage, 80, 20, 120, 120)
        ctx.setFontSize(12)
        ctx.setTextAlign('center')
        ctx.fillText(that.data.shopInfo.brandName, 140, 150)
        ctx.setTextAlign('center')
        ctx.fillText(title, 140, 180)
        ctx.setTextAlign('center')
        ctx.fillText("原价:¥" + that.data.shopInfo.salePrice + "  拼团价:¥" + that.data.shopInfo.doubleGroupDiscount, 140, 210)
        ctx.drawImage(that.data.canvasImg1, 80, 240, 120, 120)
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 380)
        ctx.save()
        ctx.draw()
      }
    }, 500)
  },
  cancelSpuCanvasImg: function () {
    var that = this;
    that.setData({
      spuCanvas: true,
    })
  },
  saveSpuCanvasImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 280,
      height: 400,
      destWidth: 560,
      destHeight: 800,
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
})