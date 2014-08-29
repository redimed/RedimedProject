/**
 * Created by meditech on 8/29/2014.
 */
function list(req, res)
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
};

exports.list=list;