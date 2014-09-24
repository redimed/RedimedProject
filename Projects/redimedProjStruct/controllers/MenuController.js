/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    loadSideMenu: function(req,res)
    {
        req.getConnection(function(err,connection){
            var query = connection.query("SELECT m.Menu_Id,m.Description,IFNULL(f.Definition,' ') " +
                "AS Definition,IFNULL(m.Parent_Id,-1) AS" +
                " Parent_Id,f.Type,m.Seq,m.Is_Mutiple_Instance" +
                " FROM redi_menus m LEFT OUTER JOIN redi_functions f ON m.function_id = f.function_id WHERE" +
                " m.isEnable = 1 ORDER BY m.Menu_Id",function(err,rows){
                if(err)
                {
                    res.json({status:'fail',
                        error:err});
                }
                else
                {
                    res.json(rows);
                }
            });
        });
    },
    list: function(req,res)
    {
        db.sequelize.query("SELECT m.menu_id as MenuID, m.`parent_id` as ParentID ,m.Description as MenuDescription,m.`isEnable` as MenuEnable,m.`type` as MenuType, m.definition as MenuDefinition ,f.`function_id` as FunctionID, f.`decription` as FunctionName FROM redi_menus m LEFT JOIN redi_functions f ON m.function_id = f.function_id ORDER BY m.menu_id").success(function(data){
            if(err)
            {
                res.json({status:"fail"});
            }
            else
            {
                res.json(rows);

            }
        })
    },
    edit: function(req,res)
    {
        var m = req.body.m;

        db.Menu.update({
            isEnable: m.MenuEnable,
            description: m.MenuDescription,
            type: m.MenuType
            },{menu_id: m.MenuID})
            .success(function(){
                res.json({status:"success"});
             })
            .error(function(err){
                res.json({status:"fail"});
            });
    },
    editChild: function(req,res)
    {
        var des = req.body.des;
        var type = req.body.type;
        var id = req.body.funcId;
        var enable = req.body.isEnable;
        var menuId = req.body.menuId;

        db.Menu.update({
            isEnable: enable,
            description: des,
            type: type,
            function_id: id
        },{menu_id: menuId})
            .success(function(){
                res.json({status:"success"});
            })
            .error(function(err){
                res.json({status:"fail"});
            });
    },
    insert: function(req,res)
    {
        var m = req.body.m;
        if(m.MenuEnable !== 1)
            m.MenuEnable = 0;

        db.Menu
            .create({
                description: m.MenuDescription,
                definition: m.MenuDefinition,
                type: m.MenuType,
                isEnable: m.MenuEnable
            },['description','definition','type','isEnable']).success(function(){
                res.json({status:"success"});
            }).error(function(err){
                res.json({status:"fail"});
            });
    },
    insertChild: function(req,res)
    {
        var child = req.body.c;
        if(child.MenuEnable !== 1)
            child.MenuEnable = 0;
        var pId = req.body.parentId;

        db.Menu
            .create({
                description: child.MenuDescription,
                type: child.MenuType,
                isEnable: child.MenuEnable,
                function_id: child.FunctionID,
                parent_id: pId
            },['description','type','isEnable','function_id','parent_id']).success(function(){
                res.json({status:"success"});
            }).error(function(err){
                res.json({status:"fail"});
            });
    }
};