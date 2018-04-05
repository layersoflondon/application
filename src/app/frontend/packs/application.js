/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import Record from '../sources/record';
import Collection from '../sources/collection';
import CollectionRecords from '../sources/collection_records';
import Team from '../sources/team';
import TeamUsers from '../sources/team_users';
import RecordAttachments from '../sources/record_attachments';

function eatest(response, status, id = null){
    if (response.status != status) {
        console.log("Expected", status, ' got:' , response.status);
    }
}
// // ####################################################
// // RECORD #############################################
// // ####################################################
// Record.index()
//     .then((response)=>{ eatest(response, 200);})
//     .catch((error) => {console.log("Request error: ", error);});
Record.create(null,
    {
        "record" : {
            "title" : "record title",
            "description" : "record description",
            "state" : "published",
            "lat" : 15,
            "lng" : 20,
            "date" : "2017-01-01"
        }
    }
).then((response)=>{
    eatest(response, 200);
    // Record.show(null, response.data.id)
    //     .then((response)=>{eatest(response, 200);})
    //     .catch((error) => {console.log("Request error: ", error);});
    Record.update(null, response.data.id,
            {
                "record" : {
                    "title" : "record title update",
                    "description" : "record description update",
                    "state" : "published",
                    "lat" : 15,
                    "lng" : 20,
                    "date" : "2017-01-01"
                }
            }
        )
        .then((response)=>{eatest(response, 200);})
        .catch((error) => {console.log("Request error: ", error);
    });
    // Record.destroy(null, response.data.id)
    //     .then((response)=>{eatest(response, 204);})
    //     .catch((error) => {console.log("Request error: ", error);
    // });
}).catch((error) => {console.log("Request error: ", error);});
// // ####################################################
// // COLLECTION #########################################
// // ####################################################
// Collection.index()
//     .then((response)=>{ eatest(response, 200);})
//     .catch((error) => {console.log("Request error: ", error);});
// Collection.create(null,
//     {
//         "collection" : {
//             "title" : "test",
//             "description" : "test description",
//             "read_state" : "public_read",
//             "write_state" : "everyone"
//         }
//     }
// ).then((response)=>{
//     eatest(response, 200);
//     Collection.show(null, response.data.id)
//         .then((response)=>{eatest(response, 200);})
//         .catch((error) => {console.log("Request error: ", error);});
//     Collection.update(null, response.data.id,
//         {
//             "collection" : {
//                 "title" : "test",
//                 "description" : "test description",
//                 "read_state" : "public_read",
//                 "write_state" : "everyone"
//             }
//         }
//     )
//         .then((response)=>{eatest(response, 200);})
//         .catch((error) => {console.log("Request error: ", error);});
//     Collection.destroy(null, response.data.id)
//         .then((response)=>{eatest(response, 204);})
//         .catch((error) => {console.log("Request error: ", error);});
// }).catch((error) => {console.log("Request error: ", error);});
// // ####################################################
// // COLLECTION RECORD ##################################
// // ####################################################
// var collection_id = 1;
// CollectionRecords.index(collection_id)
//     .then((response)=>{ eatest(response, 200);})
//     .catch((error) => {console.log("Request error: ", error);});
// CollectionRecords.create(collection_id,
//     {
//         "id" : 1
//     }
// ).then((response)=>{
//     eatest(response, 200);
//     CollectionRecords.destroy(collection_id, response.data[0].id)
//         .then((response)=>{eatest(response, 204);})
//         .catch((error) => {console.log("Request error: ", error);});
// }).catch((error) => {console.log("Request error: ", error);});
// // ####################################################
// // TEAM ###############################################
// // ####################################################
// Team.index()
//     .then((response)=>{ eatest(response, 200);})
//     .catch((error) => {console.log("Request error: ", error);});
// Team.create(
//     null,
//     {
//         "team" : {
//             "name" : "test",
//             "description" : "test description"
//         }
//     }
// ).then((response)=>{
//     eatest(response, 200);
//     Team.show(null, response.data.id)
//         .then((response)=>{eatest(response, 200);})
//         .catch((error) => {console.log("Request error: ", error);});
//     Team.update(null, response.data.id,
//             {
//                 "team" : {
//                     "name" : "test",
//                     "description" : "test description"
//                 }
//             }
//         )
//         .then((response)=>{eatest(response, 200);})
//         .catch((error) => {console.log("Request error: ", error);
//     });
//     Team.destroy(null, response.data.id)
//         .then((response)=>{eatest(response, 204);})
//         .catch((error) => {console.log("Request error: ", error);
//     });
// }).catch((error) => {console.log("Request error: ", error);});
// // ####################################################
// // TEAM USERS #########################################
// // ####################################################
// var team_id = 1;
// TeamUsers.index(team_id)
//     .then((response)=>{ eatest(response, 200);})
//     .catch((error) => {console.log("Request error: ", error);});
// TeamUsers.create(team_id,
//     {
//         "id" : 2
//     }
// ).then((response)=>{
//     eatest(response, 200);
//     TeamUsers.destroy(team_id, response.data[response.data.length - 1].id)
//         .then((response)=>{eatest(response, 204);})
//         .catch((error) => {console.log("Request error: ", error.response.body);});
// }).catch((error) => {console.log("Request error: ", error);});
// // ####################################################
// // RECORD ATTACHMENTS #################################
// // ####################################################
// var record_id = 1;
// RecordAttachments.index(record_id)
//     .then((response)=>{ eatest(response, 200);})
//     .catch((error) => {console.log("Request error: ", error);});
// RecordAttachments.create(record_id,
//     {
//         "attachment_type" : "url",
//         "attachable_attributes" : {
//             "title" : "title",
//             "caption" : "caption",
//             "description" : "description",
//             "url" : "http://localhost:3000/records/1/attachments",
//         }
//     }
// ).then((response)=>{
//     eatest(response, 200);
//     RecordAttachments.destroy(record_id, response.data[response.data.length - 1].id)
//         .then((response)=>{eatest(response, 204);})
//         .catch((error) => {console.log("Request error: ", error.response.body);});
// }).catch((error) => {console.log("Request error: ", error);});
// to test following snippet we should remove the default format of the route -defaults: {format: :json}- and
// add upload new file via form in http://localhost:3000/records/1/attachments/new and add new action
// document.addEventListener('DOMContentLoaded', () => {
//     var output = document.getElementById('output');
//     document.getElementById('upload').onclick = function () {
//         var data = new FormData();
//         data.append('attachable_attributes[title]', 'title');
//         data.append('attachable_attributes[caption]', 'caption');
//         data.append('attachable_attributes[credit]', 'credit');
//         data.append('attachable_attributes[description]', 'description');
//         data.append('attachment_type', 'dataset');
//         data.append('file', document.getElementById('file').files[0]);
//         RecordAttachments.create(1, data).then((response)=>{
//             eatest(response, 200);
//             RecordAttachments.destroy(record_id, response.data[response.data.length - 1].id)
//                 .then((response)=>{eatest(response, 204);})
//                 .catch((error) => {console.log("Request error: ", error.response.body);});
//         }).catch((error) => {console.log("Request error: ", error);});
//     };
// });



