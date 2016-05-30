module.exports = function(app) {

    var needle = require('needle');
    var aluno = require('../models/alunosResultado');


    var importAction = {

        index: function(req, res) {

        },

        

        insert: function(req, res) {


          var data = req.body.data;

          res.json({
            data:data
          });
            

        },


        import: function(req, res) {


           

        },

        update: function(req, res) {


        }
    }

    return importAction;
}