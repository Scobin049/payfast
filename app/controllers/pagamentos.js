module.exports = function(app){
    app.get('/pagamentos', function(req, res){
        res.send('pagamentos');
    });

    app.post('/pagamentos/receber_pagamento', function(req, res){
        var pagamento = req.body;
        console.log('receber_pagamento: Processando req.');

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);

        pgDAO.salva(pagamento, function(erro, result){
            console.log('Salva pagamento');
            res.json(pagamento);
        });
    });
}
