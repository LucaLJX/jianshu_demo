import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

// 摄氏度、华氏度名称
const scaleNames = {
  c: 'celsius',
  f: 'Fahrenheit'
}

// 华氏度 -> 摄氏度
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9
}

// 摄氏度 -> 华氏度
function toFahrenheit (celsius) {
  return (celsius * 9 / 5) + 32;
}

// 数据格式化
function tryConvert (temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}

// 判断是否沸腾，并提示
function BoilingVerdict (props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>
  }
  return <p>The water would not boil.</p>;
}

// 声明温度输入组件
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {date: new Date(), num: 20, temperature: '', scale: 'c'};
    this.clickTheBtn = this.clickTheBtn.bind(this);
    // 温度控制
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
  }
  // 组件第一次初始化
  componentDidMount () {
    this.timerId = setInterval(
      () => this.tick(),
      1000
    );
  }
  // 组件即将销毁
  componentWillUnmount () {
    clearInterval(this.timerId);
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  clickTheBtn (e) {
    this.setState(prevState => ({
      num: prevState.num + 10
    }));
  }

  tick () {
    this.setState({
      date: new Date()
    })
  }
  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;
    return (
      <div>
        <h3>hello!</h3>
        <h4>now is {this.state.date.toLocaleTimeString()}</h4>
        <h4>the num is {this.state.num}</h4>
        <button onClick={this.clickTheBtn}>click me</button>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}

export default App;
