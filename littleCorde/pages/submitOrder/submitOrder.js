var app = getApp();
Page({
  data: {
    token: "",
    phoneType: "",
    addressDisplay: "",
    address: [], //地址
    selectAddress: "", //选择的地址
    shop: [], //商品
    shippingMethod: true,
    expressList: [], //快递列表,
    selectListId: "", //选择的快递列表id
    discount: "使用优惠券",
    giftCard: "使用礼品卡",
    checkedPoint: false, //是否选中积分
    point: {}, //积分
    money: {}, // 金额
    comment: '',
    cartId: "",
    isShowToast: false,
    groupFlag: false, //拼单活动
    groupId: ""
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
  onLoad: function (options) {
    var that = this;
    app._dgt.trackEvent('submitMyOrder');
    that.setData({
      cartId: options.cartId,
      money: {}
    })
    wx.removeStorage({
      key: 'discount',
      success: function (res) {
      }
    })
    wx.removeStorage({
      key: 'giftCard',
      success: function (res) {
      }
    })
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
            //地址列表
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
                      address: res.data.data
                    })
                    var a = 0;
                    that.data.address.forEach(function (v, i) {
                      if (v.isDefault == 1) {
                        if (that.data.cartId == 2) {
                          if (v.idCardNumber != null && v.idCardNumber != "" || v.province == 3595 || v.province == 3623 || v.province == 3634) {
                            a++;
                            if (that.data.selectAddress == "") {
                              that.setData({
                                selectAddress: v
                              })
                            }
                          }
                        } else {
                          a++
                          if (that.data.selectAddress == "") {
                            that.setData({
                              selectAddress: v
                            })
                          }
                        }
                      } else {
                        var id = that.data.selectAddress.id
                        that.data.address.forEach(function (v, i) {
                          if (v.id == id) {
                            that.setData({
                              addressDisplay: false,
                              selectAddress: v
                            })
                          }
                        })
                      }
                    })
                    if (a > 0) {
                      that.setData({
                        addressDisplay: false,
                      })
                    }
                  } else {
                    that.setData({
                      addressDisplay: true
                    })
                  }
                }
              }
            })
            var selectAddress = that.data.selectAddress;
            if (selectAddress != "") {
              that.setData({
                addressDisplay: false,
              })
            } else {
              that.setData({
                addressDisplay: true,
              })
            }
            if (that.data.cartId == 1) {

            } else {
              //快递列表
              wx.request({
                url: app.api.getExpressList,
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
                    that.setData({
                      expressList: []
                    })
                    for (var i = -0; i < res.data.data.length; i++) {
                      that.data.expressList.push({
                        id: res.data.data[i].id,
                        name: res.data.data[i].name,
                        freight: res.data.data[i].freight,
                        description: res.data.data[i].description,
                        checked: false,
                      })
                    }
                    that.setData({
                      expressList: that.data.expressList
                    })
                  }
                }
              })
            }
            //获取用户可用积分
            wx.request({
              url: app.api.getPoint,
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
                  that.setData({
                    point: res.data.data
                  })
                }
              }
            })
          },
        })
      },
    })
  },
  onShow: function () {
    var that = this;
    that.setData({
      money: {}
    })
    wx.getStorage({
      key: 'discount',
      success: function (res) {
        if (res.data == "") {
          that.setData({
            discount: "使用优惠券"
          })
        } else {
          that.setData({
            discount: res.data
          })
        }
      },
      fail: function (res) {
        that.setData({
          discount: "使用优惠券"
        })
      }
    })
    wx.getStorage({
      key: 'giftCard',
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            giftCard: "使用礼品卡"
          })
        } else {
          that.setData({
            giftCard: res.data
          })
        }
      },
    })
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
            //获取订单金额
            var discount = that.data.discount;
            var giftCard = that.data.giftCard;
            var flag = that.data.checkedPoint;
            //商品
            wx.request({
              url: app.api.getCartListInfo,
              data: {
                token: that.data.token,
                phonetype: that.data.phoneType,
                checked: 1,
                channel: 6,
                cartId: that.data.cartId
              },
              header: {
                "content-type": "application/json"
              },
              method: "GET",
              success: function (res) {
                console.info(res)
                console.info(res.data.data.activityCarts)
                if (res.data.status == 2000) {
                  that.setData({
                    shop: res.data.data.activityCarts[0].cartList
                  })
                  var a = 0;
                  that.data.shop.forEach(function (v, i) {
                    if (v.overseaExpressFlag == true) {
                      a++;
                    }
                  })
                  if (a > 0) {
                    that.setData({
                      shippingMethod: true
                    })
                  } else {
                    that.setData({
                      shippingMethod: false
                    })
                  }
                  if (discount == "使用优惠券") {
                    if (giftCard == "使用礼品卡") {
                      if (!flag) {
                        that.getAllMoney(that.data.selectListId, "", "", "")
                      } else {
                        that.getAllMoney(that.data.selectListId, that.data.point.point, "", "")
                      }
                    } else {
                      if (!flag) {
                        var newGiftCard = "";
                        for (var i = 0; i < giftCard.length; i++) {
                          newGiftCard += giftCard[i] + ","
                        }
                        newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
                        that.getAllMoney(that.data.selectListId, "", newGiftCard, "")
                      } else {
                        var newGiftCard = "";
                        for (var i = 0; i < giftCard.length; i++) {
                          newGiftCard += giftCard[i] + ","
                        }
                        newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
                        that.getAllMoney(that.data.selectListId, that.data.point.point, newGiftCard, "")
                      }
                    }
                  } else {
                    if (giftCard == "使用礼品卡") {
                      if (!flag) {
                        that.getAllMoney(that.data.selectListId, "", "", discount)
                      } else {
                        that.getAllMoney(that.data.selectListId, that.data.point.point, "", discount)
                      }
                    } else {
                      if (!flag) {
                        var newGiftCard = "";
                        for (var i = 0; i < giftCard.length; i++) {
                          newGiftCard += giftCard[i] + ","
                        }
                        newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
                        that.getAllMoney(that.data.selectListId, "", newGiftCard, discount)
                      } else {
                        var newGiftCard = "";
                        for (var i = 0; i < giftCard.length; i++) {
                          newGiftCard += giftCard[i] + ","
                        }
                        newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
                        that.getAllMoney(that.data.selectListId, that.data.point.point, newGiftCard, discount)
                      }
                    }
                  }
                }
                wx.request({
                  url: app.api.getMemberIsGroup,
                  data: {
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    channel: "6"
                  },
                  success: function (res) {
                    console.info(res)
                    if (res.data.data.outcome == false) {
                      that.setData({
                        groupFlag: false
                      })
                    } else {
                      that.setData({
                        groupFlag: true,
                        groupId: res.data.data.groupId
                      })
                    }
                  }
                })
              }
            })
          },
        })
      },
    })
    var selectAddress = that.data.selectAddress;
    if (selectAddress != "") {
      that.setData({
        addressDisplay: false,
      })
    } else {
      that.setData({
        addressDisplay: true,
      })
    }
  },
  //选择快递方式
  selectList: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var flag = that.data.checkedPoint;
    that.data.expressList.forEach(function (v, i) {
      if (v.id == id) {
        v.checked = true,
          that.setData({
            selectListId: v.id
          })
        var discount = that.data.discount;
        var giftCard = that.data.giftCard;
        var flag = that.data.checkedPoint;
        if (discount == "使用优惠券") {
          if (giftCard == "使用礼品卡") {
            if (!flag) {
              that.getAllMoney(that.data.selectListId, "", "", "")

            } else {
              that.getAllMoney(that.data.selectListId, that.data.point.point, "", "")
            }
          } else {
            if (!flag) {
              var newGiftCard = "";
              for (var i = 0; i < giftCard.length; i++) {
                newGiftCard += giftCard[i] + ","
              }
              newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
              that.getAllMoney(that.data.selectListId, "", newGiftCard, "")
            } else {
              var newGiftCard = "";
              for (var i = 0; i < giftCard.length; i++) {
                newGiftCard += giftCard[i] + ","
              }
              newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
              that.getAllMoney(that.data.selectListId, that.data.point.point, newGiftCard, "")
            }
          }
        } else {
          if (giftCard == "使用礼品卡") {
            if (!flag) {
              that.getAllMoney(that.data.selectListId, "", "", discount)
            } else {
              that.getAllMoney(that.data.selectListId, that.data.point.point, "", discount)
            }
          } else {
            if (!flag) {
              var newGiftCard = "";
              for (var i = 0; i < giftCard.length; i++) {
                newGiftCard += giftCard[i] + ","
              }
              newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
              that.getAllMoney(that.data.selectListId, "", newGiftCard, discount)
            } else {
              var newGiftCard = "";
              for (var i = 0; i < giftCard.length; i++) {
                newGiftCard += giftCard[i] + ","
              }
              newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
              that.getAllMoney(that.data.selectListId, that.data.point.point, newGiftCard, discount)
            }
          }
        }
      } else {
        v.checked = false
      }
    })
    that.setData({
      expressList: that.data.expressList
    })
  },
  //选择积分
  selectPoint: function () {
    var that = this;
    var flag = that.data.checkedPoint;
    var discount = that.data.discount;
    var giftCard = that.data.giftCard;
    if (!flag) {
      that.setData({
        checkedPoint: true
      })
      if (that.data.giftCard == "使用礼品卡") {
        if (that.data.discount == "使用优惠券") {
          that.getAllMoney(that.data.selectListId, that.data.point.point, "", "")
        } else {
          that.getAllMoney(that.data.selectListId, that.data.point.point, "", that.data.discount)
        }
      } else {
        var newGiftCard = "";
        for (var i = 0; i < giftCard.length; i++) {
          newGiftCard += giftCard[i] + ","
        }
        newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
        if (that.data.discount == "使用优惠券") {
          that.setData({
            checkedPoint: true
          })
          that.getAllMoney(that.data.selectListId, that.data.point.point, newGiftCard, "")
        } else {
          that.setData({
            checkedPoint: true
          })
          that.getAllMoney(that.data.selectListId, that.data.point.point, newGiftCard, that.data.discount)
        }
      }
    } else {
      that.setData({
        checkedPoint: false
      })
      if (that.data.giftCard == "使用礼品卡") {
        if (that.data.discount == "使用优惠券") {
          that.getAllMoney(that.data.selectListId, "", "", "")
        } else {
          that.getAllMoney(that.data.selectListId, "", "", that.data.discount)
        }
      } else {
        var newGiftCard = "";
        for (var i = 0; i < giftCard.length; i++) {
          newGiftCard += giftCard[i] + ","
        }
        newGiftCard = newGiftCard.substring(0, newGiftCard.length - 1);
        if (that.data.discount == "使用优惠券") {
          that.getAllMoney(that.data.selectListId, "", newGiftCard, "")
        } else {
          that.getAllMoney(that.data.selectListId, "", newGiftCard, that.data.discount)
        }
      }
    }
  },
  //选择地址
  selectAddress: function () {
    wx.navigateTo({
      url: '../../pages/address/address?selectSign=addressMark&cartId=' + this.data.cartId,
    })
  },
  //
  getUserComment: function (e) {
    this.setData({
      comment: e.detail.value
    });
  },
  //提交订单
  submitMyOrder: function () {
    var that = this;
    var giftCardString = that.data.giftCard;
    var discountCountString = that.data.discount;
    var userHasPoint = that.data.point.point;;
    if (giftCardString == "使用礼品卡") {
      giftCardString = "";
    }
    if (discountCountString == "使用优惠券") {
      discountCountString = "";
    }
    if (that.data.checkedPoint == false) {
      userHasPoint = ""
    }
    if (that.data.selectAddress.id != null && that.data.selectAddress.id != "") {
      if (that.data.cartId == "1") {
        wx.request({
          url: app.api.submitMyOrder,
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: {
            token: that.data.token,
            phonetype: that.data.phoneType,
            channel: 6,
            amount: that.data.money.amount,
            actualAmount: that.data.money.actualAmount,
            payMoney: that.data.money.payMoney,
            addressId: that.data.selectAddress.id,
            giftCardNumber: giftCardString,
            point: userHasPoint,
            discountCardNumber: discountCountString,
            expressId: that.data.selectListId,
            comment: that.data.comment,
            postcode: that.data.selectAddress.postcode,
            cartId: that.data.cartId
          },
          success: function (result) {
            if (result.data.status == 2000) {
              var payMoneyGo = result.data.data.payMoney;
              var orderSnGo = result.data.data.orderSn;
              var userCode;
              var payMoney = parseInt(payMoneyGo * 100)
              if (payMoneyGo > 0) {
                app.tdsdk.iap.placeOrder({
                  orderId: orderSnGo,
                  amount: payMoney,
                  currencyType: 'CNY',
                  item: []
                });
                wx.login({
                  success: function (r) {
                    userCode = r.code;
                    wx.request({
                      url: app.api.weChatAppletPay,
                      header: {
                        "content-type": "application/json"
                      },
                      method: "GET",
                      data: {
                        token: that.data.token,
                        phonetype: that.data.phoneType,
                        channel: 6,
                        orderSn: orderSnGo,
                        payMoney: payMoneyGo,
                        payId: 2,
                        code: userCode
                      },
                      success: function (result) {
                        var timeStamp = result.data.data.timeStamp;
                        var nonceStr = result.data.data.nonceStr;
                        var packageNew = result.data.data.package;
                        var signNew = result.data.data.sign;
                        wx.requestPayment(
                          {
                            'timeStamp': timeStamp,
                            'nonceStr': nonceStr,
                            'package': packageNew,
                            'signType': 'MD5',
                            'paySign': signNew,
                            'success': function (res) {
                              app.tdsdk.iap.currencyPurchase({
                                orderId: orderSnGo,
                                amount: payMoney,
                                currencyType: 'CNY',
                                itemId: [],
                                payType: 'wxChatPay',
                                itemCount: 1
                              });
                              wx.navigateTo({
                                url: '../../pages/success/success?orderId=' + orderSnGo,
                              })
                            },
                            'fail': function (res) {
                              wx.navigateTo({
                                url: '../../pages/orderInfo/orderInfo?orderId=' + orderSnGo,
                              })
                            },
                            'complete': function (res) {
                            }
                          })
                      }
                    })
                  }
                });
              } else {
                app.tdsdk.iap.currencyPurchase({
                  orderId: orderSnGo,
                  amount: 0,
                  currencyType: 'CNY',
                  itemId: [],
                  payType: 'wxChatPay',
                  itemCount: 1
                });
                wx.reLaunch({
                  url: '../../pages/success/success?orderId=' + orderSnGo,
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
        if (that.data.selectListId != null && that.data.selectListId != "") {
          wx.request({
            url: app.api.submitMyOrder,
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6,
              amount: that.data.money.amount,
              actualAmount: that.data.money.actualAmount,
              payMoney: that.data.money.payMoney,
              addressId: that.data.selectAddress.id,
              giftCardNumber: giftCardString,
              point: userHasPoint,
              discountCardNumber: discountCountString,
              expressId: that.data.selectListId,
              comment: that.data.comment,
              postcode: that.data.selectAddress.postcode,
              cartId: that.data.cartId
            },
            success: function (result) {
              if (result.data.status == 2000) {
                var payMoneyGo = result.data.data.payMoney;
                var orderSnGo = result.data.data.orderSn;
                var userCode;
                var payMoney = parseInt(payMoneyGo * 100)
                if (payMoneyGo > 0) {
                  app.tdsdk.iap.placeOrder({
                    orderId: orderSnGo,
                    amount: payMoney,
                    currencyType: 'CNY',
                    item: []
                  });
                  wx.login({
                    success: function (r) {
                      userCode = r.code;
                      wx.request({
                        url: app.api.weChatAppletPay,
                        header: {
                          "content-type": "application/json"
                        },
                        method: "GET",
                        data: {
                          token: that.data.token,
                          phonetype: that.data.phoneType,
                          channel: 6,
                          orderSn: orderSnGo,
                          payMoney: payMoneyGo,
                          payId: 2,
                          code: userCode
                        },
                        success: function (result) {
                          var timeStamp = result.data.data.timeStamp;
                          var nonceStr = result.data.data.nonceStr;
                          var packageNew = result.data.data.package;
                          var signNew = result.data.data.sign;
                          wx.requestPayment(
                            {
                              'timeStamp': timeStamp,
                              'nonceStr': nonceStr,
                              'package': packageNew,
                              'signType': 'MD5',
                              'paySign': signNew,
                              'success': function (res) {
                                app.tdsdk.iap.currencyPurchase({
                                  orderId: orderSnGo,
                                  amount: payMoney,
                                  currencyType: 'CNY',
                                  itemId: [],
                                  payType: 'wxChatPay',
                                  itemCount: 1
                                });
                                wx.navigateTo({
                                  url: '../../pages/success/success?orderId=' + orderSnGo,
                                })
                              },
                              'fail': function (res) {
                                wx.navigateTo({
                                  url: '../../pages/orderInfo/orderInfo?orderId=' + orderSnGo,
                                })
                              },
                              'complete': function (res) {
                              }
                            })
                        }
                      })
                    }
                  });
                } else {
                  app.tdsdk.iap.currencyPurchase({
                    orderId: orderSnGo,
                    amount: 0,
                    currencyType: 'CNY',
                    itemId: [],
                    payType: 'wxChatPay',
                    itemCount: 1
                  });
                  wx.reLaunch({
                    url: '../../pages/success/success?orderId=' + orderSnGo,
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
          that.setData({
            count: 1500,
            toastText: '请选择配送方式'
          });
          that.showToast();
        }
      }
    } else {
      that.setData({
        count: 1500,
        toastText: '请选择地址'
      });
      that.showToast();
    }
  },
  discount: function () {
    var that = this;
    // if (that.data.groupFlag) {
    //   wx.showModal({
    //     title: "提示",
    //     content: "您现在是拼单用户，使用优惠券需要退出拼单，是否退出",
    //     cancelText: "取消",
    //     confirmText: "退出",
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.request({
    //           url: app.api.quitGroupBooking,
    //           data: {
    //             token: that.data.token,
    //             phonetype: that.data.phoneType,
    //             channel: "6",
    //             groupId: that.data.groupId,
    //           },
    //           method: "POST",
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded'
    //           },
    //           success: function (res) {
    //             if (res.data.status == 2000) {
    //               that.setData({
    //                 count: 1500,
    //                 toastText: res.data.data,
    //                 groupFlag: false
    //               });
    //               that.showToast();
    //               setTimeout(function () {
    //                 wx.navigateTo({
    //                   url: '../../pages/selectDiscount/selectDiscount?cartId=' + that.data.cartId + "&pageCome=1",
    //                 })
    //               }, 2000)
    //             } else {
    //               that.setData({
    //                 count: 1500,
    //                 toastText: res.data.msg,
    //               });
    //               that.showToast();
    //             }
    //           }
    //         })
    //       } else {

    //       }
    //     }
    //   })
    // } else {
    //   
    // }
    wx.navigateTo({
      url: '../../pages/selectDiscount/selectDiscount?cartId=' + that.data.cartId + "&pageCome=1",
    })
  },
  giftCard: function () {
    wx.navigateTo({
      url: '../../pages/selectGiftCard/selectGiftCard?cartId=' + this.data.cartId + "&pageCome=1",
    })
  },
  getAllMoney: function (expressId, point, giftCardNumber, discountCardNumber) {
    var that = this;
    var point = point;
    var expressId = expressId;
    var point = point;
    var giftCardNumber = giftCardNumber;
    var discountCardNumber = discountCardNumber;
    wx.request({
      url: app.api.getAllMoney,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: 6,
        discountCardNumber: discountCardNumber,
        giftCardNumber: giftCardNumber,
        point: point,
        expressId: expressId,
        cartId: that.data.cartId
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (res) {
        switch (res.data.status) {
          case 2000:
            that.setData({
              money: res.data.data
            })
            break;
          case 2003:
            var title = res.data.msg;
            that.setData({
              count: 1500,
              toastText: title
            });
            that.showToast();
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
            break;
          case 3010:
            var title = res.data.msg;
            that.setData({
              count: 1500,
              toastText: title
            });
            that.showToast();
            that.setData({
              checkedPoint: false
            })
            that.getAllMoney(expressId, "", giftCardNumber, discountCardNumber)
            break;
          case 3039:
            var title = res.data.msg;
            that.setData({
              count: 1500,
              toastText: title
            });
            that.showToast();
            that.setData({
              discount: "使用优惠券"
            })
            wx.removeStorage({
              key: 'discount',
              success: function (res) {

              },
            })
            that.getAllMoney(expressId, point, giftCardNumber, "")
            break;
          case 3025:
            var title = res.data.msg;
            that.setData({
              count: 1500,
              toastText: title
            });
            that.showToast();
            that.setData({
              discount: "使用优惠券"
            })
            wx.removeStorage({
              key: 'discount',
              success: function (res) {

              },
            })
            that.getAllMoney(expressId, point, giftCardNumber, "")
            break;
        }
      }
    })
  }
})