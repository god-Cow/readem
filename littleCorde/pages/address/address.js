var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
const pid = 26;

var isRun = true;
Page({
  data: {
    token: "",
    phoneType: "",
    address: [],
    addressFlag: true,
    startX: 0, //开始坐标
    startY: 0,
    selectSign: "",
    isShowToast: false,
    cartId: ""
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      selectSign: options.selectSign,
      cartId: options.cartId
    })
    req.analyticsLog({
      event: 'view',
      pid
    });
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
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (result) {
            that.setData({
              phoneType: result.data
            })
            wx.request({
              url: app.api.getAddressList,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success: function (res) {
                if (res.data.status == 2000) {
                  if (res.data.data.length > 0) {
                    that.setData({
                      addressFlag: false,
                      address: []
                    })
                    for (var i = 0; i < res.data.data.length; i++) {
                      that.data.address.push({
                        id: res.data.data[i].id,
                        name: res.data.data[i].name,
                        phone: res.data.data[i].phone,
                        address: res.data.data[i].address,
                        provinceVo: res.data.data[i].provinceVo,
                        cityVo: res.data.data[i].cityVo,
                        countyVo: res.data.data[i].countyVo,
                        province: res.data.data[i].province,
                        city: res.data.data[i].city,
                        county: res.data.data[i].county,
                        isTouchMove: false,
                        isDefault: res.data.data[i].isDefault,
                        addressSelectLogo: "none",
                        postcode: res.data.data[i].postcode,
                        idCardNumber: res.data.data[i].idCardNumber,
                      })
                    }
                    that.setData({
                      address: that.data.address
                    })
                  } else {
                    that.setData({
                      addressFlag: true,
                    })
                  }
                }
              }
            })
          },
        })
      },
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.address.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      address: this.data.address
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.address.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (v.id == index) {
        if (touchMoveX > startX) {
          v.isTouchMove = false;
        }
        else {
          v.isTouchMove = true;
        }
      }
    })
    //更新数据
    that.setData({
      address: that.data.address
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del: function (e) {
    var that = this;
    var id = e.target.dataset.index;
    wx.request({
      url: app.api.deleteAddress,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        addressId: id,
        channel: 6
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        if (res.data.status == 2000) {
          var newTitle = res.data.msg
          that.setData({
            count: 1500,
            toastText: newTitle
          });
          that.showToast();
          wx.request({
            url: app.api.getAddressList,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6
            },
            header: {
              "content-type": "application/json"
            },
            method: "GET",
            success: function (res) {
              if (res.data.status == 2000) {
                if (res.data.data.length > 0) {
                  that.setData({
                    addressFlag: false,
                    address: []
                  })
                  for (var i = 0; i < res.data.data.length; i++) {
                    that.data.address.push({
                      id: res.data.data[i].id,
                      name: res.data.data[i].name,
                      phone: res.data.data[i].phone,
                      address: res.data.data[i].address,
                      provinceVo: res.data.data[i].provinceVo,
                      cityVo: res.data.data[i].cityVo,
                      countyVo: res.data.data[i].countyVo,
                      isTouchMove: false,
                      isDefault: res.data.data[i].isDefault,
                      postcode: res.data.data[i].postcode,
                      addressSelectLogo: "none",
                      idCardNumber: res.data.data[i].idCardNumber,
                      province: res.data.data[i].province,
                      city: res.data.data[i].city,
                      county: res.data.data[i].county,
                    })
                  }
                  that.setData({
                    address: that.data.address
                  })
                } else {
                  that.setData({
                    addressFlag: true,
                  })
                }
              }
            }
          })
        }
      }
    })
  },
  redact: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../../pages/addAddress/addAddress?addressId=' + id,
    })
  },
  newAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    var selectSign = that.data.selectSign;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var cartId = that.data.cartId;
    if (isRun){
      isRun = false;
      if (selectSign != undefined) {
        if (cartId == 1) {
          that.data.address.forEach(function (v, i) {
            if (id == v.id) {
              v.addressSelectLogo = "block",
                prevPage.setData({
                  selectAddress: v
                })
            } else {
              v.addressSelectLogo = "none"
            }
          })
          that.setData({
            selectAddress: that.data.selectAddress
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1,
            });
          }, 1000)
        } else {
          that.data.address.forEach(function (v, i) {
            if (id == v.id) {
              if (v.idCardNumber != null && v.idCardNumber != "" || v.province == 3595 || v.province == 3623 || v.province == 3634) {
                v.addressSelectLogo = "block";
                prevPage.setData({
                  selectAddress: v
                })
                that.setData({
                  selectAddress: that.data.selectAddress
                })
                setTimeout(function () {
                  wx.navigateBack();
                }, 1000)
              } else {
                v.addressSelectLogo = "none";
                that.setData({
                  count: 1500,
                  toastText: "英国直邮需要提供您的身份证号码"
                });
                that.showToast();
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../../pages/addAddress/addAddress?addressId=' + id,
                  })
                }, 2000)
              }
            } else {
              v.addressSelectLogo = "none"
            }
          })
        }
      }
      if (selectSign == undefined) {
        wx.navigateTo({
          url: '../../pages/addAddress/addAddress?addressId=' + id,
        })
      }
      setTimeout(function () {
        isRun = true;
      }, 2000) //点击后相隔多长时间可执行
    }
  },
  addWeiXinAddress:function(){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        if (res.errMsg == "chooseAddress:ok"){
          var provinceName = res.provinceName;
          var cityName = res.cityName;
          var countyName = res.countyName;
          var telNumber = res.telNumber;
          var postalCode = res.postalCode;
          var detailInfo = res.detailInfo;
          var userName = res.userName;
          wx.request({
            url: app.api.addMemberAddressByWeiXin,
            data:{
              token:that.data.token,
              phonetype:that.data.phoneType,
              channel:"6",
              provinceName: provinceName,
              cityName: cityName,
              countyName: countyName,
              telNumber: telNumber,
              postalCode: postalCode,
              detailInfo: detailInfo,
              userName: userName
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:function(res){
              console.info(res)
              if(res.data.status == 2000){
                that.setData({
                  count: 1500,
                  toastText: res.data.data.mag
                });
                that.showToast();
              }else{
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
    })
  }
})