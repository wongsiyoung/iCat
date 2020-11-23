// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV,
  throwOnNotFound: false  // 如果获取不到记录，不抛出异常，而是返回空
})

// 连接数据库
const db = cloud.database()
const UsersCollection = db.collection('Users')
const cmd = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  openid = wxContext.OPENID
  console.log('hello')
  console.log(event.fieldName.length)
  for( let i = 0; i < event.fieldName.length; i++){
    try {
      console.log(event.fieldName[i])
      console.log(event.value[i])
      await UsersCollection.where({
        openID: openid
      })
      .update({
        data: {
          [event.fieldName[i]] : event.value[i]
        },
      })
    } catch(e) {
      console.error(e)
    }
  }
}