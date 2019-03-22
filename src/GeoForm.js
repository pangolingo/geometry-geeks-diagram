import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import { WHEEL_SIZES } from './constants';

class GeoForm extends Component {

  renderWheelSizeOptions = () => {
    return _.map(WHEEL_SIZES, (mm, name) => (<option value={mm} key={mm}>{name}</option>));
  }

  render() {
    const { bike, handleGeoInputChange, handleBikeEnable } = this.props;
    const geo = bike.geo;
    const color = bike.color;

    return (
      <form style={{ backgroundColor: color }}>
      <label>{bike.name}</label><br />
      <label><input type="checkbox" checked={bike.enabled} onChange={handleBikeEnable} /> Enabled</label><br />
      <label>Wheel/Tire Size</label>
        <select name="wheelSize" value={geo.wheelSize} onChange={handleGeoInputChange} >
          {this.renderWheelSizeOptions()}
        </select>
      <br />
      <label>Seat Tube Length</label><input type="number" min="0" max="1000" name="seatTubeLen" value={geo.seatTubeLen} onChange={handleGeoInputChange} /><br />
      <label>Seat Tube Angle</label><input type="number" min="0" max="3000" name="seatTubeAngle" value={geo.seatTubeAngle} onChange={handleGeoInputChange} /><br />
      <label>BB Drop</label><input type="number" min="0" max="1000" name="bbDrop" value={geo.bbDrop} onChange={handleGeoInputChange} /><br />
      <label>Wheelbase</label><input type="number" min="0" max="3000" name="wheelbase" value={geo.wheelbase} onChange={handleGeoInputChange} /><br />
      <label>Head Tube Length</label><input type="number" min="0" max="3000" name="headTubeLen" value={geo.headTubeLen} onChange={handleGeoInputChange} /><br />
      <label>Head Tube Angle</label><input type="number" min="0" max="3000" name="headTubeAngle" value={geo.headTubeAngle} onChange={handleGeoInputChange} /><br />
      <label>Chainstay Length</label><input type="number" min="0" max="3000" name="chainstayLen" value={geo.chainstayLen} onChange={handleGeoInputChange} /><br />
      <br />
      <br />
      <label>Stack</label><input type="number" min="0" max="1000" name="stack" value={geo.stack} onChange={handleGeoInputChange} /><br />
      <label>Reach</label><input type="number" min="0" max="1000" name="reach" value={geo.reach} onChange={handleGeoInputChange} /><br />
    </form>
    );
  }
}

export default GeoForm;
