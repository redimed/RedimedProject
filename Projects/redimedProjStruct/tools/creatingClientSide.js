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

rl.question("Please enter the table name in Sakila schema to create the single form input? ", function(answer) {
    var becomeModel = _s.classify(answer);//change name from table name to Javascript name
    console.log("The table :", answer);
    console.log(" is made to :", becomeModel);

    mkdirSync('../client/modules/'+becomeModel);
    mkdirSync('../client/modules/'+becomeModel+'/controllers');
    mkdirSync('../client/modules/'+becomeModel+'/services');
    mkdirSync('../client/modules/'+becomeModel+'/views');

    fs.exists('../client/modules/'+becomeModel+'/'+becomeModel+'.js', function(exists) {
        if (exists) {
            console.log('../client/modules/'+becomeModel+'/'+becomeModel+'.js');
            fs.rename('../client/modules/'+becomeModel+'/controllers/'+becomeModel+'Controller.js',  '../client/modules/'+becomeModel+'/controllers/'+becomeModel+'Controller_' +getDateTime()+'.js');
            fs.rename('../client/modules/'+becomeModel+'/controllers/NewEdit'+becomeModel+'Controller.js',  '../client/modules/'+becomeModel+'/controllers/NewEdit'+becomeModel+'Controller_' +getDateTime()+'.js');
            fs.rename('../client/modules/'+becomeModel+'/services/'+becomeModel+'Service.js',  '../client/modules/'+becomeModel+'/services/'+becomeModel+'Service_' +getDateTime()+'.js');
            fs.rename('../client/modules/'+becomeModel+'/views/'+becomeModel+'.html',  '../client/modules/'+becomeModel+'/views/'+becomeModel+'_' +getDateTime()+'.html');
            fs.rename('../client/modules/'+becomeModel+'/views/NewEdit'+becomeModel+'.html',  '../client/modules/'+becomeModel+'/views/NewEdit'+becomeModel+'_' +getDateTime()+'.html');
            fs.rename('../client/modules/'+becomeModel+'/'+becomeModel+'.js',  '../client/modules/'+becomeModel+'/'+becomeModel+'_' +getDateTime()+'.js');
            main(answer,becomeModel);
        }else
        {
            console.log(' \n\n- Begin to create file without rename old files.........\n\n');
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
    var bodyTableScript = "";
    var bodyNewEditScript = "";
    var newEditInfoVar = "";
    var newEditGetDataController = "";
    var listHeader = "";
    var listBody = "";
    var listType = "";
    //create setting file at root of module
    var wstream = fs.createWriteStream('../client/modules/'+becomeModel+'/'+becomeModel+'.js'); // create the model file
    wstream.write(
                "/** \n" +
                "* Created by meditech on 23/09/2014. \n" +
                "*/ \n" +
                "   angular.module('app.loggedIn." + becomeModel + "',[ \n" +
                "       'app.loggedIn." + becomeModel + ".controller', \n" +
                "       'app.loggedIn." + becomeModel + ".NewEdit.controller', \n" +
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
                "                   url:'/Edit/:id',\n" +
                "                   templateUrl: 'modules/" + becomeModel + "/views/NewEdit" + becomeModel + ".html',\n" +
                "                   controller: 'NewEdit" + becomeModel + "Controller'\n" +
                "               })"  +
                "       });"
    );
    wstream.end;

    //create services file at services diectory of module
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
            "        }\n\n"+
            "        return "+becomeModel+"Service;\n" +
            "    })"
    );
    wstreamService.end;

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
            console.log(data[i].COLUMN_NAME + '              type = ' + data[i].DATA_TYPE + '    ' + data[i].CHARACTER_MAXIMUM_LENGTH + '       ' + data[i].COLUMN_KEY );

            var isComma = '';

            if (i != 0) {
                isComma = ',';
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
                bodyNewEditScript +=
                    "        <div class=\"row\">\n" +
                    "            <div class=\"col-md-2\" style=\"margin-top:5px;\" >\n" +
                    "                <label class=\"pull-right\">" + data[i].DISPLAY_NAME + "</label>\n" +
                    "            </div>\n" +
                    "            <div class=\"col-md-6\">\n" +
                    "                <input "+data[i].INPUT_TYPE+" class=\"form-control\" ng-model=\"info." + data[i].COLUMN_NAME + "\" />\n" +
                    "            </div>\n" +
                    "        </div>\n";
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


        // create controller file on controller directory
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
                "    }" +
                "})\n"
        );
        wstreamController.end;


        /// Create new edit controller
        var wstreamNewEditController = fs.createWriteStream('../client/modules/'+becomeModel+'/controllers/NewEdit'+becomeModel+'Controller.js'); // create the model file
        wstreamNewEditController.write(
                "angular.module('app.loggedIn."+becomeModel+".NewEdit.controller',[])\n" +
                ".controller('NewEdit"+becomeModel+"Controller',function($scope,$state,$stateParams,"+becomeModel+"Service){\n" +
                "    $scope.backToList = function(){\n" +
                "        $state.go('loggedIn."+becomeModel+"');\n" +
                "    }\n\n" +

                "    $scope.info = {\n" +
                newEditInfoVar +
                "        \n" +
                "    };\n\n" +

                "    var id = $stateParams.id;\n" +
                "\n" +
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
                "    }\n" +
                "})"
        );
        wstreamNewEditController.end();

        /// create new edit view

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
                    bodyNewEditScript +
                "    </div>\n" +
                "</div>\n"
        );
        wstreamNewEditView.end();
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
