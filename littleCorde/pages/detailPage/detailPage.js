const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 8;

Page({
  data: {
    isShowToast: false,
    activityId: "",
    activityType: "",
    windowHeight: 0,
    actionSheetHidden: true,
    cartBtnNumber: "",
    display: "none",
    disabled: true,
    getGoodsSkuBySpuId: [],
    numberGroupId: "",
    pageCome: "",
    creatCardImg1: "",
    spuCanvas: true,
    isScorll: "auto",
    canvasImg2: "",
    getGroupIsRookieGroup: {},
    endTime:"0:0:0",
    getGroupIsRookieGroupFlag:false,
    loginBgFlag: false,
    oldTipsFlag:false,
    isMember:false,
    getGoodsSkuBySpuIdSize:[],
    secret:"",
    groupCode:"",
    joinInvitationFlag:false,
    barrage:{},
    getMemberHasFirmOrder:false
  },
  showToast: function() {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭  
    setTimeout(function() {
      _this.setData({
        isShowToast: false
      });
    }, _this.data.count);
  },
  onLoad: function(options) {
    var that = this;
    console.info(options)
    var path = options.path;
    var scene = decodeURIComponent(options.scene);
    wx.getImageInfo({
      src: "https://img3.cloudokids.cn/h5img/promotion/card111.jpg",
      success: function(res) {
        that.setData({
          creatCardImg1: res.path
        })
      }
    })
    if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
      wx.request({
        url: app.api.changeUrl,
        data: {
          id: scene
        },
        success: function(res) {
          console.info(res)
          if (res.data != null) {
            var qrCodePath = res.data;
            console.info(qrCodePath)
            console.info(qrCodePath.split("=")[1].split("_")[0])
            that.setData({
              activityId: qrCodePath.split("=")[1].split("_")[0],
              activityType: qrCodePath.split("=")[1].split("_")[1],
              pageCome: qrCodePath.split("=")[1].split("_")[2],
            })
            if (qrCodePath.split("=")[1].split("_")[3] != null && qrCodePath.split("=")[1].split("_")[3] != "" && qrCodePath.split("=")[1].split("_")[3] != undefined) {
              that.setData({
                numberGroupId: qrCodePath.split("=")[1].split("_")[3]
              })
            } else {
              that.setData({
                numberGroupId: ""
              })
            }
            if (qrCodePath.split("=")[1].split("_")[4] != null && qrCodePath.split("=")[1].split("_")[4] != "" && qrCodePath.split("=")[1].split("_")[4] != undefined) {
              that.setData({
                secret: qrCodePath.split("=")[1].split("_")[4]
              })
            } else {
              that.setData({
                secret: ""
              })
            }
            if (qrCodePath.split("=")[1].split("_")[5] != null && qrCodePath.split("=")[1].split("_")[5] != "" && qrCodePath.split("=")[1].split("_")[5] != undefined) {
              that.setData({
                groupCode: qrCodePath.split("=")[1].split("_")[5]
              })
            } else {
              that.setData({
                groupCode: ""
              })
            }
            console.info(that.data.groupCode)
            that.getActivityGoodsDetail()
            that.getGroupIsRookieGroup()
          }
        }
      })
    } else {
      console.info(path)
      that.setData({
        activityId: path.split("_")[0],
        activityType: path.split("_")[1],
        pageCome: path.split("_")[2],
        userInfo: app.globalData.userInfo
      })
      if (path.split("_")[3] != null && path.split("_")[3] != "" && path.split("_")[3] != undefined) {
        that.setData({
          numberGroupId: path.split("_")[3]
        })
      } else {
        that.setData({
          numberGroupId: ""
        })
      }
      console.info(path.split("_")[4])
      if (path.split("_")[4] != null && path.split("_")[4] != "" && path.split("_")[4] != undefined) {
        that.setData({
          secret: path.split("_")[4]
        })
      } else {
        that.setData({
          secret: ""
        })
      }
      if (path.split("_")[5] != null && path.split("_")[5] != "" && path.split("_")[5] != undefined) {
        that.setData({
          groupCode: path.split("_")[5]
        })
      } else {
        that.setData({
          groupCode: ""
        })
      }
      that.getActivityGoodsDetail()
      that.getGroupIsRookieGroup()
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      },
    })
    wx.getImageInfo({
      src: 'https://img1.cloudokids.cn/buyers/scene/spuCanvas1.png',
      success: function (res) {
        that.setData({
          spuCanvasImage: res.path
        })
      }
    })
  },
  getActivityGoodsDetail: function() {
    var that = this;
    req.getActivityGoodsDetail(that.data.activityId).then(res => {
      if (res.status == 2000) {
        that.setData({
          shopInfo: {
            spuImgList: res.data.spuImgList,
            topicSpuImgs: res.data.topicSpuImgs,
            spuId: res.data.spuId,
            marketingPrice: res.data.marketingPrice,
            amountValue: res.data.amountValue,
            activityPrice: res.data.activityPrice,
            warehouseFlag: res.data.warehouseFlag,
            warehouseMsg: res.data.warehouseMsg,
            activityDescription: res.data.activityDescription,
            memberCount: res.data.memberCount,
            isMail: res.data.isMail,
            joinType: res.data.joinType,
            brandId: res.data.brandId,
            goodsName: res.data.goodsName
          }
        })
        req.getBarrage(res.data.spuId).then(res => {
          console.info(res, "1111111111111111111111111")
          that.setData({
            barrage: res.data
          })
        })
        setInterval(function(){
          req.getBarrage(res.data.spuId).then(res => {
            console.info(res,"1111111111111111111111111")
            that.setData({
              barrage: res.data
            })
          })
        },60000)
        wx.setNavigationBarTitle({
          title: res.data.goodsName,
        })
      }
    })
  },
  getGroupIsRookieGroup: function() {
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    if(token != null && token != "" && token != undefined){
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            nickName: res.userInfo.nickName
          })
        }
      })
      if(that.data.pageCome==1){
        req.getGroupIsRookieGroup(token, phonetype, 6, "", "", 1, that.data.activityId).then(res => {
          console.info(res)
          if (res.status == 2000) {
            that.getMemberIsIntroducer()
            if (res.data.outcome) {
              if(res.data.status == 3 || res.data.status == 2){
                that.setData({
                  numberGroupId: "",
                  getGroupIsRookieGroup: {
                    flag: true,
                    isBuy: false
                  },
                  getGroupIsRookieGroupFlag: false,
                  isMember: false,
                  pageCome:1
                })
              }else{
                var length = res.data.members.length;
                var arr = [];
                for (var i = 0; i < length; i++) {
                  arr.push({
                    avatar: res.data.members[i].imgUrl,
                    nickname: res.data.members[i].nickname,
                    flag: res.data.members[i].flag
                  })
                }
                if (length == res.data.amount) {

                } else {
                  for (var a = 0; a < res.data.amount - length; a++) {
                    arr.push({
                      avatar: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon45.png",
                      nickname: "等待中...",
                      flag: 0
                    })
                  }
                }
                that.setData({
                  numberGroupId: res.data.groupId,
                  getGroupIsRookieGroupFlag: true,
                  isMember: res.data.isMember,
                  getGroupIsRookieGroup: {
                    endTime: that.time(res.data.endTime),
                    flag: res.data.flag,
                    number: res.data.number,
                    status: res.data.status,
                    members: arr,
                    isBuy: res.data.isBuy,
                    unpaid: res.data.unpaid,
                    amount: res.data.amount,
                  }
                })
              }
            } else {
              that.setData({
                numberGroupId: "",
                getGroupIsRookieGroup: {
                  flag:true,
                  isBuy:false
                },
                getGroupIsRookieGroupFlag: false,
                isMember:false,
                pageCome: 1
              })
            }
          }
          if (res.status == 2013) {
            that.getLogin()
          }
        })
      }
      if (that.data.pageCome == 2) {
        if (that.data.numberGroupId != null && that.data.numberGroupId != null){
          req.getGroupIsRookieGroup(token, phonetype, 6, that.data.numberGroupId, "", 2, "").then(res => {
            console.info(res)
            if (res.status == 2000) {
              if (that.data.secret != null && that.data.secret != "" && that.data.secret != undefined) {
                that.joinInvitation()
              }
              if (that.data.groupCode != null && that.data.groupCode != "" && that.data.groupCode != undefined) {
                that.bindMemberIntroduce()
              }
              if (res.data.outcome) {
                if (res.data.status == 2 || res.data.status == 3) {
                  req.getGroupIsRookieGroup(token, phonetype, 6, "", "", 1, that.data.activityId).then(res => {
                    console.info(res)
                    if (res.status == 2000) {
                      if (res.data.outcome) {
                        if (res.data.status == 3 || res.data.status == 2) {
                          that.setData({
                            numberGroupId: "",
                            getGroupIsRookieGroup: {
                              flag: true,
                              isBuy: false
                            },
                            getGroupIsRookieGroupFlag: false,
                            isMember: false,
                            pageCome: 1
                          })
                        } else {
                          var length = res.data.members.length;
                          var arr = [];
                          for (var i = 0; i < length; i++) {
                            arr.push({
                              avatar: res.data.members[i].imgUrl,
                              nickname: res.data.members[i].nickname,
                              flag: res.data.members[i].flag
                            })
                          }
                          if (length == res.data.amount) {

                          } else {
                            for (var a = 0; a < res.data.amount - length; a++) {
                              arr.push({
                                avatar: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon45.png",
                                nickname: "等待中...",
                                flag: 0
                              })
                            }
                          }
                          that.setData({
                            numberGroupId: res.data.groupId,
                            getGroupIsRookieGroupFlag: true,
                            isMember: res.data.isMember,
                            getGroupIsRookieGroup: {
                              endTime: that.time(res.data.endTime),
                              flag: res.data.flag,
                              number: res.data.number,
                              status: res.data.status,
                              members: arr,
                              isBuy: res.data.isBuy,
                              unpaid: res.data.unpaid,
                              amount: res.data.amount,
                            }
                          })
                        }
                      } else {
                        that.setData({
                          numberGroupId: "",
                          getGroupIsRookieGroup: {
                            flag: true,
                            isBuy: false
                          },
                          getGroupIsRookieGroupFlag: false,
                          isMember: false,
                          pageCome: 1
                        })
                      }
                    }
                    if (res.status == 2013) {
                      that.getLogin()
                    }
                  })
                } else {
                  var length = res.data.members.length;
                  var arr = [];
                  for (var i = 0; i < length; i++) {
                    arr.push({
                      avatar: res.data.members[i].imgUrl,
                      nickname: res.data.members[i].nickname,
                      flag: res.data.members[i].flag
                    })
                  }
                  if (length == res.data.amount) {

                  } else {
                    for (var a = 0; a < res.data.amount - length; a++) {
                      arr.push({
                        avatar: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon45.png",
                        nickname: "等待中...",
                        flag: 0
                      })
                    }
                  }
                  that.setData({
                    numberGroupId: res.data.groupId,
                    getGroupIsRookieGroupFlag: true,
                    isMember: res.data.isMember,
                    getGroupIsRookieGroup: {
                      endTime: that.time(res.data.endTime),
                      flag: res.data.flag,
                      number: res.data.number,
                      status: res.data.status,
                      members: arr,
                      isBuy: res.data.isBuy,
                      unpaid: res.data.unpaid,
                      amount: res.data.amount,
                      isMember: res.data.isMember
                    }
                  })
                }
              } else {
                that.setData({
                  getGroupIsRookieGroup: {
                    flag: true,
                    isBuy: false
                  },
                  getGroupIsRookieGroupFlag: false,
                  isMember: false,
                  pageCome: 1
                })
                if (that.data.numberGroupId != "" && that.data.numberGroupId != null) {
                  that.setData({
                    numberGroupId: that.data.numberGroupId
                  })
                } else {
                  that.setData({
                    numberGroupId: ""
                  })
                }
              }
            }
            if (res.status == 2013) {
              that.getLogin()
            }
          })
        }else{
          req.getGroupIsRookieGroup(token, phonetype, 6, "", "", 1, that.data.activityId).then(res => {
            console.info(res)
            if (res.status == 2000) {
              if (that.data.secret != null && that.data.secret != "" && that.data.secret != undefined) {
                that.joinInvitation()
              }
              if (that.data.groupCode != null && that.data.groupCode != "" && that.data.groupCode != undefined) {
                that.bindMemberIntroduce()
              }
              if (res.data.outcome) {
                if (res.data.status == 3 || res.data.status == 2) {
                  that.setData({
                    numberGroupId: "",
                    getGroupIsRookieGroup: {
                      flag: true,
                      isBuy: false
                    },
                    getGroupIsRookieGroupFlag: false,
                    isMember: false,
                    pageCome: 1
                  })
                } else {
                  var length = res.data.members.length;
                  var arr = [];
                  for (var i = 0; i < length; i++) {
                    arr.push({
                      avatar: res.data.members[i].imgUrl,
                      nickname: res.data.members[i].nickname,
                      flag: res.data.members[i].flag
                    })
                  }
                  if (length == res.data.amount) {

                  } else {
                    for (var a = 0; a < res.data.amount - length; a++) {
                      arr.push({
                        avatar: "https://img3.cloudokids.cn/h5img/specialSale/getCoupon45.png",
                        nickname: "等待中...",
                        flag: 0
                      })
                    }
                  }
                  that.setData({
                    numberGroupId: res.data.groupId,
                    getGroupIsRookieGroupFlag: true,
                    isMember: res.data.isMember,
                    getGroupIsRookieGroup: {
                      endTime: that.time(res.data.endTime),
                      flag: res.data.flag,
                      number: res.data.number,
                      status: res.data.status,
                      members: arr,
                      isBuy: res.data.isBuy,
                      unpaid: res.data.unpaid,
                      amount: res.data.amount,
                    }
                  })
                }
              } else {
                that.setData({
                  numberGroupId: "",
                  getGroupIsRookieGroup: {
                    flag: true,
                    isBuy: false
                  },
                  getGroupIsRookieGroupFlag: false,
                  isMember: false,
                  pageCome: 1
                })
              }
            }
            if (res.status == 2013) {
              that.getLogin()
            }
          })
        }
      }
    }else{
      that.setData({
        loginBgFlag:true
      })
    }
  },
  //尺码对照表
  size: function() {
    var brandId = this.data.shopInfo.brandId;
    wx.navigateTo({
      url: '../size/size?brandId=' + brandId,
    })
  },
  shareList: function() {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_" + that.data.activityType + "_2_" + that.data.numberGroupId + "_" + " " + "_" + that.data.groupCode,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        wx.downloadFile({
          url: res.data,
          success: function(data) {
            that.setData({
              canvasImg2: data.tempFilePath
            })
          }
        })
      }
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  onShareAppMessage: function(options) {
    var that = this;
    app.tdsdk.customShare(options)
    req.analyticsLog({
      event: 'share',
      sid: 1,
      eid: that.data.groupCode || ''
    })
    if (that.data.numberGroupId != null && that.data.numberGroupId != ""){
      return {
        title: "好友" + that.data.nickName + "邀你享特权，14.9元即享原价49元的舒适无痕内裤",
        path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_" + that.data.activityType + "_2_" + that.data.numberGroupId + "_" + " " + "_" + that.data.groupCode,
        imageUrl: "https://img3.cloudokids.cn/h5img/promotion/card112.jpg",
        success: function (res) {

        },
      }
    }else{
      return {
        title: "好友" + that.data.nickName + "邀你享特权，14.9元即享原价49元的舒适无痕内裤",
        path: 'pages/detailPage/detailPage?path=' + that.data.activityId + "_" + that.data.activityType + "_2_" + that.data.numberGroupId + "_" + " " + "_" + that.data.groupCode,
        imageUrl: "https://img3.cloudokids.cn/h5img/promotion/card112.jpg",
        success: function (res) {

        },
      }
    }
  },
  buyShop: function() {
    var that = this;
    var spuId = that.data.shopInfo.spuId;
    that.setData({
      cartBtnNumber: 1,
      goodsCost: that.data.shopInfo.marketingPrice,
      country: that.data.shopInfo.warehouseFlag,
      msg: that.data.shopInfo.warehouseMsg,
      disabled:true
    })
    that.getGoodsSkuBySpuId(spuId,that.data.activityId,1)
    req.analyticsLog({
      event: 'stpg',
      kud: that.data.shopInfo.spuId
    })
  },
  promptlyBuy: function() {
    var that = this;
    var spuId = that.data.shopInfo.spuId;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    that.setData({
      cartBtnNumber: 2,
      goodsCost: that.data.shopInfo.activityPrice,
      country: that.data.shopInfo.warehouseFlag,
      msg: that.data.shopInfo.warehouseMsg,
      disabled: true
    })
    wx.request({
      url: app.api.insertGroupBooking,
      data: {
        token: token,
        phonetype: phonetype,
        channel: "6",
        activityId: that.data.activityId,
        type: that.data.activityType
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            numberGroupId: res.data.data
          })
          that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
        }
        if (res.data.status != 2000 && res.data.status != 2013) {
          if (!that.data.getGroupIsRookieGroup.isBuy) {
            that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
          } else {
            that.setData({
              count: 1500,
              toastText: res.data.msg
            });
            that.showToast();
          }
        }
      }
    })
    req.analyticsLog({
      event: 'view',
      pid,
      eid: that.data.numberGroupId
    });
  },
  newPrice(){
    var that = this;
    var spuId = that.data.shopInfo.spuId;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    that.setData({
      cartBtnNumber: 1,
      goodsCost: that.data.shopInfo.activityPrice,
      country: that.data.shopInfo.warehouseFlag,
      msg: that.data.shopInfo.warehouseMsg,
      disabled: true
    })
    that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
  },
  getGoodsSkuBySpuId: function (spuId, activityId,type) {
    var that = this;
    req.getGoodsSkuBySpuId("", "", spuId, "", activityId,type).then(res => {
      if(res.status == 2000){
        that.setData({
          getGoodsSkuBySpuId: []
        })
        var getGoodsSkuBySpuId= [];
        for (var i = 0; i < res.data.length; i++) {
          var arr = [];
          for(var a = 0; a < res.data[i].list.length;a++){
            var obj1 = new Object();
            obj1.cartId = res.data[i].list[a].cartId;
            obj1.colorValue = res.data[i].list[a].colorValue;
            obj1.flag = res.data[i].list[a].flag;
            obj1.id = res.data[i].list[a].id;
            obj1.msg = res.data[i].list[a].msg;
            obj1.point = res.data[i].list[a].point;
            obj1.salePrice = res.data[i].list[a].salePrice;
            obj1.specificationValue = res.data[i].list[a].specificationValue;
            obj1.stock = res.data[i].list[a].stock;
            obj1.hidden = "none";
            arr.push(obj1)
          }
          var obj = new Object();
          obj.title = res.data[i].title;
          obj.hidden = "none",
          obj.list = arr;
          getGoodsSkuBySpuId.push(obj)
        }
        getGoodsSkuBySpuId[0].hidden = 'block';
        that.setData({
          getGoodsSkuBySpuId: getGoodsSkuBySpuId,
          getGoodsSkuBySpuIdSize: getGoodsSkuBySpuId[0].list
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
    })
  },
  disappear: function() {
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
  //选择尺码
  selectSize: function(e) {
    var that = this;
    var title = e.target.dataset.title;
    that.setData({
      disabled: true
    })
    that.data.getGoodsSkuBySpuId.forEach(function (v, i) {
      if (v.title == title) {
        v.hidden = "block";
        that.setData({
          getGoodsSkuBySpuIdSize: v.list
        })
      } else {
        v.hidden = "none";
      }
    })
    that.setData({
      getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
    })
  },
  selectSizeType:function(e){
    var that = this;
    var stock = e.target.dataset.stock;
    var id = e.target.dataset.id;
    var flag = that.data.flag;
    var price = e.target.dataset.price;
    if (stock != 0) {
      that.setData({
        disabled: false
      })
      that.data.getGoodsSkuBySpuIdSize.forEach(function (v, i) {
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
          } 
        } else {
          v.hidden = "none";
        }
      })
      that.setData({
        getGoodsSkuBySpuIdSize: that.data.getGoodsSkuBySpuIdSize
      })
    }
  },
  addCart: function(e) {
    var that = this;
    var skuId;
    var cartId;
    that.data.getGoodsSkuBySpuIdSize.forEach(function(v, i) {
      if (v.hidden == "block") {
        skuId = v.id;
        cartId = v.cartId
      }
    })
    var index = e.currentTarget.dataset.id;
    console.info(that.data.disabled)
    if (that.data.disabled){
      
    }else{
      wx.navigateTo({
        url: '../purchaseNow/purchaseNow?path=4_' + skuId + "_" + cartId + "_" + that.data.activityType
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
  bindItemTap: function() {
    var that = this;
    console.info(that)
    var title = that.data.shopInfo.activityDescription;
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
      if (that.data.canvasImg2 == "") {

      } else {
        clearInterval(timer)
        const ctx = wx.createCanvasContext('spuCanvas');
        const grd = ctx.createLinearGradient(0, 0, 280, 400)
        that.setData({
          actionSheetHidden: true,
          spuCanvas: false,
          isScorll: "hidden"
        })
        wx.getImageInfo({
          src: that.data.shopInfo.spuImgList[0].replace(/http:/g, 'https:'),
          success: function (res) {
            grd.addColorStop(0, '#ffffff')
            grd.addColorStop(1, '#ffffff')
            ctx.setFillStyle(grd)
            ctx.fillRect(0, 0, 280, 400)
            ctx.setFillStyle("black")
            ctx.drawImage(that.data.spuCanvasImage, 56, 0, 168, 90)
            ctx.setFontSize(12)
            ctx.setTextAlign('center')
            ctx.fillText(title, 140, 230)
            ctx.setTextAlign('center')
            ctx.fillText('拼团价' + that.data.shopInfo.activityPrice + '元 原价49元', 140, 245)
            ctx.drawImage(res.path, 80, 80, 120, 120)
            ctx.drawImage(that.data.canvasImg2, 100, 260, 80, 80)
            ctx.setFontSize(10)
            ctx.setTextAlign('center')
            ctx.fillText("长按扫码查看详情", 140, 360)
            ctx.save()
            ctx.draw()
          }
        })
      }
    }, 500)
  },
  cancelSpuCanvasImg: function() {
    var that = this;
    that.setData({
      actionSheetHidden: true,
      spuCanvas: true,
      isScorll: "auto"
    })
  },
  saveSpuCanvasImg: function() {
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
      success: function(res) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success: function() {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function(res) {
                wx.showToast({
                  title: '保存成功',
                })
                that.setData({
                  actionSheetHidden: true,
                  spuCanvas: true,
                  isScorll: "auto"
                })
              },
              fail: function(res) {
                wx.showToast({
                  title: '保存失败',
                })
              }
            })
          },
          fail: function(res) {
            wx.showLoading({
              title: res,
            })
          }
        })
      }
    })
    req.analyticsLog({
      event: 'saca'
    })
  },
  time: function(time) {
    var that = this;
    var interval = setInterval(function() {
      var second = time--;
      let hour=Math.floor(second/3600);
      var hrStr = hour.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      let sed=Math.floor(second%3600/60);
      var minStr = sed.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      let mms=Math.floor(second%3600%60)
      var secStr = mms.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (second < 0) {
        clearInterval(interval)
        that.setData({
          endTime: "0:0:0"
        })
      }else{
        that.setData({
          endTime: hrStr + ":" + minStr + ":" + secStr
        })
      }
    }.bind(this), 1000);
  },
  getLogin: function () {
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
  getUserInfoLogin: function (encryptedData, iv, code) {
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
            loginBgFlag: false
          });
          wx.setStorageSync('token', token);
          wx.setStorageSync('phoneType', phoneType);
          wx.setStorageSync('memberId', memberId);
          that.getGroupIsRookieGroup()
        }
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
  addGroup:function(){
    var that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    var spuId = that.data.shopInfo.spuId;
    that.setData({
      cartBtnNumber: 2,
      goodsCost: that.data.shopInfo.activityPrice,
      country: that.data.shopInfo.warehouseFlag,
      msg: that.data.shopInfo.warehouseMsg,
      disabled: true
    })
    if (!that.data.getGroupIsRookieGroup.flag){
      req.joinRookieGroupBooking(token, phonetype, 6, that.data.numberGroupId).then(res => {
        console.info(res)
        if (res.status == 2000) {
          if (res.data.outcome) {
            that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
          } else {
            switch (res.data.flag){
              case 1:
                that.setData({
                  oldTipsFlag: true
                })
                break;
              case 3:
                if (!that.data.isMember){
                  that.setData({
                    count: 1500,
                    toastText: res.data.message
                  });
                  that.showToast();
                }else{
                  if (!that.data.getGroupIsRookieGroup.isBuy) {
                    that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
                  } else {
                    that.setData({
                      count: 1500,
                      toastText: res.data.message
                    });
                    that.showToast();
                  }
                }
                break;
              case 4:
                if (that.data.isMember){
                  console.info(!that.data.getGroupIsRookieGroup.isBuy)
                  if (!that.data.getGroupIsRookieGroup.isBuy) {
                    that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
                  } else {
                    that.setData({
                      count: 1500,
                      toastText: res.data.message
                    });
                    that.showToast();
                  }
                }else{
                  that.setData({
                    count: 1500,
                    toastText: res.data.message
                  });
                  that.showToast();
                }
                break;
              default:
                that.setData({
                  count: 1500,
                  toastText: res.data.message
                });
                that.showToast();
            }
          }
        }
      })
    }else{
      that.getGoodsSkuBySpuId(spuId, that.data.activityId, 2)
    }
  },
  goPlayPage:function(){
    var that = this;
    that.setData({
      oldTipsFlag: false
    })
    wx.switchTab({
      url: '../collage/collage',
    })
  },
  goIndex:function(){
    wx.switchTab({
      url: '../home/index',
    })
  },
  joinInvitation:function(){
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.joinInvitation(token, phonetype, 6, that.data.secret).then(res=>{
      console.info(res,'111112222')
      that.setData({
        joinInvitationFlag:res.data
      })
      req.getMemberHasFirmOrder(token,phonetype,6,that.data.activityId).then(res => {
        that.setData({
          getMemberHasFirmOrder:res.data
        })
      })
    })
  },
  getMemberIsIntroducer() {
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getMemberIsIntroducer(token, phonetype, 6).then(res => {
      if (res.data.outcome) {
        if (res.data.introducer.status == 2) {
          that.setData({
            groupCode: res.data.introducer.introduceCode
          })
        } else {
          that.setData({
            groupCode: ""
          })
        }
      } else {
        that.setData({
          groupCode: ""
        })
      }
    })
  },
  bindMemberIntroduce(){
    const that = this;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.bindMemberIntroduce(token,phonetype,6,that.data.groupCode).then(res=>{
      console.info(res,"绑定推手")
    })
  },
  weService() {
    req.analyticsLog({
      event: 'cocs',
      pid,
      eid: this.data.shopInfo.spuId
    });
  }
})