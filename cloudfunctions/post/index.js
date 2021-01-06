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

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  postResult = await post
  .orderBy('postID', 'desc')
  .get({
    success: console.log,
    fail: console.error
  })

  // 新增用户记录
  try {
    return await post.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openID: wxContext.OPENID,
        postID: postResult.data[0].postID + 1,
        content: event.content,
        image: event.image
      }
    })
  } catch(e) {
    console.error(e)
    return {
      status_code: 500,
      errMsg: e
    }
  }
}