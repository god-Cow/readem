var app = getApp();
Page({
  data: {
    token:"",
    phoneType:"", 
    groupList1:[],
    groupList2:[],
    groupList3:[],
    groupId:"0",
    groupLength:false,
    imgUrl:"", //生成的图片链接
    imgFlag:false, //图片开关
    groupCode:"",
    tips: "none", //拼单规则
    isShowToast: false,
    clock: [],
  },
  onLoad: function (options) {
    var that = this;  
    if (options == undefined){
      var current = 0;
    }else{
      if (options.currentTab != undefined) {
        var current = options.currentTab;
      } else {
        var current = 0;
      }
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          currentTab: current
        });
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
            wx.request({
              url: app.api.getGroupList,
              data:{
                token:that.data.token,
                phonetype:that.data.phoneType,
                channel:6,
              },
              success:function(res){
                if(res.data.status == 2000){
                  if(res.data.data.length > 0){
                    that.setData({
                      groupLength:false
                    })
                    var groupList1 = [];
                    var groupList2 = [];
                    var groupList3 = [];
                    for(var i = 0; i < res.data.data.length;i++){
                      if (res.data.data[i].status == 0 || res.data.data[i].status == 2){
                        groupList1.push(res.data.data[i])
                      }
                      if (res.data.data[i].status == 1) {
                        groupList2.push(res.data.data[i])
                      }
                      if (res.data.data[i].status == 3) {
                        groupList3.push(res.data.data[i])
                      }
                    }
                    that.setData({
                      groupList1: groupList1,
                      groupList2: groupList2,
                      groupList3: groupList3,
                    })
                    var arr = []
                    for (var i = 0; i < that.data.groupList1.length ; i++){
                      arr.push(that.data.groupList1[i].endTime)
                    }
                    that.product(arr)
                  }else{
                    that.setData({
                      groupLength: true
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
  product:function(data){
    var that = this;
    that.setData({
      xsqg: data
    })
    var interval = setInterval(function () {
      var clock = that.getData(that.data.xsqg);
      that.setData({        
        clock: clock
      });
    }.bind(this), 1000);
  },
  getData: function (timetot) {
    var that = this;
    var timetot = timetot;
    var clockarr = [];
    var timenow = Date.parse(new Date()) / 1000;
    for (var i = 0; i < timetot.length; i++) {
      var totalSecond = timetot[i] - timenow;
      var totalstart = timetot[i] - timenow;
      var time = that.dateformat(totalSecond);
      clockarr.push(time);
    }
    return clockarr;
  },
  dateformat: function (micro_second){
    var second = micro_second;//总的秒数
    if (second< 0){
      return "0:0:0";
    }else{
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
      return hrStr + ":" + minStr + ":" + secStr;
    }
  },
  onShareAppMessage: function (options) {
    var that = this;
    if (options.from == "menu") {
      return {
        title: '拼单列表',
        path: 'pages/group/group',
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
    wx.stopPullDownRefresh()
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
  exitGroup: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    wx.request({
      url: app.api.quitGroupBooking,
      data: {
        token: that.data.token,
        phonetype: that.data.phoneType,
        channel: "6",
        groupId: id
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 2000) {
          that.setData({
            count: 3000,
            toastText: res.data.data,
          });
          that.showToast();
          setTimeout(function () {
            wx.switchTab({
              url: '../../pages/home/index',
              success:function(){
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          }, 1500)
        } else {
          that.setData({
            count: 3000,
            toastText: res.data.msg,
          });
          that.showToast();
        }
      }
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
  newGoSpecial:function(e){
    var that = this;
    var activityid = e.currentTarget.dataset.activityid;
    var special = e.currentTarget.dataset.specialid;
    var topicid = e.currentTarget.dataset.topicid;
    var type = e.currentTarget.dataset.type;
    if (activityid != null && special != null && topicid != null && type != null){
      wx.navigateTo({
        url: "../groupSpecial/groupSpecial?path=" + special + "_" + topicid + "_1_" + activityid + "_" + type,
      })
    }else{
      wx.switchTab({
        url: '../../pages/home/index',
        success: function () {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }
  },
  newGoDetail:function(e){
    var that = this;
    var spuId = e.currentTarget.dataset.spuid;
    if(spuId != "" && spuId != null){
      wx.navigateTo({
        url: '../detail/detail?spuId=' + spuId,
      })
    }else{
      wx.switchTab({
        url: '../../pages/home/index',
        success: function () {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      })
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
    });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
})