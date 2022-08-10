import http from '../../utils/api';
const app=getApp()
Page({
  data: {
    money:'',
    pay_param:'',
  },
  onLoad: function (options) {
    var pay_param=JSON.parse(decodeURIComponent(options.data))
    this.setData({
      money:options.money,
      pay_param:pay_param,
    })
  },
  doWxPay() { //微信支付
    let that = this;
    var pay_param=this.data.pay_param;
    wx.requestPayment({
      timeStamp: pay_param.timeStamp, //记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr:pay_param.nonceStr,
      package:pay_param.package,
      signType:"MD5",
      paySign:pay_param.paySign,
      success: function(event) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000

        });
        wx.switchTab({
          url: '/pages/mine/mine',
        })
        //支付成功
      },
      fail: function(error) {
        wx.showToast({
          title: '已取消',
          icon: 'none',
          duration: 2000,
        });
      },
      complete: function() {
        console.log("pay complete")
      }

    });
  },
  kefu_f(){
    app.kefu_f()
  }
})