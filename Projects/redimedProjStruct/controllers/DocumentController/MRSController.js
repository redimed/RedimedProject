/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
var Patient = db.Patient;
var Doctor = db.Doctor;
var MedicalSummary = db.MedicalSummary;
var APPTCAL = db.APPTCAL;


var mkdirp = require('mkdirp');

var java = require('java');
java.options.push("-Djava.awt.headless=true");
java.classpath.push('commons-lang3-3.1.jar');
java.classpath.push('commons-io.jar');
java.classpath.push('./lib/commons-beanutils-1.8.2.jar');
java.classpath.push('./lib/commons-collections-3.2.1.jar');
java.classpath.push('./lib/commons-digester-2.1.jar');
java.classpath.push('./lib/commons-logging-1.1.jar');
java.classpath.push('./lib/groovy-all-2.0.1.jar');
java.classpath.push('./lib/iText-2.1.7.js2.jar');
java.classpath.push('./lib/jasperreports-5.6.0.jar');
java.classpath.push('./lib/mysql-connector-java-5.1.13-bin.jar');
java.classpath.push('./lib/org-apache-commons-codec.jar');


var HashMap = java.import('java.util.HashMap');
var JRException = java.import('net.sf.jasperreports.engine.JRException');
var JasperExportManager = java.import('net.sf.jasperreports.engine.JasperExportManager');
var JasperFillManager = java.import('net.sf.jasperreports.engine.JasperFillManager');
var JasperPrint = java.import('net.sf.jasperreports.engine.JasperPrint');
var DriverManager = java.import('java.sql.DriverManager');
var Driver = java.import('com.mysql.jdbc.Driver');
var InputStream = java.import('java.io.InputStream');
var FileInputStream = java.import('java.io.FileInputStream');
module.exports = {
    printReport: function (req, res, next) {
        var calId = req.params.calId;
        var id = req.params.id;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId, function (err) {
            if (err) console.error("******************* ERROR:" + err + ' *******************');
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();

                paramMap.putSync("id", parseInt(id));
                paramMap.putSync("real_path", "./reports/MRS/");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\MRS.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/MRS/result_summary.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log('******************* ERROR:' + err + ' *******************');
                        return;
                    } else {

                        res.download(filePath, 'MRS.pdf', function (err) {
                            if (err) {
                                console.log('******************* ERROR:' + err + ' *******************');
                                return;
                            }
                        });
                    }

                });
            }
        });


    },
    loadMRS: function (req, res) {
        var info = req.body.info;
        var patient_id = info.patient_id;
        var cal_id = info.cal_id;
        //load doc
        MedicalSummary.find({where: {patient_id: patient_id, cal_id: cal_id}}, {raw: true})
            .success(function (data) {
                //load patient
                Patient.find({where: {patient_id: patient_id}}, {raw: true})
                    .success(function (patient) {
                        //check patient
                        if (patient === null || patient.length === 0) {
                            console.log('******************* Find not found patient in cln_patient *******************');
                            res.json({status: 'fail'});
                            return false;
                        }
                        //load appt
                        APPTCAL.find({where: {cal_id: cal_id}}, {raw: true})
                            .success(function (appt) {
                                //check appt
                                if (appt === null || appt.length === 0) {
                                    console.log('******************* Find not found appt in appt table')
                                    res.json({status: 'fail'});
                                    return false;
                                }
                                ;
                                //load doctor
                                Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                    .success(function (doctor) {
                                        //check doctor
                                        if (doctor === null || doctor.length === 0) {
                                            console.log('******************* Find not found doctor in doctor table *******************');
                                            res.json({
                                                status: 'fail'
                                            });
                                            return false;
                                        }
                                        ;
                                        //check status
                                        var status = "findFound";
                                        if (data == null || data.length == 0) {
                                            status = "findNull";
                                        }

                                        var response = [{
                                            "data": data || [],
                                            "patient": patient,
                                            "appt": appt,
                                            "doctor": doctor,
                                            "status": status
                                        }];
                                        res.json(response);
                                        return true;
                                    })
                                    .error(function (err) {
                                        console.log('*******************' + err + '*******************');
                                        res.json({status: 'fail'});
                                        return false;
                                    });
                            })
                            .error(function (err) {
                                console.log('*******************' + err + '*******************');
                                res.json({status: 'fail'});
                                return false;
                            });
                    })
                    .error(function (err) {
                        console.log("*******************" + err + "*******************");
                        res.json({status: 'fail'});
                        return false;
                    });
            })
            .error(function (err) {
                console.log("*******************" + err + "*******************");
                res.json({status: 'fail'});
                return false;
            });
    },
    insertMRS: function (req, res) {
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
            rr_screen: info.rr_screen,
            rr_amber: info.rr_amber,
            rr_amber_comment: info.rr_amber_comment,
            rr_red: info.rr_red,
            rr_red_comment: info.rr_red_comment,
            mrs_review: info.mrs_review,
            mrs_doc_date: info.mrs_doc_date,
            doctor_id: info.doctor_id,
            created_by: info.created_by,
            last_updated_by: info.last_updated_by
        }, {
            raw: true
        })
            .success(function () {
                res.json({status: 'success'});
                return true;
            })
            .error(function (err) {
                console.log('*******************' + err + '*******************');
                res.json({status: 'fail'});
                return false;
            });
    },
    editMRS: function (req, res) {
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
            rr_screen: info.rr_screen,
            rr_amber: info.rr_amber,
            rr_amber_comment: info.rr_amber_comment,
            rr_red: info.rr_red,
            rr_red_comment: info.rr_red_comment,
            mrs_review: info.mrs_review,
            mrs_doc_date: info.mrs_doc_date,
            doctor_id: info.doctor_id,
            created_by: info.created_by,
            last_updated_by: info.last_updated_by
        }, {
            mrs_id: info.mrs_id
        })
            .success(function () {
                res.json({status: 'success'});
                return true;
            })
            .error(function (err) {
                console.log('*******************' + err + '*******************');
                res.json({status: 'fail'});
                return false;
            });
    }
};