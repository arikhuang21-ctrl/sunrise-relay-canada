const cities = [
  {
    name: 'Vancouver', province: 'British Columbia', lat: 49.2827, lon: -123.1207,
    photo: 'assets/vancouver.jpg',
    photoWidth: 1200, photoHeight: 800,
    photoAlt: 'Vancouver skyline and harbour in the early morning', photographer: 'Matt Drenth',
    photoPage: 'https://unsplash.com/photos/a-large-body-of-water-with-a-city-in-the-background-sASTuKKb1b4'
  },
  {
    name: 'Calgary', province: 'Alberta', lat: 51.0447, lon: -114.0719,
    photo: 'assets/calgary.jpg',
    photoWidth: 1000, photoHeight: 750,
    photoAlt: 'Calgary downtown and Bow River at sunrise', photographer: 'Kristy Dixon',
    photoPage: 'https://unsplash.com/photos/city-skyline-under-cloudy-sky-during-daytime-jsLL1to-jmU'
  },
  {
    name: 'Toronto', province: 'Ontario', lat: 43.6532, lon: -79.3832,
    photo: 'assets/toronto.jpg',
    photoWidth: 1000, photoHeight: 1250,
    photoAlt: 'Toronto city skyline in soft morning light', photographer: 'Venrick Azcueta',
    photoPage: 'https://unsplash.com/photos/a-city-skyline-with-a-river-UWVUSr5mjLQ'
  },
  {
    name: 'Ottawa', province: 'Ontario', lat: 45.4215, lon: -75.6972,
    photo: 'assets/ottawa.jpg',
    photoWidth: 1000, photoHeight: 667,
    photoAlt: 'Parliament Hill silhouetted against an Ottawa sunrise', photographer: 'Robbie Palmer',
    photoPage: 'https://unsplash.com/es/fotos/silueta-de-casas-y-torre-cerca-del-rio-durante-la-salida-del-sol-Gf3bWrqiIGQ'
  },
  {
    name: 'Montreal', province: 'Quebec', lat: 45.5019, lon: -73.5673,
    photo: 'assets/montreal.jpg',
    photoWidth: 1000, photoHeight: 400,
    photoAlt: 'Montreal skyline viewed from Mount Royal', photographer: 'Matthias Mullie',
    photoPage: 'https://unsplash.com/photos/wide-angle-photography-of-buildings-during-daytime-VAxCHgJvZ0g'
  }
];

const weatherDescriptions = {
  0: ['Clear sky', 'clear'], 1: ['Mostly clear', 'clear'], 2: ['Partly cloudy', 'cloud'], 3: ['Overcast', 'cloud'],
  45: ['Fog', 'fog'], 48: ['Freezing fog', 'fog'], 51: ['Light drizzle', 'rain'], 53: ['Drizzle', 'rain'], 55: ['Heavy drizzle', 'rain'],
  56: ['Freezing drizzle', 'snow'], 57: ['Freezing drizzle', 'snow'], 61: ['Light rain', 'rain'], 63: ['Rain', 'rain'], 65: ['Heavy rain', 'rain'],
  66: ['Freezing rain', 'snow'], 67: ['Heavy freezing rain', 'snow'], 71: ['Light snow', 'snow'], 73: ['Snow', 'snow'], 75: ['Heavy snow', 'snow'],
  77: ['Snow grains', 'snow'], 80: ['Rain showers', 'rain'], 81: ['Showers', 'rain'], 82: ['Heavy showers', 'rain'],
  85: ['Snow showers', 'snow'], 86: ['Heavy snow showers', 'snow'], 95: ['Thunderstorm', 'storm'], 96: ['Thunderstorm with hail', 'storm'],
  99: ['Severe thunderstorm with hail', 'storm']
};

const validFilters = ['all', 'fog', 'snow', 'storm', 'clear'];
const galleryPhotos = [
  { cityIndex: 0, label: 'Vancouver · harbour light' },
  { cityIndex: 1, label: 'Calgary · river and skyline' },
  { cityIndex: 2, label: 'Toronto · morning skyline' },
  { cityIndex: 3, label: 'Ottawa · first light' },
  { cityIndex: 4, label: 'Montreal · view from Mount Royal' },
  { cityIndex: 2, label: 'Toronto · a sea of fog', photo: 'assets/toronto-fog.jpg', photoAlt: 'Toronto buildings rising above a blanket of fog', photographer: 'Dillon Kydd', photoPage: 'https://unsplash.com/photos/a-city-in-the-fog-with-skyscrapers-in-the-background-PXouShu8KYM' }
];
const state = {
  locations: [],
  selectedIndex: 0,
  unit: 'C',
  filter: 'all',
  forecastStatus: 'loading',
  errorMessage: ''
};

