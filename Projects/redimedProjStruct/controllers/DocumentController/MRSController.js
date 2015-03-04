/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
var Patient = db.Patient;
var Doctor = db.Doctor;
var MedicalSummary = db.MedicalSummary;
var APPTCAL = db.APPTCAL;


module.exports = {
    loadMRS: function(req, res) {
        var info = req.body.info;
        var patient_id = info.patient_id;
        var cal_id = info.cal_id;
        var idC = info.idC;
        //load doc
        db.docMA.find({
                where: {
                    PATIENT_ID: patient_id,
                    CAL_ID: cal_id
                },
                attribute: ['HEIGHT', 'WEIGHT', 'WHR', 'BMI']
            })
            .success(function(dataMA) {
                if (dataMA === null) {
                    res.json({
                        status: 'not'
                    });
                } else {
                    db.Company.find({
                            where: {
                                id: idC
                            }
                        }, {
                            raw: true
                        })
                        .success(function(company) {
                            if (company === null || company.length === 0)
                                console.log("Not found company in table");
                            MedicalSummary.find({
                                    where: {
                                        patient_id: patient_id,
                                        cal_id: cal_id
                                    }
                                }, {
                                    raw: true
                                })
                                .success(function(data) {
                                    //load patient
                                    Patient.find({
                                            where: {
                                                patient_id: patient_id
                                            }
                                        }, {
                                            raw: true
                                        })
                                        .success(function(patient) {
                                            //check patient
                                            if (patient === null || patient.length === 0) {
                                                console.log('******************* Find not found patient in cln_patient *******************');
                                                res.json({
                                                    status: 'fail'
                                                });
                                                return false;
                                            }
                                            //load appt
                                            APPTCAL.find({
                                                    where: {
                                                        cal_id: cal_id
                                                    }
                                                }, {
                                                    raw: true
                                                })
                                                .success(function(appt) {
                                                    //check appt
                                                    if (appt === null || appt.length === 0) {
                                                        console.log('******************* Find not found appt in appt table');
                                                        res.json({
                                                            status: 'fail'
                                                        });
                                                        return false;
                                                    }
                                                    //load doctor
                                                    Doctor.find({
                                                            where: {
                                                                doctor_id: appt.DOCTOR_ID
                                                            }
                                                        }, {
                                                            raw: true
                                                        })
                                                        .success(function(doctor) {
                                                            //check doctor
                                                            if (doctor === null || doctor.length === 0) {
                                                                console.log('******************* Find not found doctor in doctor table *******************');
                                                                res.json({
                                                                    status: 'fail'
                                                                });
                                                                return false;
                                                            }
                                                            //check status
                                                            var status = "findFound";
                                                            if (data === null || data.length === 0) {
                                                                status = "findNull";
                                                            }

                                                            var response = [{
                                                                "data": data || [],
                                                                "dataMA": dataMA || [],
                                                                "patient": patient,
                                                                "appt": appt,
                                                                "doctor": doctor,
                                                                "status": status,
                                                                "nameCompany": (company === null || company.length === 0) ? null : company.Company_name
                                                            }];
                                                            res.json(response);
                                                            return true;
                                                        })
                                                        .error(function(err) {
                                                            console.log('*******************' + err + '*******************');
                                                            res.json({
                                                                status: 'fail'
                                                            });
                                                            return false;
                                                        });
                                                })
                                                .error(function(err) {
                                                    console.log('*******************' + err + '*******************');
                                                    res.json({
                                                        status: 'fail'
                                                    });
                                                    return false;
                                                });
                                        })
                                        .error(function(err) {
                                            console.log("*******************" + err + "*******************");
                                            res.json({
                                                status: 'fail'
                                            });
                                            return false;
                                        });
                                })
                                .error(function(err) {
                                    console.log("*******************" + err + "*******************");
                                    res.json({
                                        status: 'fail'
                                    });
                                    return false;
                                });
                        })
                        .error(function(err) {
                            console.log('*******************' + err + '*******************');
                            res.json({
                                status: 'fail'
                            });
                            return false;
                        });
                }
            })
            .error(function(err) {
                console.log('*******************' + err + '*******************');
                res.json({
                    status: 'fail'
                });
                return false;
            });
    },
    insertMRS: function(req, res) {
        var info = req.body.info || [];
        MedicalSummary.create({
                patient_id: info.patient_id,
                cal_id: info.cal_id,
                sticker_here: info.sticker_here,
                proposed: info.proposed,
                as_height: info.as_height,
                as_weight: info.as_weight,
                as_whr: info.as_whr,
                as_bmi: info.as_bmi,
                as_height_weight: info.as_height_weight,
                as_medical_history: info.as_medical_history,
                as_medical_assessment: info.as_medical_assessment,
                as_functional_assessment: info.as_functional_assessment,
                as_hearing_test: info.as_hearing_test,
                as_spirometry: info.as_spirometry,
                as_drug_test: info.as_drug_test,
                as_other: info.as_other,
                ac_any_existing_or_active: info.ac_any_existing_or_active,
                ac_any_history: info.ac_any_history,
                ac_cardiovascular: info.ac_cardiovascular,
                ac_any_current_or_work_related: info.ac_any_current_or_work_related,
                ac_any_medical_or_functional: info.ac_any_medical_or_functional,
                ac_any_diagnosed_or_previous: info.ac_any_diagnosed_or_previous,
                ac_examiner_comment: info.ac_examiner_comment,
                risk_rating: info.risk_rating,
                rr_amber_comment: info.rr_amber_comment,
                rr_red_comment: info.rr_red_comment,
                mrs_review: info.mrs_review,
                mrs_doc_date: info.mrs_doc_date || new Date(),
                doctor_id: info.doctor_id,
                created_by: info.created_by,
                last_updated_by: info.last_updated_by
            }, {
                raw: true
            })
            .success(function() {
                res.json({
                    status: 'success'
                });
                return true;
            })
            .error(function(err) {
                console.log('*******************' + err + '*******************');
                res.json({
                    status: 'fail'
                });
                return false;
            });
    },
    editMRS: function(req, res) {
        var info = req.body.info || [];
        MedicalSummary.update({
                patient_id: info.patient_id,
                cal_id: info.cal_id,
                sticker_here: info.sticker_here,
                proposed: info.proposed,
                as_height: info.as_height,
                as_weight: info.as_weight,
                as_whr: info.as_whr,
                as_bmi: info.as_bmi,
                as_height_weight: info.as_height_weight,
                as_medical_history: info.as_medical_history,
                as_medical_assessment: info.as_medical_assessment,
                as_functional_assessment: info.as_functional_assessment,
                as_hearing_test: info.as_hearing_test,
                as_spirometry: info.as_spirometry,
                as_drug_test: info.as_drug_test,
                as_other: info.as_other,
                ac_any_existing_or_active: info.ac_any_existing_or_active,
                ac_any_history: info.ac_any_history,
                ac_cardiovascular: info.ac_cardiovascular,
                ac_any_current_or_work_related: info.ac_any_current_or_work_related,
                ac_any_medical_or_functional: info.ac_any_medical_or_functional,
                ac_any_diagnosed_or_previous: info.ac_any_diagnosed_or_previous,
                ac_examiner_comment: info.ac_examiner_comment,
                risk_rating: info.risk_rating,
                rr_amber_comment: info.rr_amber_comment,
                rr_red_comment: info.rr_red_comment,
                mrs_review: info.mrs_review,
                mrs_doc_date: info.mrs_doc_date,
                doctor_id: info.doctor_id,
                created_by: info.created_by,
                last_updated_by: info.last_updated_by
            }, {
                mrs_id: info.mrs_id
            })
            .success(function() {
                res.json({
                    status: 'success'
                });
                return true;
            })
            .error(function(err) {
                console.log('*******************' + err + '*******************');
                res.json({
                    status: 'fail'
                });
                return false;
            });
    }
};
