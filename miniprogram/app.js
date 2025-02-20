//app.js
const articles = require('data/data_articles.js');/////////////////////////////////
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'icat-7g0bjdvib8644e86',
        traceUser: true,
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