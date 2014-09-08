/**
 * Created by meditech on 8/29/2014.
 */

/*
 author:tannv.dts@gmail.com
 des: get list sites
 */
function list(req, res)
{
    req.getConnection(function(err,connection)
    {
        var query = connection.query('SELECT * FROM redimedsites',function(err,rows)
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