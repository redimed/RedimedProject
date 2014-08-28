//Customer router
function list(req, res)
{
    req.getConnection(function(err,connection)
    {
        var query = connection.query('SELECT * FROM customer',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            console.log(rows);
            res.json(rows);

        });
    });
};

function add(req,res)
{
    var info=res.body;

    req.getConnection(function(err,connection){
        var query=connection.query('insert into customer')
    });
}

exports.list=list;
