// ModifyUserInfo.js
const app = getApp()
const db = wx.cloud.database()
const cmd = db.command
const UsersCollection = db.collection('Users')

Page({
  data:{
    userInfo: {
      nickName: '',
      avatarUrl: '',
    },
    content: '',
  },
  
  // 获取传递过来的参数
  onLoad: function(option) {
    this.setData({
      content: option.content,
      userInfo: {
        nickName: option.nickName,
        avatarUrl: option.avatarUrl  
      }    
    })
  },

  // 更新头像
  updateAvatarUrl: function() {
    let that = this // 把this赋值给that，就相当于that的作用域是全局的
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]      
        // 上传图片
        const cloudPath = 'avatarImage/' +  app.globalData.openid + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[头像更改] 成功：', res)  
            // 修改显示新的头像
            that.setData({
              userInfo: {
                avatarUrl: filePath,
                nickName: that.data.userInfo.nickName // 只更新 avataUrl， nickName 的值会没了
              }
            })
            
            // 更新头像 url 和 modify
            wx.cloud.callFunction({
              name: 'update',
              data: {
                fieldName: ['avatarUrl','modify'],
                value: [res.fileID,true]
              },
              success: () => {
                wx.showToast({
                  title: '头像更改成功',
                  icon: 'success',
                })       
              },
              fail: err => {
                console.error('[云函数] [update] 调用失败', err)
                wx.showToast({
                  title: '服务故障，请重试!',
                  icon: 'loading',
                })
              }
             })    
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '服务故障，请重试!',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: e => {
        console.error(e)
      }
    }) 
  },

  // 更新昵称
 updateNickName: function(e) {
  wx.cloud.callFunction({
    name: 'update',
    data: {
      fieldName: ['nickName'],
      value: [e.detail.value]
    },
    success: () => {
        wx.showToast({
          title: '修改昵称成功',
          icon: 'success',
        })          
    },
    fail: err => {
      console.error('[云函数] [update] 调用失败', err)
      wx.showToast({
        title: '服务故障，请重试!',
        icon: 'loading',
      })
    }
   })    
   return e.detail.value    // 替换掉输入框内容
  },

  // 更新个人简介
  updateContent: function(e) {
    wx.cloud.callFunction({
      name: 'update',
      data: {
        fieldName: ['content'],
        value: [e.detail.value]
      },
      success: () => {
          wx.showToast({
            title: '修改个人简介成功',
            icon: 'success',
          })          
      },
      fail: err => {
        console.error('[云函数] [update] 调用失败', err)
        wx.showToast({
          title: '服务故障，请重试!',
          icon: 'loading',
        })
      }
     })    
     return e.detail.value  // 替换掉输入框内容
  }
})
