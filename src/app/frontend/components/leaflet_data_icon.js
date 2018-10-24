import {Leaflet} from 'react-leaflet';
import L from 'leaflet';

export default class LeafletDataIcon extends L.Icon {
  _setIconStyles(img, name) {
    L.Icon.prototype._setIconStyles.call(this, img, name);

    if (this.options.trackingMarker) {
      img.dataset.trackingMarker = this.options.trackingMarker;
    }
  }
}