var restify = require('restify-clients');

function cartoesClient() {
    this._client = restify.createJsonClient({
        url: 'http://localhost:3001',
        version: '~1.0'
    });
}

cartoesClient.prototype.autoriza = function(cartao, callback) {
    this._client.post('/cartoes/autoriza', cartao, callback);
}

module.exports = function(){
    return cartoesClient;
};