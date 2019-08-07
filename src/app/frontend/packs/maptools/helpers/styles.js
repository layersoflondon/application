const getStyle = (colour) => {
  const style = {color: 'blue', opacity: 0.6, fillColor: 'blue', stroke: true, weight: 2, dashArray: null, dashOffset: 0};

  switch (colour) {
    case 'black':
      style.color = 'black';
      style.fillColor = 'black';
      break;
    case 'blue-hatched':
      style.color = 'royalblue';
      style.fillColor = 'royalblue';
      style.dashArray = '10 10';
      break;
    case 'red-soft':
      style.color = 'salmon';
      style.fillColor = 'salmon';
      break;
    case 'red-hatched':
      style.color = 'orangered';
      style.fillColor = 'orangered';
      style.dashArray = '10 10';
      break;
    case 'red':
      style.color = 'red';
      style.fillColor = 'red';
      break;
    case 'yellow':
      style.color = 'yellow';
      style.fillColor = 'yellow';
      break;
    case 'yellow-hatched':
      style.color = 'chocolate';
      style.fillColor = 'yellow';
      style.dashArray = '10 10';
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