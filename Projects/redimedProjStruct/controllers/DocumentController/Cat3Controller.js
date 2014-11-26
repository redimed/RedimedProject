/**
 * Created by thanh on 10/10/2014.
 */
var db = require('../../models');
var Category3 = db.Category3;
var Patient = db.Patient;
var Company = db.Company;
var APPTCAL = db.APPTCAL;
var Doctor = db.Doctor;

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
        var catId = req.params.catId;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId, function (err) {
            if (err) console.error(err)
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();

                paramMap.putSync("cal_id", parseInt(calId));
                paramMap.putSync("patient_id", parseInt(patientId));
                paramMap.putSync("key", parseInt(catId));
                paramMap.putSync("real_path", "./reports/CAT3");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\category_3.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/CAT3/category_3.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log("******************* ERROR:" + err + ' *******************');
                        return;
                    }
                    else {

                        res.download(filePath, 'category_3.pdf', function (err) {
                            if (err) {
                                console.log("******************* ERROR:" + err + ' *******************');
                                return;
                            }
                        });
                    }

                });
            }
        });
    },
    loadCat3: function (req, res) {
        var info = req.body.info || [];
        var cal_id = info.cal_id;
        var patient_id = info.patient_id;
        Category3.find({where: {cal_id: cal_id, patient_id: patient_id}}, {raw: true})
            .success(function (data) {
                Patient.find({where: {patient_id: patient_id}}, {raw: true})
                    .success(function (patient) {
                        //check exist patient
                        if (patient == null || patient.length == 0) {
                            console.log('******************* Not found user in patient table *******************');
                            res.json({status: 'fail'});
                            return false;
                        }
                        APPTCAL.find({where: {cal_id: cal_id}}, {raw: true})
                            .success(function (APPT) {
                                //check appointment calendar
                                if (APPT == null || APPT.length == 0) {
                                    console.log("******************* Not found Appointment calendar in APPT table *******************");
                                    res.json({status: 'fail'});
                                    return false;
                                }
                                Doctor.find({where: {doctor_id: APPT.DOCTOR_ID}}, {raw: true})
                                    .success(function (doctor) {
                                        //check exist doctor
                                        if (doctor == null || doctor.length == 0) {
                                            console.log("******************* Not found doctor in doctor table *******************");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        Company.find({where: {id: patient.company_id}}, {raw: true})
                                            .success(function (company) {
                                                if (data === null || data.length === 0) {
                                                    var response = [{
                                                        "status": "findNull",
                                                        "patient": patient,
                                                        "doctor": doctor,
                                                        "appt": APPT,
                                                        "company": (company == null || company.length == 0) ? [] : company
                                                    }];
                                                    res.json(response);
                                                    return true;
                                                }
                                                else {
                                                    var response = [{
                                                        "status": "findFound",
                                                        "data": data,
                                                        "patient": patient,
                                                        "doctor": doctor,
                                                        "appt": APPT,
                                                        "company": (company == null || company.length == 0) ? [] : company
                                                    }];
                                                    res.json(response);
                                                    return true;
                                                }
                                            })
                                            .error(function (err) {
                                                console.log('******************* ERROR:' + err + ' *******************');
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
                    })
            })
            .error(function (err) {
                console.log("******************* ERROR:" + err + ' *******************');
                res.json({status: "fail"});
                return false;
            });
    },
    insertCat3: function (req, res) {
        var info = req.body.info || [];
        Category3.max('cat_id').success(function (maxId) {
            var cat_id = maxId + 1;
            Category3.create({
                cat_id: cat_id,
                cal_id: info.cal_id,
                patient_id: info.patient_id,
                q1_4: info.q1_4,
                q1_4_c: info.q1_4_c,
                q1_5_1: info.q1_5_1,
                q1_5_2: info.q1_5_2,
                q1_5_3: info.q1_5_3,
                s3_q1_1_1: info.s3_q1_1_1,
                s3_q1_1_2: info.s3_q1_1_2,
                s3_q1_2_1: info.s3_q1_2_1,
                s3_q1_2_2: info.s3_q1_2_2,
                s3_q1_3: info.s3_q1_3,
                s3_q1_4: info.s3_q1_4,
                s3_q2_1_1: info.s3_q2_1_1,
                s3_q2_1_2: info.s3_q2_1_2,
                s3_q2_1_3: info.s3_q2_1_3,
                s3_q2_1_4: info.s3_q2_1_4,
                s3_q2_1_5: info.s3_q2_1_5,
                s3_q2_1_6: info.s3_q2_1_6,
                s3_q2_1_7: info.s3_q2_1_7,
                s3_q2_1_8: info.s3_q2_1_8,
                s3_q2_2_1: info.s3_q2_2_1,
                s3_q2_2_2: info.s3_q2_2_2,
                s3_q2_2_3: info.s3_q2_2_3,
                s3_q2_2_4: info.s3_q2_2_4,
                s3_q2_2_5: info.s3_q2_2_5,
                s3_q2_2_6: info.s3_q2_2_6,
                s3_q2_2_7: info.s3_q2_2_7,
                s3_q2_2_8: info.s3_q2_2_8,
                s3_q2_3: info.s3_q2_3,
                s3_q3_1: info.s3_q3_1,
                s3_q3_2: info.s3_q3_2,
                s3_q3_3_1: info.s3_q3_3_1,
                s3_q3_3_2: info.s3_q3_3_2,
                s3_q3_4_1: info.s3_q3_4_1,
                s3_q3_4_2: info.s3_q3_4_2,
                s3_q3_5: info.s3_q3_5,
                s3_q3_6: info.s3_q3_6,
                s3_q4: info.s3_q4,
                s3_q5_1_1_1: info.s3_q5_1_1_1,
                s3_q5_1_1_2: info.s3_q5_1_1_2,
                s3_q5_1_1_3: info.s3_q5_1_1_3,
                s3_q5_1_1_4: info.s3_q5_1_1_4,
                s3_q5_1_2: info.s3_q5_1_2,
                s3_q5_2: info.s3_q5_2,
                s3_q5_3: info.s3_q5_3,
                s3_q5_4: info.s3_q5_4,
                s3_q5_5: info.s3_q5_5,
                s3_q5_6: info.s3_q5_6,
                s3_q6_c: info.s3_q6_c,
                s3_q6_1: info.s3_q6_1,
                s3_q6_2_1: info.s3_q6_2_1,
                s3_q6_2_2: info.s3_q6_2_2,
                s3_q6_3_1: info.s3_q6_3_1,
                s3_q6_3_2: info.s3_q6_3_2,
                s3_q6_4_1: info.s3_q6_4_1,
                s3_q6_4_2: info.s3_q6_4_2,
                s3_q6_5_1: info.s3_q6_5_1,
                s3_q6_5_2: info.s3_q6_5_2,
                s3_q6_6_1: info.s3_q6_6_1,
                s3_q6_6_2: info.s3_q6_6_2,
                s3_q6_7_1: info.s3_q6_7_1,
                s3_q6_7_2: info.s3_q6_7_2,
                s3_q6_8_1: info.s3_q6_8_1,
                s3_q6_8_2: info.s3_q6_8_2,
                s3_q6_9_1: info.s3_q6_9_1,
                s3_q6_9_2: info.s3_q6_9_2,
                s3_q7_1: info.s3_q7_1,
                s3_q7_2: info.s3_q7_2,
                s4_c: info.s4_c,
                s4_1: info.s4_1,
                s4_2: info.s4_2,
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
                DocId: info.DocId,
                q1_5_3_c: info.q1_5_3_c,
                PATIENT_SIGNATURE: info.PATIENT_SIGNATURE,
                PATIENT_DATE: info.PATIENT_DATE,
                DOCTOR_ID: info.DOCTOR_ID

            }, {raw: true})
                .success(function () {
                    res.json({status: "success"});
                    return true;
                }).error(function (err) {
                    console.log("******************* ERROR:" + err + ' *******************');
                    res.json({status: "fail"});
                    return false;
                })
        }).error(function (err) {
            console.log("******************* ERROR:" + err + ' *******************');
            res.json({status: "fail"});
            return false;
        })

    },
    editCat3: function (req, res) {
        var info = req.body.info || [];
        Category3.update({
            cal_id: info.cal_id,
            patient_id: info.patient_id,
            q1_4: info.q1_4,
            q1_4_c: info.q1_4_c,
            q1_5_1: info.q1_5_1,
            q1_5_2: info.q1_5_2,
            q1_5_3: info.q1_5_3,
            s3_q1_1_1: info.s3_q1_1_1,
            s3_q1_1_2: info.s3_q1_1_2,
            s3_q1_2_1: info.s3_q1_2_1,
            s3_q1_2_2: info.s3_q1_2_2,
            s3_q1_3: info.s3_q1_3,
            s3_q1_4: info.s3_q1_4,
            s3_q2_1_1: info.s3_q2_1_1,
            s3_q2_1_2: info.s3_q2_1_2,
            s3_q2_1_3: info.s3_q2_1_3,
            s3_q2_1_4: info.s3_q2_1_4,
            s3_q2_1_5: info.s3_q2_1_5,
            s3_q2_1_6: info.s3_q2_1_6,
            s3_q2_1_7: info.s3_q2_1_7,
            s3_q2_1_8: info.s3_q2_1_8,
            s3_q2_2_1: info.s3_q2_2_1,
            s3_q2_2_2: info.s3_q2_2_2,
            s3_q2_2_3: info.s3_q2_2_3,
            s3_q2_2_4: info.s3_q2_2_4,
            s3_q2_2_5: info.s3_q2_2_5,
            s3_q2_2_6: info.s3_q2_2_6,
            s3_q2_2_7: info.s3_q2_2_7,
            s3_q2_2_8: info.s3_q2_2_8,
            s3_q2_3: info.s3_q2_3,
            s3_q3_1: info.s3_q3_1,
            s3_q3_2: info.s3_q3_2,
            s3_q3_3_1: info.s3_q3_3_1,
            s3_q3_3_2: info.s3_q3_3_2,
            s3_q3_4_1: info.s3_q3_4_1,
            s3_q3_4_2: info.s3_q3_4_2,
            s3_q3_5: info.s3_q3_5,
            s3_q3_6: info.s3_q3_6,
            s3_q4: info.s3_q4,
            s3_q5_1_1_1: info.s3_q5_1_1_1,
            s3_q5_1_1_2: info.s3_q5_1_1_2,
            s3_q5_1_1_3: info.s3_q5_1_1_3,
            s3_q5_1_1_4: info.s3_q5_1_1_4,
            s3_q5_1_2: info.s3_q5_1_2,
            s3_q5_2: info.s3_q5_2,
            s3_q5_3: info.s3_q5_3,
            s3_q5_4: info.s3_q5_4,
            s3_q5_5: info.s3_q5_5,
            s3_q5_6: info.s3_q5_6,
            s3_q6_c: info.s3_q6_c,
            s3_q6_1: info.s3_q6_1,
            s3_q6_2_1: info.s3_q6_2_1,
            s3_q6_2_2: info.s3_q6_2_2,
            s3_q6_3_1: info.s3_q6_3_1,
            s3_q6_3_2: info.s3_q6_3_2,
            s3_q6_4_1: info.s3_q6_4_1,
            s3_q6_4_2: info.s3_q6_4_2,
            s3_q6_5_1: info.s3_q6_5_1,
            s3_q6_5_2: info.s3_q6_5_2,
            s3_q6_6_1: info.s3_q6_6_1,
            s3_q6_6_2: info.s3_q6_6_2,
            s3_q6_7_1: info.s3_q6_7_1,
            s3_q6_7_2: info.s3_q6_7_2,
            s3_q6_8_1: info.s3_q6_8_1,
            s3_q6_8_2: info.s3_q6_8_2,
            s3_q6_9_1: info.s3_q6_9_1,
            s3_q6_9_2: info.s3_q6_9_2,
            s3_q7_1: info.s3_q7_1,
            s3_q7_2: info.s3_q7_2,
            s4_c: info.s4_c,
            s4_1: info.s4_1,
            s4_2: info.s4_2,
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
            DocId: info.DocId,
            q1_5_3_c: info.q1_5_3_c,
            PATIENT_SIGNATURE: info.PATIENT_SIGNATURE,
            PATIENT_DATE: info.PATIENT_DATE,
            DOCTOR_ID: info.DOCTOR_ID
        }, {cat_id: info.cat_id}).success(function () {
            res.json({status: 'success'});
            return true;
        }).error(function (err) {
            console.log(" *******************ERROR:" + err + ' *******************');
            res.json({status: 'fail'});
            return false;
        });
    }

};