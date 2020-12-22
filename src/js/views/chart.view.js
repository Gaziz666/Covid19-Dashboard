import '../../css/chart.css';

import Chart from 'chart.js';
import create from '../utils/create';
import EventEmitter from '../eventEmitter';

export default class ChartView extends EventEmitter {
  constructor(model, elements) {
    super();
    this.model = model;
    this.elements = elements;
    this.chartContainer = elements.chart;
    this.allDate = this.model.allDate;
  }

  show() {
    this.rebuildChart();
  }

  rebuildChart() {
    const chart = create('canvas', {
      className: 'chart-inner',
      child: null,
      parent: this.chartContainer,
    });

    const { cases, deaths, recovered } = this.allDate;

    const ctx = chart.getContext('2d');
    // eslint-disable-next-line no-unused-vars
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(cases),
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
  }
}
