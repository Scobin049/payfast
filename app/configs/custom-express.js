const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');

module.exports = function(){
    var app = express();
    
    app.use(bodyParser.json());    
    consign().
    include('app/controllers').
    then('app/models').
    then('server').
    into(app);
    
    return app;
}