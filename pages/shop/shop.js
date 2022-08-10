import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    list:[],
      triggered:false,
      is_data:true,
      tabHeiaght:400,
      page:1,
      uid:''
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-0,
    })
    if(wx.getStorageSync('uid')){
      this.setData({
        uid:wx.getStorageSync('uid')
      });
    }
    this.getlist()
  },
  getlist(){  //获取数据
    http.commodity_list({
      data:{
        page:this.data.page,
        limit:10
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list;         
          if(this.data.is_data){     
            this.setData({
              list:list.concat(res.data.commodity_list),
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.commodity_list.length<=10){
            this.setData({
              is_data:false
            })
          }
        }else{
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
        }
      }     
    })
  },
  getUserProfile(e){ //授权
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        util.login(res.encryptedData,res.iv);
        util.checkLoginReadyCallback = res => {
          this.setData({
            uid: res,
          })
        }               
      }
    })
  },
  scrollToLower(e){ //上拉加载
    if(this.data.is_data){
      this.setData({
        page:this.data.page+1
      })
      this.getlist()
    }  
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        page:1,
        is_data:true,
        list:[],
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
  detail(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods_del/goods_del?id='+id,
    })
  }

})