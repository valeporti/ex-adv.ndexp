'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const mongo       = require('mongodb').MongoClient;
const session     = require('express-session');

//modules
const routes = require('./routes.js');
const auth = require('./auth.js');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Add PUG
app.set('view engine', 'pug');

mongo.connect(process.env.DATABASE, (err, db) => {
    if(err) {
        console.log('Database error: ' + err);
    } else {
        console.log('Successful database connection');
        //initialize desired modules
        auth(app, db);
        routes(app, db);
      
      app.listen(process.env.PORT || 3000, () => {
        console.log("Listening on port " + process.env.PORT);
      });

}});
