var postsData = require("../../data/posts-data.js")

Page({
  data: {
    post_list: postsData.postList
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  },
  onSwiperTap: function (event) {
    // target 和和 currentTarget 的区别
    // target 指是的点击当前元素
    // currentTarget 指的是事件捕获的元素
    var postId = event.target.dataset.postid
    console.log(event)
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId
    })
  }
})