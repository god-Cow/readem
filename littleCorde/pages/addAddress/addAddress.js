var app = getApp();
const req = require('../../utils/request.js')
const weApi = require('../../utils/weApis.js')
const pid = 27;

Page({
  data: {
    isShowToast:false,
    checked:false,
    provinces: [],
    province: "",  //添加地址选择的省
    citys: [],
    city: "", //添加地址选择的市
    countys: [],
    county: '', //添加地址选择的县区
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    newAddress:"请选择",
    addressId:"",  //回显地址id
    token:"",
    phoneType:"",
    username:"",
    phone:"",
    location:"", // 详细地址
    postcode:"",
    isDefault:"0",
    changeProvice:"", //暂时存地址的省
    changeCity: "",  //暂时存地址的市
    changeCounty: "", //暂时存地址的县
    idCardNumber:""
  },
  bindChange: function (e) {
    var that = this;
    var val = e.detail.value;
    var t = that.data.values;
    var provinces = that.data.provinces;
    var citys = that.data.citys;
    if(val[0]!=t[0]){
      wx.request({
        url: app.api.getRegion,
        data: {
          depth: 3,
          isStop: 0,
          parentRegionId: provinces[val[0]].id,
        },
        header: {
          "content-type": "applicaiton/json"
        },
        method: "GET",
        success: function (data) {
          if (data.data.status == 2000) {
            that.setData({
              citys: data.data.data,
            })
            wx.request({
              url: app.api.getRegion,
              data: {
                depth: 4,
                isStop: 0,
                parentRegionId: that.data.citys[0].id,
              },
              header: {
                "content-type": "applicaiton/json"
              },
              method: "GET",
              success: function (newData) {
                if (newData.data.status == 2000) {
                  that.setData({
                    countys: newData.data.data,
                  })
                }
                that.setData({
                  changeProvice: that.data.provinces[val[0]],
                  citys: that.data.citys,
                  changeCity: that.data.citys[0],
                  countys: that.data.countys,
                  changeCounty: that.data.countys[0],
                  values: val,
                  value: [val[0], 0, 0],
                })
              }
            })
          }
        }
      })
      return;
    }
    if(val[1] != t[1]){
      that.setData({
        countys: [],
      })
      wx.request({
        url: app.api.getRegion,
        data: {
          depth: 4,
          isStop: 0,
          parentRegionId: citys[val[1]].id,
        },
        header: {
          "content-type": "applicaiton/json"
        },
        method: "GET",
        success: function (newData) {
          if (newData.data.status == 2000) {
            that.setData({
              countys: newData.data.data,
            })
          }
          that.setData({
            changeCity: that.data.citys[val[1]],
            countys: that.data.countys,
            changeCounty: that.data.countys[0],
            values: val,
            value: [val[0], val[1], 0],
          })
        }
      })
      return;
    }
    if(val[2] != t[2]){
      that.setData({
        changeCounty: that.data.countys[val[2]],
        values: val,
      })
      return;
    }
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      addressId: options.addressId
    })
    var addressId = that.data.addressId;
    wx.request({
      url: app.api.getRegion,
      data: {
        depth: 1,
        isStop: 0
      },
      header: {
        "content-type": "applicaiton/json"
      },
      success: function (res) {
        if (res.data.status == 2000) {
          wx.request({
            url: app.api.getRegion,
            data: {
              depth: 2,
              isStop: 0,
              parentRegionId: 1,
            },
            header: {
              "content-type": "applicaiton/json"
            },
            method: "GET",
            success: function (result) {
              if (result.data.status == 2000) {
                that.setData({
                  provinces: result.data.data,
                })
                that.setData({
                  changeProvice: that.data.provinces[0]
                })
                wx.request({
                  url: app.api.getRegion,
                  data: {
                    depth: 3,
                    isStop: 0,
                    parentRegionId: 2,
                  },
                  header: {
                    "content-type": "applicaiton/json"
                  },
                  method: "GET",
                  success: function (data) {
                    if (data.data.status == 2000) {
                      that.setData({
                        citys: data.data.data,
                      })
                      that.setData({
                        changeCity: that.data.citys[0]
                      })
                      wx.request({
                        url: app.api.getRegion,
                        data: {
                          depth: 4,
                          isStop: 0,
                          parentRegionId: 3,
                        },
                        header: {
                          "content-type": "applicaiton/json"
                        },
                        method: "GET",
                        success: function (newData) {
                          if (newData.data.status == 2000) {
                            that.setData({
                              countys: newData.data.data,
                            })
                            that.setData({
                              changeCounty: that.data.countys[0]
                            })
                          }
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
                                  if (addressId) {
                                    that.setData({
                                      province: "",
                                      city: "",
                                      county: "",
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
                                      success: function (result) {
                                        if (result.data.status == 2000) {
                                          for (var i = 0; i < result.data.data.length; i++) {
                                            if (addressId == result.data.data[i].id) {
                                              that.setData({
                                                username: result.data.data[i].name,
                                                phone: result.data.data[i].phone,
                                                newAddress: result.data.data[i].provinceVo + "/" + result.data.data[i].cityVo + "/" + result.data.data[i].countyVo,
                                                location: result.data.data[i].address,
                                                postcode: result.data.data[i].postcode,
                                                isDefault: result.data.data[i].isDefault,
                                                idCardNumber: result.data.data[i].idCardNumber,
                                                province: {
                                                  name: result.data.data[i].provinceVo,
                                                  id: result.data.data[i].province
                                                },
                                                city: {
                                                  name: result.data.data[i].cityVo,
                                                  id: result.data.data[i].city
                                                },
                                                county: {
                                                  name: result.data.data[i].countyVo,
                                                  id: result.data.data[i].county
                                                }
                                              })
                                              var isDefault = that.data.isDefault;
                                              if (isDefault) {
                                                that.setData({
                                                  checked: true
                                                })
                                              } else {
                                                that.setData({
                                                  checked: false
                                                })
                                              }
                                            }
                                          }
                                        }
                                      }
                                    })
                                  }
                                },
                              })
                            },
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
    req.analyticsLog({
      event: 'view',
      pid
    });
  },
  open: function () {
    this.setData({
      condition: !this.data.condition,
    })
  },
  confirm:function(){
    var that = this;
    var proviceVo = that.data.changeProvice;
    var cityVo = that.data.changeCity;
    var countyVo = that.data.changeCounty;
    var proviceName = that.data.changeProvice.name;
    var cityName = that.data.changeCity.name;
    var countyName = that.data.changeCounty.name;
    console.info(proviceVo, cityVo, countyVo)
    that.setData({
      province: proviceVo,
      city: cityVo,
      county: countyVo,
      newAddress: proviceName + '/' + cityName + "/" + countyName,
      condition: !this.data.condition
    })
  },
  selectList:function(){
    var that = this;
    var checked = that.data.checked;
    if (checked){
      that.setData({
        checked:false,
        isDefault:0
      })
    }else{
      that.setData({
        checked: true,
        isDefault: 1
      })
    }
  },
  username:function(e){
    var that = this;
    that.setData({
      username:e.detail.value
    })
  },
  phone: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  location: function (e) {
    var that = this;
    that.setData({
      location: e.detail.value
    })
  },
  postcode: function (e) {
    var that = this;
    that.setData({
      postcode: e.detail.value
    })
  },
  idCardNumber: function (e) {
    var that = this;
    that.setData({
      idCardNumber: e.detail.value
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
  addAddress:function(){
    var that = this;
    var addressId = that.data.addressId;
    var reg = /^\d{11}$/;
    var token = that.data.token;
    var phoneType = that.data.phoneType;
    var username = that.data.username;
    var phone = that.data.phone;
    var location = that.data.location;
    var postcode = that.data.postcode;
    var isDefault = that.data.isDefault;
    var province = that.data.province.id;
    var city = that.data.city.id;
    var county = that.data.county.id;
    var idCardNumber = that.data.idCardNumber;
    if (idCardNumber != null){

    }else{
      idCardNumber=""
    }
    if (token != null && token != null && phoneType != null && phoneType != "" && isDefault != null) {
      if (username != null && username != "") {
        if (reg.test(phone)) {
          if (province != null && province != "" && city != "" && city != null && county != null && county != "") {
            if (location != null && location != null) {
              if (location.length < 30) {
                if (postcode != null && postcode != "") {
                  if (addressId != null && addressId != ""){
                    wx.request({
                      url: app.api.updateMemberAddress,
                      data:{
                        token:token,
                        phonetype: phoneType,
                        channel:6,
                        id: addressId,
                        name: username,
                        phone: phone,
                        state:1,
                        province: province,
                        city: city,
                        county: county,
                        address: location,
                        postcode: postcode,
                        isDefault: isDefault,
                        idCardNumber: idCardNumber
                      },
                      header:{
                        "content-type": "application/x-www-form-urlencoded"
                      },
                      method: "POST",
                      success:function(result){
                        if (result.data.status == 2000) {
                          wx.navigateBack({
                            delta: 1
                          })
                        } else {
                          var title = result.data.msg;
                          that.setData({
                            count: 1500,
                            toastText: title
                          });
                          that.showToast(); 
                        }
                      }
                    })
                  }else{
                    wx.request({
                      url: app.api.addAddress,
                      data: {
                        token: token,
                        phonetype: phoneType,
                        state: 1,
                        province: province,
                        city: city,
                        county: county,
                        address: location,
                        name: username,
                        phone: phone,
                        channel: 6,
                        postcode: postcode,
                        isDefault: isDefault,
                        idCardNumber: idCardNumber
                      },
                      header: {
                        "content-type": "application/x-www-form-urlencoded"
                      },
                      method: "POST",
                      success: function (res) {
                        if (res.data.status == 2000) {
                          wx.navigateBack({
                            delta: 1
                          })
                        } else {
                          var title = res.data.msg;
                          that.setData({
                            count: 1500,
                            toastText: title
                          });
                          that.showToast(); 
                        }
                      }
                    })
                  }
                } else {
                  that.setData({
                    count: 1500,
                    toastText: '请输入邮编！'
                  });
                  that.showToast(); 
                }
              } else {
                that.setData({
                  count: 1500,
                  toastText: '详细地址不能超过30个字！'
                });
                that.showToast(); 
              }
            } else {
              that.setData({
                count: 1500,
                toastText: '请输入详细地址！'
              });
              that.showToast(); 
            }
          } else {
            that.setData({
              count: 1500,
              toastText: '请选择所在地址！'
            });
            that.showToast(); 
          }
        } else {
          that.setData({
            count: 1500,
            toastText: '请输入正确手机号！'
          });
          that.showToast(); 
        }
      } else {
        that.setData({
          count: 1500,
          toastText: '请输入姓名！'
        });
        that.showToast(); 
      }
    }
  }
})