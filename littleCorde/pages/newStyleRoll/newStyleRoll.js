const req = require('../../utils/request');
const weApi = require('../../utils/weApis');
const app = getApp();
const { channel} =  app.globalData;
const pid = 16; // 页面id
var thisPage = {}; // 全局this
var interval;
Page({
  data: {
    isShowToast:false,
    navFixed: false, //悬停
    goodsList: [],// 商品信息
    activityId: '', //场id
    activeFlag: false,
    display: "none",
    disabled: true,
    imgUrl:"",
    groups: [], //团列表
    scrollHeight:"0",
    goNext: true,
    isHidden: true,
    allWrapHidden: "none",
    rankingData:[],
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
    parm:{
      pageNumber:1,
      pageSize: 20,
      activityId: '' //两处一致
    },
    activityId: '', //两处一致
    isLoading: false,
    endTimeArr: [],  //倒计时
    showBox: 'none',
    showBoxInfo: 'none',
    showCarBox: 'none',
    groupCode:"",
    actionSheetHidden: true, //分享展示
    scrollTop: 0, //滚动
    offsetTop: 0,
    marketingprice:"",
    quantity:"1"
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
    thisPage = this;
    var that = this;
    // 登录信息
    let token = wx.getStorageSync('token');
    let phonetype = wx.getStorageSync('phoneType');
    if (token && phonetype) {
      that.setData({
        token,
        phonetype
      })
    } else {
      that.setData({ loginBgFlag: true })
      //去登录

    }
    let { parm } = this.data;
    if (options) {
      let activityId = options.activityId;
      let type = options.groupType;
      let groupCode = options.groupCode || '';
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
                activityId: qrCodePath.split("&")[0].split("=")[1],
                type: qrCodePath.split("&")[1].split("=")[1],
                groupCode: qrCodePath.split("&")[2].split("=")[1],
                parm:{
                  ...parm,
                  activityId: qrCodePath.split("&")[0].split("=")[1]
                }
              })
              that.getActivitySpuList(that.data.parm);
              that.getMemberIsFullCourt();
              that.getSpuSelect() 
              that.creatCardTopImg();
            }
          }
        })
      }else{
        that.setData({
          activityId,
          type,
          groupCode: groupCode || '',
          parm: {
            ...parm,
            activityId,
          }
        })
        that.getActivitySpuList(that.data.parm);
        that.getSpuSelect()
        that.getMemberIsFullCourt();
        that.creatCardTopImg();
      }
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        });
      }
    });
    var arr = []
    wx.request({
      url: app.api.getRankingInfo,
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          arr.push({
            index: res.data.data[i].index,
            name: res.data.data[i].name,
            checkHidden: true
          })
        }
        that.setData({
          rankingData: arr
        });
      }
    });
    that.checkInfo();
    req.analyticsLog({
      event: 'view',
      pid: pid,
      eid: that.data.activityId,
      ena: 'Promotion'
    })
  },
  //选中取消 选中对应
  checkInfo() {
    let { token, phonetype, activityId } = this.data;
    req.allSelectCart({
      token,
      phonetype,
      channel,
      checked: 0
    })
    .then(res => {
      req.updateCartCheckedByActivityId(token, channel, phonetype, activityId, "1")
      .then(res => {
        if (res.status == 2000) {
          console.info(res)
          if(res.data.outcome){
            var arr = [];
            for (var i = 0; i < res.data.goodsList.length; i++) {
              var obj1 = new Object();
              obj1.spuId = res.data.goodsList[i].spuId;
              obj1.skuId = res.data.goodsList[i].skuId;
              obj1.quantity = res.data.goodsList[i].quantity;
              obj1.marketPrice = res.data.goodsList[i].marketPrice;
              obj1.imgUrl = res.data.goodsList[i].imgUrl;
              obj1.id = res.data.goodsList[i].id;
              obj1.goodsName = res.data.goodsList[i].goodsName;
              obj1.costPrice = res.data.goodsList[i].costPrice;
              obj1.brandName = res.data.goodsList[i].brandName;
              obj1.activityId = res.data.goodsList[i].activityId;
              obj1.warehouseMsg = res.data.goodsList[i].warehouseMsg;
              obj1.isTouchMove = false;
              arr.push(obj1)
            }
            this.setData({
              carData: {
                amount: res.data.amount,
                discounts: res.data.discounts,
                marketPrice: res.data.marketPrice,
                outcome: res.data.outcome,
                sum: res.data.sum,
                goodsList: arr
              }
            })
          }else{
            this.setData({
              showCarBox:"none",
              carData: {
                outcome: res.data.outcome,
                sum: 0,
              }
            })
          }
        }
        if (res.data) {

        }
      })
    })
  },
  // 商品列表
  getActivitySpuList(parm) {
    var that = this;
    req.getActivitySpuList(parm)
    .then(res => {
      let { goodsList} =  this.data;
      let {totalPage} = res.data;
      this.setData({
        goodsList: [...goodsList,...res.data.data],
        totalPage,
        isLoading: false
      });
      that.data.goodsList.length === 0 ? that.setData({ listNoData: true }) : that.setData({ listNoData: false })
    })
  },
  //团列表
  getMemberIsFullCourt() {
    var that =this;
    let { token, phonetype, activityId } = that.data;
    req.getMemberIsFullCourtGroupBooking({
      token,
      phonetype, 
      channel,
      activityId
    })
    .then(res => {
      console.info(res)
      if (res.status==2000){
        that.checkInfo()
        const groupCode = that.data.groupCode;
        console.info(groupCode,"推手code")
        if (groupCode != null && groupCode != "" && groupCode != undefined){
          that.bindMemberIntroduce()
          that.showImg()
        }else{
          that.getMemberIsIntroducer()
        }
        let { outcome, groups} = res.data;
        console.info(res.data)
        that.setData({
          outcome,
          groups: groups || []
        })
        if (groups && !outcome){
          //已经加团
          let endTimeArr = []
          this.data.groups.map(function(value,index){
            endTimeArr.push(value.endTime)
          })
          that.data.endTimeArr = endTimeArr;
          that.product();
        }
        if (outcome ){
          req.listFullCourtGroupBooking({
            token,
            phonetype,
            channel,
            activityId
          })
          .then(res => {
            if (res.status == 2000){
              that.setData({
                userList: res.data
              })
            }

            let endTimeArr = []
            that.data.userList.map(function (value, index) {
              endTimeArr.push(value.endTime);
              if (value.activityId == activityId ) {
                that.setData({ userListNow: index})
                console.log(that.data.userListNow)
              }
            })
            that.data.endTimeArr = endTimeArr;
            
            that.product();
          })
        }
        setTimeout(() => {
          that.navInfo();
        }, 100);
      }
      if(res.status == 2013){
        that.setData({ loginBgFlag: true })
      }
    })
  },
  //倒计时
  product: function (data) {
    var that = this;
    clearInterval(interval);
    interval = setInterval(function () {

      var clock = that.getData(that.data.endTimeArr);
      that.setData({
        clock: clock
      });
    }.bind(this), 1000);
  },
  getData: function (timetot) {
    var that = this;
    var timetot = timetot;
    var clockarr = [];
    for (var i = 0; i < timetot.length; i++) {
      var totalSecond = timetot[i]-=1;
      var time = that.dateformat(totalSecond);
      clockarr.push(time);
    }
    return clockarr;
  },
  dateformat: function (micro_second) {
    var second = micro_second;//总的秒数
    if (second < 0) {
      return "00:00:00";
    } else {
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      var hr = Math.floor(second / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      var min = Math.floor(second / 60 % 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      var sec = Math.floor(second % 60);
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      return hrStr+":"+minStr+":"+secStr;
    }
  },
  //导航信息
  navInfo: function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('#brandIng').boundingClientRect()
    query.exec(function (res) {
      if (res[0]) that.setData({ offsetTop: res[0].height })
    })
  },
  onShow: function () {
    !wx.getStorageSync('token') ? this.setData({ loginBgFlag: true }) : this.setData({ loginBgFlag: false })
    let { groupCode} = this.data;
  },
  goDetial(e) {
    let { spuId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../detail/detail?spuId=${spuId}`,
    })
  },
  goNewStyle(e) {
    let { activityId } = e.currentTarget.dataset;
    if (activityId == this.data.activityId || !activityId ) return
    wx.navigateTo({
      url: `../newStyleRoll/newStyleRoll?activityId=${activityId}`,
    })
  },
  viewToggle(e) {
    let { showBox} =  this.data;
    if (e.currentTarget.dataset.activityId) { return }
    this.setData({ showCarBox: 'none' }) 
    showBox == 'none' ? this.setData({ showBox: 'block' }) : this.setData({ showBox: 'none' })
  },
  viewToggleInfo(e) {
    this.setData({
      scrollTop:0
    })
  },
  carToggle(e) {
    let { showCarBox } = this.data;
    let { sum } = this.data.carData;
    if (sum) {
      showCarBox == 'none' ? this.setData({ showCarBox: 'block' }) : this.setData({ showCarBox: 'none' })
    }
   
  },
  onUnload() { //退出
    this.setData({ 
      showBox: 'none',
      showCarBox : 'none'
    })
  },
  joinGroup(e) {
    console.log(e);
    let { groupId } = e.currentTarget.dataset;
    let { token, phonetype} = this.data;
    req.joinGroupBooking({
      token,
      phonetype, 
      channel, 
      groupId
    })
    .then( res => {
      if (res.status==2000){
        this.setData({
          isJoinGroup: true
        })
        this.getMemberIsFullCourt();
      }
      
    })

    req.analyticsLog({
      event: 'jopf',
      eid: this.data.activityId
    })
  },
  //关闭尺码
  disappear: function () {
    var that = this;
    that.setData({
      display: "none",
      disabled: true,
      cartBtnNumber: "",
      msg: "",
      country: "",
      quantity:"1"
    })
  },
  // 获取尺码
  buyShop: function (e) {
    var that = this;
    let { spuId } = e.currentTarget.dataset;
    that.data.goodsList.forEach(function(v,i){
      if (v.spuId==spuId){
        that.setData({
          imgUrl:v.imgUrl
        })
      }
    })
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
              marketingprice: res.data.data[i].marketingprice,
              hidden: "none",
            })
            that.setData({
              goodsCost: res.data.data[0].salePrice,
              msg: res.data.data[0].msg,
              country: res.data.data[0].cartId,
              marketingprice: res.data.data[0].marketingprice,
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
  //选择尺码
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
              marketingprice: v.marketingprice
            })
          } else {
            v.hidden = "none";
            that.setData({
              flag: true,
              disabled: true,
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
  // 滚动
  scroll: function (e) {
    if (e.detail.scrollTop >= this.data.offsetTop){
      if (!this.data.navFixed) this.setData({ navFixed: true })
    }else {
      if (this.data.navFixed) this.setData({ navFixed: false })
    }
  },
  
  // 登录信息
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
              let { encryptedData, iv} =  res;
              wx.request({
                url: app.api.weChatAppletLogin,//自己的服务接口地址
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  encryptedData,
                  iv,
                  code,
                },
                success: function (data){
                  console.log(data)
                  if (data.data.status == 2000) {
                    let token = data.data.data.token;
                    let phonetype = data.data.data.phonetype;
                    let memberId = data.data.data.userInfo.id;
                    that.setData({
                      token,
                      phonetype,
                      memberId,
                      loginBgFlag: false
                    });
                    wx.setStorageSync('token', token);
                    wx.setStorageSync('phoneType', phonetype);
                    wx.setStorageSync('memberId', memberId);
                    app.globalData.isBind = data.data.data.isBind;
                    that.getMemberIsFullCourt();
                    that.creatCardTopImg()
                  }
                }
              })
            }
          })
        }
      }
    });
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
    wx.request({
      url: app.api.addCart,
      data: {
        phonetype: that.data.phonetype,
        token: that.data.token,
        skuId: skuId,
        checked: 1,
        quantity: that.data.quantity,
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
            getGoodsSkuBySpuId: that.data.getGoodsSkuBySpuId,
            quantity:"1"
          })
          app.tdsdk.iap.addItem({
            id: skuId,
            name: that.data.goodsName,
            category: "",
            unitPrice: that.data.salePrice,
            count: 1
          })
          that.checkInfo();
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
            success: function (res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.login({
                  success: function (r) {
                    var code = r.code; //登录凭证
                    if (code) {
                      wx.getUserInfo({
                        withCredentials: true,
                        success: function (res) {
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
            toastText: newTitle,
            quantity: "1"            
          });
          that.showToast();
        }
      }
    })
  },
  getUserInfoLogin: function (encryptedData, iv, code) {
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
      success: function (data) {
        if (data.data.status == 2000) {
          var token = data.data.data.token;
          var phonetype = data.data.data.phonetype;
          var memberId = data.data.data.userInfo.id;
          that.setData({
            token: token,
            phonetype: phonetype,
            memberId: memberId,
            getUserInfoLogin: false
          });
          wx.setStorageSync('token', token);
          wx.setStorageSync('phoneType', phonetype);
          wx.setStorageSync('memberId', memberId);
          that.addCart();
          that.getMemberIsFullCourt();
        }
      }
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
      gender: that.data.gender,
      minPrice:"",
      maxPrice:"",
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
      attId: that.data.seasonId,
      genderId: that.data.genderId,
      colorId: that.data.colorId,
      brandId: that.data.brandId,
      classId: that.data.classId,
      sizeId: that.data.sizeId,
    })
    that.data.parm.ageId = that.data.ageId;
    that.data.parm.attId = that.data.seasonId;
    that.data.parm.sexId = that.data.genderId;
    that.data.parm.brandId = that.data.brandId;
    that.data.parm.categoryId = that.data.classId;
    that.data.parm.sizeId = that.data.sizeId;
    that.data.parm.colorId = that.data.colorId;
    that.data.parm.minPrice = that.data.minPrice;
    that.data.parm.maxPrice = that.data.maxPrice;
    that.setData({
      parm: that.data.parm,
      goodsList: []
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
    console.info(that.data.parm)
    that.getActivitySpuList(that.data.parm);
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
    let{activityId} =  this.data.parm
    that.setData({
      rankingData: that.data.rankingData,
      isHidden: true,
      goodsList: [],
      goNext: true,
      parm:{
        pageNumber: 1,
        pageSize: 20,
        activityId,
        sort: selectIndex
      },
    });
    
    that.getActivitySpuList(that.data.parm);
    req.analyticsLog({
      event: 'sort',
      par: that.data.parm,
      eid: that.data.activityId
    })
  },
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
    req.analyticsLog({
      event: 'filt',
      par: that.data.parm,
      eid: that.data.activityId
    })
  },
  getSpuSelect(){
    var that = this;
    let activityId = that.data.parm.activityId;
    req.getSpuSelect({ activityId}).then(res=>{
      if (res.status == 2000) {
        if (res.data.brandSelects != undefined) {
          for (var i = 0; i < res.data.brandSelects.length; i++) {
            that.data.brand.push({
              index: res.data.brandSelects[i].id,
              name: res.data.brandSelects[i].name,
              flag: false
            });
          }
        }
        if (res.data.colorSelects != undefined) {
          for (var i = 0; i < res.data.colorSelects.length; i++) {
            that.data.color.push({
              index: res.data.colorSelects[i].id,
              name: res.data.colorSelects[i].name,
              flag: false
            });
          }
        }
        if (res.data.sizeSelects != undefined) {
          for (var i = 0; i < res.data.sizeSelects.length; i++) {
            that.data.size.push({
              index: res.data.sizeSelects[i].id,
              name: res.data.sizeSelects[i].name,
              flag: false
            });
          }
        }
        if (res.data.ageSelects != undefined) {
          for (var i = 0; i < res.data.ageSelects.length; i++) {
            that.data.value.push({
              index: res.data.ageSelects[i].id,
              name: res.data.ageSelects[i].name,
              flag: false
            });
          }
        }
        if (res.data.sexSelects != undefined) {
          for (var i = 0; i < res.data.sexSelects.length; i++) {
            that.data.gender.push({
              index: res.data.sexSelects[i].id,
              name: res.data.sexSelects[i].name,
              flag: false
            });
          }
        }
        if (res.data.categorySelects != undefined) {
          for (var i = 0; i < res.data.categorySelects.length; i++) {
            that.data.category.push({
              index: res.data.categorySelects[i].id,
              name: res.data.categorySelects[i].name,
              flag: false
            });
          }
        }
        if (res.data.attrSelects != undefined) {
          for (var i = 0; i < res.data.attrSelects.length; i++) {
            that.data.attr.push({
              index: res.data.attrSelects[i].id,
              name: res.data.attrSelects[i].name,
              flag: false
            });
          }
        }
        that.setData({
          attr: that.data.attr,
          brand: that.data.brand,
          color: that.data.color,
          size: that.data.size,
          value: that.data.value,
          gender: that.data.gender,
          category: that.data.category
        });
      }
    })
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
  // 去购物车 拼
  goGroup(e){
    var that =this;
    let { activityId, carSum} = e.currentTarget.dataset;
    if (carSum <= 0 || !carSum || carSum==0 ) {
      that.setData({
        count: 1500,
        toastText: "请先选择商品"
      });
      that.showToast();
      return
    }
    if (!that.data.outcome) that.insertGroupBooking()
    
    wx.switchTab({
      url: `../cart/index`,
      success: function(res) {
        app.globalData.activityId = activityId;
      }
    })
  },
  goCard(e) {
    var that  = this;
    let {carSum } = e.currentTarget.dataset;
    if (carSum <= 0 || !carSum || carSum == 0) {
      that.setData({
        count: 1500,
        toastText: '请先选择商品'
      });
      that.showToast();
      return;
    }
    wx.switchTab({
      url: `../cart/index`,
      success: function (res) {
        app.globalData.activityId = "";
      }
    })
    req.analyticsLog({
      event: 'dbuy',
      eid: that.data.activityId,
    })
  },
  // 分享信息
  creatCardTopImg() {
    var that = this;
    let activityId = that.data.activityId;
    let token = wx.getStorageSync("token");
    let phonetype = wx.getStorageSync("phoneType");
    req.getGroupBookingActivitys(token, phonetype, 6, 6, "", activityId,"").then(res => {
      console.info(res)
      if(res.status == 2000){
        if(res.data.length == 1){
          that.data.creatCardText = res.data[0].activityTitle || "";
          that.data.creatCardImg2 = res.data[0].img || "";
          wx.setNavigationBarTitle({
            title: that.data.creatCardText,
          })
          wx.getImageInfo({
            src: res.data[0].img,
            success: function (res) {
              that.setData({
                creatCardImg1: res.path
              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '该活动已失效',
            showCancel: false,
            showCancel: true,
            showCancel: "确定",
            success: function (res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../home/index',
                })
              }
            }
          })
        }
      }
    })
  },
  //创建拼单
  insertGroupBooking() {
    let { token, phonetype, activityId, type } = this.data;
    req.insertGroupBooking({
      token,
      phonetype,
      channel,
      activityId,
      type
    })
      .then(res => {
        console.log(res)
      })
  },
  // 加载更多
  bindDownLoad: function() {
    var that = this;
    let {parm,totalPage,isLoading} =  this.data;
    let { pageNumber,pageSize } = this.data.parm
    console.log(pageNumber)
    if(pageNumber >= totalPage || isLoading) return
    this.setData({
      isLoading: true,
      parm:{
        ...parm,
        pageSize,
        pageNumber: ++pageNumber,
      }
    })
    that.getActivitySpuList(that.data.parm);
  },
  //是否是推手
  getMemberIsIntroducer(){
    const that = this;
    console.log(that.data.phonetype,'phonetype')
    req.getMemberIsIntroducer(that.data.token,that.data.phonetype,channel).then(res=>{
      if(res.status == 2000){
        if (res.data.outcome){
          if (res.data.introducer.status==2){
            that.setData({
              groupCode: res.data.introducer.introduceCode
            })
          }else{
            that.setData({
              groupCode: ""
            })
          }
        }else{
          that.setData({
            groupCode: ""
          })
        }
      }
    })
  },
  //分享列表
  shareList: function () {
    var that = this;
    that.setData({
      actionSheetHidden: false
    })
  },
  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  bindItemTap: function () {
    var that = this;
    const ctx = wx.createCanvasContext('spuCanvas');
    const timer = setInterval(function () {
      if (that.data.canvasImg2 && that.data.creatCardImg1) {
        clearInterval(timer)
        console.info(that.data.creatCardImg1,'img1');
        console.info(that.data.canvasImg2, 'img2');
        that.setData({
          actionSheetHidden: true,
          imgFlag: true,
          spuCanvas: false,
          isScorll: "hidden"
        })
        const grd = ctx.createLinearGradient(0, 0, 280, 420)
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(1, '#ffffff')
        ctx.setFillStyle(grd)
        ctx.fillRect(0, 0, 280, 420)
        ctx.drawImage(that.data.creatCardImg1, 130, 0, 280*1.5, 280*1.5,0,0, 280, 240)
        ctx.drawImage(that.data.canvasImg2, 100, 275, 80, 80)
        ctx.setFontSize(14)
        ctx.setFillStyle("#3c3c3c")
        ctx.setTextBaseline('middle')
        ctx.setTextAlign('center')
        ctx.fillText(that.data.creatCardText, 140, 265)
        ctx.setFontSize(10)
        ctx.setFillStyle("#000")
        ctx.setTextBaseline('middle')
        ctx.setTextAlign('center')
        ctx.fillText("长按扫码查看详情", 140, 360)
        ctx.save()
        ctx.draw()
      }
    }, 500)
  },
  delShare: function () {
    var that = this;
    that.setData({
      imgFlag: false
    })
  },
  cancelSpuCanvasImg: function () {
    var that = this;
    that.setData({
      actionSheetHidden: true,
      spuCanvas: true,
      isScorll: "auto"
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
    req.analyticsLog({
      event: 'saca'
    })
  },
  //生成二维码
  showImg() {
    const that = this;
    const userId = wx.getStorageSync('memberId') || wx.getStorageSync('userData').userInfo.id
    console.info(that.data.groupCode)
    wx.request({
      url: app.api.showLmg,
      data: {
        path: 'pages/newStyleRoll/newStyleRoll?activityId=' + that.data.activityId + "&groupType=6" + "&groupCode="+that.data.groupCode + '&userId=' + userId,
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
              canvasImg2: data.tempFilePath
            })
          }
        })
      }
    })
  },
  //分享
  onShareAppMessage(){
    const that = this;
    const userId = wx.getStorageSync('memberId') || wx.getStorageSync('userData').userInfo.id
    req.analyticsLog({
      event: 'share',
      sid: 1,
      pid
    })
    return {
      title: that.data.creatCardText,
      imageUrl: that.data.creatCardImg2,
      path: 'pages/sharePage/sharePage?activityId=' + that.data.activityId + "&groupType=6" + "&groupCode=" + that.data.groupCode + "&userId=" + userId,
    }
  },
  // 绑定
  bindMemberIntroduce(){
    const that = this;
    req.bindMemberIntroduce(that.data.token, that.data.phonetype, channel,that.data.groupCode).then(res=>{
      if (res.status == 2000){

      }
    })
  },
  //创建团
  getMemberIsIntroducer() {
    var that = this;
    req.getMemberIsIntroducer(that.data.token, that.data.phonetype, 6).then(res => {
      if (res.status == 2000) {
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
        that.showImg()
      }
      
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '../../pages/home/index',
      success: function () {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var carts = this.data.carData.goodsList;
    for (var i = 0; i < carts.length; i++) {
      carts[i].isTouchMove = false
    }
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      carData: this.data.carData
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
    var carts = this.data.carData.goodsList;
    for (var i = 0; i < carts.length; i++) {
      carts[i].isTouchMove = false
    }
    for (var i = 0; i < carts.length; i++) {
      if (Math.abs(angle) > 30) return;
      if (carts[i].skuId == index) {
        if (touchMoveX > startX) {
          carts[i].isTouchMove = false
        }
        else {
          carts[i].isTouchMove = true
        }
      }
    }
    //更新数据
    that.setData({
      carData: that.data.carData
    })
  },
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  /*商品加*/
  addCount: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var quantity = e.currentTarget.dataset.quantity;
    if (quantity >= 9) {
      that.setData({
        count: 1500,
        toastText: "商品最多可以加9件"
      });
      that.showToast();
    } else {
      quantity = parseInt(quantity) + parseInt(1);
      wx.request({
        url: app.api.getNewCartShop,
        data: {
          token: that.data.token,
          phonetype: that.data.phonetype,
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
            that.checkInfo()
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
  del: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: app.api.delCart,
      data: {
        token: that.data.token,
        phonetype: that.data.phonetype,
        skuId: index,
        channel: 6
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (result) {
        if (result.data.status == 2000) {
          that.checkInfo()
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
  /*商品减*/
  minusCount: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var quantity = e.currentTarget.dataset.quantity;
    if (quantity <= 1) {
      return false;
    } else {
      quantity = parseInt(quantity) - parseInt(1);
      wx.request({
        url: app.api.getNewCartShop,
        data: {
          token: that.data.token,
          phonetype: that.data.phonetype,
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
            that.checkInfo()
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
  min(){
    const that = this;
    let quantity = that.data.quantity;
    if (quantity <= 1){
      return false
    }else{
      quantity = parseInt(quantity) - parseInt(1);
      that.setData({
        quantity: quantity
      })
    }
  },
  max(){
    const that = this;
    let quantity = that.data.quantity;
    if (quantity >= 9){
      wx.showToast({
        title: '最多可以购买9件',
      })
      return false
    }else{
      quantity = parseInt(quantity) + parseInt(1);
      that.setData({
        quantity: quantity
      })
    }
  }
})
