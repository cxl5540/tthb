// pages/pc_set/pc_set.js
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    qrcode:wx.getStorageSync('qrcode')
  },
  onLoad(options){
    console.log(wx.getStorageSync('qrcode'))
  },
  getwx(params) { //识别二维码
    wx.previewImage({
      current:'',
      urls: [this.data.qrcode]
     })
  },

})