const cityGrid = document.querySelector('#cityGrid');
const statusText = document.querySelector('#statusText');
const refreshButton = document.querySelector('#refreshButton');
const weatherGallery = document.querySelector('#weatherGallery');

function conditionFor(code) {
  if (weatherDescriptions[code]) {
    return weatherDescriptions[code];
  }
  return ['Conditions changing', 'cloud'];
}

function matchesFilter(location) {
  if (state.filter === 'all') {
    return true;
  }
  const condition = conditionFor(location.current.weather_code);
  return condition[1] === state.filter;
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function createCityCard(index) {
  const city = cities[index];
  let location = null;
  if (index < state.locations.length) {
    location = state.locations[index];
  }

  const article = makeElement('article', 'city-item');
  const button = makeElement('button', 'city-card');
  button.type = 'button';
  button.setAttribute('aria-pressed', String(index === state.selectedIndex));

  const image = makeElement('img', 'city-photo');
  image.src = city.photo;
  image.alt = city.photoAlt;
  image.width = city.photoWidth;
  image.height = city.photoHeight;
  image.loading = 'lazy';
  image.decoding = 'async';

  let condition = '';
  if (location) {
    const result = conditionFor(location.current.weather_code);
    condition = result[0];
    image.className = 'city-photo';
    button.setAttribute('aria-label', city.name + ': ' + condition + ', ' + temperature(location.current.temperature_2m) + '. Select to see details.');
  } else {
    button.setAttribute('aria-label', city.name + ': forecast not available yet. Select city.');
  }

  const top = makeElement('span', 'city-card-top');
  const nameWrap = makeElement('span', '');
  nameWrap.appendChild(makeElement('span', 'city-name', city.name));
  nameWrap.appendChild(makeElement('span', 'city-province', city.province));
  const tagText = location ? condition : (state.forecastStatus === 'error' ? 'Forecast unavailable' : 'Forecast loading');
  const tag = makeElement('span', 'weather-tag', tagText);
  top.appendChild(nameWrap);
  top.appendChild(tag);
  button.appendChild(image);
  button.appendChild(top);

  if (location) {
    const current = location.current;
    const daily = location.daily;
    const bottom = makeElement('span', 'city-card-bottom');
    const reading = makeElement('span', 'city-reading');
    reading.appendChild(makeElement('span', 'city-temp', temperature(current.temperature_2m)));
    reading.appendChild(makeElement('span', 'city-clock', timeLabel(current.time)));

    const sunline = makeElement('span', 'city-sunline');
    const sunMarker = makeElement('span', 'city-sun-marker');
    sunMarker.style.left = daylightPosition(location) + '%';
    sunline.appendChild(sunMarker);
    const sunmeta = makeElement('span', 'city-sun-meta');
    sunmeta.appendChild(makeElement('span', '', '↑ ' + timeLabel(daily.sunrise[0])));
    sunmeta.appendChild(makeElement('span', '', '↓ ' + timeLabel(daily.sunset[0])));
    bottom.appendChild(reading);
    bottom.appendChild(sunline);
    bottom.appendChild(sunmeta);
    button.appendChild(bottom);
  }

  button.addEventListener('click', function () {
    state.selectedIndex = index;
    renderCities();
    if (state.locations.length > 0) {
      renderDetail();
    } else {
      renderFallbackDetail();
    }
  });

  const credit = makeElement('span', 'photo-credit');
  const creditLink = makeElement('a', '', 'Photo: ' + city.photographer + ' / Unsplash');
  creditLink.href = city.photoPage;
  creditLink.target = '_blank';
  creditLink.rel = 'noreferrer';
  credit.appendChild(creditLink);
  article.appendChild(button);
  article.appendChild(credit);
  return article;
}

function renderWeatherGallery() {
  weatherGallery.innerHTML = '';
  let index;
  for (index = 0; index < galleryPhotos.length; index += 1) {
    const photo = galleryPhotos[index];
    const city = cities[photo.cityIndex];
    const imagePath = photo.photo || city.photo;
    const imageAlt = photo.photoAlt || city.photoAlt;
    const photographer = photo.photographer || city.photographer;
    const photoPage = photo.photoPage || city.photoPage;
    const card = makeElement('article', 'gallery-card');
    const imageWrap = makeElement('div', 'gallery-image-wrap');
    const imageButton = makeElement('button', 'gallery-image-button');
    imageButton.type = 'button';
    imageButton.setAttribute('aria-label', 'View larger: ' + photo.label);
    const image = makeElement('img', 'gallery-image');
    image.src = imagePath;
    image.alt = imageAlt;
    image.loading = 'lazy';
    image.decoding = 'async';
    imageButton.appendChild(image);
    imageButton.addEventListener('click', function () {
      showLightbox(imagePath, imageAlt, photo.label + ' · Photo by ' + photographer + ' / Unsplash');
    });
    imageButton.addEventListener('dblclick', function () {
      showLightbox(imagePath, imageAlt, photo.label + ' · Photo by ' + photographer + ' / Unsplash');
    });
    imageWrap.appendChild(imageButton);
    const zoomButton = makeElement('button', 'gallery-zoom', 'View larger');
    zoomButton.type = 'button';
    zoomButton.setAttribute('aria-label', 'View ' + photo.label + ' larger');
    zoomButton.addEventListener('click', function () {
      showLightbox(imagePath, imageAlt, photo.label + ' · Photo by ' + photographer + ' / Unsplash');
    });
    imageWrap.appendChild(zoomButton);
    const caption = makeElement('div', 'gallery-caption');
    const badge = makeElement('span', 'gallery-live-badge', state.forecastStatus === 'loading' ? 'Forecast loading' : 'Forecast unavailable');
    badge.setAttribute('data-gallery-city', String(photo.cityIndex));
    caption.appendChild(makeElement('h3', '', photo.label));
    caption.appendChild(makeElement('span', 'gallery-location', city.province));
    caption.appendChild(badge);
    const credit = makeElement('a', 'gallery-credit', 'Photo by ' + photographer + ' · Unsplash');
    credit.href = photoPage;
    credit.target = '_blank';
    credit.rel = 'noreferrer';
    card.appendChild(imageWrap);
    card.appendChild(caption);
    card.appendChild(credit);
    weatherGallery.appendChild(card);
  }
  updateGalleryWeather();
}

function updateGalleryWeather() {
  const badges = document.querySelectorAll('[data-gallery-city]');
  let index;
  for (index = 0; index < badges.length; index += 1) {
    const cityIndex = Number(badges[index].getAttribute('data-gallery-city'));
    if (cityIndex < state.locations.length) {
      badges[index].textContent = 'Now · ' + conditionFor(state.locations[cityIndex].current.weather_code)[0];
    } else if (state.forecastStatus === 'loading') {
      badges[index].textContent = 'Forecast loading';
    } else {
      badges[index].textContent = 'Forecast unavailable';
    }
  }
}

function moveGallery(direction) {
  const amount = Math.max(260, weatherGallery.clientWidth * 0.78);
  weatherGallery.scrollLeft += direction * amount;
}

function showLightbox(source, alt, caption) {
  const overlay = document.querySelector('#lightboxOverlay');
  document.querySelector('#lightboxImage').src = source;
  document.querySelector('#lightboxImage').alt = alt;
  document.querySelector('#lightboxCaption').textContent = caption;
  overlay.hidden = false;
  document.querySelector('#closeLightbox').focus();
}

function hideLightbox() {
  document.querySelector('#lightboxOverlay').hidden = true;
}

function hideIntro() {
  document.querySelector('#introOverlay').hidden = true;
}

function renderCities() {
  cityGrid.innerHTML = '';
  let visibleCount = 0;
  let index;

  if (state.locations.length > 0) {
    let firstVisible = -1;
    let selectedVisible = false;
    for (index = 0; index < state.locations.length; index += 1) {
      if (matchesFilter(state.locations[index])) {
        if (firstVisible === -1) {
          firstVisible = index;
        }
        if (index === state.selectedIndex) {
          selectedVisible = true;
        }
      }
    }
    if (!selectedVisible && firstVisible !== -1) {
      state.selectedIndex = firstVisible;
    }
  }

  for (index = 0; index < cities.length; index += 1) {
    const location = index < state.locations.length ? state.locations[index] : null;
    if (location && !matchesFilter(location)) {
      continue;
    }
    cityGrid.appendChild(createCityCard(index));
    visibleCount += 1;
  }

  if (state.locations.length === 0) {
    if (state.forecastStatus === 'error') {
      document.querySelector('#filterNote').textContent = 'Forecast filters unavailable.';
    } else {
      document.querySelector('#filterNote').textContent = 'Loading forecast…';
    }
    return;
  }

  if (visibleCount === 0) {
    const empty = makeElement('p', 'forecast-error filter-empty');
    empty.appendChild(document.createTextNode('No city matches ' + state.filter + ' in this forecast. '));
    const reset = makeElement('button', 'inline-reset', 'Show All Cities');
    reset.type = 'button';
    reset.addEventListener('click', function () {
      setFilter('all');
    });
    empty.appendChild(reset);
    cityGrid.appendChild(empty);
  }

  let label = 'All Cities';
  const filterButtons = document.querySelectorAll('.filter-button');
  for (index = 0; index < filterButtons.length; index += 1) {
    if (filterButtons[index].getAttribute('data-filter') === state.filter) {
      label = filterButtons[index].textContent;
    }
  }
  document.querySelector('#filterNote').textContent = visibleCount + ' ' + (visibleCount === 1 ? 'city' : 'cities') + (state.filter === 'all' ? '' : ' · ' + label);
}

function renderFallbackDetail() {
  const city = cities[state.selectedIndex];
  const failed = state.forecastStatus === 'error';
  document.querySelector('#detailCity').textContent = city.name;
  document.querySelector('#conditionLabel').textContent = failed ? 'Connection needed' : 'Connecting…';
  document.querySelector('#temperatureValue').textContent = '';
  document.querySelector('#weatherIcon').textContent = '';
  document.querySelector('#weatherSummary').textContent = failed ? '' : 'Loading forecast…';
  document.querySelector('#highLow').textContent = '—';
  document.querySelector('#windValue').textContent = '—';
  document.querySelector('#snowValue').textContent = '—';
  document.querySelector('#precipValue').textContent = '—';
  document.querySelector('#sunriseValue').textContent = '—';
  document.querySelector('#sunsetValue').textContent = '—';
  document.querySelector('#daylightLength').textContent = '— hours';
  setDaylightMarker(0, 'Daylight curve appears after weather data connects.');
  document.querySelector('#sunState').textContent = failed ? 'Connect to show local time' : 'Loading…';
}

function timeLabel(value) {
  if (!value) {
    return '—';
  }
  let time = value;
  if (value.indexOf('T') !== -1) {
    time = value.split('T')[1];
  }
  time = time.slice(0, 5);
  const parts = time.split(':');
  const hour = Number(parts[0]);
  const minute = parts[1];
  if (isNaN(hour)) {
    return time;
  }
  const displayHour = hour % 12 || 12;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return displayHour + ':' + minute + ' ' + suffix;
}

function minutesOf(value) {
  if (!value) {
    return NaN;
  }
  let time = value;
  if (value.indexOf('T') !== -1) {
    time = value.split('T')[1];
  }
  const parts = time.slice(0, 5).split(':');
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);
  return hour * 60 + minute;
}

