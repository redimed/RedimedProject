
app.get('/',function(req, res) {
    res.sendfile(path.join(clientDir, 'login.html'))
});

app.get('/home',auth,function(req,res){
    res.sendfile(path.join(clientDir, 'home.html'))
});

app.get('/menus',function(req,res){
    req.getConnection(function(err,connection) {
        var query = connection.query("select m.Menu_Id,m.Description,ifnull(f.Definition,' ') as Definition,ifNull(m.Parent_Id,-1) as Parent_Id,f.Type,m.Seq,m.Is_Mutiple_Instance,ifNull(m.Sub_Menu_Id,-1) as Sub_Menu_Id from menus m left outer join functions f on m.function_id = f.function_id where m.isEnable = 1 order by m.Seq",
            function (err, rows) {
                if (err) {
                    res.json({status: 'fail',
                        error: err});
                }
                else {
                    res.json({status: 'success',
                        result: rows });
                }
            });
    });
});



