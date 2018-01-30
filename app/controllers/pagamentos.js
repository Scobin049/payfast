module.exports = function(app){
    app.get('/pagamentos', function(req, res){
        res.send('pagamentos');
    });
    
    app.post('/pagamentos/receber_pagamento', function(req, res){
        console.log('receber_pagamento: Processando req.');

        req.assert("forma_de_pagamento","Forma de pagamento é obrigatório").notEmpty();
        req.assert("valor","Valor é obrigatório").notEmpty();
        req.assert("valor","Valor deve ser um decimal").isFloat();

        var erros = req.validationErrors();

        if(erros){
            console.log('Erro validação');
            res.status(400).json({"erros":erros});
            return ;
        }

        var pagamento = req.body;
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;
        
        pgDAO.salva(pagamento, function(erro, result){
            if(erro){
                res.status(500).json(erro);
                console.log('erro pag');
            }
            else{
                console.log('pag. criado');
                res.location('/pagamentos/pagamento/' + result.insertId);
                res.status(201).json(pagamento);
            }            
        });
    });
}