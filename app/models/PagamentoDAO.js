function PagamentoDAO(connection){
    this._connection = connection;
}

PagamentoDAO.prototype.salva = function (pagamento, callback){
    this._connection.query('insert into pagamentos set ?', pagamento, callback);
}

PagamentoDAO.prototype.lista = function (callback){
    this._connection.query('select * form pagamentos', callback);
    
}

PagamentoDAO.prototype.listaPorID = function (id, callback){
    this._connection.query('select * form pagamentos where id = ' + id, callback);
}

module.exports = function(){
    return PagamentoDAO;
}
