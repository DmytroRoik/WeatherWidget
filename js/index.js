var position={
  lat:49.826676,
  lng:24.012978
}
const key='cdd56ff5dd2f6ca5430c80f77c96b704';

var time=moment();

var getCORS = function (url, callback) {
        var XHR = window.XDomainRequest || window.XMLHttpRequest
        var xhr = new XHR();
        xhr.open('GET', url, true);
        xhr.onload = function() {
          callback(xhr.responseText);
        }
        xhr.onerror = function() {
            alert("Error")
        }
        xhr.send();
}

function getWeather (datetime) {
  var url = 'https://api.darksky.net/forecast/'+key+'/'+position.lat+','+position.lng+','+Math.floor(datetime.valueOf()/1000)+'?units=si&lang=uk&exclude=hourly,flags,currently';
  getCORS(url, function (responseText) {
    var response = JSON.parse(responseText);
    updateWidget(response)
  });
}

function updateWidget(response){
  var dailyWeather=response.daily.data[0];
  var datetime = moment(dailyWeather.time*1000);

  console.log(dailyWeather);
  document.getElementsByClassName('widget-header')[0].innerText="Place"
  document.getElementsByClassName('widget-date')[0].innerText=datetime.format('L');
  document.getElementsByClassName('widget-time')[0].innerText=datetime.format('LT');
  document.getElementsByClassName('widget-temperatureMin')[0].innerHTML="MIN:"+dailyWeather.temperatureLow+'&deg;C';
  document.getElementsByClassName('widget-temperatureMax')[0].innerHTML="MAX:"+dailyWeather.temperatureMax+'&deg;C';
   document.getElementsByClassName('widget-humidity')[0].innerText='Вологість:'+dailyWeather.humidity*100+'%';
  document.getElementsByClassName('widget-weatherIcon')[0].innerText="Place"
  document.getElementsByClassName('widget-descr')[0].innerText=dailyWeather.summary;
}

function nextDay () {
  var $prevbtn=document.getElementsByClassName('btnPrev')[0];
  $prevbtn.style.display = 'block';
  time=time.add(1,'days');
  getWeather(time);
  console.log(time.format('lll'));
}
function prevDay (e) {

  time=time.subtract(1,'days');
  getWeather(time);
  console.log(time.format('lll'));
  if(moment()>=time){
    e.style.display='none';
    return;
  }
}

getWeather(time);


