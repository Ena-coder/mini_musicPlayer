// miniprogram/pages/index/index.js
Page({
  data:{
    tasks:[]
  },
  btnclick_1:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['yMEjyTu--JIobU3WCtECrp4IeKznzvc_48qdmYhX5Wg'],
      success(res) {
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'testSend'
          // // 传递给云函数的event参数
          // data: {
          //   tmplIds,
          // }
        }).then(res2 => {
          console.log(res2)
          // output: res.result === 3
        }).catch(err => {
          // handle error
        })
      },
      fail(err){
         console.log(err)
      }
    })
  },
  btnclick_2:function(){
    wx.cloud.callFunction({
      name: 'testGetData'
    }).then(res => {
      console.log(res.result.data)
      // this.setData({
      //   tasks:res.result.data
      // })
      this.data.tasks = res.result.data
    }).catch(err => {
      console.log(err)
    })
  }
})