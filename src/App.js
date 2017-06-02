import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class Location extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formSubmitted: false,
            dataLoaded: false,
            city: '',
            region: '',
            country: '',
            zipCode: '',
            temperature: '',
            windSpeed: '',
            windChill: '',
            humidity: '',
            feelsLike: '',
            weatherCondition: ''
        };

        this.getFeelsLikeTemp = this.getFeelsLikeTemp.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Heat index equation: http://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
    getFeelsLikeTemp() {
        let temperature = this.state.temperature;
        let humidity = this.state.humidity;
        let windChill = this.state.windChill;
        let heatIndex = -42.379 + 2.04901523*temperature + 10.14333127*humidity - .22475541*temperature*humidity - .00683783*temperature*temperature - .05481717*humidity*humidity + .00122874*temperature*temperature*humidity + .00085282*temperature*humidity*humidity - .00000199*temperature*temperature*humidity*humidity;
        let heatIndexAdjustment = 0;
        let feelsLike = 0;

        if ( temperature <= 112 ) {

            if ( temperature >= 80 ) {

                if ( humidity < 13 ) {
                    heatIndexAdjustment = ( ( 13 - humidity )/4 ) * Math.sqrt( ( 17 - Math.abs( temperature-95 ) ) / 17 );
                    heatIndex -= heatIndexAdjustment;
                }

                if ( humidity > 85 && temperature <= 87 ) {
                    heatIndexAdjustment = ( ( humidity - 85 ) / 10 ) * ( ( 87-temperature ) / 5 );
                    heatIndex += heatIndexAdjustment;
                }

                if ( heatIndex < 80 ) {
                    heatIndex = 0.5 * ( temperature + 61 + ( ( temperature-68 ) * 1.2) + ( humidity * 0.094 ) );
                }

                feelsLike = heatIndex;

            }

            else {

                feelsLike = windChill;

            }

        }

        return feelsLike;
    }

    handleChange(event) {
        this.setState({zipCode: event.target.value});
    }

    handleSubmit(event) {
        let url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + this.state.zipCode + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        let _this = this;
        let inputField = document.getElementById("getZipInput");
        inputField.blur();

        this.setState({
            formSubmitted: true
        });

        this.serverRequest =
            axios
                .get(url)
                .then(function (results) {
                    console.log(results);
                    _this.setState({
                        dataLoaded: true,
                        city: results.data.query.results.channel.location.city,
                        region: results.data.query.results.channel.location.region,
                        country: results.data.query.results.channel.location.country,
                        temperature: results.data.query.results.channel.item.condition.temp,
                        windSpeed: results.data.query.results.channel.wind.speed,
                        windChill: results.data.query.results.channel.wind.chill,
                        humidity: results.data.query.results.channel.atmosphere.humidity,
                        weatherCondition: results.data.query.results.channel.item.condition.text
                    });
                    _this.setState({
                        feelsLike: Math.round(_this.getFeelsLikeTemp())
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
                    formSubmitted={this.state.formSubmitted}
                    dataLoaded={this.state.dataLoaded}
                    city={this.state.city}
                    region={this.state.region}
                    country={this.state.country}
                    temperature={this.state.temperature}
                    windChill={this.state.windChill}
                    windSpeed={this.state.windSpeed}
                    humidity={this.state.humidity}
                    feelsLike={this.state.feelsLike}
                    weatherCondition={this.state.weatherCondition} />
                <Recommendations
                    formSubmitted={this.state.formSubmitted}
                    dataLoaded={this.state.dataLoaded}
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

        let formSubmitted = this.props.formSubmitted;
        let dataLoaded = this.props.dataLoaded;
        let content = null;

        if ( formSubmitted ) {
            content = <p>Loading weather conditions...</p>;

            if ( dataLoaded ) {
                content = <div>
                    <h2>Conditions!</h2>
                    <p>The weather is currently {this.props.weatherCondition.toLowerCase()} in {this.props.city}, {this.props.region}, {this.props.country}.</p>
                    <p>Temperature {this.props.temperature}&deg; F (feels like {this.props.feelsLike}&deg; F)</p>
                    <p>Wind Speed: {this.props.windSpeed} mph</p>
                    <p>Humidity: {this.props.humidity}%</p>
                </div>;
            }

        }

        return (
            <div>
                {content}
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
        let formSubmitted = this.props.formSubmitted;
        let dataLoaded = this.props.dataLoaded;
        let content = null;

        console.log("formSubmitted", formSubmitted);
        console.log("dataLoaded", dataLoaded);

        if ( formSubmitted ) {
            content = <p>Loading recommendations...</p>;

            if ( dataLoaded ) {
                content = <div>
                    <h2>Recommendations!</h2>
                    <p>We recommend {this.state.recommendationOptions.sunny}!</p>
                </div>;
            }

        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

class WeatherTreatYourself extends Component {
    render() {
        return (
            <div className="App">
                <h1>Weather to Reward</h1>
                <Location />
            </div>
        );
    }
}

export default WeatherTreatYourself;
