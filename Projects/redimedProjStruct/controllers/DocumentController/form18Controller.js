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
        var gorgonId = req.params.gorgonId;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId, function (err) {
            if (err) console.error("******************* ERROR:" + err + ' *******************')
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();


                paramMap.putSync("key", parseInt(gorgonId));
                paramMap.putSync("real_path", "./reports/AF18");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\from18.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/AF18/from18.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log("******************* ERROR:" + err + ' *******************');
                        return;
                    }
                    else {

                        res.download(filePath, 'from18.pdf', function (err) {
                            if (err) {
                                console.log("******************* ERROR:" + err + " *******************");
                                return;
                            }
                        });
                    }

                });
            }
        });
    },


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
                                                            res.json({status: 'fail'});
                                                            return false;
                                                        }
                                                        if (dataF18 === null || dataF18.length === 0) {
                                                            var response = [
                                                                {
                                                                    "status": "findNull",
                                                                    "patient": patient,
                                                                    "doctor": doctor,
                                                                    "APPT": APPT,
                                                                    "rmSite": rmSite,
                                                                    "company": company
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
                    WORKER_SIGNATURE: info.WORKER_SIGNATURE
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
            WORKER_SIGNATURE: info.WORKER_SIGNATURE
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