/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
var db = require('../models');
module.exports =
{
    list:function(req,res)
    {
        req.getConnection(function(err,connection)
        {
            var query = connection.query('SELECT * FROM rl_types',function(err,rows)
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