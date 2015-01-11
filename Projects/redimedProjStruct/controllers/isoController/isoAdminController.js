// var db = require('../models');
var moment=require('moment');
var isoUtil=require('./isoUtilsController');
module.exports =
{
	checkIsoAdmin:function(req,res)
	{
		var userInfo=isoUtil.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
		var userId=isoUtil.checkData(userInfo.id)?userInfo.id:'';
		if(!isoUtil.checkListData([userId]))
		{
			res.json({status:'fail'});
			return;
		}
		var sql="SELECT * FROM iso_admin WHERE ISENABLE=1 AND ADMIN_ID=?";
		req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[userId],function(err,rows)
            {
                if(err)
                {
                    isoUtil.exlog({status:'fail',msg:err});
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                    {
                    	res.json({status:'success'});
                    }
                    else
                    {
                    	res.json({status:'fail'});
                    }
                    
                }
            });
            isoUtil.exlog(query.sql);
        }); 
	}
}