function daylightPosition(location) {
  const sunrise = minutesOf(location.daily.sunrise[0]);
  const sunset = minutesOf(location.daily.sunset[0]);
  const now = minutesOf(location.current.time);
  if (isNaN(sunrise) || isNaN(sunset) || isNaN(now) || sunset <= sunrise) {
    return 0;
  }
  let position = ((now - sunrise) / (sunset - sunrise)) * 100;
  if (position < 0) {
    position = 0;
  }
  if (position > 100) {
    position = 100;
  }
  return position;
}

function setDaylightMarker(percent, description) {
  let progress = percent / 100;
  if (progress < 0) {
    progress = 0;
  }
  if (progress > 1) {
    progress = 1;
  }
  const x = 25 + 350 * progress;
  const y = 150 - 450 * progress * (1 - progress);
  const marker = document.querySelector('#sunPosition');
  marker.setAttribute('cx', x);
  marker.setAttribute('cy', y);
  document.querySelector('#daylightCurve').setAttribute('aria-label', description);
}

function temperature(value) {
  let converted = value;
  if (state.unit === 'F') {
    converted = (value * 9) / 5 + 32;
  }
  return Math.round(converted) + '°';
}

function daylightLength(sunrise, sunset) {
  const difference = minutesOf(sunset) - minutesOf(sunrise);
  if (isNaN(difference) || difference <= 0) {
    return '— hours';
  }
  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;
  let minuteText = String(minutes);
  if (minutes < 10) {
    minuteText = '0' + minuteText;
  }
  return hours + 'h ' + minuteText + 'm daylight';
}

