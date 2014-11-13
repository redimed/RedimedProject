/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
module.exports = {
    loadSA2: function (req, res) {
        var info = req.body.info; //get id find
        db.headersSACLN.findAll({where: {PATIENT_ID: 999, CAL_ID: 999, SA_ID: 6}}, {raw: true})
            .success(function (dataH) {
                db.sectionsSACLN.findAll({where: {PATIENT_ID: 999, CAL_ID: 999, SA_ID: 6}}, {raw: true})
                    .success(function (dataS) {
                        db.linesSACLN.findAll({where: {PATIENT_ID: 999, CAL_ID: 999, SA_ID: 6}}, {raw: true})
                            .success(function (dataL) {
                                if (0 === dataH.length || 0 === dataS.length || 0 === dataL.length) {
                                    //find null
                                    //get information in sys table
                                    db.headersSASYS.findAll({where: {SA_ID: 6}}, {raw: true})
                                        .success(function (dataH) {
                                            db.sectionsSASYS.findAll({where: {SA_ID: 6}}, {raw: true})
                                                .success(function (dataS) {
                                                    db.linesSASYS.findAll({where: {SA_ID: 6}}, {raw: true})
                                                        .success(function (dataL) {
                                                            var response = [
                                                                {'headers': dataH, 'sections': dataS, 'lines': dataL, 'status': 'findNull'}
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
                                        {'headers': dataH, 'sections': dataS, 'lines': dataL, 'status': 'findFound'}
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
                    });
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            });
    },
    insertSA2: function (req, res) {
        var info = req.body.info;
        info.forEach(function (infoH, hIndex) {
            db.headersSACLN.create({
                PATIENT_ID: 999,
                CAL_ID: 999,
                SA_ID: infoH.SA_ID,
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                CREATED_BY: infoH.CREATED_BY,
                CREATION_DATE: new Date(),
                LAST_UPDATED_BY: infoH.LAST_UPDATED_BY,
                LAST_UPDATE_DATE: new Date(),
                TEST_DATE: new Date(),
                TESTER: infoH.TESTER,
                REPORT_TYPE: infoH.REPORT_TYPE,
                RECIPIENT_NAME: infoH.RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                SIGNATURE: infoH.SIGNATURE,
                LOCATION_ID: infoH.LOCATION_ID
            }, {raw: true})
                .success(function () {
                    info[hIndex].sections.forEach(function (infoS, sIndex) {
                        db.sectionsSACLN.create({
                            PATIENT_ID: 999,
                            CAL_ID: 999,
                            SECTION_ID: infoS.SECTION_ID,
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            CREATED_BY: infoS.CREATED_BY,
                            CREATION_DATE: new Date(),
                            LAST_UPDATED_BY: infoS.LAST_UPDATED_BY,
                            LAST_UPDATE_DATE: new Date()
                        }, {raw: true})
                            .success(function () {
                                info[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    db.linesSACLN.create({
                                        PATIENT_ID: 999,
                                        CAL_ID: 999,
                                        LINE_ID: infoL.LINE_ID,
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        NAME: infoL.NAME,
                                        VALUE_RIGHT: infoL.VALUE_RIGHT,
                                        VALUE_LEFT: infoL.VALUE_LEFT,
                                        ISENABLE: infoL.ISENABLE,
                                        CREATED_BY: infoL.CREATED_BY,
                                        CREATION_DATE: new Date(),
                                        LAST_UPDATED_BY: infoL.LAST_UPDATED_BY,
                                        LAST_UPDATE_DATE: new Date()
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
    editSA2: function (req, res) {
        var info = req.body.info;
        info.forEach(function (infoH, hIndex) {
            db.headersSACLN.update({
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                CREATED_BY: infoH.CREATED_BY,
                CREATION_DATE: new Date(),
                LAST_UPDATED_BY: infoH.LAST_UPDATED_BY,
                LAST_UPDATE_DATE: new Date(),
                TEST_DATE: new Date(),
                TESTER: infoH.TESTER,
                REPORT_TYPE: infoH.REPORT_TYPE,
                RECIPIENT_NAME: infoH.RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                SIGNATURE: infoH.SIGNATURE,
                LOCATION_ID: infoH.LOCATION_ID
            }, {PATIENT_ID: 999, CAL_ID: 999, SA_ID: infoH.SA_ID})
                .success(function () {
                    info[hIndex].sections.forEach(function (infoS, sIndex) {
                        db.sectionsSACLN.update({
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            CREATED_BY: infoS.CREATED_BY,
                            CREATION_DATE: new Date(),
                            LAST_UPDATED_BY: infoS.LAST_UPDATED_BY,
                            LAST_UPDATE_DATE: new Date()
                        }, { PATIENT_ID: 999, CAL_ID: 999, SECTION_ID: infoS.SECTION_ID})
                            .success(function () {
                                info[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    db.linesSACLN.update({
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        NAME: infoL.NAME,
                                        VALUE_RIGHT: infoL.VALUE_RIGHT,
                                        VALUE_LEFT: infoL.VALUE_LEFT,
                                        ISENABLE: infoL.ISENABLE,
                                        CREATED_BY: infoL.CREATED_BY,
                                        CREATION_DATE: new Date(),
                                        LAST_UPDATED_BY: infoL.LAST_UPDATED_BY,
                                        LAST_UPDATE_DATE: new Date()
                                    }, {PATIENT_ID: 999, CAL_ID: 999, LINE_ID: infoL.LINE_ID})
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