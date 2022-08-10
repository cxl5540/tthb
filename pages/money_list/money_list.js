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
    type:1,
    user_info:''
  },

  onLoad: function (options) {
    this.setData({
      type:options.type,
      tabHeiaght:wx.getSystemInfoSync().windowHeight-82,
    })
    this.getlist()
  },
  kaipiao_list(){ //开票记录
    wx.navigateTo({
      url: '/pages/kaipiao_list/kaipiao_list',
    })
  },
  getlist(){  //获取数据
    http.earnings_list({
      data:{
        user_id:wx.getStorageSync('uid'),
        page:this.data.page,
        limit:10,
        type:this.data.type
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list; 
          this.setData({
            user_info:res.data.user_info
          })        
          if(this.data.is_data){     
            this.setData({
              list:list.concat(res.data.log_list),
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.log_list.length<=10){
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
  kaifapiao_edit(){ //编辑开发票
    // wx.navigateTo({
    //   url: '/pages/kaifapiao_edit/kaifapiao_edit',
    // })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
})