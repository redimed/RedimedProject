/**
 * Created by phuongnm on 27/09/2014.
 * use to make model file automatically by enter table name and path of destination
 */
var db = require('../models');
var fs = require('fs');
var _s = require('underscore.string');
var readline = require('readline');


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please enter the table name in Sakila schema ? ", function(answer) {
    var becomeModel = _s.classify(answer);//change name from table name to Javascript name
    console.log("The table :", answer);
    console.log(" is made to :", becomeModel);


    fs.exists('../models/'+becomeModel+'.js', function(exists) {
        if (exists) {
            console.log('../models/'+becomeModel+'.js  change to ../models/'+becomeModel+"_"+getDateTime()+'.js');
            fs.rename('../models/'+becomeModel+'.js','../models/'+becomeModel+"_"+getDateTime()+'.js');

            main(answer,becomeModel);
        }else
        {
            main(answer,becomeModel);
        }
    });


    rl.close();
});

function main(tableName,becomeModel) {
    var fs = require('fs');
    var insertUpdateStatement = "";
    var insertUpdateStatement2 = "";
    var primaryKeyColumnName = "";
    var wstream = fs.createWriteStream('../models/'+becomeModel+'.js'); // create the model file
    wstream.write(
            "/** \n" +
            "* Created by meditech on 19/09/2014.\n" +
            "*/\n" +
            "module.exports = function(sequelize,DataTypes){\n" +
            "   var "+becomeModel+" = sequelize.define('"+becomeModel+"',{\n"
    );

    db.sequelize
        // sync để tự động tạo các bảng trong database
        //.sync({ force: true })
        .authenticate()
        .complete(function (err) {
            if (err) {
                throw err[0];
            } else {

            }
        }
    );


    //find all columns of the table and write to file
    db.SYSCOLUMNS.findAll({where: {TABLE_NAME: tableName.toUpperCase()}}, {raw: true}).success(function (data) {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY );

            var isComma = '';

            if (i != 0) {
                isComma = ',';
            }
            if (data[i].DATA_TYPE === 'int') {
                wstream.write("       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.INTEGER(11) \n');
            } else if (data[i].DATA_TYPE === 'varchar') {
                wstream.write("       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + ') \n');
            } else if (data[i].DATA_TYPE === 'datetime') {
                wstream.write("       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.DATE \n');
            }

            if(data[i].COLUMN_KEY === 'PRI'){
                primaryKeyColumnName = data[i].COLUMN_NAME;
            }

            insertUpdateStatement += "          " + isComma + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";
            insertUpdateStatement2 +=  isComma + "'"+ data[i].COLUMN_NAME + "'";
        }

        wstream.write(
                "   " + "},{ \n" +
                "       " + "tableName: '"+tableName+"'\n" +
                "   " + "}); \n" +
                "   " + "return "+becomeModel+";\n" +
                "};"
        );

        wstream.end();

        ///Creating Controller file for Model
        var wstreamController = fs.createWriteStream('../controllers/'+becomeModel+'Controller.js'); // create the model file
        wstreamController.write(
        "/**\n" +
        "        * Created by meditech on 19/09/2014.\n" +
        "*/\n" +
        "var db = require('../models');\n" +
        "module.exports = {\n" +
        "    list: function(req,res){\n" +
        "        var rs = [];\n" +
        "        db."+becomeModel+".findAll({},{raw: true})\n" +
        "            .success(function(data){\n" +
        "                res.json(data);\n" +
        "            })\n" +
        "            .error(function(err){\n" +
        "                res.json({status:'fail'});\n" +
        "            })\n" +
        "    },\n\n"
        );


        if(primaryKeyColumnName.length > 1){
            wstreamController.write(
                    "    update: function(req,res){\n" +
                    "    var f = req.body.f;\n" +
                    "    db."+becomeModel+".update({\n" +
                    insertUpdateStatement +
                    "   },{"+primaryKeyColumnName+": f."+primaryKeyColumnName+"})\n" +
                    "       .success(function(){\n" +
                    "           res.json({status:'success'});\n" +
                    "       })\n" +
                    "            .error(function(err){\n" +
                    "                res.json({status:'fail'});\n" +
                    "           });\n" +
                    "   },\n\n"
            );
        }

        wstreamController.write(
        "    insert: function(req,res){\n" +
        "    var f = req.body.f;\n" +
        "    db."+becomeModel+".create({\n" +
        insertUpdateStatement +
        "    },["+insertUpdateStatement2+"]).success(function(){\n" +
        "        res.json({status:'success'});\n" +
        "    })\n" +
        "        .error(function(err){\n" +
        "            res.json({status:'fail'});\n" +
        "        });\n" +
        "}"
        );

        wstreamController.write("}");
        wstreamController.end();

    })

}



function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "" + month + "" + day + "" + hour + "" + min + "" + sec;

}