var position={
  lat:49.826676,
  lng:24.012978
}
const weather_key='cdd56ff5dd2f6ca5430c80f77c96b704';
const google_key='AIzaSyBTPpQ08GB1OGiE1iMkY_e7wqBAHeVEock&libraries';

var time=moment();
var cityname=null;
window.onload = function() {
  var geoSuccess = function(geoPosition) {//get geoposition
    position.lat=geoPosition.coords.latitude;
    position.lng=geoPosition.coords.longitude;
  };
  var geoError = function(error) {
    console.log('Error occurred. Error code: ' + error.code);
  };
 navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
 convertLatLngToCityname(position.lat,position.lng);
 addScriptForDarksky(position.lat,position.lng,time)
};

function convertLatLngToCityname(lat,lng){
  var url='https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&key='+google_key;
  getCORS(url, function (responseText) {
    var response = JSON.parse(responseText);
    for(let i=0;i<response.results[0].address_components.length;i++){
      if(response.results[0].address_components[i].types.indexOf('locality')!=-1){
        cityname=response.results[0].address_components[i].short_name;
        break;
      }
    }
  });
}

var getCORS = function (url, callback) {
  var XHR = window.XDomainRequest || window.XMLHttpRequest;
  var xhr = new XHR();
  xhr.open('GET', url, true);
  xhr.onload = function() {
    callback(xhr.responseText);
  }
  xhr.onerror = function() {
    alert("Error"+xhr.status);
  }
  xhr.send();
}
function addScriptForDarksky(lat,lng,time){//JSONP
  var weatherUrl= 'https://api.darksky.net/forecast/'+weather_key+'/'+lat+','+lng+','+Math.floor(time.valueOf()/1000)+'?units=si&lang=uk&exclude=hourly,flags,currently'+'&callback=getWeatherJSONP';
  var $script=document.createElement('script');
  $script.src=weatherUrl;
  document.head.append($script);
}

function getWeatherJSONP(e){
  updateWidget(e);
}

function updateWidget(response){
  var dailyWeather=response.daily.data[0];
  var datetime = moment(dailyWeather.time*1000);

  document.getElementsByClassName('widget-header')[0].innerText=cityname;
  document.getElementsByClassName('widget-date')[0].innerText=datetime.format('L');
  document.getElementsByClassName('widget-time')[0].innerText=datetime.format('LT');
  document.getElementsByClassName('widget-temperatureMin')[0].innerHTML="Min: "+dailyWeather.temperatureLow+'&deg;';
  document.getElementsByClassName('widget-temperatureMax')[0].innerHTML="Max: "+dailyWeather.temperatureMax+'&deg;';
  document.getElementsByClassName('widget-humidity')[0].innerText='Вологість:  '+dailyWeather.humidity*100+'%';
  document.getElementsByClassName('widget-weatherIcon')[0].src='img/'+dailyWeather.icon+'.png';
  document.getElementsByClassName('widget-descr')[0].innerText=dailyWeather.summary;
}

function nextDay () {
  var $prevbtn=document.getElementsByClassName('btnPrev')[0];
  $prevbtn.classList.remove('hidden');
  time=time.add(1,'days');
  addScriptForDarksky(position.lat,position.lng,time)
}
function prevDay (e) {
  time=time.subtract(1,'days');
  addScriptForDarksky(position.lat,position.lng,time)
  if(moment()>=time){
    e.classList.add('hidden')
  }
}



