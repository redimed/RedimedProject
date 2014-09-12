/**
 * Created by meditech on 08/09/2014.
 */
function list(req,res)
{
    req.getConnection(function(err,connection) {

        var query=connection.query("SELECT * FROM redi_functions ",function(err,rows){
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
        var query = connection.query("UPDATE redi_functions SET decription=?, definition=?, type=? WHERE function_id=?",[f.decription, f.definition, f.type, f.function_id],function(err,rows){
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
        var query = connection.query("INSERT INTO redi_functions(decription,definition,type) VALUES(?,?,?)",[f.decription, f.definition, f.type],function(err,rows){
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