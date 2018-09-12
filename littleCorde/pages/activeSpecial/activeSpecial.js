var app = getApp();
Page({
  data: {
    list:[]
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.api.getValidSpecialList,
      success:function(res){
        if(res.data.status == 2000){
          for(var i = 0; i < res.data.data.length; i++){
            if (res.data.data[i].activityId != null && res.data.data[i].topicId != null && res.data.data[i].type != null && res.data.data[i].specialId != null){
              that.data.list.push(res.data.data[i])
            }
          }
          that.setData({
            list:that.data.list
          })
        }
      }
    })
  },
  goSpecial:function(e){
    var that = this;
    var activityid = e.currentTarget.dataset.activityid;
    var special = e.currentTarget.dataset.special;
    var topicid = e.currentTarget.dataset.topicid; 
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: "../groupSpecial/groupSpecial?path=" + special + "_" + topicid + "_1_" + activityid + "_" + type,
    })
  }
})