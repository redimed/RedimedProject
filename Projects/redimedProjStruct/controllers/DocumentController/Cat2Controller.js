/**
 * Created by thanh on 11/6/2014.
 */
var db = require('../../models');
var Category2 = db.Category2;
var Patient = db.Patient;
var APPTCAL = db.APPTCAL;
var Doctor = db.Doctor;
var Company = db.Company;

module.exports = {
    loadCat2: function (req, res) {
        var info = req.body.info || [];
        Category2.find({where: {cal_id: info.cal_id, patient_id: info.patient_id}}, {raw: true})
            .success(function (dataCat2) {
                Patient.find({where: {Patient_id: info.patient_id}}, {raw: true})
                    .success(function (patient) {
                        //check exist patient
                        if (patient == null || patient.length == 0) {
                            console.log("******************* Not found user in patient table *******************");
                            res.json({status: 'fail'});
                            return false;
                        }
                        APPTCAL.find({where: {cal_id: info.cal_id}}, {raw: true})
                            .success(function (APPT) {
                                //check exist appointment calendar
                                if (APPT == null || APPT.length == 0) {
                                    console.log('******************* Not found Appointment Calendar in APPT table *******************');
                                    res.json({status: 'fail'});
                                    return false;
                                }
                                Doctor.find({where: {doctor_id: APPT.DOCTOR_ID}}, {raw: true})
                                    .success(function (doctor) {
                                        //check exist doctor
                                        if (doctor == null || doctor.length == 0) {
                                            console.log('******************* Not found Doctor in Doctor table *******************');
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        Company.find({where: {id: patient.company_id}}, {raw: true})
                                            .success(function (company) {
                                                if (dataCat2 == null || dataCat2.length === 0) {
                                                    response = [{
                                                        "patient": patient,
                                                        "appt": APPT,
                                                        "doctor": doctor,
                                                        "company": (company == null || company.length == 0) ? [] : company,
                                                        "status": "findNull"
                                                    }];
                                                    res.json(response);
                                                    return true;
                                                }
                                                else {
                                                    var response = [{
                                                        "dataCat2": dataCat2,
                                                        "patient": patient,
                                                        "appt": APPT,
                                                        "doctor": doctor,
                                                        "company": (company == null || company.length == 0) ? [] : company,
                                                        "status": "findFound"
                                                    }];
                                                    res.json(response);
                                                    return true;
                                                }
                                            }).error(function (err) {
                                                console.log("******************* ERROR:" + err + ' *******************');
                                                res.json({status: 'fail'});
                                                return false;
                                            });
                                    }).error(function (err) {
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
    },
    insertCat2: function (req, res) {
        var info = req.body.info || [];
        Category2.max('cat_id')
            .success(function (maxId) {
                //insert
                var cat_id = maxId + 1;
                db.Category2.create({
                    cat_id: cat_id,
                    cal_id: info.cal_id,
                    DocId: info.DocId,
                    patient_id: info.patient_id,
                    Signature: info.Signature,
                    q1_4: info.q1_4,
                    q1_4_c: info.q1_4_c,
                    q1_5_1: info.q1_5_1,
                    q1_5_2: info.q1_5_2,
                    q1_5_3: info.q1_5_3,
                    q1_5_3_c: info.q1_5_3_c,
                    q3_1_1: info.q3_1_1,
                    q3_1_1_c: info.q3_1_1_c,
                    q3_1_2: info.q3_1_2,
                    q3_1_2_c: info.q3_1_2_c,
                    q3_1_3_1: info.q3_1_3_1,
                    q3_1_3_2: info.q3_1_3_2,
                    q3_1_3_3: info.q3_1_3_3,
                    q3_1_3_4: info.q3_1_3_4,
                    q3_1_3_5: info.q3_1_3_5,
                    q3_1_3_6: info.q3_1_3_6,
                    q3_1_3_7: info.q3_1_3_7,
                    q3_1_3_8: info.q3_1_3_8,
                    q3_1_3_9: info.q3_1_3_9,
                    q3_1_3_10: info.q3_1_3_10,
                    q3_1_3_11: info.q3_1_3_11,
                    q3_1_3_12: info.q3_1_3_12,
                    q3_1_3_13: info.q3_1_3_13,
                    q3_1_3_14: info.q3_1_3_14,
                    q3_1_3_15: info.q3_1_3_15,
                    q3_1_3_16: info.q3_1_3_16,
                    q3_1_3_17: info.q3_1_3_17,
                    q3_1_3_18: info.q3_1_3_18,
                    q3_1_3_19: info.q3_1_3_19,
                    q3_1_3_20: info.q3_1_3_20,
                    q3_1_3_21: info.q3_1_3_21,
                    q3_1_3_22: info.q3_1_3_22,
                    q3_1_3_23: info.q3_1_3_23,
                    q3_1_4_1: info.q3_1_4_1,
                    q3_1_4_2: info.q3_1_4_2,
                    q3_1_4_3_1: info.q3_1_4_3_1,
                    q3_1_4_3_2: info.q3_1_4_3_2,
                    q3_1_4_3_3: info.q3_1_4_3_3,
                    q3_1_4_3_4: info.q3_1_4_3_4,
                    q3_1_4_3_5: info.q3_1_4_3_5,
                    q3_1_4_3_6: info.q3_1_4_3_6,
                    q3_1_4_3_7: info.q3_1_4_3_7,
                    q3_1_4_3_8: info.q3_1_4_3_8,
                    q3_1_5_1: info.q3_1_5_1,
                    q3_1_5_2: info.q3_1_5_2,
                    q3_1_5_3: info.q3_1_5_3,
                    q3_1_5_4: info.q3_1_5_4,
                    q3_1_5_5: info.q3_1_5_5,
                    q3_1_5_6: info.q3_1_5_6,
                    q3_1_5_7: info.q3_1_5_7,
                    q3_1_5_8: info.q3_1_5_8,
                    q3_1_5_9: info.q3_1_5_9,
                    q3_1_5_10: info.q3_1_5_10,
                    q3_1_6_1: info.q3_1_6_1,
                    q3_1_6_2: info.q3_1_6_2,
                    q3_1_6_3: info.q3_1_6_3,
                    q3_1_6_4: info.q3_1_6_4,
                    q3_1_6_5: info.q3_1_6_5,
                    q3_1_6_6: info.q3_1_6_6,
                    q3_1_6_7: info.q3_1_6_7,
                    q3_1_6_8: info.q3_1_6_8,
                    q3_1_6_9: info.q3_1_6_9,
                    q3_1_6_10: info.q3_1_6_10,
                    q3_1_6_c: info.q3_1_6_c,
                    q3_2: info.q3_2,
                    q4_2_1_1_1: info.q4_2_1_1_1,
                    q4_2_1_1_2: info.q4_2_1_1_2,
                    q4_2_1_2: info.q4_2_1_2,
                    q4_2_1_2_c: info.q4_2_1_2_c,
                    q4_2_1_3: info.q4_2_1_3,
                    q4_2_1_4: info.q4_2_1_4,
                    q4_2_2: info.q4_2_2,
                    q4_2_3: info.q4_2_3,
                    q4_2_4_c: info.q4_2_4_c,
                    q4_2_5_1: info.q4_2_5_1,
                    q4_2_5_2: info.q4_2_5_2,
                    q4_2_5_3_1: info.q4_2_5_3_1,
                    q4_2_5_3_2: info.q4_2_5_3_2,
                    q4_2_5_4_1: info.q4_2_5_4_1,
                    q4_2_5_4_2: info.q4_2_5_4_2,
                    q4_2_5_5: info.q4_2_5_5,
                    q4_2_5_6: info.q4_2_5_6,
                    q4_2_6_1: info.q4_2_6_1,
                    q4_2_6_2: info.q4_2_6_2,
                    q4_2_7_L_1: info.q4_2_7_L_1,
                    q4_2_7_L_2: info.q4_2_7_L_2,
                    q4_2_7_L_3: info.q4_2_7_L_3,
                    q4_2_7_L_4: info.q4_2_7_L_4,
                    q4_2_7_L_5: info.q4_2_7_L_5,
                    q4_2_7_L_6: info.q4_2_7_L_6,
                    q4_2_7_L_7: info.q4_2_7_L_7,
                    q4_2_7_L_8: info.q4_2_7_L_8,
                    q4_2_7_R_1: info.q4_2_7_R_1,
                    q4_2_7_R_2: info.q4_2_7_R_2,
                    q4_2_7_R_3: info.q4_2_7_R_3,
                    q4_2_7_R_4: info.q4_2_7_R_4,
                    q4_2_7_R_5: info.q4_2_7_R_5,
                    q4_2_7_R_6: info.q4_2_7_R_6,
                    q4_2_7_R_7: info.q4_2_7_R_7,
                    q4_2_7_R_8: info.q4_2_7_R_8,
                    q4_2_7: info.q4_2_7,
                    q4_2_8_c: info.q4_2_8_c,
                    q4_2_8_1_c: info.q4_2_8_1_c,
                    q4_2_8_2_1: info.q4_2_8_2_1,
                    q4_2_8_2_c: info.q4_2_8_2_c,
                    q4_2_8_3_1: info.q4_2_8_3_1,
                    q4_2_8_3_c: info.q4_2_8_3_c,
                    q4_2_8_4_1: info.q4_2_8_4_1,
                    q4_2_8_4_c: info.q4_2_8_4_c,
                    q4_2_8_5_1: info.q4_2_8_5_1,
                    q4_2_8_5_c: info.q4_2_8_5_c,
                    q4_2_8_6_1: info.q4_2_8_6_1,
                    q4_2_8_6_c: info.q4_2_8_6_c,
                    q4_2_8_7_1: info.q4_2_8_7_1,
                    q4_2_8_7_c: info.q4_2_8_7_c,
                    q4_2_8_8_1: info.q4_2_8_8_1,
                    q4_2_8_8_c: info.q4_2_8_8_c,
                    q4_2_8_9_1: info.q4_2_8_9_1,
                    q4_2_8_9_c: info.q4_2_8_9_c,
                    q4_2_9: info.q4_2_9,
                    q4_2_10_1: info.q4_2_10_1,
                    q4_2_10_2: info.q4_2_10_2,
                    q4_2_11: info.q4_2_11,
                    q4_2_12_1: info.q4_2_12_1,
                    q4_2_12_2: info.q4_2_12_2,
                    q4_2_13_1_1: info.q4_2_13_1_1,
                    q4_2_13_1_2: info.q4_2_13_1_2,
                    q4_2_13_1_3: info.q4_2_13_1_3,
                    q4_2_13_1_4: info.q4_2_13_1_4,
                    q4_2_13_1_5: info.q4_2_13_1_5,
                    q4_2_13_2: info.q4_2_13_2,
                    q4_2_13_3: info.q4_2_13_3,
                    q4_2_13_4: info.q4_2_13_4,
                    q4_2_13_5: info.q4_2_13_5,
                    q4_2_13_6: info.q4_2_13_6,
                    rel_cmt: info.rel_cmt,
                    rel_id: info.rel_id,
                    r1_1: info.r1_1,
                    r1_2: info.r1_2,
                    r1_3: info.r1_3,
                    r1_4_y: info.r1_4_y,
                    r1_5: info.r1_5,
                    r1_6: info.r1_6,
                    r1_7: info.r1_7,
                    r1_8: info.r1_8,
                    r1_8_c: info.r1_8_c,
                    r2_1: info.r2_1,
                    r2_2: info.r2_2,
                    r2_2_y: info.r2_2_y,
                    r2_3: info.r2_3,
                    r2_4: info.r2_4,
                    r2_5: info.r2_5,
                    r2_6: info.r2_6,
                    r2_7_c: info.r2_7_c,
                    r3_1: info.r3_1,
                    r3_2_c: info.r3_2_c,
                    r4_1: info.r4_1,
                    r4_2_c: info.r4_2_c,
                    r5_1: info.r5_1,
                    r5_2: info.r5_2,
                    DATE: info.DATE,
                    DOCTOR_ID: info.DOCTOR_ID,
                    Created_by: info.Created_by,
                    Last_updated_by: info.Last_updated_by
                }, {raw: true})
                    .success(function () {
                        res.json({status: 'success'});
                    })
                    .error(function (err) {
                        console.log("******************* ERROR:" + err + ' *******************');
                        res.json({status: 'fail'});
                        return false;
                    })
            })
            .error(function (err) {
                console.log("******************* ERROR:" + err + ' *******************');
                res.json({status: 'fail'});
                return false;
            });
    },
    editCat2: function (req, res) {
        var info = req.body.info || [];
        Category2.update({
            cal_id: info.cal_id,
            DocId: info.DocId,
            patient_id: info.patient_id,
            Signature: info.Signature,
            q1_4: info.q1_4,
            q1_4_c: info.q1_4_c,
            q1_5_1: info.q1_5_1,
            q1_5_2: info.q1_5_2,
            q1_5_3: info.q1_5_3,
            q1_5_3_c: info.q1_5_3_c,
            q3_1_1: info.q3_1_1,
            q3_1_1_c: info.q3_1_1_c,
            q3_1_2: info.q3_1_2,
            q3_1_2_c: info.q3_1_2_c,
            q3_1_3_1: info.q3_1_3_1,
            q3_1_3_2: info.q3_1_3_2,
            q3_1_3_3: info.q3_1_3_3,
            q3_1_3_4: info.q3_1_3_4,
            q3_1_3_5: info.q3_1_3_5,
            q3_1_3_6: info.q3_1_3_6,
            q3_1_3_7: info.q3_1_3_7,
            q3_1_3_8: info.q3_1_3_8,
            q3_1_3_9: info.q3_1_3_9,
            q3_1_3_10: info.q3_1_3_10,
            q3_1_3_11: info.q3_1_3_11,
            q3_1_3_12: info.q3_1_3_12,
            q3_1_3_13: info.q3_1_3_13,
            q3_1_3_14: info.q3_1_3_14,
            q3_1_3_15: info.q3_1_3_15,
            q3_1_3_16: info.q3_1_3_16,
            q3_1_3_17: info.q3_1_3_17,
            q3_1_3_18: info.q3_1_3_18,
            q3_1_3_19: info.q3_1_3_19,
            q3_1_3_20: info.q3_1_3_20,
            q3_1_3_21: info.q3_1_3_21,
            q3_1_3_22: info.q3_1_3_22,
            q3_1_3_23: info.q3_1_3_23,
            q3_1_4_1: info.q3_1_4_1,
            q3_1_4_2: info.q3_1_4_2,
            q3_1_4_3_1: info.q3_1_4_3_1,
            q3_1_4_3_2: info.q3_1_4_3_2,
            q3_1_4_3_3: info.q3_1_4_3_3,
            q3_1_4_3_4: info.q3_1_4_3_4,
            q3_1_4_3_5: info.q3_1_4_3_5,
            q3_1_4_3_6: info.q3_1_4_3_6,
            q3_1_4_3_7: info.q3_1_4_3_7,
            q3_1_4_3_8: info.q3_1_4_3_8,
            q3_1_5_1: info.q3_1_5_1,
            q3_1_5_2: info.q3_1_5_2,
            q3_1_5_3: info.q3_1_5_3,
            q3_1_5_4: info.q3_1_5_4,
            q3_1_5_5: info.q3_1_5_5,
            q3_1_5_6: info.q3_1_5_6,
            q3_1_5_7: info.q3_1_5_7,
            q3_1_5_8: info.q3_1_5_8,
            q3_1_5_9: info.q3_1_5_9,
            q3_1_5_10: info.q3_1_5_10,
            q3_1_6_1: info.q3_1_6_1,
            q3_1_6_2: info.q3_1_6_2,
            q3_1_6_3: info.q3_1_6_3,
            q3_1_6_4: info.q3_1_6_4,
            q3_1_6_5: info.q3_1_6_5,
            q3_1_6_6: info.q3_1_6_6,
            q3_1_6_7: info.q3_1_6_7,
            q3_1_6_8: info.q3_1_6_8,
            q3_1_6_9: info.q3_1_6_9,
            q3_1_6_10: info.q3_1_6_10,
            q3_1_6_c: info.q3_1_6_c,
            q3_2: info.q3_2,
            q4_2_1_1_1: info.q4_2_1_1_1,
            q4_2_1_1_2: info.q4_2_1_1_2,
            q4_2_1_2: info.q4_2_1_2,
            q4_2_1_2_c: info.q4_2_1_2_c,
            q4_2_1_3: info.q4_2_1_3,
            q4_2_1_4: info.q4_2_1_4,
            q4_2_2: info.q4_2_2,
            q4_2_3: info.q4_2_3,
            q4_2_4_c: info.q4_2_4_c,
            q4_2_5_1: info.q4_2_5_1,
            q4_2_5_2: info.q4_2_5_2,
            q4_2_5_3_1: info.q4_2_5_3_1,
            q4_2_5_3_2: info.q4_2_5_3_2,
            q4_2_5_4_1: info.q4_2_5_4_1,
            q4_2_5_4_2: info.q4_2_5_4_2,
            q4_2_5_5: info.q4_2_5_5,
            q4_2_5_6: info.q4_2_5_6,
            q4_2_6_1: info.q4_2_6_1,
            q4_2_6_2: info.q4_2_6_2,
            q4_2_7_L_1: info.q4_2_7_L_1,
            q4_2_7_L_2: info.q4_2_7_L_2,
            q4_2_7_L_3: info.q4_2_7_L_3,
            q4_2_7_L_4: info.q4_2_7_L_4,
            q4_2_7_L_5: info.q4_2_7_L_5,
            q4_2_7_L_6: info.q4_2_7_L_6,
            q4_2_7_L_7: info.q4_2_7_L_7,
            q4_2_7_L_8: info.q4_2_7_L_8,
            q4_2_7_R_1: info.q4_2_7_R_1,
            q4_2_7_R_2: info.q4_2_7_R_2,
            q4_2_7_R_3: info.q4_2_7_R_3,
            q4_2_7_R_4: info.q4_2_7_R_4,
            q4_2_7_R_5: info.q4_2_7_R_5,
            q4_2_7_R_6: info.q4_2_7_R_6,
            q4_2_7_R_7: info.q4_2_7_R_7,
            q4_2_7_R_8: info.q4_2_7_R_8,
            q4_2_7: info.q4_2_7,
            q4_2_8_c: info.q4_2_8_c,
            q4_2_8_1_c: info.q4_2_8_1_c,
            q4_2_8_2_1: info.q4_2_8_2_1,
            q4_2_8_2_c: info.q4_2_8_2_c,
            q4_2_8_3_1: info.q4_2_8_3_1,
            q4_2_8_3_c: info.q4_2_8_3_c,
            q4_2_8_4_1: info.q4_2_8_4_1,
            q4_2_8_4_c: info.q4_2_8_4_c,
            q4_2_8_5_1: info.q4_2_8_5_1,
            q4_2_8_5_c: info.q4_2_8_5_c,
            q4_2_8_6_1: info.q4_2_8_6_1,
            q4_2_8_6_c: info.q4_2_8_6_c,
            q4_2_8_7_1: info.q4_2_8_7_1,
            q4_2_8_7_c: info.q4_2_8_7_c,
            q4_2_8_8_1: info.q4_2_8_8_1,
            q4_2_8_8_c: info.q4_2_8_8_c,
            q4_2_8_9_1: info.q4_2_8_9_1,
            q4_2_8_9_c: info.q4_2_8_9_c,
            q4_2_9: info.q4_2_9,
            q4_2_10_1: info.q4_2_10_1,
            q4_2_10_2: info.q4_2_10_2,
            q4_2_11: info.q4_2_11,
            q4_2_12_1: info.q4_2_12_1,
            q4_2_12_2: info.q4_2_12_2,
            q4_2_13_1_1: info.q4_2_13_1_1,
            q4_2_13_1_2: info.q4_2_13_1_2,
            q4_2_13_1_3: info.q4_2_13_1_3,
            q4_2_13_1_4: info.q4_2_13_1_4,
            q4_2_13_1_5: info.q4_2_13_1_5,
            q4_2_13_2: info.q4_2_13_2,
            q4_2_13_3: info.q4_2_13_3,
            q4_2_13_4: info.q4_2_13_4,
            q4_2_13_5: info.q4_2_13_5,
            q4_2_13_6: info.q4_2_13_6,
            rel_cmt: info.rel_cmt,
            rel_id: info.rel_id,
            r1_1: info.r1_1,
            r1_2: info.r1_2,
            r1_3: info.r1_3,
            r1_4_y: info.r1_4_y,
            r1_5: info.r1_5,
            r1_6: info.r1_6,
            r1_7: info.r1_7,
            r1_8: info.r1_8,
            r1_8_c: info.r1_8_c,
            r2_1: info.r2_1,
            r2_2: info.r2_2,
            r2_2_y: info.r2_2_y,
            r2_3: info.r2_3,
            r2_4: info.r2_4,
            r2_5: info.r2_5,
            r2_6: info.r2_6,
            r2_7_c: info.r2_7_c,
            r3_1: info.r3_1,
            r3_2_c: info.r3_2_c,
            r4_1: info.r4_1,
            r4_2_c: info.r4_2_c,
            r5_1: info.r5_1,
            r5_2: info.r5_2,
            DATE: info.DATE,
            DOCTOR_ID: info.DOCTOR_ID,
            Created_by: info.Created_by,
            Last_updated_by: info.Last_updated_by
        }, {cat_id: info.cat_id})
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

