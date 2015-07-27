var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

var kiss=require('./kissUtilsController');//tannv add
var itemUtil=require('./itemUtilController');//tannv add
var errorCode=require('./errorCode');//tannv add
var controllerCode='RED_v2ItemFeeType';//tannv add

module.exports = {

    getOption: function(req, res) {
        db.FeeType.findAll({
            attributes: ['FEE_TYPE_ID', 'FEE_TYPE_NAME'],
            where: {ISENABLE : 1}
        }).success(function(data){
            res.json({"status": "success", "data": data});
        })
         .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },

    postInsert: function (req, res) {
        var postData = req.body;
        console.log('this is post data', postData);
        delete postData.FEE_TYPE_ID;
        db.FeeType.create(postData)
            .success(function (created) {
                if (!created) res.json(500, {
                    'status': 'error',
                    'message': 'Cannot Insert'
                });
                res.json({
                    'status': 'success',
                    'data': created
                });
            })
            .error(function (error) {
                res.json(500, {
                    'status': 'error',
                    'message': error
                });
            })
    },

    postDetail: function (req, res) {
        var id = req.body.FEE_TYPE_ID;
        db.FeeType.find(id)
            .success(function (data) {
                res.json({
                    "status": "success",
                    "data": data
                });
            })
            .error(function (error) {
                res.json(500, {
                    "status": "error",
                    "message": error
                });
            });

    },

    postUpdate: function (req, res) {
        var postData = req.body;
        console.log('this is post data', postData);
        var item_id = postData.FEE_TYPE_ID;
        delete postData.FEE_TYPE_ID;

        db.FeeType.update(postData, {
            FEE_TYPE_ID: item_id
        })
            .success(function (data) {
                res.json({
                    "status": "success",
                    "data": data
                });
            })
            .error(function (error) {
                res.json(500, {
                    "status": "error",
                    "message": error
                });
            })
    },

    /**
     * Lay feeType tuong ung voi feeGroupId
     * tannv.dts@gmail.com
     * 27-07-2015
     */
    
    postGetItemFeeTypes:function(req,res)
    {
        var fHeader="v2_ItemFeeTypesController->postGetItemFeeTypes";
        var functionCode="FN001";
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        var itemId=kiss.checkData(postData.itemId)?postData.itemId:'';
        var feeGroupId=kiss.checkData(postData.feeGroupId)?postData.feeGroupId:'';
        if(!kiss.checkListData(itemId,feeGroupId))
        {
            kiss.exlog(fHeader,'Loi data truyen den');
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        var sql=
            " SELECT feeType.*,                                                                    "+
            " itemFee.`FEE_START_DATE`,itemFee.`FEE`,itemFee.`PERCENT`                             "+
            " FROM `cln_fee_types` feeType                                                         "+
            " INNER JOIN `cln_item_fees` itemFee ON feeType.`FEE_TYPE_ID`=itemFee.`FEE_TYPE_ID`    "+
            " WHERE feeType.`FEE_GROUP_ID`=? AND feeType.`ISENABLE`=1                              "+
            " AND itemFee.`ISENABLE`=1                                                             "+
            " AND itemFee.`CLN_ITEM_ID`=?                                                          "+
            " ORDER BY feeType.`FEE_TYPE_NAME` ASC,itemFee.`FEE_START_DATE` DESC                   ";
        kiss.executeQuery(req,sql,[feeGroupId,itemId],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            kiss.exlog(fHeader,'Loi truy van lay fee Type tuong ung fee Group Id',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
        },true);
    }

}