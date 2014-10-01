/**
 * Created by meditech on 01/10/2014.
 */
var db = require('../models');

module.exports = {
    headerList: function(req,res){
        db.sequelize.query('SELECT * FROM assessment_headers',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
    },
    getAssessment: function(req,res){
        var headId = req.body.id;
        db.sequelize.query('SELECT * FROM assessments',null,{raw:true})
            .success(function(data){
                res.json(data);
            })
    }
};