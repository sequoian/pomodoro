import React, { Component } from 'react';
import moment from 'moment';
import './App.css';

class Timer extends Component {
  render() {
    // get timer phase
    let phase = null;
    let phaseClass = null;
    if (this.props.working) {
      phase = 'Work';
      phaseClass = 'work';
    }
    else {
      phase = 'Rest'
      phaseClass = 'rest';
    }

    // format timer
    const timer = this.props.timer;
    const minutes = ('0' + timer.minutes()).slice(-2);
    const seconds = ('0' + timer.seconds()).slice(-2);
    const time = `${minutes}:${seconds}`;

    return (
      <div className={`display ${phaseClass}`}>
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
    this.workTime = 25;
    this.restTime = 5;
    this.timeUnit = 'minutes';
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
    // ask to notify user
    if (!this.state.notify) {
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          this.setState({
            notify: true
          });
        }
      });
    } 

    // set timer
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
      timer: moment.duration(this.workTime, this.timeUnit),
      isWorkPhase: true
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
        // transition to rest phase
        this.setState({
          timer: moment.duration(this.restTime, this.timeUnit),
          isWorkPhase: false
        });

        // notify user
        if (this.state.notify) {
          this.notify('Take a well deserved break.')
        }
      }
      else {
        // reset timer
        this.handleClear();

        // notify user
        if (this.state.notify) {
          this.notify('Time to get back to work!')
        }
      }
    }
    else {
      this.setState({
        timer: timer
      });
    }
  }

  notify(message) {
    const n = new Notification ('Pomodoro', {
      body: message
    });
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
