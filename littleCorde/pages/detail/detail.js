const app = getApp();
const req = require("../../utils/request.js")
const weApi = require('../../utils/weApis.js');
const pid = 8;

app.aldstat.sendEvent('onLoad');
app.aldstat.sendEvent('onShareAppMessage');
app.aldstat.sendEvent('goDetail');
Page({
  data: {
    isShowToast: false,
    goodsData: {},
    memberData: {},
    matchData: [],
    tabTxt: ["商品描述"],
    tabTxt2: ["品牌介绍"],
    tabTxt3: ["配送方式"],
    tabTxt4: ["退货须知"],
    tab: [true],
    tab2: [true],
    tab3: [true],
    tab4: [true],
    spuId: "",
    getGoodsSkuBySpuId: [],
    display: "none",
    disabled: true,
    flag: true,
    phoneType: "",
    token: "",
    islike: 0, //收藏
    matchFlag: false, //搭配开关
    brandId: "", //商品品牌
    brandName: "", //商品品牌名
    sameBrandList: [], //同品牌商品
    otherShop: [], //其他推荐商品 
    otherId: "", //其他推荐商品id
    sharePrice: "",
    share: "none", //分享
    newShare: "none", //分享成功
    activeFlag: false,
    goodsName: "",
    salePrice: "",
    noActiveTips: true,
    actionSheetHidden: true, //分享上拉菜单开关
    spuCanvas: true, //卡片开关
    canvasImg1: "", //卡片图片1
    canvasImg2: "", //卡片图片2
    windowWidth: "0",
    windowHeight: "0",
    isScorll: "auto",
    rebate: true,
    cartBtnNumber: "",
    doubleGroupDiscount: "", //一键拼团价格
    msg: "", //国内外
    country: "", //国内外
    moreSizeCountryPoint: "",
    userInfo: null,
    loginBgFlag: false,
    ismember:false,
    siteFlag:false,
    siteInfo:{}
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
  onLoad: function(option) {
    var that = this;
    var scene = decodeURIComponent(option.scene)
    var spuId = option.spuId;
    that.setData({
      userInfo: app.globalData.userInfo
    })
    wx.getSetting({
      success: function(res) {
        console.info(res)
        console.info(res.authSetting)
        console.info(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.login({
            success: function(r) {
              var code = r.code; //登录凭证
              if (code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success: function(res) {
                    that.setData({
                      userInfo: res.userInfo
                    });
                    app.globalData.userInfo = res.userInfo;
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    if (spuId != null && spuId != "" && spuId != undefined) {
                      var groupCode = option.groupCode;
                      if (groupCode != undefined) {
                        that.setData({
                          spuId: spuId,
                          groupCode: groupCode
                        })
                        that.getShopInfo()
                        that.getUserInfoLogin(res.encryptedData, res.iv, code)
                      } else {
                        that.setData({
                          spuId: spuId,
                          groupCode: ""
                        })
                        that.getShopInfo()
                        that.getUserInfoLogin(res.encryptedData, res.iv, code)
                      }
                    }
                    if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
                      wx.request({
                        url: app.api.changeUrl,
                        data: {
                          id: scene
                        },
                        success: function(res) {
                          if (res.data != null) {
                            var qrCodePath = res.data;
                            console.info(qrCodePath)
                            console.info(qrCodePath.split("&")[0].split("=")[1])
                            console.info(qrCodePath.split("&")[1].split("=")[1])
                            that.setData({
                              spuId: qrCodePath.split("&")[0].split("=")[1],
                              groupCode: qrCodePath.split("&")[1].split("=")[1]
                            })
                            that.getShopInfo()
                            that.getUserInfoLogin(res.encryptedData, res.iv, code)
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          });
        } else {
          that.setData({
            loginBgFlag: true
          })
          if (spuId != null && spuId != "" && spuId != undefined) {
            var groupCode = option.groupCode;
            if (groupCode != undefined) {
              that.setData({
                spuId: spuId,
                groupCode: groupCode
              })
              that.getShopInfo()
            } else {
              that.setData({
                spuId: spuId,
                groupCode: ""
              })
              that.getShopInfo()
            }
          }
          if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
            wx.request({
              url: app.api.changeUrl,
              data: {
                id: scene
              },
              success: function(res) {
                if (res.data != null) {
                  var qrCodePath = res.data;
                  console.info(qrCodePath)
                  console.info(qrCodePath.split("&")[0].split("=")[1])
                  console.info(qrCodePath.split("&")[1].split("=")[1])
                  that.setData({
                    spuId: qrCodePath.split("&")[0].split("=")[1],
                    groupCode: qrCodePath.split("&")[1].split("=")[1]
                  })
                  that.getShopInfo()
                }
              }
            })
          }
        }
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })
    wx.getImageInfo({
      src: 'https://img1.cloudokids.cn/buyers/scene/spuCanvas1.png',
      success: function(res) {
        that.setData({
          spuCanvasImage: res.path
        })
      }
    })
  },
  onShow: function() {
    var that = this;
    app._dgt.trackEvent('onLoad');
    app._dgt.trackEvent('onShareAppMessage');
    app._dgt.trackEvent('addCart');
    app._dgt.trackEvent('goDetail');
    app._dgt.trackEvent('collect');
    app._dgt.trackEvent('size');
    req.analyticsLog({
      event: 'view',
      pid,
      eid: that.data.spuId
    })
  },
  getShopInfo: function() {
    var that = this;
    req.getActivityNameBySpu(that.data.spuId).then(res=>{
      if(res.status == 2000){
        if(res.data != null){
          that.setData({
            siteFlag:true,
            siteInfo:res.data
          })
        }else{
          that.setData({
            siteFlag: false
          })
        }
      }else{
        that.setData({
          siteFlag: false
        })
      }
    })
    var imTitle;
    //获取商品信息
    wx.request({
      url: app.api.getGoodsDetail,
      method: 'GET',
      data: {
        spuId: that.data.spuId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var rebate = res.data.data.categorySaleGoodsResult.rebate
        if (rebate > 0) {
          that.setData({
            rebateMoney: rebate
          })
        }
        that.setData({
          activeFlag: res.data.data.categorySaleGoodsResult.activityFlag,
          goodsName: res.data.data.categorySaleGoodsResult.goodsName,
          salePrice: res.data.data.categorySaleGoodsResult.salePrice,
          canvasImg1: res.data.data.categorySaleGoodsResult.imgs[0],
          sharePrice: res.data.data.categorySaleGoodsResult.discountMoney,
          goodsData: res.data.data.categorySaleGoodsResult,
          brandId: res.data.data.categorySaleGoodsResult.brandId,
          brandName: res.data.data.categorySaleGoodsResult.brandName,
          point: res.data.data.categorySaleGoodsResult.point,
          activityContent: res.data.data.categorySaleGoodsResult.activityContent,
          goodsCost: res.data.data.categorySaleGoodsResult.salePrice,
          doubleGroupDiscount: res.data.data.categorySaleGoodsResult.doubleGroupDiscount,
          activityId: res.data.data.categorySaleGoodsResult.activityId,
          warehouseFlag: res.data.data.categorySaleGoodsResult.warehouseFlag,
          warehouseMsg: res.data.data.categorySaleGoodsResult.warehouseMsg,
        })
        if (res.data.data.categorySaleGoodsResult.activityFlag == false) {
          that.setData({
            share: "none", //分享
            newShare: "none", //分享成功
          })
        } else {

        }
        var WxParse = require('../../wxParse/wxParse.js');
        var article = res.data.data.categorySaleGoodsResult.buyerEdit;
        if (article != null) {
          WxParse.wxParse('article', 'html', article, that, 0);
        }
        var postWay = res.data.data.shipping;
        if (postWay != null) {
          WxParse.wxParse('postWay', 'html', postWay, that, 0);
        }
        var salesReturn = res.data.data.returns;
        if (salesReturn != null) {
          WxParse.wxParse('salesReturn', 'html', salesReturn, that, 0);
        }
        imTitle = res.data.data.categorySaleGoodsResult.goodsName;
        wx.setNavigationBarTitle({
          title: imTitle,
        })
        app.tdsdk.iap.viewItem({
          id: that.data.spuId,
          name: that.data.goodsName,
          category: "",
          unitPrice: that.data.salePrice,
          count: 1
        });
        //获取同品牌商品
        wx.request({
          url: app.api.getProductsByBrandId,
          data: {
            brandId: that.data.brandId,
            startIndex: 1,
            pageSize: 20
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              that.setData({
                sameBrandList: res.data.data.datas
              })
            }
          }
        });
        wx.request({
          url: app.api.getOtherRecommend,
          data: {
            spuId: that.data.spuId,
            pageNumber: 1,
            pageSize: 20
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              that.setData({
                otherShop: res.data.data.goodsResultList.datas,
                otherId: res.data.data.categoryId
              })
            }
          }
        });
      },
      complete: function() {
        wx.getStorage({
          key: 'token',
          success: function(res) {
            that.setData({
              token: res.data
            });
            wx.getStorage({
              key: 'phoneType',
              success: function(res) {
                that.setData({
                  phoneType: res.data
                });
                that.getNewData(that.data.groupCode);
                //查询商品是否收藏
                wx.request({
                  url: app.api.favoriteBySPUidAndMemberId,
                  data: {
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    channel: 6,
                    spuId: that.data.spuId
                  },
                  header: {
                    "content-type": "application/json"
                  },
                  method: "GET",
                  success: function(result) {
                    if (result.data.status == 2000) {
                      if (result.data.data == true) {
                        that.setData({
                          islike: 1
                        });
                      } else {
                        that.setData({
                          islike: 0
                        });
                      }
                    }
                  }
                })
                //查询是否点赞
                wx.request({
                  url: app.api.getCollageBySpuId,
                  method: 'GET',
                  data: {
                    spuId: that.data.spuId,
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    channel: 6
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function(res) {
                    that.setData({
                      matchData: []
                    })
                    if (res.data.data == false) {
                      that.setData({
                        matchflag: false
                      });
                    } else {
                      if (res.data.data.length < 3) {
                        that.setData({
                          matchData: res.data.data
                        });
                      } else {
                        for (var i = 0; i < 3; i++) {
                          that.data.matchData.push({
                            img: res.data.data[i].img,
                            id: res.data.data[i].id,
                            avatar: res.data.data[i].avatar,
                            nickname: res.data.data[i].nickname,
                            description: res.data.data[i].description,
                            isLike: res.data.data[i].isLike
                          })
                        }
                        that.setData({
                          matchData: that.data.matchData
                        })
                      }
                    }
                  }
                })
                if (that.data.activityFlag) {
                  wx.request({
                    url: app.api.getShareAndShoppingLog,
                    data: {
                      token: that.data.token,
                      phonetype: that.data.phoneType,
                      spuId: spuId,
                      channel: 6
                    },
                    success: function(res) {
                      if (res.data.status == 2000) {
                        if (res.data.data.status == 0 && res.data.data.result == "商品未分享") {
                          that.setData({
                            share: "block",
                            newShare: "none"
                          })
                        }
                        if (res.data.data.status == 0 && res.data.data.result == "商品已分享") {
                          that.setData({
                            share: "none",
                            newShare: "block"
                          })
                          var newPrice = (parseFloat(that.data.goodsData.salePrice) - parseFloat(that.data.sharePrice)).toFixed(2);
                          that.data.goodsData.salePrice = newPrice;
                          that.setData({
                            goodsData: that.data.goodsData
                          })
                        }
                        if (res.data.data.status == 1) {
                          that.setData({
                            share: "none",
                            newShare: "none"
                          })
                        }
                      }
                    }
                  })
                }
                // 拉去会员信息
                wx.request({
                  url: app.api.getProductRate,
                  data: {
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    channel: 6,
                    spuId: that.data.spuId, 
                    price: that.data.goodsData.salePrice
                  },
                  dataType: "json",
                  success: function(res) {
                    if (res.data.status == 2000) {
                      that.setData({
                        memberData: res.data.data
                      })
                    }
                  }
                })
              },
            });
          },
          fail: function() {
            that.setData({
              islike: 0
            });
            //查询是否点赞
            wx.request({
              url: app.api.getCollageBySpuId,
              method: 'GET',
              data: {
                spuId: that.data.spuId
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                that.setData({
                  matchData: []
                })
                if (res.data.data == false) {
                  that.setData({
                    matchflag: false
                  });
                } else {
                  if (res.data.data.length < 3) {
                    that.setData({
                      matchData: res.data.data
                    });
                  } else {
                    for (var i = 0; i < 3; i++) {
                      that.data.matchData.push({
                        img: res.data.data[i].img,
                        id: res.data.data[i].id,
                        avatar: res.data.data[i].avatar,
                        nickname: res.data.data[i].nickname,
                        description: res.data.data[i].description,
                        isLike: res.data.data[i].isLike
                      })
                    }
                    that.setData({
                      matchData: that.data.matchData
                    })
                  }
                }
              }
            })
          }
        });
      }
    });
  },
  addCollageLike: function(e) {
    var that = this;
    var id = e.target.dataset.id;
    var token = that.data.token;
    var phoneType = that.data.phoneType;
    if (token != null && token != "" && phoneType != null && phoneType != "") {
      wx.request({
        url: app.api.addCollageLike,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: 6,
          collageId: id
        },
        header: {
          "content-type": "application/json"
        },
        method: "GET",
        success: function(res) {
          if (res.data.status == 2000) {
            that.setData({
              count: 1500,
              toastText: "搭配点赞成功！"
            });
            that.showToast();
            wx.request({
              url: app.api.getCollageBySpuId,
              method: 'GET',
              data: {
                spuId: that.data.spuId,
                token: that.data.token,
                phonetype: that.data.phoneType,
                channel: 6
              },
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                that.setData({
                  matchData: []
                })
                if (res.data.data == false) {
                  that.setData({
                    matchflag: false
                  });
                } else {
                  if (res.data.data.length < 3) {
                    that.setData({
                      matchData: res.data.data
                    });
                  } else {
                    for (var i = 0; i < 3; i++) {
                      that.data.matchData.push({
                        img: res.data.data[i].img,
                        id: res.data.data[i].id,
                        avatar: res.data.data[i].avatar,
                        nickname: res.data.data[i].nickname,
                        description: res.data.data[i].description,
                        isLike: res.data.data[i].isLike
                      })
                    }
                    that.setData({
                      matchData: that.data.matchData
                    })
                  }
                }
              }
            });
          }
        }
      })
    }
  },
  flodFn: function() {
    this.setData({
      isFold: !this.isFold
    });
  },
  filterTab: function(e) {
    var data = [true];
    data[0] = !this.data.tab[0];
    this.setData({
      tab: data
    })
  },
  filterTab2: function(e) {
    var data = [true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab2[index];
    this.setData({
      tab2: data
    })
  },
  filterTab3: function(e) {
    var data = [true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab3[index];
    this.setData({
      tab3: data
    })
  },
  filterTab4: function(e) {
    var data = [true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab4[index];
    this.setData({
      tab4: data
    })
  },
  // 收藏
  collect: function(e) {
    var that = this;
    var islike = that.data.islike;
    if (!islike) {
      wx.request({
        url: app.api.addFavorite,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          SPUId: that.data.spuId,
          channel: 6
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
          if (res.data.status == 2000) {
            that.setData({
              count: 1500,
              toastText: "收藏成功！"
            });
            that.showToast();
            that.setData({
              islike: 1
            });
          }
        }
      })
    } else {
      wx.request({
        url: app.api.deleteFavorite,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          SPUId: that.data.spuId,
          channel: 6
        },
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        success: function(res) {
          if (res.data.status == 2000) {
            that.setData({
              count: 1500,
              toastText: "删除收藏成功！"
            });
            that.showToast();
            that.setData({
              islike: 0
            });
          }
        }
      })
    }
  },
  //尺码对照表
  size: function() {
    var brandId = this.data.goodsData.brandId;
    wx.navigateTo({
      url: '../../pages/size/size?brandId=' + brandId,
    })
  },
  //获取尺码
  buyShop: function(e) {
    var that = this;
    var spuId = that.data.spuId;
    var group = e.currentTarget.dataset.group;
    !!group ? that.setData({ groupNum: group }) : that.setData({ groupNum:"" })
    that.setData({
      cartBtnNumber: "1"
    })
    if (that.data.activeFlag == false) {
      wx.request({
        url: app.api.getGoodsSkuBySpuId,
        data: {
          spuId: spuId
        },
        header: {
          "content-type": "application/json"
        },
        method: "GET",
        success: function(res) {
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
    } else {
      if (that.data.share == "block") {
        wx.request({
          url: app.api.getGoodsSkuBySpuId,
          data: {
            spuId: spuId
          },
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          success: function(res) {
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
      }
      if (that.data.newShare == "block") {
        wx.request({
          url: app.api.getGoodsSkuBySpuId,
          data: {
            spuId: spuId
          },
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          success: function(res) {
            if (res.data.status == 2000) {
              that.setData({
                getGoodsSkuBySpuId: []
              })
              for (var i = 0; i < res.data.data.length; i++) {
                that.data.getGoodsSkuBySpuId.push({
                  id: res.data.data[i].id,
                  stock: res.data.data[i].stock,
                  specificationValue: res.data.data[i].specificationValue,
                  salePrice: (parseFloat(res.data.data[i].salePrice) - parseFloat(res.data.data[i].discountsMoeny)).toFixed(2),
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
      }
      if (that.data.share == "none" && that.data.newShare == "none") {
        wx.request({
          url: app.api.getGoodsSkuBySpuId,
          data: {
            spuId: spuId
          },
          header: {
            "content-type": "application/json"
          },
          method: "GET",
          success: function(res) {
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
      }
    }
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
    var stock = e.target.dataset.stock;
    var id = e.target.dataset.id;
    var flag = that.data.flag;
    var price = e.target.dataset.price;
    if (stock != 0) {
      that.setData({
        disabled: false
      })
      that.data.getGoodsSkuBySpuId.forEach(function(v, i) {
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
              moreSizeCountryPoint: ""
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
  //买手
  skip: function(e) {
    var buyerId = e.target.dataset.id;
    wx.redirectTo({
      url: '../../pages/buyer/buyer?buyerId=' + buyerId,
    })
  },
  addCart: function(e) {
    var that = this;
    var skuId;
    var cartId;
    that.data.getGoodsSkuBySpuId.forEach(function(v, i) {
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
        success: function(res) {
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
            that.data.getGoodsSkuBySpuId.forEach(function(v, i) {
              v.hidden = "none";
            })
            that.setData({
              getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId
            })
            app.tdsdk.iap.addItem({
              id: skuId,
              name: that.data.goodsName,
              category: "",
              unitPrice: that.data.salePrice,
              count: 1
            })
            if (that.data.groupNum) that.goSitePage()
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
            wx.getSetting({
              success: function(res) {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                  wx.login({
                    success: function(r) {
                      var code = r.code; //登录凭证
                      if (code) {
                        wx.getUserInfo({
                          withCredentials: true,
                          success: function(res) {
                            that.setData({
                              userInfo: res.userInfo
                            });
                            app.globalData.userInfo = res.userInfo;
                            that.getUserInfoLogin(res.encryptedData, res.iv, code)
                          }
                        })
                      }
                    }
                  })
                } else {
                  that.setData({
                    loginBgFlag: true
                  })
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
  wantGoCart: function() {
    wx.switchTab({
      url: '../../pages/cart/index',
    })
  },
  goDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  onShareAppMessage: function(options) {
    var that = this;
    app.tdsdk.customShare(options)
    req.analyticsLog({
      event: 'share',
      sid: 1,
      eid: that.data.spuId || ''

    })
    if (options.from == "menu") {
      return {
        title: that.data.brandName + " " + that.data.goodsName,
        path: 'pages/detail/detail?spuId=' + that.data.spuId,
        imageUrl: that.data.canvasImg1,
        success: function(res) {
          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function(res) {
              var encryptedData = res.encryptedData;
              var iv = res.iv;
            },
          })
        },
        fail: function(res) {
          // 转发失败
        }
      }
    } else {
      if (options.target.dataset.id == 1) {
        var groupCode = that.data.groupCode;
        if (groupCode != null && groupCode != "") {
          return {
            title: that.data.brandName + " " + that.data.goodsName,
            path: 'pages/detail/detail?spuId=' + that.data.spuId + "&groupCode=" + groupCode,
            imageUrl: that.data.canvasImg1,
            success: function(res) {
              that.setData({
                actionSheetHidden: true
              })
              var shareTickets = res.shareTickets;
              if (shareTickets.length == 0) {
                return false;
              }
              wx.getShareInfo({
                shareTicket: shareTickets[0],
                success: function(res) {
                  var encryptedData = res.encryptedData;
                  var iv = res.iv;
                }
              })
            },
            fail: function(res) {
              // 转发失败
            }
          }
        } else {
          return {
            title: that.data.brandName + " " + that.data.goodsName,
            path: 'pages/detail/detail?spuId=' + that.data.spuId,
            imageUrl: that.data.canvasImg1,
            success: function(res) {
              that.setData({
                actionSheetHidden: true
              })
              var shareTickets = res.shareTickets;
              if (shareTickets.length == 0) {
                return false;
              }
              wx.getShareInfo({
                shareTicket: shareTickets[0],
                success: function(res) {
                  var encryptedData = res.encryptedData;
                  var iv = res.iv;
                }
              })
            },
            fail: function(res) {
              // 转发失败
            }
          }
        }
      }
      if (options.target.dataset.id == 2) {
        return {
          title: "超级福利，分享后立减" + that.data.sharePrice + "元，仅需" + (parseFloat(that.data.salePrice) - parseFloat(that.data.sharePrice)).toFixed(2) + "元，" + that.data.brandName + " " + that.data.goodsName,
          path: 'pages/detail/detail?spuId=' + that.data.spuId,
          imageUrl: that.data.canvasImg1,
          success: function(res) {
            var shareTickets = res.shareTickets;
            if (shareTickets == null) {
              that.setData({
                count: 1500,
                toastText: "请分享到微信群"
              });
              that.showToast();
            }
            if (shareTickets.length == 0) {
              return false;
            }
            wx.getShareInfo({
              shareTicket: shareTickets[0],
              success: function(res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
                wx.request({
                  url: app.api.insertShareLog,
                  data: {
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    spuId: that.data.spuId,
                    channel: 6
                  },
                  method: "POST",
                  header: {
                    "content-type": "application/x-www-form-urlencoded"
                  },
                  success: function(res) {
                    var newTitle = res.data.data;
                    that.setData({
                      count: 1500,
                      toastText: newTitle
                    });
                    that.showToast();
                    wx.request({
                      url: app.api.getShareAndShoppingLog,
                      data: {
                        token: that.data.token,
                        phonetype: that.data.phoneType,
                        spuId: that.data.spuId,
                        channel: 6
                      },
                      success: function(res) {
                        if (res.data.status == 2000) {
                          if (res.data.data.status == 0 && res.data.data.result == "商品未分享") {
                            that.setData({
                              share: "block",
                              newShare: "none"
                            })
                          }
                          if (res.data.data.status == 0 && res.data.data.result == "商品已分享") {
                            that.setData({
                              share: "none",
                              newShare: "block"
                            })
                            var newPrice = (parseFloat(that.data.goodsData.salePrice) - parseFloat(that.data.sharePrice)).toFixed(2);
                            that.data.goodsData.salePrice = newPrice;
                            that.setData({
                              goodsData: that.data.goodsData
                            })
                          }
                          if (res.data.data.status == 1) {
                            that.setData({
                              share: "none",
                              newShare: "none"
                            })
                          }
                        }
                      }
                    })
                  }
                })
              }
            })
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }
      if (options.target.dataset.id == 3) {
        var groupCode = that.data.groupCode;
        return {
          title: that.data.brandName + " " + that.data.goodsName,
          path: 'pages/detail/detail?spuId=' + that.data.spuId + "&groupCode=" + groupCode,
          imageUrl: that.data.canvasImg1,
          success: function(res) {
            var shareTickets = res.shareTickets;
            if (shareTickets.length == 0) {
              return false;
            }
            wx.getShareInfo({
              shareTicket: shareTickets[0],
              success: function(res) {
                var encryptedData = res.encryptedData;
                var iv = res.iv;
              }
            })
          },
          fail: function(res) {
            // 转发失败
          }
        }
      }
    }
  },
  goDisplay: function() {
    var that = this;
    that.setData({
      noActiveTips: false
    })
  },
  shareList: function() {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  bindItemTap: function() {
    var that = this;
    console.info(that)
    var title = that.data.goodsName;
    if (/^[\u4e00-\u9fa5]/.test(title)) {
      if (title.length > 20) {
        title = title.substring(0, 20) + "..."
      }
    } else {
      if (title.length > 40) {
        title = title.substring(0, 40) + "..."
      }
    }
    const timer = setInterval(function() {
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
          src: that.data.canvasImg1.replace(/http:/g, 'https:'),
          success: function(res) {
            grd.addColorStop(0, '#ffffff')
            grd.addColorStop(1, '#ffffff')
            ctx.setFillStyle(grd)
            ctx.fillRect(0, 0, 280, 400)
            ctx.setFillStyle("black")
            ctx.drawImage(that.data.spuCanvasImage, 56, 0, 168, 90)
            ctx.setFontSize(12)
            ctx.setTextAlign('center')
            ctx.fillText(that.data.brandName, 140, 220)
            ctx.setTextAlign('center')
            ctx.fillText(title, 140, 240)
            ctx.setTextAlign('center')
            ctx.fillText("¥" + that.data.salePrice, 140, 260)
            ctx.drawImage(res.path, 80, 70, 120, 120)
            ctx.drawImage(that.data.canvasImg2, 100, 270, 80, 80)
            ctx.setFontSize(10)
            ctx.setTextAlign('center')
            ctx.fillText("长按扫码查看详情", 140, 370)
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
  goIndex: function() {
    wx.switchTab({
      url: '../../pages/home/index',
      success: function() {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  submit: function(e) {
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
        success: function(res) {}
      })
    }
  },
  getShowLmg: function(groupCode) {
    var that = this;
    var groupCode = groupCode;
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/detail/detail?spuId=' + that.data.spuId + "&groupCode=" + groupCode
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
            console.log(data.tempFilePath)
          }
        })
      }
    })
  },
  getNewData: function(groupCode) {
    var that = this;
    var groupCode = groupCode;
    if (groupCode != null && groupCode != "") {
      that.setData({
        groupCode: groupCode
      })
      that.getShowLmg(that.data.groupCode)
      wx.request({
        url: app.api.bindMemberIntroduce,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: "6",
          introduceCode: groupCode
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.info(res)
          if (res.data.status == 2000) {

          }
          if (res.data.status == 2013) {
            that.getLogin(groupCode);
          }
        }
      })
    } else {
      wx.request({
        url: app.api.getMemberIsIntroducer,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: "6"
        },
        success: function(res) {
          if (res.data.status == 2000) {
            if (res.data.data.outcome) {
              if (res.data.data.introducer.status == 2) {
                that.setData({
                  groupCode: res.data.data.introducer.introduceCode,
                });
                that.getShowLmg(that.data.groupCode)
                if (that.data.rebateMoney > 0) {
                  that.setData({
                    rebate: false
                  });
                } else {
                  that.setData({
                    rebate: true
                  });
                }
              } else {
                that.setData({
                  rebate: false
                });
                that.setData({
                  groupCode: ""
                });
                that.getShowLmg("")
              }
            } else {
              that.setData({
                groupCode: "",
                rebate: true
              })
              that.getShowLmg("")
            }
          }
        }
      })
    }
  },
  getLogin: function(groupCode) {
    var that = this;
    var groupCode = groupCode;
    wx.login({
      success: function(r) {
        var code = r.code; //登录凭证
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function(res) {
              that.setData({
                userInfo: res.userInfo
              });
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              wx.request({
                url: app.api.weChatAppletLogin, //自己的服务接口地址
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code
                },
                success: function(data) {
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
            }
          })
        }
      }
    })
  },
  swiperchange: function() {},
  promptlyBuy: function() {
    var that = this;
    that.setData({
      cartBtnNumber: "2"
    })
    that.getGoodsSkuBySpuId();
  },
  buyShopGroup: function() {
    var that = this;
    that.setData({
      cartBtnNumber: "3"
    })
    wx.request({
      url: app.api.getGroupInfo,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: "",
        activeId: that.data.activityId,
        groupType: "4",
        activeStatus: "1"
      },
      dataType: "json",
      method: "GET",
      success: function(data) {
        console.info(data)
        if (data.data.status == 2000) {
          that.setData({
            groupId: data.data.data.id
          })
          if (data.data.data.spuId == null) {
            that.getGoodsSkuBySpuId();
          } else {
            if (data.data.data.spuId == that.data.spuId) {
              if (data.data.data.orderSn == null) {
                that.getGoodsSkuBySpuId();
              } else {
                wx.showModal({
                  title: '您已经发起过此类拼单',
                  content: '是否跳到分享页面进行分享',
                  cancelText: "否",
                  confirmText: "是",
                  success: function(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../successGroupOrder/successGroupOrder?path=' + that.data.groupId + "_" + data.data.data.orderSn,
                      })
                    } else if (res.cancel) {

                    }
                  }
                })
              }
            } else {
              wx.showModal({
                title: '拼团商品不一致',
                content: '是否跳到拼团商品进行拼团',
                cancelText: "否",
                confirmText: "是",
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: '../detail/detail?spuId=' + data.data.data.spuId
                    })
                  } else if (res.cancel) {

                  }
                }
              })
            }
          }
        }
        if (data.data.status == 6003) {
          wx.request({
            url: app.api.insertGroupBooking,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: "6",
              activityId: that.data.activityId,
              type: "4"
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.status == 2000) {
                that.setData({
                  groupId: res.data.data
                })
                that.getGoodsSkuBySpuId();
              }
              if (res.data.status == 2013) {
                that.getLogin(that.data.groupCode);
              }
              if (res.data.status != 2000 && res.data.status != 2013) {
                that.setData({
                  count: 1500,
                  toastText: res.data.msg
                });
                that.showToast();
              }
            }
          })
        }
      }
    })
  },
  getGoodsSkuBySpuId: function() {
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
      success: function(res) {
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
  bindGetUserInfo: function() {
    var that = this;
    wx.login({
      success: function(r) {
        var code = r.code; //登录凭证
        if (code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function(res) {
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
  getUserInfoLogin: function(encryptedData, iv, code) {
    var that = this;
    wx.request({
      url: app.api.weChatAppletLogin, //自己的服务接口地址
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        encryptedData: encryptedData,
        iv: iv,
        code: code,
      },
      success: function(data) {
        if (data.data.status == 2000) {
          var token = data.data.data.token;
          var phoneType = data.data.data.phonetype;
          var memberId = data.data.data.userInfo.id;
          that.setData({
            token: token,
            phoneType: phoneType,
            memberId: memberId,
            getUserInfoLogin: false
          });
          wx.setStorageSync('token', token);
          wx.setStorageSync('phoneType', phoneType);
          wx.setStorageSync('memberId', memberId);
          that.getNewData(that.data.groupCode);
        }
      }
    })
  },
  ismemberh:function(){
    var that=this;
    that.setData({
      ismember: false,
    });
  },
  ismembers: function () {
    var that = this;
    that.setData({
      ismember: true,
    });
  },
  goSitePage:function(){
    var that = this;
    wx.navigateTo({
      url: '../newStyleRoll/newStyleRoll?activityId=' + that.data.siteInfo.activityId + '&groupType=6' ,
    })
  },
  weService() {
    req.analyticsLog({
      event: 'cocs',
      pid,
      eid: this.data.spuId
    });
  }
})