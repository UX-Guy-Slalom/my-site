(function(){
  const card = document.getElementById('weather-card');
  const emojiEl = document.getElementById('weather-emoji');
  const tempEl = document.getElementById('weather-temp');
  const descEl = document.getElementById('weather-desc');
  const metaEl = document.getElementById('weather-meta');

  if(!card || !emojiEl || !tempEl || !descEl || !metaEl) return;

  function mapWeather(code, isDay) {
    if (code === 0) return {emoji: isDay? '☀️':'🌙', text:'Clear'};
    if ([1,2,3].includes(code)) return {emoji: '⛅', text:'Partly cloudy'};
    if ([45,48].includes(code)) return {emoji: '🌫️', text:'Fog'};
    if ([51,53,55,56,57].includes(code)) return {emoji: '🌦️', text:'Drizzle'};
    if ([61,63,65,66,67].includes(code)) return {emoji: '🌧️', text:'Rain'};
    if ([71,73,75,77,85,86].includes(code)) return {emoji: '❄️', text:'Snow'};
    if ([80,81,82].includes(code)) return {emoji: '🌧️', text:'Showers'};
    if ([95,96,99].includes(code)) return {emoji: '⛈️', text:'Thunderstorm'};
    return {emoji:'🌈', text:'Mixed'};
  }

  function showError(msg){ descEl.textContent = msg; tempEl.textContent='--°F'; metaEl.textContent=''; emojiEl.textContent='❗';
    var forecastEl = document.getElementById('forecast'); if(forecastEl) forecastEl.innerHTML = '';
  }

  function cToF(c){ return Math.round((c * 9/5) + 32); }
  function kmhToMph(k){ return Math.round(k / 1.609344); }

  function fetchWeather(lat, lon){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    fetch(url).then(r=>{
      if(!r.ok) throw new Error('Network response not ok');
      return r.json();
    }).then(data=>{
      if(!data || !data.current_weather) { showError('No weather data'); return; }
      const cw = data.current_weather;
      const ctempC = cw.temperature;
      const f = cToF(ctempC);
      tempEl.textContent = `${f}°F`;
      const isDay = cw.is_day === 1;
      const map = mapWeather(cw.weathercode, isDay);
      emojiEl.textContent = map.emoji;
      const windMph = cw.windspeed ? kmhToMph(cw.windspeed) : null;
      descEl.textContent = map.text + (windMph ? ` • ${windMph} mph wind` : '');
      metaEl.textContent = `Updated: ${new Date().toLocaleTimeString()}`;
      card.classList.remove('loading');

      // Render 5-day forecast if available
      try{
        var forecastEl = document.getElementById('forecast');
        if(forecastEl && data.daily && data.daily.time){
          var dates = data.daily.time;
          var tMax = data.daily.temperature_2m_max || [];
          var tMin = data.daily.temperature_2m_min || [];
          var codes = data.daily.weathercode || [];
          var start = (dates.length>5) ? 1 : 0; // skip today if more than 5 entries
          var count = Math.min(5, dates.length - start);
          var html = '';
          for(var i=0;i<count;i++){
            var idx = start + i;
            var day = new Date(dates[idx]).toLocaleDateString(undefined,{weekday:'short'});
            var maxF = tMax[idx] !== undefined ? cToF(tMax[idx]) : '--';
            var minF = tMin[idx] !== undefined ? cToF(tMin[idx]) : '--';
            var code = codes[idx] !== undefined ? codes[idx] : null;
            var m = mapWeather(code, true);
            html += `<div class="forecast-card"><div class="forecast-day">${day}</div><div class="forecast-emoji">${m.emoji}</div><div class="forecast-temps">${maxF}° / ${minF}°</div></div>`;
          }
          forecastEl.innerHTML = html;
        }
      }catch(e){ console.warn('Forecast render failed',e); }
    }).catch(err=>{
      console.error(err);
      showError('Unable to load weather');
    });
  }

  function init(){
    if (!('geolocation' in navigator)) {
      showError('Geolocation not supported');
      return;
    }
    metaEl.textContent = 'Requesting location…';
    navigator.geolocation.getCurrentPosition(pos=>{
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      metaEl.textContent = `Lat ${lat.toFixed(2)}, Lon ${lon.toFixed(2)}`;
      fetchWeather(lat, lon);
    }, err=>{
      console.warn(err);
      showError('Enable location to see your weather.');
    }, {timeout:10000});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
