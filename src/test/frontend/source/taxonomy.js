// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import Taxonomy from "../../../app/frontend/sources/taxonomy";

describe('Taxonomy', function() {
    this.slow(200);

    it('should list taxonomies', function(done) {
        Taxonomy.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });
});