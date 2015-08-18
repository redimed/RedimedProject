/**
 * tannv.dts@gmail.com
 * 5-3-2015
 */

var moment=require('moment');
var jf = require('jsonfile');
var util = require('util');
var winston = require('winston');
var path = require('path');


/**
 * Xuat log
 * tannv.dts@gmail.com
 * reference:http://stackoverflow.com/questions/19629011/passing-variable-number-of-arguments-in-javascript-function-argument-list
 */
function exlog()
{
    console.log("\n\nBEGIN KISS LOG-------------------------------");
    for (var i = 0; i < arguments.length; i++) 
    {
        console.log(arguments[i]);
    }
    console.log("END KISS LOG---------------------------------\n\n");
}

function exFileJSON(data,fileName)
{
    
    var file = './temp/'+fileName;
    var obj = {name: 'JP'}
     
    jf.writeFile(file, data, function(err) {
      console.log(err);
    })
}


function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

function haveData(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return true;
    }
    return false;
}

/**
 * Kiem tra xem bien co ton tai, hoac neu ton tai thi co gia tri hay khong
 * tannv.dts@gmail.com
 */
function checkData(value)
{
    return (value!==undefined && value!==null && value!=='' && value!={});
}

function checkListData()
{
    for (var i = 0; i < arguments.length; i++) 
    {
        if(arguments[i]===undefined || arguments[i]===null || arguments[i]==='' ||arguments[i]=={})
        {
            console.log(">>>>>>>> Vi tri data truyen den bi trong:",i);
            return false;
        }
            
    }
    return true;
}

/**
 * tannv.dts@gmail.com
 * 10-08-2015
 * Neu value=null||undefined||'' thi tra ve null
 */
function parseValue(value,type,removeStr)
{
    //xoa bo khoan trang truoc sau sau value
    if(typeof value=='string') 
        {
            value=value.trim();
            value=value.replace(removeStr,'');
        }
    // value=value.trim();
    if(checkData(value))
    {   
        if(type=='date')
        {
            if(moment(value,'YYYY-MM-DD').isValid())
                return moment(value,'YYYY-MM-DD').format("YYYY/MM/DD");
            if(moment(value,'YYYY.MM.DD').isValid())
                return moment(value,'YYYY.MM.DD').format('YYYY/MM/DD');
            if(moment(value,'YYYY/MM/DD').isValid())
                return moment(value,'YYYY/MM/DD').format("YYYY/MM/DD");
            return null;
        }
        else if(type=='datetime')
        {
            if(moment(value,'YYYY-MM-DD HH:mm:ss').isValid())
                return moment(value,'YYYY-MM-DD HH:mm:ss').format("YYYY/MM/DD HH:mm:ss");
            if(moment(value,'YYYY.MM.DD HH:mm:ss').isValid())
                return moment(value,'YYYY.MM.DD HH:mm:ss').format('YYYY/MM/DD HH:mm:ss');
            if(moment(value,'YYYY/MM/DD HH:mm:ss').isValid())
                return moment(value,'YYYY/MM/DD HH:mm:ss').format("YYYY/MM/DD HH:mm:ss");
            return null;
        }
        else if(type=='int')
        {
            var n=parseInt(value);
            //kiem tra xem value co phai la so integer hay khong
            // function isInt(n){
            //     return Number(n) === n && n % 1 === 0;
            // }
            if(n === Number(n) && n % 1 === 0)
            {
                return n;
            }
            else
            {
                return null;
            }
        }
        else if(type=='float')
        {
            var n=parseFloat(value);
            //kiem tra xem value co phai la so integer hay khong
            // function isFloat(n){
            //     return n === Number(n) && n % 1 !== 0;
            // }
            if(n === Number(n))
            {
                return n;
            }
            else
            {
                return null;
            }
        }
        else
        {
            
            return value;
        }
    }
    else
    {
        return null;
    }
    
}


/**
 * Ham thuc thi mot cau truy van
 * logQuery=true=> xuat log cau query dang chay
 * logResult=true=>xuat log ket qua cau query dang chay
 * tannv.dts@gmail.com
 */
