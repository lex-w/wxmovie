// pages/movies/more-movie/more-movie.js
var app = getApp()
var util = require("../../../utils/util.js")

Page({
  data: {
    navigateTitle: "",
    movies: {},
    requestUrl: "",
    totalCount: 0,
    isEmpty: true
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var category = options.category
    this.setData({
      navigateTitle: category
    })
    var dataUrl = ""
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters"
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250"
        break;
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl, this.processDouBanData)
  },
  // 上拉加载
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
    util.http(nextUrl, this.processDouBanData)
    wx.showNavigationBarLoading()
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    var refreshUrl = this.data.requestUrl + "/?start=0&count=20"
    this.data.movies = {}
    this.data.isEmpty = true
    util.http(refreshUrl, this.processDouBanData)
  },
  processDouBanData: function (movieDouBan) {
    var movies = []
    for (var i = 0; i < movieDouBan.subjects.length; i++) {
      var subject = movieDouBan.subjects[i]
      var title = subject.title
      if (title.length > 7) {
        title = title.substring(0, 7) + "..."
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
        stars: util.converToStarsArray(subject.rating.stars)
      }
      movies.push(temp)
    }

    var totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({
      movies: totalMovies
    })
    this.data.totalCount += 20
    
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  }
  
})