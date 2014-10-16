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
                res.json(rows);
            });
        });
    }
}