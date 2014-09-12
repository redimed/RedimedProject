/**
 * Created by meditech on 08/09/2014.
 */
function list(req,res)
{
    req.getConnection(function(err,connection) {

        var query=connection.query("SELECT * FROM functions ",function(err,rows){
            if(err)
            {
                res.json({status:"fail"});
            }
            else
            {
                res.json(rows);

            }
        });
    });
}

function edit(req,res)
{
    var f = req.body.f;
    req.getConnection(function(err,connection){
        var query = connection.query("UPDATE functions SET decription=?, definition=?, type=? WHERE function_id=?",[f.decription, f.definition, f.type, f.function_id],function(err,rows){
            if(err)
            {
                res.json({status:"fail"});
            }
            else
            {
                res.json({status:"success"});
            }
        });
    });

}

function insert(req,res)
{
    var f = req.body.f;
    req.getConnection(function(err,connection){
        var query = connection.query("INSERT INTO functions(function_id,decription,definition,type) VALUES((SELECT MAX(f.function_id) FROM functions f)+1,?,?,?)",[f.decription, f.definition, f.type],function(err,rows){
            if(err)
            {
                res.json({status:"fail"});
            }
            else
            {
                res.json({status:"success"});
            }
        });
    });
}

exports.list = list;
exports.edit = edit;
exports.insert = insert;