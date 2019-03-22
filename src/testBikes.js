import { WHEEL_SIZES, COLORS } from "./constants";

// https://geometrygeeks.bike/bike/soma-fabrications-double-cross-disc-2018/
// 56
export const somaDoubleCrossGeo = {
  bbDrop: 66,
  wheelbase: 1020,
  seatTubeLen: 560,
  // topTubeLenEffective: 570,
  topTubeLenActual: null,
  headTubeLen: 160,
  seatTubeAngle: 72.5,
  headTubeAngle: 72,
  chainstayLen: 425,
  wheelSize: WHEEL_SIZES['700c'],
  reach: 383,
  stack: 596,
}

// https://geometrygeeks.bike/bike/soma-fabrications-wolverine-2017/
// 56
export const somaWolverineGeo = {
  bbDrop: 70,
  wheelbase: 1040,
  seatTubeLen: 560,
  // topTubeLenEffective: 575,
  topTubeLenActual: null,
  headTubeLen: 140,
  seatTubeAngle: 73.5,
  headTubeAngle: 72,
  chainstayLen: 425,
  wheelSize: WHEEL_SIZES['700c'],
  reach: 404,
  stack: 578,
}

// https://geometrygeeks.bike/bike/otso-warakin-2016/
// 56
export const otsoWarakinGeo = {
  bbDrop: 70,
  wheelbase: 1038,
  seatTubeLen: 550,
  // topTubeLenEffective: 565,
  topTubeLenActual: null,
  headTubeLen: 160,
  seatTubeAngle: 73,
  headTubeAngle: 71.5,
  chainstayLen: 430,
  wheelSize: WHEEL_SIZES['700c'],
  reach: 383,
  stack: 578,
}

// https://geometrygeeks.bike/bike/kona-rove-st-2019/
// 56
export const konaRoveStGeo = {
  bbDrop: 70,
  wheelbase: 1050,
  seatTubeLen: 560,
  // topTubeLenEffective: 579,
  topTubeLenActual: null,
  headTubeLen: 168,
  seatTubeAngle: 73,
  headTubeAngle: 71.5,
  chainstayLen: 435,
  wheelSize: WHEEL_SIZES['700c'],
  reach: 392,
  stack: 610,
}

// https://geometrygeeks.bike/bike/kona-rove-st-2019/
// 56
export const rawlandRavnGeo = {
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
  wheelSize: WHEEL_SIZES['700c'],
}


// https://geometrygeeks.bike/bike/trek-domane-alr-3-2018/
// 56
export const trekDomaneALR3 = {
  bbDrop: 78,
  wheelbase: 1008,
  seatTubeLen: 525,
  // topTubeLenEffective: 554,
  topTubeLenActual: null,
  headTubeLen: 175,
  seatTubeAngle: 73.3,
  headTubeAngle: 71.9,
  chainstayLen: 420,
  wheelSize: WHEEL_SIZES['700c'],
  reach: 377,
  stack: 591,
}

const testBikes = [
  {
    geo: somaDoubleCrossGeo,
    name: "Soma Double Cross Disc",
    enabled: true,
    color: COLORS[0],
  },
  {
    geo: konaRoveStGeo,
    name: "Kona Rove St",
    enabled: true,
    color: COLORS[1],
  },
  {
    geo: trekDomaneALR3,
    name: "Trek Domane ALR 3",
    enabled: true,
    color: COLORS[2],
  },
  {
    geo: somaWolverineGeo,
    name: "Soma Wolverine",
    enabled: true,
    color: COLORS[3],
  },
  {
    geo: otsoWarakinGeo,
    name: "Otso Warakin",
    enabled: true,
    color: COLORS[4],
  },
  {
    geo: rawlandRavnGeo,
    name: "Rawland Ravn",
    enabled: true,
    color: COLORS[5],
  },
];

export default testBikes;