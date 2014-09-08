/**
 * Created by meditech on 8/29/2014.
 */


/**
 * tannv.dts@gmail.com
 * Method GET
 *param: rl_id. get from req.query
 */
function list(req, res)
{
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
};

function filterByType(req,res)
{
    var rl_id=req.query.rl_id;
    req.getConnection(function(err,connection)
    {

        var query = connection.query('SELECT * FROM cln_specialties where RL_TYPE_ID=?',rl_id,function(err,rows)
        {
            if(err)
            {
                console.log("Error Selecting : %s ",err );
            }
            res.json(rows);
        });
    });
};
exports.filterByType=filterByType;
exports.list=list;