const innerAudioContext = wx.createInnerAudioContext()
const animation = wx.createAnimation({//创造动画
  duration: 500,
  timingFunction: 'linear',
})
const db = wx.cloud.database()//获取数据库引用
const album = db.collection('album')
// miniprogram/pages/music/music.js
Page({
  data: {
    albums:[],
    animationData:{},
    rotate_deg: 45,
    timer: 0,
    isPlay: true,
    currentValue: 0,
    currentIndex:0,
  },
  imgClick:function (e){
    this.setData({
      currentIndex: e.target.dataset.index
    })
    innerAudioContext.src = this.data.albums[this.data.currentIndex].link
    innerAudioContext.pause()//暂停音乐
    if (this.data.isPlay) {// 未播放情况切歌
      setTimeout(() => {
        this.play()//播放音乐
      }, 500)
    } else {// 正常情况切歌
      setTimeout(() => {
        innerAudioContext.play()//播放音乐
      }, 500)
    }
    
  },
  play: function () {
    if (this.data.isPlay) {//上锁
      this.setData({//按钮变换
        isPlay: false
      })
      this.data.timer = setInterval(() => {//封面旋转
        animation.rotate(this.data.rotate_deg).step()
        this.setData({
          rotate_deg: this.data.rotate_deg + 45,
          animationData: animation.export()
        })
      }, 500)
      innerAudioContext.play()//播放音乐
    } else {
      this.setData({//按钮变换
        isPlay: true
      })
      clearInterval(this.data.timer)//封面旋转暂停
      innerAudioContext.pause()//暂停音乐
    }
  },
  sliderchange: function (e) {//完成一次拖动后触发的事件
    if (e.detail.value == 100){//音乐跳转到最后,切到下一首歌
      this.next_song()
    } else {
      innerAudioContext.pause()//暂停音乐
      //音乐跳转到指定位置
      innerAudioContext.seek((e.detail.value * innerAudioContext.duration) / 100)
      setTimeout(() => {
        innerAudioContext.play()//播放音乐
      }, 500)
    }
  },
  prev_song: function(){//上一首
    if (this.data.currentIndex == 0) {//判断是否是第一首歌
      this.data.currentIndex = this.data.albums.length
    }
    this.setData({
      currentIndex: this.data.currentIndex - 1
    })
    innerAudioContext.src = this.data.albums[this.data.currentIndex].link//更新音乐链接
    innerAudioContext.pause()//暂停音乐
    if (this.data.isPlay) {// 未播放情况切歌
      setTimeout(() => {
        this.play()//播放音乐
      }, 500)
    } else {// 正常情况切歌
      setTimeout(() => {
        innerAudioContext.play()//播放音乐
      }, 500)
    }
  },
  next_song: function () {//下一首
    var len = this.data.albums.length//歌曲列表长度
    var x = (this.data.currentIndex + 1) % len//下一首歌的索引
    this.setData({
      currentIndex: x
    })
    innerAudioContext.src = this.data.albums[this.data.currentIndex].link
    innerAudioContext.pause()//暂停音乐
    if (this.data.isPlay) {// 未播放情况切歌
      setTimeout(() => {
        this.play()//播放音乐
      }, 500)
    } else {// 正常情况切歌
      setTimeout(() => {
        innerAudioContext.play()//播放音乐
      }, 500)
    }
  },
  onLoad: function (options) {
    album.get().then(res => {//获取云数据库的数据
      this.setData({
        albums: res.data
      })
      innerAudioContext.src = res.data[this.data.currentIndex].link
    })

    console.log(this.data.albums)//[]
    innerAudioContext.onEnded(() => {//监听音频自然播放至结束的事件
      this.setData({//更新滑动条的位置
        currentValue: 0
      })
      this.play()//暂停音乐
    })
    innerAudioContext.onWaiting(() => {
      console.log('正在等待')
    })
    innerAudioContext.onTimeUpdate(() => {//监听音频进度更新
      this.setData({//更新滑动条的位置
        currentValue: (innerAudioContext.currentTime / innerAudioContext.duration) * 100
      })
    })
  }
})