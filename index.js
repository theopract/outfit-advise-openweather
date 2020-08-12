const OPEN_WEATHER_LINK = "https://api.openweathermap.org/data/2.5/onecall";
const ICON_URL = "https://openweathermap.org/img/wn/"; //http://openweathermap.org/img/wn/10d@2x.png
const defaultLAT = 55.589656;
const defaultLON = 37.599262;
let LAT;
let LON;
const EXCLUDE_PARAMS = "minutely,daily";
const APP_ID = "6b64c34fb8db6096311d643a171fd3e1";

const RECOMMENDATIONS_OUTFIT = [
  {
    temp: 3,
    outfit: "куртку/пальто",
  },
  {
    temp: 17,
    outfit: "свитер/кофту",
  },
  {
    temp: 25,
    outfit: "футболка/поло",
  },
  {
    temp: 30,
    outfit: "плавки",
  },
  {
    temp: 120,
    outfit: "голышом",
  },
];

const weatherImagesElems = document.querySelectorAll(".recommendation-block__image");
const weatherDescrElems = document.querySelectorAll(".recommendation-block__description");
const weatherOutfitElems = document.querySelectorAll(".recommendation-block__outfit");

const getPositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function getGeoPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        LAT = pos.coords.latitude;
        LON = pos.coords.longitude;
        resolve({ LAT, LON });
      },
      err => {
        console.warn("Position was not allowed!");
        resolve({ LAT: defaultLAT, LON: defaultLON });
      },
      getPositionOptions
    );
  });
}

function sortIcons(a, b) {
  if (a[1] < b[1]) {
    return 1;
  }
  if (a[1] > b[1]) {
    return -1;
  }
  if ((a[1] = b[1])) {
    if (a[0] < b[0]) {
      return 1;
    }
    if (a[0] > b[0]) {
      return -1;
    }
  }
  return 0;
}

function fetchWeather(coord) {
  const { LAT, LON } = coord;
  fetch(
    OPEN_WEATHER_LINK +
      `?lat=${LAT}&lon=${LON}&exclude=${EXCLUDE_PARAMS}&units=metric&appid=${APP_ID}`
  )
    .then(res => res.json())
    .then(data => {
      const weatherData = parseWeatherData(data);
      UIupdate(weatherData);
    });
}

function UIupdate(data) {
  const weatherIcons = data.map(hour => hour.weather[0].icon);
  const weatherIDs = data.map(hour => hour.weather[0].id);
  const weatherTemps = data.map(hour => hour.temp);

  const mainIconFor2hours = getMostLikelyWeatherIcon(weatherIcons.slice(0, 2));
  const mainIconFor12hours = getMostLikelyWeatherIcon(weatherIcons);

  const shouldTakeUmbrella2h = getUmbrellaStatus(weatherIDs.slice(0, 2));
  const shouldTakeUmbrella12h = getUmbrellaStatus(weatherIDs);

  const averageTemperature2h = getAverageTemerature(weatherTemps.slice(0, 2));
  const averageTemperature12h = getAverageTemerature(weatherTemps);

  weatherImagesElems[0].src = `${ICON_URL}${mainIconFor2hours}@2x.png`;
  weatherImagesElems[1].src = `${ICON_URL}${mainIconFor12hours}@2x.png`;

  weatherDescrElems[0].textContent = `Ожидаем около ${averageTemperature2h} °C, ${
    shouldTakeUmbrella2h === true ? "вероятен дождь" : "осадки не ожидаем"
  } `;
  weatherDescrElems[1].textContent = `Ожидаем около ${averageTemperature2h} °C, ${
    shouldTakeUmbrella12h === true ? "вероятен дождь" : "осадки не ожидаем"
  } `;

  weatherOutfitElems[0].innerHTML = `Рекомендуем ${getRecommendedOutfit(averageTemperature2h)}`;
  weatherOutfitElems[1].innerHTML = `Рекомендуем ${getRecommendedOutfit(averageTemperature12h)}`;
}

function getUmbrellaStatus(idsArr) {
  return idsArr.some(id => id < 599);
}

function getAverageTemerature(tempArr) {
  return Math.round((tempArr.reduce((sum, temp) => (sum += temp), 0) / tempArr.length) * 10) / 10;
}

function getMostLikelyWeatherIcon(iconsArray) {
  let iconMap = new Map();
  iconsArray.forEach(icon => {
    if (iconMap.get(icon) === undefined) {
      iconMap.set(icon, 1);
    } else {
      iconMap.set(icon, iconMap.get(icon) + 1);
    }
  });
  return [...iconMap.entries()].sort(sortIcons)[0][0];
}

function getRecommendedOutfit(averageTemp) {
  return RECOMMENDATIONS_OUTFIT.find(o => o.temp > averageTemp).outfit;
}

function parseWeatherData(data) {
  return data.hourly.slice(0, 12);
}

function handlePermission() {
  if (navigator?.permissions?.query) {
    navigator.permissions.query({ name: "geolocation" }).then(function (result) {
      reportState(result.state);
      tryGeoAccess(result.state);
      result.onchange = function () {
        reportState(result.state);
        console.log("onchange!");
        // tryGeoAccess(result.state);
      };
    });
  } else {
    tryGeoAccess("default");
  }
}

function reportState(state) {
  console.log("Permission " + state);
}

function tryGeoAccess(state) {
  if (state === "granted" || state === "prompt") {
    getGeoPosition().then(pos => fetchWeather(pos));
  } else {
    console.log(defaultLAT, defaultLON);
    fetchWeather({ LAT: defaultLAT, LON: defaultLON });
  }
}

handlePermission();
