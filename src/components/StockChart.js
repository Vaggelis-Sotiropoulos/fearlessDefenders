import React, { Component } from 'react';
import ChartJS from 'chart.js';
import $ from 'jquery';
import './css/StockChart.css';

let myChart = 'a';
class StockChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: '',
    };

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    if (this.props.ticker) {
      this.createChart(this.props.ticker);
    }
  }

  createChart() {
    const ticker = this.props.ticker;

    console.log('** STOCK CHART - createChart: ', ticker);

    $.ajax({
      type: 'GET',
      url: `/api/quandl/${ticker}`,
      success: (result) => {
        if (this.props.data.length !== 0) {
          const json = JSON.parse(result);
          const labels = [];
          const quandlData = [];
          const watsData = [];
          var j = 0;
          console.log('wats data: ', this.props.data);
          for (var i = 0; i < 5; i++) {
            labels.unshift(json.dataset.data[i][0]);
            quandlData.unshift(json.dataset.data[i][4]);
            console.log('j: ', j);
            while(this.props.data[j].date !== json.dataset.data[i][0]) {
              j += 1;
              console.log('wats date: ', this.props.data[j].date);
              console.log('quandl date: ', json.dataset.data[i][0]);
            }
            watsData.unshift((this.props.data[j].score * 100));
            j += 1;
          }
          const ctx = document.getElementById('stock-chart');

          if (myChart !== 'a') {
            console.log('called');
            myChart.destroy();
          }

          myChart = new ChartJS(ctx, {
            type: 'bar',
            data: {
              labels,
              datasets: [
                {
                  type: 'bar',
                  label: 'Watson Score',
                  yAxisID: 'y-axis-0',
                  data: watsData,
                  backgroundColor: [
                    'rgba(0, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                  ],
                  borderColor: [
                    'rgba(0, 0, 0, 1)',
                    'rgba(50, 50, 50, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                },
                {
                  type: 'line',
                  label: 'Stock Price',
                  yAxisID: 'y-axis-1',
                  data: quandlData,
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                  ],
                  borderWidth: 1,
                }],
            },
            options: {
              scales: {
                yAxes: [{
                  position: 'left',
                  id: 'y-axis-0',
                },
                {
                  position: 'right',
                  id: 'y-axis-1',
                }],
              },
            },
          });
        }
      },
      error: (error) => {
        console.log('ERROR CREATING CHART');
        console.warn('[StockChart.js error] ', error);
      },
    });
  }

  render() {
    return (
      <div className="chart-container">
        { (!this.props.ticker) ?
          <h2> Enter a stock to begin </h2> :
          <h2>{this.props.ticker} Stock Price</h2> }
        <canvas className="center" height="300px" id="stock-chart" />
      </div>
    );
  }
}

export default StockChart;
