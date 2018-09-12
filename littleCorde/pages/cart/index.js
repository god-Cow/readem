
const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 4;
const { channel } = app.globalData;

Page({
  data: {
    token: "",
    phoneType: "",
    cartShow: true,
    selectAllStatus: false,
    carts: [],
    startX: 0, //开始坐标
    startY: 0,
    amount: "",
    isShowToast: false,
    shopCheckClassify: false, //显示国内外几件
    checkShop: [] //国内外
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
  onLoad: function () {
    var that = this;
    app._dgt.trackEvent('del');
  },
  onShow: function () {
    var that = this;
    that.setData({
      shopCheckClassify: false
    })
    //判断是否授权登陆
    if (that.data.phoneType != null && that.data.phoneType != "" && that.data.token != null && that.data.token != "") {
      that.setData({
        cartShow:false
      })
    } else {
      that.setData({
        cartShow: true
      })
    }
    wx.getStorage({
      key: 'token',
      success: function (res) {
        that.setData({
          token: res.data,
        })
        wx.getStorage({
          key: 'phoneType',
          success: function (res) {
            that.setData({
              phoneType: res.data,
            })
            wx.request({
              url: app.api.getCartShop,
              data: {
                phonetype: that.data.phoneType,
                token: that.data.token,
                channel: 6,
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                if (res.data.status == 2000) {
                  if (res.data.data.length != 0) {
                    that.setData({
                      cartShow: false,
                      carts: []
                    });
                    for (var i = 0; i < res.data.data.length; i++) {
                      var newCart = [];
                      for (var j = 0; j < res.data.data[i].activityCarts.length; j++) {
                        var newCartList = [];
                        for (var k = 0; k < res.data.data[i].activityCarts[j].cartList.length; k++) {
                          var obj1 = new Object();
                          obj1.skuId = res.data.data[i].activityCarts[j].cartList[k].skuId;
                          obj1.isTouchMove = false;
                          obj1.brandName = res.data.data[i].activityCarts[j].cartList[k].brandName;
                          obj1.goodsName = res.data.data[i].activityCarts[j].cartList[k].goodsName;
                          obj1.msg = res.data.data[i].activityCarts[j].cartList[k].msg;
                          obj1.salePrice = res.data.data[i].activityCarts[j].cartList[k].salePrice;
                          obj1.quantity = res.data.data[i].activityCarts[j].cartList[k].quantity;
                          obj1.checked = res.data.data[i].activityCarts[j].cartList[k].checked;
                          obj1.imgUrl = res.data.data[i].activityCarts[j].cartList[k].imgUrl;
                          obj1.spuId = res.data.data[i].activityCarts[j].cartList[k].spuId;
                          obj1.sizeName = res.data.data[i].activityCarts[j].cartList[k].sizeName;
                          obj1.stock = res.data.data[i].activityCarts[j].cartList[k].stock;
                          obj1.shareDiscount = res.data.data[i].activityCarts[j].cartList[k].shareDiscount;
                          newCartList.push(obj1)
                        }
                        var obj = new Object();
                        obj.id = res.data.data[i].activityCarts[j].id;
                        obj.type = res.data.data[i].activityCarts[j].type;
                        obj.description = res.data.data[i].activityCarts[j].description;
                        obj.cartList = newCartList;
                        newCart.push(obj);
                      }
                      that.data.carts.push({
                        id: res.data.data[i].id,
                        name: res.data.data[i].name,
                        activityCarts: newCart
                      })
                    }
                    that.setData({
                      carts: that.data.carts
                    })
                  } else {
                    that.setData({
                      cartShow: true,
                    })
                  }
                } else {
                  var newTitle = res.data.msg;
                  that.setData({
                    count: 1500,
                    toastText: newTitle
                  });
                  that.showToast();
                }
                
              }
            })
          },
        })
      },
    })
    app.tdsdk.iap.viewItems(that.data.carts);

    req.analyticsLog({
      event: 'view',
      pid
    })
  },
  /*单选*/
  bindCheckbox: function (e) {
    var index = e.currentTarget.dataset.index;
    var checked = e.currentTarget.dataset.checked;
    var quantity = e.currentTarget.dataset.quantity;
    var that = this;
    if (checked == 1) {
      wx.request({
        url: app.api.getNewCartShop,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          skuId: index,
          checked: 0,
          quantity: quantity,
          channel: 6
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          that.setData({
            selectAllStatus: false,
          });
          if (res.data.status == 2000) {
            for (var i = 0; i < that.data.carts.length; i++) {
              for (var j = 0; j < that.data.carts[i].activityCarts.length; j++) {
                for (var k = 0; k < that.data.carts[i].activityCarts[j].cartList.length; k++) {
                  if (that.data.carts[i].activityCarts[j].cartList[k].skuId == index) {
                    that.data.carts[i].activityCarts[j].cartList[k].checked = 0
                  }
                }
              }
            }
            that.setData({
              carts: that.data.carts
            })
          } else {
            var newTitle = res.data.msg;
            that.setData({
              count: 1500,
              toastText: newTitle
            });
            that.showToast();
          }
        }
      })
    } else {
      wx.request({
        url: app.api.getNewCartShop,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          skuId: index,
          checked: 1,
          quantity: quantity,
          channel: 6
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            for (var i = 0; i < that.data.carts.length; i++) {
              for (var j = 0; j < that.data.carts[i].activityCarts.length; j++) {
                for (var k = 0; k < that.data.carts[i].activityCarts[j].cartList.length; k++) {
                  if (that.data.carts[i].activityCarts[j].cartList[k].skuId == index) {
                    that.data.carts[i].activityCarts[j].cartList[k].checked = 1
                  }
                }
              }
            }
            that.setData({
              carts: that.data.carts
            })
          } else {
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
  },
  /*全选*/
  selectAll: function (activityId) {
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    var that = this;
    if (selectAllStatus == false) {
      wx.request({
        url: app.api.allSelectCart,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          checked: 1,
          channel: 6
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            selectAllStatus = !selectAllStatus;
            that.setData({
              selectAllStatus: selectAllStatus,
            });
            for (var i = 0; i < that.data.carts.length; i++) {
              for (var j = 0; j < that.data.carts[i].activityCarts.length; j++) {
                for (var k = 0; k < that.data.carts[i].activityCarts[j].cartList.length; k++) {
                  that.data.carts[i].activityCarts[j].cartList[k].checked = 1
                }
              }
            }
            that.setData({
              carts: that.data.carts
            })
          }
        }
      })
    } else {
      wx.request({
        url: app.api.allSelectCart,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          checked: 0,
          channel: 6
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            selectAllStatus = !selectAllStatus;
            that.setData({
              selectAllStatus: selectAllStatus,
            });
            for (var i = 0; i < that.data.carts.length; i++) {
              for (var j = 0; j < that.data.carts[i].activityCarts.length; j++) {
                for (var k = 0; k < that.data.carts[i].activityCarts[j].cartList.length; k++) {
                  that.data.carts[i].activityCarts[j].cartList[k].checked = 0
                }
              }
            }
            that.setData({
              carts: that.data.carts
            })
            
          }

          if(activityId) {
            // req.updateCartCheckedByActivityId(that.data.token, channel, that.data.phoneType, activityId, "1")
            // .then(res => {
            //   if (res.status == 2000) {
            //     that.setData({ carNum: res.data })
            //   }
            //   that.setData({
            //     carts: that.data.carts
            //   })
            // })
            // let {carts} = that.data;
            // let slectIndex='';
            // let slectTwo='';            
            // carts.forEach(function(state,i){
            //   state.activityCarts.forEach(function(item,j) {
            //     if(item.id == activityId ) {
            //       slectIndex=j;
            //       slectTwo = i;
            //       console.log(slectIndex,slectTwo,'匹配')
            //     }
            //   })
            //   that.data.carts[slectIndex].activityCarts[slectTwo].cartList.forEach(function(id,k) {
            //     id.checked= 1;
            //   })
            // })
            // that.setData({
            //   carts: that.data.carts
            // })
          }
          
        }
      }) 
    }
  },
  /*商品减*/
  minusCount: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var checked = e.currentTarget.dataset.checked;
    var quantity = e.currentTarget.dataset.quantity;
    if (quantity <= 1) {
      return false;
    } else {
      quantity = parseInt(quantity) - parseInt(1);
      wx.request({
        url: app.api.getNewCartShop,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          skuId: index,
          checked: checked,
          quantity: quantity,
          channel: 6
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            wx.request({
              url: app.api.getCartShop,
              data: {
                phonetype: that.data.phoneType,
                token: that.data.token,
                channel: 6,
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (result) {
                if (result.data.status == 2000) {
                  if (res.data.data.length != 0) {
                    that.setData({
                      cartShow: false,
                      carts: []
                    });
                    for (var i = 0; i < result.data.data.length; i++) {
                      var newCart = [];
                      for (var j = 0; j < result.data.data[i].activityCarts.length; j++) {
                        var newCartList = [];
                        for (var k = 0; k < result.data.data[i].activityCarts[j].cartList.length; k++) {
                          var obj1 = new Object();
                          obj1.skuId = result.data.data[i].activityCarts[j].cartList[k].skuId;
                          obj1.isTouchMove = false;
                          obj1.brandName = result.data.data[i].activityCarts[j].cartList[k].brandName;
                          obj1.goodsName = result.data.data[i].activityCarts[j].cartList[k].goodsName;
                          obj1.msg = result.data.data[i].activityCarts[j].cartList[k].msg;
                          obj1.salePrice = result.data.data[i].activityCarts[j].cartList[k].salePrice;
                          obj1.quantity = result.data.data[i].activityCarts[j].cartList[k].quantity;
                          obj1.checked = result.data.data[i].activityCarts[j].cartList[k].checked;
                          obj1.imgUrl = result.data.data[i].activityCarts[j].cartList[k].imgUrl;
                          obj1.spuId = result.data.data[i].activityCarts[j].cartList[k].spuId;
                          obj1.sizeName = result.data.data[i].activityCarts[j].cartList[k].sizeName;
                          obj1.stock = result.data.data[i].activityCarts[j].cartList[k].stock;
                          obj1.shareDiscount = result.data.data[i].activityCarts[j].cartList[k].shareDiscount;
                          newCartList.push(obj1)
                        }
                        var obj = new Object();
                        obj.id = result.data.data[i].activityCarts[j].id;
                        obj.type = result.data.data[i].activityCarts[j].type;
                        obj.description = result.data.data[i].activityCarts[j].description;
                        obj.cartList = newCartList;
                        newCart.push(obj);
                      }
                      that.data.carts.push({
                        id: result.data.data[i].id,
                        name: result.data.data[i].name,
                        activityCarts: newCart
                      })
                    }
                    that.setData({
                      carts: that.data.carts
                    })
                  } else {
                    that.setData({
                      cartShow: true,
                    })
                  }
                } else {
                  var newTitle = result.data.msg;
                  that.setData({
                    count: 1500,
                    toastText: newTitle
                  });
                  that.showToast();
                }
              }
            })
          } else {
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
  },
  /*商品加*/
  addCount: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var checked = e.currentTarget.dataset.checked;
    var quantity = e.currentTarget.dataset.quantity;
    if (quantity >= 9){
      that.setData({
        count: 1500,
        toastText: "商品最多可以加9件"
      });
      that.showToast();
    }else{
      quantity = parseInt(quantity) + parseInt(1);
      wx.request({
        url: app.api.getNewCartShop,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          skuId: index,
          checked: checked,
          quantity: quantity,
          channel: 6
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          if (res.data.status == 2000) {
            wx.request({
              url: app.api.getCartShop,
              data: {
                phonetype: that.data.phoneType,
                token: that.data.token,
                channel: 6,
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (result) {
                if (result.data.status == 2000) {
                  if (result.data.data.length != 0) {
                    that.setData({
                      cartShow: false,
                      carts: []
                    });
                    for (var i = 0; i < result.data.data.length; i++) {
                      var newCart = [];
                      for (var j = 0; j < result.data.data[i].activityCarts.length; j++) {
                        var newCartList = [];
                        for (var k = 0; k < result.data.data[i].activityCarts[j].cartList.length; k++) {
                          var obj1 = new Object();
                          obj1.skuId = result.data.data[i].activityCarts[j].cartList[k].skuId;
                          obj1.isTouchMove = false;
                          obj1.brandName = result.data.data[i].activityCarts[j].cartList[k].brandName;
                          obj1.goodsName = result.data.data[i].activityCarts[j].cartList[k].goodsName;
                          obj1.msg = result.data.data[i].activityCarts[j].cartList[k].msg;
                          obj1.salePrice = result.data.data[i].activityCarts[j].cartList[k].salePrice;
                          obj1.quantity = result.data.data[i].activityCarts[j].cartList[k].quantity;
                          obj1.checked = result.data.data[i].activityCarts[j].cartList[k].checked;
                          obj1.imgUrl = result.data.data[i].activityCarts[j].cartList[k].imgUrl;
                          obj1.spuId = result.data.data[i].activityCarts[j].cartList[k].spuId;
                          obj1.sizeName = result.data.data[i].activityCarts[j].cartList[k].sizeName;
                          obj1.stock = result.data.data[i].activityCarts[j].cartList[k].stock;
                          obj1.shareDiscount = result.data.data[i].activityCarts[j].cartList[k].shareDiscount;
                          newCartList.push(obj1)
                        }
                        var obj = new Object();
                        obj.id = result.data.data[i].activityCarts[j].id;
                        obj.type = result.data.data[i].activityCarts[j].type;
                        obj.description = result.data.data[i].activityCarts[j].description;
                        obj.cartList = newCartList;
                        newCart.push(obj);
                      }
                      that.data.carts.push({
                        id: result.data.data[i].id,
                        name: result.data.data[i].name,
                        activityCarts: newCart
                      })
                    }
                    that.setData({
                      carts: that.data.carts
                    })
                  } else {
                    that.setData({
                      cartShow: true,
                    })
                  }
                } else {
                  var newTitle = result.data.msg;
                  that.setData({
                    count: 1500,
                    toastText: newTitle
                  });
                  that.showToast();
                }
              }
            })
          } else {
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
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      for (var j = 0; j < carts[i].activityCarts.length; j++) {
        for (var k = 0; k < carts[i].activityCarts[j].cartList.length; k++) {
          if (carts[i].activityCarts[j].cartList[k].isTouchMove) {
            carts[i].activityCarts[j].cartList[k].isTouchMove = false
          }
        }
      }
    }
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      carts: carts
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
    var carts = this.data.carts;
    for (var i = 0; i < carts.length; i++) {
      for (var j = 0; j < carts[i].activityCarts.length; j++) {
        for (var k = 0; k < carts[i].activityCarts[j].cartList.length; k++) {
          if (carts[i].activityCarts[j].cartList[k].isTouchMove) {
            carts[i].activityCarts[j].cartList[k].isTouchMove = false
          }
        }
      }
    }
    for (var i = 0; i < carts.length; i++) {
      for (var j = 0; j < carts[i].activityCarts.length; j++) {
        for (var k = 0; k < carts[i].activityCarts[j].cartList.length; k++) {
          if (Math.abs(angle) > 30) return;
          if (carts[i].activityCarts[j].cartList[k].skuId == index) {
            if (touchMoveX > startX) {
              carts[i].activityCarts[j].cartList[k].isTouchMove = false;
            }
            else {
              carts[i].activityCarts[j].cartList[k].isTouchMove = true;
            }
          }
        }
      }
    }
    //更新数据
    that.setData({
      carts: carts
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  del: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: app.api.delCart,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        skuId: index,
        channel: 6
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (result) {
        if (result.data.status == 2000) {
          wx.request({
            url: app.api.getCartShop,
            data: {
              phonetype: that.data.phoneType,
              token: that.data.token,
              channel: 6,
            },
            header: {
              'content-type': 'application/json'
            },
            method: "GET",
            success: function (res) {
              if (res.data.status == 2000) {
                if (res.data.data.length != 0) {
                  that.setData({
                    cartShow: false,
                    carts:that.data.carts
                  });
                  var arr = [];
                  for (var i = 0; i < res.data.data.length; i++) {
                    var newCart = [];
                    for (var j = 0; j < res.data.data[i].activityCarts.length; j++) {
                      var newCartList = [];
                      for (var k = 0; k < res.data.data[i].activityCarts[j].cartList.length; k++) {
                        var obj1 = new Object();
                        obj1.skuId = res.data.data[i].activityCarts[j].cartList[k].skuId;
                        obj1.isTouchMove = false;
                        obj1.brandName = res.data.data[i].activityCarts[j].cartList[k].brandName;
                        obj1.goodsName = res.data.data[i].activityCarts[j].cartList[k].goodsName;
                        obj1.msg = res.data.data[i].activityCarts[j].cartList[k].msg;
                        obj1.salePrice = res.data.data[i].activityCarts[j].cartList[k].salePrice;
                        obj1.quantity = res.data.data[i].activityCarts[j].cartList[k].quantity;
                        obj1.checked = res.data.data[i].activityCarts[j].cartList[k].checked;
                        obj1.imgUrl = res.data.data[i].activityCarts[j].cartList[k].imgUrl;
                        obj1.spuId = res.data.data[i].activityCarts[j].cartList[k].spuId;
                        obj1.sizeName = res.data.data[i].activityCarts[j].cartList[k].sizeName;
                        obj1.stock = res.data.data[i].activityCarts[j].cartList[k].stock;
                        obj1.shareDiscount = res.data.data[i].activityCarts[j].cartList[k].shareDiscount;
                        newCartList.push(obj1)
                      }
                      var obj = new Object();
                      obj.id = res.data.data[i].activityCarts[j].id;
                      obj.type = res.data.data[i].activityCarts[j].type;
                      obj.description = res.data.data[i].activityCarts[j].description;
                      obj.cartList = newCartList;
                      newCart.push(obj);
                    }
                    arr.push({
                      id: res.data.data[i].id,
                      name: res.data.data[i].name,
                      activityCarts: newCart
                    })
                  }
                  that.setData({
                    carts: arr
                  })
                } else {
                  that.setData({
                    cartShow: true,
                  })
                }
              } else {
                var newTitle = res.data.msg;
                that.setData({
                  count: 1500,
                  toastText: newTitle
                });
                that.showToast();
              }
            }
          })
        } else {
          var newTitle = result.data.msg;
          that.setData({
            count: 1500,
            toastText: newTitle
          });
          that.showToast();
        }
      }
    })
  },
  getData: function () {
    var that = this;
    var a = 0;
    var carts = that.data.carts;
    for (var i = 0; i < carts.length; i++) {
      for (var j = 0; j < carts[i].activityCarts.length; j++) {
        for (var k = 0; k < carts[i].activityCarts[j].cartList.length; k++) {
          if (carts[i].activityCarts[j].cartList[k].checked == 1) {
            a++;
          } else { }
        }
      }
    }
    if (a > 0) {
      wx.request({
        url: app.api.getCheckGoodsInfo,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          checked: 1,
          channel: 6
        },
        dataType: "json",
        success: function (res) {
          if (res.data.status == 2000) {
            if (res.data.data.isOpen == "true") {
              that.setData({
                shopCheckClassify: true,
                checkShop:[]
              })
              for (var i = 0; i < res.data.data.datas.length; i++) {
                that.data.checkShop.push({
                  count: res.data.data.datas[i].count,
                  id: res.data.data.datas[i].id,
                  title: res.data.data.datas[i].title,
                  check: false
                })
              }
              that.setData({
                checkShop: that.data.checkShop
              })
            } else {
              that.setData({
                shopCheckClassify: false
              })
              var cartId = res.data.data.datas[0].id;
              wx.navigateTo({
                url: '../../pages/submitOrder/submitOrder?cartId=' + cartId,
              })
            }
          }
        }
      })

    } else {
      that.setData({
        count: 1500,
        toastText: "请选择商品！"
      });
      that.showToast();
    }
  },
  selectShopClassifyList: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    for (var i = 0; i < that.data.checkShop.length; i++) {
      if (that.data.checkShop[i].id == id) {
        that.data.checkShop[i].check = true
      } else {
        that.data.checkShop[i].check = false
      }
    }
    that.setData({
      checkShop: that.data.checkShop
    })
  },
  backCart:function(){
    var that = this;
    that.setData({
      shopCheckClassify: false
    })
  },
  goPay:function(){
    var that = this;
    var cartId;
    for (var i = 0; i < that.data.checkShop.length; i++) {
      if (that.data.checkShop[i].check) {
        cartId = that.data.checkShop[i].id
      }
    }
    if (cartId != "" && cartId != null){
      wx.navigateTo({
        url: '../../pages/submitOrder/submitOrder?cartId=' + cartId,
      })
    }
  },
})
