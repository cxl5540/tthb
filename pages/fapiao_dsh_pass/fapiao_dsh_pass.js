import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
      info:'',
  },
  onLoad: function (options) {
    var data=JSON.parse(options.data);
    this.setData({
      info:data
    })
  },
})