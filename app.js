//app.js
const articles = require('data/data_articles.js');/////////////////////////////////
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },
    // -------------------------------------------
    getArticleList(cb) {
      var that = this;
  
      if (this.globalData.articleList) {
        typeof cb == 'function' && cb(this.globalData.articleList);
      } else {
        let list = [];
  
        this.getLocalArticles(storage => {
          // 本地缓存数据
          for (var k in storage) {
            list.push(storage[k]);
          }
        });
  
        // 本地假数据
        list.push(...articles.articles);
        that.globalData.articleList = list;
        typeof cb == 'function' && cb(that.globalData.articleList)
      }
    },
      // --------------------------------------------------
  getLocalArticles(cb) {
    var that = this;
    if (this.globalData.localArticles) {
      typeof cb == 'function' && cb(this.globalData.localArticles);
    } else {
      wx.getStorage({
        key: config.storage.articleListKey,
        success: (res) => {
          that.globalData.localArticles = res.data;
          typeof cb == 'function' && cb(that.globalData.localArticles);
        },
        fail: (error) => {
          that.globalData.localArticles = {};
          typeof cb == 'function' && cb(that.globalData.localArticles);
        }
      });
    }
  }
})