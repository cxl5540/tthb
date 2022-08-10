import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    edit:false,
    id:'',
    year:'',
    invoice_info:'',
    file:'',
    src:[],
    flag:false,
    basic_info:'',
    infolist:'',
    passdata:'',
    is_verification:'',
    check:false
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id,
      year:options.year,
      is_verification:options.is_verification
    });
    this.getdata();
  },
  inputWacth(e){ //编辑
    let invoice_info = this.data.invoice_info;
    let item = e.currentTarget.dataset.model;
    invoice_info[item] = e.detail.value;
    if(invoice_info.total_amount&&item=='total_amount'){
        if(invoice_info.tax_rate){
          invoice_info['total_tax']=(Number(invoice_info.total_amount)*Number(invoice_info.tax_rate)/100).toFixed(2)
        }else{
          invoice_info['total_tax']=(Number(invoice_info.total_amount)*0).toFixed(2)
        } 
        invoice_info['amount_in_figuers']=(Number(invoice_info.total_amount)+Number(invoice_info.total_tax)).toFixed(2)
      }
      this.setData({
        invoice_info:invoice_info
      });
      if(this.data.check){
        let that=this;
        wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
          if(!rect.length){
            that.setData({
              is_verification:2
            })
          }else{
            that.setData({
              is_verification:3
            })
          }
        }).exec()
       }
  },
  choose_type(e){ //选择类型
    let invoice_info = this.data.invoice_info;
    var basic_info=this.data.basic_info;
    let item = e.currentTarget.dataset.model;
    let type=e.currentTarget.dataset.type;
    invoice_info[item] =basic_info[type][e.detail.value];
    if(invoice_info.tax_rate&&invoice_info.total_amount){
      invoice_info['total_tax']=(Number(invoice_info.total_amount)*Number(invoice_info.tax_rate)/100).toFixed(2);
      invoice_info['amount_in_figuers']=(Number(invoice_info.total_amount)+Number(invoice_info.total_tax)).toFixed(2)
    }
    if(item=='reimbursement_company'){  //报销部门
      var gslist=this.data.infolist.purchaser_name_list;
      for(var i=0;i<gslist.length;i++){
        if(gslist[i].name==invoice_info.reimbursement_company){      
          http.invoice_department_list({
            data:{
              purchaser_id:gslist[i].id
            },
            success:res=>{
              wx.hideLoading()
              if(res.code==200){
                this.setData({
                  'basic_info.department_list':(res.data.department_list||[]).map(a=>{
                    return a.name;
                  })
                })
              }
            }
          })
        }
      }
    }
    this.setData({
      invoice_info:invoice_info
    })
    if(this.data.check){
      let that=this;
      wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
        if(!rect.length){
          that.setData({
            is_verification:2
          })
        }else{
          that.setData({
            is_verification:3
          })
        }
      }).exec()
     }
  },
  back(){ //返回
    wx.navigateBack()
  },
  changeedit(){ //修改保存按钮
    var edit=this.data.edit;
    this.setData({
      edit:!edit
    })
    console.log(edit)
    if(edit){
      console.log(this.check_yz()+'ii')
      if(this.check_yz()){
        this.submit()
      }else{
        wx.showToast({
          title: this.data.title,
          icon:'none'
        })
      }
    }
  },

  del(){ //删除发票档案
    util.showmodel('提示','确认是否删除?').then(res=>{
      if(res){
          http.invoice_del({
            data:{
              uid:wx.getStorageSync('uid'),
              year:this.data.year,
              invoice_id:this.data.id
            },
            success:res=>{
              if(res.code==200){
                const pages = getCurrentPages()
                const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
                var list= prevPage.data.list;
                for(var i=0;i<list.length;i++){
                  if(list[i].id==this.data.id){
                    list.splice(i,1)
                  }
                }
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
      }
    })
  },
  clickImg_yj(){ //查看原件
    var script_path=this.data.script_path;
    let that=this;
   if(script_path.substring(script_path.length - 3)=='pdf'||script_path.substring(script_path.length - 3)=='odf'){
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
   }else{
    wx.previewImage({
      current:[app.globalData.loadimg+script_path],
      urls: [app.globalData.loadimg+script_path]
    }) 
   } 
  },
  clickImg(){  //预览文件
    if(this.data.src.length){
      wx.previewImage({
        current:this.data.src,
        urls: this.data.src
      })  
    }else{
      wx.openDocument({
        filePath: this.data.file,
        success: function (res) {          
        }
      })
    }    
  },
  camera(){ //拍照
    let _this=this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success (res) {
        if (res.tapIndex == 0) {
          util.chooseWxImage('camera')
            util.checkRes=res=>{
              console.log(res)
              _this.setData({
                src:res,
                file:'',
                flag:true
              })
            }
          } else if (res.tapIndex == 1) {
            util.chooseWxImage('album');
            util.checkRes=res=>{
              _this.setData({
                src:res,
                file:'',
                flag:true
              })
              console.log(res)
            }
          }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  uploadpdf(){  //上传原件pdf
    let that=this;
    wx.chooseMessageFile({
      count: 1,  //能选择文件的数量
      type: 'file', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      extension: ['pdf','ofd'],
      success(res) { 
        console.log(res)
        var files = res.tempFiles[0].path;
        that.setData({
          file:files,
          src:[],
          flag:true
        })      
      }
     })
  },
  uploadOneByOne(invoice_str){ //上传文件
    if(this.data.flag){
      var that = this;
      wx.uploadFile({
        url: app.globalData.urlupload+'/Invoice/invoice_script_upload?invoice_str='+invoice_str+'&uid='+wx.getStorageSync('uid'), //仅为示例，非真实的接口地址
        filePath:this.data.file==''?this.data.src[0]:this.data.file,
        name: 'script',//示例，使用顺序给文件命名
        success:function(e){
          var res=JSON.parse(e.data);  
          if(res.code==200){
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
        },
        fail:function(e){     
        },
        complete:function(e){
       
        }
      })
    }
    
  },
  cansle(){ //移除
    this.setData({
       file:'',
       src:[],
       flag:false
    })
  },
  getdata(){ //获取数据
    http.archives_edit({
      data:{
        invoice_id:this.data.id,
        year:this.data.year,
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code==200){
          res.data.invoice_info.tax_rate=res.data.invoice_info.tax_rate.substring(0,res.data.invoice_info.tax_rate.length - 1);
          this.setData({
             invoice_info:res.data.invoice_info,
             infolist:res.data.basic_info,
            'basic_info.seller_name_list':(res.data.basic_info.seller_name_list||[]).map(a=>{
              return a.name;
            }),
            'basic_info.expense_type_list':(res.data.basic_info.expense_type_list||[]).map(a=>{
              return a.name;
            }),
            'basic_info.reimbursement_personnel_list':(res.data.basic_info.reimbursement_personnel_list||[]).map(a=>{
              return a.name;
            }),
            'basic_info.purchaser_name_list':(res.data.basic_info.purchaser_name_list||[]).map(a=>{
              return a.name;
            }),
            'basic_info.tax_rate_list':res.data.basic_info.tax_rate_list,
            script_path:res.data.invoice_info.script_path
          })
          console.log(this.data.is_verification)
          if(this.data.is_verification!=1){
            this.checktrue()
          }
        }     
      }
    })
  },
  checktrue(e){ //验真
    console.log(e)
    let invoice_info=this.data.invoice_info;  
    var date=util.getdate(invoice_info.invoice_date);
    http.invoice_verify({
      data:{
        uid:wx.getStorageSync('uid'),
        invoice_code:invoice_info.invoice_code,
        invoice_num:invoice_info.invoice_num,
        invoice_time:date,
        check_code:invoice_info.check_code,
        total_amount:invoice_info.total_amount
      },
      success:res=>{
        var passdata=res.data.invoice_verify_info;
        if(res.code==200){
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
          let that=this;
          wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
            if(!rect.length){
              that.setData({
                is_verification:2
              })
            }else{
              that.setData({
                is_verification:3
              })
            }
         }).exec()
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
  submit(){ //提交
    var formData=this.data.invoice_info;
    var  data={
      total_amount:formData.total_amount,
      tax_rate:formData.tax_rate+'%',
      total_tax:formData.total_tax,
      amount_in_figuers:formData.amount_in_figuers,
      seller_name:formData.seller_name,
      seller_register_num:formData.seller_register_num,
      purchaser_name:formData.purchaser_name,
      purchaser_register_num:formData.purchaser_register_num,
      reimbursement_people:formData.reimbursement_people,
      reimbursement_company:formData.reimbursement_company,
      reimbursement_department:formData.reimbursement_department,
      reimbursement_voucher:formData.reimbursement_voucher,
      project_summary:formData.project_summary,
      expense_type:formData.expense_type,
      manual_remarks:formData.manual_remarks,
      script_path:this.data.flag?'':formData.script_path,
      year:this.data.year,
      invoice_id:this.data.id,
      is_verification:this.data.is_verification
    };
    http.archives_rundit({
      data:data,
      success:res=>{
        if(res.code==200){
          if(res.data.invoice_str&&this.data.flag){
            this.uploadOneByOne(res.data.invoice_str)
          }else{
            wx.navigateBack()
            wx.showToast({
              title: res.msg,
            })
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
  check_yz(){
    let invoice_info=this.data.invoice_info;
    if(!invoice_info.total_amount){
      this.data.title='请输入发票金额'      
      return false;
    }else{
      return true;
    }
  },

})