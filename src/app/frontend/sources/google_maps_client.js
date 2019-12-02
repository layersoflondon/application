import * as googleMaps from "@google/maps";
//TODO key should be parameterised somewhere.
const _Promise = Promise;
const googleMapsClient = googleMaps.createClient({
    key: 'AIzaSyCydVQRqMrDm01QFe6mCAtySyZyxYx4aao',
    Promise: _Promise
});

export default class GoogleMapsClient {
    static addressLookUp(latitude, longitude){
        let latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};

        return googleMapsClient.reverseGeocode({latlng: latlng}).asPromise();
    }
}