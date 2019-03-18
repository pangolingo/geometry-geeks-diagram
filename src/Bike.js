import React, { Component } from 'react';
import './App.css';
import { Layer, Circle, Line, Group, Shape, Text } from 'react-konva';
import { Filters } from 'konva'

const mmToPx = (mm) => mm / 3;
const pxToMm = (px) => px * 3;
const degToRadians = (angle) => angle * (Math.PI / 180);
const pointOnLine = (p1, p2, distFromP1) => {
  const v = new Point(p2.x - p1.x, p2.y - p1.y);
  v.normalize(distFromP1);
  return v;
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  normalize(scale = 1) {
    const norm = Math.sqrt(this.x * this.x + this.y * this.y);
    if (norm !== 0) {
      this.x = scale * this.x / norm;
      this.y = scale * this.y / norm;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }
}

// https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRgbA(hex, alpha){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c = hex.substring(1).split('');
      if(c.length === 3){
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = `0x${c.join('')}`;
      return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, ${alpha})`;
  }
  throw new Error('Bad Hex');
}



class Bike extends Component {

  // componentDidMount() {
  //   if(this.bikeGroup){
  //     this.bikeGroup.opacity(0.5)

  //   }
  // }

  render() {
    const bike = this.props.bike;
    const geo = bike.geo;
    const color = bike.color;
    // const color = hexToRgbA(bike.color, 0.5);
    const ground = window.innerHeight;
    const leftEdge = mmToPx(geo.wheelSize);

    const bbMiddle = new Point(window.innerWidth/2, ground - mmToPx((geo.wheelSize / 2 - geo.bbDrop)));
    const rearWheelX = mmToPx(Math.sqrt(geo.chainstayLen * geo.chainstayLen - geo.bbDrop * geo.bbDrop));
    const rearWheelMiddle = new Point(bbMiddle.x - rearWheelX, ground - mmToPx(geo.wheelSize / 2));
    // const rearWheelMiddle = new Point(leftEdge + mmToPx(geo.wheelSize / 2), ground - mmToPx(geo.wheelSize / 2));
    // const bbMiddle = new Point(rearWheelMiddle.x + mmToPx(geo.chainstayLen), ground - mmToPx((geo.wheelSize / 2 - geo.bbDrop)));
    const topSeatIntersection = new Point(
      bbMiddle.x - mmToPx(Math.cos(degToRadians(geo.seatTubeAngle)) * geo.seatTubeLen),
      bbMiddle.y - mmToPx(Math.sin(degToRadians(geo.seatTubeAngle)) * geo.seatTubeLen),
    );
    // const topTubeHeadTubeIntersection = new Point(topSeatIntersection.x + mmToPx(geo.topTubeLenEffective), topSeatIntersection.y)
    const topTubeHeadTubeIntersection = new Point(bbMiddle.x + mmToPx(geo.reach), bbMiddle.y - mmToPx(geo.stack))
    const bottomOfHeadTube = new Point(
      topTubeHeadTubeIntersection.x + mmToPx(Math.cos(degToRadians(geo.headTubeAngle)) * geo.headTubeLen),
      topTubeHeadTubeIntersection.y + mmToPx(Math.sin(degToRadians(geo.headTubeAngle)) * geo.headTubeLen),
    );
    // use this is there's no wheelbase measurement
    let frontWheelMiddle;
    if (geo.wheelbase) {
      frontWheelMiddle = new Point(
        rearWheelMiddle.x + mmToPx(geo.wheelbase),
        rearWheelMiddle.y
      );
    } else {
      const a = 180 - geo.headTubeAngle - 90;
      frontWheelMiddle = new Point(
        bottomOfHeadTube.x + mmToPx(Math.tan(degToRadians(a)) * (pxToMm(rearWheelMiddle.y) - pxToMm(bottomOfHeadTube.y))),
        rearWheelMiddle.y
      );
    }

    // const stack = pxToMm(bbMiddle.y - topTubeHeadTubeIntersection.y);
    // const reach = pxToMm(topTubeHeadTubeIntersection.x - bbMiddle.x);

    const spacerLengthMM = 50;
    const spacerLength = pointOnLine(topTubeHeadTubeIntersection, bottomOfHeadTube, mmToPx(spacerLengthMM));
    const topOfSpacers = new Point(topTubeHeadTubeIntersection.x - spacerLength.x, topTubeHeadTubeIntersection.y - spacerLength.y);
    // 90 degree stem
    // const bars = new Point(topOfSpacers.x + 10, topOfSpacers.y);
    const stemLengthMM = 100;
    const stemLength = new Point(Math.cos(degToRadians(-11)) * mmToPx(stemLengthMM), Math.sin(degToRadians(-11)) * mmToPx(stemLengthMM));
    const bars = new Point(topOfSpacers.x + stemLength.x, topOfSpacers.y + stemLength.y);

    const seatpostLengthMM = 150;
    const seatpostLength = pointOnLine(topSeatIntersection, bbMiddle, mmToPx(seatpostLengthMM));
    const topOfSeatpost = new Point(topSeatIntersection.x - seatpostLength.x, topSeatIntersection.y - seatpostLength.y);
    const seatLengthMM = 150;


    return (
      <Layer>
        <Group opacity={0.5} >
          <Shape
            stroke={color}
            strokeWidth={8}
            lineJoin="miter"
            sceneFunc={(context, shape) => {
              context.beginPath();
              context.moveTo(bbMiddle.x, bbMiddle.y);
              // seat tube
              context.lineTo(topSeatIntersection.x, topSeatIntersection.y);
              // top tube
              context.lineTo(topTubeHeadTubeIntersection.x, topTubeHeadTubeIntersection.y);
              // head tube
              context.lineTo(bottomOfHeadTube.x, bottomOfHeadTube.y);
              // downtube
              context.lineTo(bbMiddle.x, bbMiddle.y);
              // chainstay
              context.lineTo(rearWheelMiddle.x, rearWheelMiddle.y);
              // seatstay
              context.lineTo(topSeatIntersection.x, topSeatIntersection.y);
              // fork
              context.moveTo(bottomOfHeadTube.x, bottomOfHeadTube.y);
              context.lineTo(frontWheelMiddle.x, frontWheelMiddle.y);
              // rear wheel
              const wheelRadius = mmToPx(geo.wheelSize) / 2;
              context.moveTo(rearWheelMiddle.x + wheelRadius, rearWheelMiddle.y);
              context.arc(rearWheelMiddle.x, rearWheelMiddle.y, wheelRadius, 0, Math.PI * 2)
              // front wheel
              context.moveTo(frontWheelMiddle.x + wheelRadius, frontWheelMiddle.y);
              context.arc(frontWheelMiddle.x, frontWheelMiddle.y, wheelRadius, 0, Math.PI * 2)
              // seatpost
              context.moveTo(topSeatIntersection.x, topSeatIntersection.y)
              context.lineTo(topOfSeatpost.x, topOfSeatpost.y)
              // seat
              context.moveTo(topOfSeatpost.x - mmToPx(seatLengthMM) / 2, topOfSeatpost.y)
              context.lineTo(topOfSeatpost.x + mmToPx(seatLengthMM) / 2, topOfSeatpost.y)
              // spacers
              context.moveTo(topTubeHeadTubeIntersection.x, topTubeHeadTubeIntersection.y)
              context.lineTo(topOfSpacers.x, topOfSpacers.y)
              // stem
              context.lineTo(bars.x, bars.y)
              // crank
              // context.moveTo(bbMiddle.x, bbMiddle.y);
              // context.lineTo(bbMiddle.x, bbMiddle.y + mmToPx(172))



              // context.closePath();
              // Konva specific method
              context.fillStrokeShape(shape);
            }}
          />
        </Group>
        <Group>
          <Shape
              stroke={color}
              strokeWidth={2}
              lineJoin="miter"
              dashEnabled
              dash={[10,5]}
              opacity={0.5}
              sceneFunc={(context, shape) => {
                const stackMM = mmToPx(geo.stack);
                const reachMM = mmToPx(geo.reach);
                context.beginPath();
                // stack
                context.moveTo(bbMiddle.x, bbMiddle.y);
                context.lineTo(bbMiddle.x, bbMiddle.y - stackMM);
                // reach
                context.lineTo(bbMiddle.x + reachMM, bbMiddle.y - stackMM);

                context.fillStrokeShape(shape);
              }}
          />
          <Text text={geo.stack} x={bbMiddle.x - 20} y={bbMiddle.y - 50 - (20 * this.props.order)} align="right" fill={color} fontStyle="bold" />
          <Text text={geo.reach} x={bbMiddle.x + (30 * this.props.order)} y={bbMiddle.y - mmToPx(geo.stack) - 10} fill={color} fontStyle="bold" />
        </Group>
      </Layer>
    )

    return (
          <Layer>
            <Group opacity={0.3} >
            {/* rear wheel */}
            <Circle
              x={rearWheelMiddle.x}
              y={rearWheelMiddle.y}
              radius={mmToPx(geo.wheelSize) / 2}
              stroke={color}
              strokeWidth={8}
            />
            {/* rear hub */}
            <Circle
              x={rearWheelMiddle.x}
              y={rearWheelMiddle.y}
              fill={color}
              radius={3}
            />
            {/* front wheel */}
            <Circle
              x={frontWheelMiddle.x}
              y={frontWheelMiddle.y}
              radius={mmToPx(geo.wheelSize) / 2}
              stroke={color}
              strokeWidth={8}
            />
            {/* front hub */}
            <Circle
              x={frontWheelMiddle.x}
              y={frontWheelMiddle.y}
              fill={color}
              radius={4}
            />
            {/* BB */}
            <Circle
              x={bbMiddle.x}
              y={bbMiddle.y}
              radius={8}
              fill={color}
            />
            {/* seat tube */}
            <Line
              points={[bbMiddle.x, bbMiddle.y, topSeatIntersection.x, topSeatIntersection.y]}
              stroke={color}
              strokeWidth={8}
            />
            {/* chainstay */}
            <Line
              points={[bbMiddle.x, bbMiddle.y, rearWheelMiddle.x, rearWheelMiddle.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* top tube */}
            <Line
              points={[topSeatIntersection.x, topSeatIntersection.y, topTubeHeadTubeIntersection.x, topTubeHeadTubeIntersection.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* head tube */}
            <Line
              points={[topTubeHeadTubeIntersection.x, topTubeHeadTubeIntersection.y, bottomOfHeadTube.x, bottomOfHeadTube.y]}
              stroke={color}
              strokeWidth={8}
            />
            {/* rough fork */}
            <Line
              points={[bottomOfHeadTube.x, bottomOfHeadTube.y, frontWheelMiddle.x, frontWheelMiddle.y]}
              stroke={color}
              strokeWidth={8}
            />
            {/* downtube */}
            <Line
              points={[bottomOfHeadTube.x, bottomOfHeadTube.y, bbMiddle.x, bbMiddle.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* seat stay */}
            <Line
              points={[rearWheelMiddle.x, rearWheelMiddle.y, topSeatIntersection.x, topSeatIntersection.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* spacers */}
            <Line
              points={[topTubeHeadTubeIntersection.x, topTubeHeadTubeIntersection.y, topOfSpacers.x, topOfSpacers.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* stem */}
            <Line
              points={[topOfSpacers.x, topOfSpacers.y, bars.x, bars.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* seatpost */}
            <Line
              points={[topSeatIntersection.x, topSeatIntersection.y, topOfSeatpost.x, topOfSeatpost.y]}
              stroke={color}
              strokeWidth={6}
            />
            {/* seat */}
            <Line
              points={[topOfSeatpost.x - mmToPx(seatLengthMM) / 2, topOfSeatpost.y, topOfSeatpost.x + mmToPx(seatLengthMM) / 2, topOfSeatpost.y]}
              stroke={color}
              strokeWidth={8}
            />
            </Group>
          </Layer>
    );
  }
}

export default Bike;
