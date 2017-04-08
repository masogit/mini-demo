
Page({
  data: {
    name: 'Click Me'
  },
  setName(e) {
    console.log(e)
    this.setData({
      name: 'Details'
    })
  }
})
