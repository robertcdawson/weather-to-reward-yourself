import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zipCode: '',
            weatherCondition: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({zipCode: event.target.value});
    }

    handleSubmit(event) {
        console.log('A zip code was submitted: ' + this.state.zipCode);
        event.preventDefault();
    }

    componentDidMount() {
        let _this = this;
        this.serverRequest =
            axios
                .get("https://query.yahooapis.com/v1/public/yql?q=select%20item.condition.text%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%2294105%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
                .then(function(results) {
                    _this.setState({
                        weatherCondition: results.data.query.results.channel.item.condition.text
                    });
                });
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <div>
                <label htmlFor="getZipForm">Enter Zip Code</label>
                <form name="getZipForm" onSubmit={this.handleSubmit}>
                    <input
                        name="getZipInput"
                        type="number"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        size="50"
                        placeholder="e.g., 99999"
                        value={this.state.zipCode}
                        onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

class Conditions extends Component {
    render() {
        return (
            <div>
                <h2>Conditions!</h2>
                <p>Feels like [temp]</p>
                <p>Temperature [temp]</p>
                <p>Wind [wind speed]</p>
                <p>Humidity [humidity level]</p>
            </div>
        );
    }
}

class Recommendations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendationOptions: {
                "sunny": "ice cream",
                "cloudy": "coffee",
                "stormy": "hot chocolate"
            }
        };
    }

    render() {
        return (
          <div>
              <h2>Recommendations!</h2>
              <p>We recommend {this.state.recommendationOptions.sunny}!</p>
          </div>
        );
    }
}

class WeatherTreatYourself extends Component {
  render() {
    return (
      <div className="App">
          <h1>[Weather App Title]</h1>
          <Location />
          <Conditions />
          <Recommendations />
      </div>
    );
  }
}

export default WeatherTreatYourself;
