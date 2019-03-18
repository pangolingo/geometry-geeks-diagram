import React, { Component } from 'react';
import './App.css';
import { Stage, Layer, Rect} from 'react-konva';
import _ from 'lodash';
// import Konva from 'konva';
import Bike from './Bike';
import GeoForm from './GeoForm';


/**
 * PROBLEMS
 * draw the stem
 * draw the seatpost and seat
 * cranks?
 * stack/reach calculation is broken because of the top tube issue
 */

 const colors = [
   "#ff0000",
   "#0000ff",
   "#00ff00",
   "#8106d3",
   "#ff6900",
   "#00d0ff",
 ];

// skip:
// top tube effective
// front center
// fork info (rake/offset)
// 

 // https://geometrygeeks.bike/bike/soma-fabrications-double-cross-disc-2018/
 // 56
const somaDoubleCrossGeo = {
  bbDrop: 66,
  wheelbase: 1020,
  seatTubeLen: 560,
  // topTubeLenEffective: 570,
  topTubeLenActual: null,
  headTubeLen: 160,
  seatTubeAngle: 72.5,
  headTubeAngle: 72,
  chainstayLen: 425,
  wheelSize: 682,
  reach: 383,
  stack: 596,
}

// https://geometrygeeks.bike/bike/soma-fabrications-wolverine-2017/
// 56
const somaWolverineGeo = {
  bbDrop: 70,
  wheelbase: 1040,
  seatTubeLen: 560,
  // topTubeLenEffective: 575,
  topTubeLenActual: null,
  headTubeLen: 140,
  seatTubeAngle: 73.5,
  headTubeAngle: 72,
  chainstayLen: 425,
  wheelSize: 682,
  reach: 404,
  stack: 578,
}

// https://geometrygeeks.bike/bike/otso-warakin-2016/
// 56
const otsoWarakinGeo = {
  bbDrop: 70,
  wheelbase: 1038,
  seatTubeLen: 550,
  // topTubeLenEffective: 565,
  topTubeLenActual: null,
  headTubeLen: 160,
  seatTubeAngle: 73,
  headTubeAngle: 71.5,
  chainstayLen: 430,
  wheelSize: 682,
  reach: 383,
  stack: 578,
}

// https://geometrygeeks.bike/bike/kona-rove-st-2019/
// 56
const konaRoveStGeo = {
  bbDrop: 70,
  wheelbase: 1050,
  seatTubeLen: 560,
  // topTubeLenEffective: 579,
  topTubeLenActual: null,
  headTubeLen: 168,
  seatTubeAngle: 73,
  headTubeAngle: 71.5,
  chainstayLen: 435,
  wheelSize: 682,
  reach: 392,
  stack: 610,
}

// https://geometrygeeks.bike/bike/kona-rove-st-2019/
// 56
const rawlandRavnGeo = {
  "reach": 391,
  "stack": 600,
  "Top Tube (effective)": 580,
  "seatTubeLen": 562,
  "headTubeAngle": 73,
  "seatTubeAngle": 72.5,
  "headTubeLen": 171,
  "chainstayLen": 430,
  "wheelbase": 1054,
  "Standover": 820,
  "bbDrop": 61,
  "BB Height": 272,
  "Fork Rake / Offset": 69,
  "Trail": 30,
  "Seatpost Offset": 181,
  wheelSize: 682,
}


// https://geometrygeeks.bike/bike/trek-domane-alr-3-2018/
// 56
const trekDomaneALR3 = {
  bbDrop: 78,
  wheelbase: 1008,
  seatTubeLen: 525,
  // topTubeLenEffective: 554,
  topTubeLenActual: null,
  headTubeLen: 175,
  seatTubeAngle: 73.3,
  headTubeAngle: 71.9,
  chainstayLen: 420,
  wheelSize: 682,
  reach: 377,
  stack: 591,
}

class App extends Component {
  // state = { geo: somaDoubleCrossGeo}
  state = {
    bikes: [
      {
        geo: somaDoubleCrossGeo,
        name: "Soma Double Cross Disc",
        enabled: true,
        color: colors[0],
      },
      {
        geo: konaRoveStGeo,
        name: "Kona Rove St",
        enabled: true,
        color: colors[1],
      },
      {
        geo: trekDomaneALR3,
        name: "Trek Domane ALR 3",
        enabled: true,
        color: colors[2],
      },
      {
        geo: somaWolverineGeo,
        name: "Soma Wolverine",
        enabled: true,
        color: colors[3],
      },
      {
        geo: otsoWarakinGeo,
        name: "Otso Warakin",
        enabled: true,
        color: colors[4],
      },
      {
        geo: rawlandRavnGeo,
        name: "Rawland Ravn",
        enabled: true,
        color: colors[5],
      },
    ]
  }

  constructor(props) {
    super(props);

    this.validateGeos();
  }

  validateGeos = () => {
    const requiredFields = [
      'bbDrop',
      'wheelbase',
      'seatTubeLen',
      'headTubeLen',
      'seatTubeAngle',
      'headTubeAngle',
      'chainstayLen',
      // 'wheelSize',
      'reach',
      'stack'
    ];

    this.state.bikes.forEach(bike => {
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

  handleBikeEnable = (bikeName, event) => {
    const updatedBikes = _.cloneDeep(this.state.bikes);
    const index = this.state.bikes.findIndex(item => item.name === bikeName);
    if(index < 0) {
      return;
    }
    console.log(bikeName, index)
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

    // updatedBikes[bikeName] = {
    //   ...updatedBikes[bikeName],
    //   [name]: value
    // }
    this.setState({
      // geo: {
      //   ...this.state.geo,
      //   [name]: value
      // }
      bikes: updatedBikes
    });
  }

  drawBikes = () => {
    return this.state.bikes.filter(bike => bike.enabled).map((bike, i) => <Bike bike={bike} key={bike.name} order={i} />);
  }
  drawForms = () => {
    return this.state.bikes.map((bike, i)=> <GeoForm bike={bike} handleBikeEnable={this.handleBikeEnable.bind(this, bike.name)} handleGeoInputChange={this.handleGeoInputChange.bind(this, bike.name)} key={bike.name} />);
  }

  render() {
    return (
      <div className="App">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <Rect
                x={0}
                y={0}
                width={window.innerWidth}
                height={window.innerHeight}
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
