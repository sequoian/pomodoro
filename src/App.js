import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

class Timer extends Component {
  render() {
    // get timer phase
    let phase = null;
    if (this.props.working) {
      phase = 'Work'
    }
    else {
      phase = 'Rest'
    }

    // format timer
    const timer = this.props.timer;
    const time = `${timer.minutes()}:${timer.seconds()}`;

    return (
      <div>
        <div className="phase">
          {phase}
        </div>
        <div className="timer">
          {time}
        </div>
      </div>
    )
  }
}

class Controls extends Component {
  render() {
    // check to see if timer is ticking down
    let name = null;
    let label = null;
    let click = null;
    if (this.props.running) {
      name = 'stop';
      label = 'Stop';
      click = this.props.handleStop;
    }
    else {
      name = 'start';
      label = 'Start';
      click = this.props.handleStart;
    }
    return (
      <div className="controls">
        <button
          className={name}
          onClick={click}
        >
          {label}
        </button>
        <button
          className="clear"
          onClick={this.props.handleClear}
        >
          Clear
        </button>
      </div>
    );
  }
}


class App extends Component {
  constructor(props) {
    super(props);
    this.workTime = 5;
    this.restTime = 5;
    this.timeUnit = 'seconds';
    this.timerSpeed = 1000;
    this.state = {
      timer: null,
      intervalID: null,
      isWorkPhase: true,
      notify: false
    };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.tick = this.tick.bind(this);
    this.checkTimer = this.checkTimer.bind(this);
  }

  componentWillMount() {
    this.setState({
      timer: moment.duration(this.workTime, this.timeUnit)
    })
  }

  handleStart() {
    const interval = setInterval(this.tick, this.timerSpeed);
    this.setState({
      intervalID: interval
    });
  }

  handleStop() {
    clearInterval(this.state.intervalID);
    this.setState({
      intervalID: null
    });
  }

  handleClear() {
    this.handleStop();
    this.setState({
      timer: moment.duration(this.workTime, this.timeUnit)
    });
  }

  tick() {
    const timer = this.state.timer;
    const decrement = moment.duration(this.timerSpeed, 'ms');
    timer.subtract(decrement);
    this.checkTimer(timer);
  }

  checkTimer(timer) {
    if (timer.asSeconds() <= 0) {
      if (this.state.isWorkPhase) {
        this.setState({
          timer: moment.duration(this.restTime, this.timeUnit),
          isWorkPhase: false
        });
      }
      else {
        this.handleClear();
        this.setState({
          isWorkPhase: true
        })
      }
    }
    else {
      this.setState({
        timer: timer
      })
    }
  }

  render() {
    return (
      <div className="App">
        <Timer 
          working={this.state.isWorkPhase}
          timer={this.state.timer}
        />
        <Controls 
          running={this.state.intervalID ? true : false}
          handleStart={this.handleStart}
          handleStop={this.handleStop}
          handleClear={this.handleClear}
        />
      </div>
    );
  }
}

export default App;
