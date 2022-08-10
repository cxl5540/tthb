// pages/kaifapiao_edit/kaifapiao_edit.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {value: '1', name: '企业单位'},
      {value: '2', name: '个人/非企业', checked: 'true'},
    ],
  },
  onLoad: function (options) {

  },
  kefu_f(){
    app.kefu_f()
  }
})