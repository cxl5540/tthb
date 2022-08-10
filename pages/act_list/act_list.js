import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    st_date:'',
    en_date:'',
    tabHeiaght:400,
    triggered:false,
    list:[],
    page:1,
    is_data:true
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-132,
      input_time:util.formatTime(new Date()).substring(0,7)+' - '+util.formatTime(new Date()).substring(0,7),
      st_date:util.formatTime(new Date()).substring(0,7),
      en_date:util.formatTime(new Date()).substring(0,7)
    })
    this.getlist();
  },
  getlist(){  //获取列表
    http.archives_export_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
        input_time:this.data.input_time
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list;         
          if(this.data.is_data){     
            this.setData({
              list:list.concat(res.data.export_list),
            })
          }
         
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.export_list.length<=10){
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
  stdate: function(e) {  //开始时间
    this.setData({
      st_date: e.detail.value.substring(0,7),
      input_time: e.detail.value.substring(0,7)+' - '+this.data.en_date,
      page:1,
      is_data:true,
      list:[]
    })
    this.getlist()   
  },
  endate(e){       //结束时间
    this.setData({
      en_date: e.detail.value.substring(0,7),
      input_time:this.data.st_date+' - '+e.detail.value.substring(0,7),
      page:1,
      is_data:true,
      list:[]
    })
    this.getlist()
  },
  downloadxl(e){
    var path=e.currentTarget.dataset.url
    let that=this;
    wx.downloadFile({
      url:app.globalData.loadimg+path,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        page:1,
        is_data:true,
        key:'',
        list:[],
        input_time:util.formatTime(new Date()).substring(0,7)+' - '+util.formatTime(new Date()).substring(0,7),
        st_date:util.formatTime(new Date()).substring(0,7),
        en_date:util.formatTime(new Date()).substring(0,7)
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
  scrollToLower(e){ //上拉加载
    if(this.data.is_data){
      this.setData({
        page:this.data.page+1
      })
      this.getlist()
    }
    
  },
})