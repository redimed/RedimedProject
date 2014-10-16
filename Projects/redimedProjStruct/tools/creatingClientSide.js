/**
 * Created by phuongnm on 27/09/2014.
 * use to make model file automatically by enter table name and path of destination
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

rl.question("Do you want to overwrite the source code (Y|N) ? ", function(overwrite) {
    rl.question("Please enter the table name in Sakila schema to create the single form input? ", function (answer) {
        var becomeModel = _s.classify(answer);//change name from table name to Javascript name
        console.log("The table :", answer);
        console.log(" is made to :", becomeModel);

        mkdirSync('../client/modules/' + becomeModel);
        mkdirSync('../client/modules/' + becomeModel + '/controllers');
        mkdirSync('../client/modules/' + becomeModel + '/services');
        mkdirSync('../client/modules/' + becomeModel + '/views');

        fs.exists('../client/modules/' + becomeModel + '/' + becomeModel + '.js', function (exists) {
            if (exists && overwrite === 'N') {
                console.log('../client/modules/' + becomeModel + '/' + becomeModel + '.js');
                fs.rename('../client/modules/' + becomeModel + '/controllers/' + becomeModel + 'Controller.js', '../client/modules/' + becomeModel + '/controllers/' + becomeModel + 'Controller_' + getDateTime() + '.js');
                fs.rename('../client/modules/' + becomeModel + '/controllers/NewEdit' + becomeModel + 'Controller.js', '../client/modules/' + becomeModel + '/controllers/NewEdit' + becomeModel + 'Controller_' + getDateTime() + '.js');
                fs.rename('../client/modules/' + becomeModel + '/services/' + becomeModel + 'Service.js', '../client/modules/' + becomeModel + '/services/' + becomeModel + 'Service_' + getDateTime() + '.js');
                fs.rename('../client/modules/' + becomeModel + '/views/' + becomeModel + '.html', '../client/modules/' + becomeModel + '/views/' + becomeModel + '_' + getDateTime() + '.html');
                fs.rename('../client/modules/' + becomeModel + '/views/NewEdit' + becomeModel + '.html', '../client/modules/' + becomeModel + '/views/NewEdit' + becomeModel + '_' + getDateTime() + '.html');
                fs.rename('../client/modules/' + becomeModel + '/' + becomeModel + '.js', '../client/modules/' + becomeModel + '/' + becomeModel + '_' + getDateTime() + '.js');
                main(answer, becomeModel);
            } else {
                console.log(' \n\n- Begin to create file without rename old files.........\n\n');
                main(answer, becomeModel);
            }
        });


        rl.close();
    });
});
///// main function to make the file ///////
function main(tableName,becomeModel) {
    var fs = require('fs');
    var insertUpdateStatement = "";
    var insertUpdateStatement2 = "";
    var primaryKeyColumnName = "";
    var bodyTableScript = "";
    var bodyNewEditScript = "";
    var newEditInfoVar = "";
    var newEditGetDataController = "";
    var listHeader = "";
    var listBody = "";
    var listType = "";
    var formType = "";
    var detailTableName = "";
    var becomeModelD = "";
    var lovStatement = "\n";
    var lovStatementD = "\n";
    var lovStatementServer = "\n";
    var lovStatementServerD = "\n";
    var lovStatementService = "\n";
    var lovStatementRoute = "\n";
    var valueChangeFunctions = "";
    var isUploadFile = false;

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

    db.SysForms.getColumns(tableName.toUpperCase(),function(data){

    //find all columns of the table and write to file
    //db.SYSCOLUMNS.findAll({where: {TABLE_NAME: tableName.toUpperCase()}}, {raw: true}).success(function (data) {
        for (var i = 0; i < data.length; i++) {

            console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY + '      ' + data[i].LIST_FORM_TYPE + '  lov=' + data[i].LOV_SQL);

            formType = data[i].FORM_TYPE;
            detailTableName = data[i].DETAIL_TABLE_NAME;
            becomeModelD = _s.classify(detailTableName);

            var isComma = '';

            if (i != 0) {
                isComma = ',';
            }
            // for controller at server
            insertUpdateStatement += "          " + isComma + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";
            insertUpdateStatement2 +=  isComma + "'"+ data[i].COLUMN_NAME + "'";
            valueChangeFunctions +=
            "    $scope."+_s.classify(data[i].COLUMN_NAME)+"ValueChange = function(value) {\n" +
            "        console.log('value = ' + value);\n" +
            "    };\n";

            //for LOV of controller at cleint
            if(data[i].LOV_SQL.toUpperCase().indexOf('SELECT') > -1 && data[i].LOV_SQL.toUpperCase().indexOf('FROM') > -1 && data[i].LOV_SQL.toUpperCase().indexOf('WHERE') > -1 ){
                lovStatement += getLOVForClientController(becomeModel,becomeModel,data[i].COLUMN_NAME,data[i].LOV_SQL);
                lovStatementServer += getLOVForServerController(becomeModel,data[i].COLUMN_NAME,data[i].LOV_SQL);
                lovStatementRoute += getLOVForRoute(becomeModel,becomeModel,data[i].COLUMN_NAME);
                lovStatementService += getLOVForService(becomeModel,becomeModel,data[i].COLUMN_NAME,data[i].LOV_SQL);
            }

            if(data[i].ISDISPLAY_ON_LIST === 1){
                if(data[i].LIST_FORM_TYPE === 'table'){
                    listType = "table";
                    bodyTableScript +=
                        "                    <td data-title=\"'"+data[i].DISPLAY_NAME+"'\"  >\n" +
                        "                        <span ng-if='!f.$edit'>{{f."+data[i].COLUMN_NAME+"}}</span>\n" +
                        "                        <div ng-if='f.$edit'><input class='form-control' "+data[i].INPUT_TYPE+" ng-model='f."+data[i].COLUMN_NAME+"' /></div>\n" +
                        "                    </td>\n";
                }else if(data[i].LIST_FORM_TYPE === 'list'){
                    listType = "list";
                    listHeader += "                             <th>"+data[i].DISPLAY_NAME+"</th>\n";
                    listBody +=  "                             <td>{{f."+data[i].COLUMN_NAME+"}}</td>\n";
                }

            }


            if(data[i].ISDISPLAY_ON_FORM === 1) {
                bodyNewEditScript += getDisplayOnForm(data[i].DISPLAY_NAME,data[i].INPUT_TYPE,data[i].COLUMN_NAME,data[i].LOV_SQL);
                if(data[i].INPUT_TYPE.indexOf('') > -1 ){
                    isUploadFile = true;
                }
            }

            newEditInfoVar += "             " + isComma + data[i].COLUMN_NAME + " : ''\n";

            if(data[i].COLUMN_KEY === 'PRI'){
                primaryKeyColumnName = data[i].COLUMN_NAME;
            }

            if(data[i].COLUMN_NAME.substring(0,2) === 'is')
            {
                newEditGetDataController += "           $scope.info."+data[i].COLUMN_NAME+" = data[0]."+data[i].COLUMN_NAME+" == 1 ? '1':'0';\n";
            }
        }

        //create Master Controller for server
        createServerControllerFile(fs.createWriteStream('../controllers/'+becomeModel+'Controller.js'),becomeModel,primaryKeyColumnName,"",insertUpdateStatement,insertUpdateStatement2,lovStatementServer);

        //// for details
        console.log(formType);
        var isComma2 = '';
        var bodyTableScriptD = "";
        var bodyNewEditScriptD = "";
        var newEditInfoVarD = "";
        var primaryKeyColumnNameD = "";
        var newEditGetDataControllerD = "";
        var insertUpdateStatementD = "";
        var insertUpdateStatement2D = "";

        if(formType === 'Master Details'){
            db.SysForms.getDetailColumns(tableName.toUpperCase(),function(data) {
                for (var i = 0; i < data.length; i++) {

                    console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY + '      ' + data[i].LIST_FORM_TYPE  + '  lov=' + data[i].LOV_SQL);

                    if (i != 0) {
                        isComma2 = ',';
                    }

                    insertUpdateStatementD += "          " + isComma2 + data[i].COLUMN_NAME + " : f."+ data[i].COLUMN_NAME + "\n";

                    insertUpdateStatement2D +=  isComma2 + "'"+ data[i].COLUMN_NAME + "'";

                    if(data[i].LOV_SQL.toUpperCase().indexOf('SELECT') > -1 && data[i].LOV_SQL.toUpperCase().indexOf('FROM') > -1 && data[i].LOV_SQL.toUpperCase().indexOf('WHERE') > -1 ){

                        lovStatementD += getLOVForClientController(becomeModel,becomeModelD,data[i].COLUMN_NAME,data[i].LOV_SQL);
                        lovStatementServerD += getLOVForServerController(becomeModelD,data[i].COLUMN_NAME,data[i].LOV_SQL);
                        lovStatementRoute += getLOVForRoute(becomeModel,becomeModelD,data[i].COLUMN_NAME);
                        lovStatementService += getLOVForService(becomeModel,becomeModelD,data[i].COLUMN_NAME,data[i].LOV_SQL);
                    }

                    if(data[i].ISDISPLAY_ON_LIST === 1){
                        bodyTableScriptD +=
                            "                    <td data-title=\"'"+data[i].DISPLAY_NAME+"'\"  >\n" +
                            "                        <span ng-if='!f.$edit'>{{f."+data[i].COLUMN_NAME+"}}</span>\n" +
                            "                        <div ng-if='f.$edit'><input class='form-control' "+data[i].INPUT_TYPE+" ng-model='f."+data[i].COLUMN_NAME+"' /></div>\n" +
                            "                    </td>\n";
                    }

                    if(data[i].ISDISPLAY_ON_FORM === 1) {
                        bodyNewEditScriptD += getDisplayOnForm(data[i].DISPLAY_NAME,data[i].INPUT_TYPE,data[i].COLUMN_NAME,data[i].LOV_SQL);
                    }

                    newEditInfoVarD += "             " + isComma2 + data[i].COLUMN_NAME + " : ''\n";

                    if(data[i].COLUMN_KEY === 'PRI'){
                        primaryKeyColumnNameD = data[i].COLUMN_NAME;
                    }

                    if(data[i].COLUMN_NAME.substring(0,2) === 'is')
                    {
                        newEditGetDataControllerD += "           $scope.info."+data[i].COLUMN_NAME+" = data[0]."+data[i].COLUMN_NAME+" == 1 ? '1':'0';\n";
                    }
                }
                //create Detail Controller for server
                createServerControllerFile(fs.createWriteStream('../controllers/'+becomeModelD+'Controller.js'),becomeModelD,primaryKeyColumnNameD,primaryKeyColumnName,insertUpdateStatementD,insertUpdateStatement2D,lovStatementServerD);
                //create setting file at root of module
                createRootJS(true,becomeModel);
                // create route in server
                createRouteJS(true,becomeModel,becomeModelD,lovStatementRoute);
                //create services file at services diectory of module
                createServiceFile(true,becomeModel,lovStatementService);
                /// create new edit view with detail list
                newEditView(true,becomeModel,bodyNewEditScript,becomeModel,"table",primaryKeyColumnNameD,bodyTableScriptD,isUploadFile);
                // create controller file on controller directory
                createNewEditController(true,becomeModel,newEditInfoVar,newEditGetDataController,primaryKeyColumnNameD,lovStatement,valueChangeFunctions,isUploadFile);


                createNewEditDetailController(false,becomeModel,newEditInfoVarD,newEditGetDataControllerD,primaryKeyColumnNameD,lovStatementD);
                newEditDetailView(false,becomeModel,bodyNewEditScriptD,becomeModel,"table","","");
            });

        }else{

            //create setting file at root of module
            createRootJS(false,becomeModel);
            // create route in server
            createRouteJS(false,becomeModel,"",lovStatementRoute);
            //create services file at services diectory of module
            createServiceFile(false,becomeModel,lovStatementService);
            /// create new edit view
            newEditView(false,becomeModel,bodyNewEditScript,becomeModel,"table",primaryKeyColumnNameD,bodyTableScriptD,isUploadFile);
            // create controller file on controller directory
            createNewEditController(false,becomeModel,newEditInfoVar,newEditGetDataController,primaryKeyColumnNameD,lovStatementD,valueChangeFunctions,isUploadFile);
        }

        listView(becomeModel,listType,primaryKeyColumnName,bodyTableScript,listHeader,listBody);
        createListController(becomeModel,primaryKeyColumnName);

    })

}


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
// Make Dir function

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

function getLOVForClientController(becomeModel,tableName,columnName,lovSql){

    var paraNames = getParaList(lovSql);
    var paraQuery = "";
    var paraHeader = "";
    var comma = "";
    var valueChangeFunctions = "";

    for(i = 0; i<paraNames.length; i++){
        if(i>0){
            comma = ",";
        }
        paraQuery += comma + " p" + paraNames[i] + " : p" + paraNames[i] + "";
        paraHeader += comma + " $scope.info." + paraNames[i].toUpperCase();

    }

    var str ="";

    str =
        "    $scope." + columnName + "LOVs = []\n\n"+
        "    $scope.$watch('info',function(info){\n"+
        "        "+becomeModel+"Service.get" + tableName + columnName + "LOV(" + paraHeader + ").then(function(response){\n" +
        "               $scope." + columnName + "LOVs = response;\n" +
        "        });\n" +
        "    });\n";

    //// add value change function from other field to refresh the LOV

    for(i = 0; i<paraNames.length; i++){

        str +=
            "    $scope."+ _s.classify(paraNames[i]) +"ValueChange = function(value){\n"+
            "        "+becomeModel+"Service.get" + tableName + columnName + "LOV(" + paraHeader + ").then(function(response){\n" +
            "               $scope." + columnName + "LOVs = response;\n" +
            "        });\n" +
            "    };\n";

    }

    return str;
}

function getLOVForServerController(becomeModel,columnName,lovSql){

    var paraNames = getParaList(lovSql);

    var str = "";

    var paraQuery = "";

    var comma = "";

    str +=
        "    get"+columnName+"LOV: function(req,res){\n";

    for(i = 0; i<paraNames.length; i++){
        if(i>0){
            comma = ",";
        }
        str += "        var p" + paraNames[i] + " = req.body.p" + paraNames[i] + ";\n";
        paraQuery += comma + " " + paraNames[i] + " : p" + paraNames[i] + "";
    }

    str +=
        "        db.sequelize.query('"+lovSql+"',null,{raw:true},{" + paraQuery + "})\n" +
        "            .success(function(data){\n" +
        "                res.json(data);\n" +
        "            })\n" +
        "            .error(function(err){\n" +
        "                res.json({status:'fail'});\n" +
        "            })\n" +
        "    },\n\n";

    return str;
}

function getLOVForRoute(becomeModel,tableName,columnName){
    var str = "";
    str =  "app.post('/api/"+becomeModel+"/get"+tableName+columnName+"LOV',"+tableName+"Controller.get"+columnName+"LOV);\n"
    return str;
}

function getLOVForService(becomeModel,tableName,columnName,lovSql){

    var paraNames = getParaList(lovSql);
    var paraQuery = "";
    var paraHeader = "";
    var comma = "";

    for(i = 0; i<paraNames.length; i++){
        if(i>0){
            comma = ",";
        }
        paraQuery += comma + " p" + paraNames[i] + " : p" + paraNames[i] + "";
        paraHeader += comma + " p" + paraNames[i];
    }

    var str = "";

    str =
        "        "+becomeModel+"Service.get" + tableName + columnName+"LOV = function(" + paraHeader + "){\n" +
        "            var list = api.all('" + becomeModel + "/get" + tableName + columnName + "LOV');\n" +
        "            return list.post({" + paraQuery + "});\n" +
        "        }\n" +
        "\n";

    return str;
}

function getDisplayOnForm(displayName,inputType,columnName,lov){
    var str = "";

    if(lov.toUpperCase().indexOf('SELECT') > -1 && lov.toUpperCase().indexOf('FROM') > -1 && lov.toUpperCase().indexOf('WHERE') > -1 ){
        str =
            "        <div class=\"row\">\n" +
            "            <div class=\"col-md-2\" style=\"margin-top:5px;\" >\n" +
            "                <label class=\"pull-right\">" + displayName + "</label>\n" +
            "            </div>\n" +
            "            <div class=\"col-md-6\">\n" +
            "                <select ng-model=\"info." + columnName + "\" ng-change=\""+_s.classify(columnName)+"ValueChange(info." + columnName + ")\" ng-options='"  + columnName + "LOV.id as " + columnName + "LOV.name for " + columnName + "LOV in " + columnName + "LOVs'></select>" +
            //"                <input "+inputType+" class=\"form-control\" ng-model=\"info." + columnName + "\" ng-true-value='1' ng-false-value='0' ng-checked='info." + columnName + "' />\n" +
            "            </div>\n" +
            "        </div>\n";

    }
    else if(inputType.indexOf('checkbox') > -1){
        str =
            "        <div class=\"row\">\n" +
            "            <div class=\"col-md-2\" style=\"margin-top:5px;\" >\n" +
            "                <label class=\"pull-right\">" + displayName + "</label>\n" +
            "            </div>\n" +
            "            <div class=\"col-md-6\">\n" +
            "                <input "+inputType+" class=\"form-control\" ng-model=\"info." + columnName + "\" ng-change=\"" + _s.classify(columnName)+"ValueChange(info." + columnName + ")\" ng-true-value='1' ng-false-value='0' ng-checked='info." + columnName + "' />\n" +
            "            </div>\n" +
            "        </div>\n";

    }
    else if(inputType.indexOf('uploadfile') > -1){
        str =
            "        <div class=\"row\">\n" +
            "            <div class=\"col-md-2\" style=\"margin-top:5px;\" >\n" +
            "                <label class=\"pull-right\">" + displayName + "</label>\n" +
            "            </div>\n" +
            "            <div class=\"col-md-6\">\n" +
            "                <input  type = 'text'  class=\"form-control\" ng-model=\"info." + columnName + "\" ng-change=\"" + _s.classify(columnName)+"ValueChange(info." + columnName + ")\" ng-true-value='1' ng-false-value='0' ng-checked='info." + columnName + "' />\n" +
            "            </div>\n" +
            "            <div class=\"col-md-1\">\n" +
            "                <div class=\"btn-group pull-right\">\n" +
            "                    <a href=\"javascript:;\" ng-click=\"upLoadFile()\" class=\"btn green\" id=\"uploadBtn\">\n" +
            "                        Upload <i class=\"fa\"></i>\n" +
            "                    </a>\n" +
            "                </div>\n" +
            "            </div>\n"+
            "        </div>\n";

    }
    else{
        str =
            "        <div class=\"row\">\n" +
            "            <div class=\"col-md-2\" style=\"margin-top:5px;\" >\n" +
            "                <label class=\"pull-right\">" + displayName + "</label>\n" +
            "            </div>\n" +
            "            <div class=\"col-md-6\">\n" +
            "                <input "+inputType+" class=\"form-control\" ng-model=\"info." + columnName + "\" ng-change=\"" + _s.classify(columnName)+"ValueChange(info." + columnName + ")\" />\n" +
            "            </div>\n" +
            "        </div>\n";

    }

    return str;
}

function createRootJS(isDetail,becomeModel){
    var wstream = fs.createWriteStream('../client/modules/'+becomeModel+'/'+becomeModel+'.js'); // create the model file
    wstream.write(
            "/** \n" +
            "* Created by meditech on 23/09/2014. \n" +
            "*/ \n" +
            "   angular.module('app.loggedIn." + becomeModel + "',[ \n" +
            "       'app.loggedIn." + becomeModel + ".controller', \n" +
            "       'app.loggedIn." + becomeModel + ".NewEdit.controller', \n"
    );
    if(isDetail){
        wstream.write(
                "       'app.loggedIn." + becomeModel + ".NewEditDetail.controller', \n"
        );
    }
    wstream.write(
            "       'app.loggedIn." + becomeModel + ".services' \n" +
            "   ]) \n" +
            "       .config(function($stateProvider){ \n" +
            "           $stateProvider \n" +
            "              .state('loggedIn." + becomeModel + "',{ \n" +
            "                   url:'/" + becomeModel + "', \n" +
            "                  templateUrl: 'modules/" + becomeModel + "/views/" + becomeModel + ".html', \n" +
            "                   controller: '" + becomeModel + "Controller' \n" +
            "              }) \n\n" +
            "              .state('loggedIn.NewEdit" + becomeModel + "',{ \n" +
            "                   url:'/New" + becomeModel + "', \n" +
            "                  templateUrl: 'modules/" + becomeModel + "/views/NewEdit" + becomeModel + ".html', \n" +
            "                   controller: 'NewEdit" + becomeModel + "Controller' \n" +
            "              }) \n\n" +
            "               .state('loggedIn.Edit" + becomeModel + "',{\n" +
            "                   url:'/Edit" + becomeModel + "/:id',\n" +
            "                   templateUrl: 'modules/" + becomeModel + "/views/NewEdit" + becomeModel + ".html',\n" +
            "                   controller: 'NewEdit" + becomeModel + "Controller'\n" +
            "               })\n\n"
    );
    if(isDetail){
        wstream.write(
            "               .state('loggedIn.EditDetail" + becomeModel + "',{\n" +
            "                   url:'/EditDetail" + becomeModel + "/:id/:headerId',\n" +
            "                   templateUrl: 'modules/" + becomeModel + "/views/NewEditDetail" + becomeModel + ".html',\n" +
            "                   controller: 'NewEditDetail" + becomeModel + "Controller'\n" +
            "               })\n\n"
        );
    }
    wstream.write(
            "       });"
    );
    wstream.end;
}


