import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { WHEEL_SIZES, COLORS } from './constants';

const initializeReact = (el, bikes) => { ReactDOM.render(<App bikes={bikes} />, el) }

const symbolizeRowName = (name) => {
  const dict = {
    "Reach": 'reach',
    "Stack": 'stack',
    "Seat Tube C-T": 'seatTubeLen',
    "Head Angle": 'headTubeAngle',
    "Seat Angle": 'seatTubeAngle',
    "Head Tube": 'headTubeLen',
    "Chainstay": 'chainstayLen',
    "Wheelbase": 'wheelbase',
    "BB Drop": 'bbDrop',
  }
  if (name in dict) {
    return dict[name];
  }
  return name;
}

const getBikeGeometries = (table) => {
  // remove the first column, trim the remaining
  let columnHeaders = Array.from(table.tHead.rows[0].cells).slice(1).map(cell => cell.textContent.trim())

  // remove the first "compare" row
  let rows = Array.from(table.tBodies[0].rows).slice(1)

  // create an array with an object for each bike
  let bikes = columnHeaders.reduce((arr, rowHeader, i) => {
    arr[i] = {
      name: rowHeader,
      values: {}
    }
    return arr;
  }, [])

  // remove the last "data source" row
  rows.slice(0, -1).forEach((row, i) => {
    // add geometry values to the bikes array
    const cells = Array.from(row.cells).map(cell => cell.textContent.trim());
    const rowName = symbolizeRowName(cells[0]);
    // remove the row label
    cells.slice(1).forEach((cell, j) => {
      bikes[j].values[rowName] = parseFloat(cell)
    })
  });

  // make sure to include wheel sizes
  bikes = bikes.map(bike => {
    if(!('wheelSize' in bike.values)) {
      bike.values['wheelSize'] = WHEEL_SIZES['700c']
    }
    return bike;
  })

  // convert to proper format
  bikes = bikes.map((g, i) => {
    return {
      geo: g.values,
      name: g.name,
      enabled: true,
      color: COLORS[i],
    }
  })

  return bikes;
}

const table = document.querySelector('#geometry-table .table:not(.fixed-column)') || document.querySelector('.table-responsive .table:not(.fixed-column)');

if(table) {
  const tableContainer = table.parentNode;
  const appContainer = document.createElement('div');
  tableContainer.insertBefore(appContainer, tableContainer.firstChild);
  const bikes = getBikeGeometries(table);
  initializeReact(appContainer, bikes);
}