function renderDetail() {
  const location = state.locations[state.selectedIndex];
  if (!location) {
    return;
  }
  const city = cities[state.selectedIndex];
  const current = location.current;
  const daily = location.daily;
  const condition = conditionFor(current.weather_code)[0];
  const position = daylightPosition(location);
  document.querySelector('#detailCity').textContent = city.name;
  document.querySelector('#conditionLabel').textContent = condition;
  document.querySelector('#conditionLabel').className = 'condition-label';
  document.querySelector('#temperatureValue').textContent = temperature(current.temperature_2m);
  document.querySelector('#weatherIcon').textContent = current.is_day ? '☀ Daylight' : '☾ Night';
  document.querySelector('#weatherSummary').textContent = current.is_day
    ? 'Daylight in ' + city.province + '.'
    : 'After sunset in ' + city.province + '.';
  document.querySelector('#highLow').textContent = temperature(daily.temperature_2m_max[0]) + ' / ' + temperature(daily.temperature_2m_min[0]);
  document.querySelector('#windValue').textContent = Math.round(current.wind_speed_10m) + ' km/h';
  document.querySelector('#snowValue').textContent = Number(daily.snowfall_sum[0]).toFixed(1) + ' cm';
  document.querySelector('#precipValue').textContent = Math.round(daily.precipitation_probability_max[0]) + '%';
  document.querySelector('#sunriseValue').textContent = timeLabel(daily.sunrise[0]);
  document.querySelector('#sunsetValue').textContent = timeLabel(daily.sunset[0]);
  document.querySelector('#daylightLength').textContent = daylightLength(daily.sunrise[0], daily.sunset[0]);
  const localTime = timeLabel(current.time);
  setDaylightMarker(position, city.name + ' daylight: sunrise ' + timeLabel(daily.sunrise[0]) + ', current local time ' + localTime + ', sunset ' + timeLabel(daily.sunset[0]) + '.');
  let timeStatus = 'Now';
  if (!current.is_day && position === 0) {
    timeStatus = 'Before sunrise';
  } else if (!current.is_day) {
    timeStatus = 'After sunset';
  }
  document.querySelector('#sunState').textContent = timeStatus + ' · ' + localTime;
}

