/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
module.exports = {
    loadSA1: function (req, res) {
        var info = req.body.info; //get id find
        db.headersSACLN.findAll({where: {patient_id: info.patient_id, CAL_ID: info.CAL_ID, SA_ID: 3}}, {raw: true})
            .success(function (dataH) {
                db.sectionsSACLN.findAll({where: {patient_id: info.patient_id, CAL_ID: info.CAL_ID, SA_ID: 3}}, {raw: true})
                    .success(function (dataS) {
                        db.linesSACLN.findAll({where: {patient_id: info.patient_id, CAL_ID: info.CAL_ID, SA_ID: 3}}, {raw: true})
                            .success(function (dataL) {
                                db.Patient.findAll({where: {patient_id: info.patient_id}}, {raw: true})
                                    .success(function (patient) {
                                        if (0 === dataH.length || 0 === dataS.length || 0 === dataL.length) {
                                            //find null
                                            //get information in sys table
                                            db.headersSASYS.findAll({where: {SA_ID: 3}}, {raw: true})
                                                .success(function (dataH) {
                                                    db.sectionsSASYS.findAll({where: {SA_ID: 3}}, {raw: true})
                                                        .success(function (dataS) {
                                                            db.linesSASYS.findAll({where: {SA_ID: 3}}, {raw: true})
                                                                .success(function (dataL) {
                                                                    var response = [
                                                                        {'headers': dataH, 'sections': dataS, 'lines': dataL, 'status': 'findNull', "patient": patient}
                                                                    ];
                                                                    res.json(response);
                                                                })
                                                                .error(function (err) {
                                                                    console.log("ERROR:" + err);
                                                                    res.json({status: 'fail'});
                                                                });
                                                        })
                                                        .error(function (err) {
                                                            console.log("ERROR:" + err);
                                                            res.json({status: 'fail'});
                                                        });
                                                })
                                                .error(function (err) {
                                                    console.log("ERROR:" + err);
                                                    res.json({status: 'fail'});
                                                });
                                        }
                                        else {
                                            //find found
                                            var response = [
                                                {'headers': dataH, 'sections': dataS, 'lines': dataL, 'status': 'findFound', "patient": patient}
                                            ];
                                            res.json(response);
                                        }
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'fail'});
                                    });
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            })
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                        res.json({status: 'fail'});
                    });
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            });
    },
    insertSA1: function (req, res) {
        var info = req.body.info;
        var Signature = info.Signature;
        var test_date = info.test_date;
        info.headers.forEach(function (infoH, hIndex) {
            db.headersSACLN.create({
                patient_id: infoH.patient_id,
                CAL_ID: infoH.CAL_ID,
                SA_ID: infoH.SA_ID,
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                test_date: test_date,
                tester: infoH.tester,
                report_type: infoH.report_type,
                RECIPIENT_NAME: infoH.RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                Signature: Signature,
                LOCATION_ID: infoH.LOCATION_ID
            }, {raw: true})
                .success(function () {
                    info.headers[hIndex].sections.forEach(function (infoS, sIndex) {
                        db.sectionsSACLN.create({
                            patient_id: infoS.patient_id,
                            CAL_ID: infoS.CAL_ID,
                            SECTION_ID: infoS.SECTION_ID,
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            Created_by: infoS.CREATED_BY,
                            Last_updated_by: infoS.LAST_UPDATED_BY
                        }, {raw: true})
                            .success(function () {
                                info.headers[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    db.linesSACLN.create({
                                        patient_id: infoL.patient_id,
                                        CAL_ID: infoL.CAL_ID,
                                        LINE_ID: infoL.LINE_ID,
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        Name: infoL.Name,
                                        VALUE_RIGHT: infoL.VALUE_RIGHT,
                                        VALUE_LEFT: infoL.VALUE_LEFT,
                                        ISENABLE: infoL.ISENABLE,
                                        Created_by: infoL.Created_by,
                                        Last_updated_by: infoL.Last_updated_by
                                    }, {raw: true})
                                        .success(function () {
                                            res.json({status: 'success'});
                                        })
                                        .error(function (err) {
                                            console.log("ERROR:" + err);
                                            res.json({status: 'fail'});
                                        })


                                })


                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            })

                    })
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                })
        })
    },
    editSA1: function (req, res) {
        var info = req.body.info;
        var Signature = info.Signature;
        var test_date = info.test_date;
        info.headers.forEach(function (infoH, hIndex) {
            db.headersSACLN.update({
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                test_date: test_date,
                tester: infoH.tester,
                report_type: infoH.report_type,
                RECIPIENT_NAME: infoH.RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                Signature: Signature,
                LOCATION_ID: infoH.LOCATION_ID
            }, {patient_id: infoH.patient_id, CAL_ID: infoH.CAL_ID, SA_ID: infoH.SA_ID})
                .success(function () {
                    info.headers[hIndex].sections.forEach(function (infoS, sIndex) {
                        db.sectionsSACLN.update({
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            Created_by: infoS.Created_by,
                            Last_updated_by: infoS.Last_updated_by
                        }, { patient_id: infoS.patient_id, CAL_ID: infoS.CAL_ID, SECTION_ID: infoS.SECTION_ID})
                            .success(function () {
                                info.headers[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    db.linesSACLN.update({
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        Name: infoL.Name,
                                        VALUE_RIGHT: infoL.VALUE_RIGHT,
                                        VALUE_LEFT: infoL.VALUE_LEFT,
                                        ISENABLE: infoL.ISENABLE,
                                        Created_by: infoL.Created_by,
                                        Last_updated_by: infoL.Last_updated_by
                                    }, {patient_id: infoL.patient_id, CAL_ID: infoL.CAL_ID, LINE_ID: infoL.LINE_ID})
                                        .success(function () {
                                            res.json({status: 'success'});
                                        })
                                        .error(function (err) {
                                            console.log("ERROR:" + err);
                                            res.json({status: 'fail'});
                                        })
                                })
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            })

                    })
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                })
        })
    }
};