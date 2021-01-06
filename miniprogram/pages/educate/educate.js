//logs.js
//var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
        // 日记列表
    // TODO 从server端拉取
    articles: null,

    // 是否显示loading
    showLoading: true,

    // loading提示语
    loadingMessage: '正在加载...',
  },
  onLoad: function () {
    this.getArticles();
  },
  // switchTab: function(e){
  //   this.setData({
  //   });
  // }

  getArticles() {
    var that = this;
    app.getArticleList(list => {
      that.setData({articles: list});
    })
  },

  showDetail(event) {
    wx.navigateTo({
      url: './entry/entry?id=' + event.currentTarget.id,
    });
  }


})
