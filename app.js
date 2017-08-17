// const movies = ["霸王别姬","千与千寻","肖声克的救赎"]
// const url = "https://api.douban.com/v2/movie/search?q="
// const https = require('https');
//
// function getUrl(name) {
//   return url+name
// }
//
// async function getCover(name) {
//   https.get(getUrl(name),(res) => {
//     console.log(res);
//   })
// }
// getCover(movies[0])
const fs = require('fs');
const path = require('path');
const request = require('request');
const movieDir = "./movies",
      exts = ['.mkv','.avi','.mp4','rm','']
function readFiles () {
  return new Promise((resolve,reject) => {
    fs.readdir(movieDir, (err,files) => {
      files.filter(file => exts.includes(path.parse(file).ext))
      resolve(files)
    })
  })
}
function getPoster (name) {
  let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(name)}`
  console.log(url);
  return new Promise((resolve,reject) => {
    request({
      url,
      json: true
    },(err,response,data) => {
      if(err)
        console.log('出错了');
      resolve(data.subjects[0].images.small);
    })
  })
}
var savePoster = (name,url) => {
  request.get(url).pipe(
    fs.createWriteStream(path.join(movieDir,name+'.jpg'))
  )
}
(async () => {
  var files = await readFiles()
  for(let file of files){
    let {name} = path.parse(file)
    console.log(`正在获取 ${name}`)
    savePoster(name,await getPoster(name))
  }
})()
