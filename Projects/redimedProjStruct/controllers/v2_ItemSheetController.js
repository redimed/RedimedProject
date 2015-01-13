var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var ApptItemsModel = require('../v1_models/Cln_appt_items.js');

module.exports = {
    postDeptItems: function(req,res){
        var dept_id = req.body.id;
           db.Department.find({
            where: {CLINICAL_DEPT_ID: dept_id},
            attributes: ['CLINICAL_DEPT_ID', 'CLINICAL_DEPT_NAME'],
            include: [
                { 
                    model: db.InvItemHeader , as: 'ItemLists',
                    attributes: ['POPULAR_HEADER_ID', 'POPULAR_CODE', 'POPULAR_NAME'],
                    include: [
                        {
                            model: db.InvItem,  as: 'Items',
                            attributes: ['ITEM_ID', 'ITEM_NAME', 'ITEM_CODE']
                        }
                    ],
                    order: ['POPULAR_HEADER_ID']
                },
            ]
        }).success(function(data){
            res.json({status:'success', data:data.itemLists});
         })
		},
    
    postInsertDeptItems: function(req,res){
        var insert_arr = req.body.list;
        var sql = ApptItemsModel.sql_insert_cln_appt_items(insert_arr);
        
        db.sequelize.query(sql)
        .success(function(result){
            res.json({status:'success',data:result});
        })
        .error(function(err){
            res.json({status:'error',data:err});
        })
    },
    
    postApptItems: function(req,res){
        var appt_id = req.body.appt_id;
        var patient_id = req.body.patient_id;
        
        var sql = ApptItemsModel.sql_get_appt_items(appt_id, patient_id);
        
        
        db.sequelize.query(sql)
        .success(function(result){
            res.json({status:'success',data:result});
        })
        .error(function(err){
            res.json({status:'error',data:err});
        })
    }
}
