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
java.classpath.push('./lib/sun.misc.BASE64Decoder.jar');
java.classpath.push('./lib/Audio.jar');

var BasicStroke = java.import('java.awt.BasicStroke');
var Color = java.import('java.awt.Color');
var Font = java.import('java.awt.Font');
var Graphics2D = java.import('java.awt.Graphics2D');
var BufferedImage = java.import('java.awt.image.BufferedImage');
var Stroke = java.import('java.awt.Stroke');
var Line2D = java.import('java.awt.geom.Line2D');

var ByteArrayInputStream = java.import('java.io.ByteArrayInputStream');
var ByteArrayOutputStream = java.import('java.io.ByteArrayOutputStream');
var InputStream = java.import('java.io.InputStream');
var FileInputStream = java.import('java.io.FileInputStream');
var FileOutputSteam = java.import('java.io.FileOutputStream');
var File = java.import('java.io.File');

var ImageIO = java.import('javax.imageio.ImageIO');

var BASE64Decoder = java.import('sun.misc.BASE64Decoder');
var BASE64Encoder = java.import('sun.misc.BASE64Encoder');

var HashMap = java.import('java.util.HashMap');
var JRException = java.import('net.sf.jasperreports.engine.JRException');
var JasperExportManager = java.import('net.sf.jasperreports.engine.JasperExportManager');
var JasperFillManager = java.import('net.sf.jasperreports.engine.JasperFillManager');
var JasperPrint = java.import('net.sf.jasperreports.engine.JasperPrint');
var DriverManager = java.import('java.sql.DriverManager');
var Driver = java.import('com.mysql.jdbc.Driver');

//var AudioBean = java.import('audio.AudioBean');

