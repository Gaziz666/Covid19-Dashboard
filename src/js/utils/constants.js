const today = new Date();
const URL = {
  SUMMARY: 'https://api.covid19api.com/summary',
  COUNTRY_ARR: 'https://corona.lmao.ninja/v2/countries',
  ALL_DAYS: 'https://disease.sh/v3/covid-19/historical/all?lastdays=366',
  ALL_DAYS_GLOBAL: 'https://corona-api.com/timeline',
  COUNTRY_HISTORY: 'https://api.covid19api.com/country/',
  PERIOD: `?from=2020-01-01&to=${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDay()}`,
  ALL_POPULATION: 'https://corona.lmao.ninja/v3/covid-19/all',
};

const MAP_SETTINGS = {
  COORDINATES: [20, 0],
  ZOOM_LVL: 2,
  MAX_ZOOM: 19,
  ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  SUBDOMAINS: 'abcd',
  MAP_URL_TEMPLATE:
    'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',

  MIN_LENGTH: 3,
};

const CASES_TYPES = {
  EXTRA_MIN_CASES: 10,
  MIN_CASES: 100,
  MID_CASES: 1000,
  EXTRA_MID_CASES: 10000,
  MAX_CASES: 100000,
  EXTRA_MAX_CASES: 1000000,
  ULTRA_MAX_CASES: 10000000,
  EXTRA_ULTRA_CASES: 1000000000,
};

const CASES = [
  {
    NEW: 'NewConfirmed',
    TOTAL: 'TotalConfirmed',
  },
  {
    NEW: 'NewDeaths',
    TOTAL: 'TotalDeaths',
  },
  {
    NEW: 'NewRecovered',
    TOTAL: 'TotalRecovered',
  },
];

export { URL, MAP_SETTINGS, CASES_TYPES, CASES };
