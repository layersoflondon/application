// external libs
var assert = require('assert');
// model to test
import Search from "../../../app/frontend/sources/search";

var searchParams = {
    "q" : "Kai",
    "attachment_type" : [
        "Attachments::Url"
    ],
    "type":[],
    "theme": [
        "events"
    ]
}

describe('Search', function() {
    this.slow(200);

    it('should search records', function(done) {
        Search.index(searchParams)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

});