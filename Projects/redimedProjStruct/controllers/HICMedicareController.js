/**
 * Created by Luan Nguyen on 12/12/2014.
 */
var db = require('../models');

var fs = require('fs');
var mkdirp = require('mkdirp');
var java = require('java');

java.options.push("-Djava.awt.headless=true");
java.classpath.push('commons-lang3-3.1.jar');
java.classpath.push('commons-io.jar');
java.classpath.push('./lib/iText-2.1.7.js2.jar');
java.classpath.push('./lib/jasperreports-5.6.0.jar');
java.classpath.push('./lib/mysql-connector-java-5.1.13-bin.jar');
java.classpath.push('./lib/org-apache-commons-codec.jar');
java.classpath.push('./lib/Medicare.jar');

module.exports = {
    verify:function(req,res)
    {
        var info = req.body.info;

        var rs = java.callStaticMethodSync('com.claim.BulkBillClaim', 'medicarePatientVerify', JSON.stringify(info));

        res.json(rs);
    }
}