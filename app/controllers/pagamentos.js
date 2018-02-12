module.exports = function(app){
    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";
    
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
        req.assert("pagamento.forma_de_pagamento","Forma de pagamento é obrigatório").notEmpty();
        req.assert("pagamento.valor","Valor é obrigatório").notEmpty();
        req.assert("pagamento.moeda","Moeda é obrigatório").notEmpty();
        
        var erros = req.validationErrors();
        
        if(erros){
            console.log('Erro validação');
            res.status(400).json({"erros":erros});
            return ;
        }
        
        var pagamento = req.body['pagamento'];
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);
        
        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date;
        
        if(pagamento.forma_de_pagamento == 'cartao'){
            var cartao = req.body["cartao"];
            console.log(cartao);
            
            var cartoesClient = new app.services.cartoesClient();
            
            cartoesClient.autoriza(cartao, function(exception, request, response, retorno){
                if(exception){
                    console.log(exception);
                    res.status(400).send(exception);
                    return;
                }
                console.log(retorno);
                
                var response = {
                    dados_do_pagamanto: pagamento,
                    cartao: retorno                    
                }
                res.status(201).json(response);
                return;
            });
        }
        else{
            pgDAO.salva(pagamento, function(erro, result){
                if(erro){
                    res.status(500).json(erro);
                    console.log('erro pag');
                }
                else{
                    pagamento.id = result.insertId;
                    console.log('pag. criado');
                    res.location('/pagamentos/pagamento/' + pagamento.id);
                    var response = {
                        dados_pag : pagamento,
                        links : [
                            {
                                href : "localhost:3000/pagamentos/pagamento/"+pagamento.id,
                                rel : "confirmar",
                                method: "PUT"
                            },
                            {
                                href : "localhost:3000/pagamentos/pagamento/"+pagamento.id,
                                rel : "cancelar",
                                method : "DELETE"
                            }
                        ]
                        
                    }
                    
                    res.status(201).json(response);
                }            
            });
        }    
    });    
    
    app.put('/pagamentos/pagamento/:id', function(req, res){
        var id = req.params.id;
        var pagamento = {};
        
        var connection = app.server.connection();
        var pgDAO = new app.models.PagamentoDAO(connection);
        
        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;
        
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
        pagamento.status = PAGAMENTO_CANCELADO;
        
        pgDAO.atualiza(pagamento, function(erro){
            if(erro){
                res.status(500).json(erro);
                console.log('erro pag');
            }
            else{
                console.log('pag. cancelado');
                res.status(204).json(pagamento);
            }            
        });
    });
}