/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
var headersSACLN = db.headersSACLN;
var sectionsSACLN = db.sectionsSACLN;
var linesSACLN = db.linesSACLN;
var headersSASYS = db.headersSASYS;
var sectionsSASYS = db.sectionsSASYS;
var linesSASYS = db.linesSASYS;
var Patient = db.Patient;
var Doctor = db.Doctor;
var Company = db.Company;
var APPTCAL = db.APPTCAL;
var RedimedSite = db.RedimedSite;
var fs = require('fs');


module.exports = {
    loadSA2: function (req, res) {
        var info = req.body.info; //get id find
        var patient_id = info.patient_id;
        var CAL_ID = info.CAL_ID;
        headersSACLN.findAll({where: {patient_id: patient_id, CAL_ID: CAL_ID, SA_ID: 6}}, {raw: true})
            .success(function (dataH) {
                if (dataH == null || dataH.length == 0) return loadSYS(req, res, info);//not found in cln
                sectionsSACLN.findAll({
                    where: {
                        patient_id: info.patient_id,
                        CAL_ID: info.CAL_ID,
                        SA_ID: 6
                    }
                }, {raw: true})
                    .success(function (dataS) {
                        if (dataS == null || dataS.length == 0) return loadSYS(req, res, info);
                        linesSACLN.findAll({
                            where: {
                                patient_id: patient_id,
                                CAL_ID: CAL_ID,
                                SA_ID: 6
                            }
                        }, {raw: true})
                            .success(function (dataL) {
                                Patient.find({where: {Patient_id: patient_id}}, {raw: true})
                                    .success(function (patient) {
                                        if (patient == null || patient.length == 0) {
                                            console.log("Not found patient in table");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        Company.find({where: {id: patient.company_id}}, {raw: true})
                                            .success(function (company) {
                                                if (company == null || company.length == 0) {
                                                    console.log("Not found company patient:" + patient.company_id);
                                                }
                                                APPTCAL.find({where: {CAL_ID: CAL_ID}}, {raw: true})
                                                    .success(function (appt) {
                                                        if (appt == null | appt.length == 0) {
                                                            console.log("Not found APPT in table");
                                                            res.json({status: 'fail'});
                                                            return false;
                                                        }
                                                        RedimedSite.find({where: {id: appt.SITE_ID}}, {raw: true})
                                                            .success(function (site) {
                                                                if (site == null || site.length == 0) {
                                                                    console.log("Not found redimed Site in table");
                                                                    return false;
                                                                }
                                                                Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                                                    .success(function (doctor) {
                                                                        if (doctor == null || doctor.length == 0) {
                                                                            console.log("Not found doctor in table");
                                                                            res.json({status: 'fail'});
                                                                            return false;
                                                                        }
                                                                        //res to client
                                                                        var response = [
                                                                            {
                                                                                'headers': dataH,
                                                                                'sections': dataS,
                                                                                'lines': dataL,
                                                                                "patient": patient,
                                                                                "doctor": doctor,
                                                                                "appt": appt,
                                                                                "site": site,
                                                                                "company": company,
                                                                                'status': 'findFound'
                                                                            }
                                                                        ];
                                                                        res.json(response);
                                                                        return true;
                                                                    })
                                                                    .error(function (err) {
                                                                        console.log("ERROR:" + err);
                                                                        res.json({status: 'fail'});
                                                                        return false;

                                                                    });
                                                            })
                                                            .error(function (err) {
                                                                console.log("ERROR:" + err);
                                                                res.json({status: 'fail'});
                                                                return false;

                                                            });
                                                    })
                                                    .error(function (err) {
                                                        console.log("ERROR:" + err);
                                                        res.json({status: 'fail'});
                                                        res.json({status: 'fail'});
                                                        return false;

                                                    });
                                            })
                                            .error(function (err) {
                                                console.log("ERROR:" + err);
                                                res.json({status: 'fail'});
                                                return false;

                                            });
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'fail'});
                                        return false;

                                    });
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                                return false;
                            });
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                        res.json({status: 'fail'});
                        return false;
                    });
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
                return false;
            });
    },
    insertSA2: function (req, res) {
        var info = req.body.info;
        var Signature = info.Signature;
        var test_date = info.test_date;
        var RECIPIENT_NAME = info.RECIPIENT_NAME;
        var tester = info.tester;
        info.headers.forEach(function (infoH, hIndex) {
            headersSACLN.create({
                patient_id: infoH.patient_id,
                CAL_ID: infoH.CAL_ID,
                SA_ID: infoH.SA_ID,
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                test_date: test_date,
                tester: tester,
                report_type: infoH.report_type,
                RECIPIENT_NAME: RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                Signature: Signature,
                LOCATION_ID: infoH.LOCATION_ID
            }, {raw: true})
                .success(function () {
                    info.headers[hIndex].sections.forEach(function (infoS, sIndex) {
                        sectionsSACLN.create({
                            patient_id: infoS.patient_id,
                            CAL_ID: infoS.CAL_ID,
                            SECTION_ID: infoS.SECTION_ID,
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            Created_by: infoS.Created_by,
                            Last_updated_by: infoS.Last_updated_by
                        }, {raw: true})
                            .success(function () {
                                info.headers[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    linesSACLN.create({
                                        patient_id: infoL.patient_id,
                                        CAL_ID: infoL.CAL_ID,
                                        LINE_ID: infoL.LINE_ID,
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        NAME: infoL.NAME,
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
    editSA2: function (req, res) {
        var info = req.body.info;
        var Signature = info.Signature;
        var test_date = info.test_date;
        var RECIPIENT_NAME = info.RECIPIENT_NAME;
        var tester = info.tester;
        info.headers.forEach(function (infoH, hIndex) {
            headersSACLN.update({
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                test_date: test_date,
                tester: tester,
                report_type: infoH.report_type,
                RECIPIENT_NAME: RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                Signature: Signature,
                LOCATION_ID: infoH.LOCATION_ID
            }, {patient_id: infoH.patient_id, CAL_ID: infoH.CAL_ID, SA_ID: infoH.SA_ID})
                .success(function () {
                    info.headers[hIndex].sections.forEach(function (infoS, sIndex) {
                        sectionsSACLN.update({
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            Created_by: infoS.Created_by,
                            Last_updated_by: infoS.Last_updated_by
                        }, {patient_id: infoS.patient_id, CAL_ID: infoS.CAL_ID, SECTION_ID: infoS.SECTION_ID})
                            .success(function () {
                                info.headers[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    linesSACLN.update({
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        NAME: infoL.NAME,
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
                                        });
                                })
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            });
                    })
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                });
        })
    }
};

var loadSYS = function (req, res, info) {
    var PATIENT_ID = info.patient_id;
    var CAL_ID = info.CAL_ID;
    headersSASYS.findAll({where: {SA_ID: 6}}, {raw: true})
        .success(function (dataH) {
            if (dataH == null || dataH.length == 0) {
                console.log("Not found headers in sys table");
                res.json({status: 'fail'});
                return false;
            }
            sectionsSASYS.findAll({where: {SA_ID: 6}}, {raw: true})
                .success(function (dataS) {
                    if (dataS == null || dataS.length == 0) {
                        console.log("Not found sections in sys table");
                        res.json({status: 'fail'});
                        return false;
                    }
                    linesSASYS.findAll({where: {SA_ID: 6}}, {raw: true})
                        .success(function (dataL) {
                            if (dataL == null || dataL.length == 0) {
                                console.log("Not found lines in sys table");
                                res.json({status: 'fail'});
                                return false;
                            }
                            Patient.find({where: {Patient_id: PATIENT_ID}}, {raw: true})
                                .success(function (patient) {
                                    if (patient == null || patient.length == 0) {
                                        console.log("Not found patient in table");
                                        res.json({status: 'fail'});
                                        return false;
                                    }
                                    Company.find({where: {id: patient.company_id}}, {raw: true})
                                        .success(function (company) {
                                            if (company == null || company.length == 0) {
                                                console.log("Not found company patient:" + patient.company_id);
                                            }
                                            APPTCAL.find({where: {CAL_ID: CAL_ID}}, {raw: true})
                                                .success(function (appt) {
                                                    if (appt == null | appt.length == 0) {
                                                        console.log("Not found APPT in table");
                                                        res.json({status: 'fail'});
                                                        return false;
                                                    }
                                                    RedimedSite.find({where: {id: appt.SITE_ID}}, {raw: true})
                                                        .success(function (site) {
                                                            if (site == null || site.length == 0) {
                                                                console.log("Not found redimed Site in table");
                                                                return false;
                                                            }
                                                            Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                                                .success(function (doctor) {
                                                                    if (doctor == null || doctor.length == 0) {
                                                                        console.log("Not found doctor in table");
                                                                        res.json({status: 'fail'});
                                                                        return false;
                                                                    }
                                                                    //res to client
                                                                    var response = [
                                                                        {
                                                                            'headers': dataH,
                                                                            'sections': dataS,
                                                                            'lines': dataL,
                                                                            "patient": patient,
                                                                            "doctor": doctor,
                                                                            "appt": appt,
                                                                            "site": site,
                                                                            "company": company,
                                                                            'status': 'findNull'
                                                                        }
                                                                    ];
                                                                    res.json(response);
                                                                    return true;
                                                                })
                                                                .error(function (err) {
                                                                    console.log("ERROR:" + err);
                                                                    res.json({status: 'fail'});
                                                                    return false;

                                                                });
                                                        })
                                                        .error(function (err) {
                                                            console.log("ERROR:" + err);
                                                            res.json({status: 'fail'});
                                                            return false;

                                                        });
                                                })
                                                .error(function (err) {
                                                    console.log("ERROR:" + err);
                                                    res.json({status: 'fail'});
                                                    return false;

                                                });
                                        })
                                        .error(function (err) {
                                            console.log("ERROR:" + err);
                                            res.json({status: 'fail'});
                                            return false;

                                        });
                                })
                                .error(function (err) {
                                    console.log("ERROR:" + err);
                                    res.json({status: 'fail'});
                                    return false;

                                });
                        })
                        .error(function (err) {
                            console.log("ERROR:" + err);
                            res.json({status: 'fail'});
                            return false;

                        });
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                    return false;

                });

        })
        .error(function (err) {
            console.log("ERROR:" + err);
            res.json({status: 'fail'});
            return false;

        });
};
