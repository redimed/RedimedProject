/**
 * Created by phuongnm on 27/09/2014.
 * use to make model file automatically by enter table name and path of destination

 use sakila;

 create table pm_departments
 (
 dept_id int primary key,
 dept_name varchar(100),
 isEnable int,
 isAllowToCancel int,
 isAllowToInsurance int,
 email_title varchar(100),
 email_content varchar(1000)
 );

 create table pm_dept_users(
 dept_id int,
 user_id int
 );

 create table pm_process(
 process_id int primary key,
 dept_id int,
 seq int,
 process_name varchar(100),
 remind_after int,
 isDailyRemins int,
 remind_title varchar(100),
 remind_content varchar(1000),
 isDoc int,
 isPicture int
 );

 create table pm_process_prev
 (
 process_id int,
 prev_process_id int,
 groupNo int
 );

 create table pm_process_next
 (
 process_id int,
 prev_process_id int,
 groupNo int
 );

 create table pm_costs(
 cost_id int primary key,
 cost_name varchar(100),
 isEnable int
 );

 drop table pm_properties;

 create table pm_properties(
 property_id int primary key,
 Address varchar(100),
 Suburb varchar(30),
 Zipcode varchar(10),
 State varchar(30),
 Country varchar(30),
 Price float,
 purchase_date date,
 note varchar(1000),
 Cancellation_reason varchar(1000),
 isCancellation int,
 isInsurance int,
 Avatar_Pic_path varchar(200),
 Created_by	int(11),
 Creation_date	datetime,
 Last_updated_by	int(11),
 Last_update_date datetime
 );

 desc users;

 create table pm_property_process(
 process_id int,
 property_id int,
 isCurrent int,
 From_time datetime,
 To_time datetime,
 Note varchar(1000)
 );

 create table pm_property_costs(
 process_id int,
 property_id int,
 cost_id int,
 cost float,
 Cost_date date,
 Note varchar(1000)
 );

 create table pm_property_documents(
 doc_id int primary key,
 doc_name varchar(100),
 doc_path varchar(500),
 process_id int,
 property_id int,
 cost_id int
 );

 create table pm_room_types(
 room_type_id int primary key,
 room_type_name varchar(100),
 isEnable int
 );

 create table pm_property_pictures(
 pic_id int primary key,
 pic_name varchar(100),
 room_type_id int,
 before_picture_path varchar(500),
 after_picture_path varchar(500),
 note varchar(500),
 process_id int,
 property_id int
 );

 select * from redi_functions;
 select * from redi_menus;

 select * from INFORMATION_SCHEMA.COLUMNS where table_name = 'USERS';

 select * from pm_properties;

 drop table sys_forms;

 create table SYS_FORMS(
 FORM_ID int primary key,
 MASTER_TABLE_NAME VARCHAR(100),
 MASTER_SEQ VARCHAR(100),
 DETAIL_TABLE_NAME VARCHAR(100),
 DETAIL_SEQ VARCHAR(100),
 FORM_DESCRIPTION VARCHAR(250),
 FORM_TYPE VARCHAR(20),
 LIST_FORM_TYPE VARCHAR(20),
 NEW_EDIT_FORM_TYPE VARCHAR(20)
 );

 drop table sys_form_details;

 CREATE TABLE SYS_FORM_DETAILS(
 FORM_ID INT,
 TABLE_NAME VARCHAR(100),
 FORM_DETAIL_ID INT PRIMARY KEY,
 ORDINAL_POSITION bigINT,
 COLUMN_NAME VARCHAR(100),
 IS_NULLABLE VARCHAR(3),
 DATA_TYPE VARCHAR(64),
 CHARACTER_MAXIMUM_LENGTH bigINT,
 COLUMN_KEY VARCHAR(3),
 DISPLAY_NAME VARCHAR(250),
 ISDISPLAY_ON_LIST INT,
 ISDISPLAY_ON_FORM INT,
 ISNEW INT,
 ISUPDATE INT,
 ISREQUIRE INT,
 ISLIST_LINK INT,
 INPUT_TYPE VARCHAR(100),
 LOV_SQL VARCHAR(2000)
 );


 module.exports = function(sequelize,DataTypes){
   var SysForms = sequelize.define('SysForms',{
       FORM_ID : {type:DataTypes.INTEGER(11), primaryKey:true}
       ,MASTER_TABLE_NAME : DataTypes.STRING(100)
       ,MASTER_SEQ : DataTypes.STRING(100)
       ,DETAIL_TABLE_NAME : DataTypes.STRING(100)
       ,DETAIL_SEQ : DataTypes.STRING(100)
       ,FORM_DESCRIPTION : DataTypes.STRING(250)
       ,FORM_TYPE : DataTypes.STRING(20)
       ,LIST_FORM_TYPE : DataTypes.STRING(20)
       ,NEW_EDIT_FORM_TYPE : DataTypes.STRING(20)
       ,FORM_PROPERTIES : DataTypes.STRING(2000)
   },{
       tableName: 'sys_forms',
       timestamps: true,
       createdAt : false,
       updatedAt: false,
       classMethods:{
           getPK:function(callback){
               sequelize.query("SELECT get_pk_value('sys_forms') AS PK").success(function(data){
                   callback(data[0].PK);
               })
           },
           getColumns:function(tableName,callback){
               sequelize.query("select f.MASTER_TABLE_NAME,f.MASTER_SEQ,f.DETAIL_TABLE_NAME,f.DETAIL_SEQ,f.FORM_DESCRIPTION,f.FORM_TYPE,f.LIST_FORM_TYPE,f.NEW_EDIT_FORM_TYPE,f.FORM_PROPERTIES, d.* from sys_form_details d, sys_forms f where d.form_id = f.form_id and f.MASTER_TABLE_NAME = d.Table_name and d.form_id = (select max(form_id) from sys_forms where upper(master_table_name) = '"+tableName+"') order by ordinal_position").success(function(data){
                   callback(data);
               })
           },
           getDetailColumns:function(tableName,callback){
               sequelize.query("select f.MASTER_TABLE_NAME,f.MASTER_SEQ,f.DETAIL_TABLE_NAME,f.DETAIL_SEQ,f.FORM_DESCRIPTION,f.FORM_TYPE,f.LIST_FORM_TYPE,f.NEW_EDIT_FORM_TYPE,f.FORM_PROPERTIES, d.* from sys_form_details d, sys_forms f where d.form_id = f.form_id and f.DETAIL_TABLE_NAME = d.Table_name and d.form_id = (select max(form_id) from sys_forms where upper(master_table_name) = '"+tableName+"') order by ordinal_position").success(function(data){
                   callback(data);
               })
           }
       }
   });
    return SysForms;
};



 */

    