function updateUnits(unit) {
  state.unit = unit;
  const buttons = document.querySelectorAll('.unit-button');
  let i;
  for (i = 0; i < buttons.length; i += 1) {
    const active = buttons[i].getAttribute('data-unit') === unit;
    if (active) {
      buttons[i].classList.add('active');
    } else {
      buttons[i].classList.remove('active');
    }
    buttons[i].setAttribute('aria-pressed', String(active));
  }
  if (state.locations.length > 0) {
    renderCities();
    renderDetail();
  }
}

function setFilter(filter) {
  let valid = false;
  let i;
  for (i = 0; i < validFilters.length; i += 1) {
    if (validFilters[i] === filter) {
      valid = true;
    }
  }
  if (!valid) {
    return;
  }
  state.filter = filter;
  const buttons = document.querySelectorAll('.filter-button');
  for (i = 0; i < buttons.length; i += 1) {
    const active = buttons[i].getAttribute('data-filter') === filter;
    if (active) {
      buttons[i].classList.add('active');
    } else {
      buttons[i].classList.remove('active');
    }
    buttons[i].setAttribute('aria-pressed', String(active));
  }
  renderCities();
}

function showError(message) {
  state.forecastStatus = 'error';
  const localFile = window.location.protocol === 'file:';
  if (localFile) {
    state.errorMessage = 'This page was opened as a local file, so the browser blocks its weather request. Open the published site or use VS Code Live Server, then choose Refresh Forecast.';
    statusText.textContent = 'Weather needs a web page address.';
  } else {
    state.errorMessage = 'The weather API could not be reached (' + message + '). Check the internet connection and choose Refresh Forecast to try again.';
    statusText.textContent = 'Could not connect to the weather API.';
  }
  if (state.locations.length === 0) {
    renderCities();
    renderFallbackDetail();
    document.querySelector('#connectionHelp').hidden = false;
    document.querySelector('#connectionHelp').textContent = state.errorMessage;
    updateGalleryWeather();
  }
}

