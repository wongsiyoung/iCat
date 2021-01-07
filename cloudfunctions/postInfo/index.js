// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'icat-7g0bjdvib8644e86',
  traceUser: true,
  throwOnNotFound: false  // 如果获取不到记录，不抛出异常，而是返回空
})

// 连接数据库
const db = cloud.database()
const cmd = db.command
const post = db.collection('Post')
const user = db.collection('Users')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID

    // 查询用户是否已存在数据库中
    const userResult = await user.where({
      openID: cmd.eq(openid)
    })
    .get({
      success: console.log,
      fail: console.error
    })

    const postResult = await post
    .orderBy('time', 'desc')  // 按时间降序，获取最新时间发表文章
    .get()
    .then(console.log)
    .catch(console.error)
    
    console.log(postResult)
    if (userResult.data.length != 0 ){  // 用户存已登录，返回用户信息
      return {
        nickName: userResult.data[0].nickName,
        avatarUrl: userResult.data[0].avatarUrl,
        modify: userResult.data[0].modify,
        status_code: 200,
        errMsg: 'success',
        post: postResult.data
      }
    }else{  // 用户未登录，注册用户默认信息，返回用户默认信息
      return {
        status_code: 201,
        errMsg: 'User Not Found',
      }   
    }
}