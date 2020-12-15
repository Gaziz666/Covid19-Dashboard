const URL = {
  SUMMARY: "https://api.covid19api.com/summary",
  COUNTRY: "https://corona.lmao.ninja/v2/countries",
};

const MAP_SETTINGS = {
  COORDINATES: [20, 0],
  ZOOM_LVL: 2,
  MAX_ZOOM: 19,
  ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  SUBDOMAINS: "abcd",
  MAP_URL_TEMPLATE:
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
  MIN_CASES: 1000,
};

export { URL, MAP_SETTINGS };
