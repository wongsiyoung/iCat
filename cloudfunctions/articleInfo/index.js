// 云函数入口文件
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
const cmd = db.command
const CatRescue = db.collection('CatRescue')
const CatHealth = db.collection('CatHealth')
const CatGuide = db.collection('CatGuide')
const CatFeeding = db.collection('CatFeeding')
const CatAdoption = db.collection('CatAdoption')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var result
  if(event.id == 0){
    result = await CatRescue
    .get({
      success: console.log,
      fail: console.error
    })
  }else if(event.id == 1){
    result = await CatGuide
    .get({
      success: console.log,
      fail: console.error
    })
  }else if(event.id == 2){
    result = await CatAdoption
    .get({
      success: console.log,
      fail: console.error
    })
  }else if(event.id == 3){
    result = await CatFeeding
    .get({
      success: console.log,
      fail: console.error
    })
  }else if(event.id == 4){
    result = await CatHealth
    .get({
      success: console.log,
      fail: console.error
    })
  }
  console.log(result)
  return {
    list: result.data
  }
}