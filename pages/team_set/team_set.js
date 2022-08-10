import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()

// pages/team_set/team_set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [],
    activeTab: 0,
    activeNames: ['0'],
    finance_list:'',
    finance_number:'',
    staff_number:'',
    finance_count:'',
    staff_count:'',
    staff_list:'',
    finance_m:'',
    admin_id:'',
    uid:'',
    finance_invitation_code:'',
    staff_invitation_code:'',
    key:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const titles = ['会计人员列表', '报销人员列表']
    const tabs = titles.map(item => ({title: item}))
    this.setData({tabs});
    this.team_member_list();
    this.setData({
      uid:wx.getStorageSync('uid')
    })
  },
  onTabCLick(e) {//操作方式
    const index = e.detail.index
    this.setData({activeTab: index})
  },

  onChange(e) {  //操作方式
    const index = e.detail.index
    this.setData({activeTab: index})
  },
  set_tt(){  //抬头设置
    wx.navigateTo({
      url: '/pages/team_set_tt/team_set_tt',
    })
  },
  set_qx(e){//权限设置
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/team_set_qx/team_set_qx?member_id='+id,
    })
  },
  set_ck(){ //查看公司
    wx.navigateTo({
      url: '/pages/team_set_ck/team_set_ck',
    })
  },
  set_sz(){ //团队设置
    wx.navigateTo({
      url: '/pages/team_tt_sz/team_tt_sz',
    })
  },
  kj_yaoqm(){ //邀请会计
    wx.navigateTo({
      url: '/pages/kj_yaoqm/kj_yaoqm?cw='+this.data.finance_invitation_code,
    })
  },
  yg_yaoqm(){ //邀请员工绑定
    wx.navigateTo({
      url: '/pages/yg_yaoqm/yg_yqm?yg='+this.data.staff_invitation_code,
    })
  },
  shift(e){ //转移管理员
    var id=e.currentTarget.dataset.id;
    util.showmodel('提示','确认将改成员转为管理员?').then(res=>{
      if(res){
        http.team_admin_shift({
          data:{
            team_id:wx.getStorageSync('team_id'),
            uid:wx.getStorageSync('uid'),
            member_id:id,
          },
          success:res=>{
            if(res.code==200){
              wx.showToast({
                title: res.msg,
              })
              setTimeout(res=>{
                this.team_member_list()
              },1000)
             
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
  del(e){ //删除会计团队成员
    var id=e.currentTarget.dataset.id;
    var index=e.currentTarget.dataset.index;
    var status=e.currentTarget.dataset.status;
    var finance_list=this.data.finance_list;
    var staff_list=this.data.staff_list;
    util.showmodel('提示','确认删除该成员?').then(res=>{
      if(res){
        http.team_member_del({
          data:{
            uid:wx.getStorageSync('uid'),
            member_id:id,
            status:status
          },
          success:res=>{
            if(res.code==200){
              wx.showToast({
                title: res.msg,
              })
              if(status==1){
                finance_list.splice(index,1);
                this.setData({
                  finance_list:finance_list,
                  finance_count:this.data.finance_count-1
                })
              }else{
                staff_list.splice(index,1);
                this.setData({
                  staff_list:staff_list,
                  staff_count:this.data.staff_count-1
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
      }
    })
  },
  getkey(e){  //搜索
    var staff_list=this.data.staff_list;
    this.setData({
      key:e.detail.value,
    })
  },
  search(){

  },
  team_member_list(){ //列表
    http.team_member_list({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            finance_m:res.data.finance_list[0],
            finance_list:res.data.finance_list,
            staff_list:res.data.staff_list,
            finance_number:res.data.team_info.finance_number,
            staff_number:res.data.team_info.staff_number,
            finance_count:res.data.team_info.finance_count,
            staff_count:res.data.team_info.staff_count,
            admin_id:res.data.team_info.admin_id,
            finance_invitation_code:res.data.team_info.finance_invitation_code,
            staff_invitation_code:res.data.team_info.staff_invitation_code,
           })
        }
         
      }
    })
  },
})