var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var kiss=require('./kissUtilsController');//tannv add
var errorCode=require('./errorCode');//tannv add

var controllerCode='RED_v2ItemFeeGroup';//tannv add
var itemUtil=require('./itemUtilController');//tannv add
var fs = require('fs');//tannv add
var xml2js = require('xml2js');//tannv add
var moment = require('moment');//tannv add
var node_xj = require("xls-to-json");//tannv add


/**
 * Function doc file xml luu thanh JSON
 * tannv.dts@gmail.com
 */
var parseXMLToJSON=function(filePath,functionSuccess,functionErr)
{
    var parser = new xml2js.Parser();
    // fs.readFile(__dirname + '/foo.xml', function(err, data) {
    fs.readFile(filePath, function(err, data) {
        parser.parseString(data, function (err, result) {
            if(!err)
            {
                functionSuccess(result);
            }
            else
            {
                functionErr(err);
            }
            console.dir(result);
            console.log('Parse XML Done.');
        });
    });
}

/**
 * Ham chuyen tu file txt thanh array
 * tannv.dts@gmail.com
 * 21-07-2015
 */
var parseTxtSourceToArr=function(filePath,functionSuccess,functionError)
{
    var dataArr=[];
    fs.readFile(filePath,"utf8", function(err, data) {
        if(!err)
        {
            var result={};
            var listLine=data.split('\r');
            if(kiss.checkData(listLine[0]))
            {
                result.description=listLine[0];
            }
            else
            {
                functionError('File is not valid. No description');
                return;
            }
            if(kiss.checkData(listLine[1]))
            {
                result.headers=listLine[1].split('\t');
            }
            else
            {
                functionError('File is not valid. No headers description');
                return;
            }
                
            for(var i=0;i<listLine.length;i++)
            {
                var item=listLine[i].split('\t');
                //nhung item trong thi khong push vao mang
                if(item.length==1 && !kiss.checkData(item[0]))
                    continue;
                {
                    dataArr.push(item);
                }
                
            }
            functionSuccess(dataArr);
        }
        else
        {
            functionError(err);
        }
    });
}

/**
 * Doc file excel xsl thanh json list
 * tannv.dts@gmail.com
 * 21-07-2015
 */
var parseXslSourceToJSON=function(filePath,functionSuccess,functionError)
{
    kiss.exlog(filePath)
    node_xj({
        input: filePath,  // input xls
        output: null, // output json
        sheet: "MBS Vendor Fees",  // specific sheetname
    }, function(err, result) {
        if(!err)
        {
            functionSuccess(result);
        }
        else
        {
            functionError(err);
        }
    });
}

/**
 * Ham kiem tra va lay thuoc  tinh trong source item(json source)
 * tannv.dts@gmail.com
 */
function getAttrVal(sourceItem,attrName,type)
{
    if( kiss.checkData(sourceItem[attrName]) && kiss.checkData(sourceItem[attrName][0].trim() ) )
    {
        //neu kieu la date thi parse lai format thich hop co the luu xuong database
        if(type=='date')
        {
            return moment(sourceItem[attrName][0].trim(),'DD.MM.YYYY').format("YYYY/MM/DD");
        }
        else if(type=='int')
        {
            var value=parseInt(sourceItem[attrName][0].trim());
            //kiem tra xem value co phai la so integer hay khong
            // function isInt(n){
            //     return Number(n) === n && n % 1 === 0;
            // }
            if(value === Number(value) && value % 1 === 0)
            {
                return value;
            }
            else
            {
                return null;
            }
        }
        else if(type=='float')
        {
            var value=parseFloat(sourceItem[attrName][0].trim());
            //kiem tra xem value co phai la so integer hay khong
            // function isFloat(n){
            //     return n === Number(n) && n % 1 !== 0;
            // }
            if(value === Number(value))
            {
                return value;
            }
            else
            {
                return null;
            }
        }
        else
        {
            return sourceItem[attrName][0].trim();
        }
    }
    else
    {
        return null;
    }
}



