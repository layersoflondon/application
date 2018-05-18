// external libs
var assert = require('assert');

// model to test
import GoogleMapsClientTest from "../../../app/frontend/sources/google_maps_client";

var lat1 = 41.3735319;
var lng1 = 2.114039400000024;
var add1 = 'Carrer de Ferré, 57, 08904 L\'Hospitalet de Llobregat, Barcelona, Spain';
var lat2 = 42.34769368239691;
var lng2 = -3.69908757724761;
var add2 = 'Calle del Padre Melchor Prieto, 20, 09005 Burgos, Spain';

describe('GoogleMapsClient', function() {
    this.slow(300);

    it('should look up for address one', function(done) {

        GoogleMapsClientTest.addressLookUp(lat1, lng1)
            .then((response) => {
                if ( ! response.json.results.length ) {
                    done(new Error("No results"));
                }
                assert.equal(add1, response.json.results[0].formatted_address);
                done();
            })
            .catch((error) => {
                done(error);
            });

    });
    it('should look up for address two', function(done) {

        GoogleMapsClientTest.addressLookUp(lat2, lng2)
            .then((response) => {
                if ( ! response.json.results.length ) {
                    done(new Error("No results"));
                }
                assert.equal(add2, response.json.results[0].formatted_address);
                done();
            })
            .catch((error) => {
                done(error);
            });
    });
});