var app = getApp();
var list = [];
var bargainId = "";
var loadMore = function (that, pageNumber, listflag) {
  var that = that;
  var n = pageNumber;
  var listflag = listflag;
  wx.request({
    url: app.api.bargainlistUrl,
    method: "GET",
    data: {
      pageNumber: pageNumber,
      pageSize: 10,
      token: that.data.token,
      phonetype: that.data.phoneType,
      channel: 6,
      bargainId: that.data.bargainId
    },
    success: function (data) {
      if (data.data.status == 2000) {
        list = that.data.buyerData;
        if (data.data.data.data.length < 10) {
          that.setData({
            flag2: false
          })
        }
        for (var i = 0; i < data.data.data.data.length; i++) {
          list.push(data.data.data.data[i])
        }
        that.setData({
          buyerData: list,
        });
      }
      that.setData({
        pageNumber: that.data.pageNumber++
      })
    }
  });
}
Page({
  data: {
    measureSize: 8,
    spuId: "",
    goodsData: {},
    getGoodsSkuBySpuId: [],
    display: "none",
    token: "",
    phoneType: "",
    bargainId: "",
    memberId: "",
    cartBtnNumber: "",
    msg: "",
    goodsCost: "",
    disabled: true,
    record: {},
    left: "",
    time: "",
    pageNumber: "1",
    buyerData: [],
    flag: true,
    flag2: true,
    showView: false,
    code: "",
    listflag: true,
    scaleplate: "",
    scaleplate2: "",
    scaleplate3: "",
    bargainMoney: "",
    lists: [],
    shadedisply: "none",
    sharedivShow: false,
    ispastdue: "",
    endTime: "",
    country: "",//国内外
    moreSizeCountryPoint: "",
  },
  onLoad: function (options) {
    var that = this;
    if (options.bargainId != undefined && options.bargainId != null && options.bargainId != "") {
      that.setData({
        bargainId: options.bargainId,
      });
    }
  },
  onReady: function () {
  },
  onShow: function () {
    var that = this;
    that.setData({
      disabled: true,
      flag2: true,
      pageNumber: 1,
      buyerData: [],
      flag: true,
      endTime: "",
      record:{},
      time:""
    })
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId: res.data,
        });
        wx.getStorage({
          key: 'token',
          success: function (res) {
            that.setData({
              token: res.data
            });
            wx.getStorage({
              key: 'phoneType',
              success: function (res) {
                that.setData({
                  phoneType: res.data,
                });
              },
            })
          },
        })
      }
    });
    if (that.data.token == "" || that.data.token == null || that.data.token == undefined || that.data.phoneType == "" || that.data.phoneType == null || that.data.phoneType == undefined) {
      wx.login({
        success: function (r) {
          var code = r.code;//登录凭证
          if (code) {
            //2、调用获取用户信息接口
            wx.getUserInfo({
              success: function (res) {
                that.setData({
                  userInfo: res.userInfo
                });
                // 3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                wx.request({
                  url: app.api.weChatAppletLogin,//自己的服务接口地址
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    code: code,
                    // type: 2,
                  },
                  success: function (data) {
                    if (data.data.status == 2000) {
                      var token = data.data.data.token;
                      var phoneType = data.data.data.phonetype;
                      var memberId = data.data.data.userInfo.id;
                      that.setData({
                        token: token,
                        phoneType: phoneType,
                        memberId: memberId
                      });
                      wx.setStorageSync('token', token);
                      wx.setStorageSync('phoneType', phoneType);
                      wx.setStorageSync('memberId', memberId);
                      app.globalData.isBind = data.data.data.isBind;
                      loadMore(that, that.data.pageNumber);
                      if (that.data.bargainId != undefined && that.data.bargainId != null && that.data.bargainId != "") {
                        that.ispastdue();
                        if (that.data.ispastdue === false) {
                          wx.request({
                            url: app.api.rangeUrl,
                            data: {
                              token: that.data.token,
                              phonetype: that.data.phoneType,
                              channel: 6
                            },
                            method: "GET",
                            success: function (data) {
                              if (data.data.status == 2000) {
                                if (data.data.data.flag === false) {
                                  that.setData({
                                    bargainId: data.data.data.bargainId
                                  });
                                }
                                var scaleplate = (10 - data.data.data.lowestDis) / 4;
                                that.setData({
                                  scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                                  scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                                  scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                                  endTime: data.data.data.endTime
                                });
                                if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                                  var i = setInterval(function () {
                                    var timestamp = Date.parse(new Date());
                                    var times = timestamp / 1000;
                                    if (that.data.endTime <= times) {
                                      that.ispastdue();
                                      if (that.data.ispastdue === false) {
                                        clearTimeout(i);
                                        that.setData({
                                          bargainId: ""
                                        });
                                        that.onShow();
                                      }
                                    }
                                    var time = that.data.endTime - times;
                                    var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                                    var hours = hours1 > 9 ? hours1 : "0" + hours1;
                                    var minutes1 = parseInt(time / 60) % 60;
                                    var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                                    var seconds1 = time % 60;
                                    var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                                    var timedata = hours + ":" + minutes + ":" + seconds;
                                    that.setData({
                                      time: timedata
                                    });
                                  }, 1000);

                                };
                                that.setData({
                                  record: data.data.data,
                                  left: 550 * data.data.data.plan / 100 + 100 - 30
                                });
                              }
                            }
                          });
                        } else {
                          wx.request({
                            url: app.api.rangeUrl,
                            data: {
                              token: that.data.token,
                              phonetype: that.data.phoneType,
                              channel: 6,
                              bargainId: that.data.bargainId
                            },
                            method: "GET",
                            success: function (data) {
                              if (data.data.status == 2000) {
                                var scaleplate = (10 - data.data.data.lowestDis) / 4;
                                that.setData({
                                  scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                                  scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                                  scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                                  endTime: data.data.data.endTime
                                });
                                that.setData({
                                  record: data.data.data,
                                  left: 550 * data.data.data.plan / 100 + 100 - 30
                                });
                                if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                                  var i = setInterval(function () {
                                    var timestamp = Date.parse(new Date());
                                    var times = timestamp / 1000;
                                    if (that.data.endTime <= times) {
                                      that.ispastdue();
                                      if (that.data.ispastdue === false) {
                                        clearTimeout(i);
                                        that.setData({
                                          bargainId: ""
                                        });
                                        that.onShow();
                                      }
                                    }
                                    var time = that.data.endTime - times;
                                    var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                                    var hours = hours1 > 9 ? hours1 : "0" + hours1;
                                    var minutes1 = parseInt(time / 60) % 60;
                                    var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                                    var seconds1 = time % 60;
                                    var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                                    var timedata = hours + ":" + minutes + ":" + seconds;
                                    that.setData({
                                      time: timedata
                                    });
                                  }, 1000)
                                }
                              }
                            }
                          });
                        }

                      } else {
                        wx.request({
                          url: app.api.rangeUrl,
                          data: {
                            token: that.data.token,
                            phonetype: that.data.phoneType,
                            channel: 6
                          },
                          method: "GET",
                          success: function (data) {
                            if (data.data.status == 2000) {
                              if (data.data.data.flag === false) {
                                that.setData({
                                  bargainId: data.data.data.bargainId
                                });
                              }
                              var scaleplate = (10 - data.data.data.lowestDis) / 4;
                              that.setData({
                                scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                                scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                                scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                                endTime: data.data.data.endTime
                              });
                              if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                                var i = setInterval(function () {
                                  var timestamp = Date.parse(new Date());
                                  var times = timestamp / 1000;
                                  if (that.data.endTime <= times) {
                                    that.ispastdue();
                                    if (that.data.ispastdue === false) {
                                      clearTimeout(i);
                                      that.setData({
                                        bargainId: ""
                                      });
                                      that.onShow();
                                    }
                                  }
                                  var time = data.data.data.endTime - times;
                                  var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                                  var hours = hours1 > 9 ? hours1 : "0" + hours1;
                                  var minutes1 = parseInt(time / 60) % 60;
                                  var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                                  var seconds1 = time % 60;
                                  var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                                  var timedata = hours + ":" + minutes + ":" + seconds;
                                  that.setData({
                                    time: timedata
                                  });
                                }, 1000);

                              };
                              that.setData({
                                record: data.data.data,
                                left: 550 * data.data.data.plan / 100 + 100 - 30
                              });
                            }
                          }
                        });
                      }
                    }
                  },
                  fail: function (res) {
                  },
                })
              },
              fail: function () {
                wx.showModal({
                  title: '警告',
                  content: '您点击了拒绝授权，若部分功能无法正常体验。请删除小程序重新进入。',
                  success: function (res) {
                    if (res.confirm) {
                    }
                  }
                })
              }
            })
          } else {
          }
        },
        fail: function () {
        },

      });
    } else {
      loadMore(that, that.data.pageNumber);
      if (that.data.bargainId != undefined && that.data.bargainId != null && that.data.bargainId != "") {
        that.ispastdue();
        if (that.data.ispastdue === false) {
          wx.request({
            url: app.api.rangeUrl,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6
            },
            method: "GET",
            success: function (data) {
              if (data.data.status == 2000) {
                if (data.data.data.flag == false) {
                  that.setData({
                    bargainId: data.data.data.bargainId
                  });
                }
                var scaleplate = (10 - data.data.data.lowestDis) / 4;
                that.setData({
                  scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                  scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                  scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                  endTime: data.data.data.endTime
                });
                if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                  var i = setInterval(function () {
                    var timestamp = Date.parse(new Date());
                    var times = timestamp / 1000;
                    if (that.data.endTime <= times) {
                      that.ispastdue();
                      if (that.data.ispastdue === false) {
                        clearTimeout(i);
                        that.setData({
                          bargainId: ""
                        });
                        that.onShow();
                      }
                    }
                    var time = data.data.data.endTime - times;
                    var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                    var hours = hours1 > 9 ? hours1 : "0" + hours1;
                    var minutes1 = parseInt(time / 60) % 60;
                    var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                    var seconds1 = time % 60;
                    var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                    var timedata = hours + ":" + minutes + ":" + seconds;
                    that.setData({
                      time: timedata
                    });
                  }, 1000);


                }
                that.setData({
                  record: data.data.data,
                  left: 550 * data.data.data.plan / 100 + 100 - 30
                });
              }
            }
          });
        } else {
          wx.request({
            url: app.api.rangeUrl,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6,
              bargainId: that.data.bargainId
            },
            method: "GET",
            success: function (data) {
              if (data.data.status == 2000) {
                var scaleplate = (10 - data.data.data.lowestDis) / 4;
                that.setData({
                  scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                  scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                  scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                  endTime: data.data.data.endTime
                });
                if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                  var i = setInterval(function () {
                    var timestamp = Date.parse(new Date());
                    var times = timestamp / 1000;
                    if (that.data.endTime <= times) {
                      that.ispastdue();
                      if (that.data.ispastdue === false) {
                        clearTimeout(i);
                        that.setData({
                          bargainId: ""
                        });
                        that.onShow();
                      }
                    }
                    var time = that.data.endTime - times;
                    var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                    var hours = hours1 > 9 ? hours1 : "0" + hours1;
                    var minutes1 = parseInt(time / 60) % 60;
                    var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                    var seconds1 = time % 60;
                    var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                    var timedata = hours + ":" + minutes + ":" + seconds;
                    that.setData({
                      time: timedata
                    });
                  }, 1000)

                }
                that.setData({
                  record: data.data.data,
                  left: 550 * data.data.data.plan / 100 + 100 - 30
                });
              }
            }
          });
        }

      } else {
        wx.request({
          url: app.api.rangeUrl,
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6
          },
          method: "GET",
          success: function (data) {
            if (data.data.status == 2000) {
              if (data.data.data.flag == false) {
                that.setData({
                  bargainId: data.data.data.bargainId
                });
              }
              var scaleplate = (10 - data.data.data.lowestDis) / 4;
              that.setData({
                scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                endTime: data.data.data.endTime
              });
              if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                var i = setInterval(function () {
                  var timestamp = Date.parse(new Date());
                  var times = timestamp / 1000;
                  if (that.data.endTime <= times) {
                    that.ispastdue();
                    if (that.data.ispastdue === false) {
                      clearTimeout(i);
                      that.setData({
                        bargainId: ""
                      });
                      that.onShow();
                    }
                  }
                  var time = that.data.endTime - times;
                  var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                  var hours = hours1 > 9 ? hours1 : "0" + hours1;
                  var minutes1 = parseInt(time / 60) % 60;
                  var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                  var seconds1 = time % 60;
                  var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                  var timedata = hours + ":" + minutes + ":" + seconds;
                  that.setData({
                    time: timedata
                  });
                }, 1000);


              }
              that.setData({
                record: data.data.data,
                left: 550 * data.data.data.plan / 100 + 100 - 30
              });
            }
          }
        });
      }
    }
  },
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.onShow()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    var that = this;
    var pageNumber = ++that.data.pageNumber;
    if (that.data.flag2 == true) {
      loadMore(that, pageNumber);
    }
  },
  gobarginlist: function () {
    var that = this;
    if (that.data.bargainId != "" && that.data.bargainId != undefined && that.data.bargainId != null) {
      wx.navigateTo({
        url: '../barginlist/barginlist?bargainId=' + that.data.bargainId
      })
    }
    else {
      wx.navigateTo({
        url: '../barginlist/barginlist'
      })
    }
  },
  getGoodsSkuBySpuId: function () {
    var that = this;
    var spuId = that.data.spuId;
    wx.request({
      url: app.api.getGoodsSkuBySpuId,
      data: {
        spuId: spuId
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            getGoodsSkuBySpuId: []
          })
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.getGoodsSkuBySpuId.push({
              id: res.data.data[i].id,
              stock: res.data.data[i].stock,
              specificationValue: res.data.data[i].specificationValue,
              salePrice: res.data.data[i].salePrice,
              msg: res.data.data[i].msg,
              cartId: res.data.data[i].cartId,
              point: res.data.data[i].point,
              hidden: "none",
            })
          }
          that.setData({
            getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
          })
          if (that.data.display == "none") {
            that.setData({
              display: "block",
            })
          } else {
            that.setData({
              display: "none",
            })
          }
        }
      }
    })
  },
  disappear: function () {
    var that = this;
    that.setData({
      display: "none",
      disabled: true,
      cartBtnNumber: "",
      msg: "",
      country: "",
      moreSizeCountryPoint: ""
    })
  },
  selectSize: function (e) {
    var that = this;
    var stock = e.target.dataset.stock;
    var id = e.target.dataset.id;
    var flag = that.data.flag;
    var price = e.target.dataset.price;
    if (stock != 0) {
      that.setData({
        disabled: false
      })
      that.data.getGoodsSkuBySpuId.forEach(function (v, i) {
        if (v.id == id) {
          if (v.hidden == "none") {
            v.hidden = "block";
            that.setData({
              flag: false,
              goodsCost: price,
              msg: v.msg,
              country: v.cartId,
              moreSizeCountryPoint: v.point
            })
          } else {
            v.hidden = "none";
            that.setData({
              flag: true,
              disabled: true,
              goodsCost: that.data.salePrice,
              msg: "",
              country: "",
              moreSizeCountryPoint:""
            })
          }
        } else {
          v.hidden = "none";
        }
      })
      that.setData({
        getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
      })
    }
  },
  attention: function (e) {
    var that = this;
    var spuid = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.attentionUrl,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        spuId: spuid,
        channel: 6
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            flag2: true,
            pageNumber: 1,
            buyerData: []
          });
          loadMore(that, that.data.pageNumber);
          wx.showModal({
            title:"提示",
            content:'您关注的商品降价时，我们会第一时间通知您',
            showCancel:false,
            comfirmText:"确定",
            success: function (res) {
              if (res.confirm) {
              }
            }  
          })
        }
      }
    })
  },
  unfollow: function (e) {
    var that = this;
    var spuid = e.currentTarget.dataset.id;
    wx.request({
      url: app.api.unfollowUrl,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        spuId: spuid,
        channel: 6
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            flag2: true,
            pageNumber: 1,
            buyerData: []
          });
          loadMore(that, that.data.pageNumber);
        }
      }
    })
  },
  createBargaint: function () {
    var that = this;
    that.setData({
      time: ""
    });
    wx.request({
      url: app.api.createBargaintUrl,
      method: 'POST',
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: 6
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (data) {
        if (data.data.status == 2000) {
          wx.request({
            url: app.api.rangeUrl,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6
            },
            method: "GET",
            success: function (data) {
              if (data.data.status == 2000) {
                var scaleplate = (10 - data.data.data.lowestDis) / 4;
                that.setData({
                  scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                  scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                  scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                  endTime: data.data.data.endTime,
                });
                if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                 var i= setInterval(function () {
                    var timestamp = Date.parse(new Date());
                    var times = timestamp / 1000;
                    if (that.data.endTime <= times) {
                      that.ispastdue();
                      if (that.data.ispastdue === false) {
                        clearTimeout(i);
                        that.setData({
                          bargainId: ""
                        });
                        that.onShow();
                      }
                    }
                    var timestamp = Date.parse(new Date());
                    var times = timestamp / 1000;
                    var time = data.data.data.endTime - times;
                    var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                    var hours = hours1 > 9? hours1 : "0" + hours1;
                    var minutes1 = parseInt(time / 60) % 60;
                    var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                    var seconds1 = time % 60;
                    var seconds = seconds1 >9 ? seconds1 : "0" + seconds1;
                    var timedata = hours + ":" + minutes + ":" + seconds;
                    that.setData({
                      time: timedata
                    });
                  }, 1000);


                }
                if (data.data.data.flag == false) {
                  that.setData({
                    bargainId: data.data.data.bargainId
                  });
                }
                that.setData({
                  record: data.data.data,
                  left: 550 * data.data.data.plan / 100 + 100 - 30
                });
              }
            }
          });
          that.setData({
            flag2: true,
            pageNumber: 1,
            buyerData: []
          });
          loadMore(that, that.data.pageNumber);
        }
      }
    });
  },
  onShareAppMessage: function () {
    var that = this;
    if (that.data.bargainId != "" && that.data.bargainId != undefined && that.data.bargainId != null) {
      return {
        title: '邀好友一起砍价，抢低价购买资格！',
        imageUrl: "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/newnewthe2018new51014212.jpg",
        path: '/pages/bargain/bargain?bargainId=' + that.data.bargainId

      }
    }
  },
  promptlyBuy: function (e) {
    var that = this;
    var spuId = e.currentTarget.dataset.id;
    that.setData({
      spuId: spuId
    })
    that.setData({
      cartBtnNumber: "2"
    });
    wx.request({
      url: app.api.getGoodsDetail,
      method: 'GET',
      data: {
        spuId: spuId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var rebate = res.data.data.categorySaleGoodsResult.rebate
        that.setData({
          goodsData: res.data.data.categorySaleGoodsResult,
          goodsCost: res.data.data.categorySaleGoodsResult.salePrice,
        })
      }
    });
    that.getGoodsSkuBySpuId();
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
  addCart: function (e) {
    var that = this;
    var skuId;
    var cartId;
    that.data.getGoodsSkuBySpuId.forEach(function (v, i) {
      if (v.hidden == "block") {
        skuId = v.id;
        cartId = v.cartId
      }
    })
    var index = e.currentTarget.dataset.id;
    if (index == 1) {
      wx.request({
        url: app.api.addCart,
        data: {
          phonetype: that.data.phoneType,
          token: that.data.token,
          skuId: skuId,
          checked: 1,
          quantity: 1,
          channel: 6
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            var newTitle = res.data.msg;
            that.setData({
              count: 1500,
              toastText: newTitle
            });
            that.showToast();
            that.setData({
              display: "none",
              disabled: true
            })
            that.data.getGoodsSkuBySpuId.forEach(function (v, i) {
              v.hidden = "none";
            })
            that.setData({
              getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
            })
          }
          if (res.data.status == 2013) {
            that.setData({
              display: "none",
              disabled: true
            })
            var newTitle = res.data.msg;
            that.setData({
              count: 2000,
              toastText: newTitle
            });
            that.showToast();
            wx.openSetting({
              success: function (data) {
                if (data) {
                  if (data.authSetting["scope.userInfo"] == true) {
                    wx.login({
                      success: function (r) {
                        var code = r.code;//登录凭证
                        if (code) {
                          wx.getUserInfo({
                            success: function (res) {
                              that.setData({
                                userInfo: res.userInfo
                              });
                              wx.request({
                                url: app.api.weChatAppletLogin,//自己的服务接口地址
                                method: 'POST',
                                header: {
                                  'content-type': 'application/x-www-form-urlencoded'
                                },
                                data: {
                                  encryptedData: res.encryptedData,
                                  iv: res.iv,
                                  code: code
                                },
                                success: function (data) {
                                  if (data.data.status == 2000) {
                                    var token = data.data.data.token;
                                    var phoneType = data.data.data.phonetype;
                                    var memberId = data.data.data.userInfo.id;
                                    that.setData({
                                      token: token,
                                      phoneType: phoneType,
                                      memberId: memberId
                                    });
                                    wx.setStorageSync('token', token);
                                    wx.setStorageSync('phoneType', phoneType);
                                    wx.setStorageSync('memberId', memberId);
                                  }
                                }
                              })
                            },
                            fail: function (res) {

                            }
                          })
                        }
                      }
                    })
                  }
                }
              }
            })
          }
          if (res.data.status != 2000 && res.data.status != 2013) {
            that.setData({
              display: "none",
              disabled: true
            })
            var newTitle = res.data.msg;
            that.setData({
              count: 1500,
              toastText: newTitle
            });
            that.showToast();
          }
        }
      })
    }
    if (index == 2) {
      wx.navigateTo({
        url: '../purchaseNow/purchaseNow?path=1_' + skuId + "_" + cartId,
      })
      that.setData({
        display: "none",
        disabled: true,
        msg: "",
        country: "",
        moreSizeCountryPoint: ""
      })
    }
    if (index == 3) {
      wx.navigateTo({
        url: '../purchaseNow/purchaseNow?path=2_' + skuId + "_" + cartId + "_" + that.data.groupId,
      })
      that.setData({
        display: "none",
        disabled: true,
        msg: "",
        country: "",
        moreSizeCountryPoint: ""
      })
    }
  },
  help: function () {
    var that = this;
        that.setData({
      time: ""
    });
    wx.request({
      url: app.api.addBargainUrl,
      method: 'POST',
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: 6,
        bargainId: that.data.bargainId
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (data) {
        if (data.data.status == 2000) {
          if (data.data.data.outcome == true) {
            that.setData({
              bargainMoney: data.data.data.bargainMember.bargainMoney,
            });
            wx.request({
              url: app.api.recordUrl,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6,
                bargainId: that.data.bargainId
              },
              method: "GET",
              success: function (data) {
                if (data.data.status == 2000) {
                  that.setData({
                    lists: data.data.data,
                    shadedisply: "block",
                  });
                }
              }
            });
          } else {
            that.setData({
              count: 1500,
              toastText: data.data.data.message
            });
            that.showToast();
          }
          wx.request({
            url: app.api.rangeUrl,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6
            },
            method: "GET",
            success: function (data) {
              if (data.data.status == 2000) {
                var scaleplate = (10 - data.data.data.lowestDis) / 4;
                that.setData({
                  scaleplate: Math.floor((data.data.data.lowestDis + scaleplate) * 100) / 100,
                  scaleplate2: Math.floor((data.data.data.lowestDis + scaleplate * 2) * 100) / 100,
                  scaleplate3: Math.floor((data.data.data.lowestDis + scaleplate * 3) * 100) / 100,
                  endTime: data.data.data.endTime,
                });
                if (that.data.endTime != undefined && that.data.endTime != null && that.data.endTime != "") {
                  var i=setInterval(function () {
                    var timestamp = Date.parse(new Date());
                    var times = timestamp / 1000;
                    if (that.data.endTime <= times) {
                      that.ispastdue();
                      if (that.data.ispastdue === false) {
                        clearTimeout(i);
                        that.setData({
                          bargainId: ""
                        });
                        that.onShow();
                      }
                    }
                    var timestamp = Date.parse(new Date());
                    var times = timestamp / 1000;
                    var time = data.data.data.endTime - times;
                    var hours1 = parseInt((time % (60 * 60 * 24)) / (60 * 60));
                    var hours = hours1 > 9 ? hours1 : "0" + hours1;
                    var minutes1 = parseInt(time / 60) % 60;
                    var minutes = minutes1 > 9 ? minutes1 : "0" + minutes1;
                    var seconds1 = time % 60;
                    var seconds = seconds1 > 9 ? seconds1 : "0" + seconds1;
                    var timedata = hours + ":" + minutes + ":" + seconds;
                    that.setData({
                      time: timedata
                    });
                  }, 1000);


                }
                if (data.data.data.flag == false) {
                  that.setData({
                    bargainId: data.data.data.bargainId
                  });
                }
                that.setData({
                  record: data.data.data,
                  left: 550 * data.data.data.plan / 100 + 100 - 30
                });
              }
            }
          });
          that.setData({
            flag2: true,
            pageNumber: 1,
            buyerData: []
          });
          loadMore(that, that.data.pageNumber);

        }
      }
    });
  },
  delHomeTips: function () {
    var that = this;
    that.setData({
      shadedisply: "none"
    })
  },
  showdiv: function () {
    var that = this;
    that.setData({
      showView: true
    })
  },
  hidediv: function () {
    var that = this;
    that.setData({
      showView: false
    })
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
  ispastdue: function () {
    var that = this;
    wx.request({
      url: app.api.pastdueUrl,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: 6,
        bargainId: that.data.bargainId
      },
      method: "GET",
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            ispastdue: data.data.data.flag
          });
        }
      }
    });
  },
  goDetail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?spuId=' + id,
    })
  }
})