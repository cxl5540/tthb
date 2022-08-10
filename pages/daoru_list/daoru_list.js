import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    list:'',
    triggered:false,
    successUp:'',
    failUp:'',
    str:'',
    total:'',
    date:'',
    checkedall:false
  },
  onLoad: function (options) {
    if(options){
      this.setData({
        successUp:options.successUp,
        failUp:options.failUp,
        str:options.str,
        total:Number(options.successUp)+Number(options.failUp),
        date:util.formatTime(new Date()).substring(0,11)
      })
    }
    this.getlist();
  },
  givup(){ //
    util.showmodel('提示','放弃录入下次需重新导入，是否确定?').then(function (data) {
      if(data){
        wx.navigateBack()
      }
    })
  },
  radioval(e){ //单选
    let index = e.currentTarget.dataset.index;
    var list = this.data.list;
    list[index].checked=!list[index].checked;
    this.setData({
     list:list
    })
    let that = this;
    that.setData({
      checkedall: list.every(function(item) {
        return item.checked == true;
      }),
    })
  },

  allchcked(){ //全选
    let list=this.data.list;
    let checkedall=this.data.checkedall;
    if(!checkedall){
      for(var i=0;i<list.length;i++){
        list[i].checked=true;
      }
    }else{
      for(var i=0;i<list.length;i++){
        list[i].checked=false;
      }
    } 
      this.setData({
        list:list,
        checkedall:!checkedall
      })
  },
  submit(){ //批量录入
    let that=this;
    var str='';
    var Attr=[];
    let list=this.data.list;
        for(var i=0;i<list.length;i++){
          if(list[i].checked){
            str+=list[i].temporary_year+','+list[i].id+';'
            Attr.push(list[i].invoice_code+list[i].temporary_year);                                         
          }      
        }
    if(str){
      http.invoice_import_add({
        data:{
          uid:wx.getStorageSync('uid'),
          invoice_str:str.slice(0,str.length-1)
        },
        success:res=>{
          if(res.code==200){
            util.showmodel('提示','系统已完成查重,录入成功'+res.data.success+'条失败'+res.data.fail+'是否继续录入？').then(function(data) {
              if(!data){
                wx.navigateBack()
              }else{
                for(var j=0;j<list.length;j++){
                  for(var n=0;n<Attr.length;n++){
                    if(list[j].invoice_code+list[j].temporary_year==Attr[n]){             
                     list.splice(j,1);
                    }
                  }                 
               }
               that.setData({
                 list:list
               })
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
    }else{
      wx.showToast({
        title: '请选择需录入的发票',
        icon:'none'
      })
    }    
console.log(str);
    return false;
    
  },
  getlist(){ //获取列表
    http.invoice_import_list({
      data:{
        uid:wx.getStorageSync('uid'),
        invoice_str:this.data.str
      },
      success:res=>{
        if(res.code==200){
          console.log(res.data)
          this.setData({
            list:res.data.invoice_import_list
          })
        }
      }
    })
  },
 
  ocr_yj_lr(e){  //详情 //发票查重
    var item=e.currentTarget.dataset.item;
    var index=e.currentTarget.dataset.index;
    console.log(item)
    http.invoice_check_duplicate({
      data:{
        type:2,
        invoice_id:item.id,
        year:item.temporary_year,
        uid:wx.getStorageSync('uid')     
       },
       success:res=>{
         if(res.data.check_status==true){
           wx.navigateTo({
             url: '/pages/repeat_lr/repeat_lr?type=2'+'&invoice_id='+item.id+'&year='+item.temporary_year,
           })
         }else{
          wx.navigateTo({
            url: '/pages/ocr_yj_edit/ocr_yj_edit?item='+JSON.stringify(item)+'&index='+index,
          })
         }
       }
    })    
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
      })
      this._freshing = false
    }, 3000)
  },
})