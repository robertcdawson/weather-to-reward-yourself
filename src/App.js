import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingData: true,
            city: '',
            region: '',
            country: '',
            zipCode: '',
            temperature: '',
            windSpeed: '',
            humidity: '',
            weatherCondition: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({zipCode: event.target.value});
    }

    handleSubmit(event) {
        let url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + this.state.zipCode + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        let _this = this;
        let inputField = document.getElementById("getZipInput");
        inputField.blur();
        this.serverRequest =
            axios
                .get(url)
                .then(function (results) {
                    console.log(results);
                    _this.setState({
                        loadingData: false,
                        city: results.data.query.results.channel.location.city,
                        region: results.data.query.results.channel.location.region,
                        country: results.data.query.results.channel.location.country,
                        temperature: results.data.query.results.channel.item.condition.temp,
                        windSpeed: results.data.query.results.channel.wind.speed,
                        humidity: results.data.query.results.channel.atmosphere.humidity,
                        weatherCondition: results.data.query.results.channel.item.condition.text
                    });
                })
                .catch(function (error) {
                    console.log("Error: " + error);
                });
        event.preventDefault();
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <div>
                <label htmlFor="getZipForm">Enter Zip Code</label>
                <form id="getZipForm" name="getZipForm" onSubmit={this.handleSubmit}>
                    <input
                        id="getZipInput"
                        name="getZipInput"
                        type="number"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        size="50"
                        placeholder="e.g., 99999"
                        value={this.state.zipCode}
                        onChange={this.handleChange}/>
                </form>
                <Conditions
                    loadingData={this.state.loadingData}
                    city={this.state.city}
                    region={this.state.region}
                    country={this.state.country}
                    temperature={this.state.temperature}
                    windSpeed={this.state.windSpeed}
                    humidity={this.state.humidity}
                    weatherCondition={this.state.weatherCondition} />
                <Recommendations
                    loadingData={this.state.loadingData}
                    weatherCondition={this.state.weatherCondition} />
            </div>
        );
    }
}

class Conditions extends Component {
    render() {
        // Don't display if no data is returned
        if (!this.props.weatherCondition) {
            return null;
        }
        return (
            <div>
                <h2>Conditions!</h2>
                <p>The weather is currently {this.props.weatherCondition.toLowerCase()} in {this.props.city}, {this.props.region}, {this.props.country}.</p>
                <p>Temperature {this.props.temperature} F</p>
                <p>Wind Speed: {this.props.windSpeed} mph</p>
                <p>Humidity: {this.props.humidity}%</p>
            </div>
        );
    }
}

// Condition codes and descriptions (text): https://developer.yahoo.com/weather/documentation.html
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
        // Don't display if no data is returned
        if (!this.props.weatherCondition) {
            return null;
        }
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
            </div>
        );
    }
}

export default WeatherTreatYourself;