var db = require('../models');
var fs = require('fs');
var _s = require('underscore.string');
var readline = require('readline');
var colors = require('colors');


//var input = fs.createReadStream('sakila_redi_functions.sql');
//readLines(input, func);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Type of form ( S:Single| M:Master Details) ? ", function(answer) {
    console.log(answer);
    if(answer === 'S'){
        rl.question("Please enter the table name in Sakila schema ? ", function(answer) {
            var becomeModel = _s.classify(answer);//change name from table name to Javascript name

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
    }else if(answer === 'M'){
        rl.question("Please enter the master table name in Sakila schema ? ", function(masterTableName) {
            var becomeModelMasterTableName = _s.classify(masterTableName);//change name from table name to Javascript name
            rl.question("Please enter the detail table name in Sakila schema ? ", function(detailTableName) {
                var becomeModelDetailTableName = _s.classify(detailTableName);//change name from table name to Javascript name

                fs.exists('../models/'+becomeModelMasterTableName+'.js', function(exists) {
                    if (exists) {
                        console.log('../models/'+becomeModelMasterTableName+'.js  change to ../models/'+becomeModelMasterTableName+"_"+getDateTime()+'.js');
                        fs.rename('../models/'+becomeModelMasterTableName+'.js','../models/'+becomeModelMasterTableName+"_"+getDateTime()+'.js');
                        fs.rename('../controllers/'+becomeModelMasterTableName+'Controller.js','../controllers/'+becomeModelMasterTableName+"Controller_"+getDateTime()+'.js');
                        masterDetail(masterTableName,becomeModelMasterTableName,detailTableName,becomeModelDetailTableName);
                    }else
                    {
                        masterDetail(masterTableName,becomeModelMasterTableName,detailTableName,becomeModelDetailTableName);
                    }
                });
                rl.close();
            });
        });
    }
});

