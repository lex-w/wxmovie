var postsData = require("../../../data/posts-data.js")
var app = getApp()
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (options) {
        var postId = options.id
        this.data.currentPostId = postId
        var postDatas = postsData.postList[postId]
        this.setData({
            postData: postDatas
        })

        var postCollected = wx.getStorageSync('posts_collected')
        if (postCollected) {
            var postCollected = postCollected[postId]
            this.setData({
                collected: postCollected
            })
        } else {
            postCollected = {}
            postCollected[postId] = false
            wx.setStorageSync('posts_collected', postCollected)
        }

        if(app.globalData.g_isPlaingMusic && app.globalData.g_isPlayingCurrentId === postId){
            this.setData({
                isPlayingMusic: true
            })
        }

        // 监听全局音乐的状态
        this.setAudioMonitor()
    },
    setAudioMonitor: function(){
        var that = this
        wx.onBackgroundAudioPlay(function() {
          that.setData({
              isPlayingMusic: true
          })
          app.globalData.g_isPlaingMusic = true
          app.globalData.g_isPlayingCurrentId = that.data.currentPostId
        })
        wx.onBackgroundAudioPause(function() {
          that.setData({
              isPlayingMusic: false
          })
          app.globalData.g_isPlaingMusic = false
          app.globalData.g_isPlayingCurrentId = null
        })
        wx.onBackgroundAudioStop(function() {
          that.setData({
              isPlayingMusic: false
          })
          app.globalData.g_isPlaingMusic = false
          app.globalData.g_isPlayingCurrentId = null
        })
    },
    onCollectionTap: function (event) {
        this.getPostsCollectedSync()
        // this.getPostsCollected()
    },
    getPostsCollected: function () {
        var that = this
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data
                var postId = that.data.currentPostId
                var postCollected = !postsCollected[postId]
                postsCollected[postId] = postCollected
                that.showToast(postsCollected, postCollected)
            }
        })
    },
    getPostsCollectedSync: function () {
        var postsCollected = wx.getStorageSync('posts_collected')
        var postId = this.data.currentPostId
        var postCollected = !postsCollected[postId]
        postsCollected[postId] = postCollected
        this.showToast(postsCollected, postCollected)
    },
    showModal: function (postsCollected, postCollected) {
        var that = this
        wx.showModal({
            title: "收藏",
            content: postCollected ? "你确定收藏该文章内容" : "取消收藏该文章",
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000",
            confirmText: "确定",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected)
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },
    showToast: function (postsCollected, postCollected) {
        wx.setStorageSync('posts_collected', postsCollected)
        this.setData({
            collected: postCollected
        })
        var title = postCollected ? "收藏成功" : "取消收藏成功"
        wx.showToast({
            title: title,
            icon: 'success',
            duration: 2000
        })
    },
    onShareTap: function (event) {
        wx.removeStorageSync('key')
        var itemList = [
            "分享给微信好友",
            "分享到朋友圏",
            "分享到QQ",
            "分享到微博"
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel  是否点击了取消按钮
                // res.tapIndex 当前选中的是哪个
                console.log(itemList[res.tapIndex])
            }
        })
    },
    onMusicTap: function () {
        var isPlayingMusic = this.data.isPlayingMusic
        var currentPostId = this.data.currentPostId
        var postDataMusic = this.data.postData.music
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio()
            this.setData({
                isPlayingMusic: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postDataMusic.url,
                title: postDataMusic.title,
                coverImgUrl: postDataMusic.coverImg
            })
            this.setData({
                isPlayingMusic: true
            })
        }
    }
})