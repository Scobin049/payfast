module.exports = function(app){
    
    app.get('/pagamentos', function(req, res){
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);

        pgDAO.lista(function(erro, result){
            if(erro){
                res.status(500).json(erro);
                console.log('erro lista pag');
            }
            else{
                console.log('pag. lista');
                res.status(201).json(result);
            }            
        });        
    });

    app.get('/pagamentos/pagamento/:id', function(req, res){
        var id = req.params.id;
        var pagamento = {};
        
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);        
        pagamento.id = id;
        
        pgDAO.listaPorID(pagamento, function(erro, result){
            if(erro){
                res.status(500).json(erro);
                console.log('erro lista ID');
            }
            else{
                console.log('pag. lista ID');
                res.status(201).json(result);
            }            
        });
    });
    
    app.post('/pagamentos/criar_pagamento', function(req, res){
        console.log('criar_pagamento: Processando req.');
        
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
    
    app.put('/pagamentos/pagamento/:id', function(req, res){
        var id = req.params.id;
        var pagamento = {};
        
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);
        
        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';
        
        pgDAO.atualiza(pagamento, function(erro){
            if(erro){
                res.status(500).json(erro);
                console.log('erro pag');
            }
            else{
                console.log('pag. atualizado');
                res.status(201).json(pagamento);
            }            
        });
    });
    
    app.delete('/pagamentos/pagamento/:id', function(req, res){
        var id = req.params.id;
        var pagamento = {};
        
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);
        
        pagamento.id = id;
        pagamento.status = 'CANCELADO';
        
        pgDAO.atualiza(pagamento, function(erro){
            if(erro){
                res.status(500).json(erro);
                console.log('erro pag');
            }
            else{
                console.log('pag. cancelado');
                res.status(201).json(pagamento);
            }            
        });
    });
}
