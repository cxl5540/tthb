import util from '../../utils/util.js'
import http from '../../utils/api'
let videoAd = null
const app = getApp()
Page({
 data: {
    show:false,
    type:'',
    gold_num:0
  },
  onLoad: function (options) { 
      this.setData({
          type:options.type
      })
      if(options.type==1){
        wx.setNavigationBarTitle({
          title: "天天红包"
        })
      }else{
        wx.setNavigationBarTitle({
          title: "整点金币"
        })
      }
    if (wx.createRewardedVideoAd) {
        videoAd = wx.createRewardedVideoAd({
          adUnitId: this.data.type==1?'adunit-8b95d745712799c8':'adunit-0bc4435f7c974dd9'
        })
        videoAd.onLoad(() => {})
        videoAd.onError((err) => {})
        videoAd.onClose((res) => {
            if (res && res.isEnded) {
                // 正常播放结束，可以下发游戏奖励
                if(this.data.type==1){
                    this.get_red_packet()
                }else{
                    this.get_gold()
                }   
              } else {
                  console.log(1)
              }      
        })
      }
  },
  back(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  openVideoAd(){ //打开广告
        // 用户触发广告后，显示激励视频广告
        if (videoAd) {
            videoAd.show().catch(() => {
              // 失败重试
              videoAd.load()
                .then(() => videoAd.show())
                .catch(err => {
                  console.log('激励视频 广告显示失败')
                })
            })
          }
  },
  onShow: function () {   
  },
  mine(){ //个人中心
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  close(){ //关闭弹窗
    this.setData({
        show:false
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  get_red_packet(){//天天红包
    http.get_red_packet({
      data:{
        user_id:wx.getStorageSync('uid')
      },
      success:res=>{
          console.log(res)
          if(res.code==200){
            this.setData({
                show:true
            });
          }else{
            wx.showToast({
                title: res.msg,
                icon:'none'
              })
          } 
       }
    })
  },
  get_gold(){//整点金币
    http.get_gold({
      data:{
        user_id:wx.getStorageSync('uid')
      },
      success:res=>{
          console.log(res)
          if(res.code==200){
            this.setData({
                show:true,
                gold_num:res.data.gold_num
            });
          }else{
            wx.showToast({
                title: res.msg,
                icon:'none'
              })
          } 
       }
    })
  },
})