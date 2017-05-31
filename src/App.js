import React, { Component } from 'react';
import './App.css';

class Location extends Component {
    render() {
        return (
            <div>
                <label htmlFor="getZipForm">Enter Zip Code</label>
                <form name="getZipForm" action="/" method="post">
                    <input
                        name="getZipInput"
                        type="number"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        max="5"
                        size="50"/>
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
