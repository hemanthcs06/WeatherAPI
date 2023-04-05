const http=require("http");
const fs=require("fs");
const requests=require("requests");

const homeFile=fs.readFileSync("home.html","utf8");
const replaceVal=(tempVal,orgVal)=>
{
  let temperature=tempVal.replace("{%tempval%}",Math.round(orgVal.main.temp-273.15));
  temperature=temperature.replace("{%tempmin%}",Math.round(orgVal.main.temp_min-273.15));
  temperature=temperature.replace("{%tempmax%}",Math.round(orgVal.main.temp_max-273.15));
  temperature=temperature.replace("{%country%}",orgVal.sys.country);
  temperature=temperature.replace("{%location%}",orgVal.name);
  temperature=temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
  return temperature;
};
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?lat=12.97&lon=77.59&appid=a3379041341374fe6e0477516f7d95ad')
.on('data', (chunk)=> {
  const objData=JSON.parse(chunk);
  const arrData=[objData];
  // console.log(arrData);
  const realTimeData=arrData.map(val=> replaceVal(homeFile,val) ).join(""); 
//homefile has entire home.html and val will have the api data
res.write(realTimeData);
})
.on('end',  (err)=> {
  if (err) return console.log('connection closed due to errors', err);
  res.end();
});
    }
});
server.listen(7000,"127.0.0.1",()=>{
    console.log("listening");
});

//api is fetched from openwaethermap