function createRouteJS(isDetail,becomeModel,becomeModelD,lovStatementRoute){

    var wstream = fs.createWriteStream('../routes/'+becomeModel+'Routes.js'); // create the model file

    wstream.write(
            "/** \n" +
            "* Created by meditech on 23/09/2014. \n" +
            "*/ \n" +
            "var "+becomeModel+"Controller = require('./controllers/"+becomeModel+"Controller');\n\n" +

            "//////sys forms 2\n" +

            "app.get('/api/"+becomeModel+"/list',"+becomeModel+"Controller.list);\n" +
            "app.post('/api/"+becomeModel+"/findById',"+becomeModel+"Controller.findById);\n" +
            "app.post('/api/"+becomeModel+"/edit',"+becomeModel+"Controller.edit);\n" +
            "app.post('/api/"+becomeModel+"/insert',"+becomeModel+"Controller.insert);\n\n"
    );
    if(isDetail){
        wstream.write(
                "var "+becomeModelD+"Controller = require('./controllers/"+becomeModelD+"Controller');\n\n" +
                "app.get('/api/"+becomeModel+"/listD',"+becomeModelD+"Controller.list);\n" +
                "app.post('/api/"+becomeModel+"/findByIdD',"+becomeModelD+"Controller.findById);\n" +
                "app.post('/api/"+becomeModel+"/findByMasterIdD',"+becomeModelD+"Controller.findByMasterId);\n" +
                "app.post('/api/"+becomeModel+"/editD',"+becomeModelD+"Controller.edit);\n" +
                "app.post('/api/"+becomeModel+"/insertD',"+becomeModelD+"Controller.insert);\n"

        );
    }
    wstream.write(lovStatementRoute);
    wstream.end;
}


