/**
 * Created by meditech on 29/09/2014.
 */
var db = require('../models');
module.exports = {
    userByCompany: function(req,res){
        var comId = req.body.comId;

        db.User.findAll({where:{company_id:comId}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:err});
            })
    }
}