// api.js
// 在这里面定义所有接口，一个文件管理所有接口，易于维护
// 引入刚刚封装好的http模块，import属于ES6的语法，微信开发者工具必须打开ES6转ES5选项
import { http } from './http'; 

// 每一个接口定义一个函数，然后暴露出去，供逻辑代码调用
// 接口请求的路由地址以及请求方法在此处传递
const app = getApp()
function personal_info(params) {  //获取个人信息
  http(app.globalData.url, 'post', params,'Personal/personal_info')
}
function home_info(params) {  //首页展示
  http(app.globalData.url, 'post', params,'Home/home_info')
}
function get_red_packet(params) {  //天天红包
  http(app.globalData.url, 'post', params,'Home/get_red_packet') 
}
function get_gold(params) {  //整点金币
  http(app.globalData.url, 'post', params,'Home/get_gold') 
}
function earnings_list(params) {  //收益明细
  http(app.globalData.url, 'post', params,'Personal/earnings_list')  
}
function commodity_list(params) {  //商品列表
  http(app.globalData.url, 'post', params,'Shops/commodity_list') 
}
function commodity_detail(params) {  //商品详情
  http(app.globalData.url, 'post', params,'Shops/commodity_detail')
}
function address_runedit(params) {  //商城-编辑收货地址（修改后提交）
  http(app.globalData.url, 'post', params,'Shops/address_runedit')
}
function address_edit(params) {  //商城-编辑收货地址（获取旧数据）
  http(app.globalData.url, 'post', params,'Shops/address_edit') 
}
function unified_order(params) {  //商城-统一下单
  http(app.globalData.url, 'post', params,'Order/unified_order') 
}
function get_verify(params) {  //红包验证
  http(app.globalData.url, 'post', params,'Home/get_verify') 
}
function share_record(params) {  //分享记录
  http(app.globalData.url, 'post', params,'Personal/share_record')  
}
function withdraw_deposit(params) {  //个人中心-分享收益提现
  http(app.globalData.url, 'post', params,'Personal/withdraw_deposit')  
}
function order_info(params) {  //获取正式版基础信息
  http(app.globalData.url, 'post', params,'Order/order_info') 
}
function rise_list(params) {  //发票抬头管理别表
  http(app.globalData.url, 'post', params,'Personal/rise_list') 
}
function rise_runadd(params) {  //发票抬头新增
  http(app.globalData.url, 'post', params,'Personal/rise_runadd') 
}
function rise_edit(params) {  //编辑发票抬头
  http(app.globalData.url, 'post', params,'Personal/rise_edit') 
}
function rise_runedit(params) {  //编辑发票抬头提交
  http(app.globalData.url, 'post', params,'Personal/rise_runedit') 
}
function department_list(params) {  //管理部门列表
  http(app.globalData.url, 'post', params,'Personal/department_list') 
}
function department_runadd(params) {  //管理部门新增
  http(app.globalData.url, 'post', params,'Personal/department_runadd') 
}
function department_del(params) {  //管理部门删除
  http(app.globalData.url, 'post', params,'Personal/department_del') 
}
function team_member_list(params) {  //团队成员管理
  http(app.globalData.url, 'post', params,'Personal/team_member_list') 
}
function team_setup(params) {  //团队设置获取数据
  http(app.globalData.url, 'post', params,'Personal/team_setup') 
}
function team_runsetup(params) {  //团队设置权限
  http(app.globalData.url, 'post', params,'Personal/team_runsetup') 
}
function team_member_setup(params) {  //团队成员设置权限初始
  http(app.globalData.url, 'post', params,'Personal/team_member_setup') 
}
function team_member_runsetup(params) {  //团队成员设置权限提交
  http(app.globalData.url, 'post', params,'Personal/team_member_runsetup') 
}
function team_member_del(params) {  //团队成员删除
  http(app.globalData.url, 'post', params,'Personal/team_member_del') 
}
function team_admin_shift(params) {  //转移团队管理员
  http(app.globalData.url, 'post', params,'Personal/team_admin_shift') 
}
function archives_list(params) {  //发票档案列表
  http(app.globalData.url, 'post', params,'Archives/archives_list') 
}
function archives_edit(params) {  //发票档案编辑
  http(app.globalData.url, 'post', params,'Archives/archives_edit') 
}
function archives_rundit(params) {  //发票档案编辑保存
  http(app.globalData.url, 'post', params,'Archives/archives_runedit') 
}
function invoice_del(params) {  //删除发票档案
  http(app.globalData.url, 'post', params,'Archives/archives_del') 
}
function archives_download(params) {  //台账下载
  http(app.globalData.url, 'post', params,'Archives/archives_download') 
}
function archives_export(params) {  //台账下载
  http(app.globalData.url, 'post', params,'Archives/archives_export') 
}
function archives_export_list(params) {  //台账下载列表
  http(app.globalData.url, 'post', params,'Archives/archives_export_list') 
}
function invoice_identification(params) {  //发票识别
  http(app.globalData.url, 'post', params,'Invoice/invoice_identification') 
}
function voucher_no_list(params) {  //凭证号补录列表
  http(app.globalData.url, 'post', params,'Archives/voucher_no_list') 
}
function voucher_no_record(params) {  //凭证号补录
  http(app.globalData.url, 'post', params,'Archives/voucher_no_record') 
}
function invoice_examine_list(params) {  //待审核列表
  http(app.globalData.url, 'post', params,'Invoice/invoice_examine_list') 
}
function invoice_examine_detail(params) {  //待审核详情
  http(app.globalData.url, 'post', params,'Invoice/invoice_examine_detail') 
}
function invoice_examine_reject(params) {  //待审核驳回
  http(app.globalData.url, 'post', params,'Invoice/invoice_examine_reject') 
}
function invoice_examine_adopt(params) {  //待审核驳回
  http(app.globalData.url, 'post', params,'Invoice/invoice_examine_adopt') 
}
function vmakeup_original_list(params) {  //待不交列表
  http(app.globalData.url, 'post', params,'Archives/vmakeup_original_list') 
}
function invoice_check_duplicate(params) {  //发票查重
  http(app.globalData.url, 'post', params,'Invoice/invoice_check_duplicate') 
}
function invoice_card_bag_import(params) {  //发票导入
  http(app.globalData.url, 'POST', params,'Invoice/invoice_card_bag_import') 
}
function order_list(params) {  //购买记录
  http(app.globalData.url, 'POST', params,'Order/order_list') 
}
function order_detail(params) {  //购买详情
  http(app.globalData.url, 'POST', params,'Order/order_detail') 
}
function operation_verify (params) {  //权限
  http(app.globalData.url, 'POST', params,'Personal/operation_verify') 
}
function cost_list (params) {  //费用类型
  http(app.globalData.url, 'POST', params,'Personal/cost_list') 
}
function cost_runadd (params) {  //费用类型新增
  http(app.globalData.url, 'POST', params,'Personal/cost_runadd') 
}
function cost_del (params) {  //费用类型删除
  http(app.globalData.url, 'POST', params,'Personal/cost_del') 
}
// 暴露接口
export default { 
  personal_info,
  home_info,
  get_red_packet,
  get_gold,
  earnings_list,
  commodity_list,
  commodity_detail,
  address_runedit,
  address_edit,
  unified_order,
  get_verify,
  share_record,
  withdraw_deposit,
  order_info,
  rise_list,
  rise_runadd,
  rise_edit,
  rise_runedit,
  department_list,
  department_runadd,
  department_del,
  team_member_list,
  team_setup,
  team_runsetup,
  team_member_setup,
  team_member_runsetup,
  team_member_del,
  team_admin_shift,
  archives_list,
  archives_edit,
  archives_rundit,
  archives_download,
  invoice_del,
  archives_export,
  archives_export_list,
  invoice_identification,
  voucher_no_list,
  voucher_no_record,
  invoice_examine_list,
  invoice_examine_detail,
  invoice_examine_reject,
  invoice_examine_adopt,
  vmakeup_original_list,
  invoice_check_duplicate,
  invoice_card_bag_import,
  order_list,
  order_detail,
  operation_verify,
  cost_list,
  cost_runadd,
  cost_del
}