///// main function to make the file ///////
function masterDetail(tableName,becomeModel,detailTableName,detailBecomeModel) {
    var fs = require('fs');
    var insertUpdateStatement = "";
    var insertUpdateStatement2 = "";
    var primaryKeyColumnName = "";
    var modelBody = "";
    var creationDate = "       createdAt : false,\n";
    var lastUpdateDate = "       updatedAt: false,\n";
    var recordOfTable ;

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
        //find all columns of the table and write to file of master table
        db.SYSCOLUMNS.findAll({where: {TABLE_NAME: tableName.toUpperCase()}}, {raw: true}).success(function (data) {
            //Begin insert table information into SYS_Forms : header of form
            //,['FORM_ID','MASTER_TABLE_NAME','MASTER_SEQ','DETAIL_TABLE_NAME','DETAIL_SEQ','FORM_DESCRIPTION','FORM_TYPE']

            insertIntoSysForms(id,tableName,detailTableName);

            //End insert table information into SYS_Forms : header of form

            for (var i = 0; i < data.length; i++) {
                //console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY );
                recordOfTable = data[i];
                //console.log(recordOfTable.COLUMN_NAME.rainbow);
                //Begin inserting into Form Detail
                if(tableName.toUpperCase() != 'SYS_FORMS' && tableName.toUpperCase() != 'SYS_FORM_DETAILS' ) {
                    insertFormDetail(id, tableName, recordOfTable);
                }
                //End inserting into Form Detail
                var isComma = '';

                if (i != 0) {
                    isComma = ',';
                }

                if ((data[i].COLUMN_NAME).toUpperCase() !== ('CREATION_DATE') && (data[i].COLUMN_NAME).toUpperCase() !== ('LAST_UPDATE_DATE')) {
                    if (data[i].COLUMN_KEY === 'PRI') {
                        primaryKeyColumnName = data[i].COLUMN_NAME;
                        if (data[i].DATA_TYPE === 'int') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.INTEGER(11), primaryKey:true} \n';
                        } else if (data[i].DATA_TYPE === 'varchar') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + '), primaryKey:true} \n';
                        } else if (data[i].DATA_TYPE === 'datetime' || data[i].DATA_TYPE === 'date' ) {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.DATE, primaryKey:true} \n';
                        }
                    } else {
                        if (data[i].DATA_TYPE === 'int') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.INTEGER(11) \n';
                        } else if (data[i].DATA_TYPE === 'varchar') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + ') \n';
                        } else if (data[i].DATA_TYPE === 'datetime' || data[i].DATA_TYPE === 'date' ) {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.DATE \n';
                        }
                    }
                    insertUpdateStatement += "          " + isComma + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";
                    insertUpdateStatement2 +=  isComma + "'"+ data[i].COLUMN_NAME + "'";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('CREATION_DATE')){
                    creationDate = "       createdAt : '"+data[i].COLUMN_NAME+"',\n";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('LAST_UPDATE_DATE')){
                    lastUpdateDate = "       updatedAt : '"+data[i].COLUMN_NAME+"',\n";
                }

            }

            createModelFile(fs.createWriteStream('../models/'+becomeModel+'.js'),becomeModel,tableName,modelBody,creationDate,lastUpdateDate);

            createControllerFile(fs.createWriteStream('../controllers/'+becomeModel+'Controller.js'),becomeModel,primaryKeyColumnName,"",insertUpdateStatement,insertUpdateStatement2);

        })//db.SYSCOLUMNS.findAll

        //reset var
        var insertUpdateStatementD = "";
        var insertUpdateStatement2D = "";
        var primaryKeyColumnNameD = "";
        var modelBodyD = "";
        var creationDateD = "       createdAt : false,\n";
        var lastUpdateDateD = "       updatedAt: false,\n";

        //// detail table
        db.SYSCOLUMNS.findAll({where: {TABLE_NAME: detailTableName.toUpperCase()}}, {raw: true}).success(function (data) {

            for (var i = 0; i < data.length; i++) {
                //console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY );
                recordOfTable = data[i];
                //console.log(recordOfTable.COLUMN_NAME.rainbow);
                //Begin inserting into Form Detail
                if(detailTableName.toUpperCase() != 'SYS_FORMS' && detailTableName.toUpperCase() != 'SYS_FORM_DETAILS' ) {
                    insertFormDetail(id, detailTableName, recordOfTable);
                }
                //End inserting into Form Detail
                var isComma = '';

                if (i != 0) {
                    isComma = ',';
                }

                if ((data[i].COLUMN_NAME).toUpperCase() !== ('CREATION_DATE') && (data[i].COLUMN_NAME).toUpperCase() !== ('LAST_UPDATE_DATE')) {
                    if (data[i].COLUMN_KEY === 'PRI') {
                        primaryKeyColumnNameD = data[i].COLUMN_NAME;
                        if (data[i].DATA_TYPE === 'int') {
                            modelBodyD += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.INTEGER(11), primaryKey:true} \n';
                        } else if (data[i].DATA_TYPE === 'varchar') {
                            modelBodyD += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + '), primaryKey:true} \n';
                        } else if (data[i].DATA_TYPE === 'datetime' || data[i].DATA_TYPE === 'date' ) {
                            modelBodyD += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.DATE, primaryKey:true} \n';
                        }
                    } else {
                        if (data[i].DATA_TYPE === 'int') {
                            modelBodyD += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.INTEGER(11) \n';
                        } else if (data[i].DATA_TYPE === 'varchar') {
                            modelBodyD += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + ') \n';
                        } else if (data[i].DATA_TYPE === 'datetime' || data[i].DATA_TYPE === 'date' ) {
                            modelBodyD += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.DATE \n';
                        }
                    }
                    insertUpdateStatementD += "          " + isComma + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";
                    insertUpdateStatement2D +=  isComma + "'"+ data[i].COLUMN_NAME + "'";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('CREATION_DATE')){
                    creationDateD = "       createdAt : '"+data[i].COLUMN_NAME+"',\n";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('LAST_UPDATE_DATE')){
                    lastUpdateDateD = "       updatedAt : '"+data[i].COLUMN_NAME+"',\n";
                }

            }

            createModelFile(fs.createWriteStream('../models/'+detailBecomeModel+'.js'),detailBecomeModel,detailTableName,modelBodyD,creationDateD,lastUpdateDateD);

            createControllerFile(fs.createWriteStream('../controllers/'+detailBecomeModel+'Controller.js'),detailBecomeModel,primaryKeyColumnNameD,primaryKeyColumnName,insertUpdateStatementD,insertUpdateStatement2D);

        })//db.SYSCOLUMNS.findAll

    });///db.SysForms.getPK(function(id)

}///function masterDetail(tableName,becomeModel)