function createServiceFile(isDetail,becomeModel,lovStatementService){
    var wstreamService = fs.createWriteStream('../client/modules/'+becomeModel+'/services/'+becomeModel+'Service.js'); // create the model file
    wstreamService.write(
            "/**\n" +
            " * Created by meditech on 23/09/2014.\n" +
            " */\n" +
            "angular.module('app.loggedIn."+becomeModel+".services',[])\n" +
            ".factory('"+becomeModel+"Service', function(Restangular){\n" +
            "        var "+becomeModel+"Service = {};\n" +
            "        var api = Restangular.all('api');\n" +
            "\n" +
            "        "+becomeModel+"Service.getList = function(){\n" +
            "            var list = api.one('"+becomeModel+"/list');\n" +
            "            return list.get();\n" +
            "        }\n" +
            "\n" +
            "        "+becomeModel+"Service.saveFunction = function(f){\n" +
            "            var saveApi = api.all('"+becomeModel+"/edit');\n" +
            "            return saveApi.post({f:f});\n" +
            "        }\n" +
            "\n" +
            "        "+becomeModel+"Service.insertFunction = function(f){\n" +
            "            var insertApi = api.all('"+becomeModel+"/insert');\n" +
            "            return insertApi.post({f:f});\n" +
            "        }\n" +
            "\n" +
            "        "+becomeModel+"Service.getDataById = function(id){\n" +
            "            var list = api.all('"+becomeModel+"/findById');\n" +
            "            return list.post({id:id});\n" +
            "        }\n\n" +
            lovStatementService
    );
    if(isDetail){
        wstreamService.write(
                "        "+becomeModel+"Service.getListD = function(){\n" +
                "            var list = api.one('"+becomeModel+"/listD');\n" +
                "            return list.get();\n" +
                "        }\n" +
                "\n" +
                "        "+becomeModel+"Service.saveFunctionD = function(f){\n" +
                "            var saveApi = api.all('"+becomeModel+"/editD');\n" +
                "            return saveApi.post({f:f});\n" +
                "        }\n" +
                "\n" +
                "        "+becomeModel+"Service.insertFunctionD = function(f){\n" +
                "            var insertApi = api.all('"+becomeModel+"/insertD');\n" +
                "            return insertApi.post({f:f});\n" +
                "        }\n" +
                "\n" +
                "        "+becomeModel+"Service.getDataByIdD = function(id){\n" +
                "            var list = api.all('"+becomeModel+"/findByIdD');\n" +
                "            return list.post({id:id});\n" +
                "        }\n\n" +
                "        "+becomeModel+"Service.getDataByMasterIdD = function(id){\n" +
                "            var list = api.all('"+becomeModel+"/findByMasterIdD');\n" +
                "            return list.post({id:id});\n" +
                "        }\n\n"
        );
    }
    wstreamService.write(
            "        return "+becomeModel+"Service;\n" +
            "    })"
    );
    wstreamService.end;
}

