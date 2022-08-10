import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    src:[],
    st_date:'',
    file:'',  
    formData:{
      sl:0,dm:'',hm:'',jym:'',je:'',se:'', hj:'',xfmc:'',xfsbh:'',gfmc:'',gfsbh:'',bxry:'',bxgs:'',bxbm:'',
      bxpz:'',zy:'',fylx:'',bz:''
    },
    passdata:{},
    check:false,
    img:'yz_wjy@2x.png',
    info:'',
    infolist:'',
    bxbmlist:'',
    year:'',
    id:'',
    item:'',
    index:'',
    flag:false,
    script_path:''
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item=JSON.parse(options.item)
    console.log(item)
    this.setData({
      year:item.temporary_year,
      id:item.id,
      item:item,
      index:options.index
    })
    this.invoice_import_edit()
  },
  checktrue(){ //验真 
    if(!this.data.check){
      if(this.check_yz()){      
      let formData=this.data.formData;
      http.invoice_verify({
        data:{
          uid:wx.getStorageSync('uid'),
          operate_type:1,
          invoice_type:formData.lx,
          invoice_code:formData.dm,
          invoice_num:formData.hm,
          invoice_time:this.data.date,
          check_code:formData.jym,
          total_amount:formData.je,
          year:this.data.year,
          id:this.data.id
        },
        success:res=>{
          if(res.code==200){
            let invoice_verify_info=res.data.invoice_verify_info;
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
              year:res.data.year,
              id:res.data.id
            })
            let that=this;
            this.setData({
              check:true
             })
            wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
              if(!rect.length){
                that.setData({
                  img:'yz_zc@2x.png'
                })
              }else{
                that.setData({
                  img:'yz_yc@2x.png'
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
              icon:'none'
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
       script_path:'',
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
  inputWacth(e){
    let formData = this.data.formData;
    let item = e.currentTarget.dataset.model;
    formData[item] = e.detail.value;
    if(formData.je){
      if(formData.sl){
        formData['se']=(Number(formData.je)*Number(formData.sl)/100).toFixed(2)
      }else{
        formData['se']=(Number(formData.je)*0).toFixed(2)
      } 
      formData['hj']=(Number(formData.je)+Number(formData.se)).toFixed(2)
    }
    this.setData({
    formData
    });
    if(this.data.check){
      let that=this;
      wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
        if(!rect.length){
          that.setData({
            img:'yz_zc@2x.png'
          })
        }else{
          that.setData({
            img:'yz_yc@2x.png'
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
      formData['se']=(Number(formData.je)*Number(formData.sl)/100).toFixed(2);
      formData['hj']=(Number(formData.je)+Number(formData.se)).toFixed(2)
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
        if(!rect.length){
          that.setData({
            img:'yz_zc@2x.png'
          })
        }else{
          that.setData({
            img:'yz_yc@2x.png'
          })
        }
      }).exec()
     }
  },
  clickImg(){  //预览文件
    if(!this.data.flag&&this.data.script_path){
      let that=this;
      wx.downloadFile({
        url:app.globalData.loadimg+that.data.script_path,
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
    }
       
  },
  invoice_import_edit(){
    http.invoice_import_edit({
      data:{
        uid:wx.getStorageSync('uid'),
        year:this.data.year,
        id:this.data.id
      },
      success:res=>{
        if(res.code==200){        
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
            'formData.lx':res.data.invoice_info.invoice_type,
            'formData.dm':res.data.invoice_info.invoice_code,
            'formData.hm':res.data.invoice_info.invoice_num,
            st_date:res.data.invoice_info.invoice_date,
            'formData.jym':res.data.invoice_info.check_code,
            'formData.gfmc':res.data.invoice_info.purchaser_name,
            'formData.gfsbh':res.data.invoice_info.purchaser_register_num,
            'formData.xfmc':res.data.invoice_info.seller_name,
            'formData.xfsbh':res.data.invoice_info.seller_register_num,
            'formData.sl':res.data.invoice_info.tax_rate.slice(0,res.data.invoice_info.tax_rate.length-1),
            'formData.je':res.data.invoice_info.total_amount,
            'formData.se':res.data.invoice_info.total_tax,
            'formData.hj':res.data.invoice_info.amount_in_figuers,
            date:res.data.invoice_info.invoice_date.split('年')[0]+res.data.invoice_info.invoice_date.split('年')[1].split('月')[0]+res.data.invoice_info.invoice_date.split('年')[1].split('月')[1].split('日')[0]
          })
          if(res.data.invoice_info.script_path){
            var script_path=res.data.invoice_info.script_path;
            if(script_path.substring(script_path.length - 3)=='pdf'||script_path.substring(script_path.length - 3)=='odf'){
              this.setData({
                file:app.globalData.loadimg+res.data.invoice_info.script_path,
                script_path:res.data.invoice_info.script_path
              })
              console.log(app.globalData.loadimg+res.data.invoice_info.script_path)
            }else{
              this.setData({
                src:[app.globalData.loadimg+res.data.invoice_info.script_path],
                script_path:res.data.invoice_info.script_path
              })         
            }
          }
          
        }
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
    }else if(!formData.hj){
      this.data.title='税价合计不能为空';
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
    }else if(!formData.je){
      this.data.title='请输入发票金额';
      return false;
    }else if(!formData.hj){
      this.data.title='税价合计不能为空';
      return false;
    }else if(!formData.bxry){
      this.data.title='请输入报销人员';
      return false;
    }else{
      return true;
    }
  },
  submit(){  //提交
    let formData=this.data.formData;
    console.log(formData)
    let that=this;
    http.invoice_import_runedit({
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
        script_path:this.data.script_path,
        year:this.data.year,
        id:this.data.id
      },
      success:res=>{
        if(res.code==200){
          if(res.data.invoice_str&&this.data.flag){
            this.uploadOneByOne(res.data.invoice_str)
          }else{
            const pages = getCurrentPages()
            const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
            var list= prevPage.data.list;
            list.splice(that.data.index,1)
            prevPage.setData({
              list:list,
            }) 
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
})