async function loadWeather() {
  state.forecastStatus = 'loading';
  refreshButton.disabled = true;
  refreshButton.textContent = 'Loading Weather…';
  cityGrid.setAttribute('aria-busy', 'true');
  document.querySelector('#connectionHelp').hidden = true;
  statusText.textContent = 'Updating forecasts…';

  let latitude = '';
  let longitude = '';
  let i;
  for (i = 0; i < cities.length; i += 1) {
    if (i > 0) {
      latitude += ',';
      longitude += ',';
    }
    latitude += cities[i].lat;
    longitude += cities[i].lon;
  }
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + latitude
    + '&longitude=' + longitude
    + '&current=temperature_2m,weather_code,wind_speed_10m,snowfall,is_day'
    + '&daily=weather_code,sunrise,sunset,snowfall_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min'
    + '&timezone=auto&forecast_days=1';

  try {
    if (window.location.protocol === 'file:') {
      throw new Error('Local file preview');
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Forecast request failed (' + response.status + ').');
    }
    const result = await response.json();
    if (!result || typeof result.length === 'undefined' || result.length !== cities.length) {
      throw new Error('The API did not return all five city forecasts.');
    }
    const places = result;
    state.locations = places;
    state.forecastStatus = 'loaded';
    state.errorMessage = '';
    if (state.selectedIndex >= places.length) {
      state.selectedIndex = 0;
    }
    renderCities();
    renderDetail();
    updateGalleryWeather();
    const date = places[0].daily.time[0];
    const dateParts = date.split('-');
    document.querySelector('#dateLabel').textContent = dateParts[1] + '/' + dateParts[2] + '/' + dateParts[0];
    statusText.textContent = 'Forecast updated.';
    document.querySelector('#filterNote').textContent = '';
  } catch (error) {
    showError(error.message);
  } finally {
    cityGrid.setAttribute('aria-busy', 'false');
    refreshButton.disabled = false;
    refreshButton.textContent = 'Refresh Forecast';
  }
}

const unitButtons = document.querySelectorAll('.unit-button');
let buttonIndex;
for (buttonIndex = 0; buttonIndex < unitButtons.length; buttonIndex += 1) {
  unitButtons[buttonIndex].addEventListener('click', function () {
    updateUnits(this.getAttribute('data-unit'));
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
for (buttonIndex = 0; buttonIndex < filterButtons.length; buttonIndex += 1) {
  if (filterButtons[buttonIndex].getAttribute('data-filter') === state.filter) {
    filterButtons[buttonIndex].classList.add('active');
    filterButtons[buttonIndex].setAttribute('aria-pressed', 'true');
  }
  filterButtons[buttonIndex].addEventListener('click', function () {
    setFilter(this.getAttribute('data-filter'));
  });
}

refreshButton.addEventListener('click', loadWeather);
document.querySelector('#galleryPrev').addEventListener('click', function () {
  moveGallery(-1);
});
document.querySelector('#galleryNext').addEventListener('click', function () {
  moveGallery(1);
});
document.querySelector('#closeIntro').addEventListener('click', hideIntro);
document.querySelector('#startExploring').addEventListener('click', hideIntro);
document.querySelector('#introOverlay').addEventListener('click', function (event) {
  if (event.target === this) {
    hideIntro();
  }
});
document.querySelector('#closeLightbox').addEventListener('click', hideLightbox);
document.querySelector('#lightboxOverlay').addEventListener('click', function (event) {
  if (event.target === this) {
    hideLightbox();
  }
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    hideLightbox();
    hideIntro();
  }
});
weatherGallery.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') {
    moveGallery(1);
  } else if (event.key === 'ArrowLeft') {
    moveGallery(-1);
  }
});
renderCities();
renderWeatherGallery();
renderFallbackDetail();
loadWeather();
