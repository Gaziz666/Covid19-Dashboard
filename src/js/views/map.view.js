import L from 'leaflet';
import EventEmitter from '../eventEmitter';
import { MAP_SETTINGS, CASES_TYPES } from '../utils/constants';

import '../../css/map.css';
import create from '../utils/create';

export default class MapView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;
    this.countryDataArr = this.model.countryDataArr;
    this.sizeClassSelector = '';

    this.elements.map.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-countrycode')) {
        this.emit('chooseCountry', e.target.dataset.countrycode);
      }
    });
  }

  show() {
    this.rebuildMap();
    this.rebuildMapLegend();
  }

  setSizeClassSelector(index) {
    this.sizesArray = [
      0,
      `size_${CASES_TYPES.EXTRA_MIN_CASES}`,
      `size_${CASES_TYPES.MIN_CASES}`,
      `size_${CASES_TYPES.MID_CASES}`,
      `size_${CASES_TYPES.EXTRA_MID_CASES}`,
      `size_${CASES_TYPES.MAX_CASES}`,
      `size_${CASES_TYPES.EXTRA_MAX_CASES}`,
      `size_${CASES_TYPES.ULTRA_MAX_CASES}`,
    ];

    return this.sizesArray[index];
  }

  rebuildMap() {
    if (this.elements.map.childNodes.length !== 0) {
      this.elements.map.firstChild.remove();
    }

    const div = create('div', { className: 'map-container' });
    this.elements.map.append(div);
    const mapContainer = this.elements.map.firstChild;
    const myMap = L.map(mapContainer).setView(
      MAP_SETTINGS.COORDINATES,
      MAP_SETTINGS.ZOOM_LVL
    );

    L.tileLayer(MAP_SETTINGS.MAP_URL_TEMPLATE, {
      attribution: MAP_SETTINGS.ATTRIBUTION,
      subdomains: MAP_SETTINGS.SUBDOMAINS,
      maxZoom: MAP_SETTINGS.MAX_ZOOM,
    }).addTo(myMap);

    const hasData =
      Array.isArray(this.countryDataArr) && this.countryDataArr.length > 0;

    if (!hasData) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: this.countryDataArr.map((country = {}) => {
        const { CountryInfo = {} } = country;
        const { lat, long } = CountryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [long, lat],
          },
        };
      }),
    };

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latLong) => {
        const { properties = {} } = feature;
        const { Country, Date } = properties;
        let casesString = this.model.returnCasesWithCheckCheckboxes(
          properties,
          'confirmed'
        );

        const casesNumber = Number(casesString.split(',').join(''));

        this.sizeClassSelector = this.setSizeClassSelector(
          Math.trunc(casesNumber).toString().length
        );

        const thousandForRemoveDecimal = 1000;
        if (casesNumber > CASES_TYPES.MID_CASES) {
          casesString = `${(casesNumber * thousandForRemoveDecimal)
            .toLocaleString('en-En')
            .slice(0, -8)}k+`;
        }

        const html = `
          <span class="icon-marker ${
            this.sizeClassSelector
          }" data-countryCode=${properties.CountryInfo.iso2}>
            <span class="icon-marker-tooltip">
              <h2>${Country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${this.model.returnCasesWithCheckCheckboxes(
                  properties,
                  'confirmed'
                )}</li>
                <li><strong>Deaths:</strong> ${this.model.returnCasesWithCheckCheckboxes(
                  properties,
                  'deaths'
                )}</li>
                <li><strong>Recovered:</strong> ${this.model.returnCasesWithCheckCheckboxes(
                  properties,
                  'recovered'
                )}</li>
                <li><strong>Last Update:</strong> ${Date}</li>
              </ul>
            </span>
            ${casesString}
          </span>
        `;
        return L.marker(latLong, {
          icon: L.divIcon({
            className: 'icon',
            html,
          }),
          riseOnHover: true,
        });
      },
    });

    geoJsonLayers.addTo(myMap);
  }

  rebuildMapLegend() {
    const mapLegend = create('ul', { className: 'map__legend' });
    const fragment = new DocumentFragment();

    const legendTitle = create('h3', {
      className: 'legend__title',
      child: 'Cases less than:',
    });

    Object.entries(CASES_TYPES).forEach((element) => {
      const key = element[0];
      const value = element[1].toLocaleString('en-En');
      const typeLowerCase = key.toLowerCase();

      const legendText = create('span', {
        className: 'legend__text',
        child: ` < ${value}`,
      });
      const legendColor = create('div', {
        className: `legend__color legend__color_${typeLowerCase}`,
      });

      const legendItem = create('li', {
        className: 'legend__item',
        child: [legendColor, legendText],
      });
      fragment.append(legendItem);
    });

    fragment.prepend(legendTitle);
    mapLegend.append(fragment);
    this.elements.map.append(mapLegend);
  }
}