///// main function to make the file ///////
function main(tableName,becomeModel) {
    var fs = require('fs');
    var insertUpdateStatement = "";
    var insertUpdateStatement2 = "";
    var primaryKeyColumnName = "";
    var modelBody = "";
    var creationDate = "       createdAt : false,\n";
    var lastUpdateDate = "       updatedAt: false,\n";
    var recordOfTable ;

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
            //Begin insert table information into SYS_Forms : header of form
            //,['FORM_ID','MASTER_TABLE_NAME','MASTER_SEQ','DETAIL_TABLE_NAME','DETAIL_SEQ','FORM_DESCRIPTION','FORM_TYPE']

            insertIntoSysForms(id,tableName,'');

            //End insert table information into SYS_Forms : header of form

            for (var i = 0; i < data.length; i++) {
                //console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY );
                recordOfTable = data[i];
                //console.log(recordOfTable.COLUMN_NAME.rainbow);
                //Begin inserting into Form Detail
                if(tableName.toUpperCase() != 'SYS_FORMS' && tableName.toUpperCase() != 'SYS_FORM_DETAILS' ) {
                    insertFormDetail(id, tableName, recordOfTable);
                }
                //End inserting into Form Detail
                var isComma = '';

                if (i != 0) {
                    isComma = ',';
                }

                if ((data[i].COLUMN_NAME).toUpperCase() !== ('CREATION_DATE') && (data[i].COLUMN_NAME).toUpperCase() !== ('LAST_UPDATE_DATE')) {
                    if (data[i].COLUMN_KEY === 'PRI') {
                        primaryKeyColumnName = data[i].COLUMN_NAME;
                        if (data[i].DATA_TYPE === 'int') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.INTEGER(11), primaryKey:true} \n';
                        } else if (data[i].DATA_TYPE === 'varchar') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + '), primaryKey:true} \n';
                        } else if (data[i].DATA_TYPE === 'datetime' || data[i].DATA_TYPE === 'date' ) {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : {type:DataTypes.DATE, primaryKey:true} \n';
                        }
                    } else {
                        if (data[i].DATA_TYPE === 'int') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.INTEGER(11) \n';
                        } else if (data[i].DATA_TYPE === 'varchar') {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.STRING(' + data[i].CHARACTER_MAXIMUM_LENGTH + ') \n';
                        } else if (data[i].DATA_TYPE === 'datetime' || data[i].DATA_TYPE === 'date' ) {
                            modelBody += "       " + isComma + data[i].COLUMN_NAME + ' : DataTypes.DATE \n';
                        }
                    }
                    insertUpdateStatement += "          " + isComma + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";
                    insertUpdateStatement2 +=  isComma + "'"+ data[i].COLUMN_NAME + "'";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('CREATION_DATE')){
                    creationDate = "       createdAt : '"+data[i].COLUMN_NAME+"',\n";
                }

                if ((data[i].COLUMN_NAME).toUpperCase() === ('LAST_UPDATE_DATE')){
                    lastUpdateDate = "       updatedAt : '"+data[i].COLUMN_NAME+"',\n";
                }

            }

            createModelFile(fs.createWriteStream('../models/'+becomeModel+'.js'),becomeModel,tableName,modelBody,creationDate,lastUpdateDate);

            createControllerFile(fs.createWriteStream('../controllers/'+becomeModel+'Controller.js'),becomeModel,primaryKeyColumnName,"",insertUpdateStatement,insertUpdateStatement2);

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


