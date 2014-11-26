/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
var headersMRSCLN = db.headersMRSCLN;
var groupsMRSCLN = db.groupsMRSCLN;
var linesMRSCLN = db.linesMRSCLN;
var headersMRSSYS = db.headersMRSSYS;
var groupsMRSSYS = db.groupsMRSSYS;
var linesMRSSYS = db.linesMRSSYS;
var Patient = db.Patient;

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

                paramMap.putSync("cal_id", parseInt(calId));
                paramMap.putSync("patient_id", parseInt(patientId));
                paramMap.putSync("key", parseInt(id));
                paramMap.putSync("real_path", "./reports/MRS/");
                paramMap.putSync("SUBREPORT_DIR", "./reports/MRS");

                var filePath = '.\\download\\report\\' + 'patientID_' + patientId + '\\calID_' + calId + '\\MRS.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/MRS/result_summary.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log('******************* ERROR:' + err + ' *******************');
                        return;
                    }
                    else {

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
        var PATIENT_ID = info.PATIENT_ID;
        var CAL_ID = info.CAL_ID;
        /**
         * search in cln table
         */
        db.headersMRSCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
            .success(function (dataH) {
                //check exist headers cln
                if (dataH == null || dataH.length == 0) return LoadSYS(req, res, info);
                db.groupsMRSCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                    .success(function (dataG) {
                        //check exist groups cln
                        if (dataG == null || dataG.length == 0) return LoadSYS(req, res, info);
                        db.linesMRSCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                            .success(function (dataL) {
                                //check exist lines cln
                                if (dataL == null || dataL == 0) return LoadSYS(req, res, info);
                                Patient.find({where: {Patient_id: PATIENT_ID}}, {raw: true})
                                    .success(function (patient) {
                                        //check exist user in patient table
                                        if (patient == null || patient.length == 0) {
                                            console.log("******************* Not found user in table patient *******************");
                                            res.json({status: 'fail'});
                                            return false;
                                        }
                                        var data = [{
                                            "headers": dataH,
                                            "groups": dataG,
                                            "lines": dataL,
                                            "patient": patient,
                                            "status": 'findFound'
                                        }];
                                        res.json(data);
                                        return true;
                                    })
                                    .error(function (err) {
                                        console.log("******************* ERROR:" + err + '*******************');
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
    insertMRS: function (req, res) {
        var info = req.body.info;
        var practitionSign = info.practitionSign;
        var practitionDate = info.practitionDate;
        var isReview = info.isReview;
        var practitioner = info.practitioner;

        info.headers.forEach(function (infoH, hIndex) {
            db.headersMRSCLN.create({
                MRS_DF_ID: infoH.MRS_DF_ID,
                PATIENT_ID: infoH.PATIENT_ID,
                CAL_ID: infoH.CAL_ID,
                DF_CODE: infoH.DF_CODE,
                ITEM_ID: infoH.ITEM_ID,
                DESCRIPTION: infoH.DESCRIPTION,
                ISENABLE: infoH.ISENABLE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                practitioner: practitioner,
                practitionSign: practitionSign,
                practitionDate: practitionDate,
                isReview: isReview
            }, {raw: true})
                .success(function () {
                    info.headers[hIndex].group.forEach(function (infoG, gIndex) {
                        db.groupsMRSCLN.create({
                            MRS_GROUP_ID: infoG.MRS_GROUP_ID,
                            MRS_DF_ID: infoG.MRS_DF_ID,
                            PATIENT_ID: infoG.PATIENT_ID,
                            CAL_ID: infoG.CAL_ID,
                            ORD: infoG.ORD,
                            GROUP_NAME: infoG.GROUP_NAME,
                            USER_TYPE: infoG.USER_TYPE,
                            ISENABLE: infoG.ISENABLE,
                            Created_by: infoG.Created_by,
                            Last_updated_by: infoG.Last_updated_by
                        }, {raw: true})
                            .success(function () {
                                info.headers[hIndex].group[gIndex].line.forEach(function (infoL, lIndex) {
                                    db.linesMRSCLN.create({
                                        MRS_LINE_ID: infoL.MRS_LINE_ID,
                                        MRS_GROUP_ID: infoL.MRS_GROUP_ID,
                                        MRS_DF_ID: infoL.MRS_DF_ID,
                                        PATIENT_ID: infoL.PATIENT_ID,
                                        CAL_ID: infoL.CAL_ID,
                                        ORD: infoL.ORD,
                                        COMP_TYPE: infoL.COMP_TYPE,
                                        QUEST_LABEL: infoL.QUEST_LABEL,
                                        QUEST_VALUE: infoL.QUEST_VALUE,
                                        ISCOMMENT: infoL.ISCOMMENT,
                                        COMMENT_LABEL: infoL.COMMENT_LABEL,
                                        comments: infoL.comments,
                                        ISREQ_COMMENT: infoL.ISREQ_COMMENT,
                                        ISENABLE: infoL.ISENABLE,
                                        Created_by: infoL.Created_by,
                                        Last_updated_by: infoL.Last_updated_by
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
                            })
                            .error(function (err) {
                                console.log("******************* ERROR:" + err + ' *******************');
                                res.json({status: 'fail'});
                                return false;
                            });
                    })
                })
                .error(function (err) {
                    console.log("******************* ERROR:" + err + ' *******************');
                    res.json({status: 'fail'});
                    return false;
                });
        })
    },
    editMRS: function (req, res) {
        var info = req.body.info;
        var practitionSign = info.practitionSign;
        var practitionDate = info.practitionDate;
        var practitioner = info.practitioner;
        var isReview = info.isReview;
        info.headers.forEach(function (infoH, hIndex) {
            db.headersMRSCLN.update({
                DF_CODE: infoH.DF_CODE,
                ITEM_ID: infoH.ITEM_ID,
                DESCRIPTION: infoH.DESCRIPTION,
                ISENABLE: infoH.ISENABLE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                practitioner: practitioner,
                practitionSign: practitionSign,
                practitionDate: practitionDate,
                isReview: isReview
            }, {MRS_DF_ID: infoH.MRS_DF_ID, PATIENT_ID: infoH.PATIENT_ID, CAL_ID: infoH.CAL_ID})
                .success(function () {
                    info.headers[hIndex].group.forEach(function (infoG, gIndex) {
                        db.groupsMRSCLN.update({
                            MRS_DF_ID: infoG.MRS_DF_ID,
                            ORD: infoG.ORD,
                            GROUP_NAME: infoG.GROUP_NAME,
                            USER_TYPE: infoG.USER_TYPE,
                            ISENABLE: infoG.ISENABLE,
                            Created_by: infoG.Created_by,
                            Last_updated_by: infoG.Last_updated_by
                        }, {MRS_GROUP_ID: infoG.MRS_GROUP_ID, PATIENT_ID: infoG.PATIENT_ID, CAL_ID: infoG.CAL_ID})
                            .success(function () {
                                info.headers[hIndex].group[gIndex].line.forEach(function (infoL, lIndex) {
                                    db.linesMRSCLN.update({
                                        MRS_GROUP_ID: infoL.MRS_GROUP_ID,
                                        MRS_DF_ID: infoL.MRS_DF_ID,
                                        ORD: infoL.ORD,
                                        COMP_TYPE: infoL.COMP_TYPE,
                                        QUEST_LABEL: infoL.QUEST_LABEL,
                                        QUEST_VALUE: infoL.QUEST_VALUE,
                                        ISCOMMENT: infoL.ISCOMMENT,
                                        COMMENT_LABEL: infoL.COMMENT_LABEL,
                                        comments: infoL.comments,
                                        ISREQ_COMMENT: infoL.ISREQ_COMMENT,
                                        ISENABLE: infoL.ISENABLE,
                                        Created_by: infoL.Created_by,
                                        Last_updated_by: infoL.Last_updated_by
                                    }, {
                                        MRS_LINE_ID: infoL.MRS_LINE_ID, PATIENT_ID: infoL.PATIENT_ID,
                                        CAL_ID: infoL.CAL_ID
                                    })
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
                            })
                            .error(function (err) {
                                console.log("******************* ERROR:" + err + ' *******************');
                                res.json({status: 'fail'});
                                return false;
                            });
                    })
                })
                .error(function (err) {
                    console.log("******************* ERROR:" + err + ' *******************');
                    res.json({status: 'fail'});
                    return false;
                });
        })
    }
};
var LoadSYS = function (req, res, info) {
    var PATIENT_ID = info.PATIENT_ID;
    headersMRSSYS.findAll({}, {raw: true})
        .success(function (dataH) {
            //check exist headers in sys table
            if (dataH == null || dataH.length == 0) {
                console.log("******************* Not found headers in headers table *******************");
                res.json({status: 'fail'});
                return false;
            }
            groupsMRSSYS.findAll({}, {raw: true})
                .success(function (dataG) {
                    //check exist groups in groups table
                    if (dataG == null || dataG.length == 0) {
                        console.log("******************* Not found groups in groups table *******************");
                        res.json({status: 'fail'});
                        return false;
                    }
                    linesMRSSYS.findAll({}, {raw: true})
                        .success(function (dataL) {
                            //check exist lines in lines table
                            if (dataL == null || dataL.length == 0) {
                                console.log("******************* Not found lines in lines table *******************");
                                res.json({status: 'fail'});
                                return false;
                            }
                            Patient.find({where: {Patient_id: PATIENT_ID}}, {raw: true})
                                .success(function (patient) {
                                    //check exist patient
                                    if (patient == null || patient.length == 0) {
                                        console.log("******************* Not found user in patient table *******************");
                                        res.json({status: 'fail'});
                                        return false;
                                    }
                                    var response = [{
                                        "headers": dataH,
                                        "groups": dataG,
                                        "lines": dataL,
                                        "patient": patient,
                                        "status": "findNull"

                                    }];
                                    res.json(response);
                                    return true;
                                })
                                .error(function (err) {
                                    console.log("******************* ERROR:" + err + '*******************');
                                    return false;
                                });
                        }).error(function (err) {
                            console.log("******************* ERROR:" + err + ' *******************');
                            return false;
                        });
                }).error(function (err) {
                    console.log("******************* ERROR:" + err + ' *******************');
                    return false;
                });
        }).error(function (err) {
            console.log("******************* ERROR:" + err + ' *******************');
            return false;
        });
};
