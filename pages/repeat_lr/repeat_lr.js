// index.js
// 获取应用实例
import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    invoice_info:'',
    invoice_verify_info:'',
    type:'',
    qr_code_str:''
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      type:options.type,
    })
    if(options.type==1){
      this.setData({
        qr_code_str:options.qr_code_str
      })
    }else if(options.type==2){
      this.setData({
        invoice_id:options.invoice_id,
        year:options.year
      })
    }else{
      this.setData({
        invoice_code:options.invoice_code,
        invoice_num:options.invoice_num
      })
    }
    this.invoice_check_duplicate()
  },
  invoice_check_duplicate(){ //发票查重
    var data='';
    if(this.data.type==1){
      data={
        type:1,
        qr_code_str:this.data.qr_code_str,
        uid:wx.getStorageSync('uid'),
      }
    }else if(this.data.type==2){
      data={
        type:2,
        uid:wx.getStorageSync('uid'),
        invoice_id:this.data.invoice_id,
        year:this.data.year
      }
    }else{
      data={
        type:3,
        uid:wx.getStorageSync('uid'),
        invoice_code:this.data.invoice_code,
        invoice_num:this.data.invoice_num
      }
    }

    http.invoice_check_duplicate({   
      data:data,
       success:res=>{
         console.log(res.data.invoice_info)
        this.setData({
          invoice_info:res.data.invoice_info,
          invoice_verify_info:res.data
        })
       }
    })    
  },
  back(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  clickImg(){
    let that=this;
    wx.downloadFile({
      url:app.globalData.loadimg+that.data.invoice_info.script_path,
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
  verify_see(){ //查看验真
    if(this.data.invoice_info.is_verification!==1){
      wx.navigateTo({
        url: '/pages/fapiao_dsh_pass/fapiao_dsh_pass?year=2022'+'&data='+JSON.stringify(this.data.invoice_verify_info),
      })
    }else{
      wx.showToast({
        title: '该发票还未验真',
        icon:'none'
      })
    }
  },
})