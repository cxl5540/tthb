// app.js
!function(){
  var PageTmp = Page;
  Page =function (pageConfig) {
    // 设置全局默认分享
    pageConfig = Object.assign({
        //右上角分享功能
        onShareAppMessage () {
            return {
                title: '',//分享标题
                path: '/pages/index/index',//分享用户点开后页面
                imageUrl: '',//分享图片
                success (res) {
                    console.log('分享成功！')
                }
            }
        }
    },pageConfig);
    PageTmp(pageConfig);
  };
}();
App({
  onLaunch() {
   this.overShare()
  },
  overShare:function() {
    // 监听路由切换
    wx.onAppRoute(function(res) {
        wx.showShareMenu({
          withShareTicket:true,
          menus:['shareAppMessage','shareTimeline']
        })
     
    })
  },
 
  call(){
    wx.makePhoneCall({
      phoneNumber: '13271887283',
      fail:function name(params) {
        
      }
    })
  },
  getwx(params) { //微信客服二维码
    wx.previewImage({
      current:'',
      urls: ['https://tzzs.toommi.com/data/upload/config/tz2.png']
     })
  },
  kefu_f(){  //微信客服跳转
    wx.openCustomerServiceChat({
        extInfo: {
          url: 'https://work.weixin.qq.com/kfid/kfc5722870690518a82'
        },
        corpId: 'ww0ca5c38bf1d4d086',
        success(res) {
          console.log(res);
        },
        fail(res) {
          console.log(res);
        }
      })

  },
  globalData: {
    userInfo: null,
    // url:'http://192.168.10.103/red_packet/api/Index/apppost',
    // urlupload:'http://192.168.3.49/red_packet/api/Index/apppost',
    // loadimg:'http://192.168.3.49/invoice/'
     url:'https://tzzs.toommi.com/api/Index/apppost',
    //  urlupload:'https://tzzs.toommi.com/api',
     loadimg:'https://tzzs.toommi.com/',
  }
})
