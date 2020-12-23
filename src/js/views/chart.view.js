import '../../css/chart.css';

import Chart from 'chart.js';
import create from '../utils/create';
import EventEmitter from '../eventEmitter';
import CheckboxView from './checkbox.view';
import ResizeBtnView from './resizeBtn.view';
import ResizeController from '../controller/resizeBtn.controller';
import { URL } from '../utils/constants';
import CheckboxController from '../controller/checkbox.controller';

export default class ChartView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;
    this.allDate = this.model.allDate;
  }

  show() {
    this.rebuildChart();
  }

  rebuildCharCountry() {
    // eslint-disable-next-line no-unused-vars
    const loadCountryData = new Promise((resolve) => {
      resolve(
        this.model.fetchCountryData(
          URL.COUNTRY_HISTORY + this.model.selectedCountrySlug + URL.PERIOD
        )
      );
    }).then(() => {
      this.rebuildChart();
    });
  }

  rebuildChart() {
    this.elements.chartContainer.innerHTML = '';
    const chart = create('canvas', {
      className: 'chart-inner',
      child: null,
      parent: this.elements.chartContainer,
    });

    const charData = this.checkCheckbox();

    const ctx = chart.getContext('2d');
    // eslint-disable-next-line no-unused-vars
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: charData.labelsArr,
        datasets: [
          {
            label: 'Confirmed cases',
            data: charData.casesData,
            backgroundColor: 'rgba(255, 172, 0, 0.2)',
            borderColor: 'rgba(255, 172, 0, 1)',
            borderWidth: 1,
          },
          {
            label: 'Death',
            data: charData.deathsData,
            backgroundColor: 'rgba(201, 10, 14, 0.2)',
            borderColor: 'rgba(201, 10, 14, 1)',
            borderWidth: 1,
          },
          {
            label: 'Recovered',
            data: charData.recoveredData,
            backgroundColor: 'rgba(75, 231, 0, 0.2)',
            borderColor: 'rgba(75, 231, 0, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        tooltips: {
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    const checkbox = new CheckboxView(this.model);
    const checkBoxContainer = checkbox.renderCheckbox('forChar');
    // eslint-disable-next-line no-unused-vars
    const checkboxController = new CheckboxController(this.model, checkbox);
    const { bigBtn, smallBtn } = this.renderResizeButton(
      this.elements.chartContainer
    );

    this.elements.chartContainer.append(bigBtn, smallBtn, checkBoxContainer);
  }

  checkCheckbox() {
    const { cases, deaths, recovered } = this.allDate;
    let labelsArr = Object.keys(cases);
    let casesData = Object.values(cases);
    let deathsData = Object.values(deaths);
    let recoveredData = Object.values(recovered);
    const population = Number(this.model.selectedCountryPopulation);
    if (this.model.selectedCountrySlug) {
      casesData = this.model.countryHistoryCases.map((item) => item.Confirmed);
      deathsData = this.model.countryHistoryCases.map((item) => item.Deaths);
      recoveredData = this.model.countryHistoryCases.map(
        (item) => item.Recovered
      );
      labelsArr = this.model.countryHistoryCases.map((item) =>
        item.Date.slice(0, 10)
      );
    }

    if (this.model.checkboxPerDayCasesIsChecked) {
      casesData = casesData.map((item, i, arr) => Math.abs(item - arr[i - 1]));
      deathsData = deathsData.map((item, i, arr) =>
        Math.abs(item - arr[i - 1])
      );
      recoveredData = recoveredData.map((item, i, arr) =>
        Math.abs(item - arr[i - 1])
      );
    }
    if (this.model.checkboxFor100ThouthandPopulationIsChecked) {
      const populationFor100000 = 100000;
      casesData = casesData.map(
        (item) =>
          Math.ceil((item / population) * populationFor100000 * 100) / 100
      );
      deathsData = deathsData.map(
        (item) =>
          Math.ceil((item / population) * populationFor100000 * 100) / 100
      );
      recoveredData = recoveredData.map(
        (item) =>
          Math.ceil((item / population) * populationFor100000 * 100) / 100
      );
    }
    return { labelsArr, casesData, deathsData, recoveredData };
  }

  renderResizeButton(element) {
    const resizeBlock = new ResizeBtnView(this.model);
    const { bigBtn, smallBtn } = resizeBlock.renderResizeBtn();
    // eslint-disable-next-line no-unused-vars
    const checkboxController = new ResizeController(resizeBlock, element);
    return { bigBtn, smallBtn };
  }
}