function createListController(becomeModel,primaryKeyColumnName){
    var wstreamController = fs.createWriteStream('../client/modules/'+becomeModel+'/controllers/'+becomeModel+'Controller.js'); // create the model file
    wstreamController.write(
            "/**\n" +
            " * Created by meditech on 23/09/2014.\n" +
            " */\n" +
            "angular.module('app.loggedIn."+becomeModel+".controller',[])\n" +
            ".controller('"+becomeModel+"Controller',function($scope,$state,$filter,ngTableParams,"+becomeModel+"Service,$http,toastr){\n" +
            "    $scope.data=[];\n" +
            "       \n" +
            "    "+becomeModel+"Service.getList().then(function(response){\n" +
            "        $scope.data=response;\n" +
            "        $scope.tableParams = new ngTableParams({\n" +
            "            page: 1,            // show first page\n" +
            "            count: 50           // count per page\n" +
            "        }, {\n" +
            "            total: response.length, // length of data\n" +
            "            getData: function($defer, params) {\n" +
            "                var filteredData = params.filter() ?\n" +
            "                    $filter('filter')($scope.data, params.filter()) :\n" +
            "                    $scope.data;\n" +
            "\n" +
            "                var orderedData = params.sorting() ?\n" +
            "                    $filter('orderBy')(filteredData, params.orderBy()) :\n" +
            "                    $scope.data;\n" +
            "\n" +
            "                params.total(orderedData.length);\n" +
            "                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));\n" +
            "            }\n" +
            "        });\n" +
            "    });\n\n" +

            "    $scope.addNew = function(){\n" +
            "        $state.go('loggedIn.NewEdit"+becomeModel+"');\n" +
            "    }\n\n" +
            "    $scope.editForm = function(f){\n" +
            "        $state.go('loggedIn.Edit"+becomeModel+"',{id: f."+primaryKeyColumnName+"});\n" +
            "    }\n" +
            "})\n"
    );
    wstreamController.end;


}

