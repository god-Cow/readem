var app = getApp();
Page({
  data: {
    getCategorySales:[],
  },
  onLoad: function(){
    var that = this;
    wx.request({
      url: app.api.getCategorySales,
      data: {
        version: "10000."
      },
      header: {
        "content-type": "application/json"
      },
      method: "GET",
      success: function (res) {
        if (res.data.status == 2000) {
          for (var i = 0; i < res.data.data.length; i++) {
            that.data.getCategorySales.push({
              id: res.data.data[i].id,
              childData: res.data.data[i].childData,
              name: res.data.data[i].name,
              specialId: res.data.data[i].specialId,
              topicId: res.data.data[i].topicId,
              type: res.data.data[i].type,
              display:"none"
            })
          }
          that.setData({
            getCategorySales: that.data.getCategorySales
          })
        }
      }
    })
  },
  effect:function(e){
    var that = this;
    var categoryFlag = e.currentTarget.dataset.flag;
    var id = e.currentTarget.dataset.id;
    if (categoryFlag == "none"){
      for (var i = 0; i < that.data.getCategorySales.length; i++){
        if (that.data.getCategorySales[i].id == id){
          that.data.getCategorySales[i].display = "block"
        }else{
          that.data.getCategorySales[i].display = "none"
        }
      }
    }else{
      for (var i = 0; i < that.data.getCategorySales.length; i++) {
        if (that.data.getCategorySales[i].id == id) {
          that.data.getCategorySales[i].display = "none"
        }else {
          that.data.getCategorySales[i].display = "none"
        }
      }
    }
    that.setData({
      getCategorySales: that.data.getCategorySales
    })
  },
})