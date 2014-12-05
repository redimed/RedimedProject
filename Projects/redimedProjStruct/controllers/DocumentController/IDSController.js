/*Created by meditech on 24 / 09 / 2014. */
var db = require('../../models');
var GroupsIDSCLN = db.GroupsIDSCLN;
var GroupsIDSSYS = db.GroupsIDSSYS;
var HeadersIDSCLN = db.HeadersIDSCLN;
var HeadersIDSSYS = db.HeadersIDSSYS;
var LinesIDSCLN = db.LinesIDSCLN;
var LinesIDSSYS = db.LinesIDSSYS;
var Doctor = db.Doctor;
var Patient = db.Patient;
var APPTCAL = db.APPTCAL;

var util = require('util');
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
            if (err) console.error(err);
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();

                paramMap.putSync("cal_id", parseInt(calId));

                paramMap.putSync("patient_id", parseInt(patientId));

                paramMap.putSync("key", parseInt(id));

                paramMap.putSync("real_path", "./reports/IDAS");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\IDS.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/IDAS/idas_report.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {

                        res.download(filePath, 'IDS.pdf', function (err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }

                });
            }
        });
    },
    loadIDS: function (req, res) {
        var info = req.body.info || [];
        var PATIENT_ID = info.PATIENT_ID;
        var CAL_ID = info.CAL_ID;
        HeadersIDSCLN.findAll({where: {CAL_ID: CAL_ID, PATIENT_ID: PATIENT_ID}}, {raw: true})
            .success(function (dataH) {
                if (dataH === null || dataH.length === 0) return loadSYS(req, res, info);
                GroupsIDSCLN.findAll({where: {CAL_ID: CAL_ID, PATIENT_ID: PATIENT_ID}}, {raw: true})
                    .success(function (dataG) {
                        if (dataG === null || dataG.length === 0) return loadSYS(req, res, info);
                        LinesIDSCLN.findAll({where: {CAL_ID: CAL_ID, PATIENT_ID: PATIENT_ID}}, {
                            raw: true
                        })
                            .success(function (dataL) {
                                if (dataL === null || dataL.length === 0) return loadSYS(req, res, info);
                                //find patient
                                Patient.find({where: {Patient_id: PATIENT_ID}}, {raw: true})
                                    .success(function (patient) {
                                        if (patient === null || patient.length === 0) {
                                            console.log("Not found patient in patient table");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        APPTCAL.find({where: {cal_id: CAL_ID}}, {raw: true})
                                            .success(function (appt) {
                                                if (appt === null || appt.length === 0) {
                                                    console.log("Not found APPTCAL in table");
                                                    res.json({status: 'fail'});
                                                    return false;
                                                }
                                                Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                                    .success(function (doctor) {
                                                        if (doctor === null || doctor.length === 0) {
                                                            console.log("Not found doctor in table");
                                                            res.json({status: 'fail'});
                                                            return false;
                                                        }
                                                        //get date
                                                        var data = [{
                                                            "headers": dataH,
                                                            "groups": dataG,
                                                            "lines": dataL,
                                                            "doctor": doctor,
                                                            "patient": patient,
                                                            "appt": appt,
                                                            "status": "findFound"
                                                        }];
                                                        res.json(data);
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
    },
    insertIDS: function (req, res) {
        var info = req.body.info || [];
        info.headers.forEach(function (infoH, hIndex) {
            HeadersIDSCLN.create({
                IDAS_ID: infoH.IDAS_ID,
                PATIENT_ID: infoH.PATIENT_ID,
                CAL_ID: infoH.CAL_ID,
                DOCTOR_ID: infoH.DOCTOR_ID,
                DF_CODE: infoH.DF_CODE,
                NAME: infoH.NAME,
                IDAS_DATE: infoH.IDAS_DATE,
                Temperature: infoH.Temperature,
                Creatinine: infoH.Creatinine,
                Drug_Test_Time: infoH.Drug_Test_Time,
                Expiry_Date: infoH.Expiry_Date,
                Notes: infoH.Notes,
                Alcohol_Test_Time: infoH.Alcohol_Test_Time,
                Reading: infoH.Reading,
                Positive_Negative: infoH.Positive_Negative,
                Reading2: infoH.Reading2,
                ITEM_ID: infoH.ITEM_ID,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                NAME_COMMENT: infoH.NAME_COMMENT,
                ISENABLE: infoH.ISENABLE,
                SIGNATURE: infoH.SIGNATURE,
                TesterName: infoH.TesterName,
                TesterSign: infoH.TesterSign,
                TesterDate: infoH.TesterDate
            })
                .success(function () {
                    info.headers[hIndex].groups.forEach(function (infoG, gIndex) {
                        GroupsIDSCLN.create({
                            IDAS_GROUP_ID: infoG.IDAS_GROUP_ID,
                            IDAS_ID: infoH.IDAS_ID,
                            PATIENT_ID: infoH.PATIENT_ID,
                            CAL_ID: infoH.CAL_ID,
                            ORD: infoH.ORD,
                            GROUP_NAME: infoH.GROUP_NAME,
                            USER_TYPE: infoH.USER_TYPE,
                            Created_by: infoH.Created_by,
                            Last_updated_by: infoH.Last_updated_by,
                            ISENABLE: infoH.ISENABLE
                        }).success(function () {
                            info.headers[hIndex].groups[gIndex].lines.forEach(function (infoL, lIndex) {
                                LinesIDSCLN.create({
                                    IDAS_LINE_ID: infoL.IDAS_LINE_ID,
                                    IDAS_GROUP_ID: infoL.IDAS_GROUP_ID,
                                    IDAS_ID: infoL.IDAS_ID,
                                    PATIENT_ID: infoL.PATIENT_ID,
                                    CAL_ID: infoL.CAL_ID,
                                    ORD: infoL.ORD,
                                    QUESTION: infoL.QUESTION,
                                    YES_NO: infoL.YES_NO,
                                    Created_by: infoL.Created_by,
                                    Last_updated_by: infoL.Last_updated_by,
                                    ISENABLE: infoL.ISENABLE
                                })
                                    .success(function () {
                                        res.json({status: 'success'});
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'fail'});
                                        return false;
                                    });
                            });
                        })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                                return false;
                            });
                    });
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                    return false;
                });
        });
    },

    updateIDS: function (req, res) {
        var info = req.body.info || [];
        info.headers.forEach(function (infoH, hIndex) {
            HeadersIDSCLN.update({
                DOCTOR_ID: infoH.DOCTOR_ID,
                DF_CODE: infoH.DF_CODE,
                NAME: infoH.NAME,
                IDAS_DATE: infoH.IDAS_DATE,
                Temperature: infoH.Temperature,
                Creatinine: infoH.Creatinine,
                Drug_Test_Time: infoH.Drug_Test_Time,
                Expiry_Date: infoH.Expiry_Date,
                Notes: infoH.Notes,
                Alcohol_Test_Time: infoH.Alcohol_Test_Time,
                Reading: infoH.Reading,
                Positive_Negative: infoH.Positive_Negative,
                Reading2: infoH.Reading2,
                ITEM_ID: infoH.ITEM_ID,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                NAME_COMMENT: infoH.NAME_COMMENT,
                ISENABLE: infoH.ISENABLE,
                SIGNATURE: infoH.SIGNATURE,
                TesterName: infoH.TesterName,
                TesterSign: infoH.TesterSign,
                TesterDate: infoH.TesterDate
            }, {
                IDAS_ID: infoH.IDAS_ID,
                PATIENT_ID: infoH.PATIENT_ID,
                CAL_ID: infoH.CAL_ID
            })
                .success(function () {
                    info.headers[hIndex].groups.forEach(function (infoG, gIndex) {
                        GroupsIDSCLN.update({
                            IDAS_ID: infoH.IDAS_ID,
                            ORD: infoH.ORD,
                            GROUP_NAME: infoH.GROUP_NAME,
                            USER_TYPE: infoH.USER_TYPE,
                            Created_by: infoH.Created_by,
                            Last_updated_by: infoH.Last_updated_by,
                            ISENABLE: infoH.ISENABLE
                        }, {
                            IDAS_GROUP_ID: infoG.IDAS_GROUP_ID,
                            PATIENT_ID: infoH.PATIENT_ID,
                            CAL_ID: infoH.CAL_ID
                        }).success(function () {
                            info.headers[hIndex].groups[gIndex].lines.forEach(function (infoL, lIndex) {
                                LinesIDSCLN.update({
                                    IDAS_GROUP_ID: infoL.IDAS_GROUP_ID,
                                    IDAS_ID: infoL.IDAS_ID,
                                    ORD: infoL.ORD,
                                    QUESTION: infoL.QUESTION,
                                    YES_NO: infoL.YES_NO,
                                    Created_by: infoL.Created_by,
                                    Last_updated_by: infoL.Last_updated_by,
                                    ISENABLE: infoL.ISENABLE
                                }, {
                                    IDAS_LINE_ID: infoL.IDAS_LINE_ID,
                                    PATIENT_ID: infoL.PATIENT_ID,
                                    CAL_ID: infoL.CAL_ID
                                })
                                    .success(function () {
                                        res.json({status: 'success'});
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'fail'});
                                        return false;
                                    });
                            });
                        })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                                return false;
                            });
                    });
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                    return false;
                });
        });
    }
};

var loadSYS = function (req, res, info) {
    var PATIENT_ID = info.PATIENT_ID;
    var CAL_ID = info.CAL_ID;
    HeadersIDSSYS.findAll({}, {raw: true})
        .success(function (dataH) {
            if (dataH === null || dataH.length === 0) {
                console.log("Not found headers in sys table");
                res.json({status: 'fail'});
                return false;
            }
            GroupsIDSSYS.findAll({}, {raw: true})
                .success(function (dataG) {
                    if (dataG == null || dataG.length == 0) {
                        console.log("Not found groups in sys table");
                        res.json({status: 'fail'});
                        return false;
                    }
                    LinesIDSSYS.findAll({}, {raw: true})
                        .success(function (dataL) {
                            if (dataL === null || dataL.length === 0) {
                                console.log("Not found lines in sys table");
                                return false;
                            }
                            Patient.find({where: {Patient_id: PATIENT_ID}}, {raw: true})
                                .success(function (patient) {
                                    if (patient == null || patient.length == 0) {
                                        console.log("Not found patient in patient table");
                                        res.json({status: 'fail'});
                                        return false;
                                    }
                                    APPTCAL.find({where: {cal_id: CAL_ID}}, {raw: true})
                                        .success(function (appt) {
                                            if (appt === null || appt.length === 0) {
                                                console.log("Not found APPTCAL in table");
                                                res.json({status: 'fail'});
                                                return false;
                                            }
                                            Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                                .success(function (doctor) {
                                                    if (doctor === null || doctor.length === 0) {
                                                        console.log("Not found doctor in table");
                                                        res.json({status: 'fail'});
                                                        return false;
                                                    }
                                                    var data = [{
                                                        "headers": dataH,
                                                        "groups": dataG,
                                                        "lines": dataL,
                                                        "doctor": doctor,
                                                        "patient": patient,
                                                        "appt": appt,
                                                        "status": "findNull"
                                                    }];
                                                    res.json(data);
                                                    return true;
                                                })
                                                .error(function (err) {
                                                    console.log("ERROR: " + err);
                                                    res.json({status: 'fail'});
                                                    return false;
                                                });
                                        })
                                        .error(function (err) {
                                            console.log("ERROR: " + err);
                                            res.json({status: 'fail'});
                                            return false;
                                        });
                                })
                                .error(function (err) {
                                    console.log("ERROR: " + err);
                                    res.json({status: 'fail'});
                                    return false;
                                });
                        })
                        .error(function (err) {
                            console.log("ERROR: " + err);
                            res.json({status: 'fail'});
                            return false;
                        });
                })
                .error(function (err) {
                    console.log("ERROR: " + err);
                    res.json({status: 'fail'});
                    return false;
                });
        })
        .error(function (err) {
            console.log("ERROR: " + err);
            res.json({status: 'fail'});
            return false;
        });
};