function newEditView(isDetail,becomeModel,bodyNewEditScript,becomeModel,listType,primaryKeyColumnName,bodyTableScript,isUploadScript){
    var wstreamNewEditView = fs.createWriteStream('../client/modules/'+becomeModel+'/views/NewEdit'+becomeModel+'.html'); // create the model file
    wstreamNewEditView.write(
            "<div class=\"portlet light bordered\">\n" +
            "    <div class=\"portlet-title\">\n" +
            "        <div class=\"caption\">\n" +
            "            <i class=\"icon-anchor font-green-sharp\"></i>\n" +
            "            <span class=\"caption-subject font-green-sharp bold uppercase\">"+becomeModel+"</span>\n" +
            "\n" +
            "        </div>\n" +
            "\n" +
            "        <div>\n" +
            "            <div class=\"btn-group pull-right\">\n" +
            "                <a href=\"javascript:;\" ng-click=\"backToList()\" class=\"btn green\" id=\"addBtn\">\n" +
            "                    Go Back <i class=\"fa\"></i>\n" +
            "                </a>\n" +
            "            </div>\n" +
            "            <div class=\"btn-group pull-right\">\n" +
            "                <a href=\"javascript:;\" ng-click=\"save()\" class=\"btn green\" id=\"saveBtn\">\n" +
            "                    Save <i class=\"fa\"></i>\n" +
            "                </a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <script type=\"text/javascript\">\n" +
            "            $('#modal-content').on('shown.bs.modal', function () {\n" +
            "                $(\"#txtDescription\").focus();\n" +
            "            });\n" +
            "\n" +
            "            // everytime the button is pushed, open the modal, and trigger the shown.bs.modal event\n" +
            "            $('#addBtn').click(function () {\n" +
            "                $('#modal-content').modal({\n" +
            "                    show: true\n" +
            "                });\n" +
            "            });\n" +
            "        </script>\n" +
            "    </div>\n" +
            "    <div class=\"portlet-body\">\n" +
                bodyNewEditScript

    );
    if(isDetail){
        wstreamNewEditView.write(
                "            <br>\n" +
                "            <table ng-table=\"tableParams\"  class=\"table table-striped table-hover table-bordered ng-table-responsive\">\n" +
                "                <tr ng-repeat=\"f in $data | orderBy:'"+primaryKeyColumnName+"'\"  ng-click='editDetailForm(f)' >\n"
        );

        wstreamNewEditView.write(bodyTableScript);

        wstreamNewEditView.write(
                "                </tr>\n" +
                "            </table>\n" +
                "            <br/>\n"
        );
    }
    wstreamNewEditView.write(
            "    </div>\n" +
            "</div>\n"
    );

    if(isUploadScript){
        wstreamNewEditView.write(
            getUploadDialog()
            //// this is a code for popup upload file into the system.
        );
    }

    wstreamNewEditView.end();
}


function newEditDetailView(isDetail,becomeModel,bodyNewEditScript,becomeModel,listType,primaryKeyColumnName,bodyTableScript){
    var wstreamNewEditView = fs.createWriteStream('../client/modules/'+becomeModel+'/views/NewEditDetail'+becomeModel+'.html'); // create the model file
    wstreamNewEditView.write(
            "<div class=\"portlet light bordered\">\n" +
            "    <div class=\"portlet-title\">\n" +
            "        <div class=\"caption\">\n" +
            "            <i class=\"icon-anchor font-green-sharp\"></i>\n" +
            "            <span class=\"caption-subject font-green-sharp bold uppercase\">"+becomeModel+"</span>\n" +
            "\n" +
            "        </div>\n" +
            "\n" +
            "        <div>\n" +
            "            <div class=\"btn-group pull-right\">\n" +
            "                <a href=\"javascript:;\" ng-click=\"backToList()\" class=\"btn green\" id=\"addBtn\">\n" +
            "                    Go Back <i class=\"fa\"></i>\n" +
            "                </a>\n" +
            "            </div>\n" +
            "            <div class=\"btn-group pull-right\">\n" +
            "                <a href=\"javascript:;\" ng-click=\"save()\" class=\"btn green\" id=\"saveBtn\">\n" +
            "                    Save <i class=\"fa\"></i>\n" +
            "                </a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <script type=\"text/javascript\">\n" +
            "            $('#modal-content').on('shown.bs.modal', function () {\n" +
            "                $(\"#txtDescription\").focus();\n" +
            "            });\n" +
            "\n" +
            "            // everytime the button is pushed, open the modal, and trigger the shown.bs.modal event\n" +
            "            $('#addBtn').click(function () {\n" +
            "                $('#modal-content').modal({\n" +
            "                    show: true\n" +
            "                });\n" +
            "            });\n" +
            "        </script>\n" +
            "    </div>\n" +
            "    <div class=\"portlet-body\">\n" +
            bodyNewEditScript

    );
    if(isDetail){
        wstreamNewEditView.write(
                "            <br>\n" +
                "            <table ng-table=\"tableParams\"  class=\"table table-striped table-hover table-bordered ng-table-responsive\">\n" +
                "                <tr ng-repeat=\"f in $data | orderBy:'"+primaryKeyColumnName+"'\"  ng-click='editDetailForm(f)' >\n"
        );

        wstreamNewEditView.write(bodyTableScript);

        wstreamNewEditView.write(
                "                </tr>\n" +
                "            </table>\n" +
                "            <br/>\n"
        );
    }
    wstreamNewEditView.write(
            "    </div>\n" +
            "</div>\n" +
            "</div>\n"
    );
    wstreamNewEditView.end();
}

