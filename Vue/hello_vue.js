var app = new Vue({
  el: '#app',
  data: {
    name: '篠原さん'
  }
})

new Vue({
  el: "#counter",
  data: {
    count:0
  },
  methods: {
    countUp: function () {
      this.count++;
    }
  }
})

var text = new Vue({
  el: '#text',
  data: {
    myText:'今日は雨です'
  }
})

new Vue({
  el: "#important",
  data: {
    myChecks:[]
  }
})

new Vue({
  el: "sendBtn",
  data: {
    myAgree:false
  }
})

var pic = new Vue({
  el: "#picChange",
  data: {
    fileName:""
  }
})

new Vue({
  el: "#list",
  data: {
    myArray:["アメリカ","カナダ","イギリス"]
  }
})

var moreList = new Vue({
  el: "#more_list",
  data: {
    objArray: [
      { name: "iPhone", price: 1200},
      { name: "Android", price: 1000}
    ]
  }
})
  
