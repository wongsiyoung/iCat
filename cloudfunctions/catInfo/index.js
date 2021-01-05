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
const CatsCollection = db.collection('Cats')
const cmd = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // console.log(event.Number)
  const result = await CatsCollection
  .skip( (event.Number-1) *10)
  .limit(10)
  .get()
  .catch(console.error)
  console.log(result["data"])
  return {
    data: result["data"]
  }
}