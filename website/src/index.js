import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// manages input from the user on the canvas, updates the display accordingly
class PixelCanvas extends React.Component {
  constructor(props) {
    super(props);
    
    this.canvasRef = React.createRef();
    this.contextRef = React.createRef();

    this.state = {
      drawing: false,
    };
  }

  componentDidMount() {
    this.contextRef = this.canvasRef.current.getContext("2d");
    this.contextRef.fillStyle = "#000000";
    this.contextRef.fillRect(0, 0, 280, 280);
  }

  startDrawing(e) {
    this.setState({drawing: true});
  }

  draw({nativeEvent}) {
    if(!this.state.drawing)
      return; // leave if not drawing

    const {offsetX, offsetY} = nativeEvent;
    this.props.display[Math.floor(offsetX/10)][Math.floor(offsetY/10)] = 255;
    this.props.onUserDrew(this.props.display);
  }

  stopDrawing(e) {
    this.setState({drawing: false});
  }

  componentDidUpdate() {
    this.contextRef.fillStyle = "#000000";
    this.contextRef.fillRect(0, 0, 280, 280);
    this.contextRef.fillStyle = "#FFFFFF";
    for(let y = 0; y < 28; y++) {
      for(let x = 0; x < 28; x++) {
        if(!this.props.display[x][y])
          continue;
        this.contextRef.fillRect(x*10, y*10, 10, 10);
      }
    }
  }

  render() {
    return (
      <canvas ref={this.canvasRef} width={280} height={280}
        onMouseUp = {this.stopDrawing.bind(this)}
        onMouseDown = {this.startDrawing.bind(this)}
        onMouseMove = {this.draw.bind(this)}
      />
    );
  }
}

// consider removing
class InputDisplay extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const inputStyle = {
      diplay: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <div style={inputStyle}>
        <PixelCanvas display={this.props.display} onUserDrew={this.props.onUserDrew}/>
        <br/>
        <button onClick={this.props.handleClear}>Clear</button>
      </div>
    );
  }
}


class SettingDisplay extends React.Component {
  render() {
    return (
      <div>
        <h2>Settings</h2>
        <ul style={{listStyle: "none", padding: 0}}>
          <li><input name="algor-type" type="radio"/> Convolutional Neural Net</li>
          <li><input name="algor-type" type="radio"/> k-Nearest Neighbour</li>
          <li><input name="algor-type" type="radio"/> Support Vector Machine</li>
          <li><input name="algor-type" type="radio"/> <strong>Weighted Vote</strong></li>
        </ul>
      </div>
    );
  }
}

class PredictionDisplay extends React.Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <div>
        <p>Prediction: {this.props.prediction}</p>
      </div>
    );
  }
}

class Predictor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prediction: 0,
      display: Array(28).fill(0).map(x => Array(28).fill(0)),
    };
  }

  onUserDrew(updatedDisplay) {
    this.setState({display: updatedDisplay});
  }

  handleClear(e) {
    this.setState({display: Array(28).fill(0).map(x => Array(28).fill(0))});
  }

  componentDidUpdate() {

    const request = {
      method: "POST",
      mode: "same-origin",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.display)
    }

    fetch("/predict", request)
      .then(response => {
        if(!response.ok) 
          throw new Error("Failed to get prediction from predictor API.");

        return response.blob();
      })
      .then(blob => {
        return blob.text();
      })
      .then(text => console.log(text))
      .catch(err => console.log(err));
  }

  render() {
    const applicationStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    };

    return (
      <div style={applicationStyle}>
        <div>
        <SettingDisplay />
        <PredictionDisplay prediction={this.state.prediction} />
        </div>
        <InputDisplay display={this.state.display} onUserDrew={this.onUserDrew.bind(this)} handleClear={this.handleClear.bind(this)}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Predictor />,
  document.getElementById('root')
);
