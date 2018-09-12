var app = getApp();
Page({
  data: {
    // data:"",
    popularity: [],
    indicatorDots: false,
    autoplay: false,
    interval: 4000,
    duration: 800,
    contentFlag:true,
    data: {
      "banner": [
        {
          "specialId": 1818,
          "topicId": 1881,
          "name": "小小天使房",
          "title": "可爱的小天使房中都藏着什么呢？",
          "synopsis": "床品/饰品/玩具/家具",
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/cashSalebanner.png"
        }
      ],
      "category": [
        {
          "name": "卫衣",
          "specialId": 1773,
          "topicId": 1836,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale06.png"
        },
        {
          "name": "长袖T恤",
          "specialId": 1781,
          "topicId": 1844,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale08.png"
        },
        {
          "name": "连体衣",
          "specialId": 1784,
          "topicId": 1847,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale03.png"
        },
        {
          "name": "夹克",
          "specialId": 1782,
          "topicId": 1845,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale02.png"
        },
        {
          "name": "牛仔裤",
          "specialId": 1777,
          "topicId": 1840,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale04.png"
        },
        {
          "name": "运动裤",
          "specialId": 1776,
          "topicId": 1839,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale07.png"
        },
        {
          "name": "裙子",
          "specialId": 1774,
          "topicId": 1837,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/the20180503cashSale05.png"
        }
      ],
      "specialP": [
        {
          "specialId": 1862,
          "topicId": 1925,
          "name": "人气单品",
          "title": "人气单品",
          "eTitle": "MOST POPULAR",
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/popularitySku.png",
          "products": [

          ]
        }
      ],
      "specialS": [
        {
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/brandActivity.png",
          "title": "品牌活动",
          "eTitle": "BRAND ACTIVITIES",
          "specials": [
            {
              "name": "STELLA MCCARTNEY KIDS",
              "specialId": 1742,
              "topicId": 1805,
              "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/STELLAMCCARTNEYKIDS@2x.png"
            },
            {
              "name": "THE ANIMALS OBSERVATORY",
              "specialId": 1743,
              "topicId": 1806,
              "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/THEANIMALSOBSERVATORY@2x.png"
            },
            {
              "name": "TINY COTTONS",
              "specialId": 1745,
              "topicId": 1808,
              "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/TINYCOTTONS@2x.png"
            },
            {
              "name": "BEAU LOVES",
              "specialId": 1747,
              "topicId": 1810,
              "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/BEAULOVES@2x.png"
            },
            {
              "name": "KENZO",
              "specialId": 1748,
              "topicId": 1811,
              "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/KENZO@2x.png"
            },
            {
              "name": "EMU",
              "specialId": 1751,
              "topicId": 1814,
              "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/EMUAUSTRALIA@2x.png"
            }
          ]
        }
      ],
      "brand": [
        {
          "name": "DOLCE&GABBANA",
          "specialId": 1744,
          "topicId": 1807,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/DG.jpg"
        },
        {
          "name": "MINI RODINI",
          "specialId": 1749,
          "topicId": 1812,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/MINI-RODINI.jpg"
        },
        {
          "name": "YOUNG VERSACE",
          "specialId": 1752,
          "topicId": 1815,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/VERSACE.jpg"
        },
        {
          "name": "FENDI",
          "specialId": 1753,
          "topicId": 1816,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/FENDI.jpg"
        },
        {
          "name": "ACNE STUDIOS",
          "specialId": 1754,
          "topicId": 1817,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/ACNE-STUDIOS.jpg"
        },
        {
          "name": "GUCCI ",
          "specialId": 1766,
          "topicId": 1829,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/GUCCI.jpg"
        },
        {
          "name": "MSGM",
          "specialId": 1801,
          "topicId": 1864,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/MSGM.jpg"
        },
        {
          "name": "MARNI",
          "specialId": 1802,
          "topicId": 1865,
          "img": "https://img3.cloudokids.cn/h5img/newBuyers/newBuyersImg/MARNI.jpg"
        }
      ]
    }

  },
  onShow: function () {
    var that = this;
    // wx.request({
    //   url: app.api.cashSaleUrl,
    //   data: {},
    //   success: function (data) {
    //     if (data.data.status == 2000) {
    //       that.setData({
    //         data: JSON.parse(data.data.data.note),
    //         contentFlag:true
    //       });
    //     }

    //   },
    // });
    wx.request({
      url: "https://api.cloudokids.cn/API/homepage/getSpecial",
      data: {
        specialId: 1925,
        specialTopicId: 1862,
        pageNumber: 1,
        pageSize: 15,
      },
      success: function (data) {
        if (data.data.status == 2000) {
          that.setData({
            popularity: data.data.data.datas
          })
        }
      },
    })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  goBrand: function (e) {
    var specialId = e.currentTarget.dataset.specialid;
    var titleName = e.currentTarget.dataset.title;
    var title = titleName.replace("&", "!")
    wx.navigateTo({
      url: '../newStyle/newStyle?specialId=' + specialId + '&title=' + title + '&pageCome=1',
    })
  },
  goGoods: function (e) {
    wx.navigateTo({
      url: '../detail/detail?spuId=' + e.currentTarget.dataset.id
    })
  },
  golist: function (e) {
    wx.navigateTo({
      url: '../newStyle/newStyle?specialId=570&specialTopicId=574&title=国内现货&pageCome=1'
    })
  },
  goActiveSpecial: function () {
    wx.navigateTo({
      url: '../activeSpecial/activeSpecial',
    })
  },
})