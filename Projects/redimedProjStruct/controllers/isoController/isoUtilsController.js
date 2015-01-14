/**
 * tannv.dts@gmail.com
 * 11-12-2014
 */

function exlog(data1,data2)
{
    console.log("\n\nBEGIN ISO LOG-------------------------------");
    console.log(JSON.stringify(data1));
    console.log(JSON.stringify(data2));
    console.log("END ISO LOG---------------------------------\n\n");
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

function checkListData(data)
{
    for(var i=0;i<data.length;i++)
    {
        if(data[i]===undefined || data[i]===null || data[i]==='')
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

    isoConst:{
        checkInStatus:{
            lock:'LOCK',
            unlock:'UNLOCK'
        }
    },

    nodeType:{
        folder:'FOLDER',
        document:'DOC'
    },

    submitStatus:{
        pending:'PENDING',
        approved:'APPROVED',
        reject:'REJECTED',
        cancel:'CANCEL'
	},

    isoPermission:{
        administrator:0,
        create:1,
        update:2,
        read:3,
        notPermission:4

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
     * [checkUserPermission description]
     * @param  {[type]} req                  [description]
     * @param  {[type]} permissionCanExecute [description]
     * @return {[type]}                      [description]
     */
    checkUserPermission:function(req,permissionCanExecute)
    {
        var userLoginPermission=1000;
        if(haveData(req.query))
        {
            userLoginPermission=checkData(req.query.userLoginPermission)?req.query.userLoginPermission:1000;
        }
        if(haveData(req.body))
        {
            userLoginPermission=checkData(req.body.userLoginPermission)?req.body.userLoginPermission:1000;
        }
        if(userLoginPermission>permissionCanExecute)
        {
            //res.json({status:'fail'});
            exlog("User cannot execute function!");
            return false;
        }
        else
        {
            return true;
        }
        
    },

    
}