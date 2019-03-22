import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { Stage, Layer, Rect} from 'react-konva';
import _ from 'lodash';
import Bike from './Bike';
import GeoForm from './GeoForm';
import testBikes from './testBikes';

const validateGeos = (bikes) => {
  const requiredFields = [
    'bbDrop',
    'wheelbase',
    'seatTubeLen',
    'headTubeLen',
    'seatTubeAngle',
    'headTubeAngle',
    'chainstayLen',
    'wheelSize',
    'reach',
    'stack'
  ];

  bikes.forEach(bike => {
    if(!bike.geo) {
      throw new Error('bike does not have geo')
    }
    requiredFields.forEach(field => {
      if(!(field in bike.geo)) {
        throw new Error(`#{bike.name} bike geo does not have ${field} field`);
      }
    })
  })
}

class App extends Component {
  state = {
    bikes: [],
    canvasDimensions: {
      width: 500,
      height: 400
    },
    stage: {
      scale: 1.0,
      pos: {
        x: 0,
        y: 0,
      }
    }
  }

  constructor(props) {
    super(props);

    this.stageRef = React.createRef();
    validateGeos(this.state.bikes);
  }

  componentDidMount() {
    if(this.props.bikes) {
      
      validateGeos(this.props.bikes);
      this.setState({bikes: this.props.bikes})
    } else {
      validateGeos(testBikes);
      this.setState({bikes: testBikes});
    }

    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    const appContainer = ReactDOM.findDOMNode(this).parentNode;
    this.setState({canvasDimensions: {
      width: appContainer.offsetWidth,
      height: appContainer.offsetWidth * (9/16)
    }})
  }

  handleBikeEnable = (bikeName, event) => {
    const updatedBikes = _.cloneDeep(this.state.bikes);
    const index = this.state.bikes.findIndex(item => item.name === bikeName);
    if(index < 0) {
      return;
    }
    updatedBikes[index].enabled = !updatedBikes[index].enabled;
    this.setState({
      bikes: updatedBikes
    });
  }

  handleGeoInputChange = (bikeName, event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const updatedBikes = _.cloneDeep(this.state.bikes);
    const index = updatedBikes.findIndex(item => item.name === bikeName);
    if(index < 0) {
      return;
    }
    updatedBikes[index].geo = {
      ...updatedBikes[index].geo,
      [name]: value
    }
    this.setState({
      bikes: updatedBikes
    });
  }

  drawBikes = () => {
    return this.state.bikes.filter(bike => bike.enabled).map((bike, i) => <Bike bike={bike} key={bike.name} order={i} canvasDimensions={this.state.canvasDimensions} />);
  }
  drawForms = () => {
    return this.state.bikes.map((bike, i)=> <GeoForm bike={bike} handleBikeEnable={this.handleBikeEnable.bind(this, bike.name)} handleGeoInputChange={this.handleGeoInputChange.bind(this, bike.name)} key={bike.name} />);
  }

  onWheel = (e) => {
    const stage = this.stageRef.current;
    const scaleBy = 1.01;
    e.evt.preventDefault();
    var oldScale = stage.scaleX();

    var mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    var newScale =
      e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if(newScale < 1){
      return;
    }

    // stage.scale({ x: newScale, y: newScale });

    var newPos = {
      x:
        -(mousePointTo.x - stage.getPointerPosition().x / newScale) *
        newScale,
      y:
        -(mousePointTo.y - stage.getPointerPosition().y / newScale) *
        newScale
    };
    // stage.position(newPos);
    // stage.batchDraw();
    this.setState({stage: {
      scale: newScale,
      pos: newPos
    }})
  }

  render() {
    const { width: canvasWidth, height: canvasHeight } = this.state.canvasDimensions;
    return (
      <div className="App">
        <Stage width={canvasWidth} height={canvasHeight} onWheel={this.onWheel} ref={this.stageRef} draggable scaleX={this.state.stage.scale} scaleY={this.state.stage.scale} x={this.state.stage.pos.x} y={this.state.stage.pos.y} >
          <Layer>
            <Rect
                x={0}
                y={0}
                width={canvasWidth}
                height={canvasHeight}
                fill="#fff"
              />
          </Layer>
          {this.drawBikes()}
        </Stage>
        <div className="forms">
          {this.drawForms()}
        </div>
      </div>
    );
  }
}

export default App;
