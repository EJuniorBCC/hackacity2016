module.exports = function(app) {

    var needle = require('needle');
    var escola = require('../models/escolasCompleto');
    var numeroVagas = require('../models/alunosResultado');
    var jsonfile = require('jsonfile');

    var importAction = {

        getNumeroVagas: function(req, res) {
            

            var query = {
                inep_escola:req.body.inep_escola
            }

           
        },

        

        insert: function(req, res) {

        },


        getEscola: function(req, res) {

            var latitude = req.body.latitude;

            var longitude = req.body.longitude;

            var raio = req.body.raio;

            var query = {

            };

            var modalidade = req.body.modalidade;

            if(req.body.laboratorio == 1){
                query.dependencia_laboratorio_informatica = 1
            }

            

            if(modalidade == 0){

                
                query.modalidade_regular=1
                

            }else if(modalidade == 1){

                
                query.modalidade_especial=1
                

            }else if(modalidade == 2){

                
                query.modalidade_eja=1
                

            }else if(modalidade == 3){

                
                query.regular_creche=1
                
            }

            console.log(query);

            
            query.loc = {

                $geoWithin: { $centerSphere: [ [latitude, longitude], raio/6378.1 ] }

            }

            console.log(raio);

            

            escola.find(query, function(err, data){
                if(err){
                    res.json({data: err});
                } else{
                    res.json({data : data});
                }
            })


  

        },

        update: function(req, res) {


        }
    }

    return importAction;
}