// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');

// model to test
import UserTeams from "../../../app/frontend/sources/user_teams";

var resourceId = 1;

describe('UserTeams', function() {
    this.slow(200);

    it('should list user teams', function(done) {
        UserTeams.index(null, resourceId)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });
});