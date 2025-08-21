const API_KEY = "47e2929bc2e58b09f1f6d7dc2d341d79"; 
let units = "metric";

const form = document.getElementById('searchForm');
const input = document.getElementById('cityInput');
const result = document.getElementById('result');
const msg = document.getElementById('msg');
const place = document.getElementById('place');
const timeEl = document.getElementById('time');
const icon = document.getElementById('icon');
const temp = document.getElementById('temp');
const desc = document.getElementById('desc');
const feels = document.getElementById('feels');
const hum = document.getElementById('hum');
const wind = document.getElementById('wind');
const press = document.getElementById('press');
const locBtn = document.getElementById('locBtn');

document.querySelectorAll('input[name="unit"]').forEach(r=>{
  r.addEventListener('change', e => {
    units = e.target.value;
    if(place.textContent && place.textContent !== '—'){
      fetchCity(place.textContent);
    }
  });
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  fetchCity(input.value.trim());
});

locBtn.addEventListener('click', ()=>{
  if(!navigator.geolocation){ showMessage('Geolocation is not supported'); return; }
  navigator.geolocation.getCurrentPosition(async pos=>{
    const {latitude, longitude} = pos.coords;
    fetchCoords(latitude, longitude);
  }, err => {
    showMessage('Location access denied. You can search by city name.');
  });
});

async function fetchCity(q){
  if(!API_KEY || API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY'){
    showMessage('Please add your OpenWeatherMap API key in script.js');
    return;
  }
  showMessage('');
  try{
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=${units}`);
    if(!resp.ok) throw new Error('City not found');
    const data = await resp.json();
    render(data);
  }catch(err){
    showMessage(err.message || 'Something went wrong');
  }
}

async function fetchCoords(lat, lon){
  if(!API_KEY || API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY'){
    showMessage('Please add your OpenWeatherMap API key in script.js');
    return;
  }
  showMessage('');
  try{
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`);
    if(!resp.ok) throw new Error('Could not fetch your location weather');
    const data = await resp.json();
    render(data);
  }catch(err){
    showMessage(err.message || 'Something went wrong');
  }
}

function render(d){
  result.classList.remove('hidden');
  place.textContent = `${d.name}, ${d.sys?.country ?? ''}`;
  const dt = new Date((d.dt + d.timezone) * 1000);
  timeEl.textContent = dt.toUTCString().replace('GMT','UTC');
  const ic = d.weather?.[0]?.icon ?? '01d';
  icon.src = `https://openweathermap.org/img/wn/${ic}@2x.png`;
  icon.alt = d.weather?.[0]?.description ?? 'weather icon';
  temp.textContent = Math.round(d.main.temp) + (units==='metric'?'°C':'°F');
  desc.textContent = d.weather?.[0]?.description ?? '—';
  feels.textContent = Math.round(d.main.feels_like) + (units==='metric'?'°C':'°F');
  hum.textContent = d.main.humidity + '%';
  wind.textContent = d.wind.speed + (units==='metric'?' m/s':' mph');
  press.textContent = d.main.pressure + ' hPa';
}

function showMessage(t){ msg.textContent = t; }
