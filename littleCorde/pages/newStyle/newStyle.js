var app = getApp();
const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const pid = 7;
app.aldstat.sendEvent('onLoad');
app.aldstat.sendEvent('onShareAppMessage');
app.aldstat.sendEvent('goDetail');
var pageSize = 20;
var pageCome;
var specialId;
var queryString; //搜索
var commonUrl;
var index;
var val = {};
var list= [];
var getMoreGoods = function(that, commonUrl, parm, index) {
  if (that.data.maxPage && parm.pageNumber > that.data.maxPage) {
    that.setData({
      hiddenInfo: 'none',
      isAllHiddenInfo: 'block',
    });
    return
  }
  if (that.data.sortInfo == undefined || that.data.sortInfo == null || that.data.sortInfo == '') {
    that.setData({
      sortInfo: ""
    })
  };
  if (that.data.colorId == undefined || that.data.colorId == null || that.data.colorId == '') {
    that.setData({
      colorId: ""
    })
  };
  if (that.data.brandId == undefined || that.data.brandId == null || that.data.brandId == '') {
    that.setData({
      brandId: ""
    })
  };
  if (that.data.ageId == undefined || that.data.ageId == null || that.data.ageId == '') {
    that.setData({
      ageId: ""
    })
  };
  if (that.data.classId == undefined || that.data.classId == null || that.data.classId == '') {
    that.setData({
      classId: ""
    })
  };
  if (that.data.genderId == undefined || that.data.genderId == null || that.data.genderId == '') {
    that.setData({
      genderId: ""
    })
  };
  if (that.data.seasonId == undefined || that.data.seasonId == null || that.data.seasonId == '') {
    that.setData({
      seasonId: ""
    })
  };
  if (that.data.minPrice == undefined || that.data.minPrice == null || that.data.minPrice == '') {
    that.setData({
      minPrice: ""
    })
  };
  if (that.data.maxPrice == undefined || that.data.maxPrice == null || that.data.maxPrice == '') {
    that.setData({
      maxPrice: ""
    })
  };
  that.setData({
    hidden: false,
  });
  wx.request({
    url: req.weiXinUrl + commonUrl,
    data: parm,
    success: function(res) {
      console.log(res,'resmore');
      if (res.data.status == 2000) {
        if (res.data.data) {
          if (res.data.data.total != null && res.data.data.total != "") {
            var maxPage = Math.ceil(res.data.data.total / 20);
            that.setData({
              maxPage: maxPage
            })
          }
        }
      }
      if (index == 3) {
        that.setData({
          brandBanner: res.data.data.img,
          brandText: res.data.data.description
        })
        wx.getImageInfo({
          src: that.data.brandBanner,
          success: function(res) {
            that.setData({
              canvasImg2: res.path
            })
          }
        })
      }
      if (index == 4 || index == 3) {
        that.setData({
          imTitle: res.data.data.title
        })
      }
      if (res.data.data == "null" || res.data.data == null) {
        if (that.data.list.length > 0) {
          that.setData({
            hiddenInfo: 'none',
            isAllHiddenInfo: 'block',
          });
        } else {
          that.setData({
            hiddenInfo: 'block',
            isAllHiddenInfo: 'none',
          });
        }
      } else {
        let list =  that.data.list;
        let newList = res.data.data.datas;
        var spuIdStr = [];
        for (var i = 0; i < res.data.data.datas.length; i++) {
          spuIdStr.push(res.data.data.datas[i].spuId)
        }
        that.setData({
          list: [...list, ...newList],
          spuIdStr: spuIdStr,
          hiddenInfo: 'none',
          isAllHiddenInfo: 'none'
        });
        //会员
        var spuIdStrs = spuIdStr.join(",")
        if (spuIdStrs) {
          var MemberspuIdStrs = that.data.MemberspuIdStrs;
          wx.request({
            url: app.api.getMemberGoodsRateListByTopicAndSpu,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: 6,
              spuIdStr: spuIdStrs
            },
            success: function(res) {
              if (res.data.status == 2000) {
                for (var i = 0; i < res.data.data.length; i++) {
                  var spuid = res.data.data[i].spuId;
                  val[spuid] = res.data.data[i];
                }
              };
              that.setData({
                MemberspuIdStrs: val
              })
            }
          })
        }
        if (res.data.data.datas.length == 0 && that.data.list.length == 0) {
          that.setData({
            hiddenInfo: 'block',
            isAllHiddenInfo: 'none'
          });
        }
        if (res.data.data.datas.length == 0 && that.data.list.length != 0) {
          that.setData({
            hiddenInfo: 'none',
            isAllHiddenInfo: 'block',
          });
        }
      }
      that.data.pageNumber++;
      that.setData({
        pageNumber: that.data.pageNumber
      })
      if (index == 1) {
        that.data.parm.pageNumber = that.data.pageNumber
      }
      if (index == 2 || index == 3 || index == 4 || index == 5) {
        that.data.parm.startIndex = that.data.pageNumber
      }
      that.setData({
        hidden: true,
        parm: that.data.parm
      });
      if (index == 3) {
        var title = that.data.imTitle;
        if (title.indexOf("!") > -1) {
          var title = title.replace("!", "&")
        } else {
          var title = title
        }
        wx.setNavigationBarTitle({
          title: title,
        })
      }
      if (index == 2 || index == 4) {
        wx.setNavigationBarTitle({
          title: res.data.data.title,
        })
      }
    }

  });
}
Page({
  data: {
    hidden: true,
    list: [],
    spuIdStr: [],
    MemberspuIdStrs: [],
    scrollTop: 0,
    scrollHeight: 0,
    isHidden: true,
    rankingData: [],
    hiddenInfo: 'none',
    isAllHiddenInfo: 'none', //数据没有
    goNext: true,
    allWrapHidden: "none",
    color: [], //颜色
    brand: [], //品牌
    size: [], // 尺码
    gender: [], //性别
    category: [], //分类
    value: [], //年龄
    attr: [], //季节
    sizeStatus: "none", // 尺码状态展开还是闭合
    attrStatus: "none", //季节状态
    colorStatus: "none", //颜色状态
    classifyStatus: "none", //分类状态
    ageStatus: "none", // 年龄状态
    brandStatus: "none", //品牌状态
    sexArr: [],
    seasonArr: [],
    ageArr: [],
    colorArr: [],
    brandArr: [],
    classifyArr: [],
    sizeArr: [],
    ageId: "",
    seasonId: "",
    genderId: "",
    colorId: "",
    brandId: "",
    classId: "",
    sizeId: "",
    sortInfo: "",
    minPrice: "",
    maxPrice: "",
    parm: {},
    pageNumber: 1,
    imTitle: "",
    specialTopicVOS: [],
    specialTopicId: "",
    specialBanner: "",
    redGroup: false,
    actionSheetHidden: true, //分享上拉菜单开关
    imgUrl: "", //生成的图片链接
    imgFlag: false, //图片开关
    token: "",
    phoneType: "",
    groupCode: "",
    canvasImg1: "", //卡片图片1
    canvasImg2: "", //卡片图片2
    loginBgFlag: false,
  },
  onLoad: function(option) {
    var that = this;
    that.setData({ specialId: option.specialId})
    app._dgt.trackEvent('onLoad');
    app._dgt.trackEvent('onShareAppMessage');
    app._dgt.trackEvent('goDetail');
    wx.getImageInfo({
      src: 'https://img1.cloudokids.cn/buyers/scene/spuCanvas1.png',
      success: function(res) {
        that.setData({
          canvasImg1: res.path
        })
      }
    })
    var scene = decodeURIComponent(option.scene)
    if (scene != null && scene != "" && scene != undefined && scene != "undefined") {
      console.info("22222222222222222222222222222")
      wx.request({
        url: app.api.changeUrl,
        data: {
          id: scene
        },
        success: function(res) {
          if (res.data != null) {
            var qrCodePath = res.data;
            console.info(qrCodePath)
            specialId = qrCodePath.split("&")[0].split("=")[1];
            pageCome = qrCodePath.split("&")[1].split("=")[1];
            groupCode = qrCodePath.split("&")[2].split("=")[1];
            that.setData({
              groupCode: groupCode
            })
            that.getNewList(specialId, pageCome, groupCode)
          }
        }
      })
    } else {
      console.info("1111111111111111111111111111")
      console.info(option)
      var groupCode = option.groupCode;
      specialId = option.specialId;
      pageCome = option.pageCome;
      imTitle: option.title;
      queryString = option.queryString;
      if (groupCode != undefined) {
        that.setData({
          groupCode: groupCode
        })
        that.getNewList(specialId, pageCome, groupCode)
      } else {
        that.setData({
          groupCode: ""
        })
        that.getNewList(specialId, pageCome, "")
      }
    }
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        });
      }
    });
    wx.request({
      url: app.api.getRankingInfo,
      success: function(res) {
        for (var i = 0; i < res.data.data.length; i++) {
          that.data.rankingData.push({
            index: res.data.data[i].index,
            name: res.data.data[i].name,
            checkHidden: true
          })
        }
        that.setData({
          rankingData: that.data.rankingData
        });
      }
    });
    
  },
  onShow(){
    let that = this;
    req.analyticsLog({
      pid,
      eid: that.data.specialId
    })
  },
  getNewList: function(specialId, pageCome, groupCode) {
    var that = this;
    switch (pageCome) {
      case "1":
        wx.request({
          url: app.api.getSpecialById,
          data: {
            id: specialId
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              that.setData({
                specialBanner: res.data.img
              })
              wx.setNavigationBarTitle({
                title: res.data.title,
              })
              wx.getImageInfo({
                src: that.data.specialBanner,
                success: function(res) {
                  that.setData({
                    canvasImg2: res.path
                  })
                }
              })
              if (res.data.specialTopicVOS.length == 1) {
                that.setData({
                  specialTopicId: res.data.specialTopicVOS[0].id
                })
              } else {
                that.setData({
                  specialTopicVOS: res.data.specialTopicVOS,
                  specialTopicId: res.data.specialTopicVOS[0].id
                })
              }
              wx.request({
                url: app.api.getAttrInfo,
                dataType: "json",
                data: {
                  specialTopicId: that.data.specialTopicId,
                  version: "10000."
                },
                success: function(res) {
                  if (res.data.status == 2000) {
                    if (res.data.data.brand != undefined) {
                      for (var i = 0; i < res.data.data.brand.length; i++) {
                        that.data.brand.push({
                          index: res.data.data.brand[i].index,
                          name: res.data.data.brand[i].name,
                          flag: false
                        })
                      }
                    }
                    if (res.data.data.color != undefined) {
                      for (var i = 0; i < res.data.data.color.length; i++) {
                        that.data.color.push({
                          index: res.data.data.color[i].index,
                          name: res.data.data.color[i].name,
                          flag: false
                        })
                      }
                    }
                    if (res.data.data.sizes != undefined) {
                      for (var i = 0; i < res.data.data.sizes.length; i++) {
                        that.data.size.push({
                          index: res.data.data.sizes[i].index,
                          name: res.data.data.sizes[i].name,
                          flag: false
                        })
                      }
                    }
                    if (res.data.data.value != undefined) {
                      for (var i = 0; i < res.data.data.value.length; i++) {
                        that.data.value.push({
                          index: res.data.data.value[i].index,
                          name: res.data.data.value[i].name,
                          flag: false
                        })
                      }
                    }
                    if (res.data.data.gender != undefined) {
                      for (var i = 0; i < res.data.data.gender.length; i++) {
                        that.data.gender.push({
                          index: res.data.data.gender[i].index,
                          name: res.data.data.gender[i].name,
                          flag: false
                        })
                      }
                    }
                    if (res.data.data.category != undefined) {
                      for (var i = 0; i < res.data.data.category.length; i++) {
                        that.data.category.push({
                          index: res.data.data.category[i].index,
                          name: res.data.data.category[i].name,
                          flag: false
                        })
                      }
                    }
                    if (res.data.data.attr.length > 0) {
                      if (res.data.data.attr[0].datas != undefined) {
                        for (var i = 0; i < res.data.data.attr[0].datas.length; i++) {
                          that.data.attr.push({
                            index: res.data.data.attr[0].datas[i].index,
                            name: res.data.data.attr[0].datas[i].name,
                            flag: false
                          })
                        }
                      }
                    }
                    that.setData({
                      attr: that.data.attr,
                      brand: that.data.brand,
                      color: that.data.color,
                      size: that.data.size,
                      value: that.data.value,
                      gender: that.data.gender,
                      category: that.data.category,
                    })
                  }
                }

              })
            }
          }
        });
        commonUrl = "API/homepage/getSpecial",
          index = 1;
        that.setData({
          parm: {
            version: 10000.,
            specialId: specialId,
            specialTopicId: that.data.specialTopicId,
            pageNumber: that.data.pageNumber,
            pageSize: 20,
            sortInfo: that.data.sortInfo,
            minPrice: that.data.minPrice,
            maxPrice: that.data.maxPrice,
            brands: that.data.brandId,
            categorySales: that.data.classId,
            colors: that.data.colorId,
            values: that.data.ageId,
            genders: that.data.genderId,
            attrIds: that.data.seasonId,
            sizes: that.data.sizeId
          },
        })
        break;
      case "2":
        commonUrl = "API/categorySales/getProductsByCategoryId",
          index = 2;
        that.setData({
          parm: {
            version: 10000.,
            categoryId: specialId,
            flag: true,
            startIndex: that.data.pageNumber,
            pageSize: 20,
            sortInfo: that.data.sortInfo,
            minPrice: that.data.minPrice,
            maxPrice: that.data.maxPrice,
            brands: that.data.brandId,
            categorySales: that.data.classId,
            colors: that.data.colorId,
            values: that.data.ageId,
            genders: that.data.genderId,
            attrIds: that.data.seasonId,
            sizes: that.data.sizeId
          },
        })
        wx.request({
          url: app.api.getSpecialById,
          data: {
            id: specialId
          },
          dataType: "json",
          success: function(result) {
            if (result.data.status == 2000) {
              that.setData({
                specialTopicId: result.data.specialTopicVOS[0].id
              })
            }
          }
        })
        wx.request({
          url: app.api.getQueryInfoByCategoryId,
          data: {
            flag: true,
            categoryId: specialId,
            version: "10000."
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              if (res.data.data.brand != undefined) {
                for (var i = 0; i < res.data.data.brand.length; i++) {
                  that.data.brand.push({
                    index: res.data.data.brand[i].index,
                    name: res.data.data.brand[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.color != undefined) {
                for (var i = 0; i < res.data.data.color.length; i++) {
                  that.data.color.push({
                    index: res.data.data.color[i].index,
                    name: res.data.data.color[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.sizes != undefined) {
                for (var i = 0; i < res.data.data.sizes.length; i++) {
                  that.data.size.push({
                    index: res.data.data.sizes[i].index,
                    name: res.data.data.sizes[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.value != undefined) {
                for (var i = 0; i < res.data.data.value.length; i++) {
                  that.data.value.push({
                    index: res.data.data.value[i].index,
                    name: res.data.data.value[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.gender != undefined) {
                for (var i = 0; i < res.data.data.gender.length; i++) {
                  that.data.gender.push({
                    index: res.data.data.gender[i].index,
                    name: res.data.data.gender[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.category != undefined) {
                for (var i = 0; i < res.data.data.category.length; i++) {
                  that.data.category.push({
                    index: res.data.data.category[i].index,
                    name: res.data.data.category[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.attr.length > 0) {
                if (res.data.data.attr[0].datas != undefined) {
                  for (var i = 0; i < res.data.data.attr[0].datas.length; i++) {
                    that.data.attr.push({
                      index: res.data.data.attr[0].datas[i].index,
                      name: res.data.data.attr[0].datas[i].name,
                      flag: false
                    })
                  }
                }
              }
              that.setData({
                attr: that.data.attr,
                brand: that.data.brand,
                color: that.data.color,
                size: that.data.size,
                value: that.data.value,
                gender: that.data.gender,
                category: that.data.category,
              })
            }
          }
        })
        break;
      case "3":
        commonUrl = "API/brand/getProductsByBrandId",
          index = 3;
        that.setData({
          parm: {
            version: 10000.,
            brandId: specialId,
            startIndex: that.data.pageNumber,
            pageSize: 20,
            sortInfo: that.data.sortInfo,
            minPrice: that.data.minPrice,
            maxPrice: that.data.maxPrice,
            brands: that.data.brandId,
            categorySales: that.data.classId,
            colors: that.data.colorId,
            values: that.data.ageId,
            genders: that.data.genderId,
            attrIds: that.data.seasonId,
            sizes: that.data.sizeId
          },
        })
        wx.request({
          url: app.api.getQueryInfoByBrandId,
          data: {
            brandId: specialId,
            version: "10000."
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              if (res.data.data.brand != undefined) {
                for (var i = 0; i < res.data.data.brand.length; i++) {
                  that.data.brand.push({
                    index: res.data.data.brand[i].index,
                    name: res.data.data.brand[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.color != undefined) {
                for (var i = 0; i < res.data.data.color.length; i++) {
                  that.data.color.push({
                    index: res.data.data.color[i].index,
                    name: res.data.data.color[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.sizes != undefined) {
                for (var i = 0; i < res.data.data.sizes.length; i++) {
                  that.data.size.push({
                    index: res.data.data.sizes[i].index,
                    name: res.data.data.sizes[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.value != undefined) {
                for (var i = 0; i < res.data.data.value.length; i++) {
                  that.data.value.push({
                    index: res.data.data.value[i].index,
                    name: res.data.data.value[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.gender != undefined) {
                for (var i = 0; i < res.data.data.gender.length; i++) {
                  that.data.gender.push({
                    index: res.data.data.gender[i].index,
                    name: res.data.data.gender[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.category != undefined) {
                for (var i = 0; i < res.data.data.category.length; i++) {
                  that.data.category.push({
                    index: res.data.data.category[i].index,
                    name: res.data.data.category[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.attr.lenght > 0) {
                if (res.data.data.attr[0].datas != undefined) {
                  for (var i = 0; i < res.data.data.attr[0].datas.length; i++) {
                    that.data.attr.push({
                      index: res.data.data.attr[0].datas[i].index,
                      name: res.data.data.attr[0].datas[i].name,
                      flag: false
                    })
                  }
                }
              }
              that.setData({
                attr: that.data.attr,
                brand: that.data.brand,
                color: that.data.color,
                size: that.data.size,
                value: that.data.value,
                gender: that.data.gender,
                category: that.data.category,
              })
            }
          }
        })
        break;
      case "4":
        commonUrl = "API/categorySales/getProductsByCategoryId";
        index = 4;
        that.setData({
          parm: {
            version: 10000.,
            categoryId: specialId,
            flag: false,
            startIndex: that.data.pageNumber,
            pageSize: 20,
            sortInfo: that.data.sortInfo,
            minPrice: that.data.minPrice,
            maxPrice: that.data.maxPrice,
            brands: that.data.brandId,
            categorySales: that.data.classId,
            colors: that.data.colorId,
            values: that.data.ageId,
            genders: that.data.genderId,
            attrIds: that.data.seasonId,
            sizes: that.data.sizeId
          }
        })
        wx.request({
          url: app.api.getQueryInfoByCategoryId,
          data: {
            flag: false,
            categoryId: specialId,
            version: "10000."
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              if (res.data.data.brand != undefined) {
                for (var i = 0; i < res.data.data.brand.length; i++) {
                  that.data.brand.push({
                    index: res.data.data.brand[i].index,
                    name: res.data.data.brand[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.color != undefined) {
                for (var i = 0; i < res.data.data.color.length; i++) {
                  that.data.color.push({
                    index: res.data.data.color[i].index,
                    name: res.data.data.color[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.sizes != undefined) {
                for (var i = 0; i < res.data.data.sizes.length; i++) {
                  that.data.size.push({
                    index: res.data.data.sizes[i].index,
                    name: res.data.data.sizes[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.value != undefined) {
                for (var i = 0; i < res.data.data.value.length; i++) {
                  that.data.value.push({
                    index: res.data.data.value[i].index,
                    name: res.data.data.value[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.gender != undefined) {
                for (var i = 0; i < res.data.data.gender.length; i++) {
                  that.data.gender.push({
                    index: res.data.data.gender[i].index,
                    name: res.data.data.gender[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.category != undefined) {
                for (var i = 0; i < res.data.data.category.length; i++) {
                  that.data.category.push({
                    index: res.data.data.category[i].index,
                    name: res.data.data.category[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.attr[0].datas != undefined) {
                for (var i = 0; i < res.data.data.attr[0].datas.length; i++) {
                  that.data.attr.push({
                    index: res.data.data.attr[0].datas[i].index,
                    name: res.data.data.attr[0].datas[i].name,
                    flag: false
                  })
                }
              }
              that.setData({
                attr: that.data.attr,
                brand: that.data.brand,
                color: that.data.color,
                size: that.data.size,
                value: that.data.value,
                gender: that.data.gender,
                category: that.data.category,
              })
            }
          }
        })
        break;
      case "5":
        commonUrl = "ESApi/goodsSearch/search";
        index = 5;
        that.setData({
          imTitle: queryString
        })
        that.setData({
          parm: {
            version: 10000.,
            startIndex: that.data.pageNumber,
            pageSize: 20,
            sortInfo: that.data.sortInfo,
            minPrice: that.data.minPrice,
            maxPrice: that.data.maxPrice,
            brands: that.data.brandId,
            categorySales: that.data.classId,
            colors: that.data.colorId,
            values: that.data.ageId,
            genders: that.data.genderId,
            attributes: that.data.seasonId,
            sizes: that.data.sizeId,
            queryString: queryString
          }
        })
        wx.request({
          url: app.api.getQueryInfoByQueryString,
          data: {
            queryString: queryString
          },
          dataType: "json",
          success: function(res) {
            if (res.data.status == 2000) {
              if (res.data.data.brand != undefined) {
                for (var i = 0; i < res.data.data.brand.length; i++) {
                  that.data.brand.push({
                    index: res.data.data.brand[i].index,
                    name: res.data.data.brand[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.color != undefined) {
                for (var i = 0; i < res.data.data.color.length; i++) {
                  that.data.color.push({
                    index: res.data.data.color[i].index,
                    name: res.data.data.color[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.sizes != undefined) {
                for (var i = 0; i < res.data.data.sizes.length; i++) {
                  that.data.size.push({
                    index: res.data.data.sizes[i].index,
                    name: res.data.data.sizes[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.value != undefined) {
                for (var i = 0; i < res.data.data.value.length; i++) {
                  that.data.value.push({
                    index: res.data.data.value[i].index,
                    name: res.data.data.value[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.gender != undefined) {
                for (var i = 0; i < res.data.data.gender.length; i++) {
                  that.data.gender.push({
                    index: res.data.data.gender[i].index,
                    name: res.data.data.gender[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.category != undefined) {
                for (var i = 0; i < res.data.data.category.length; i++) {
                  that.data.category.push({
                    index: res.data.data.category[i].index,
                    name: res.data.data.category[i].name,
                    flag: false
                  })
                }
              }
              if (res.data.data.attr.length > 0) {
                if (res.data.data.attr[0].datas != undefined) {
                  for (var i = 0; i < res.data.data.attr[0].datas.length; i++) {
                    that.data.attr.push({
                      index: res.data.data.attr[0].datas[i].index,
                      name: res.data.data.attr[0].datas[i].name,
                      flag: false
                    })
                  }
                }
              }
              that.setData({
                attr: that.data.attr,
                brand: that.data.brand,
                color: that.data.color,
                size: that.data.size,
                value: that.data.value,
                gender: that.data.gender,
                category: that.data.category,
              })
            }
          }
        })
        break;
    }
    that.setData({
      list: []
    });
    that.setData({
      pageNumber: 1
    })
    if (index == 1) {
      that.data.parm.pageNumber = that.data.pageNumber
    }
    if (index == 2 || index == 3 || index == 4 || index == 5) {
      that.data.parm.startIndex = that.data.pageNumber
    }
    that.setData({
      parm: that.data.parm
    })
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
            getMoreGoods(that, commonUrl, that.data.parm, index);
            if (groupCode != null && groupCode != "") {
              that.setData({
                groupCode: groupCode
              })
              that.qrCode(that.data.groupCode)
              that.getBindStstus(that.data.groupCode)
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
                          groupCode: res.data.data.introducer.introduceCode
                        })
                        that.qrCode(that.data.groupCode)
                      } else {
                        that.setData({
                          groupCode: ""
                        })
                        that.qrCode("")
                      }
                    } else {
                      that.setData({
                        groupCode: ""
                      })
                      that.qrCode("")
                    }
                  }
                }
              })
            }
          },
        })
      },
      fail: function() {
        that.getLogin(that.data.groupCode)
      }
    });
  },
  bindDownLoad: function() {
    var that = this;
    switch (pageCome) {
      case "1":
        if (that.data.maxPage + 1 < that.data.parm.pageNumber) {
          console.log(1)
          that.setData({
            hiddenInfo: 'none',
            isAllHiddenInfo: 'block',
          })
        } else {
          console.log(2)
          getMoreGoods(that, commonUrl, that.data.parm, index)
        }
        break;
      default:
        if (that.data.maxPage + 1 < that.data.parm.startIndex) {
          console.log(3)
          that.setData({
            hiddenInfo: 'none',
            isAllHiddenInfo: 'block',
          })
        } else {
          console.log(4)
          getMoreGoods(that, commonUrl, that.data.parm, index)
        }
        break;
    }
  },
  goDetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  //排序筛选
  goRanking: function() {
    var that = this;
    that.setData({
      goNext: !that.data.goNext,
      isHidden: !that.data.isHidden
    });
  },
  //排序点击
  goCheck: function(e) {
    var that = this;
    var selectIndex = e.target.dataset.index;
    that.data.rankingData.forEach(function(v, e) {
      if (v.index == selectIndex) {
        v.checkHidden = false;
      } else {
        v.checkHidden = true;
      }
    });
    that.setData({
      pageNumber: 1,
      sortInfo: selectIndex
    })
    that.data.parm.sortInfo = selectIndex;
    if (index == 1) {
      that.data.parm.pageNumber = that.data.pageNumber
    }
    if (index == 2 || index == 3 || index == 4 || index == 5) {
      that.data.parm.startIndex = that.data.pageNumber
    }
    that.data.parm.specialTopicId = that.data.specialTopicId;
    that.setData({
      parm: that.data.parm
    })
    that.setData({
      rankingData: that.data.rankingData,
      isHidden: true,
      list: [],
      goNext: true,
      parm: that.data.parm,
    });
    getMoreGoods(that, commonUrl, that.data.parm, index)
    req.analyticsLog({
      event: 'sort',
      ...that.data.parm,
      eid: that.data.specialId
    })
  },
  //点击筛选
  goFilter: function() {
    var that = this;
    var status = that.data.allWrapHidden;
    if (status == "none") {
      that.setData({
        allWrapHidden: "block"
      })
    } else {
      that.setData({
        allWrapHidden: "none"
      })
    }
    that.setData({
      goNext: true,
      isHidden: true
    });
  },
  brandStatus: function() {
    var that = this;
    var flag = that.data.brandStatus;
    if (flag == "none") {
      that.setData({
        brandStatus: "block"
      })
    } else {
      that.setData({
        brandStatus: "none"
      })
    }
  },
  ageStatus: function() {
    var that = this;
    var flag = that.data.ageStatus;
    if (flag == "none") {
      that.setData({
        ageStatus: "block"
      })
    } else {
      that.setData({
        ageStatus: "none"
      })
    }
  },
  classifyStatus: function() {
    var that = this;
    var flag = that.data.classifyStatus;
    if (flag == "none") {
      that.setData({
        classifyStatus: "block"
      })
    } else {
      that.setData({
        classifyStatus: "none"
      })
    }
  },
  colorStatus: function() {
    var that = this;
    var flag = that.data.colorStatus;
    if (flag == "none") {
      that.setData({
        colorStatus: "block"
      })
    } else {
      that.setData({
        colorStatus: "none"
      })
    }
  },
  sizeStatus: function() {
    var that = this;
    var flag = that.data.sizeStatus;
    if (flag == "none") {
      that.setData({
        sizeStatus: "block"
      })
    } else {
      that.setData({
        sizeStatus: "none"
      })
    }
  },
  attrStatus: function() {
    var that = this;
    var flag = that.data.attrStatus;
    if (flag == "none") {
      that.setData({
        attrStatus: "block"
      })
    } else {
      that.setData({
        attrStatus: "none"
      })
    }
  },
  closeBg: function() {
    var that = this;
    var status = that.data.allWrapHidden;
    if (status == "none") {
      that.setData({
        allWrapHidden: "block"
      })
    } else {
      that.setData({
        allWrapHidden: "none"
      })
    }
  },
  BrandClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.brand.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            brand: that.data.brand
          })
        }
      })
    } else {
      that.data.brand.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            brand: that.data.brand
          })
        }
      })
    }
  },
  genderClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.gender.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            gender: that.data.gender
          })
        }
      })
    } else {
      that.data.gender.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            gender: that.data.gender
          })
        }
      })
    }
  },
  ageClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.value.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            value: that.data.value
          })
        }
      })
    } else {
      that.data.value.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            value: that.data.value
          })
        }
      })
    }
  },
  classifyClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.category.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            category: that.data.category
          })
        }
      })
    } else {
      that.data.category.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            category: that.data.category
          })
        }
      })
    }
  },
  colorClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.color.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            color: that.data.color
          })
        }
      })
    } else {
      that.data.color.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            color: that.data.color
          })
        }
      })
    }
  },
  sizeClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.size.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            size: that.data.size
          })
        }
      })
    } else {
      that.data.size.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            size: that.data.size
          })
        }
      })
    }
  },
  attrClick: function(e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.attr.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            attr: that.data.attr
          })
        }
      })
    } else {
      that.data.attr.forEach(function(v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            attr: that.data.attr
          })
        }
      })
    }
  },
  reset: function() {
    var that = this;
    that.data.brand.forEach(function(v, i) {
      v.flag = false;
    });
    that.data.gender.forEach(function(v, i) {
      v.flag = false;
    });
    that.data.value.forEach(function(v, i) {
      v.flag = false;
    });
    that.data.category.forEach(function(v, i) {
      v.flag = false;
    });
    that.data.color.forEach(function(v, i) {
      v.flag = false;
    });
    that.data.size.forEach(function(v, i) {
      v.flag = false;
    });
    that.data.attr.forEach(function(v, i) {
      v.flag = false;
    })
    that.setData({
      brand: that.data.brand,
      attr: that.data.attr,
      size: that.data.size,
      color: that.data.color,
      category: that.data.category,
      value: that.data.value,
      gender: that.data.gender
    })
  },
  confirm: function() {
    var that = this;
    that.setData({
      brandArr: [],
      ageArr: [],
      seasonArr: [],
      sexArr: [],
      colorArr: [],
      classifyArr: [],
      sizeArr: [],
    })
    that.data.brand.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.brandArr.push(v.index)
      }
    });
    that.data.gender.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.sexArr.push(v.index)
      }
    });
    that.data.attr.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.seasonArr.push(v.index)
      }
    });
    that.data.value.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.ageArr.push(v.index)
      }
    });
    that.data.color.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.colorArr.push(v.index)
      }
    });
    that.data.category.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.classifyArr.push(v.index)
      }
    });
    that.data.size.forEach(function(v, i) {
      if (v.flag == true) {
        that.data.sizeArr.push(v.index)
      }
    });
    that.setData({
      brandArr: that.data.brandArr,
      ageArr: that.data.ageArr,
      seasonArr: that.data.seasonArr,
      sexArr: that.data.sexArr,
      colorArr: that.data.colorArr,
      classifyArr: that.data.classifyArr,
      sizeArr: that.data.sizeArr,
    })
    that.data.ageId = that.data.ageArr.toString();
    that.data.seasonId = that.data.seasonArr.toString();
    that.data.genderId = that.data.sexArr.toString();
    that.data.colorId = that.data.colorArr.toString();
    that.data.brandId = that.data.brandArr.toString();
    that.data.classId = that.data.classifyArr.toString();
    that.data.sizeId = that.data.sizeArr.toString();
    that.setData({
      ageId: that.data.ageId,
      seasonId: that.data.seasonId,
      genderId: that.data.genderId,
      colorId: that.data.colorId,
      brandId: that.data.brandId,
      classId: that.data.classId,
      sizeId: that.data.sizeId,
    })
    that.setData({
      pageNumber: 1
    })
    if (index == 1) {
      that.data.parm.pageNumber = that.data.pageNumber;
      that.data.parm.specialTopicId = that.data.specialTopicId
    }
    if (index == 2 || index == 3 || index == 4 || index == 5) {
      that.data.parm.startIndex = that.data.pageNumber
    }
    that.data.parm.values = that.data.ageId;
    that.data.parm.attrIds = that.data.seasonId;
    that.data.parm.genders = that.data.genderId;
    that.data.parm.brands = that.data.brandId;
    that.data.parm.categorySales = that.data.classId;
    that.data.parm.sizes = that.data.sizeId;
    that.data.parm.colors = that.data.colorId;
    that.data.parm.minPrice = that.data.minPrice;
    that.data.parm.maxPrice = that.data.maxPrice;
    that.setData({
      parm: that.data.parm,
      list: []
    })
    var status = that.data.allWrapHidden;
    if (status == "none") {
      that.setData({
        allWrapHidden: "block"
      })
    } else {
      that.setData({
        allWrapHidden: "none"
      })
    }
    getMoreGoods(that, commonUrl, that.data.parm, index)
    req.analyticsLog({
      event: 'filt',
      ...that.data.parm,
      eid: that.data.specialId
    })
  },
  minPrice: function(e) {
    var that = this;
    that.setData({
      minPrice: e.detail.value
    })
  },
  maxPrice: function(e) {
    var that = this;
    that.setData({
      maxPrice: e.detail.value
    })
  },
  cutSpecialId: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.index;
    that.setData({
      specialTopicId: id
    })
    that.setData({
      list: [],
      color: [], //颜色
      brand: [], //品牌
      size: [], // 尺码
      gender: [], //性别
      category: [], //分类
      value: [], //年龄
      attr: [], //季节
    });
    that.setData({
      pageNumber: 1
    })
    if (index == 1) {
      that.data.parm.pageNumber = that.data.pageNumber
    }
    if (index == 2 || index == 3 || index == 4 || index == 5) {
      that.data.parm.startIndex = that.data.pageNumber
    }
    that.setData({
      brandArr: [],
      ageArr: [],
      seasonArr: [],
      sexArr: [],
      colorArr: [],
      classifyArr: [],
      sizeArr: [],
    })
    that.setData({
      brandArr: that.data.brandArr,
      ageArr: that.data.ageArr,
      seasonArr: that.data.seasonArr,
      sexArr: that.data.sexArr,
      colorArr: that.data.colorArr,
      classifyArr: that.data.classifyArr,
      sizeArr: that.data.sizeArr,
    })
    that.data.parm.specialTopicId = that.data.specialTopicId;
    that.data.parm.sortInfo = "";
    that.data.parm.values = "";
    that.data.parm.minPrice = "",
      that.data.parm.maxPrice = "";
    that.data.parm.brands = "";
    that.data.parm.categorySales = "";
    that.data.parm.colors = "";
    that.data.parm.values = "";
    that.data.parm.genders = "";
    that.data.parm.attrIds = "";
    that.data.parm.sizes = "";
    that.setData({
      parm: that.data.parm
    })
    wx.request({
      url: app.api.getAttrInfo,
      dataType: "json",
      data: {
        specialTopicId: that.data.specialTopicId,
        version: "10000."
      },
      success: function(res) {
        if (res.data.status == 2000) {
          if (res.data.data.brand != undefined) {
            for (var i = 0; i < res.data.data.brand.length; i++) {
              that.data.brand.push({
                index: res.data.data.brand[i].index,
                name: res.data.data.brand[i].name,
                flag: false
              })
            }
          }
          if (res.data.data.color != undefined) {
            for (var i = 0; i < res.data.data.color.length; i++) {
              that.data.color.push({
                index: res.data.data.color[i].index,
                name: res.data.data.color[i].name,
                flag: false
              })
            }
          }
          if (res.data.data.sizes != undefined) {
            for (var i = 0; i < res.data.data.sizes.length; i++) {
              that.data.size.push({
                index: res.data.data.sizes[i].index,
                name: res.data.data.sizes[i].name,
                flag: false
              })
            }
          }
          if (res.data.data.value != undefined) {
            for (var i = 0; i < res.data.data.value.length; i++) {
              that.data.value.push({
                index: res.data.data.value[i].index,
                name: res.data.data.value[i].name,
                flag: false
              })
            }
          }
          if (res.data.data.gender != undefined) {
            for (var i = 0; i < res.data.data.gender.length; i++) {
              that.data.gender.push({
                index: res.data.data.gender[i].index,
                name: res.data.data.gender[i].name,
                flag: false
              })
            }
          }
          if (res.data.data.category != undefined) {
            for (var i = 0; i < res.data.data.category.length; i++) {
              that.data.category.push({
                index: res.data.data.category[i].index,
                name: res.data.data.category[i].name,
                flag: false
              })
            }
          }
          if (res.data.data.attr.length > 0) {
            if (res.data.data.attr[0].datas != undefined) {
              for (var i = 0; i < res.data.data.attr[0].datas.length; i++) {
                that.data.attr.push({
                  index: res.data.data.attr[0].datas[i].index,
                  name: res.data.data.attr[0].datas[i].name,
                  flag: false
                })
              }
            }
          }
          that.setData({
            attr: that.data.attr,
            brand: that.data.brand,
            color: that.data.color,
            size: that.data.size,
            value: that.data.value,
            gender: that.data.gender,
            category: that.data.category,
          })
        }
      }
    })
    getMoreGoods(that, commonUrl, that.data.parm, index)
  },
  onShareAppMessage: function(options) {
    var that = this;
    app.tdsdk.customShare(options)
    if (options.from == "menu") {
      return {
        title: that.data.imTitle,
        path: 'pages/newStyle/newStyle?specialId=' + specialId + "&specialTopicId=" + that.data.specialTopicId + "&pageCome=" + pageCome,
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
    } else {
      var groupCode = that.data.groupCode;
      console.info(groupCode)
      if (groupCode != null && groupCode != "") {
        return {
          title: that.data.imTitle,
          path: 'pages/newStyle/newStyle?specialId=' + specialId + "&specialTopicId=" + that.data.specialTopicId + "&pageCome=" + pageCome + "&groupCode=" + groupCode,
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
      } else {
        return {
          title: that.data.imTitle,
          path: 'pages/newStyle/newStyle?specialId=' + specialId + "&specialTopicId=" + that.data.specialTopicId + "&pageCome=" + pageCome,
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
  shareList: function() {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
    if (that.data.canvasImg2 != "") {} else {
      wx.getImageInfo({
        src: 'https://img3.cloudokids.cn/h5img/scene/cloudoBanner.jpg',
        success: function(res) {
          that.setData({
            canvasImg2: res.path
          })
          console.log(res.path)
        }
      })
    }
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  bindItemTap: function() {
    var that = this;
    that.setData({
      actionSheetHidden: true,
      imgFlag: true
    })
    console.info(that.data)
    const ctx = wx.createCanvasContext('spuCanvas');
    wx.getImageInfo({
      src: that.data.imgUrl,
      success: function(res) {
        console.info(res.path)
        ctx.setFillStyle("#ffffff")
        ctx.fillRect(0, 0, 280, 400)
        ctx.setFillStyle("black")
        ctx.drawImage(that.data.canvasImg1, 56, 0, 168, 90)
        ctx.drawImage(that.data.canvasImg2, 40, 80, 200, 120)
        ctx.setFontSize(12)
        ctx.setTextAlign('center')
        // ctx.fillText(that.data.imTitle, 140, 230)
        ctx.drawImage(res.path, 80, 240, 120, 120)
        ctx.setFontSize(10)
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 380)
        ctx.save()
        ctx.draw()
      }
    })
  },
  delShare: function() {
    var that = this;
    that.setData({
      imgFlag: false
    })
  },
  saveShare: function() {
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
  },
  qrCode: function() {
    var that = this;
    var groupCode = that.data.groupCode;
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/newStyle/newStyle?specialId=' + specialId + "&pageCome=" + pageCome + "&groupCode=" + groupCode
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          imgUrl: res.data
        })
      }
    })
  },
  getLogin: function(groupCode) {
    var that = this;
    var groupCode = groupCode;
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
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                    that.getUserInfoLogin(res.encryptedData, res.iv, code, groupCode)
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
  getUserInfoLogin: function(encryptedData, iv, code, groupCode) {
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
            loginBgFlag: false
          });
          wx.setStorageSync('token', token);
          wx.setStorageSync('phoneType', phoneType);
          wx.setStorageSync('memberId', memberId);
          getMoreGoods(that, commonUrl, that.data.parm, index);
          if (groupCode != null && groupCode != "") {
            that.getBindStstus(groupCode);
            that.qrCode(that.data.groupCode)
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
                        groupCode: res.data.data.introducer.introduceCode
                      })
                      that.qrCode(that.data.groupCode)
                    }
                  }
                }
              }
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
              that.getUserInfoLogin(res.encryptedData, res.iv, code, that.data.groupCode)
            }
          })
        }
      }
    });
  },
  getBindStstus: function(groupCode) {
    var that = this;
    var groupCode = groupCode;
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
          that.getLogin(groupCode)
        }
      }
    })
  },
  scroll: function() {},
  removeRepeat: function(a) { //去重方法
    var a1 = ((new Date).getTime())
    var b = [],
      n = a.length,
      i, j;
    for (i = 0; i < n; i++) {
      for (j = i + 1; j < n; j++) {
        if (a[i] === a[j]) {
          j = false;
          break;
        }
      }
      if (j) b.push(a[i]);
    }
    return b.sort(function(a, b) {
      return a - b
    });
  }
})