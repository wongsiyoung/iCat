// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'icat-7g0bjdvib8644e86',
  traceUser: true,
  throwOnNotFound: false  // 如果获取不到记录，不抛出异常，而是返回空
})

// 连接数据库
const db = cloud.database()
const UsersCollection = db.collection('Users')
const cmd = db.command
/**
 * event 参数包含小程序端调用传入的 data
 */
exports.main = async (event, context) => {
  // console.log 的内容可以在云开发云函数调用日志查看
  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID

  // 查询用户是否已存在数据库中
  const result = await UsersCollection.where({
    openID: cmd.eq(openid)
  })
  .get({
    success: console.log,
    fail: console.error
  })

  if (result.data.length != 0 ){  // 用户存已登录，返回用户信息
    return {
      openID: openid,
      nickName: result.data[0].nickName,
      avatarUrl: result.data[0].avatarUrl,
      content: result.data[0].content,
      modify: result.data[0].modify,
      status_code: 200,
      errMsg: 'success',
    }
  }else{  // 用户未登录，注册用户默认信息，返回用户默认信息
    return {
      openID: openid,
      status_code: 201,
      errMsg: 'User Not Found',
    }   
  }

}
