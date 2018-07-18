// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import CollectionRecords from "../../../app/frontend/sources/collection_records";

var resourceId = 1;
var createJSON = {
    "id" : 1
};

// used when to store the created resource id to show, update and destroy later
var tempResourceId = null;

describe('CollectionRecords', function() {
    this.slow(200);
    this.timeout(10000);

    it('should list collections', function(done) {
        CollectionRecords.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should link a record to a collection', function(done) {
        CollectionRecords.create(resourceId, createJSON)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                var collectionRecords = response.data;
                tempResourceId  = collectionRecords[collectionRecords.length - 1].id;
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should unlink record from collection', function(done) {
        CollectionRecords.destroy(null, tempResourceId)
            .then((response)=>{
                assert.equal(204, response.status);
                done();
            })
            .catch((response) => { done(response);});
    });
});