function insertFormDetail(id,tableName,recordOfTable){
    db.SysFormDetails.getPK(function(detailId){
        //console.log("ID = " + detailId  + " sysFormDetail".green + "  " + recordOfTable.COLUMN_NAME.rainbow);
        //console.log(recordOfTable);
        var inputType = " type = 'text' ";
        if(recordOfTable.COLUMN_NAME.substring(0,2).toUpperCase() === 'IS')
        {
            inputType = " type = 'checkbox' ng-true-value='1' ng-false-value='0' ";
        }
        if (recordOfTable.DATA_TYPE.indexOf('date') > -1 ){
            inputType = " type = 'date' ";
        }

         db.SysFormDetails.create({
             FORM_ID : id
             ,TABLE_NAME : tableName
             ,FORM_DETAIL_ID : detailId
             ,ORDINAL_POSITION : recordOfTable.ORDINAL_POSITION
             ,COLUMN_NAME : recordOfTable.COLUMN_NAME
             ,IS_NULLABLE : recordOfTable.IS_NULLABLE
             ,DATA_TYPE : recordOfTable.DATA_TYPE
             ,CHARACTER_MAXIMUM_LENGTH : recordOfTable.CHARACTER_MAXIMUM_LENGTH
             ,COLUMN_KEY : recordOfTable.COLUMN_KEY
             ,DISPLAY_NAME : _s.humanize(recordOfTable.COLUMN_NAME)
             ,ISDISPLAY_ON_LIST : 1
             ,ISDISPLAY_ON_FORM : 1
             ,ISNEW : 1
             ,ISUPDATE : 1
             ,ISREQUIRE : 0
             ,ISLIST_LINK : 1
             ,INPUT_TYPE : inputType
             ,LOV_SQL : ''
         }).success(function(){
            console.log('Inserting '.green +recordOfTable.COLUMN_NAME.green+' into SYS_Form_Details successfully !'.green);
         })
         .error(function(err){
            console.log('Error during Inserting '.red + recordOfTable.COLUMN_NAME.red +' into SYS_Form_Details !'.red);
         });

    });
}


