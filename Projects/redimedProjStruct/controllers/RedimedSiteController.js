/**
 * Created by meditech on 25/09/2014.
 */
var db = require('../models');
module.exports = {
    list: function(req,res){
        db.RedimedSite.findAll({},{raw:true})
            .success(function(data){

                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    }
};