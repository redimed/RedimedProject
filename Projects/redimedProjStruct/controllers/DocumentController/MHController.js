/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');

//Begin table module
var MedicalHistory = db.MedicalHistory;
var Patient = db.Patient;
var Doctor = db.Doctor;
var APPTCAL = db.APPTCAL;
//End table module

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
        var calId = req.params.CAL_ID;
        var MH_ID = req.params.MH_DF_ID;
        var patientId = req.params.PATIENT_ID;

        mkdirp('.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId, function (err) {
            if (err) console.error("ERROR:" + err);
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();

                paramMap.putSync("cal_id", parseInt(calId));
                paramMap.putSync("patient_id", parseInt(patientId));
                paramMap.putSync("key", parseInt(MH_ID));
                paramMap.putSync("real_path", "./reports/MH/");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\MedicalHistory.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/MH/mh_report.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log("ERROR:" + err);
                        return;
                    }
                    else {

                        res.download(filePath, 'MedicalHistory.pdf', function (err) {
                            if (err) {
                                console.log("ERROR:" + err);
                                return;
                            }
                        });
                    }

                });
            }
        });
    },
    loadMH: function (req, res) {
        var info = req.body.info || [];
        var patient_id = info.patient_id;
        var cal_id = info.cal_id;
        //load doc medical history
        MedicalHistory.find({where: {cal_id: cal_id, patient_id: patient_id}}, {raw: true})
            .success(function (data) {
                //check patient
                Patient.find({where: {Patient_id: patient_id}}, {rwa: true})
                    .success(function (patient) {
                        if (patient == null || patient.length == 0) {
                            console.log("******************* Find not found patient in cln_patient table *******************");
                            res.json({status: 'fail'});
                            return false;
                        }
                        //check appt
                        APPTCAL.find({where: {cal_id: cal_id}}, {raw: true})
                            .success(function (appt) {
                                if (appt == null || appt.length == 0) {
                                    console.log("******************* Find not found appt in appt table *******************");
                                    res.json({status: 'fail'});
                                    return false;
                                }
                                //check doctor
                                Doctor.find({where: {doctor_id: appt.DOCTOR_ID}})
                                    .success(function (doctor) {
                                        if (doctor == null || doctor.length == 0) {
                                            console.log("******************* Find not found doctor in doctor table *******************");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        var status = "findFound";
                                        if (data == null || data.length == 0) {
                                            status = "findNull";
                                        }
                                        var response = [{
                                            "data": data,
                                            "patient": patient,
                                            "appt": appt,
                                            "doctor": doctor,
                                            "status": status
                                        }];
                                        res.json(response);
                                        return true;
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
    insertMH: function (req, res) {
        var info = req.body.info || [];
    },
    editMH: function (req, res) {
        var info = req.body.info || [];

    }
};