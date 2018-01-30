const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

module.exports = function(){
    var app = express();    
    app.use(bodyParser.json());    
    app.use(expressValidator());

    consign({cwd:'app'}).include('controllers').then('models').then('server').into(app);

    return app;
}