//index.js
const app = getApp()    // 全局变量
const CONTENT = '这个人很懒，什么都没留下'

Page({
  data: { // 默认值
    userInfo: {
      nickName: '用户名',
      avatarUrl: './user-unlogin.png',
      gender: 0,      // 性别(0：未知、1：男、2：女) 
      language: '',
      city: '',
      country: '',
      province: '',
    },   
    logged: false,  // 用户是否登录
    takeSession: false, 
    requestResult: '',
    content: CONTENT
  },

  onLoad: function() {  // 用户页面加载完的时候会进入该函数
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',  // 小程序不支持云能力的话会跳转到该页面
      })
      return
    }
    /* 调用云函数 checkUser 查询数据库是否已存在该用户
        已存在: 状态码:200,返回用户注册信息和openid
        不存在: 状态码:201,返回openid
    */
    let that = this
    wx.cloud.callFunction({
      name: 'checkUser',
      data: {},
      success: res => {
        // console.log('[云函数] [cheeckUser] user openid: ', res.result.openID)
        app.globalData.openid = res.result.openID // 全局变量存储用户的 OpenID 
        if (res.result.status_code == 200) {  // 用户存在
          if( res.result.modify == false ){
            this.setData({
              content: res.result.content,
              userInfo: {
                nickName: res.result.nickName,
                avatarUrl: res.result.avatarUrl
              },
              logged: true
            })
          }
          else if ( res.result.modify == true ){
            wx.cloud.downloadFile({
              fileID: res.result.avatarUrl,
              success: result => {
                // get temp file path
                console.log(result.tempFilePath)
                that.setData({
                  content: res.result.content,
                  userInfo: {
                    nickName: res.result.nickName,
                    avatarUrl: result.result.avatarUrl
                  },
                  logged: true
                })
                console.log(that.data.avatarUrl)
              },
              fail: err => {
                wx.showToast({
                  title: '服务故障，请重试!',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          } 
        }
      },
      fail: err => {
        console.error('[云函数] [checkUser] 调用失败', err)
        wx.showToast({
          title: '服务故障，请重试!',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },

  // 每次进入该页面的时候调用
  onShow: function() {
    let that = this
    wx.cloud.callFunction({
      name: 'checkUser',
      data: {},
      success: res => {
        console.log('[云函数] [cheeckUser] user openid: ', res.result.openID)
        app.globalData.openid = res.result.openID // 全局变量存储用户的 OpenID 
        if (res.result.status_code == 200) {  // 用户存在
          if( res.result.modify == false ) { // 用户未上传头像
            this.setData({
              content: res.result.content,
              userInfo: {
                nickName: res.result.nickName,
                avatarUrl: res.result.avatarUrl
              },
              logged: true
            })
          }
          else if ( res.result.modify == true ){
            wx.cloud.downloadFile({
              fileID: res.result.avatarUrl,
              success: result => {
                // get temp file path
                // console.log('hello')
                // console.log(result.tempFilePath)
                that.setData({
                  content: res.result.content,
                  userInfo: {
                    nickName: res.result.nickName,
                    avatarUrl: result.tempFilePath
                  },
                  logged: true
                })
              },

              fail: err => {
                wx.showToast({
                  title: '服务故障，请重试!',
                  icon: 'loading',
                  duration: 2000
                })
              }
            })
          } 
        }
      },
      fail: err => {
        console.error('[云函数] [checkUser] 调用失败', err)
        wx.showToast({
          title: '服务故障，请重试!',
          icon: 'loading',
          duration: 2000
        })
      }
    })    
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) { // 用户未登录且用户已授权时获取用户个人信息
      this.setData({
        logged: true,                 // 记录登陆状态
        userInfo: e.detail.userInfo   // 获取用户所有信息
      })
      console.log(e.detail.userInfo)
    }

    /* 调用云函数 login 注册用户信息
      传入参数: 用户昵称nickName，头像地址avatarUrl，个人简介content 和 openID
      返回参数:  1.注册成功: status_code 200, errMsg 错误说明
                2.注册失败: status_code 500, errMsg 错误说明
    */
    wx.cloud.callFunction({
      name: 'login',
      data: {
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
        content: CONTENT,
        openID: app.globalData.openid,
        modify: false
      },
      success: () => {
          wx.showToast({
            title: '欢迎来到 iCat 社区!',
            icon: 'success',
            duration: 2000
          })          
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '服务故障，请重试!',
          icon: 'loading',
          duration: 2000
        })
      }
    })    
  },

  toIntroduction: function() {
    wx.navigateTo({
      url: 'indroduce/introduce'
    })
  },

  toAbout: function() {
    wx.navigateTo({
      url: 'about/about'
    })
  },

  toMoney: function() {
    wx.navigateTo({
      url: 'money/money'
    })
  },

})