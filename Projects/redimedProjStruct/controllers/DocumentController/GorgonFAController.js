/**
 * Created by meditech on 13/10/2014.
 */
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
    printReport : function(req,res){

        mkdirp('./download/report/GorgonFA', function (err) {
            if (err) console.error(err)
            else console.log('success!')
        });

        var id = req.params.id;

        var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

        var paramMap = new HashMap();

        paramMap.putSync("id",parseInt(id));
        paramMap.putSync("realPath","./reports/Gorgon/");


        var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/Gorgon/GorgonFCAReport.jasper',paramMap,con);

        java.callStaticMethodSync('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,'./download/report/GorgonFA/gorgonFCA.pdf');


        res.download('./download/report/GorgonFA/gorgonFCA.pdf');

    }
}