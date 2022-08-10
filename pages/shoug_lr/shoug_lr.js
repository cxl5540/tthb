import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    src:[],
    st_date:'',
    file:'',
    is_verification:1,  
    formData:{
      sl:0,dm:'',hm:'',jym:'',je:'',se:'', hj:'',xfmc:'',xfsbh:'',gfmc:'',gfsbh:'',bxry:'',bxgs:'',bxbm:'',
      bxpz:'',zy:'',fylx:'',bz:''
    },
    passdata:{},
    check:false,
    flag:false,
    info:'',
    infolist:'',
    bxbmlist:'',
    img:'yz_wjy@2x.png',
    year:'',
    id:'',
    date:'',
    result:'',
    lxcheck:false,
    pdf_url:'',
    kabao:''
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.pic){
      this.invoice_identification(options.pic);
      this.setData({
        'src[0]':options.src,
        flag:true
      })
    }else if(options.ewm){
      this.invoice_manual_add();
      var result=options.ewm;
      this.sysfz(result)
    }else if(options.kabao){
      this.invoice_manual_add();
      var data=JSON.parse(decodeURIComponent(options.kabao));
      console.log(data)
      this.setData({   
        kabao:data,    
        'formData.dm':data.user_info.billing_no,
        'formData.hm':data.user_info.billing_code,
        'formData.je':this.formatDecimal(data.user_info.fee/100,2),
        'formData.xfmc':data.payee,
        'formData.gfmc':data.user_info.title,
        'formData.jym':data.user_info.check_code,
        st_date:util.changedate(parseInt(data.user_info.billing_time),1),
        date:util.changedate(parseInt(data.user_info.billing_time),2),
        'formData.lx':data.type,
        pdf_url:data.user_info.pdf_url
      })    
    }else{
      this.invoice_manual_add()
    }
  },
  clickImg_yj(){  //查看原件
    let that=this;
      wx.downloadFile({
        url:that.data.pdf_url,
        success: function (res) {
          const filePath = res.tempFilePath;
          console.log(filePath)
          wx.openDocument({
            filePath: filePath,
            fileType:'pdf',
            success: function (res) {
            }
          })
        }
      })
  },
  invoice_check_duplicate(qr_code_str){ //发票查重
    http.invoice_check_duplicate({
      data:{
        qr_code_str:qr_code_str,
        uid:wx.getStorageSync('uid')     
       },
       success:res=>{
         if(res.data.check_status==true){
           wx.navigateTo({
             url: '/pages/repeat_lr/repeat_lr?qr_code_str='+qr_code_str,
           })
         }else{
           this.sysfz(this.data.result);
         }
       }
    })    
  },
  sysfz(result){ //扫一扫赋值
    var attr=result.split(',');
    this.setData({
      attr:attr,
      result:result,
      'formData.dm':attr[2],
      'formData.hm':attr[3],
      'formData.je':this.formatDecimal(attr[4],2),
      'formData.jym':attr[6],
      'formData.hj':this.formatDecimal((Number(attr[4])+Number(attr[4]*this.data.formData.sl)),2),
      date:attr[5],
      st_date:attr[5].substring(0,4)+'年'+attr[5].substring(4,6)+'月'+attr[5].substring(6,8)+'日',
    });
  },
  lxcheck_fu(e){ //连续扫码
    this.setData({
      lxcheck:e.detail.value
    })
  },
  checktrue(){ //验真 
    if(!this.data.check){
      if(this.check_yz()){      
      let formData=this.data.formData;
      http.invoice_verify({
        data:{
          uid:wx.getStorageSync('uid'),
          operate_type:2,
          invoice_type:formData.lx,
          invoice_code:formData.dm,
          invoice_num:formData.hm,
          invoice_time:this.data.date,
          check_code:formData.jym,
          total_amount:formData.je,
        },
        success:res=>{
          if(res.code==200){
            let invoice_verify_info=res.data.invoice_verify_info;
            var formData=this.data.formData;
            this.setData({
              'passdata.lx':invoice_verify_info.InvoiceType,
              'passdata.je':invoice_verify_info.TotalAmount,
              'passdata.se':invoice_verify_info.TotalTax,
              'passdata.sl':invoice_verify_info.TaxRate,
              'passdata.hj':invoice_verify_info.AmountInFiguers,
              'passdata.dm':invoice_verify_info.InvoiceCode,
              'passdata.hm':invoice_verify_info.InvoiceNum,
              'passdata.st_date':invoice_verify_info.InvoiceDate,
              'passdata.jym':invoice_verify_info.CheckCode,
              'passdata.xfmc':invoice_verify_info.SellerName,
              'passdata.xfsbh':invoice_verify_info.SellerRegisterNum,
              'passdata.gfmc':invoice_verify_info.PurchaserName,
              'passdata.gfsbh':invoice_verify_info.PurchaserRegisterNum,
              'formData.se':this.formatDecimal(invoice_verify_info.TotalTax,2),
              'formData.sl':invoice_verify_info.TaxRate,
              'formData.hj':this.formatDecimal(invoice_verify_info.AmountInFiguers,2),
            })
            if(!formData.xfmc){
              this.setData({
                'formData.xfmc':invoice_verify_info.SellerName
              })
            }
            if(!formData.xfsbh){
              this.setData({
                'formData.xfsbh':invoice_verify_info.SellerRegisterNum
              })
            }
            if(!formData.gfmc){
              this.setData({
                'formData.gfmc':invoice_verify_info.PurchaserName
              })
            }
            if(!formData.gfsbh){
              this.setData({
                'formData.gfsbh':invoice_verify_info.PurchaserRegisterNum
              })
            }
            let that=this;
            that.setData({
              check:true,
              year:res.data.year,
              id:res.data.id
             })
            wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
              if(!rect.length){
                that.setData({
                  img:'yz_zc@2x.png',
                  is_verification:2
                })
              }else{
                that.setData({
                  img:'yz_yc@2x.png',
                  is_verification:3
                })
              }
           }).exec()
           wx.showToast({
            title:'已验真',
          })
           setTimeout(function(){
              wx.navigateTo({
                url: '/pages/fapiao_dsh_pass/fapiao_dsh_pass?data='+JSON.stringify(res.data),
              })
           },2000)
           
          }else{
            wx.showToast({
              title: res.msg,
            })
          }
          
        }
      })
     
    }else{
      wx.showToast({
        title: this.data.title,
        icon:'none'
      })
    }
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
                flag:true
              })
            }
          } else if (res.tapIndex == 1) {
            util.chooseWxImage('album');
            util.checkRes=res=>{
              _this.setData({
                src:res,
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
          if(that.data.result&&that.data.lxcheck){
            that.getScancode()
          }else{
            wx.showToast({
              title: res.msg,
              success:function(){
                setTimeout(
                  function(params) {
                    wx.navigateBack()
                },1000)              
              }
            })
          }             
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
       pdf_url:'',
       src:[],
       flag:false
    })
  },
  stdate: function(e) {  //开始时间
    var date= e.detail.value;
    this.setData({
      st_date:date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日',
      date:date.split('-').join('')
    })
  },
 
    formatDecimal(num, decimal) { //保留两位小数
      // num = num.toString()
      // let index = num.indexOf('.')
      // if (index !== -1) {
      //     num = num.substring(0, decimal + index + 1)
      // } else {
      //     num = num.substring(0)
      // }
       //console.log(parseFloat(num).toFixed(decimal))
      return parseFloat(num).toFixed(decimal)
  },
  inputWacth(e){
    let formData = this.data.formData;
    let item = e.currentTarget.dataset.model;
    console.log(item)
    formData[item] = e.detail.value;
    if(formData.je&&item=='je'){
      if(formData.sl){
        formData['se']=this.formatDecimal((Number(formData.je)*Number(formData.sl)/100),2)
      }else{
        formData['se']=this.formatDecimal((Number(formData.je)*0),2)
      } 
      formData['hj']=this.formatDecimal((Number(formData.je)+Number(formData.se)),2)
    }
    this.setData({
    formData
    }); 
     if(this.data.check){
      let that=this;
      wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
        if(!rect.length){
          that.setData({
            img:'yz_zc@2x.png',
            is_verification:2,
          })

        }else{
          that.setData({
            img:'yz_yc@2x.png',
            is_verification:3,
          })
        }
      }).exec()
     }
    
  },
  choose_type(e){ //选择类型
    let formData = this.data.formData;
    var info=this.data.info;
    let item = e.currentTarget.dataset.model;
    let type=e.currentTarget.dataset.type;
    formData[item] =info[type][e.detail.value];
    if(formData.sl&&formData.je){
      formData['se']=this.formatDecimal((Number(formData.je)*Number(formData.sl)/100),2);
      formData['hj']=this.formatDecimal((Number(formData.je)+Number(formData.se)),2)
    }
    
    if(item=='bxgs'){  //报销部门
      var gslist=this.data.infolist.purchaser_name_list;
      for(var i=0;i<gslist.length;i++){
        if(gslist[i].name==formData.bxgs){      
          http.invoice_department_list({
            data:{
              purchaser_id:gslist[i].id
            },
            success:res=>{
              wx.hideLoading()
              if(res.code==200){
                this.setData({
                  'info.bxbmlist':(res.data.department_list||[]).map(a=>{
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
    formData:formData
    });
    if(this.data.check){
      let that=this;
      wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
        console.log(rect)
        if(!rect.length){
          that.setData({
            img:'yz_zc@2x.png',
            is_verification:2
          })
        }else{
          that.setData({
            img:'yz_yc@2x.png',
            is_verification:3
          })
        }
      }).exec()
     }
  },
  clickImg(){  //预览文件
    console.log(this.data.src)
    if(this.data.src.length){
      wx.previewImage({
        current:this.data.src,
        urls: this.data.src
      })  
    }else{
      console.log(this.data.file)
      wx.openDocument({
        filePath: this.data.file,
        success: function (res) {          
        }
      })
    }
    
    },

  invoice_identification(file_path){ //发票识别
    http.invoice_identification({
      data:{
        uid:wx.getStorageSync('uid'),
        file_path:file_path
      },
      success:res=>{
        console.log(res);
        var invoice_verify_info=res.data.invoice_arr;
        invoice_verify_info.tax_rate=invoice_verify_info.tax_rate.substring(0,invoice_verify_info.tax_rate.length - 1);
        if(res.code==200){
			 this.check_duplicate(invoice_verify_info.invoice_code,invoice_verify_info.invoice_num).then(resolve=>{
				 if(resolve){
					this.setData({
					  infolist:res.data.basic_info,
					  'info.seller_name_list':(res.data.basic_info.seller_name_list||[]).map(a=>{
					    return a.name;
					  }),
					  'info.expense_type_list':(res.data.basic_info.expense_type_list||[]).map(a=>{
					    return a.name;
					  }),
					  'info.reimbursement_personnel_list':(res.data.basic_info.reimbursement_personnel_list||[]).map(a=>{
					    return a.name;
					  }),
					  'info.purchaser_name_list':(res.data.basic_info.purchaser_name_list||[]).map(a=>{
					    return a.name;
					  }),
					  'info.invoice_type_list':res.data.basic_info.invoice_type_list,
					  'info.tax_rate_list':res.data.basic_info.tax_rate_list,
					    'formData.lx':invoice_verify_info.invoice_type,
					    'formData.je':invoice_verify_info.total_amount,
					    'formData.se':invoice_verify_info.total_tax,
					    'formData.sl':invoice_verify_info.tax_rate,
					    'formData.hj':invoice_verify_info.amount_in_figuers,
					    'formData.dm':invoice_verify_info.invoice_code,
					    'formData.hm':invoice_verify_info.invoice_num,
					    'st_date':invoice_verify_info.invoice_date,
					    'formData.jym':invoice_verify_info.check_code,
					    'formData.xfmc':invoice_verify_info.seller_name,
					    'formData.xfsbh':invoice_verify_info.seller_register_num,
					    'formData.gfmc':invoice_verify_info.purchaser_name,
					    'formData.gfsbh':invoice_verify_info.purchaser_register_num,
              date:util.getdate(invoice_verify_info.invoice_date),
					}) 
				 }
			 })
			
          
        }else{
          wx.showToast({
            title:res.msg,
          })
		  setTimeout(res=>{
			 wx.navigateBack()
		  },1000)       
        }
      }
    })
},
check_duplicate(invoice_code,invoice_num){ //ocr发票识别查重
  return new Promise(function(resolve,reject){
  http.invoice_check_duplicate({
    data:{
      type:3,
      invoice_code:invoice_code,
      invoice_num:invoice_num,
      uid:wx.getStorageSync('uid')     
     },
     success:res1=>{
       if(res1.data.check_status==true){
         wx.navigateTo({
           url: '/pages/repeat_lr/repeat_lr?type=3'+'&invoice_code='+invoice_code+'&invoice_num='+invoice_num,
         })
         resolve(false);
       }else{
        resolve(true);
       }
     }
  })
  })
},
  invoice_manual_add(){  //获取基础数据
    var formData=this.data.formData;
    http.invoice_manual_add({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            infolist:res.data,
            'info.invoice_type_list':res.data.invoice_type_list,
            'info.seller_name_list':(res.data.seller_name_list||[]).map(a=>{
              return a.name;
            }),
            'info.expense_type_list':(res.data.expense_type_list||[]).map(a=>{
              return a.name;
            }),
            'info.reimbursement_personnel_list':(res.data.reimbursement_personnel_list||[]).map(a=>{
              return a.name;
            }),
            'info.purchaser_name_list':(res.data.purchaser_name_list||[]).map(a=>{
              return a.name;
            }),         
            'info.tax_rate_list':res.data.tax_rate_list,
            'formData.hj':this.formatDecimal((Number(formData.je)+Number(formData.se)),2)          
          })
          
          if(!this.data.kabao){
            this.setData({
              'formData.lx':res.data.invoice_type_list[0]
            })
          }
          if(this.data.result){
            var attr=this.data.attr;
            if(attr[0]+attr[1]=='0104'){
              this.setData({
                'formData.lx':this.data.info.invoice_type_list[0]
              })
            }else if(attr[0]+attr[1]=='0101'){
              this.setData({
                'formData.lx':this.data.info.invoice_type_list[1]
              }) 
            }else if(attr[0]+attr[1]=='0110'){
              this.setData({
                'formData.lx':this.data.info.invoice_type_list[2]
              }) 
            }
          }
        }
      }
    })
  },
  getScancode: function () { //扫码
    var _this = this; 
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        _this.invoice_check_duplicate(result)
        console.log(res)
        _this.setData({
          result: result,
        })
        // _this.sysfz(result);
      }
    })
 
  },

  submit_repeat(){
    if(this.check()){
      this.submit()
    }else{
      wx.showToast({
        title: this.data.title,
        icon:'none'
      })
    }
  },
  check_yz(){
    let formData=this.data.formData;
    if(!formData.dm){
      this.data.title='请输入发票代码'      
      return false;
    }else if(!formData.hm){
      this.data.title='请输入发票号码';
      return false;
    }else if(!this.data.st_date){
      this.data.title='请选择发票日期';
      return false;
    }else if(!formData.jym){
      this.data.title='请输入效验码后六位';
      return false;
    }else if(!formData.je){
      this.data.title='请输入发票金额';
      return false;
    }else{
      return true;
    }
  },
  check(){
    let formData=this.data.formData;
    if(!formData.dm){
      this.data.title='请输入发票代码'      
      return false;
    }else if(!formData.hm){
      this.data.title='请输入发票号码';
      return false;
    }else if(!this.data.st_date){
      this.data.title='请选择发票日期';
      return false;
    }else if(!formData.jym){
      this.data.title='请输入效验码后六位';
      return false;
    }else if(!formData.je){
      this.data.title='请输入发票金额';
      return false;
    }else{
      return true;
    }
  },
  submit(){  //提交
    let formData=this.data.formData;
    http.invoice_manual_runadd({
      data:{
        uid:wx.getStorageSync('uid'),
        invoice_type:formData.lx,
        invoice_code:formData.dm,
        invoice_num:formData.hm,
        invoice_date:this.data.st_date,
        invoice_time:this.data.date,
        check_code:formData.jym,
        total_amount:formData.je,
        tax_rate:formData.sl+'%',
        total_tax:formData.se,
        amount_in_figuers:formData.hj,
        seller_name:formData.xfmc,
        seller_register_num:formData.xfsbh,
        purchaser_name:formData.gfmc,
        purchaser_register_num:formData.gfsbh,
        reimbursement_people:formData.bxry,
        reimbursement_company:formData.bxgs,
        reimbursement_department:formData.bxbm,
        reimbursement_voucher:formData.bxpz,
        project_summary:formData.zy,
        expense_type:formData.fylx,
        manual_remarks:formData.bz,
        year:this.data.year,
        id:this.data.id,
        pdf_url:this.data.pdf_url,
        is_verification:this.data.is_verification
      },
      success:res=>{
        if(res.code==200){
          if(res.data.invoice_str&&this.data.flag){
            this.uploadOneByOne(res.data.invoice_str)
          }else{
            if(this.data.result&&this.data.lxcheck){
              wx.showToast({
                title:res.msg,
              })
              setTimeout(res=>{
                this.getScancode()
              },1000)            
            }else{
              wx.showToast({
                title: res.msg,
              }) 
              setTimeout(res=>{
                wx.navigateBack()
              },1000) 
         } 
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
})