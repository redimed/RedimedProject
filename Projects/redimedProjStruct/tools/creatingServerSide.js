/**
 * Created by phuongnm on 27/09/2014.
 * use to make model file automatically by enter table name and path of destination

 create table SYS_FORMS(
 FORM_ID int primary key,
 MASTER_TABLE_NAME VARCHAR(100),
 MASTER_SEQ VARCHAR(100),
 DETAIL_TABLE_NAME VARCHAR(100),
 DETAIL_SEQ VARCHAR(100),
 FORM_DESCRIPTION VARCHAR(250),
 FORM_TYPE VARCHAR(20)
 );

 CREATE TABLE SYS_FORM_DETAILS(
 FORM_ID INT,
 FORM_DETAIL_ID INT PRIMARY KEY,
 ORDINAL_POSITION INT,
 COLUMN_NAME VARCHAR(100),
 IS_NULLABLE VARCHAR(3),
 DATA_TYPE VARCHAR(64),
 CHARACTER_MAXIMUM_LENGTH bigINT,
 COLUMN_KEY VARCHAR(3),
 DISPLAY_NAME VARCHAR(250),
 ISDISPLAY INT,
 ISNEW INT,
 ISUPDATE INT,
 ISREQUIRE INT,
 INPUT_TYPE VARCHAR(100),
 LOV_SQL VARCHAR(2000)
 );

 */
var db = require('../models');
var fs = require('fs');
var _s = require('underscore.string');
var readline = require('readline');

//var input = fs.createReadStream('sakila_redi_functions.sql');
//readLines(input, func);


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
            fs.rename('../controllers/'+becomeModel+'Controller.js','../controllers/'+becomeModel+"Controller_"+getDateTime()+'.js');
            main(answer,becomeModel);
        }else
        {
            main(answer,becomeModel);
        }
    });


    rl.close();
});

///// main function to make the file ///////
function main(tableName,becomeModel) {
    var fs = require('fs');
    var insertUpdateStatement = "";
    var insertUpdateStatement2 = "";
    var primaryKeyColumnName = "";
    var modelBody = "";
    var creationDate = "";
    var lastUpdateDate = "";

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

    db.SysForms.getPK(function(id){

        console.log('sys_form_id = ' + id);

        //find all columns of the table and write to file
        db.SYSCOLUMNS.findAll({where: {TABLE_NAME: tableName.toUpperCase()}}, {raw: true}).success(function (data) {
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY );

                var isComma = '';

                if (i != 0) {
                    isComma = ',';
                }

                if(data[i].COLUMN_KEY === 'PRI'){
                    primaryKeyColumnName = data[i].COLUMN_NAME;
                    if (data[i].DATA_TYPE === 'int') {
                        modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.INTEGER(11), primaryKey:true} \n';
                    } else if (data[i].DATA_TYPE === 'varchar') {
                        modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + '), primaryKey:true} \n';
                    } else if (data[i].DATA_TYPE === 'datetime') {
                        modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.DATE, primaryKey:true} \n';
                    }
                }else
                {
                    if (data[i].DATA_TYPE === 'int') {
                        modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.INTEGER(11) \n';
                    } else if (data[i].DATA_TYPE === 'varchar') {
                        modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + ') \n';
                    } else if (data[i].DATA_TYPE === 'datetime') {
                        modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.DATE \n';
                    }
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('CREATION_DATE')){
                    creationDate = "        createdAt : 'CREATION_DATE',\n";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('LAST_UPDATE_DATE')){
                    lastUpdateDate = "      updatedAt : 'LAST_UPDATE_DATE',\n";
                }

                insertUpdateStatement += "          " + isComma + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";
                insertUpdateStatement2 +=  isComma + "'"+ data[i].COLUMN_NAME + "'";
            }

            //creating model for table in mySql
            var wstreamModel = fs.createWriteStream('../models/'+becomeModel+'.js'); // create the model file
            wstreamModel.write(
                    "/** \n" +
                    "* Created by meditech on " + getAusFormatDateTime() + ".\n" +
                    "*/\n" +
                    "module.exports = function(sequelize,DataTypes){\n" +
                    "   var "+becomeModel+" = sequelize.define('"+becomeModel+"',{\n" +

                    modelBody +

                    "   " + "},{ \n" +
                    "       " + "tableName: '"+tableName+"',\n" +
                    "       " + "timestamps: false,\n" +
                    creationDate +
                    lastUpdateDate +
                    "       " + "classMethods:{\n" +
                    "       " + "    getPK:function(callback){\n" +
                    "       " + "        sequelize.query(\"SELECT get_pk_value('"+tableName+"') AS PK\").success(function(data){\n" +
                    "       " + "            callback(data[0].PK);\n" +
                    "       " + "        })\n" +
                    "       " + "    }\n" +
                    "       " + "}\n" +
                    "   " + "}); \n" +
                    "   " + "return "+becomeModel+";\n" +
                    "};"
            );

            wstreamModel.end();

            ///Creating Controller file for Model
            var wstreamController = fs.createWriteStream('../controllers/'+becomeModel+'Controller.js'); // create the model file
            wstreamController.write(
                    "/**\n" +
                    "        * Created by meditech on " + getAusFormatDateTime() + ".\n" +
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
                    "    },\n\n" +
                    "    findById: function(req,res){\n" +
                    "        var id = req.body.id;\n" +
                    "        var rs = [];\n" +
                    "        db."+becomeModel+".findAll({where:{"+primaryKeyColumnName+":id}},{raw: true})\n" +
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
                        "    edit: function(req,res){\n" +
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

        })//db.SYSCOLUMNS.findAll

    });///db.SysForms.getPK(function(id)


}///function main(tableName,becomeModel)


/// function to get Datetime
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

/// function to get Datetime
function getAusFormatDateTime() {

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

    return year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;

}
//// Read line by line

function readLines(input, func) {


    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
    });
}

function func(data) {
    console.log('Line: ' + data);
    if(data.contain('UNLOCK TABLES')){

    }
}

