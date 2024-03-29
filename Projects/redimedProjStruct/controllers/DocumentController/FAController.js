/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../../models');
var chainer = new db.Sequelize.Utils.QueryChainer;
module.exports = {
    newFA: function(req,res)
    {
        var PATIENT_ID = req.body.PATIENT_ID;
        var CAL_ID = req.body.CAL_ID;
        console.log(PATIENT_ID + "=========" + CAL_ID);
        db.sequelize.query("INSERT INTO `cln_fa_df_sections` SELECT ?,?,s.*  FROM `sys_fa_df_sections` s",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
            db.sequelize.query("INSERT INTO `cln_fa_df_lines` SELECT ?,?,l.* FROM `sys_fa_df_lines` l",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                db.sequelize.query("INSERT INTO `cln_fa_df_line_details` SELECT ?,?,d.* FROM `sys_fa_df_line_details` d",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                    db.sequelize.query("INSERT INTO `cln_fa_df_headers` SELECT ?,?,h.* FROM  `sys_fa_df_headers` h",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                        db.sequelize.query("INSERT INTO `cln_fa_df_comments` SELECT ?,?,c.* FROM `sys_fa_df_comments` c",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                            res.json({status:"success"});
                        });
                    });
                });
            });
        }).error(function(err){
            res.json({status:'error'});
            console.log(err);
        });
    },

    loadFA: function(req,res){
        var PATIENT_ID = req.body.PATIENT_ID;
        var CAL_ID = req.body.CAL_ID;
        var data = [];
        sequelize.transaction(function(t) {
            db.HeaderFA.findAll({where : {ISENABLE : 1,PATIENT_ID : PATIENT_ID,CAL_ID: CAL_ID}},{transaction: t})
                .success(function(dataH){
                    db.SectionFA.findAll({where : {ISENABLE : 1,PATIENT_ID : PATIENT_ID,CAL_ID: CAL_ID}, order : 'ORD'},{transaction: t})
                        .success(function(dataS){
                            db.LineFA.findAll({where : {ISENABLE : 1,PATIENT_ID : PATIENT_ID,CAL_ID: CAL_ID}, order : 'ORD'},{transaction: t})
                                .success(function(dataL){
                                    db.DetailFA.findAll({where : {ISENABLE : 1,PATIENT_ID : PATIENT_ID,CAL_ID: CAL_ID}, order : 'ORD'},{transaction: t})
                                        .success(function(dataD){
                                            db.CommentFA.findAll({where : {ISENABLE : 1,PATIENT_ID : PATIENT_ID,CAL_ID: CAL_ID}},{transaction: t})
                                                .success(function(dataC){
                                                    t.commit().success(function() {
                                                        data = [{"Header": dataH, "Section" : dataS,"Line": dataL,"Detail" : dataD,"Comment" : dataC}];
                                                        res.json(data);
                                                    })
                                                })
                                        })
                                })
                        })
                })
                .error(function(err){
                    t.rollback().success(function() {
                        res.json({status:'error'});
                    })
                    console.log(err);
                })})
    },

    insertFA : function(req, res)
    {
        var infoL = req.body.infoL;
        var infoH = req.body.infoH;
        var infoD = req.body.infoD;
        var infoC = req.body.infoC;
        var max;

        sequelize.transaction(function(t) {
            db.HeaderFA.update({
                ENTITY_ID: infoH.ENTITY_ID ,
                Created_by: infoH.Created_by ,
                //Creation_date : infoH.Creation_date ,
                Last_updated_by: infoH.Last_updated_by ,
                //Last_update_date : infoH.Last_update_date ,
                Risk: infoH.Risk ,
                Comments : infoH.Comments ,
                Recommend: infoH.Recommend ,
                Att_Flexibility: infoH.Att_Flexibility ,
                Att_Core_Stability: infoH.Att_Core_Stability ,
                Att_Wirst_Elbow_func: infoH.Att_Wirst_Elbow_func ,
                Att_Shoulder_func: infoH.Att_Shoulder_func ,
                Att_Lower_Limb_func: infoH.Att_Lower_Limb_func ,
                Att_Balance: infoH.Att_Balance ,
                ASSESSED_ID: infoH.ASSESSED_ID ,
                ASSESSED_SIGN: infoH.ASSESSED_SIGN ,
                ASSESSED_DATE : infoH.ASSESSED_DATE ,
                ASSESSED_NAME : infoH.ASSESSED_NAME ,
                ITEM_ID: infoH.ITEM_ID
            },{PATIENT_ID : infoH.PATIENT_ID,CAL_ID : infoH.CAL_ID},{raw:true})
                .success(function(data){
                    t.commit().success(function() {

                        db.LineFA.max('LINE_ID').success(function(maxL) {
                            db.DetailFA.max('DETAIL_ID').success(function(maxD) {
                                db.CommentFA.max('FA_COMMENT_ID').success(function(maxC) {
                                    maxL > maxD ? max = maxL : max = maxD;
                                    max > maxC ? max = max : max = maxC;

                                    for(var i = 1; i <= max ; i++ )
                                    {
                                        if(infoL.RATE1[i]!=null || infoL.SCORE1[i] != null || infoL.SCORE2[i] != null || infoL.RATING_VALUE1[i] != null || infoL.RATING_VALUE2[i] != null || infoL.COMMENTS[i]!= null)
                                        {
                                            chainer.add(db.LineFA.update({
                                                SCORE1: infoL.SCORE1[i],
                                                SCORE2: infoL.SCORE2[i],
                                                RATING_VALUE1: infoL.RATING_VALUE1[i],
                                                RATING_VALUE2: infoL.RATING_VALUE2[i],
                                                RATE1: infoL.RATE1[i],
                                                RATE2: infoL.RATE2[i],
                                                COMMENTS: infoL.COMMENTS[i]
                                            },{PATIENT_ID : infoH.PATIENT_ID,CAL_ID : infoH.CAL_ID, LINE_ID : i},{raw:true},{transaction: t}))
                                        }
                                        if(infoD.VAL1_CHECKBOX[i] != null || infoD.VAL2_CHECKBOX[i] != null || infoD.VAL1_VALUE[i] != null || infoD.VAL2_VALUE[i] != null || infoD.COMMENTS[i]!= null)
                                        {
                                            chainer.add(db.DetailFA.update({
                                                VAL1_CHECKBOX: infoD.VAL1_CHECKBOX[i],
                                                VAL2_CHECKBOX: infoD.VAL2_CHECKBOX[i],
                                                VAL1_VALUE: infoD.VAL1_VALUE[i],
                                                VAL2_VALUE: infoD.VAL2_VALUE[i],
                                                COMMENTS: infoD.COMMENTS[i]
                                            },{PATIENT_ID : infoH.PATIENT_ID,CAL_ID : infoH.CAL_ID, DETAIL_ID : i},{raw:true},{transaction: t}))
                                        }
                                        if(infoC.VALUE[i] != null)
                                        {
                                            chainer.add(db.CommentFA.update({
                                                    VALUE: infoC.VALUE[i]
                                                },{PATIENT_ID : infoH.PATIENT_ID,CAL_ID : infoH.CAL_ID, FA_COMMENT_ID : i},{raw:true},{transaction: t})
                                            )
                                        }
                                    }
                                    chainer.runSerially().success(function(){
                                        t.commit().success(function() {
                                            res.json({status:'success'});
                                        })
                                    }).error(function(errors){
                                        t.rollback().success(function() {
                                            res.json({status:'error'});
                                        })
                                        console.log(errors);
                                    })

                                })
                            })

                        })
                    })
                })
                .error(function(err){
                    t.rollback().success(function() {
                        res.json({status:'error'});
                    })
                    console.log(err);
                })



            t.done(function() {})
       })
    },

    checkFA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;
        db.HeaderFA.find({where:{PATIENT_ID:Patient_Id,CAL_ID : CalId}})
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    res.json(data);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    checkRating : function(req,res){
        var gender = req.body.gender;
        var age = req.body.age;
        var value = req.body.value;
        var id = req.body.id;
        db.sequelize.query("SELECT r.`RATE`, r.`VALUE` FROM `sys_rankings` r WHERE r.`HEADER_ID`=? AND r.`FROM_AGE` <= ? AND" +
            " r.`TO_AGE` >= ? AND r.`FROM_VALUE` <= ? AND r.`TO_VALUE` >= ? AND r.`GENDER` =  ?;",null,{raw:true},[id,age,age,value,value,gender])
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    res.json(data);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);

            })
    }
};





