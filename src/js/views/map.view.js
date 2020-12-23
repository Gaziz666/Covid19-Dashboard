import L from 'leaflet';
import EventEmitter from '../eventEmitter';
import { MAP_SETTINGS, CASES_TYPES, CASES } from '../utils/constants';
import CheckboxView from './checkbox.view';
import CasesTypeBtnView from './casesTypeBtn.view';
import ResizeBtnView from './resizeBtn.view';
import ResizeController from '../controller/resizeBtn.controller';
import CheckboxController from '../controller/checkbox.controller';
import CasesBtnController from '../controller/casesBtn.controller';

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
      if (e.target.hasAttribute('data-country_name')) {
        this.emit(
          'chooseCountry',
          e.target.dataset.country_name,
          e.target.dataset.country_index
        );
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
      `size_${CASES_TYPES.EXTRA_ULTRA_CASES}`,
    ];

    return this.sizesArray[index];
  }

  rebuildMap() {
    if (this.elements.map.childNodes.length !== 0) {
      let i = this.elements.map.childNodes.length - 1;
      while (i > -1) {
        this.elements.map.childNodes[i].remove();
        i -= 1;
      }
    }

    const mapBounds = new L.LatLngBounds([-90, -180], [90, 180]);

    const div = create('div', { className: 'map-container' });
    this.elements.map.prepend(div);
    const mapContainer = this.elements.map.firstChild;
    const myMap = L.map(mapContainer)
      .setView(MAP_SETTINGS.COORDINATES, MAP_SETTINGS.ZOOM_LVL)
      .setMaxBounds(mapBounds);

    L.tileLayer(MAP_SETTINGS.MAP_URL_TEMPLATE, {
      attribution: MAP_SETTINGS.ATTRIBUTION,
      subdomains: MAP_SETTINGS.SUBDOMAINS,
      maxZoom: MAP_SETTINGS.MAX_ZOOM,
      bounds: mapBounds,
      noWrap: true,
    }).addTo(myMap);

    const hasData =
      Array.isArray(this.countryDataArr) && this.countryDataArr.length > 0;

    if (!hasData) return;

    const geoJson = {
      type: 'FeatureCollection',
      features: this.countryDataArr.map((country = {}, index) => {
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
          index,
        };
      }),
    };

    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latLong) => {
        const { properties = {} } = feature;
        const { Country, Date, Slug } = properties;
        const { index } = feature;
        let casesString = this.model.returnCasesWithCheckCheckboxes(
          null,
          properties
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
          }" data-country_name="${Slug}" data-country_index="${index}">
            <span class="icon-marker-tooltip">
              <h2>${Country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${this.model.returnCasesWithCheckCheckboxes(
                  CASES[0],
                  properties
                )}</li>
                <li><strong>Deaths:</strong> ${this.model.returnCasesWithCheckCheckboxes(
                  CASES[1],
                  properties
                )}</li>
                <li><strong>Recovered:</strong> ${this.model.returnCasesWithCheckCheckboxes(
                  CASES[2],
                  properties
                )}</li>
                <li><strong>Last Update:</strong> ${Date}</li>
              </ul>
            </span>
            ${this.model.returnCasesWithCheckCheckboxes(null, properties)}
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
    const casesTypeButton = new CasesTypeBtnView(this.model);
    const casesBtnContainer = casesTypeButton.renderButton();
    // eslint-disable-next-line no-unused-vars
    const casesBtnController = new CasesBtnController(
      this.model,
      casesTypeButton
    );

    const checkbox = new CheckboxView(this.model);
    const checkBoxContainer = checkbox.renderCheckbox('forMap');
    // eslint-disable-next-line no-unused-vars
    const checkboxController = new CheckboxController(this.model, checkbox);
    const { bigBtn, smallBtn } = this.renderResizeButton(
      this.elements.map.parentNode
    );

    this.elements.map.append(
      bigBtn,
      smallBtn,
      casesBtnContainer,
      checkBoxContainer
    );
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

      if (!legendColor.classList.contains('legend__color_ultra_max_cases')) {
        fragment.append(legendItem);
      }
    });

    fragment.prepend(legendTitle);
    mapLegend.append(fragment);
    this.elements.map.append(mapLegend);
  }

  renderResizeButton(element) {
    const resizeBlock = new ResizeBtnView(this.model);
    const { bigBtn, smallBtn } = resizeBlock.renderResizeBtn();
    // eslint-disable-next-line no-unused-vars
    const checkboxController = new ResizeController(resizeBlock, element);
    return { bigBtn, smallBtn };
  }
}
