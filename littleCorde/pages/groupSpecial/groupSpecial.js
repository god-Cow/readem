var app = getApp();
app.aldstat.sendEvent('onLoad');
app.aldstat.sendEvent('onShareAppMessage');
app.aldstat.sendEvent('goDetail');
var specialId
var specialTopicId
var csActivityId
var csGroupBookingType
var getMoreGoods = function (that) {
  that.setData({
    hidden: false,
  });
  wx.request({
    url: app.api.getSpecialUrl,
    data: {
      version: 10000.,
      specialId: specialId,
      specialTopicId: specialTopicId,
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
    success: function (res) {
      if (res.data.status == 2000) {
        var maxPage = Math.ceil(res.data.data.total / 20);
        that.setData({
          maxPage: maxPage
        })
        if (res.data.data == "null" || res.data.data == null) {
          that.setData({
            list: [],
            hiddenInfo: 'block',
            isAllHiddenInfo: 'none'
          });
        } else {
          var list = that.data.list;
          for (var i = 0; i < res.data.data.datas.length; i++) {
            list.push(res.data.data.datas[i]);
          }
          that.data.pageNumber++;
          that.setData({
            pageNumber: that.data.pageNumber,
            list: list,
            hidden: true,
            hiddenInfo: 'none',
            isAllHiddenInfo: 'none'
          })
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
      }
    }
  })
}
Page({
  data: {
    hidden: true,
    hiddenInfo: 'none',
    isAllHiddenInfo: 'none', //数据没有
    pageNumber: 1,
    countDownDay: 0,
    countDownHour: 0, //倒计时
    countDownMinute: 0,
    countDownSecond: 0,
    time: "0",  //拼单结束时间
    token: "",
    phoneType: "",
    balanceMoney: "0",
    groupCount: "0",
    balanceMoney: "0",
    groupNumber: "0",
    list: [], //商品
    cardShareShow: "none", //画布显示
    scrollHeight: 0,
    shareImgUrl: "", //卡片
    dbGroupBookingFlag: true,
    groupId: "",
    groupCode: "",
    spuCanvasImage: "",
    goNext: true,
    actionSheetHidden: true, //分享上拉菜单开关
    allWrapHidden: "none",
    isHidden: true,
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
    sexArr: [], seasonArr: [], ageArr: [], colorArr: [], brandArr: [], classifyArr: [], sizeArr: [],
    ageId: "", seasonId: "", genderId: "", colorId: "", brandId: "", classId: "", sizeId: "", sortInfo: "", minPrice: "", maxPrice: "", specialTopicId: "", specialBanner: "", rankingData: [],
    canvasImg1: "", //卡片图片1
    canvasImg2: "",//卡片图片2
    tips: "none", //拼单规则
    noGroupSamll:"none",
    noGroupbig:"none",
    yesGroupSamll:"none",
    yesGroupbig:"none",
  },
  onLoad: function (options) {
    var that = this;
    app._dgt.trackEvent('onLoad');
    app._dgt.trackEvent('onShareAppMessage');
    app._dgt.trackEvent('goDetail');
    var path = options.path;
    var scene = decodeURIComponent(options.scene)
    if (path != null && path != "" && path != undefined){
      console.info("1111111111111111111111111")
      var pageCome = path.split("_")[2];
      specialId = path.split("_")[0];
      specialTopicId = path.split("_")[1];
      csActivityId = path.split("_")[3];
      csGroupBookingType = path.split("_")[4];
      console.info(pageCome)
      console.info(specialId)
      console.info(specialTopicId)
      console.info(csActivityId)
      console.info(csGroupBookingType)
      that.setData({
        csGroupBookingType: csGroupBookingType
      })
      that.getSpecialById(pageCome, path)
    }
    if (scene != null && scene != "" && scene != undefined && scene != "undefined"){
      console.info("22222222222222222222222222222")
      wx.request({
        url: app.api.changeUrl,
        data:{
          id: scene
        },
        success:function(res){
          if(res.data != null){
            var qrCodePath = res.data;
            qrCodePath = qrCodePath.substring(5)
            var pageCome = qrCodePath.split("_")[2];
            specialId = qrCodePath.split("_")[0];
            specialTopicId = qrCodePath.split("_")[1];
            csActivityId = qrCodePath.split("_")[3];
            csGroupBookingType = qrCodePath.split("_")[4];
            console.info(pageCome)
            console.info(specialId)
            console.info(specialTopicId)
            console.info(csActivityId)
            console.info(csGroupBookingType)
            that.setData({
              csGroupBookingType: csGroupBookingType
            })
            that.getSpecialById(pageCome, qrCodePath)
          }
        }
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        });
      }
    });
    wx.getImageInfo({
      src: 'https://img1.cloudokids.cn/buyers/scene/spuCanvas1.png',
      success: function (res) {
        that.setData({
          canvasImg1: res.path
        })
      }
    })
    wx.request({
      url: app.api.getRankingInfo,
      success: function (res) {
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
  getSpecialById:function(pageCome,path){
    var that = this;
    var pageCome = pageCome;
    that.setData({
      a:pageCome
    })
    var path = path;
    wx.request({
      url: app.api.getSpecialById,
      data: {
        id: specialId
      },
      dataType: "json",
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            specialBanner: res.data.img
          })
          wx.getImageInfo({
            src: that.data.specialBanner,
            success: function (res) {
              that.setData({
                canvasImg2: res.path
              })
            }
          })
          wx.request({
            url: app.api.getAttrInfo,
            dataType: "json",
            data: {
              specialTopicId: specialTopicId,
              version: "10000."
            },
            success: function (res) {
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
    switch (pageCome) {
      case "1":
        wx.getStorage({
          key: 'groupCode',
          success: function (res) {
            that.setData({
              groupCode: res.data
            })
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
                that.getDiscount(1, "")
              }
            })
          },
          fail: function (res) {
            that.cloudoLogin();
          }
        })
        break;
      case "2":
        var groupCode = path.split("_")[5];
        var groupId = path.split("_")[6];
        csActivityId = path.split("_")[3];
        csGroupBookingType = path.split("_")[4];
        console.info(groupCode)
        console.info(groupId)
        that.setData({
          groupId: groupId,
          groupCode: groupCode
        })
        wx.setStorageSync('groupCode', groupCode);
        that.getShowLmg(groupCode, groupId)
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
                              wx.request({
                                url: app.api.bindMemberIntroduce,
                                data: {
                                  token: token,
                                  phonetype: phoneType,
                                  channel: "6",
                                  introduceCode: groupCode
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
                              that.getDiscount(that.data.a, groupId)
                            }
                          }
                        })
                      }
                    })
                  }
                }
              })
            }else{
              that.setData({
                loginBgFlag: true
              })
            }
          }
        })
        break;
    }
    getMoreGoods(that);
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: that.data.description,
      path: 'pages/groupSpecial/groupSpecial?path=' + specialId + "_" + specialTopicId + "_2_" + csActivityId + "_" + csGroupBookingType + "_" + that.data.groupCode + "_" + that.data.groupId,
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
  getGroup: function (d,groupId) {
    var that = this;
    var groupId = groupId;
    var d = d;
    console.info(d);
    if (d == 1) {
      wx.request({
        url: app.api.getMemberIsIntroducer,
        data: {
          token: that.data.token,
          phonetype: that.data.phoneType,
          channel: 6,
        },
        success: function (res) {
          console.info(res)
          if (res.data.status == 2000) {
            if (res.data.data.outcome == false) {
              wx.request({
                url: app.api.getGroupInfo,
                data: {
                  token: that.data.token,
                  phonetype: that.data.phoneType,
                  channel: "6",
                  groupId: groupId,
                  activeId:csActivityId,
                  groupType:csGroupBookingType,
                  activeStatus:"1"
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
                      noGroupSamll: "none",
                      noGroupbig: "none",
                      yesGroupSamll: "none",
                      yesGroupbig: "block",
                      groupId: result.data.data.id,
                      lastModifyTime: result.data.data.lastModifyTime,
                      totalMoney: result.data.data.totalMoney
                    })
                    that.getShowLmg("", result.data.data.id);
                    that.getData()
                  }
                  if (result.data.status == 6003){
                    that.setData({
                      noGroupSamll: "none",
                      noGroupbig: "block",
                      yesGroupSamll: "none",
                      yesGroupbig: "none",
                    })
                    that.getShowLmg("", "");
                  }
                  if (result.data.status != 6003 && result.data.status != 2000){
                    that.setData({
                      noGroupSamll: "none",
                      noGroupbig: "none",
                      yesGroupSamll: "none",
                      yesGroupbig: "none",
                    })
                    that.getShowLmg("", "");
                  }
                }
              })
            } else {
              if (res.data.data.introducer.status == 2) {
                that.setData({
                  groupCode: res.data.data.introducer.introduceCode,
                })
                var groupCode = res.data.data.introducer.introduceCode;
                wx.request({
                  url: app.api.getGroupInfo,
                  data: {
                    token: that.data.token,
                    phonetype: that.data.phoneType,
                    channel: "6",
                    groupId: groupId,
                    activeId:csActivityId,
                    groupType:csGroupBookingType,
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
                        noGroupSamll: "none",
                        noGroupbig: "none",
                        yesGroupSamll: "none",
                        yesGroupbig: "block",
                        groupId: result.data.data.id,
                        lastModifyTime: result.data.data.lastModifyTime,
                        totalMoney: result.data.data.totalMoney
                      })
                      that.getShowLmg(groupCode, result.data.data.id);
                      that.getData()
                    } if (result.data.status == 6003) {
                      that.setData({
                        noGroupSamll: "none",
                        noGroupbig: "block",
                        yesGroupSamll: "none",
                        yesGroupbig: "none",
                      })
                      that.getShowLmg("", "");
                    }
                    if (result.data.status != 6003 && result.data.status != 2000) {
                      that.setData({
                        noGroupSamll: "none",
                        noGroupbig: "none",
                        yesGroupSamll: "none",
                        yesGroupbig: "none",
                      })
                      that.getShowLmg("", "");
                    }
                  }
                })
              }else{
                
              }
            }
          }
          if (res.data.status == 2013) {
            that.cloudoLogin()
          }
        }
      })
    }
    if (d == 2) {
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
          groupId: groupId
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (result) {
          console.info(result)
          if (result.data.status == 2000) {
            that.setData({
              count: 3000,
              toastText: result.data.data,
            });
            that.showToast();
            if(result.data.data=="拼单成功"){
              wx.request({
                url: app.api.getGroupInfo,
                data: {
                  token: that.data.token,
                  phonetype: that.data.phoneType,
                  channel: "6",
                  groupId: groupId,
                  activeId: csActivityId,
                  groupType: csGroupBookingType,
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
                  if (result.data.status == 6003) {
                    that.setData({
                      noGroupSamll: "none",
                      noGroupbig: "block",
                      yesGroupSamll: "none",
                      yesGroupbig: "none",
                    })
                    that.getShowLmg("", "");
                  }
                }
              })
            }else{
              that.getGroup(1,"")
            }
          } else {
            that.setData({
              count: 3000,
              toastText: result.data.msg,
            });
            that.showToast();
            that.getGroup(1, "")
          }
        }
      })
    }
  },
  bindDownLoad: function () {
    var that = this;
    if (that.data.maxPage + 1 < that.data.pageNumber) {
    } else {
      getMoreGoods(that)
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
  goIndex: function () {
    wx.switchTab({
      url: '../../pages/home/index',
      success:function(){
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  //排序筛选
  goRanking: function () {
    var that = this;
    that.setData({
      goNext: !that.data.goNext,
      isHidden: !that.data.isHidden
    });
  },
  //排序点击
  goCheck: function (e) {
    var that = this;
    var selectIndex = e.target.dataset.index;
    that.data.rankingData.forEach(function (v, e) {
      if (v.index == selectIndex) {
        v.checkHidden = false;
      } else {
        v.checkHidden = true;
      }
    });
    that.setData({
      pageNumber: 1,
      sortInfo: selectIndex,
      rankingData: that.data.rankingData,
      isHidden: true,
      list: [],
      goNext: true,
      parm: that.data.parm,
    })
    getMoreGoods(that)
  },
  //点击筛选
  goFilter: function () {
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
  closeBg: function () {
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
  minPrice: function (e) {
    var that = this;
    that.setData({
      minPrice: e.detail.value
    })
  },
  maxPrice: function (e) {
    var that = this;
    that.setData({
      maxPrice: e.detail.value
    })
  },
  brandStatus: function () {
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
  ageStatus: function () {
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
  classifyStatus: function () {
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
  colorStatus: function () {
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
  sizeStatus: function () {
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
  attrStatus: function () {
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
  BrandClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.brand.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            brand: that.data.brand
          })
        }
      })
    } else {
      that.data.brand.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            brand: that.data.brand
          })
        }
      })
    }
  },
  genderClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.gender.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            gender: that.data.gender
          })
        }
      })
    } else {
      that.data.gender.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            gender: that.data.gender
          })
        }
      })
    }
  },
  ageClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.value.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            value: that.data.value
          })
        }
      })
    } else {
      that.data.value.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            value: that.data.value
          })
        }
      })
    }
  },
  classifyClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.category.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            category: that.data.category
          })
        }
      })
    } else {
      that.data.category.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            category: that.data.category
          })
        }
      })
    }
  },
  colorClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.color.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            color: that.data.color
          })
        }
      })
    } else {
      that.data.color.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            color: that.data.color
          })
        }
      })
    }
  },
  sizeClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.size.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            size: that.data.size
          })
        }
      })
    } else {
      that.data.size.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            size: that.data.size
          })
        }
      })
    }
  },
  attrClick: function (e) {
    var that = this;
    var flag = e.currentTarget.dataset.flag;
    var index = e.currentTarget.dataset.index;
    if (!flag) {
      that.data.attr.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = true;
          that.setData({
            attr: that.data.attr
          })
        }
      })
    } else {
      that.data.attr.forEach(function (v, i) {
        if (v.index == index) {
          v.flag = false;
          that.setData({
            attr: that.data.attr
          })
        }
      })
    }
  },
  reset: function () {
    var that = this;
    that.data.brand.forEach(function (v, i) {
      v.flag = false;
    });
    that.data.gender.forEach(function (v, i) {
      v.flag = false;
    });
    that.data.value.forEach(function (v, i) {
      v.flag = false;
    });
    that.data.category.forEach(function (v, i) {
      v.flag = false;
    });
    that.data.color.forEach(function (v, i) {
      v.flag = false;
    });
    that.data.size.forEach(function (v, i) {
      v.flag = false;
    });
    that.data.attr.forEach(function (v, i) {
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
  confirm: function () {
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
    that.data.brand.forEach(function (v, i) {
      if (v.flag == true) {
        that.data.brandArr.push(v.index)
      }
    });
    that.data.gender.forEach(function (v, i) {
      if (v.flag == true) {
        that.data.sexArr.push(v.index)
      }
    });
    that.data.attr.forEach(function (v, i) {
      if (v.flag == true) {
        that.data.seasonArr.push(v.index)
      }
    });
    that.data.value.forEach(function (v, i) {
      if (v.flag == true) {
        that.data.ageArr.push(v.index)
      }
    });
    that.data.color.forEach(function (v, i) {
      if (v.flag == true) {
        that.data.colorArr.push(v.index)
      }
    });
    that.data.category.forEach(function (v, i) {
      if (v.flag == true) {
        that.data.classifyArr.push(v.index)
      }
    });
    that.data.size.forEach(function (v, i) {
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
    that.setData({
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
    getMoreGoods(that)
  },
  creatGroup: function () {
    var that = this;
    wx.showModal({
      title: that.data.description,
      content: '是否开启拼单',
      showCancel:true,
      cancelText:"否",
      confirmText:"是",
      success:function(res){
        if (res.confirm) {
          wx.request({
            url: app.api.insertGroupBooking,
            data: {
              token: that.data.token,
              phonetype: that.data.phoneType,
              channel: "6",
              activityId:csActivityId,
              type:csGroupBookingType
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.status == 2000) {
                that.setData({
                  shareImgUrl: ""
                })
                that.getGroup(1,res.data.data)
              }else{
                that.setData({
                  count: 1500,
                  toastText: res.data.msg
                });
                that.showToast();
              }
            }
          })
          that.setData({
            dbGroupBookingFlag: true
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  shareList: function () {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
  },
  bindItemTap: function () {
    var that = this;
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
              ctx.fillText("限时折拼单", 140, 230)
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
              ctx.fillText("限时折拼单", 140, 250)
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
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  goDetail: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  cloudoLogin: function () {
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
                          if(that.data.a == 1){
                            that.getDiscount(1, "")
                          }else{
                            that.getDiscount(2, that.data.groupId)
                          }
                        }
                      }
                    })
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
  getDiscount: function (d,groupId) {
    var that = this;
    var d = d;
    var groupId =groupId;
    wx.request({
      url: app.api.getGroupBookingCondition,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        activeId: csActivityId,
        groupType:csGroupBookingType
      },
      dataType: "json",
      method: "GET",
      success: function (res) {
        console.info(res)
        if (res.data.status == 2000) {
          that.setData({
            description: res.data.data.description,
            skipUrl: res.data.data.skipUrl,
          })
          console.info(res.data.data.status)
          if (res.data.data.status == 0){
            that.setData({
              noGroupSamll: "none",
              noGroupbig: "none",
              yesGroupSamll: "none",
              yesGroupbig: "none",
            })
          }
          if (res.data.data.status == 1){
            that.getGroup(d,groupId)
          }
        }
      }
    })
  },
  getShowLmg: function (groupCode, groupId) {
    var that = this;
    var groupCode = groupCode;
    var groupId = groupId;
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/groupSpecial/groupSpecial?path=' + specialId + '_' + specialTopicId + "_2_" + csActivityId + "_" + csGroupBookingType + "_" + groupCode + "_" + groupId
      },
      method:"POST",
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
  noGroupbig:function(){
    this.setData({
      noGroupSamll: "block",
      noGroupbig: "none",
      yesGroupSamll: "none",
      yesGroupbig: "none",
      allWrapHidden:"none",
      isHidden: "none"
    })
  },
  noGroupSamll:function(){
    this.setData({
      noGroupSamll: "none",
      noGroupbig: "block",
      yesGroupSamll: "none",
      yesGroupbig: "none",
      allWrapHidden: "none",
      isHidden: "none"
    })
  },
  yesGroupSamll:function(){
    this.setData({
      noGroupSamll: "none",
      noGroupbig: "none",
      yesGroupSamll: "none",
      yesGroupbig: "block",
      allWrapHidden: "none",
      isHidden: "none"
    })
  },
  yesGroupbig: function () {
    this.setData({
      noGroupSamll: "none",
      noGroupbig: "none",
      yesGroupSamll: "block",
      yesGroupbig: "none",
      allWrapHidden: "none",
      isHidden:"none"
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
              that.cloudoLogin()
            }
          })
        }
      }
    });
  },
  scroll: function () { }
})