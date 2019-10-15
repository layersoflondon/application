const getStyle = (colour) => {
  const style = {color: '#000000', opacity: 0.6, fillColor: '#43585d', stroke: true, weight: 2, dashArray: null, dashOffset: 0};

  switch (colour) {
    case 'black':
      style.fillColor = '#302b27';
      style.className = 'drawn-polygon-black';
      break;
    case 'blue-hatched':
      style.fillColor = '#43585d';
      // style.dashArray = '5 5';
      style.color = '#325470';
      style.className = 'drawn-polygon-blue-hatched';
      break;
    case 'red-soft':
      style.fillColor = '#b56355';
      style.className = 'drawn-polygon-red-soft';
      break;
    case 'red-hatched':
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
    case 'yellow-hatched':
      style.fillColor = '#eaa349';
      style.color = '#ef8a29';
      // style.dashArray = '5 5';
      style.opacity = 0.9;
      break;
    case 'unknown':
      style.fillColor = 'white';
      break;
  }

  return style;
};

export {getStyle};