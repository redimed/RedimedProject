//Customer router
function list(req, res)
{
    req.getConnection(function(err,connection)
    {
        var query = connection.query('SELECT * FROM customer',function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            res.json(rows);

        });
    });
};

function edit(req,res)
{
    var id=req.body.id;
    req.getConnection(function(err,connection){
    var query=connection.query("SELECT * from customer where id=?",id,function(err,rows){
        if(err)
        {
            res.json({status:"fail"});
        }
        else
        {
            res.json(rows[0]);
        }
    });
    });
}



function add(req,res)
{
    console.log("EEEEEEEEEEESAAAAAAAS");
    var input = req.body;
    req.getConnection(function(err,connection){
        var query=connection.query('insert into customer set ?',input,function(err,rows){
            if (err)
            {
                console.log("Error inserting : %s ",err );
                res.json({status:"fail"});
            }

            else
            {
                console.log("success");
                res.json({status:"success"});
            }

        })
    });
}

function save(req,res)
{
    var input = req.body;
    var id=req.params.id;
    req.getConnection(function(err,connection){
        var query=connection.query('update customer set ? where id=?',[input,id],function(err,rows){
            if (err)
            {
                console.log("Error edit : %s ",err );
                res.json({status:"fail"});
            }

            else
            {
                console.log("success");
                res.json({status:"success"});
            }
        });
    });
}

exports.add=add;
exports.edit=edit;
exports.list=list;
