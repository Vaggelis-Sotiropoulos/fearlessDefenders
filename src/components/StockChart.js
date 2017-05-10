import React, { Component } from 'react';
import ChartJS from 'chart.js';
import $ from 'jquery';
import './css/StockChart.css';

let myChart = 'a';
class StockChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticker: 'none',
    };

    this.createChart = this.createChart.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  updateChart() {
    this.createChart(this.props.ticker);
  }   

  handleClick() {
    this.updateChart();
  }   

  createChart() {
    const ticker = this.props.ticker;
    
    console.log('** STOCK CHART - createChart: ', ticker);
    
    $.ajax({
      type: 'GET',
      url: `/api/quandl/${ticker}`,
      success: (result) => {
        console.log('propsNum: ', this.props.data.length);
        if (this.props.data.length !== undefined) {
          result = JSON.parse(result);
          const labels = [];
          const quandlData = [];
          const watsData = [];
          for (let i = 0; i < 5; i++) {
            labels.unshift(result.dataset.data[i][0]);
            quandlData.unshift(result.dataset.data[i][4]);
            watsData.unshift((this.props.data[i].score * 100));
          }
          const ctx = document.getElementById('stock-chart');

          /***********************/
          // destroy current chart
          /***********************/

          if (myChart !== 'a') {
            console.log('called');
            myChart.destroy();
          }

          myChart = new ChartJS(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                {
                  type: 'bar',
                  label: 'Watson Score',
                  yAxisID: "y-axis-0",
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
                yAxisID:"y-axis-1",
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
                  position: "left",
                  "id": "y-axis-0"
                  }, {
                  position: "right",
                  "id": "y-axis-1"
                }]
                // yAxes: [{
                //   ticks: {
                //     beginAtZero: false,
                //   },
                // }],
              },
            }
          });
        }
        else {
          console.log('not enough');
        }
      },
      error: (error) => {
        console.log('ERROR CREATING CHART');
        console.warn('[StockChart.js error] ', error);
      },
    });
  }

  componentDidMount() {
    console.log('** StockChart DID MOUNT **');
    this.updateChart();
  }

  componentDidUpdate() {
    this.updateChart();
  }
 
  render() {
    return (
      <div className="chart-container">
        <h2>{this.props.ticker} Stock Price</h2>
        <canvas onLoad={this.createChart} className="center" height="300px" id="stock-chart" />
      </div>
    );
  }
}

export default StockChart;
