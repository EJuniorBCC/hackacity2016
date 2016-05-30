module.exports = function(app) {
 
    var AlunosCtrl = require('./controllers/alunosCtrl')(app);
    var EscolasCtrl = require('./controllers/escolas_completoCtrl')(app);
   


    

    return {
        setup: function() {

            


            app.post('/app/aluno/insert', AlunosCtrl.insert);
            app.get('/app/aluno/list/:idUser', AlunosCtrl.index);
            app.get('/app/aluno/list', AlunosCtrl.index);
            app.post('/app/aluno/insert/points', AlunosCtrl.import);


            app.post('/app/escolas/insert', EscolasCtrl.insert);
            //app.get('/app/escolas/list/:idEscola', EscolasCtrl.index);
            app.post('/app/escolas/getNumeroVagas', EscolasCtrl.getNumeroVagas);
            app.post('/app/escolas/getescola', EscolasCtrl.getEscola);


        }
    }
}
