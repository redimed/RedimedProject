/**
 * Created by thanh on 10/31/2014.
 */
var db = require('../../models');
var Form18 = db.Form18;
var Patient = db.Patient;
var Doctor = db.Doctor;
var APPTCAL = db.APPTCAL;
var RedimedSite = db.RedimedSite;
var Company = db.Company;

module.exports = {


    loadForm18: function (req, res) {
        var info = req.body.info || [];
        Form18.find({where: {PATIENT_ID: info.PATIENT_ID, CAL_ID: info.CAL_ID}}, {raw: true})
            .success(function (dataF18) {
                Patient.find({where: {patient_id: info.PATIENT_ID}}, {raw: true})
                    .success(function (patient) {
                        if (patient == null || patient.length == 0) {
                            console.log("******************* Not found user in patient table *******************");
                            res.json({status: 'fail'});
                            return false;
                        }
                        APPTCAL.find({where: {cal_id: info.CAL_ID}}, {raw: true})
                            .success(function (APPT) {
                                if (APPT == null || APPT.length == 0) {
                                    console.log("******************* Not found appointment calendar in appt table *******************");
                                    res.json({status: 'fail'});
                                    return false;
                                }
                                Doctor.find({where: {doctor_id: APPT.DOCTOR_ID}}, {raw: true})
                                    .success(function (doctor) {
                                        if (doctor == null || doctor.length == 0) {
                                            console.log("******************* Not found user in doctor table *******************");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        RedimedSite.find({where: {id: APPT.SITE_ID}}, {raw: true})
                                            .success(function (rmSite) {
                                                if (rmSite == null || rmSite.length == 0) {
                                                    console.log("******************* Not found redimedSite in redimedSite table *******************");
                                                    res.json({status: 'fail'});
                                                    return false;
                                                }
                                                Company.find({where: {id: patient.company_id}}, {raw: true})
                                                    .success(function (company) {
                                                        if (company == null || company.length == 0) {
                                                            console.log("******************* Not found Company in Company table *******************");
                                                        }
                                                        if (dataF18 === null || dataF18.length === 0) {
                                                            var response = [
                                                                {
                                                                    "status": "findNull",
                                                                    "patient": patient,
                                                                    "doctor": doctor,
                                                                    "APPT": APPT,
                                                                    "rmSite": rmSite,
                                                                    "company": company || []
                                                                }
                                                            ];
                                                            res.json(response);
                                                            return true;
                                                        }
                                                        else {
                                                            var response = [{
                                                                "dataF18": dataF18,
                                                                "status": 'findFound',
                                                                "patient": patient,
                                                                "doctor": doctor,
                                                                "APPT": APPT,
                                                                "rmSite": rmSite,
                                                                "company": company
                                                            }];
                                                            res.json(response);
                                                        }
                                                    })
                                                    .error(function (err) {
                                                        console.log("******************* ERROR:" + err + ' *******************');
                                                        res.json({status: 'fail'});
                                                        return false;
                                                    });
                                            })
                                            .error(function (err) {
                                                console.log("******************* ERROR:" + err + ' *******************');
                                                res.json({status: 'fail'});
                                                return false;
                                            });
                                    })
                                    .error(function (err) {
                                        console.log("******************* ERROR:" + err + ' *******************');
                                        res.json({status: 'fail'});
                                        return false;
                                    });
                            })
                            .error(function (err) {
                                console.log("******************* ERROR:" + err + ' *******************');
                                res.json({status: 'fail'});
                                return false;
                            });
                    })
                    .error(function (err) {
                        console.log("*******************ERROR: " + err + ' *******************');
                        res.json({status: 'fail'});
                        return false;
                    });
            })
            .
            error(function (err) {
                console.log("*******************ERROR: " + err + ' *******************');
                res.json({status: 'fail'});
                return false;
            });
    },
    insertForm18: function (req, res) {
        var info = req.body.info || [];
        Form18.max('GORGON_ID')
            .success(function (max_id) {
                var GORGON_ID = max_id + 1;
                Form18.create({
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
                    WORKER_SIGNATURE: info.WORKER_SIGNATURE,
                    Created_by: info.Created_by,
                    Last_updated_by: info.Last_updated_by
                }, {raw: true})
                    .success(function () {
                        res.json({status: 'success'});
                        return true;
                    })
                    .error(function (err) {
                        console.log("******************* ERROR:" + err + ' *******************');
                        res.json({status: 'fail'});
                        return false;
                    });
            })
            .error(function (err) {
                console.log("******************* ERROR:" + err + ' *******************');
                res.json({status: 'fail'});
                return false;
            });
    },
    editForm18: function (req, res) {
        var info = req.body.info || [];
        Form18.update({
            CAL_ID: info.CAL_ID,
            PATIENT_ID: info.PATIENT_ID,
            DocId: info.DocId,
            TIME_TEST: info.TIME_TEST,
            WORK_COVER_NO: info.WORK_COVER_NO,
            PERSON_ARRANGING_SIGNATURE: info.PERSON_ARRANGING_SIGNATURE,
            PERSON_ARRANGING_NAME: info.PERSON_ARRANGING_NAME,
            PERSON_ARRANGING_POSITION: info.PERSON_ARRANGING_POSITION,
            DOCTOR_ID: info.DOCTOR_ID,
            WORKER_SIGNATURE: info.WORKER_SIGNATURE,
            Created_by: info.Created_by,
            Last_updated_by: info.Last_updated_by
        }, {GORGON_ID: 1})
            .success(function () {
                res.json({status: 'success'});
                return true;
            })
            .error(function (err) {
                console.log("******************* ERROR:" + err + ' *******************');
                res.json({status: 'fail'});
                return false;
            });
    }
};