import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    invoice_id:'',
    index:'',
    user_info:'',
    invoice_info:'',
    passdata:'',
    check:false,
    is_verification:''
  },
  onLoad: function (options) {
    this.setData({
      invoice_id:options.id,
      index:options.index,
      is_verification:options.is_verification
    })
    console.log(options.is_verification)
    this.getdata();  
  },
  getdata(){  //获取数据
    http.invoice_examine_detail({
      data:{
        uid:wx.getStorageSync('uid'),
        invoice_id:this.data.invoice_id
      },
      success:res=>{
        if(res.code==200){
          res.data.invoice_info.tax_rate=res.data.invoice_info.tax_rate.slice(0,res.data.invoice_info.tax_rate.length-1);
          this.setData({
            user_info:res.data.user_info,
            invoice_info:res.data.invoice_info
          })
          if(this.data.is_verification!=1){
            this.checktrue()
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
  pass(){ //通过
    let that=this;
      http.invoice_examine_adopt({
        data:{
         uid:wx.getStorageSync('uid'),
         invoice_ids:that.data.invoice_id,
        },
        success:res=>{
           if(res.code==200){
            const pages = getCurrentPages()
            const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
            var list= prevPage.data.list;
            list.splice(that.data.index,1)
            prevPage.setData({
              list:list,
            }) 
            wx.showToast({
              title: res.msg,
              success:function(){
                setTimeout(
                  function(params) {
                    wx.navigateBack()
                },1000)              
              }
            })
           }else{
             wx.showToast({
               title: res.msg,
               icon:'none'
             })
           }
        }            
     })
  },
  no_pass(){  //不通过
    let that=this;
      wx.showModal({
        title: '编辑审核意见',
        placeholderText: '请输入审核意见',
        editable:true,
        success (res) {     
          if (res.confirm) {
             http.invoice_examine_reject({
               data:{
                uid:wx.getStorageSync('uid'),
                invoice_ids:that.data.invoice_id,
                opinion:res.content
               },
               success:res=>{
                  if(res.code==200){
                    const pages = getCurrentPages()
                    const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
                    var list= prevPage.data.list;
                    list.splice(that.data.index,1)
                    prevPage.setData({
                      list:list,
                    }) 
                    wx.showToast({
                      title: res.msg,
                      success:function(){
                        setTimeout(
                          function(params) {
                            wx.navigateBack()
                        },1000)              
                      }
                    })
                  }else{
                    wx.showToast({
                      title: res.msg,
                      icon:'none'
                    })
                  }
               }            
            })          
          } else if (res.cancel) {
      
          }
        }
      })
  },

  checktrue(e){ //查看验真
      let invoice_info=this.data.invoice_info;
      http.invoice_verify({
        data:{
          uid:wx.getStorageSync('uid'),
          operate_type:2,
          invoice_type:invoice_info.invoice_type,
          invoice_code:invoice_info.invoice_code,
          invoice_num:invoice_info.invoice_num,
          invoice_time:util.getdate(invoice_info.invoice_date),
          check_code:invoice_info.check_code,
          total_amount:invoice_info.total_amount,
        },
        success:res=>{
          if(res.code==200){
            var passdata=res.data.invoice_verify_info;
            this.setData({
              passdata:res.data.invoice_verify_info,
              'invoice_info.tax_rate':passdata.TaxRate,
              'invoice_info.total_tax':passdata.TotalTax,
              'invoice_info.amount_in_figuers':passdata.AmountInFiguers,
              check:true
            })
            if(!invoice_info.seller_name){
              this.setData({
                'invoice_info.seller_name':passdata.SellerName
              })
            }
            if(!invoice_info.seller_register_num){
              this.setData({
                'invoice_info.seller_register_num':passdata.SellerRegisterNum
              })
            }
            if(!invoice_info.purchaser_name){
              this.setData({
                'invoice_info.purchaser_name':passdata.PurchaserName
              })
            }
            if(!invoice_info.purchaser_register_num){
              this.setData({
                'invoice_info.purchaser_register_num':passdata.PurchaserRegisterNum
              })
            }
            if(e){
              setTimeout(function(){
                wx.navigateTo({
                  url: '/pages/fapiao_dsh_pass/fapiao_dsh_pass?data='+JSON.stringify(res.data),
                })
             },2000)
            }          
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }
        }
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
})