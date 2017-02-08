// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()

//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()


//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

function converToStarsArray(stars) {
  var num = stars.toString().substring(0, 1)
  var array = []
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array
}

function douban_limit() {
    var timestamp = Date.parse(new Date())
    var requestDoubanTime = wx.getStorageSync('requestDoubanTime')
    var requestDoubanNum = wx.getStorageSync('requestDoubanNum')
    if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
        wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1)
        if (requestDoubanNum < 35) {
            //Lower than 35/m,pass            
            return
        }
        else {
            wx.showToast({
                title: '豆瓣api请求频率超35/m，小心',
                icon: 'loading',
                duration: 5000
            })
            //提示或者去别的地方
            wx.redirectTo({
                 url:"../../../../../pages/welcome/welcome"
            })
        }
    }
    else {
        wx.setStorageSync('requestDoubanTime', timestamp)
        wx.setStorageSync('requestDoubanNum', 1)
    }
}

function http(url, callBack, method) {
  var that = this
  if(!method){
    method = "GET"
  }
  douban_limit()
  wx.request({
    url: url,
    method: method, 
    header: {
      'content-type': 'application/xml'
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (err) {
      console.log(err)
    }
  })
}

module.exports = {
  // formatTime: formatTime,
  converToStarsArray: converToStarsArray,
  http: http
}