module.exports = {
    printReport : function(req,res,next){
        var arr = [];
        var calId = req.params.calId;
        var id = req.params.id;
        var patientId = req.params.patientId;

        db.sequelize.query("SELECT * FROM cln_sa_df_lines WHERE patient_id = 181 AND CAL_ID=17060 AND SA_ID=3",null,{raw:true})
            .success(function(data){
                arr = data;

                var str = java.callStaticMethodSync('audio.AudioBean','getImageChart','./reports/SACln/images/Government.png',arr,true);
                var a = java.callStaticMethodSync('audio.AudioBean','decodeToImage',str.substring(22));

                mkdirp('.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId, function (err) {
                    if (err) console.error(err)
                    else
                    {
                        var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

                        var a = decodeToImage(getImageChart().substring(22));

                        var paramMap = new HashMap();

                        paramMap.putSync("cal_id",parseInt(calId));
                        paramMap.putSync("patient_id",parseInt(patientId));
                        paramMap.putSync("sa_id",parseInt(id));
                        paramMap.putSync("real_path","./reports/SACln/");
                        paramMap.putSync("result_image",a);

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
            })
            .error(function(err){
                console.log(err);
            })





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
};

function getMap(){
    var dict = [];
    dict['500'] = {x:157,y:216};
    dict['1000'] = {x:246,y:216};
    dict['1500'] = {x:339,y:216};
    dict['2000'] = {x:435,y:216};
    dict['3000'] = {x:529,y:216};
    dict['4000'] = {x:622,y:216};
    dict['6000'] = {x:712,y:216};
    dict['8000'] = {x:806,y:216};
    return dict;
};

function getMapGov(){
    var dict = {};
    dict['500'] = {x:250,y:112};
    dict['1000'] = {x:376,y:112};
    dict['1500'] = {x:439,y:112};
    dict['2000'] = {x:502,y:112};
    dict['3000'] = {x:568,y:112};
    dict['4000'] = {x:628,y:112};
    dict['6000'] = {x:694,y:112};
    dict['8000'] = {x:756,y:112};
    return dict;
};


function getImageChart(){
    var b = base64Image("./reports/SACln/images/Government.png");
    var asStream = new Buffer(b,'base64').toString('binary');

    var img = null;
    var yValue = 2.1;

    try
    {
        img = java.callStaticMethodSync('javax.imageio.ImageIO','read',asStream);
        var g = img.createGraphics();

        db.sequelize.query("SELECT * FROM cln_sa_df_lines WHERE patient_id = ? AND CAL_ID = ? AND SA_ID = ?",null,{raw:true},[180,17060,3])
            .success(function(data){
                for (var i = 0, y = 1; i < data.length - 1; i++, y++)
                {
                    var rowY = data[y];
                    var rowX = data[i];

                    drawPoint(g,rowX.Name.toString(),rowX.VALUE_LEFT,true,true);
                    drawPoint(g,rowX.Name.toString(),rowX.VALUE_RIGHT,false,true);

                    if(y == data.length - 1)
                    {
                        drawPoint(g,rowY.Name.toString(),rowY.VALUE_LEFT,true,true);
                        drawPoint(g,rowY.Name.toString(),rowY.VALUE_RIGHT,false,true);
                    }

                    drawLine(g,rowX.Name.toString(),rowY.Name.toString(),rowX.VALUE_LEFT,rowY.VALUE_LEFT,true,true);
                    drawLine(g,rowX.Name.toString(),rowY.Name.toString(),rowX.VALUE_RIGHT,rowY.VALUE_RIGHT,false,true);
                }

                var imgStr;
                imgStr = "data:image/png;base64," + encodeToString(img, "png");
                return imgStr;
            })
            .error(function(err){
                console.log(err);
            })

    }
    catch(ex)
    {
        console.log(ex);
    }
    return "";
}

function drawLine(g,name1,name2,value1,value2,isBlue,isGovernment){
    var map = getMap();
    var mapGov = getMapGov();

    var coordinate1 = isGovernment ? mapGov[name1] : map[name1];
    var coordinate2 = isGovernment ? mapGov[name2] : map[name2];

    g.setStroke(new BasicStroke(java.newFloat(1.8)));
    g.setColor(isBlue ? Color.blue : Color.red);
    var yRate = isGovernment ? 4.6 : 4.1;
    if(coordinate1 != null && value1 != null && value2 != null && coordinate2 != null)
    {
        var x1= 0,
            y1= 0,
            x2= 0,
            y2= 0;

        x1 = coordinate1.x;
        y1 = parseInt(parseDouble(coordinate1.y + (yRate * value1)));
        x2 = coordinate2.x;
        y2 = parseInt(parseDouble(coordinate1.y + (yRate * value2)));

        g.draw(new Line2D.Double(x1,y1,x2,y2));
    }
};

function drawPoint(g,name,value,isBlue,isGovernment){
    var map = getMap();
    var mapGov = getMapGov();

    g.setFont(new Font(Font.SANS_SERIF, Font.BOLD, 20));
    g.setColor(isBlue ? Color.blue : Color.red);

    var coordinate = isGovernment ? mapGov[name] : map[name];
    var yRate = isGovernment ? 4.6 : 4.1;
    if(coordinate != null && value != null)
    {
        var x= 0,
            y=0;

        x = coordinate.x - 8;
        y = parseInt(parseDouble(coordinate.y + (yRate * value))) + 5;
        g.drawString(isBlue ? "X":"O",x,y);
    }
};

function encodeToString(image,type){
    var imgStr = null;
    var bos = new ByteArrayOutputStream();

    try
    {
        java.callStaticMethodSync('javax.imageio.ImageIO','write',image,type,bos);
        var imageBytes = bos.toByteArray();

        var encoder = new BASE64Encoder();
        imgStr = encoder.encode(imageBytes);
        bos.close();
    }
    catch(ex)
    {
        console.log(ex);
    }

    return imgStr;
};

function decodeToImage(imageString){
    var img = null;
    var imageByte;
    try
    {
        var decoder = new BASE64Decoder();
        imageByte = decoder.decodeBuffer(imageString);
        var bis = new ByteArrayInputStream(imageByte);
        img  = java.callStaticMethodSync('javax.imageio.ImageIO','read',bis);

        bos.close();
    }
    catch(ex)
    {
        console.log(ex);
    }

    return img;

};

function parseDouble(value){
    if(typeof value == "string") {
        value = value.match(/^-?\d*/)[0];
    }

    return !isNaN(parseInt(value)) ? value * 1 : NaN;
};
