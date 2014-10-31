/**
 * Created by thanh on 10/31/2014.
 */
var db = require('../../models');
module.exports = {
    loadForm18: function (req, res) {
        var info = req.body.info;
        db.Form18.findAll({}, {raw: true})
            .success(function (dataF18) {
                if (dataF18.length == 0) {
                    res.json({status: 'findNull'});
                }
                else {
                    var data = [
                        {"data": dataF18, "status": 'success'}
                    ];
                    res.json(data);
                }
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            })
    },
    insertForm18: function (req, res) {
        var info = req.body.info;
        db.Form18.max('GORGON_ID')
            .success(function (max_id) {
                var GORGON_ID = max_id + 1;
                db.Form18.create({
                    GORGON_ID: GORGON_ID,
                    PATIENT_ID: info.PATIENT_ID,
                    CAL_ID: info.CAL_ID,
                    DocId: info.DocId,
                    TIME_TEST: info.TIME_TEST,
                    WORK_COVER_NO: info.WORK_COVER_NO,
                    PERSON_ARRANGING_SIGNATURE: info.PERSON_ARRANGING_SIGNATURE,
                    PERSON_ARRANGING_NAME: info.PERSON_ARRANGING_NAME,
                    PERSON_ARRANGING_POSITION: info.PERSON_ARRANGING_POSITION,
                    DOCTOR_ID: info.DOCTOR_ID,
                    WORKER_SIGNATURE: info.WORKER_SIGNATURE
                }, {raw: true})
                    .success(function () {
                        res.json({status: 'success'});
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                        res.json({status: 'fail'});
                    })
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            })
    },
    editForm18: function (req, res) {
        var info = req.body.info;
        db.Form18.update({
            PATIENT_ID: info.PATIENT_ID,
            CAL_ID: info.CAL_ID,
            DocId: info.DocId,
            TIME_TEST: info.TIME_TEST,
            WORK_COVER_NO: info.WORK_COVER_NO,
            PERSON_ARRANGING_SIGNATURE: info.PERSON_ARRANGING_SIGNATURE,
            PERSON_ARRANGING_NAME: info.PERSON_ARRANGING_NAME,
            PERSON_ARRANGING_POSITION: info.PERSON_ARRANGING_POSITION,
            DOCTOR_ID: info.DOCTOR_ID,
            WORKER_SIGNATURE: info.WORKER_SIGNATURE
        }, {GORGON_ID: info.GORGON_ID})
            .success(function () {
                res.json({status: 'success'});
            })
            .error(function (err) {
                res.json({status: 'fail'});
            })
    }
}