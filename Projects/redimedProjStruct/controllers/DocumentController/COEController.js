var db = require('../../models');

module.exports = {
    insertCOE : function(req,res){
        var info = req.body.info;
        db.COE.max('coe_id')
            .success(function(max){
                var id = max + 1;
                db.COE.create({
                    coe_id: id,
                    DocId: info.DocId,
                    DOCTOR_ID: info.DOCTOR_ID,
                    CalId: info.CalId,
                    PatientId: info.PatientId,
                    isEmployed: info.isEmployed,
                    dateEmployed: info.dateEmployed,
                    inPosition: info.inPosition,
                    Signature1: info.Signature1,
                    coeName: info.coeName,
                    coeTitle: info.coeTitle,
                    coeDate: info.coeDate,
                    Signature2: info.Signature2
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

    },
    updateCOE: function(req,res){
        var info = req.body.info;
        db.COE.update({
            coe_id: info.coe_id,
            DocId: info.DocId,
            DOCTOR_ID: info.DOCTOR_ID,
            isEmployed: info.isEmployed,
            dateEmployed: info.dateEmployed,
            inPosition: info.inPosition,
            Signature1: info.Signature1,
            coeName: info.coeName,
            coeTitle: info.coeTitle,
            coeDate: info.coeDate,
            Signature2: info.Signature2
        },{PatientId:info.PatientId,CalId : info.CalId})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error',err:err});
                console.log(err);
            })
    },
    checkCOE: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.COE.find({where:{PatientId:Patient_Id,CalId : CalId}})
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    console.log(data);
                    res.json(data);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};