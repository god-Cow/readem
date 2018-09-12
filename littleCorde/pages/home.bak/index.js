var app = getApp();
app.aldstat.sendEvent('onLoad');
app.aldstat.sendEvent('onShareAppMessage');
app.aldstat.sendEvent('goDetail');
Page({
  data: {
    isShowToast: false,
    buyNumber: "0",
    shareImgUrl: '',
    isScorll: "auto",
    countDownDay: 0,
    countDownHour: 0, //倒计时
    countDownMinute: 0,
    countDownSecond: 0,
    time: "0",  //拼单结束时间
    dbGroupBookingFlag: true, //用户有没有团
    discountRate: "",
    noGroupSamll: "none",
    noGroupbig: "none",
    yesGroupSamll: "none",
    yesGroupbig: "none",
    newActiveFlag: true,
    tips: "none",
    groupCode: "",
    goActiveSpecial: true,
    getHeadHomePage: [],
    homeTips2: "",
    homeTipsUrl: "",
    homeTips: "none",
    arr1: [],
    arr2: [],
    loginBgFlag: false,
  },
  onLoad: function (options) {
    var that = this;
    app._dgt.trackEvent('onLoad');
    app._dgt.trackEvent('onShareAppMessage');
    app._dgt.trackEvent('goDetail');
    app._dgt.trackEvent('getLogin');
    that.updateManager()
    if (options == undefined) {
      that.getLogin()
    } else {
      if (JSON.stringify(options) == "{}") {
        that.getLogin()
      } else {
        var scene = decodeURIComponent(options.scene)
        if (scene != null && scene != "" && scene != undefined && scene != "undefined"){
          wx.request({
            url: app.api.changeUrl,
            data: {
              id: scene
            },
            success: function (res) {
              if (res.data != null) {
                var qrCodePath = res.data;
                console.info(qrCodePath)
                console.info(qrCodePath.split("&")[0].split("=")[1])
                console.info(qrCodePath.split("&")[1].split("=")[1])
                console.info(qrCodePath.split("&")[2].split("=")[1])
                that.setData({
                  groupCode: qrCodePath.split("&")[0].split("=")[1],
                  pageCome: qrCodePath.split("&")[1].split("=")[1],
                  groupId: qrCodePath.split("&")[2].split("=")[1],
                })
                that.getLogin()
              }
            }
          })
        }else{
          if (options.groupCode == undefined){
          } else {
            that.setData({
              groupCode: options.groupCode,
            })
          }
          if (options.pageCome == undefined) {
          } else {
            that.setData({
              pageCome: options.pageCome,
            })
          }
          if (options.groupId == undefined) {
          } else {
            that.setData({
              groupId: options.groupId,
            })
          }
          that.getLogin()
        }
      }
    }
    wx.request({
      url: app.api.getHomePageAdvertisement,
      success: function (res) {
        if (res.data.status == 2000) {
          if (res.data.data.note != null && res.data.data.note != "") {
            that.setData({
              homeTips: "block",
              homeTips2: res.data.data.note.split(",")[0],
              homeTipsUrl: res.data.data.note.split(",")[1]
            })
          } else {
            that.setData({
              homeTips: "none",
            })
          }
        }
      }
    })
    wx.getImageInfo({
      src: 'https://img1.cloudokids.cn/buyers/scene/spuCanvas1.png',
      success: function (res) {
        that.setData({
          canvasImg1: res.path
        })
      }
    })
    wx.getImageInfo({
      src: 'https://img3.cloudokids.cn/h5img/scene/cloudoBanner.jpg',
      success: function (res) {
        that.setData({
          canvasImg2: res.path
        })
      }
    })
    wx.request({
      url: app.api.getHeadHomePage,
      data: {
        state: 0,
        display: 6
      },
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            getHeadHomePage: res.data.data
          })
        }
      }
    })
  },
  getLogin:function(){
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: function (r) {
              var code = r.code;//登录凭证
              if (code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function (res) {
                    that.setData({
                      userInfo: res.userInfo
                    });
                    app.globalData.userInfo = res.userInfo;
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    that.getUserInfoLogin(res.encryptedData, res.iv, code)
                  }
                })
              }
            }
          });
        } else {
          that.setData({
            loginBgFlag: true
          })
        }
      }
    })
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  onShareAppMessage: function (options) {
    var that = this;
    app.tdsdk.customShare(options)
    if (options.from == "menu") {
      return {
        title: 'cloudo棵朵童装',
        path: 'pages/home/index',
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
    } else {
      return {
        title: 'cloudo棵朵童装',
        path: 'pages/home/index?pageCome=2&groupId=' + that.data.groupId + '&groupCode=' + that.data.groupCode,
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
    }
  },
  onPullDownRefresh: function () {
    this.onLoad();
    this.onShow();
    wx.stopPullDownRefresh()
  },
  submit: function (e) {
    var that = this;
    var formId = e.detail.formId;
    if (formId != null && formId != undefined && formId != "" && formId != "the formId is a mock one") {
      wx.request({
        url: app.api.addWXFormId,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: "6",
          formId: formId
        },
        success: function (res) { }
      })
    }
  },
  showToast: function () {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭  
    setTimeout(function () {
      _this.setData({
        isShowToast: false
      });
    }, _this.data.count);
  },
  goGroupSpecial: function () {
    wx.navigateTo({
      url: '../shareTheBill/shareTheBill?currentTab=0',
    })
  },
  noGroupbig: function () {
    this.setData({
      noGroupSamll: "block",
      noGroupbig: "none",
      yesGroupSamll: "none",
      yesGroupbig: "none",
      newActiveFlag: false,
    })
  },
  noGroupSamll: function () {
    this.setData({
      noGroupSamll: "none",
      noGroupbig: "block",
      yesGroupSamll: "none",
      yesGroupbig: "none",
      newActiveFlag: false,
    })
  },
  yesGroupSamll: function () {
    this.setData({
      noGroupSamll: "none",
      noGroupbig: "none",
      yesGroupSamll: "none",
      yesGroupbig: "block",
      newActiveFlag: false,
    })
  },
  yesGroupbig: function () {
    this.setData({
      noGroupSamll: "none",
      noGroupbig: "none",
      yesGroupSamll: "block",
      yesGroupbig: "none",
      newActiveFlag: false,
    })
  },
  creatGroup: function () {
    var that = this;
    wx.request({
      url: app.api.insertGroupBooking,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        activityId: "65",
        type: "1"
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 2000) {
          that.getNewData()
        } else {
          that.setData({
            count: 1500,
            toastText: res.data.msg
          });
          that.showToast();
        }
      }
    })
  },
  getNewData: function () {
    var that = this;
    wx.request({
      url: app.api.getGroupInfo,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: "",
        activeId: "65",
        groupType: "1",
        activeStatus: "1"
      },
      dataType: "json",
      method: "GET",
      success: function (result) {
        if (result.data.status == 2000) {
          that.setData({
            time: result.data.data.endTime,
            groupCount1: result.data.data.totalMoney,
            groupCount: result.data.data.number,
            balanceMoney: result.data.data.balanceMoney,
            groupNumber: result.data.data.groupSn,
            groupId: result.data.data.id,
            lastModifyTime: result.data.data.lastModifyTime,
            totalMoney: result.data.data.totalMoney,
            dbGroupBookingFlag: true,
            noGroupSamll: "none",
            noGroupbig: "none",
            yesGroupSamll: "none",
            yesGroupbig: "block",
            newActiveFlag: false,
          })
          that.getData()
        }
        if (result.data.status == 5005) {
          that.setData({
            dbGroupBookingFlag: true,
            newActiveFlag: true,
            noGroupSamll: "none",
            noGroupbig: "none",
            yesGroupSamll: "none",
            yesGroupbig: "none",
          })
        }
        if (result.data.status != 5005 && result.data.status != 2000) {
          that.setData({
            dbGroupBookingFlag: true,
            newActiveFlag: false,
            noGroupSamll: "none",
            noGroupbig: "block",
            yesGroupSamll: "none",
            yesGroupbig: "none",
          })
        }
      }
    })
  },
  tipsIn: function () {
    var that = this;
    that.setData({
      tips: "block"
    })
  },
  tipsDel: function () {
    var that = this;
    that.setData({
      tips: "none"
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
        clearInterval(interval)
        that.getNewData()
      }
    }.bind(this), 1000);
  },
  bindItemTap: function () {
    var that = this;
    that.getShowLmg(that.data.groupCode, that.data.groupId);
    const timer = setInterval(function () {
      if (that.data.shareImgUrl == "") {

      } else {
        clearInterval(timer)
        that.setData({
          actionSheetHidden: true,
          imgFlag: true
        })
        const ctx = wx.createCanvasContext('spuCanvas');
        const grd = ctx.createLinearGradient(0, 0, 280, 400)
        if (that.data.groupId != null && that.data.groupId != "") {
          wx.getImageInfo({
            src: that.data.shareImgUrl,
            success: function (res) {
              grd.addColorStop(0, '#ffffff')
              grd.addColorStop(1, '#ffffff')
              ctx.setFillStyle(grd)
              ctx.fillRect(0, 0, 280, 400)
              ctx.setFillStyle("black")
              ctx.drawImage(that.data.canvasImg1, 56, 0, 168, 90)
              ctx.drawImage(that.data.canvasImg2, 40, 80, 200, 120)
              ctx.setFontSize(16)
              ctx.setTextAlign('center')
              ctx.fillText(that.data.description, 140, 230)
              ctx.setFontSize(12)
              ctx.setTextAlign('center')
              ctx.fillText("拼单编号:" + that.data.groupNumber, 140, 260)
              ctx.drawImage(res.path, 95, 270, 90, 90)
              ctx.setFontSize(10)
              ctx.setTextAlign('center')
              ctx.fillText("长按扫码查看详情", 140, 380)
              ctx.save()
              ctx.draw()
            }
          })
        } else {
          wx.getImageInfo({
            src: that.data.shareImgUrl,
            success: function (res) {
              grd.addColorStop(0, '#ffffff')
              grd.addColorStop(1, '#ffffff')
              ctx.setFillStyle(grd)
              ctx.fillRect(0, 0, 280, 400)
              ctx.setFillStyle("black")
              ctx.drawImage(that.data.canvasImg1, 56, 0, 168, 90)
              ctx.drawImage(that.data.canvasImg2, 40, 80, 200, 120)
              ctx.setFontSize(16)
              ctx.setTextAlign('center')
              ctx.fillText(that.data.description, 140, 250)
              ctx.drawImage(res.path, 95, 270, 90, 90)
              ctx.setFontSize(10)
              ctx.setTextAlign('center')
              ctx.fillText("长按扫码查看详情", 140, 380)
              ctx.save()
              ctx.draw()
            }
          })
        }
      }
    }, 500)
  },
  getShowLmg: function (groupCode, groupId) {
    var that = this;
    var groupCode = groupCode;
    var groupId = groupId;
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/home/index?groupCode=' + groupCode + '&pageCome=2&groupId=' + groupId
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.getImageInfo({
          src: res.data,
          success: function (result) {
            that.setData({
              shareImgUrl: result.path,
            })
          }
        })
      }
    })
  },
  delShare: function () {
    var that = this;
    that.setData({
      actionSheetHidden: true,
      imgFlag: false
    })
  },
  saveShare: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 280,
      height: 420,
      destWidth: 560,
      destHeight: 840,
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
                  imgFlag: false
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
  goActiveSpecial: function () {
    wx.navigateTo({
      url: '../activeSpecial/activeSpecial',
    })
  },
  goSearch: function () {
    wx.navigateTo({
      url: '../search/index',
    })
  },
  delHomeTips: function () {
    var that = this;
    that.setData({
      homeTips: "none"
    })
  },
  homeTipsUrl: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url != null && url != "") {
      wx.navigateTo({
        url: url,
      })
    }
  },
  goSpecial: function (e) {
    wx.navigateTo({
      url: '../newStyle/newStyle?specialId=' + e.currentTarget.dataset.special + '&specialTopicId=' + e.currentTarget.dataset.specialtopicid + '&title=' + e.currentTarget.dataset.title + '&pageCome=1'
    })
  },
  getWeekData:function() {
    var that = this;
    var arr1 = [], arr2 = [], arr3 = [], arr4 = [], arr5 = [], arr6 = [];
    that.setData({
      arr2: [],
      sku:[]
    })
    wx.request({
      url: app.api.weekNew,
      data: {
        status: 0,
        display: 6
      },
      success: function (res) {
        if (res.data.status == 2000) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].type == 16) {
              arr1.push(res.data.data[i])
            }
            if (res.data.data[i].type == 17) {
              arr2.push(res.data.data[i])
            }
            if (res.data.data[i].type == 18) {
              arr3.push(res.data.data[i])
            }
            if (res.data.data[i].type == 11) {
              arr4.push(res.data.data[i])
            }
          }
          that.setData({
            iconList: arr1,
            special: arr2,
            hasSpecial: arr4,
            arr1: arr3
          })
          if (arr3.length > 0) {
            for (var a = 0; a < arr3.length; a++) {
              wx.request({
                url: app.api.favoriteBySpuIdAndMemberIdForMini,
                data: {
                  token: that.data.token,
                  phonetype: that.data.phoneType,
                  channel: "6",
                  spuId: arr3[a].goodsResult[0].spuId
                },
                success: function (res) {
                  if (res.data.status == 2000) {
                    that.data.arr2.push(res.data.data)
                    that.setData({
                      arr2: that.data.arr2
                    })
                    if (that.data.arr1.length == that.data.arr2.length) {
                      for (var b = 0; b < that.data.arr1.length; b++) {
                        for (var c = 0; c < that.data.arr2.length; c++) {
                          if (that.data.arr1[b].goodsResult[0].spuId == that.data.arr2[c].spuId) {
                            var obj = new Object();
                            obj.img = that.data.arr1[b].img;
                            obj.title = that.data.arr1[b].title;
                            obj.description = that.data.arr1[b].description;
                            obj.salePrice = that.data.arr1[b].goodsResult[0].salePrice;
                            obj.islike = that.data.arr2[c].flag;
                            obj.spuId = that.data.arr2[c].spuId;
                            arr6.push(obj)
                          }
                        }
                      }
                      that.setData({
                        sku: arr6
                      })
                    }
                  }
                }
              })
            }
          }
        }
      }
    })
  },
  collect: function (e) {
    var that = this;
    var islike = e.currentTarget.dataset.islike;
    var spuId = e.currentTarget.dataset.spuid;
    if (!islike) {
      wx.request({
        url: app.api.addFavorite,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          SPUId: spuId,
          channel: 6
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            that.setData({
              count: 1500,
              toastText: "收藏成功！"
            });
            that.showToast();
            that.data.sku.forEach(function (v, i) {
              if (spuId == v.spuId) {
                v.islike = !islike
              }
            })
            that.setData({
              sku: that.data.sku
            })
          } else {
            that.setData({
              count: 1500,
              toastText: res.data.msg
            });
            that.showToast();
          }
        }
      })
    } else {
      wx.request({
        url: app.api.deleteFavorite,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          SPUId: spuId,
          channel: 6
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            that.setData({
              count: 1500,
              toastText: "删除收藏成功！"
            });
            that.showToast();
            that.data.sku.forEach(function (v, i) {
              if (spuId == v.spuId) {
                v.islike = !islike
              }
            })
            that.setData({
              sku: that.data.sku
            })
          } else {
            that.setData({
              count: 1500,
              toastText: res.data.msg
            });
            that.showToast();
          }
        }
      })
    }
  },
  delHomeTips: function () {
    var that = this;
    that.setData({
      homeTips: "none"
    })
  },
  homeTipsUrl: function (e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    if (url != null && url != "") {
      wx.navigateTo({
        url: url,
      })
    }
  },
  updateManager:function(){
    var that = this;
    if (wx.getUpdateManager){
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getUserInfoLogin: function (encryptedData,iv,code){
    var that = this;
    wx.request({
      url: app.api.weChatAppletLogin,//自己的服务接口地址
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: code,
      },
      success: function (data) {
        if (data.data.status == 2000) {
          var token = data.data.data.token;
          var phoneType = data.data.data.phonetype;
          var memberId = data.data.data.userInfo.id;
          that.setData({
            token: token,
            phoneType: phoneType,
            memberId: memberId,
            loginBgFlag:false
          });
          wx.setStorageSync('token', token);
          wx.setStorageSync('phoneType', phoneType);
          wx.setStorageSync('memberId', memberId);
          app.globalData.isBind = data.data.data.isBind;
          that.getWeekData()
          that.getActive()
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
                } else {
                  if (res.data.data.introducer.status == 2) {
                    that.setData({
                      groupCode: res.data.data.introducer.introduceCode
                    })
                  } else {
                    that.setData({
                      groupCode: ""
                    })
                  }
                }
              }
            }
          })
          wx.request({
            url: app.api.getGroupBookingCondition,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: "6",
              activeId: "65",
              groupType: "1"
            },
            dataType: "json",
            method: "GET",
            success: function (res) {
              if (res.data.status == 2000) {
                //全场
                if (res.data.data != null) {
                  that.setData({
                    description: res.data.data.description,
                    skipUrl: res.data.data.skipUrl,
                    goActiveSpecial: true
                  })
                  that.getNewData()
                } else {
                  //不是全场
                  that.setData({
                    noGroupSamll: "none",
                    noGroupbig: "none",
                    yesGroupSamll: "none",
                    yesGroupbig: "none",
                  })
                  wx.request({
                    url: app.api.getValidSpecialList,
                    success: function (res) {
                      if (res.data.status == 2000) {
                        if (res.data.data.length > 0) {
                          that.setData({
                            goActiveSpecial: false
                          })
                        } else {
                          that.setData({
                            goActiveSpecial: true
                          })
                        }
                      }
                    }
                  })
                  wx.request({
                    url: app.api.getGroupList,
                    data: {
                      token: that.data.token,
                      phonetype: that.data.phoneType,
                      channel: 6,
                      status: "1",
                      activeStatus: '1'
                    },
                    success: function (res) {
                      if (res.data.status == 2000) {
                        if (res.data.data.length > 0) {
                          that.setData({
                            dbGroupBookingFlag: false,
                            groupListLength: res.data.data.length,
                            noGroupSamll: "none",
                            noGroupbig: "none",
                            yesGroupSamll: "none",
                            yesGroupbig: "none",
                            newActiveFlag: false,
                          })
                        } else {
                          that.setData({
                            dbGroupBookingFlag: true,
                            newActiveFlag: true
                          })
                        }
                      }
                    }
                  })
                }
              }
            }
          })
          if (that.data.pageCome != null && that.data.pageCome != undefined) {
            wx.request({
              url: app.api.bindMemberIntroduce,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: "6",
                introduceCode: that.data.groupCode
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                if (res.data.status == 2000) {

                }
              }
            })
            wx.request({
              url: app.api.joinGroupBooking,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: "6",
                groupId: that.data.groupId
              },
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (result) {
                if (result.data.status == 2000) {
                  that.setData({
                    count: 3000,
                    toastText: result.data.data,
                  });
                  that.showToast();
                  if (result.data.data == "拼单成功") {
                    wx.request({
                      url: app.api.getGroupInfo,
                      data: {
                        token: that.data.token,
                        phonetype: that.data.phoneType,
                        channel: "6",
                        groupId: that.data.groupId,
                        activeId: "65",
                        groupType: "1",
                        activeStatus: "1"
                      },
                      dataType: "json",
                      method: "GET",
                      success: function (data) {
                        if (data.data.status == 2000) {
                          that.setData({
                            time: data.data.data.endTime,
                            groupCount1: data.data.data.totalMoney,
                            groupCount: data.data.data.number,
                            balanceMoney: data.data.data.balanceMoney,
                            groupNumber: data.data.data.groupSn,
                            noGroupSamll: "none",
                            noGroupbig: "none",
                            yesGroupSamll: "none",
                            yesGroupbig: "block",
                            groupId: data.data.data.id,
                            lastModifyTime: data.data.data.lastModifyTime,
                            totalMoney: data.data.data.totalMoney
                          })
                          that.getData()
                        }
                      }
                    })
                  } else {
                    that.getNewData()
                  }
                } else {
                  that.setData({
                    count: 3000,
                    toastText: result.data.msg,
                  });
                  that.showToast();
                }
              }
            })
          }
        }
      },
      fail: function (res) {
      }
    })
  },
  bindGetUserInfo: function () {
    var that = this;
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.setData({
                userInfo: res.userInfo,
                loginBgFlag: false
              });
              app.globalData.userInfo = res.userInfo;
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              that.getUserInfoLogin(res.encryptedData, res.iv, code)
            }
          })
        }
      }
    });
  },
  getActive:function(){
    var that = this;
    wx.request({
      url: app.api.getActiveFlag,
      success:function(res){
        if(res.data.status == 2000){
          if(res.data.data.flag){
            if (app.globalData.three){
              if (res.data.data.wchaturl != null && res.data.data.wchaturl != ""){
                // wx.navigateTo({
                //   url: res.data.data.wchaturl,
                // })
                app.globalData.three = false
              }
            }else{

            }
          }else{
            
          }
        }
      }
    })
  }
})