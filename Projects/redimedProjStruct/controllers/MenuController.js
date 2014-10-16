/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    loadSideMenu: function(req,res)
    {
        var id = req.body.id;
        db.sequelize.query("SELECT m.Menu_Id,m.Description,IFNULL(f.Definition,' ') AS Definition,IFNULL(m.Parent_Id,-1) AS Parent_Id,f.Type,m.Seq,m.Is_Mutiple_Instance,m.isEnable " +
                            "FROM redi_menus m LEFT OUTER JOIN redi_functions f ON m.function_id = f.function_id" +
                            " WHERE m.isEnable = 1 AND m.Menu_Id IN (SELECT r.menu_id FROM redi_user_menus r WHERE r.user_id = ? AND r.isEnable = 1) " +
                            "OR m.Parent_Id IN (SELECT r.menu_id FROM redi_user_menus r WHERE r.user_id = ? AND r.isEnable = 1) AND m.isEnable = 1 ORDER BY m.Menu_Id",null,{raw:true},[id,id])
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:'fail',
                    error:err});
            })
    },
    list: function(req,res)
    {
        db.sequelize.query("SELECT m.menu_id as MenuID, m.`parent_id` as ParentID ,m.Description as MenuDescription,m.`isEnable` as MenuEnable,m.`type` as MenuType, m.definition as MenuDefinition ,f.`function_id` as FunctionID, f.`decription` as FunctionName FROM redi_menus m LEFT JOIN redi_functions f ON m.function_id = f.function_id ORDER BY m.menu_id")
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })

    },
    edit: function(req,res)
    {
        var m = req.body.info;
        var functionId = m.FunctionID == null || m.FunctionID == '' ? null : m.FunctionID;
        db.Menu.update({
            isEnable: m.MenuEnable,
            description: m.MenuDescription,
            type: m.MenuType,
            definition: m.MenuDefinition,
            function_id: functionId
            },{menu_id: m.MenuID})
            .success(function(){
                res.json({status:"success"});
             })
            .error(function(err){
                res.json({status:"fail"});
            });
    },
    insert: function(req,res)
    {
        var m = req.body.info;
        var functionId = m.FunctionID == null || m.FunctionID == '' ? null : m.FunctionID;

        db.Menu
            .create({
                description: m.MenuDescription,
                definition: m.MenuDefinition,
                type: m.MenuType,
                isEnable: m.MenuEnable,
                function_id: functionId,
                parent_id: m.ParentID
            }).success(function(){
                res.json({status:"success"});
            }).error(function(err){
                res.json({status:"fail"});
            });
    },
    findById: function(req,res)
    {
        var id = req.body.id;

        db.Menu.find({where:{menu_id:id}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    },
    listRoot: function(req,res){
        db.Menu.findAll({where:{parent_id:null}},{raw:true})
            .success(function(data){
                res.json(data);
            })
            .error(function(err){
                res.json({status:"fail"});
            })
    }
};