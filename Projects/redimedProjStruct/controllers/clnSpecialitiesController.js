/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */
var db = require('../models');
module.exports =
{
    list:function(req,res){
        req.getConnection(function(err,connection)
        {

            var query = connection.query('SELECT * FROM cln_specialties',function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                }
                res.json(rows);
            });
        });
    },

    filterByType:function(req,res)
    {
        var RL_TYPE_ID=req.query.RL_TYPE_ID;
        req.getConnection(function(err,connection)
        {

            var query = connection.query('SELECT * FROM cln_specialties where RL_TYPE_ID=?',RL_TYPE_ID,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });
    }
}