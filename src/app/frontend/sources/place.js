import axios from 'axios';

export default class Place {
  static search(query, options = {}) {
    const regionUrlComponent = "&countrycodes=" + (options.region || 'gb');

    let boundsUrlComponent = '';

    if (options.bounds) { // default bounding box from application.rb (left, bottom, right, top)
      boundsUrlComponent = "&bounded=1&viewbox=" + (options.bounds || '-0.55343,51.24988,0.33233,51.72617');
    }

    const url = `//nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}${regionUrlComponent}&q=${query}`;
    return axios.get(url);
  }
}

window.Place = Place;