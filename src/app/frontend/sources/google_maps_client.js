import * as googleMaps from "@google/maps";

//TODO key should be parameterised somewhere.
const googleMapsClient = googleMaps.createClient({
    key: 'AIzaSyBYQAlihqinmVyyMz9fZNHJ5ZFrFGY7lgY',
    Promise: Promise
});

export default class GoogleMapsClient {

    static addressLookUp(latitude, longitude){
        var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};

        return googleMapsClient.reverseGeocode({latlng: latlng}).asPromise();
    }

    static lookupPlace(query) {
    }
}
