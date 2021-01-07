//index.js

var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    info: [],
    pageNumber: 1,
    endFlag: false,
    searchFlag:false,
  },

  onShow: function()
  {
    this.catInfo()
  },

  catInfo:function(){
    wx.cloud.callFunction({
      name:'catInfo',
      data:{//当前页数传递给后端
        Number: this.data.pageNumber
      },
      success: res => {
          var arr = this.data.info
          if(this.data.endFlag == false && this.data.searchFlag == false)
          {
            for(var i = 0; i < res.result.data.length; i++)
            {
              arr.push(res.result.data[i])
            }
          }
          this.setData({//将数据复制给本地feed暂存
            info: arr
          }),
        this.checkEnd(res.result.data.length)
      },
    fail:err => {
      console.error('[云函数] [catInfo] 调用失败', err)
        wx.showToast({
          title: '服务故障，请重试!',
          icon: 'loading',
        })
    }
    })
  },

  //检查数据库是否加载完成
  checkEnd: function(e)
  {
    console.log("check")
    if(e < 10)
    {
      this.setData({
        endFlag :true
      })
    }
  },

  //下拉刷新处理方法
  upper: function(){
    if(this.data.pageNumber > 1 && this.data.searchFlag == false)
    {
      this.setData({
        pageNumber: 1,
        info: [],
        endFlag:false
      })
    }
    this.refresh()
    this.catInfo()
  },
  //触底刷新
  lower: function()
  {
    if(this.data.endFlag == false && this.data.searchFlag == false)
    {
      this.setData({
        pageNumber:this.data.pageNumber + 1
      })
      this.refresh()
    }
    else
    {
      wx.showToast({
        title: '到底啦',
        image: "images/cat-select.png",
        duration: 1000
      });
    }
    this.catInfo()
  },

  refresh: function(){
    wx.showToast({
      title: '刷新中',
      icon: 'loading',
      duration: 1000
    });
  },
  //事件处理函数
  //跳转到猫咪信息详情页面，还要传递猫咪的id
  bindItemTap: function() {
    wx.navigateTo({
      url: 'cat/cat'
    })
  },

  catSearch: function(e){
    console.log("lllllll")
    console.log(e.detail.value.length)
    if(e.detail.value.length == 0)
    {
      this.setData({
        info:[],
        searchFlag : false,
      })
      this.catInfo()
    }
    else{
      wx.cloud.callFunction({
        name: 'searchCat',
        data: {
          Name:e.detail.value,
        },
        success: res => {
          console.log(res.result.data)
          this.setData({
            pageNumber:1,
            endFlag:false,
            info:res.result.data,
            searchFlag:true
          })
          this.catInfo()
        },
        fail: err => {
          console.error('[云函数] [catSearch] 调用失败', err)
          wx.showToast({
            title: '服务故障，请重试!',
            icon: 'loading',
          })
        }
      })    
      return e.detail.value    // 替换掉输入框内容
    }
  }
})
