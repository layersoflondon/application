// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import Team from "../../../app/frontend/sources/team";

var schema = JSON.parse(fs.readFileSync('./test/frontend/schema/team.json'));
var createJSON = {
    "team" : {
        "name" : "test",
        "description" : "test description"
    }
};
var updateJSON = {
    "team" : {
        "name" : "test update",
        "description" : "test description update"
    }
};
// used when to store the created resource id to show, update and destroy later
var tempResourceId = null;

describe('Team', function() {
    this.slow(200);

    it('should list teams', function(done) {
        Team.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should create a team', function(done) {
        Team.create(null, createJSON)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(createJSON.team.name, response.data.name);
                assert.equal(createJSON.team.description, response.data.description);
                tempResourceId  = response.data.id;
                done();
            })
            .catch((response) => {
                console.log(response);
                done(response);});
    });

    it('should show a team', function(done) {
        Team.show(null, tempResourceId)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(createJSON.team.name, response.data.name);
                assert.equal(createJSON.team.description, response.data.description);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should update a team', function(done) {
        Team.update(null, tempResourceId, updateJSON)
            .then((response)=>{
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(updateJSON.team.name, response.data.name);
                assert.equal(updateJSON.team.description, response.data.description);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should delete a team', function(done) {
        Team.destroy(null, tempResourceId)
            .then((response)=>{
                assert.equal(204, response.status);
                done();
            })
            .catch((response) => { done(response);});
    });
});