function executeQuery(req,sql,params,functionSuccess,functionError,logQuery,logResult)
{
    if(checkData(req.kissConnection))
    {
        execute();
    }
    else
    {
        req.getConnection(function(err,connection)
        {
            if(!err)
            {
                req.kissConnection=connection;
                execute();
            }
            else
            {
                exlog("kissUtil","executeQuery error","Err","Khong lay duoc connection");
                functionError(err);
                return;
            }
        });
    }

    function execute()
    {
        var query = req.kissConnection.query(sql,params,function(err,result)
        {
            if(!err)
            {
                if(logQuery===true)
                {
                    if(logResult===true)
                    {
                        exlog("kissUtil","executeQuery success",query.sql,result);
                    }
                    else
                    {
                        exlog("kissUtil","executeQuery success",query.sql);
                    }
                } 
                if(functionSuccess)
                    functionSuccess(result);
                return;
            }
            else
            {
                exlog("kissUtil","executeQuery error",query.sql,err);
                if(functionError)
                    functionError(err);
                return;   
            }
        });
    }
}

module.exports =
{

    exlog:exlog,
    exFileJSON:exFileJSON,
    /**
     * tannv.dts@gmail.com
     * reference: http://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
     */
    pad:function(num, size) 
    {
	    var s = "000000000" + num;
	    return s.substr(s.length-size);
	},

    /**
     * Kiem tra xem bien co ton tai, hoac neu ton tai thi co gia tri hay khong
     * tannv.dts@gmail.com
     */
    checkData:checkData,
    
    checkListData:checkListData,

    //tannv.dts
    //10-08-2015
    parseValue:parseValue,

    isEmpty:isEmpty,

    haveData:haveData,

    status:{
        success:'success',
        fail:'fail',
        ask:'ask'
    },

    /**
     * Tao ra 1 key moi cho row moi cua table
     * tannv.dts@gmail.com
     */
    getNewKey:function(req,tableName,funcSuccess,funcError)
    {
        req.getConnection(function(err,connection) {
            var query=connection.query("SELECT get_pk_value(?) as NEW_KEY",[tableName],function(err,rows){
                if(!err)
                {
                    funcSuccess(rows[0].NEW_KEY);
                }
                else
                {
                    funcError(err);
                }
            });
        });
    },

    checkIsNumber:function(value)
    {
        if(isNaN(value))
        {
            return false;
        }
        else
        {
            return true;
        }
    },

    /**
     * Ham tao transaction
     * Neu transaction tao thanh cong se thuc thi function successFunction
     * [successFunction(connection)]
     * tannv.dts@gmail.com
     */
    beginTransaction:function(req,functionSuccess,functionError)
    {
        if(checkData(req.kissConnection))
        {
            execute();
        }
        else
        {
            req.getConnection(function(err,connection)
            {
                if(!err)
                {
                    req.kissConnection=connection;
                    execute();
                }
                else
                {
                    exlog("beginTransaction","beginTransaction error","Err","Khong lay duoc connection");
                    functionError(err);
                    return;
                }
            });
        }

        function execute()
        {   
            req.kissConnection.beginTransaction(function(err) 
            {
                if (err) 
                { 
                    exlog("beginTransaction","beginTransaction error","Err","Khong the tao transaction");
                    functionError(err);
                    return;
                }
                else
                {
                    functionSuccess();
                }


                /*if (err) 
                { 
                    connection.rollback(function() 
                    {
                        throw err;
                    });
                }*/

                /*connection.commit(function(err) 
                {
                    if (err) 
                    { 
                        connection.rollback(function() 
                        {
                            throw err;
                        });
                    }
                    console.log('success!');
                });*/
            });
        }
    },

    rollback:function(req,functionFinishRollback)
    {
        if(req.kissConnection)
        {
            req.kissConnection.rollback(function() 
            {
                exlog("kissUtil","rollback success!");
                functionFinishRollback();
            });
        }
        else
        {
            functionFinishRollback();
        }
        
    },

    commit:function(req,functionSuccess,functionError)
    {
        req.kissConnection.commit(function(err) 
        {
            if (err) 
            { 
                req.kissConnection.rollback(function() 
                {
                    exlog("kissUtil","commit error","rollback success!");
                    functionError(err);
                });
            }
            else
            {
                exlog("kissUtil","commit success!");
                functionSuccess();
            }
        });
    },

    /**
     * Ham thuc thi mot cau truy van
     * logQuery=true=> xuat log cau query dang chay
     * logResult=true=>xuat log ket qua cau query dang chay
     * tannv.dts@gmail.com
     */
    executeQuery:executeQuery,


    /**
     * tannv.dts@gmail.com
     * Insert list row (list json) vao database
     */
    executeInsert:function(req,tableName,listData,functionSuccess,functionError,logQuery,logResult)
    {
        if(checkData(req.kissConnection))
        {
            execute();
        }
        else
        {
            req.getConnection(function(err,connection)
            {
                if(!err)
                {
                    req.kissConnection=connection;
                    execute();
                }
                else
                {
                    exlog("kissUtil","executeInsert error","Err","Khong lay duoc connection");
                    functionError(err);
                    return;
                }
            });
        }

        function execute()
        {
            var getKeys = function(obj){
                var keys = [];
                for(var key in obj){
                    keys.push(key);
                }
                return keys;
            }
            var getValues=function(obj){
                var values = [];
                for(var key in obj){
                    values.push(obj[key]);
                }
                return values;
            }
            if(listData.length>0)
            {
                var columns=getKeys(listData[0]);
                var values=[];
                for(var i=0;i<listData.length;i++)
                {
                    values.push(getValues(listData[i]));
                }
             
                var sql="insert into ?? (??) values ?";
                var query = req.kissConnection.query(sql,[tableName,columns,values],function(err,result)
                {
                    if(!err)
                    {
                        if(logQuery===true)
                        {
                            if(logResult===true)
                            {
                                exlog("kissUtil","executeInsert success",query.sql,result);
                            }
                            else
                            {
                                exlog("kissUtil","executeInsert success",query.sql);
                            }
                        } 
                        functionSuccess(result);
                        return;
                    }
                    else
                    {
                        exlog("kissUtil","executeInsert error",query.sql,err);
                        functionError(err);
                        return;   
                    }
                });
            }
            else
            {
                functionError({msg:'Data rong'});
            }
            
            
        }
    },

    /**
     * tannv.dts@gmail.com
     * 17-07-2015
     * Insert va su ly update khi trung key 
     *  ON DUPLICATE KEY UPDATE
     *  note:
     *  limitCols=null->update toan bo cols neu dup key
     *  limitCols=[]->khong update bat ki cols nao neu dup key
     *  limitCols.length>0-> update cac col nam trong limitCols neu dupkey
     */
    executeInsertIfDupKeyUpdate:function(req,tableName,listData,limitCols,functionSuccess,functionError,logQuery,logResult)
    {
        if(checkData(req.kissConnection))
        {
            execute();
        }
        else
        {
            req.getConnection(function(err,connection)
            {
                if(!err)
                {
                    req.kissConnection=connection;
                    execute();
                }
                else
                {
                    exlog("kissUtil","executeInsertIfDupKeyUpdate error","Err","Khong lay duoc connection");
                    functionError(err);
                    return;
                }
            });
        }

        function execute()
        {
            var getKeys = function(obj){
                var keys = [];
                for(var key in obj){
                    keys.push(key);
                }
                return keys;
            }
            var getValues=function(obj){
                var values = [];
                for(var key in obj){
                    values.push(obj[key]);
                }
                return values;
            }
            if(listData.length>0)
            {
                var columns=getKeys(listData[0]);
                var values=[];
                for(var i=0;i<listData.length;i++)
                {
                    values.push(getValues(listData[i]));
                }

                var updateStr=" ON DUPLICATE KEY UPDATE ";
                if(limitCols===null)
                {
                    for(var i=0;i<columns.length;i++)
                    {
                        updateStr=updateStr+" "+columns[i]+"=VALUES("+columns[i]+")";
                        if(i<columns.length-1)
                            updateStr+=',';
                        else
                            updateStr+=';';
                    }
                }
                else if(limitCols.length>0)
                {
                    var listInclude=[];
                    var listExclude=[];
                    for(var i=0;i<limitCols.length;i++)
                    {
                        var item=limitCols[i];
                        if(item.indexOf('!')==0)
                        {
                            listExclude.push(item);
                        }
                        else
                        {
                            listInclude.push(item);
                        }
                    }

                    if(listInclude.length>0)
                    {
                        for(var i=0;i<listInclude.length;i++)
                        {
                            updateStr=updateStr+" "+listInclude[i]+"=VALUES("+listInclude[i]+")";
                            if(i<listInclude.length-1)
                                updateStr+=',';
                            else
                                updateStr+=';';
                        }


                    }
                    else //if(listExclude.length>0)
                    {
                        for(var i=0;i<columns.length;i++)
                        {
                            var isExclude=function(item)
                            {
                                for(var j=0;j<listExclude.length;j++)
                                {
                                    if('!'+item==listExclude[j])
                                        return true;
                                }
                                return false;
                            }
                            if(!isExclude(columns[i]))
                            {
                                updateStr=updateStr+" "+columns[i]+"=VALUES("+columns[i]+")";
                                if(i<columns.length-1)
                                    updateStr+=',';
                                else
                                    updateStr+=';';
                            }                            
                        }
                        if(updateStr.charAt(updateStr.length-1)==',')
                            updateStr=updateStr.substr(0, updateStr.length-1)+";";
                    }

                    //code cu khi chua xet truong hop exclude
                    // for(var i=0;i<limitCols.length;i++)
                    // {
                    //     updateStr=updateStr+" "+limitCols[i]+"=VALUES("+limitCols[i]+")";
                    //     if(i<limitCols.length-1)
                    //         updateStr+=',';
                    //     else
                    //         updateStr+=';';
                    // }
                }
                else
                {
                    updateStr=null;
                }

                if(updateStr!==null)
                    var sql="insert into ?? (??) values ?"+updateStr;
                else
                    var sql="insert ignore into ?? (??) values ?";
                //xuat ra cau sql bang file
                //exFileJSON(sql,'insertHandleDup.txt');
                var query = req.kissConnection.query(sql,[tableName,columns,values],function(err,result)
                {
                    if(!err)
                    {
                        if(logQuery===true)
                        {
                            if(logResult===true)
                            {
                                exlog("kissUtil","executeInsertIfDupKeyUpdate success",query.sql,result);
                            }
                            else
                            {
                                exlog("kissUtil","executeInsertIfDupKeyUpdate success",query.sql);
                            }
                        } 
                        functionSuccess(result);
                        return;
                    }
                    else
                    {
                        exlog("kissUtil","executeInsertIfDupKeyUpdate error",query.sql,err);
                        functionError(err);
                        return;   
                    }
                });
            }
            else
            {
                functionError({msg:'Data rong'});
            }
            
            
        }
    },

    getCurrentTimeStr:function()
    {
        return moment().format("YYYY/MM/DD HH:mm:ss");
    },

    getCurrentDateStr:function()
    {
        return moment().format("YYYY/MM/DD");
    },

    /**
     * Chen value vao key tuong ung trong cap dau {{}}
     * Vi du:
     *     str: hello {{name}}
     *     data:{{name:'tan'}}
     *     tokenBinding(str,data)=> hello tan
     * tannv.dts@gmail.com
     */
    tokenBinding:function(strSrc,data)
    {
        for (var key in data) 
        {
            var mask="{{"+key+"}}";
            var value=data[key];
            var re = new RegExp(mask, 'g');
            strSrc = strSrc.replace(re, value);
        }   
        exlog("tokenBinding",strSrc);
        return strSrc;
    },

    getSessionCode:function(req,note,functionSuccess,functionError)
    {
        if(note===undefined)
            note=null;
        var insertInfo={
            note:note
        }
        var sql="insert into SYS_SESSION set ?";
        executeQuery(req,sql,[insertInfo],function(result){
            functionSuccess(result.insertId);
        },function(err){
            functionError(err); 
        });
    },

    /**
     * Ham noi chuoi
     * tannv.dts@gmail.com
     */
    concat:function()
    {
        var str="";
        for (var i = 0; i < arguments.length; i++) 
        {
            str=str+arguments[i];
        }
        return str;
    },
    /*
    * phanquocchien.c1109g@gmail.com
    * su dung winston de ghi ra file log erro
    * 12-08-2015
    */
    logErrorFile:function (req,errorList) {
        var urlApi = req.route.path;
        if (req.body.data) {
            var listError = req.body.data;
        }else{
            var listError = errorList;
        };
        listError.api = urlApi;
        var logname = moment().format("DD-MM-YYYY").toString().concat('.log');
        var logger = new (winston.Logger)({
            transports: [
                new (winston.transports.File)({ 
                    filename: path.join(__dirname, '..', 'log', logname),
                    handleExceptions: true,
                    timestamp: function() {
                        return moment().format("DD-MM-YYYY HH:mm:ss");
                    }
                })
            ]
        }); 
        logger.handleExceptions();
        logger.error(listError);
    }
}
