/**
 * Created by meditech on 08/09/2014.
 */
function list(req,res)
{
    req.getConnection(function(err,connection) {

        var query=connection.query("SELECT m.menu_id as MenuID, m.`parent_id` as ParentID ,m.Description as MenuDescription,m.`isEnable` as MenuEnable,m.`type` as MenuType, m.definition as MenuDefinition ,f.`function_id` as FunctionID, f.`decription` as FunctionName FROM redi_menus m LEFT JOIN redi_functions f ON m.function_id = f.function_id ORDER BY m.menu_id",function(err,rows){
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
    var m = req.body.m;

    req.getConnection(function(err,connection){
        var query = connection.query("UPDATE redi_menus SET isEnable=?, description=?, type=? WHERE menu_id=?",[m.MenuEnable, m.MenuDescription, m.MenuType ,m.MenuID],function(err,rows){
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

function editChild(req,res)
{
    var des = req.body.des;
    var type = req.body.type;
    var id = req.body.funcId;
    var enable = req.body.isEnable;
    var menuId = req.body.menuId;
    req.getConnection(function(err,connection){
        var query = connection.query("UPDATE redi_menus SET isEnable=?, description=?, type=?, function_id=? WHERE menu_id=?",[enable, des, type ,id,menuId],function(err,rows){
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
    var m = req.body.m;
	if(m.MenuEnable !== 1)
		m.MenuEnable = 0;

    req.getConnection(function(err,connection){
        var query = connection.query("INSERT INTO redi_menus(description,definition,type,isEnable) VALUES(?,?,?,?)",[m.MenuDescription, m.MenuDefinition, m.MenuType, m.MenuEnable],function(err,rows){
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

function insertChild(req,res)
{
    var child = req.body.c;
	if(child.MenuEnable !== 1)
		child.MenuEnable = 0;
    var pId = req.body.parentId;
    req.getConnection(function(err,connection){
        var query = connection.query("INSERT INTO redi_menus(description,type,isEnable,function_id,parent_id) VALUES(?,?,?,?,?)",[child.MenuDescription, child.MenuType, child.MenuEnable,child.FunctionID,pId],function(err,rows){
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

exports.editChild = editChild;
exports.insertChild = insertChild;
