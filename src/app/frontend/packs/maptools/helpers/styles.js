const styleNames = [
  'black',
  'blue',
  'blue-hatched',
  'bluehatched',
  'red-soft',
  'redsoft',
  'red-hatched',
  'redhatched',
  'red',
  'yellow',
  'unknown'
];

const getStyle = (colour) => {
  const style = {color: '#000000', opacity: 0.6, fillColor: '#43585d', stroke: true, weight: 2, dashArray: null, dashOffset: 0};

  switch (colour) {
    case 'black':
      style.fillColor = '#302b27';
      style.className = 'drawn-polygon-black';
      break;
    case 'blue':
    case 'blue-hatched':
    case 'bluehatched':
      style.fillColor = '#43585d';
      // style.dashArray = '5 5';
      style.color = '#325470';
      style.className = 'drawn-polygon-blue-hatched';
      break;
    case 'red-soft':
    case 'redsoft':
      style.fillColor = '#b56355';
      style.className = 'drawn-polygon-red-soft';
      break;
    case 'red-hatched':
    case 'redhatched':
      style.fillColor = '#e3513d';
      // style.dashArray = '5 5';
      style.color = '#ea232b';
      style.className = 'orangered';
      break;
    case 'red':
      style.fillColor = '#e3513d';
      break;
    case 'yellow':
      style.fillColor = '#eaa349';
      break;
    case 'unknown':
      style.fillColor = 'white';
      break;
  }

  return style;
};

export {getStyle, styleNames};