function createNewEditController(isDetail,becomeModel,newEditInfoVar,newEditGetDataController,primaryKeyColumnNameD,lovStatement,valueChangeFunctions,isUploadFile){
    /// Create new edit controller
    var wstreamNewEditController = fs.createWriteStream('../client/modules/'+becomeModel+'/controllers/NewEdit'+becomeModel+'Controller.js'); // create the model file

    wstreamNewEditController.write(
            "angular.module('app.loggedIn."+becomeModel+".NewEdit.controller',[])\n" +
            ".controller('NewEdit"+becomeModel+"Controller',function($scope,$state,$stateParams,$filter,ngTableParams,"+becomeModel+"Service){\n\n" +
            "    $scope.info = {\n" +
            newEditInfoVar +
            "        \n" +
            "    };\n\n" +

            "    var id = $stateParams.id;\n" +
            "\n" +
            lovStatement +
            "\n\n"
    );
    if(isDetail){

        wstreamNewEditController.write(
                "    $scope.data=[];\n" +
                "       \n" +
                "    "+becomeModel+"Service.getDataByMasterIdD(id).then(function(response){\n" +
                "        $scope.data=response;\n" +
                "        $scope.tableParams = new ngTableParams({\n" +
                "            page: 1,            // show first page\n" +
                "            count: 50           // count per page\n" +
                "        }, {\n" +
                "            total: response.length, // length of data\n" +
                "            getData: function($defer, params) {\n" +
                "                var filteredData = params.filter() ?\n" +
                "                    $filter('filter')($scope.data, params.filter()) :\n" +
                "                    $scope.data;\n" +
                "\n" +
                "                var orderedData = params.sorting() ?\n" +
                "                    $filter('orderBy')(filteredData, params.orderBy()) :\n" +
                "                    $scope.data;\n" +
                "\n" +
                "                params.total(orderedData.length);\n" +
                "                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));\n" +
                "            }\n" +
                "        });\n" +
                "    });\n\n" +
                "    $scope.editDetailForm = function(f){\n" +
                "        $state.go('loggedIn.EditDetail"+becomeModel+"',{id: f."+primaryKeyColumnNameD+",headerId:id});\n" +
                "    }\n\n"
        );
    }

    if(isUploadFile){
        wstreamNewEditController.write(
                "    $scope.upLoadFile = function(){\n" +
                "        $(\"#lob-upload-file-dialog\").modal({show:true,backdrop:'static'});\n" +
                "    }\n\n" +
                "        //HANDLE UPLOAD FILES\n" +
                "        //Upload File\n" +
                "        var uploader = $scope.uploader = new FileUploader({\n" +
                "            url: '/api/rlob/rl_booking_files/upload'\n" +
                "        });\n" +
                "        // FILTERS\n" +
                "        uploader.filters.push({\n" +
                "            name: 'customFilter',\n" +
                "            fn: function(item /*{File|FileLikeObject}*/, options) {\n" +
                "                return this.queue.length < 10;\n" +
                "            }\n" +
                "        });\n" +
                "        // CALLBACKS\n" +
                "        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {\n" +
                "            console.info('onWhenAddingFileFailed', item, filter, options);\n" +
                "        };\n" +
                "        uploader.onAfterAddingFile = function(fileItem) {\n" +
                "            console.info('onAfterAddingFile', fileItem);\n" +
                "        };\n" +
                "        uploader.onAfterAddingAll = function(addedFileItems) {\n" +
                "            console.info('onAfterAddingAll', addedFileItems);\n" +
                "        };\n" +
                "        uploader.onBeforeUploadItem = function(item) {\n" +
                "            console.info('onBeforeUploadItem', item);\n" +
                "        };\n" +
                "        uploader.onProgressItem = function(fileItem, progress) {\n" +
                "            console.info('onProgressItem', fileItem, progress);\n" +
                "        };\n" +
                "        uploader.onProgressAll = function(progress) {\n" +
                "            console.info('onProgressAll', progress);\n" +
                "        };\n" +
                "        uploader.onSuccessItem = function(fileItem, response, status, headers) {\n" +
                "            var fileInfo=response.fileInfo;\n" +
                "            var refId=angular.copy(fileInfo.BOOKING_ID);\n" +
                "\n" +
                "            fileInfo.DISPLAY=fileInfo.FILE_NAME;\n" +
                "            fileInfo.style_class='lob_admin_booking_file_node';\n" +
                "            fileInfo.PARENT_ID=angular.copy(fileInfo.BOOKING_ID)\n" +
                "            fileInfo.BOOKING_ID=null;\n" +
                "            fileInfo.ASS_ID=$scope.currentNode.ASS_ID;\n" +
                "            $scope.currentNode.nodes.push(fileInfo);\n" +
                "            console.info('onSuccessItem', fileItem, response, status, headers);\n" +
                "            //Put notification\n" +
                "            if(fileInfo.isClientDownLoad==1)\n" +
                "            {\n" +
                "                $scope.rlob_add_notification(fileInfo.ASS_ID,refId,$scope.sourceName,$scope.rlobNotificationType.result,$scope.notificationType.letter,'');\n" +
                "            }\n" +
                "\n" +
                "\n" +
                "        };\n" +
                "        uploader.onErrorItem = function(fileItem, response, status, headers) {\n" +
                "            console.info('onErrorItem', fileItem, response, status, headers);\n" +
                "        };\n" +
                "        uploader.onCancelItem = function(fileItem, response, status, headers) {\n" +
                "            console.info('onCancelItem', fileItem, response, status, headers);\n" +
                "        };\n" +
                "        uploader.onCompleteItem = function(fileItem, response, status, headers) {\n" +
                "            console.info('onCompleteItem', fileItem, response, status, headers);\n" +
                "        };\n" +
                "        uploader.onCompleteAll = function() {\n" +
                "            console.info('onCompleteAll');\n" +
                "        };\n" +
                "        console.info('uploader', uploader);\n" +
                "        //HANDLE UPLOAD FILES\n\n"
        );
    }
    wstreamNewEditController.write(
            "    $scope.backToList = function(){\n" +
            "        $state.go('loggedIn."+becomeModel+"');\n" +
            "    }\n\n" +
            "    if(typeof id != 'undefined') {\n" +
            "       "+becomeModel+"Service.getDataById(id).then(function(data){\n" +
            "           $scope.info = data[0];\n" +
            newEditGetDataController +
            "       })\n" +
            "    }\n\n" +
            "    $scope.save = function(){\n" +
            "\n" +
            "        console.log($scope.info);\n" +
            "\n" +
            "        if(typeof id === 'undefined'){\n" +
            "            "+becomeModel+"Service.insertFunction($scope.info).then(function(data){\n" +
            "                console.log(data);\n" +
            "            });\n" +
            "        }else{\n" +
            "            "+becomeModel+"Service.saveFunction($scope.info,id).then(function(data){\n" +
            "                console.log(data);\n" +
            "            });\n" +
            "        }\n" +
            "\n" +
            "       \n" +
            "    }\n\n" +
                ////valueChangeFunctions +
            "})"
    );
    wstreamNewEditController.end();
}

