// external libs
var assert = require('assert');
// model to test
import Search from "../../../app/frontend/sources/search";

var searchParams = {
    "attachment_type" : [
        "Attachments::Url"
    ],

    "geobounding": {
        "top_left": {
            "lat": 60.00,
            "lng": -30.00
        },
        "bottom_right" : {
            "lat" : 30.00,
            "lng" : 40.00
        }
    }
}


describe('Search', function() {
    this.slow(200);

    it('should search records', function(done) {
        Search.perform(searchParams)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

});