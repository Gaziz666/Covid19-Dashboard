import L from 'leaflet';
import EventEmitter from '../eventEmitter';
import { MAP_SETTINGS } from '../utils/constants';

import '../../css/map.css';

export default class SelectView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;
    this.countryDataArr = this.model.countryDataArr;

    this.elements.map.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-countrycode')) {
        this.emit('chooseCountry', e.target.dataset.countrycode);
      }
    });
  }

  show() {
    this.rebuildMap();
  }

  rebuildMap() {
    const { map: mapContainer } = this.elements;
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
        let casesString;
        const { Country, Date } = properties;

        casesString = this.model.returnCasesWithCheckCheckboxes(
          properties,
          'confirmed'
        );
        if (casesString.length > MAP_SETTINGS.MIN_LENGTH) {
          casesString = `${casesString.slice(0, -3)}k+`;
        }

        const html = `
          <span class="icon-marker" data-countryCode=${
            properties.CountryInfo.iso2
          }>
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

  // it's repeat from app.view, how can i chang it?
  returnCasesWithCheckCheckboxes(countryObj, type) {
    let cases = '';
    const vewType = {
      confirmed: {
        Total: 'TotalConfirmed',
        New: 'NewConfirmed',
        Population: 'Population',
      },
      deaths: {
        Total: 'TotalDeaths',
        New: 'NewDeaths',
        Population: 'Population',
      },
      recovered: {
        Total: 'TotalRecovered',
        New: 'NewRecovered',
        Population: 'Population',
      },
    };
    if (!this.model.checkboxForPopulationIsChecked) {
      cases = this.model.checkboxCasesIsChecked
        ? countryObj[vewType[type].New]
        : countryObj[vewType[type].Total];
    } else {
      const populationFor100000 = 100000;
      const casesTodayPerHundred =
        Math.ceil(
          (countryObj[vewType[type].New] / countryObj.Population) *
            populationFor100000 *
            100
        ) / 100;
      const casesTotalPerOneMillion =
        Math.ceil(
          (countryObj[vewType[type].Total] / countryObj.Population) *
            populationFor100000 *
            100
        ) / 100;
      cases = this.model.checkboxCasesIsChecked
        ? casesTodayPerHundred
        : casesTotalPerOneMillion;
    }
    return cases.toLocaleString();
  }
}
