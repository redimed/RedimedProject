
function login(a, req, res)
{
    console.log("hello")
    req.getConnection(function(err,connection)
    {
        var name = req.body.u;
        var pass = req.body.p;
        var query = connection.query('SELECT COUNT(*) e FROM users where user_name = ? and password = ?',[name,pass],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
            //res.json(rows);
            console.log(rows[0]);
            if(rows[0].e == 1)
            {
                return res.json("Hello user")
            }else
            {
                return res.json("Could not user")
            }

        });
    });
};
exports.login=login;
