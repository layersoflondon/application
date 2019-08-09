const getStyle = (colour) => {
  const style = {color: '#43585d', opacity: 0.6, fillColor: '#43585d', stroke: true, weight: 2, dashArray: null, dashOffset: 0};

  switch (colour) {
    case 'black':
      style.color = '#302b27';
      style.fillColor = '#302b27';
      style.className = 'drawn-polygon-black';
      break;
    case 'blue-hatched':
      style.color = '#43585d';
      style.fillColor = '#43585d';
      style.dashArray = '5 5';
      style.className = 'drawn-polygon-blue-hatched';
      break;
    case 'red-soft':
      style.color = '#b56355';
      style.fillColor = '#b56355';
      style.className = 'drawn-polygon-red-soft';
      break;
    case 'red-hatched':
      style.color = '#e3513d';
      style.fillColor = '#e3513d';
      style.dashArray = '5 5';
      style.className = 'orangered';
      break;
    case 'red':
      style.color = '#e3513d';
      style.fillColor = '#e3513d';
      break;
    case 'yellow':
      style.color = '#eaa349';
      style.fillColor = '#eaa349';
      break;
    case 'yellow-hatched':
      style.color = '#eaa349';
      style.fillColor = '#eaa349';
      style.dashArray = '5 5';
      style.opacity = 0.9;
      break;
    case 'unknown':
      style.color = 'white';
      style.fillColor = 'white';
      break;
  }

  return style;
};

export {getStyle};