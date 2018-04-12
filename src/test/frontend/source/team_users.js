// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import TeamUsers from "../../../app/frontend/sources/team_users";

var resourceId = 1;
var createJSON = {
    "id" : 2
};

// used when to store the created resource id to show, update and destroy later
var tempResourceId = null;

describe('TeamUsers', function() {
    this.slow(200);

    it('should list team users', function(done) {
        TeamUsers.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should add an user to a team', function(done) {
        TeamUsers.create(resourceId, createJSON)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                var collectionRecords = response.data;
                tempResourceId  = collectionRecords[collectionRecords.length - 1].id;
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should remove an user from team', function(done) {
        TeamUsers.destroy(null, tempResourceId)
            .then((response)=>{
                assert.equal(204, response.status);
                done();
            })
            .catch((response) => { done(response);});
    });
});