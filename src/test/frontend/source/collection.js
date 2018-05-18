// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import Collection from "../../../app/frontend/sources/collection";

var schema = JSON.parse(fs.readFileSync('./test/frontend/schema/collection.json'));
var createJSON = {
    "collection" : {
        "title" : "test",
        "description" : "test description",
        "read_state" : "public_read",
        "write_state" : "everyone",
        "owner_id" : 1,
        "owner_type" : "User"
    }
};
var updateJSON = {
    "collection" : {
        "title" : "test update",
        "description" : "test description update",
        "read_state" : "private_read",
        "write_state" : "team",
        "write_state_team_id" : 1,
        "owner_id" : 1,
        "owner_type" : "User"
    }
};
// used when to store the created resource id to show, update and destroy later
var tempResourceId = null;

describe('Collection', function() {
    this.slow(200);

    it('should list collections', function(done) {
        Collection.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should create a collection', function(done) {
        Collection.create(null, createJSON)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(createJSON.collection.title, response.data.title);
                assert.equal(createJSON.collection.description, response.data.description);
                assert.equal(createJSON.collection.read_state, response.data.read_state);
                assert.equal(createJSON.collection.write_state, response.data.write_state);
                tempResourceId  = response.data.id;
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should show a collection', function(done) {
        Collection.show(null, tempResourceId)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(tempResourceId, response.data.id);
                assert.equal(createJSON.collection.title, response.data.title);
                assert.equal(createJSON.collection.description, response.data.description);
                assert.equal(createJSON.collection.read_state, response.data.read_state);
                assert.equal(createJSON.collection.write_state, response.data.write_state);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should update a collection', function(done) {
        Collection.update(null, tempResourceId, updateJSON)
            .then((response)=>{
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(tempResourceId, response.data.id);
                assert.equal(updateJSON.collection.title, response.data.title);
                assert.equal(updateJSON.collection.description, response.data.description);
                assert.equal(updateJSON.collection.read_state, response.data.read_state);
                assert.equal(updateJSON.collection.write_state, response.data.write_state);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should delete a collection', function(done) {
        Collection.destroy(null, tempResourceId)
            .then((response)=>{
                assert.equal(204, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });
});