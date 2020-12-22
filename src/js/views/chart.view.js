import '../../css/chart.css';

import Chart from 'chart.js';
import create from '../utils/create';
import EventEmitter from '../eventEmitter';
import CheckboxView from './checkbox.view';
import { URL } from '../utils/constants';

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
          URL.COUNTRY_HISTORY + this.model.selectedCountryName + URL.PERIOD
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
            data: Object.values(cases),
            backgroundColor: 'rgba(255, 172, 0, 0.2)',
            borderColor: 'rgba(255, 172, 0, 1)',
            borderWidth: 1,
          },
          {
            label: 'Death',
            data: Object.values(deaths),
            backgroundColor: 'rgba(201, 10, 14, 0.2)',
            borderColor: 'rgba(201, 10, 14, 1)',
            borderWidth: 1,
          },
          {
            label: 'Recovered',
            data: Object.values(recovered),
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
    checkbox.inputCases.onchange = (e) => {
      this.emit('changeCases', e.target);
    };
    checkbox.inputPerHundred.onchange = (e) => {
      this.emit('changeForPopulations', e.target);
    };
    this.elements.chartContainer.append(checkBoxContainer);
  }

  checkCheckbox() {
    let { cases, deaths, recovered } = this.allDate;
    const population = Number(this.model.selectedCountryPopulation);
    if (this.model.selectedCountryName) {
      cases = this.model.countryHistoryCases.timeline.cases;
      deaths = this.model.countryHistoryCases.timeline.deaths;
      recovered = this.model.countryHistoryCases.timeline.recovered;
    }

    const labelsArr = Object.keys(cases);
    let casesData = Object.values(cases);
    let deathsData = Object.values(deaths);
    let recoveredData = Object.values(recovered);
    if (this.model.checkboxPerDayCasesIsChecked) {
      casesData = casesData.map((item, i, arr) => item - arr[i - 1]);
      deathsData = deathsData.map((item, i, arr) => item - arr[i - 1]);
      recoveredData = recoveredData.map((item, i, arr) => item - arr[i - 1]);
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
}
