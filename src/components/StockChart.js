import React, { Component } from 'react';
import ChartJS from 'chart.js';
import $ from 'jquery';
import './css/StockChart.css';

class StockChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: 'AAPL',

      /********************/
      // adds myChart to state
      /********************/

      myChart: 'a'
    };

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
  }

  updateChart() {
    this.createChart(this.props.ticker);
    this.setState({ ticker: this.props.ticker });
  }   

  createChart(ticker) {
    $.ajax({
      type: 'GET',
      url: `/api/quandl/${ticker}`,
      success: (result) => {
        result = JSON.parse(result);
        const labels = [];
        const quandlData = [];
        for (let i = 0; i < 5; i++) {
          labels.unshift(result.dataset.data[i][0]);
          quandlData.unshift(result.dataset.data[i][4]);
        }
        const ctx = document.getElementById('stock-chart');

        /***********************/
        // destroy current chart
        /***********************/

        if (this.state.myChart !== 'a') {
          console.log('called');
          this.state.myChart.destroy();
        }

        // get new data
        this.setState({myChart: new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                type: 'bar',
                label: 'Bar Component',
                data: [20, -20, -10, 50, 60],
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
              label: 'stock value',
              data: quandlData,
              // backgroundColor: [
              //   'rgba(255, 99, 132, 0.2)',
              //   'rgba(54, 162, 235, 0.2)',
              //   'rgba(255, 206, 86, 0.2)',
              //   'rgba(75, 192, 192, 0.2)',
              //   'rgba(153, 102, 255, 0.2)',
              //   'rgba(255, 159, 64, 0.2)',
              // ],
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
            // tooltips: {enabled: false},
            // hover: {mode: null},
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false,
                },
              }],
            },
          }
        })
        });
        console.log('Here it is: ', this.state.myChart);
      },
      error: (error) => {
        console.log('ERROR CREATING CHART');
        console.warn('[StockChart.js error] ', error);
      },
    });
  }

  componentDidMount() {
    this.createChart(this.state.ticker);
  }

  render() {
    return (
      <div className="chart-container">
        <h2>{this.state.ticker} Stock Price</h2>
        <canvas className="center" width="200" height="200" id="stock-chart" />
        <p className="center">
          <button className="button" onClick={this.updateChart}>Update chart</button>
        </p>
      </div>
    );
  }
}

export default StockChart;
