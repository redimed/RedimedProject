/**
 * tannv.dts@gmail.com
 * 11-12-2014
 */

function exlog(data1,data2,data3)
{
    
    console.log("\n\nBEGIN ISO LOG-------------------------------");
    if(data1)
    {
        console.log(JSON.stringify(data1));

    }
    if(data2)
    {
        console.log(JSON.stringify(data2));
        
    }
    if(data3)
    {
        console.log(JSON.stringify(data3));
    }
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

var isTestSendMail=true;

module.exports =
{
    isTestSendMail:isTestSendMail,

    getMailSender:function()
    {
        if(isTestSendMail)
        {
            return "REDiMED <vnlegal123@gmail.com>";
        }
        else
        {
            return "REDiMED <healthscreenings@redimed.com.au>";
        }
    },

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

    adminMasterRole:{
        master:'master',
        sub:'sub'
    },

    hierarchyGroup:{
        qms:
        {groupId:11,groupType:'QMS',groupName:'QMS',
            nodes:{
                admin:{nodeId:24,nodeCode:'QMS_Admin'},
                head:{nodeId:25,nodeCode:'QMS_Head'}
            }
        }
    },

    hierarchyApprovalStatus:{
        notYetReview:'not yet review',
        underReview:'under review',
        approved:'approved',
        rejected:'rejected'
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
        if(req.method=='GET')
        {
            userLoginPermission=checkData(req.query.userLoginPermission)?req.query.userLoginPermission:1000;
        }
        if(req.method=='POST')
        {
            userLoginPermission=checkData(req.body.userLoginPermission)?req.body.userLoginPermission:1000;
        }
        if(userLoginPermission>permissionCanExecute)
        {
            //res.json({status:'fail'});
            exlog('user login permission:'+userLoginPermission);
            exlog("User cannot execute function!");
            return false;
        }
        else
        {
            return true;
        }
        
    },

    isAdminTree:function(req)
    {
        var value=0;
        if(req.method=='GET')
        {
            value=checkData(req.query.isAdminTree)?req.query.isAdminTree:0;
        }
        if(req.method=='POST')
        {
            value=checkData(req.body.isAdminTree)?req.body.isAdminTree:0;
        }
        if(value==1)
        {
            return true;
        }
        else
        {
            return false;
        }

    },

    isAdminIsoSystem:function(req)
    {
        var value=0;
        if(req.method=='GET')
        {
            value=checkData(req.query.isAdminIsoSystem)?req.query.isAdminIsoSystem:0;
        }
        if(req.method=='POST')
        {
            value=checkData(req.body.isAdminIsoSystem)?req.body.isAdminIsoSystem:0;
        }
        if(value==1)
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    isIsoApprover:function(req)
    {
        var value=0;
        if(req.method=='GET')
        {
            value=checkData(req.query.isIsoApprover)?req.query.isIsoApprover:0;
        }
        if(req.method=='POST')
        {
            value=checkData(req.body.isIsoApprover)?req.body.isIsoApprover:0;
        }
        if(value==1)
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    isAdminIsoSystemMaster:function(req)
    {
        var value=0;
        if(req.method=='GET')
        {
            value=checkData(req.query.isIsoAdminMaster)?req.query.isIsoAdminMaster:0;
        }
        if(req.method=='POST')
        {
            value=checkData(req.body.isIsoAdminMaster)?req.body.isIsoAdminMaster:0;
        }
        if(value==1)
        {
            return true;
        }
        else
        {
            return false;
        }
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
    }
    
}