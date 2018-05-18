// external libs
var assert = require('assert');
var validate = require('jsonschema').validate;
var fs = require('fs');
var FormData = require('form-data');

var host = "localhost";
var auth = "test@error.agency:123456";
var path = "/records/1/attachments";
var port = 3000;

// model to test
import RecordAttachments from "../../../app/frontend/sources/record_attachments";

var schema = JSON.parse(fs.readFileSync('./test/frontend/schema/record_attachment.json'));
var resourceId = 1;
var createJSONUrl = {
    "attachment_type" : "url",
    "attachable_attributes" : {
        "title" : "title",
        "caption" : "caption",
        "credit" : "credit",
        "url" : "http://localhost:3000/records/1/attachments",
    }
};
var createJSONVideo = {
    "attachment_type" : "video",
    "attachable_attributes" : {
        "title" : "title",
        "caption" : "caption",
        "credit" : "credit",
        "youtube_id" : "123456",
    }
};
var updateJSON = {
    "attachment_type" : "url",
    "attachable_attributes" : {
        "title" : "title update",
        "caption" : "caption update",
        "credit" : "credit update ",
        "url" : "http://localhost:3000/records/1/attachments/update",
    }
};
// used when to store the created resource id to show, update and destroy later
var tempResourceId = null;

describe('RecordAttachments', function() {
    this.slow(200);

    it('should list record attachments', function(done) {
        RecordAttachments.index()
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(200, response.status);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should create a record attachment type dataset', function(done) {
        var formData = new FormData();
        formData.append('attachable_attributes[title]', 'title');
        formData.append('attachable_attributes[caption]', 'caption');
        formData.append('attachable_attributes[credit]', 'credit');
        formData.append('attachable_attributes[file]', fs.createReadStream('./test/frontend/schema/dummyfile.txt'));
        formData.append('attachment_type', 'dataset');
        formData.submit({
            host: host,
            path: path,
            auth: auth,
            port: port
        }, function(err, response) {
            if (200 == response.statusCode){
                assert.equal(200, response.statusCode);
                done();
            }else{
                done(new Error("Expected code 200, got: " + response.statusCode));
            }
        });
    });

    it('should create a record attachment type document', function(done) {
        var formData = new FormData();
        formData.append('attachable_attributes[title]', 'title');
        formData.append('attachable_attributes[caption]', 'caption');
        formData.append('attachable_attributes[credit]', 'credit');
        formData.append('attachable_attributes[file]', fs.createReadStream('./test/frontend/schema/dummyfile.txt'));
        formData.append('attachment_type', 'document');
        formData.submit({
            host: host,
            path: path,
            auth: auth,
            port: port
        }, function(err, response) {
            if (200 == response.statusCode){
                assert.equal(200, response.statusCode);
                done();
            }else{
                done(new Error("Expected code 200, got: " + response.statusCode));
            }
        });
    });

    // TODO: fix test - can create geodata for some reason about the naming with Geodata
    // error: uninitialized constant Attachments::Geodatum
    it.skip('should create a record attachment type geodata', function(done) {
        var formData = new FormData();
        formData.append('attachable_attributes[title]', 'title');
        formData.append('attachable_attributes[caption]', 'caption');
        formData.append('attachable_attributes[credit]', 'credit');
        formData.append('attachment_type', 'geodata');
        formData.append('file', fs.createReadStream('./test/frontend/schema/dummyfile.txt'));
        formData.submit({
            host: host,
            path: path,
            auth: auth,
            port: port
        }, function(err, response) {
            if (200 == response.statusCode){
                assert.equal(200, response.statusCode);
                done();
            }else{
                done(new Error("Expected code 200, got: " + response.statusCode));
            }
        });
    });

    it('should create a record attachment type image', function(done) {
        var formData = new FormData();
        formData.append('attachable_attributes[title]', 'title');
        formData.append('attachable_attributes[caption]', 'caption');
        formData.append('attachable_attributes[credit]', 'credit');
        formData.append('attachable_attributes[credit]', 'primary');
        formData.append('attachable_attributes[file]', fs.createReadStream('./test/frontend/schema/dummyimage.png'));
        formData.append('attachment_type', 'image');
        formData.submit({
            host: host,
            path: path,
            auth: auth,
            port: port
        }, function(err, response) {
            if (200 == response.statusCode){
                assert.equal(200, response.statusCode);
                done();
            }else{
                done(new Error("Expected code 200, got: " + response.statusCode));
            }
        });
    });

    it('should create a record attachment type url', function(done) {
        RecordAttachments.create(resourceId, createJSONUrl)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(createJSONUrl.attachable_attributes.title, response.data.title);
                assert.equal(createJSONUrl.attachable_attributes.caption, response.data.caption);
                assert.equal(createJSONUrl.attachable_attributes.credit, response.data.credit);
                assert.equal("Attachments::Url", response.data.attachable_type);
                assert.equal(null, response.data.content_type);
                assert.equal(createJSONUrl.attachable_attributes.url, response.data.url);
                tempResourceId  = response.data.id
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should create a record attachment type video', function(done) {
        RecordAttachments.create(resourceId, createJSONVideo)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                assert.equal(createJSONVideo.attachable_attributes.title, response.data.title);
                assert.equal(createJSONVideo.attachable_attributes.caption, response.data.caption);
                assert.equal(createJSONVideo.attachable_attributes.credit, response.data.credit);
                assert.equal("Attachments::Video", response.data.attachable_type);
                assert.equal(null, response.data.content_type);
                assert.equal(createJSONVideo.attachable_attributes.url, response.data.url);
                tempResourceId  = response.data.id
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should show a record attachment', function(done) {
        RecordAttachments.show(resourceId, tempResourceId)
            .then((response)=>{
                assert.equal("application/json; charset=utf-8", response.headers['content-type']);
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                // assert.equal(tempResourceId, response.data.id);
                assert.equal(createJSONVideo.attachable_attributes.title, response.data.title);
                assert.equal(createJSONVideo.attachable_attributes.caption, response.data.caption);
                assert.equal(createJSONVideo.attachable_attributes.credit, response.data.credit);
                assert.equal("Attachments::Video", response.data.attachable_type);
                assert.equal(null, response.data.content_type);
                assert.equal(createJSONVideo.attachable_attributes.url, response.data.url);
                done();
            })
            .catch((response) => {done(response);});
    });

    // TODO: doesn't update, just create another attachment. Action update needs to be fixed, is already placed a TODO there
    it.skip('should update a record attachment', function(done) {
        RecordAttachments.update(null, tempResourceId, updateJSON)
            .then((response)=>{
                assert.equal(validate(response.data, schema).errors.length, 0);
                assert.equal(200, response.status);
                // assert.equal(tempResourceId, response.data.id);
                assert.equal(updateJSON.attachable_attributes.title, response.data.title);
                assert.equal(updateJSON.attachable_attributes.caption, response.data.caption);
                assert.equal(updateJSON.attachable_attributes.credit, response.data.credit);
                assert.equal("Attachments::Url", response.data.attachable_type);
                assert.equal(null, response.data.content_type);
                assert.equal(updateJSON.attachable_attributes.url, response.data.url);
                done();
            })
            .catch((response) => {done(response);});
    });

    it('should delete a record attachment', function(done) {
        RecordAttachments.destroy(null, tempResourceId)
            .then((response)=>{
                assert.equal(204, response.status);
                done();
            })
            .catch((response) => { done(response);});
    });
});