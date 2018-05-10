// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import Layer from "../../../app/frontend/sources/layer";

var schema = JSON.parse(fs.readFileSync('./test/frontend/schema/layer.json'));

// used when to store the created resource id to show, update and destroy later
var tempResourceId = 1;

describe('Layer', function() {
    this.slow(200);

    it('should list layers', function(done) {
        Layer.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should show a layer', function(done) {
        Layer.show(null, tempResourceId)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(tempResourceId, response.data.id);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should search layers', function(done) {
        Layer.search('query=test')
            .then((response)=>{
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });


});