function createControllerFile(wstreamController,becomeModel,primaryKeyColumnName,primaryKeyColumnNameM,insertUpdateStatement,insertUpdateStatement2){
    ///Creating Controller file for Model
    //var wstreamController = fs.createWriteStream('../controllers/'+becomeModel+'Controller.js'); // create the model file
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
            "        db."+becomeModel+".findAll({where:{"+primaryKeyColumnName+":id},order:'"+primaryKeyColumnName+"'},{raw: true})\n" +
            "            .success(function(data){\n" +
            "                res.json(data);\n" +
            "            })\n" +
            "            .error(function(err){\n" +
            "                res.json({status:'fail'});\n" +
            "            })\n" +
            "    },\n\n"
    );

    if(primaryKeyColumnNameM.length > 1){
        wstreamController.write(
                "    findByMasterId: function(req,res){\n" +
                "        var id = req.body.id;\n" +
                "        var rs = [];\n" +
                "        db."+becomeModel+".findAll({where:{"+primaryKeyColumnNameM+":id},order:'"+primaryKeyColumnName+"'},{raw: true})\n" +
                "            .success(function(data){\n" +
                "                res.json(data);\n" +
                "            })\n" +
                "            .error(function(err){\n" +
                "                res.json({status:'fail'});\n" +
                "            })\n" +
                "    },\n\n"
        );
    }

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
}

function createModelFile(wstreamModel,becomeModel,tableName,modelBody,creationDate,lastUpdateDate){
    //creating model for table in mySql
    //var wstreamModel = fs.createWriteStream('../models/'+becomeModel+'.js'); // create the model file
    console.log("\n\n\n"+modelBody+"\n\n\n");
    wstreamModel.write(
            "/** \n" +
            "* Created by meditech on " + getAusFormatDateTime() + ".\n" +
            "*/\n" +
            "module.exports = function(sequelize,DataTypes){\n" +
            "   var "+becomeModel+" = sequelize.define('"+becomeModel+"',{\n" +

            modelBody +

            "   " + "},{ \n" +
            "       " + "tableName: '"+tableName+"',\n" +
            "       " + "timestamps: true,\n" +
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
}

function insertIntoSysForms(id,tableName,detailTableName){
    var formType = "";
    if(detailTableName === ''){
        formType = 'Single';
    }else{
        formType = 'Master Details';
    }
    if(tableName.toUpperCase() != 'SYS_FORMS' && tableName.toUpperCase() != 'SYS_FORM_DETAILS' ){
        db.SysForms.create({
            FORM_ID : id
            ,MASTER_TABLE_NAME : tableName
            ,MASTER_SEQ : tableName
            ,DETAIL_TABLE_NAME : detailTableName
            ,DETAIL_SEQ : detailTableName
            ,FORM_DESCRIPTION : 'Generate Form Automatically'
            ,FORM_TYPE : formType
            ,LIST_FORM_TYPE : 'table' //list
            ,NEW_EDIT_FORM_TYPE : 'form'
        }).success(function(){
            console.log('Inserting into SYS_Forms successfully !'.green);
        })
            .error(function(err){
                console.log('Error during Inserting into SYS_Forms !'.red);
            });
    }
}