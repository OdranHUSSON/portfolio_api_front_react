import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import {Line} from 'react-chartjs-2';

class Portfolio extends Component {
  // Adds a class constructor that assigns the initial state values:
  constructor () {
      super();
      this.state = {
          name: '',
          description: '',
          cryptocurrencys: {}
      };
  }
  // This is called when an instance of a component is being created and inserted into the DOM.
  componentWillMount () {
      axios.get('http://portfolio.odran.cc/api/portfolios/1')
          .then(response => {
              // We set the latest prices in the state to the prices gotten from Cryptocurrency.
              this.setState({ name: response.data.name });
              this.setState({ description: response.data.description });
              this.setState({ cryptocurrencys: response.data.cryptocurrencys });

              var cryptocurrency = "BURST";
              axios.get('http://portfolio.odran.cc/api/portfolios/1/'+cryptocurrency)
              .then(results => {
                console.log(results)
                // Each data of current crypto currencys
                var labels = [], data = [];
                var ChartDataWeekly = results.data.ChartDataWeekly;
                Object.keys(ChartDataWeekly).forEach(function(chartkey) {
                  labels.push((ChartDataWeekly[chartkey].date.toString()));
                  data.push(Math.round(parseFloat(ChartDataWeekly[chartkey].value) * 100) / 100);
                });

                var chartdata = {
                  labels: labels,
                  datasets: [{
                    borderColor: "rgba(255,165,0,1)",
                    backgroundColor: "rgba(60, 186, 159, 0.2)",
                    fill: false,
                    data: data,
                    label: "$USD"
                  }]
                }
                this.setState({ BURST: chartdata });
              });
          })
          // Catch any error here
          .catch(error => {
              console.log(error)
          })
  }


  _drawLineChart(key) {
    // Contact de l'api
    return (
      <div>
        <Line data={this.state.BURST} />
      </div>
    );
  }

  _renderCryptocurrencys(){
    var CryptoCurrencys = this.state.cryptocurrencys;
		return Object.entries(CryptoCurrencys).map(([key, quantity], i) => {
			return (
				<div key={key} data-crypto={key}>
          {this._drawLineChart(key)}
          <p className="symbol">{key}</p>
          <div className="info">
            <p className="grey">{quantity}<span className="small">{key }</span></p>
          </div>
				</div>
			)
		})
	}

  /**
  html += '<div data-crypto="' + key + '">';
  html += '<div class="canvas"><canvas></canvas></div>';
  html += '<p class="symbol">' + key + '</p>';
  html += '<div class="info">';
  console.log(cryptocurrencys[key]);
  html += '<p class="grey">' + cryptocurrencys[key].quantity + ' <span class="small">' + key + '</span></p>';
  html += '<p>' + Math.round(cryptocurrencys[key].currentValue.value * 100) / 100 + ' <span class="small">$</span></p>';
  html += '<p class="green">+5.00% <span class="small">24h</span></p>';
  html += '<p class="orange">-3.00% <span class="small">1w</span></p>';
  html += '</div>';
  html += '</div>';
  **/

  // The render method contains the JSX code which will be compiled to HTML.
  render() {
      return (
          <div className="today--section container">
              <h1>{this.state.name}</h1>
              <h2>{this.state.description}</h2>
              {this._renderCryptocurrencys()}
          </div>
      )
  }
}

export default Portfolio;
