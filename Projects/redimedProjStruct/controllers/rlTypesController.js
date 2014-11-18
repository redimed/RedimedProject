/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
var db = require('../models');
module.exports =
{
    list:function(req,res)
    {
        var sourceType=req.query.sourceType?req.query.sourceType:null;
        var sql='SELECT * FROM rl_types '+(sourceType?' WHERE SOURCE_TYPE=?':'');
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,sourceType?[sourceType]:[],function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                }
                else
                {
                    res.json(rows);
                }

            });
        });
    },
    getRlTypeById:function(req,res)
    {
        var rlTypeId=req.query.rlTypeId;
        var sql="SELECT rltype.* FROM `rl_types` rltype WHERE rltype.`RL_TYPE_ID`=?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,rlTypeId,function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'});
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows[0]});
                    else
                        res.json({status:'fail'});
                }
            });
        });
    }
}