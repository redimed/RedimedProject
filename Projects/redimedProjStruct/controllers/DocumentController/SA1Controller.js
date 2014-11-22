/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
var fs = require('fs');

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


//var ImageIO = java.import('javax.imageio.ImageIO');
var BufferedImage = java.import('java.awt.image.BufferedImage');
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
    printReport : function(req,res,next){
        var calId = req.params.calId;
        var id = req.params.id;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId, function (err) {
            if (err) console.error(err)
            else
            {
                var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

                var paramMap = new HashMap();

                paramMap.putSync("cal_id",parseInt(calId));
                paramMap.putSync("patient_id",parseInt(patientId));
                paramMap.putSync("sa_id",parseInt(id));
                paramMap.putSync("real_path","./reports/SACln/");
                paramMap.putSync("result_image",base64Image("./reports/SACln/images/Redimed.png"));

                var filePath = '.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId+'\\Audiogram_1.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/SACln/Government.jasper',paramMap,con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,filePath,function(err,rs){
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else
                    {

                        res.download(filePath,'Audiogram_1.pdf',function(err){
                            if(err)
                            {
                                console.log(err);
                                return;
                            }
                        });
                    }

                });
            }
        });
    },
    loadSA1: function (req, res) {
        var info = req.body.info; //get id find
        db.headersSACLN.findAll({where: {patient_id: info.patient_id, CAL_ID: info.CAL_ID, SA_ID: 3}}, {raw: true})
            .success(function (dataH) {
                db.sectionsSACLN.findAll({where: {patient_id: info.patient_id, CAL_ID: info.CAL_ID, SA_ID: 3}}, {raw: true})
                    .success(function (dataS) {
                        db.linesSACLN.findAll({where: {patient_id: info.patient_id, CAL_ID: info.CAL_ID, SA_ID: 3}}, {raw: true})
                            .success(function (dataL) {
                                db.Patient.findAll({where: {patient_id: info.patient_id}}, {raw: true})
                                    .success(function (patient) {
                                        if (0 === dataH.length || 0 === dataS.length || 0 === dataL.length) {
                                            //find null
                                            //get information in sys table
                                            db.headersSASYS.findAll({where: {SA_ID: 3}}, {raw: true})
                                                .success(function (dataH) {
                                                    db.sectionsSASYS.findAll({where: {SA_ID: 3}}, {raw: true})
                                                        .success(function (dataS) {
                                                            db.linesSASYS.findAll({where: {SA_ID: 3}}, {raw: true})
                                                                .success(function (dataL) {
                                                                    var response = [
                                                                        {'headers': dataH, 'sections': dataS, 'lines': dataL, 'status': 'findNull', "patient": patient}
                                                                    ];
                                                                    res.json(response);
                                                                })
                                                                .error(function (err) {
                                                                    console.log("ERROR:" + err);
                                                                    res.json({status: 'fail'});
                                                                });
                                                        })
                                                        .error(function (err) {
                                                            console.log("ERROR:" + err);
                                                            res.json({status: 'fail'});
                                                        });
                                                })
                                                .error(function (err) {
                                                    console.log("ERROR:" + err);
                                                    res.json({status: 'fail'});
                                                });
                                        }
                                        else {
                                            //find found
                                            var response = [
                                                {'headers': dataH, 'sections': dataS, 'lines': dataL, 'status': 'findFound', "patient": patient}
                                            ];
                                            res.json(response);
                                        }
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'fail'});
                                    });
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            })
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                        res.json({status: 'fail'});
                    });
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: 'fail'});
            });
    },
    insertSA1: function (req, res) {
        var info = req.body.info;
        var Signature = info.Signature;
        var test_date = info.test_date;
        info.headers.forEach(function (infoH, hIndex) {
            db.headersSACLN.create({
                patient_id: infoH.patient_id,
                CAL_ID: infoH.CAL_ID,
                SA_ID: infoH.SA_ID,
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                test_date: test_date,
                tester: infoH.tester,
                report_type: infoH.report_type,
                RECIPIENT_NAME: infoH.RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                Signature: Signature,
                LOCATION_ID: infoH.LOCATION_ID
            }, {raw: true})
                .success(function () {
                    info.headers[hIndex].sections.forEach(function (infoS, sIndex) {
                        db.sectionsSACLN.create({
                            patient_id: infoS.patient_id,
                            CAL_ID: infoS.CAL_ID,
                            SECTION_ID: infoS.SECTION_ID,
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            Created_by: infoS.CREATED_BY,
                            Last_updated_by: infoS.LAST_UPDATED_BY
                        }, {raw: true})
                            .success(function () {
                                info.headers[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    db.linesSACLN.create({
                                        patient_id: infoL.patient_id,
                                        CAL_ID: infoL.CAL_ID,
                                        LINE_ID: infoL.LINE_ID,
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        Name: infoL.Name,
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
    editSA1: function (req, res) {
        var info = req.body.info;
        var Signature = info.Signature;
        var test_date = info.test_date;
        info.headers.forEach(function (infoH, hIndex) {
            db.headersSACLN.update({
                SA_NAME: infoH.SA_NAME,
                ISENABLE: infoH.ISENABLE,
                SA_CODE: infoH.SA_CODE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                test_date: test_date,
                tester: infoH.tester,
                report_type: infoH.report_type,
                RECIPIENT_NAME: infoH.RECIPIENT_NAME,
                DOCTOR_ID: infoH.DOCTOR_ID,
                Signature: Signature,
                LOCATION_ID: infoH.LOCATION_ID
            }, {patient_id: infoH.patient_id, CAL_ID: infoH.CAL_ID, SA_ID: infoH.SA_ID})
                .success(function () {
                    info.headers[hIndex].sections.forEach(function (infoS, sIndex) {
                        db.sectionsSACLN.update({
                            SA_ID: infoS.SA_ID,
                            SECTION_NAME: infoS.SECTION_NAME,
                            ORD: infoS.ORD,
                            USER_TYPE: infoS.USER_TYPE,
                            ISENABLE: infoS.ISENABLE,
                            Created_by: infoS.Created_by,
                            Last_updated_by: infoS.Last_updated_by
                        }, { patient_id: infoS.patient_id, CAL_ID: infoS.CAL_ID, SECTION_ID: infoS.SECTION_ID})
                            .success(function () {
                                info.headers[hIndex].sections[sIndex].lines.forEach(function (infoL, lIndex) {
                                    db.linesSACLN.update({
                                        SECTION_ID: infoL.SECTION_ID,
                                        SA_ID: infoL.SA_ID,
                                        Name: infoL.Name,
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
    }
};

function base64Image(src) {
    var data = fs.readFileSync(src).toString("base64");
    return data;
}
