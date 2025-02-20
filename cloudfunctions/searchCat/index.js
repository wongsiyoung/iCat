// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'icat-7g0bjdvib8644e86',
  traceUser: true,
  throwOnNotFound: false  // 如果获取不到记录，不抛出异常，而是返回空
})

const db = cloud.database()
const UsersCollection = db.collection('Cats')
const cmd = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event.Name)
  
  const result = await UsersCollection.where({
    catName: db.RegExp({
      regexp: event.Name, // 模糊匹配输入的名字
      options: 'i',       // 大小写不敏感
    })
  })
  .get({
    success: console.log,
    fail: console.error
  })
  return {
    data: result["data"]
  }
}