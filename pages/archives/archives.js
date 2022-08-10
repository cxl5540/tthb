import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    typeList: ['全部', '未验真','正常', '异常'],
    is_verification:0,
    page:1,
    pages:0,
    user_info:'',
    key:'',
    input_time:'',
    type:'全部',
    st_date:'',
    en_date:'',
    list:[],
    triggered:false,
    is_data:true,
    tabHeiaght:400
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-187,
      input_time:util.formatTime(new Date()).substring(0,7)+' - '+util.formatTime(new Date()).substring(0,7),
      st_date:util.formatTime(new Date()).substring(0,7),
      en_date:util.formatTime(new Date()).substring(0,7)
    })
    this.getlist()
  },
  onShow(){
    this.setData({
      page:1,
      is_data:true,
      list:[]
    })
    this.getlist()
  },
  getlist(){
    http.archives_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
        team_id:wx.getStorageSync('team_id'),
        is_verification:this.data.is_verification,
        key:this.data.key,
        input_time:this.data.input_time
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list;         
          if(this.data.is_data){       
            this.setData({
              list:list.concat(res.data.invoice_list),
              user_info:res.data.user_info
            })
          }
          if(this.data.page>res.data.pages  || res.data.pages<=1&&res.data.invoice_list.length<=10){
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
  download(){
    if(this.data.user_info.is_export==2){
      wx.navigateTo({
        url: '/pages/act_down/act_down',
      })
    }else{
      wx.showToast({
        title: '您无下载权限',
        icon:'none'
      })
    }
  },
  dbj_list(){ //待补交原价
    wx.navigateTo({
      url: '/pages/fapiao_dbj/fapiao_dbj',
    })
  },
  detail(e){ //详情编辑
    var id=e.currentTarget.dataset.id;
    var is_verification=e.currentTarget.dataset.is_verification;
    console.log(is_verification)
    wx.navigateTo({
      url: '/pages/fapiao_dbj_del/fapiao_dbj_del?id='+id+'&year='+this.data.st_date.substring(0,4)+'&is_verification='+is_verification,
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
  keyval(e){ //关键词删选
    this.setData({
      key:e.detail.value,
    })
  },
  search(){ //搜索
    this.setData({
      page:1,
      is_data:true,
      list:[]
    })
    console.log(this.data.list)
    this.getlist();
  },
  choose_type(e){ //选择类型
    var typeList=this.data.typeList;
    this.setData({
      type:typeList[e.detail.value],
      is_verification:e.detail.value,
      page:1,
      is_data:true,
      list:[]
    })
   this.getlist()
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
})