module.exports = {
    postInsert: function (req, res) {
        var postData = req.body;
        delete postData.FEE_GROUP_ID;
        db.FeeGroup.create(postData)
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
        var id = req.body.FEE_GROUP_ID;
        db.FeeGroup.find(id)
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
        var item_id = postData.FEE_GROUP_ID;
        delete postData.FEE_GROUP_ID;

        db.FeeGroup.update(postData, {
            FEE_GROUP_ID: item_id
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
     * tannv.dts@gmail.com
     * 17-07-2015
     * import cho medicare:schedule/rebate/ip rebate tu file xml
     * 
     */
    postImportMedicareFeeFromSource:function(req,res)
    {
        var fHeader="v2_ItemFeeGroupController->postImportMedicareFeeFromXML";
        var functionCode='FN001';
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        var feeGroupId=kiss.checkData(postData.feeGroupId)?postData.feeGroupId:'';
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var currentTime=kiss.getCurrentTimeStr();
        if(!kiss.checkListData(userId,feeGroupId))
        {
            kiss.exlog(fHeader,'Loi data truyen den',postData);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        //Lay group fee de lay duong dan file source
        var sql="SELECT * FROM cln_fee_group WHERE `FEE_GROUP_ID`=? AND ISENABLE=1";
        kiss.executeQuery(req,sql,[feeGroupId],function(rows){
            if(rows.length>0)
            {
                var groupFee=rows[0];
                //duong dan chua file source
                var filePath=itemUtil.sourceFolderPath+groupFee.PRICE_SOURCE;

                /**
                 * function parse tu item (json source) thanh item co the luu xuong database
                 * tannv.dts@gmail.com
                 */
                var parseSourceItemsToDbItems=function(listSourceItem)
                {
                    var listDbItem=[];
                    for(var i=0;i<listSourceItem.length;i++)
                    {
                        var sourceItem=listSourceItem[i];
                        var dbItem={
                            // ITEM_ID:,//tu tang
                            ITEM_NAME:getAttrVal(sourceItem,'Description'),
                            // ALT_NAME:null,
                            // DESCRIPTION:null,
                            UOM:getAttrVal(sourceItem,'BasicUnits'),
                            ITEM_TYPE:getAttrVal(sourceItem,'ItemType'),
                            // TAX_ID:null,
                            // ISINV:null,
                            // ISASSET:null,
                            // ISBOM:null,
                            // LOT_OR_SERIAL:null,
                            // ISEXP:null,
                            // PRICE:null,
                            ISENABLE:1,
                            CREATED_BY:userId,
                            CREATION_DATE:currentTime,
                            Last_updated_by:userId,
                            Last_update_date:currentTime,
                            // Prefix:null,
                            ITEM_START_DATE:getAttrVal(sourceItem,'ItemStartDate','date'),
                            ITEM_END_DATE:getAttrVal(sourceItem,'ItemEndDate','date'),
                            CATEGORY:getAttrVal(sourceItem,'Category'),
                            INV_GROUP:getAttrVal(sourceItem,'Group'),
                            SUB_GROUP:getAttrVal(sourceItem,'SubGroup'),
                            SUB_HEADING:getAttrVal(sourceItem,'SubHeading'),
                            FEE_TYPE:getAttrVal(sourceItem,'FeeType'),
                            PROVIDER_TYPE:getAttrVal(sourceItem,'ProviderType'),
                            NEW_ITEM:getAttrVal(sourceItem,'NewItem'),
                            ITEM_CHANGE:getAttrVal(sourceItem,'ItemChange'),
                            ANAES_CHANGE:getAttrVal(sourceItem,'AnaesChange'),
                            DESCRIPTOR_CHANGE:getAttrVal(sourceItem,'DescriptorChange'),
                            FEE_CHANGE:getAttrVal(sourceItem,'FeeChange'),
                            EMSN_CHANGE:getAttrVal(sourceItem,'EMSNChange'),
                            EMSN_CAP:getAttrVal(sourceItem,'EMSNCap'),
                            BENEFIT_TYPE:getAttrVal(sourceItem,'BenefitType'),
                            BENEFIT_START_DATE:getAttrVal(sourceItem,'BenefitStartDate','date'),
                            FEE_START_DATE:getAttrVal(sourceItem,'FeeStartDate','date'),//add on 19-07-2015
                            SCHEDULE_FEE:getAttrVal(sourceItem,'ScheduleFee'),//add on 19-07-2015
                            BENEFIT_75:getAttrVal(sourceItem,'Benefit75'),//add on 19-07-2015
                            BENEFIT_85:getAttrVal(sourceItem,'Benefit85'),//add on 19-07-2015
                            BENEFIT_100:getAttrVal(sourceItem,'Benefit100'),//add on 19-07-2015
                            EMSN_START_DATE:getAttrVal(sourceItem,'EMSNStartDate','date'),
                            EMSN_END_DATE:getAttrVal(sourceItem,'EMSNEndDate','date'),
                            EMSN_FIXED_CAP_AMOUNT:getAttrVal(sourceItem,'EMSNFixedCapAmount'),
                            EMSN_PERCENTAGE_CAP:getAttrVal(sourceItem,'EMSNPercentageCap'),
                            EMSN_MAXIMUM_CAP:getAttrVal(sourceItem,'EMSNMaximumCap'),
                            EMSN_DESCRIPTION:getAttrVal(sourceItem,'EMSNDescription'),
                            EMSN_CHANGE_DATE:getAttrVal(sourceItem,'EMSNChangeDate','date'),
                            DERIVED_FEE_START_DATE:getAttrVal(sourceItem,'DerivedFeeStartDate','date'),
                            DERIVED_FEE:getAttrVal(sourceItem,'DerivedFee'),
                            ANAES:getAttrVal(sourceItem,'Anaes'),
                            DESCRIPTION_START_DATE:getAttrVal(sourceItem,'DescriptionStartDate','date'),
                            QFE_START_DATE:getAttrVal(sourceItem,'QFEStartDate','date'),
                            QFE_END_DATE:getAttrVal(sourceItem,'QFEEndDate','date'),
                            ITEM_CODE:getAttrVal(sourceItem,'ItemNum'),
                            SUB_ITEM_CODE:getAttrVal(sourceItem,'SubItemNum'),
                            // DURING_TIME:null
                            // AMA_CODE:null
                            // AMA_DESC:null
                            // isPO:null
                            // isOM:null
                            // TAX_CODE:null
                            // TAX_RATE:null
                        }
                        listDbItem.push(dbItem);
                    }
                    return listDbItem;
                }

                /**
                 * Function rut trich cac loai gia tu bang inv_items
                 * tannv.dts@gmail.com
                 * Neu feeType co order=1-> map voi SCHEDULE_FEE fee
                 * Neu feeType co order=2-> map voi BENEFIT_75 fee
                 * Neu feeType co order=3-> map voi BENEFIT_85 fee
                 * Neu feeType co order=4-> map voi BENEFIT_100 fee
                 */
                var parseItemFeesFromDbItems=function(items,functionSuccess,functionError)
                {
                    var listDbItemFee=[];

                    //dinh nghia tuong ung voi moi fee_group_order se tuong ung luu nhung field nao
                    var feeTypeOrderMapping={
                        1:{field_value:'SCHEDULE_FEE',field_date:'FEE_START_DATE'},
                        2:{field_value:'BENEFIT_75',field_date:'BENEFIT_START_DATE'},
                        3:{field_value:'BENEFIT_85',field_date:'BENEFIT_START_DATE'},
                        4:{field_value:'BENEFIT_100',field_date:'BENEFIT_START_DATE'},
                        // 5:{field_value:'DERIVED_FEE',field_date:'DERIVED_FEE_START_DATE'}
                    }

                    //lay tat ca cac fee_type cua group
                    var sql="SELECT t.* FROM `cln_fee_types` t WHERE t.`ISENABLE`=1 AND t.`FEE_GROUP_ID`=?;";
                    kiss.executeQuery(req,sql,[feeGroupId],function(rows){
                        if(rows.length>0)
                        {
                            var feeTypes=rows;
                            
                            for(var i=0;i<items.length;i++)
                            {
                                var item=items[i];
                                for(var j=0;j<feeTypes.length;j++)
                                {
                                    var feeTypeOrder=feeTypes[j].FEE_GROUP_ORDER;
                                    if(kiss.checkData( feeTypeOrderMapping[feeTypeOrder] ))
                                    {
                                        var dbItemFee={
                                            // ITEM_FEE_ID:'',//tu tang
                                            CLN_ITEM_ID:item.ITEM_ID,
                                            FEE_START_DATE:item[ feeTypeOrderMapping[ feeTypeOrder ].field_date ],
                                            FEE:item[ feeTypeOrderMapping[ feeTypeOrder ].field_value ],
                                            ISENABLE:1,
                                            CREATED_BY:userId,
                                            CREATION_DATE:currentTime,
                                            Last_updated_by:userId,
                                            Last_update_date:currentTime,
                                            FEE_TYPE_ID:feeTypes[j].FEE_TYPE_ID
                                        }
                                        // tannv: FEE_START_DATE va FEE nhat dinh phai co gia tri moi push vao
                                        if(kiss.checkListData(dbItemFee.FEE_START_DATE,dbItemFee.FEE))
                                        {
                                            listDbItemFee.push(dbItemFee);
                                        }

                                    }
                                }
                            }
                            functionSuccess(listDbItemFee);
                        }
                        else
                        {
                            functionSuccess(listDbItemFee);
                        }
                    },function(err){
                        functionError(err);
                    })
                }

                //danh sach item trong xml duoc chuyen thanh doi tuong
                //tannv.dts@gmail.com
                var sourceJson=parseXMLToJSON(filePath,function(result){
                    //xuat ra file result xmljson.txt trong thu muc temp
                    //kiss.exFileJSON(result,'xmljson.txt');
                    var listSourceItem=result.MBS_XML.Data;
                    //chuyen items source(json source) thanh items co the luu xong database
                    var listDbItem=parseSourceItemsToDbItems(listSourceItem);
                    //xuat ra file result xmljson.txt trong thu muc temp
                    //kiss.exFileJSON(listDbItem,'listDbItem.txt');
                    
                    kiss.beginTransaction(req,function()
                    {
                        /**
                         * Ham executeInsertIfDupKeyUpdate: neu insert bi trung thi chuyen sang update current row
                         * Tham so thu 4: list field se duoc cap nhat neu trung key
                         * neu= null->cap nhat tat ca cac field
                         * neu= []->khong cap nhat bat cu field nao
                         * neu= list.length>0-> cap nhat cac field co trong list
                         */
                        kiss.executeInsertIfDupKeyUpdate(req,'inv_items',listDbItem,null,function(result){
                            //Lay tat ca cac item enable trong database
                            var sql="SELECT item.* FROM `inv_items` item WHERE item.`ISENABLE`=1;";
                            kiss.executeQuery(req,sql,[],function(rows){
                                var items=rows;
                                //Trich ra cac item fee tu inv_items
                                parseItemFeesFromDbItems(items,function(listDbItemFee){
                                    //tannv: xuat file test
                                    //kiss.exFileJSON(listDbItemFee,'listDbItemFee.txt');
                                    if(listDbItemFee.length>0)
                                    {
                                        //cac field nay se duoc cap nhat neu duplicate key (or unique)
                                        var fieldUpdate=['FEE','Last_updated_by','Last_update_date'];
                                        kiss.executeInsertIfDupKeyUpdate(req,'cln_item_fees',listDbItemFee,fieldUpdate,function(result){
                                            kiss.commit(req,function(){
                                                res.json({status:'success',data:listDbItemFee});
                                            },function(err){
                                                kiss.exlog(fHeader,'Loi khong the commit',err);
                                                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN010')});
                                            })
                                        },function(err){
                                            kiss.exlog(fHeader,'Loi insert list item fee',err);
                                            kiss.rollback(function(){
                                                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN008')});
                                            });
                                        })
                                    }
                                    else
                                    {                                        
                                        kiss.commit(req,function(){
                                            res.json({status:'success',data:listDbItemFee});
                                        },function(err){
                                            kiss.exlog(fHeader,'Loi khong the commit',err);
                                            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN011')});
                                        })
                                    }
                                    
                                },function(err){
                                    kiss.exlog(fHeader,'Loi parse ItemFees from dbItems',err);
                                    kiss.rollback(function(){
                                        res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN007')});
                                    })
                                })
                            },function(err){
                                kiss.exlog(fHeader,'Loi select bang items co isenable=1',err);
                                kiss.rollback(function(){
                                    res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN006')});
                                });
                            });
                            
                        },function(err){
                            kiss.exlog(fHeader,'Loi khi insert list db item',err);
                            kiss.rollback(function(){
                                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN005')});
                            });
                        })
                    },function(err){
                        kiss.exlog(fHeader,'Khong the mo transaction',err);
                        res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN009')});
                    })

                    
                    
                },function(err){
                    kiss.exlog(fHeader,'Loi khi parse file xml thanh json',err);
                    res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN004')});
                });
            }
            else
            {
                kiss.exlog(fHeader,"Khong co group fee tuong ung voi id ton tai");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
            }
            
        },function(err){
            kiss.exlog(fHeader,'Loi truy van select fee group info',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
        });
    },

    /**
     * Ham doc dva fee tu file xml
     * tannv.dts@gmail.com
     * 21-07-2015
     */
    postImportDvaFeeFromSource:function(req,res)
    {
        var fHeader='v2_ItemFeeGroupController->postImportDVAFeeFromSource';
        var functionCode="FN003";
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        var feeGroupId=kiss.checkData(postData.feeGroupId)?postData.feeGroupId:'';
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var currentTime=kiss.getCurrentTimeStr();
        if(!kiss.checkListData(userId,feeGroupId))
        {
            kiss.exlog(fHeader,'Loi data truyen den',postData);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        //Lay group fee de lay duong dan file source
        var sql="SELECT * FROM cln_fee_group WHERE `FEE_GROUP_ID`=? AND ISENABLE=1";
        kiss.executeQuery(req,sql,[feeGroupId],function(rows){
            if(rows.length>0)
            {
                var groupFee=rows[0];
                //duong dan chua file source
                var filePath=itemUtil.sourceFolderPath+groupFee.PRICE_SOURCE;

                /**
                 * function parse tu item (json source) thanh item co the luu xuong database
                 * tannv.dts@gmail.com
                 */
                var parseSourceFeesToDbFees=function(listSourceFee,functionSuccess,functionError)
                {
                    var listDbFee=[];
                    //mapping tuong ung voi feeTypeOrder se lay gia tri tu field nao trong xml
                    //tannv.dts@gmail.com
                    var feeTypeOrderMapping={
                        1:{attr_value:'ScheduleFee'},
                        2:{attr_value:'LMOFee'},
                        3:{attr_value:'RMFSInHospitalFee'},
                        4:{attr_value:'RMFSOutOfHospitalFee'},
                    }
                    var sql="SELECT item.* FROM `inv_items` item WHERE item.`ISENABLE`=1;";
                    kiss.executeQuery(req,sql,[],function(rows){
                        var itemsLinking={};
                        for(var i=0;i<rows.length;i++)
                        {
                            itemsLinking[rows[i].ITEM_CODE]=rows[i].ITEM_ID;
                        }
                        //xuat ra file mapping giup item code va item id
                        // kiss.exFileJSON(itemsLinking,'itemsLinking.txt')
                        
                        /**
                         * Ham tra ve item id neu truyen vao item code
                         * tannv.dts@gmail.com
                         */
                        function getItemId(itemCode){
                            if(itemsLinking[itemCode])
                            {
                                return itemsLinking[itemCode];
                            }
                            else
                            {
                                return null;
                            }
                        }

                        //Lay ra cac cln_fee_types tuong ung voi fee_group_id
                        var sql="SELECT t.* FROM `cln_fee_types` t WHERE t.`ISENABLE`=1 AND t.`FEE_GROUP_ID`=?;";
                        kiss.executeQuery(req,sql,[feeGroupId],function(rows){
                            if(rows.length>0)
                            {
                                var feeTypes=rows;
                                for(var i=0;i<listSourceFee.length;i++)
                                {
                                    var sourceFee=listSourceFee[i];
                                    for(var j=0;j<feeTypes.length;j++)
                                    {
                                        var feeTypeOrder=feeTypes[j].FEE_GROUP_ORDER;
                                        var attrName=null;
                                        if(feeTypeOrderMapping[ feeTypeOrder ] && feeTypeOrderMapping[ feeTypeOrder ].attr_value)
                                            attrName=feeTypeOrderMapping[ feeTypeOrder ].attr_value;
                                        var dbFee={
                                            CLN_ITEM_ID:getItemId( getAttrVal(sourceFee,'ItemNum','int') ),
                                            FEE_START_DATE:'2015-07-21',//gan tam de test
                                            FEE:getAttrVal(sourceFee,attrName,'float'),
                                            ISENABLE:1,
                                            CREATED_BY:userId,
                                            CREATION_DATE:currentTime,
                                            Last_updated_by:userId,
                                            Last_update_date:currentTime,
                                            FEE_TYPE_ID:feeTypes[j].FEE_TYPE_ID
                                        }
                                        // tannv: FEE_START_DATE va FEE nhat dinh phai co gia tri moi push vao
                                        if(kiss.checkListData(dbFee.CLN_ITEM_ID,dbFee.FEE_START_DATE,dbFee.FEE))
                                        {
                                            listDbFee.push(dbFee);
                                        }
                                    }
                                    
                                }
                                functionSuccess(listDbFee);
                            }
                            else
                            {
                                functionSuccess(listDbFee);
                            }
                        },function(err){
                            functionError(err);
                        })


                    },function(err){
                        functionError(err);
                    });
                    
                }

                parseXMLToJSON(filePath,function(data){
                    //xuat file log the hien data duoc parse tu xml
                    //kiss.exFileJSON(data,'dvaSourcejson.txt')
                    var listSourceFee=data.TABLE.DATA;
                    parseSourceFeesToDbFees(listSourceFee,function(listDbFee){
                        //xuat file log the hien data db duoc parse source json
                        //kiss.exFileJSON(listDbFee,'dvaDbJson.txt')
                        if(listDbFee.length>0)
                        {
                            var fieldUpdate=['FEE','Last_updated_by','Last_update_date'];
                            kiss.executeInsertIfDupKeyUpdate(req,'cln_item_fees',listDbFee,fieldUpdate,function(result){
                                res.json({status:'success',data:listDbFee});
                            },function(err){
                                kiss.exlog(fHeader,'Loi truy van insert list fee',err);
                                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN006')});
                            })
                        }
                        else
                        {
                            res.json({status:'success',data:listDbFee});
                        }
                    },function(err){
                        kiss.exlog(fHeader,'Loi parse Source Fees (Json) to Db Fees (Json)',err);
                        res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN005')});
                    })
                },function(err){
                    kiss.exlog(fHeader,'Loi parse xml to json',err);
                    res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN004')});
                });
            }
            else
            {
                kiss.exlog(fHeader,'Khong co group fee nao tuong ung voi id');
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
            }
        },function(err){
            kiss.exlog(fHeader,'Loi truy van lay group fee tuong ung voi id',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
        });

    },

    /**
     * Import fee tu txt source
     * tannv.dts@gmail.com
     * 20-07-2015
     */
    postImportFeeFromTxtSource:function(req,res){
        var fHeader="v2_ItemFeeGroupController->postImportFeeFromTxtSource";
        var functionCode="FN002";
        var postData=kiss.checkData(req.body.postData)?req.body.postData:{};
        var feeGroupId=kiss.checkData(postData.feeGroupId)?postData.feeGroupId:'';
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var currentTime=kiss.getCurrentTimeStr();
        if(!kiss.checkListData(userId,feeGroupId))
        {
            kiss.exlog(fHeader,'Loi data truyen den',postData);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql="SELECT * FROM cln_fee_group WHERE `FEE_GROUP_ID`=? AND ISENABLE=1";
        kiss.executeQuery(req,sql,[feeGroupId],function(rows){
            if(rows.length>0)
            {
                var groupFee=rows[0];
                //duong dan chua file source
                var filePath=itemUtil.sourceFolderPath+groupFee.PRICE_SOURCE;                
                parseTxtSourceToArr(filePath,function(data){
                    kiss.exFileJSON(data,'txtToArray.txt')
                    res.json({status:'success',data:data});
                },function(err){
                    res.json(err);
                })
            }
            else
            {
                kiss.exlog(fHeader,'Khong co fee group nao tuong ung voi id');
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,'Loi truy van lay thong tin fee group theo id',err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
        });
    },
    
}