function createNewEditDetailController(isDetail,becomeModel,newEditInfoVar,newEditGetDataController,primaryKeyColumnNameD,lovStatement){
    /// Create new edit controller
    var wstreamNewEditController = fs.createWriteStream('../client/modules/'+becomeModel+'/controllers/NewEditDetail'+becomeModel+'Controller.js'); // create the model file

    wstreamNewEditController.write(
            "angular.module('app.loggedIn."+becomeModel+".NewEditDetail.controller',[])\n" +
            ".controller('NewEditDetail"+becomeModel+"Controller',function($scope,$state,$stateParams,$filter,ngTableParams,"+becomeModel+"Service){\n\n" +
            "    $scope.info = {\n" +
            newEditInfoVar +
            "        \n" +
            "    };\n\n" +

            "    var id = $stateParams.id;\n" +
            "    var headerId = $stateParams.headerId;\n" +
            "\n" +
            lovStatement +
            "\n\n"
    );
    if(isDetail){

        wstreamNewEditController.write(
                "    $scope.data=[];\n" +
                "       \n" +
                "    "+becomeModel+"Service.getDataByMasterIdD(id).then(function(response){\n" +
                "        $scope.data=response;\n" +
                "        $scope.tableParams = new ngTableParams({\n" +
                "            page: 1,            // show first page\n" +
                "            count: 50           // count per page\n" +
                "        }, {\n" +
                "            total: response.length, // length of data\n" +
                "            getData: function($defer, params) {\n" +
                "                var filteredData = params.filter() ?\n" +
                "                    $filter('filter')($scope.data, params.filter()) :\n" +
                "                    $scope.data;\n" +
                "\n" +
                "                var orderedData = params.sorting() ?\n" +
                "                    $filter('orderBy')(filteredData, params.orderBy()) :\n" +
                "                    $scope.data;\n" +
                "\n" +
                "                params.total(orderedData.length);\n" +
                "                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));\n" +
                "            }\n" +
                "        });\n" +
                "    });\n\n" +
                "    $scope.editDetailForm = function(f){\n" +
                "        alert('I am here');\n" +
                "        $state.go('loggedIn.EditDetail"+becomeModel+"',{id: f."+primaryKeyColumnNameD+"});\n" +
                "    }\n\n"
        );
    }
    wstreamNewEditController.write(
            "    $scope.backToList = function(){\n" +
            "        $state.go('loggedIn.Edit"+becomeModel+"',{id:headerId});\n" +
            "    }\n\n" +
            "    if(typeof id != 'undefined') {\n" +
            "       "+becomeModel+"Service.getDataByIdD(id).then(function(data){\n" +
            "           $scope.info = data[0];\n" +
            newEditGetDataController +
            "       })\n" +
            "    }\n\n" +
            "    $scope.save = function(){\n" +
            "\n" +
            "        console.log($scope.info);\n" +
            "\n" +
            "        if(typeof id === 'undefined'){\n" +
            "            "+becomeModel+"Service.insertFunctionD($scope.info).then(function(data){\n" +
            "                console.log(data);\n" +
            "            });\n" +
            "        }else{\n" +
            "            "+becomeModel+"Service.saveFunctionD($scope.info,id).then(function(data){\n" +
            "                console.log(data);\n" +
            "            });\n" +
            "        }\n" +
            "\n" +
            "       \n" +
            "    }\n" +
            "})"
    );
    wstreamNewEditController.end();
}

function listView(becomeModel,listType,primaryKeyColumnName,bodyTableScript,listHeader,listBody){
    //create view file at the view directory
    var wstreamView = fs.createWriteStream('../client/modules/'+becomeModel+'/views/'+becomeModel+'.html'); // create the model file
    wstreamView.write(
            "<div class=\"portlet light bordered\">\n" +
            "    <div class=\"portlet-title\">\n" +
            "\n" +
            "        <!--<p><strong>Page:</strong> {{tableParams.page()}}-->\n" +
            "        <!--<p><strong>Count per page:</strong> {{tableParams.count()}}-->\n" +
            "        <div class=\"caption\">\n" +
            "            <i class=\"icon-anchor font-green-sharp\"></i>\n" +
            "            <span class=\"caption-subject font-green-sharp bold uppercase\">" + becomeModel + "</span>\n" +
            "\n" +
            "        </div>\n" +
            "\n" +
            "        <div>\n" +
            "            <div class=\"btn-group pull-right\">\n" +
            "                <a href=\"javascript:;\" ng-click=\"addNew()\" class=\"btn green\" id=\"addBtn\">\n" +
            "                    Add New <i class=\"fa fa-plus\"></i>\n" +
            "                </a>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "\n" +
            "        <script type=\"text/javascript\">\n" +
            "            $('#modal-content').on('shown.bs.modal', function () {\n" +
            "                $(\"#txtDescription\").focus();\n" +
            "            });\n" +
            "\n" +
            "            // everytime the button is pushed, open the modal, and trigger the shown.bs.modal event\n" +
            "            $('#addBtn').click(function () {\n" +
            "                $('#modal-content').modal({\n" +
            "                    show: true\n" +
            "                });\n" +
            "            });\n" +
            "        </script>\n" +
            "    </div>\n" +
            "\n"
    );

    ///$scope.info.isCancellation = data[0].isCancellation == 1 ? '1':'0';
    console.log('listType = ' + listType);
    if(listType === 'table'){
        wstreamView.write(
                "    <div class=\"portlet-body\">\n" +
                "\n" +
                "        <div>\n" +
                "            <table ng-table=\"tableParams\"  class=\"table table-striped table-hover table-bordered ng-table-responsive\">\n" +
                "                <tr ng-repeat=\"f in $data track by $index | orderBy:'"+primaryKeyColumnName+"'\"  ng-click='editForm(f)' >\n"
        );

        wstreamView.write(bodyTableScript);

        wstreamView.write(
                "                </tr>\n" +
                "\n" +
                "            </table>\n" +
                "            <br/>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "    </div>"
        );
    }
    else if(listType === 'list'){
        wstreamView.write(
                "<!-- PAGINATION -->\n" +
                "<div class=\"row\">\n" +
                "	<div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12\">\n" +
                "		<pagination boundary-links=\"true\" total-items=\"data.length\" ng-model=\"currentPage\" class=\"pagination-sm\" previous-text=\"&lsaquo;\" next-text=\"&rsaquo;\" first-text=\"&laquo;\" last-text=\"&raquo;\" max-size=\"5\" items-per-page=\"20\" rotate=\"false\">\n" +
                "		</pagination>\n" +
                "	</div>\n" +
                "	<div class=\"col-lg-6 col-md-6 col-sm-12 col-xs-12 text-right\" style=\"padding-top: 15px;\">\n" +
                "		<b>Total: </b>{{data.length}} records\n" +
                "	</div>\n" +
                "</div>\n" +
                "<!-- END PAGINATION -->" +


                "<div class=\"portlet light\">\n" +
                "	<div class=\"portlet-body\">\n" +
                "\n" +
                "		<div class=\"row\">\n" +
                "			<div class=\"col-md-12\">\n" +
                "\n" +
                "				<!-- LIST OF EMPLOYEES -->\n" +
                "				<table class=\"table\">\n" +
                "					<thead>\n" +
                "						<tr>\n" +
                listHeader +
                "						</tr>\n" +
                "					</thead>\n" +
                "					<tbody>\n" +
                "						<tr ng-repeat=\"f in data  | orderBy:'"+primaryKeyColumnName+"'\"  ng-click='editForm(f)' >\n" + ///| limitTo: 3000 | offset: currentPage
                listBody +
                "						</tr>\n" +
                "					</tbody>\n" +
                "				</table>\n" +
                "				<!-- END LIST OF EMPLOYEES -->\n" +
                "\n" +
                "			</div>\n" +
                "		</div>\n" +
                "	</div> <!-- END PORTLET BODY -->\n" +
                "</div> <!-- END PORTLET -->"
        );
    }

    wstreamView.end();
}

