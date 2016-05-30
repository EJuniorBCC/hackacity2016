module.exports = function(app) {

    var rede = require('../models/redeDeEducacao');
    var needle = require('needle');
    var aluno = require('../models/alunosResultado');


    var importAction = {

        index: function(req, res) {
            aluno.find({}, function(err, data){
                if(err){
                    res.json({data: err});
                } 

                    res.json({data: data});
            })
        },

        

        insert: function(req, res) {


            needle.get('http://dados.recife.pe.gov.br/storage/f/2013-07-15T05%3A19%3A48.752Z/educacaomunicipal.geojson',function(err,data){
                if(err){
                    console.log(err);
                }else{
                    var data = JSON.parse(data.body);
                   
                   
                   rede.collection.insertMany(data.features,function(err,data){
                        if(err){
                            res.json({
                                erro:err
                            });
                        }else{
                            res.json({
                                data:data
                            });
                        }
                   });

                

                
                
                }
            });




            

        },


        import: function(req, res) {

            var arr = req.body.arr;
            console.log(arr[0]);

           

        },

        update: function(req, res) {


        }
    }

    return importAction;
}