var db = require('../../models');
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
        var coeId = req.params.coeId;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId, function (err) {
            if (err) console.error(err)
            else
            {
                var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

                var paramMap = new HashMap();


                paramMap.putSync("key",parseInt(coeId));
                paramMap.putSync("real_path","./reports/COE/");

                var filePath = '.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId+'\\COE.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/COE/COE.jasper',paramMap,con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,filePath,function(err,rs){
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else
                    {

                        res.download(filePath,'COE.pdf',function(err){
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

    insertCOE : function(req,res){
        var info = req.body.info;
        db.COE.max('coe_id')
            .success(function(max){
                var id = max + 1;
                db.COE.create({
                    coe_id: id,
                    DocId: info.DocId,
                    DOCTOR_ID: info.DOCTOR_ID,
                    CalId: info.CalId,
                    PatientId: info.PatientId,
                    isEmployed: info.isEmployed,
                    dateEmployed: info.dateEmployed,
                    inPosition: info.inPosition,
                    Signature1: info.Signature1,
                    coeName: info.coeName,
                    coeTitle: info.coeTitle,
                    coeDate: info.coeDate,
                    Signature2: info.Signature2
                },{raw:true})
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            }).error(function(err){
                console.log(err);
            })

    },
    updateCOE: function(req,res){
        var info = req.body.info;
        db.COE.update({
            coe_id: info.coe_id,
            DocId: info.DocId,
            DOCTOR_ID: info.DOCTOR_ID,
            isEmployed: info.isEmployed,
            dateEmployed: info.dateEmployed,
            inPosition: info.inPosition,
            Signature1: info.Signature1,
            coeName: info.coeName,
            coeTitle: info.coeTitle,
            coeDate: info.coeDate,
            Signature2: info.Signature2
        },{PatientId:info.PatientId,CalId : info.CalId})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error',err:err});
                console.log(err);
            })
    },
    checkCOE: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.COE.find({where:{PatientId:Patient_Id,CalId : CalId}})
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    console.log(data);
                    res.json(data);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};