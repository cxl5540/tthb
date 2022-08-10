// pages/yg_yaoqm/yg_yqm.js
Page({
  data: {
    code:''
  },
  onLoad: function (options) {
    this.setData({
      code:options.yg
    })
  },
  clickImg(){
    wx.previewImage({
      current:'',
      urls: ['https://tzzs.toommi.com/data/upload/config/tz1.png']
     })
    },
})