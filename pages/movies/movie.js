var util = require("../../utils/util.js")
var app = getApp()

Page({
  data: {
    inTheaterData: {},
    commingSoonData: {},
    top250Data: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false
  },
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters?start=0&count=3"
    var commingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon?start=0&count=3"
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250?start=0&count=3"

    this.getMovieListData(inTheatersUrl, "inTheaterData", "正在热映")
    this.getMovieListData(commingSoonUrl, "commingSoonData", "即将上映")
    this.getMovieListData(top250Url, "top250Data", "豆瓣Top250")
  },
  onMoreTap: function(event){
    var category = event.currentTarget.dataset.category 
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category
    })
  },
  // 跳转到电影详情页
  onMoveTap: function(event){
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + event.currentTarget.dataset.movieid
    })
  },
  // 获取电影数据
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/xml'
      }, // 设置请求的 header
      success: function (res) {
        // success
        that.processDouBanData(res.data, settedKey, categoryTitle)
      },
      fail: function (err) {
        // fail
        console.log(err)
      }
    })
  },
  onCancelImgTap: function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })

    event.detail.value = ""
  },
  onBindFocus: function(event){
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },
  onBindConfirm: function(event){  
    // 键盘点击完成时搜索
    var text = event.detail.value
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text
    this.getMovieListData(searchUrl, "searchResult", "")
  },
  // 对于接口返回数据处理（为了绑定数据）
  processDouBanData: function (movieDouBan, settedKey, categoryTitle) {
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
    var readyData = {}
    readyData[settedKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    }
    this.setData(readyData)
  }
})