function createServerControllerFile(wstreamController,becomeModel,primaryKeyColumnName,primaryKeyColumnNameM,insertUpdateStatement,insertUpdateStatement2,lovStatement){
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
            "    },\n\n" +
            lovStatement
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

function getParaList(str){
    var _s = require('underscore.string');
    var array = _s.words(str);
    var para = [];
    var index = 0;

    for(i = 0; i < array.length ; i++){
        if(array[i].indexOf(':')>-1){
            //console.log(array[i] + '  ' + array[i].indexOf(':'));
            para[index] = array[i].substr(array[i].indexOf(':') + 1);
            index++;
        }
    }

    console.log(para);

    return para;
}


function getUploadDialog(){
    var str = "<div  id=\"lob-upload-file-dialog\" class=\"modal fade\">\n" +
        "    <div class=\"modal-dialog modal-lg\">\n" +
        "        <div class=\"modal-content\">\n" +
        "            <div class=\"modal-header\">\n" +
        "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n" +
        "                <h4 class=\"modal-title\">Upload files</h4>\n" +
        "            </div>\n" +
        "\n" +
        "            <div class=\"modal-body\">\n" +
        "                <div class=\"row\">\n" +
        "                    <div class=\"col-md-12 col-sm-12\" style=\"margin-bottom: 40px\">\n" +
        "                        <input style=\"background-color: burlywood\" type=\"file\" nv-file-select=\"\" uploader=\"uploader\" multiple  /><br/>\n" +
        "                        <table class=\"table\">\n" +
        "                            <thead>\n" +
        "                            <tr>\n" +
        "                                <th width=\"40%\">Name</th>\n" +
        "                                <th ng-show=\"uploader.isHTML5\">Size</th>\n" +
        "                                <th ng-show=\"uploader.isHTML5\">Progress</th>\n" +
        "                                <th>Status</th>\n" +
        "                                <th>Is File Result</th>\n" +
        "                                <th>Actions</th>\n" +
        "                            </tr>\n" +
        "                            </thead>\n" +
        "                            <tbody>\n" +
        "                            <tr ng-repeat=\"item in uploader.queue\">\n" +
        "                                <td><strong>{{ item.file.name }}</strong></td>\n" +
        "                                <td ng-show=\"uploader.isHTML5\" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td>\n" +
        "                                <td ng-show=\"uploader.isHTML5\">\n" +
        "                                    <div class=\"progress\" style=\"margin-bottom: 0;\">\n" +
        "                                        <div class=\"progress-bar\" role=\"progressbar\" ng-style=\"{ 'width': item.progress + '%' }\"></div>\n" +
        "                                    </div>\n" +
        "                                </td>\n" +
        "                                <td class=\"text-center\">\n" +
        "                                    <span ng-show=\"item.isSuccess\"><i class=\"glyphicon glyphicon-ok\"></i></span>\n" +
        "                                    <span ng-show=\"item.isCancel\"><i class=\"glyphicon glyphicon-ban-circle\"></i></span>\n" +
        "                                    <span ng-show=\"item.isError\"><i class=\"glyphicon glyphicon-remove\"></i></span>\n" +
        "                                </td>\n" +
        "                                <td class=\"text-center\">\n" +
        "                                    <!--<input ng-model=\"item.isClientDownLoad\" type=\"checkbox\">-->\n" +
        "                                    <input type=\"checkbox\" ng-model=\"item.formData[0].isClientDownLoad\" ng-true-value=\"1\" ng-false-value=\"0\" ng-init=\"item.formData[0].isClientDownLoad=0\">\n" +
        "                                </td>\n" +
        "                                <td nowrap>\n" +
        "                                    <button type=\"button\" class=\"btn btn-success btn-xs\" ng-click=\"item.upload()\" ng-disabled=\"item.isReady || item.isUploading || item.isSuccess\">\n" +
        "                                        <span class=\"glyphicon glyphicon-upload\"></span> Upload\n" +
        "                                    </button>\n" +
        "                                    <!--<button type=\"button\" class=\"btn btn-warning btn-xs\" ng-click=\"item.cancel()\" ng-disabled=\"!item.isUploading\">-->\n" +
        "                                    <!--<span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel-->\n" +
        "                                    <!--</button>-->\n" +
        "                                    <button type=\"button\" class=\"btn btn-danger btn-xs\" ng-click=\"item.remove()\">\n" +
        "                                        <span class=\"glyphicon glyphicon-trash\"></span> Remove\n" +
        "                                    </button>\n" +
        "                                </td>\n" +
        "                            </tr>\n" +
        "                            </tbody>\n" +
        "                        </table>\n" +
        "\n" +
        "                        <div>\n" +
        "                            <button type=\"button\" class=\"btn btn-success btn-s\" ng-click=\"uploader.uploadAll()\" ng-disabled=\"!uploader.getNotUploadedItems().length\">\n" +
        "                                <span class=\"glyphicon glyphicon-upload\"></span> Upload all\n" +
        "                            </button>\n" +
        "                            <!--<button type=\"button\" class=\"btn btn-warning btn-s\" ng-click=\"uploader.cancelAll()\" ng-disabled=\"!uploader.isUploading\">-->\n" +
        "                            <!--<span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel all-->\n" +
        "                            <!--</button>-->\n" +
        "                            <button type=\"button\" class=\"btn btn-danger btn-s\" ng-click=\"uploader.clearQueue()\" ng-disabled=\"!uploader.queue.length\">\n" +
        "                                <span class=\"glyphicon glyphicon-trash\"></span> Clear all\n" +
        "                            </button>\n" +
        "                        </div>\n" +
        "\n" +
        "                    </div>\n" +
        "                </div>\n" +
        "            </div>\n" +
        "            <div class=\"modal-footer\">\n" +
        "                <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>\n" +
        "\n" +
        "                <!--<a class=\"btn btn-primary\" href=\"{{mailtoLink}}\">Send Email</a>-->\n" +
        "            </div>\n" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";

    return str;
}