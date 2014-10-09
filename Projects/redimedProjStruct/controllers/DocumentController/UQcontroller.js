var db = require('../../models');

module.exports = {

    insertUQ: function(req,res){
        var info = req.body.info;

        console.log(info);

        db.gorgonUQ.max('Quest_Id')
            .success(function(max){
                var id = max + 1;
                db.gorgonUQ.create({
                    Quest_Id : id,
                    Patient_Id : info.Patient_Id,
                    Height : info.height,
                    Weight :   info.weight
                },{raw:true})
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            }).error(function(err){
                console.log(err);
            })


    }


};