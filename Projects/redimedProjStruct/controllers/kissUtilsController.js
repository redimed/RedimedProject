/**
 * tannv.dts@gmail.com
 * 5-3-2015
 */

var moment=require('moment');
var jf = require('jsonfile');
var util = require('util');

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
            exlog(">>>>>>>> Vi tri data truyen den bi loi:",i);
            return false;
        }
            
    }
    return true;
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
                                exlog("kissUtil","executeQuery success",query.sql,result);
                            }
                            else
                            {
                                exlog("kissUtil","executeQuery success",query.sql);
                            }
                        } 
                        functionSuccess(result);
                        return;
                    }
                    else
                    {
                        exlog("kissUtil","executeQuery error",query.sql,err);
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
    }
}