import CardStore from '../stores/card_store';
import MapViewStore from '../stores/map_view_store';
import TrayViewStore from '../stores/tray_view_store';

import Main from '../components/main';

import faker from 'faker';

const cards = [
  {
    id: 1,
    name: `${faker.commerce.productName()}`,
    description: faker.lorem.paragraphs(2),
    image: faker.image.dataUri(),
    is_collection: false,
    period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`,
    position: [51.1, -0.11]
  },
  {
    id: 2,
    name: `${faker.commerce.productName()}`,
    description: faker.lorem.paragraphs(2),
    image: faker.image.dataUri(),
    is_collection: true,
    records: [
      {id: 2, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.21, -0.51]},
      {id: 3, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.41, -0.59]},
      {id: 4, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [51.81, -0.39]},
      {id: 5, name: `${faker.commerce.productName()} record!`, period: `${faker.hacker.noun()} to ${faker.hacker.ingverb()}`, description: faker.lorem.paragraphs(2), image: faker.image.dataUri(), position: [50.91, -0.49]}
    ]
  }
];

/**
 * Create a CardStore from our dummy data, a TrayViewStore to pass
 * into the React App, and set the initial data for the trayViewStore
 * which will be rendered in the Tray component
 */

const cardStore = CardStore.fromJS(cards);
const trayViewStore = new TrayViewStore();
trayViewStore.cardStore = cardStore;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render( <Main trayViewStore={trayViewStore} />, document.getElementById("map-root") );
});

