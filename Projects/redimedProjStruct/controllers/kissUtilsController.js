/**
 * tannv.dts@gmail.com
 * 5-3-2015
 */

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
    return (value!==undefined && value!==null && value!=='');
}

function checkListData()
{
    for (var i = 0; i < arguments.length; i++) 
    {
        if(arguments[i]===undefined || arguments[i]===null || arguments[i]==='')
            return false;
    }
    return true;
}

module.exports =
{

    exlog:exlog,

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
    }
    
}