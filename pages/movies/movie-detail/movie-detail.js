// pages/movies/movie-detail/movie-detail.js
var app = getApp()
var util = require("../../../utils/util.js")

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var movieId = options.id
    console.log(movieId)
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId
    util.http(url, this.proccessDoubanData) 
  },
  proccessDoubanData: function(data){
    console.log(data)
  }
})