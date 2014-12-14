var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

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
        var id = req.params.id;

        mkdirp('.\\download\\report\\WA\\FirstAssessment_' +id , function (err) {
            if (err) console.error("******************* ERROR:" + err + '*******************');
            else {
                var con = java.callStaticMethodSync('java.sql.DriverManager', 'getConnection', "jdbc:mysql://localhost:3306/sakila", "root", "root");

                var paramMap = new HashMap();

                paramMap.putSync("id", parseInt(id));
                paramMap.putSync("real_path", "./reports/FirstWA/");

                var filePath = '.\\download\\report\\WA\\FirstAssessment_' +id + '\\FirstWA.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager', 'fillReport', './reports/FirstWA/FirstWA.jasper', paramMap, con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager', 'exportReportToPdfFile', jPrint, filePath, function (err, rs) {
                    if (err) {
                        console.log("******************* ERROR:" + err + ' *******************');
                        return;
                    }
                    else {

                        res.download(filePath, 'FirstWA.pdf', function (err) {
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
    postAdd: function (req, res) {
        var postData = req.body.add_data;

        db.WaWorkCoverFirst.create(postData)
            .success(function (created) {
                if (!created) res.json(500, {
                    'status': 'error',
                    'message': 'Cannot Insert'
                });
                res.json({
                    'status': 'success',
                    'data': created
                });
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },

    postEdit: function (req, res) {
        var postData = req.body.edit_data;
        var edit_id = req.body.edit_id;

        db.WaWorkCoverFirst.find(edit_id)
            .success(function (detail) {
                if (!detail) res.json(500, {
                    'status': 'error',
                    'message': 'Id Missing !!!'
                });
                detail.updateAttributes(postData).success(function (updated) {
                    res.json({
                        'status': 'success',
                        'data': updated
                    });
                })
                    .error(function (error) {
                        res.json(500, {
                            'status': 'error',
                            'message': error
                        });
                    })
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },

    postSearch: function (req, res) {
        var pagination = req.body.pagination;
        var post_fields = req.body.filters;
        var select = req.body.select;
        var sql = mdt_functions.commonSearch(post_fields);
        console.log('this is the sql', sql);
        db.WaWorkCoverFirst.findAndCountAll({
            where: [sql]
            //            offset: pagination.offset,
            //            limit: pagination.limit,
            //            attributes: select,
            //            order: 'Creation_date DESC'
        })
            .success(function (result) {
                if (!result) res.json(500, {
                    'status': 'error',
                    'message': 'Cannot Get Search'
                });
                res.json({
                    'status': 'success',
                    'data': result.rows,
                    'count': result.count
                });
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },
}