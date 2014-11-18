/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');

module.exports = {
    loadMH: function (req, res) {
        /**
         * load cln table
         */
        var info = req.body.info;
        var PATIENT_ID = info.PATIENT_ID;
        var CAL_ID = info.CAL_ID;
//        var patient_id = req.body.id.patient_id;
        db.headersMHCLN.findAll({where: { PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
            .success(function (dataH) {
                db.groupsMHCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                    .success(function (dataG) {
                        db.linesMHCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                            .success(function (dataL) {
                                db.subquestionsMHCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                                    .success(function (dataS) {
                                        if (dataH.length == 0 || dataG.length == 0 || dataL.length == 0 || dataS.length == 0) {
                                            // find null
                                            //load in sys table
                                            db.headersMHSYS.findAll({}, {raw: true})
                                                .success(function (dataH) {
                                                    db.groupsMHSYS.findAll({}, {raw: true})
                                                        .success(function (dataG) {
                                                            db.linesMHSYS.findAll({}, {raw: true})
                                                                .success(function (dataL) {
                                                                    db.subquestionsMHSYS.findAll({}, {raw: true})
                                                                        .success(function (dataS) {
                                                                            var data = [
                                                                                {"headers": dataH, "groups": dataG, "lines": dataL, "subquestions": dataS, "status": "findNull"}
                                                                            ];
                                                                            res.json(data);
                                                                        })
                                                                        .error(function (err) {
                                                                            console.log("ERROR:" + err);
                                                                            res.json({status: "fail"});
                                                                        });
                                                                })
                                                                .error(function (err) {
                                                                    console.log("ERROR:" + err);
                                                                    res.json({status: 'fail' })
                                                                });
                                                        })
                                                        .error(function (err) {
                                                            console.log("ERROR:" + err);
                                                            res.json({status: 'fail'});
                                                        });
                                                })
                                                .error(function (err) {
                                                    console.log("ERROR:" + err);
                                                    res.json({status: 'fail'});
                                                })

                                        }
                                        else {
                                            // find found
                                            var data = [
                                                {"headers": dataH, "groups": dataG, "lines": dataL, "subquestions": dataS, "status": "findFound"}
                                            ];
                                            res.json(data);
                                        }
                                    })
                                    .error(function (err) {
                                        console.log("ERROR:" + err);
                                        res.json({status: 'fail'});
                                    })
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            })
                    })
                    .error(function (err) {
                        console.log("ERROR:" + err);
                        res.json({status: 'fail'});
                    })
            })
            .error(function (err) {
                console.log("ERROR:" + err);
                res.json({status: "fail"});
            });
    },
    insertMH: function (req, res) {
        var info = req.body.info;
        var Sign = info.Sign;
        var Date = info.Date;
        var Declaration_sign = info.Declaration_sign;
        var Declaration_witness_sign = info.Declaration_witness_sign;
        var Statement_sign = info.Statement_sign;
        var Statement_Date = info.Statement_Date;
        info.headers.forEach(function (infoH, hIndex) {
            //insert headers
            db.headersMHCLN.create({
                PATIENT_ID: infoH.PATIENT_ID,
                CAL_ID: infoH.CAL_ID,
                MH_DF_ID: infoH.MH_DF_ID,
                DF_CODE: infoH.DF_CODE,
                DESCRIPTION: infoH.DESCRIPTION,
                ISENABLE: infoH.ISENABLE,
                CREATED_BY: infoH.CREATED_BY,
                Last_updated_by: infoH.Last_updated_by,
                Sign: Sign,
                Date: Date,                                                               //edit
                Release_of_medical_info_sign: infoH.Release_of_medical_info_sign,
                Release_of_medical_info_witness_sign: infoH.Release_of_medical_info_witness_sign,
                Declaration_sign: Declaration_sign,
                Declaration_witness_sign: Declaration_witness_sign,
                Statement_sign: Statement_sign,
                Statement_Date: Statement_Date                                                   //edit

            }, {raw: true})
                .success(function () {
                    info.headers[hIndex].group.forEach(function (infoG, gIndex) {
                        //insert groups
                        db.groupsMHCLN.create({
                            PATIENT_ID: infoG.PATIENT_ID,
                            CAL_ID: infoG.CAL_ID,

                            GROUP_ID: infoG.GROUP_ID,

                            MH_DF_ID: infoG.MH_DF_ID,
                            ORD: infoG.ORD,
                            GROUP_NAME: infoG.GROUP_NAME,
                            ISENABLE: infoG.ISENABLE,
                            CREATED_BY: infoG.CREATED_BY,
                            Last_updated_by: infoG.Last_updated_by,
                            USER_TYPE: infoG.USER_TYPE
                        }, {raw: true})
                            .success(function () {
                                //insert lines
                                info.headers[hIndex].group[gIndex].line.forEach(function (infoL, lIndex) {
                                    db.linesMHCLN.create({
                                        PATIENT_ID: infoL.PATIENT_ID,
                                        CAL_ID: infoL.CAL_ID,

                                        MH_LINE_ID: infoL.MH_LINE_ID,

                                        GROUP_ID: infoL.GROUP_ID,
                                        MH_DF_ID: infoL.MH_DF_ID,
                                        ORD: infoL.ORD,
                                        QUESTION: infoL.QUESTION,
                                        YES_NO: infoL.YES_NO,
                                        ISCOMMENT_WHEN_YES: infoL.ISCOMMENT_WHEN_YES,
                                        ISCOMMENT_WHEN_NO: infoL.ISCOMMENT_WHEN_NO,
                                        Comments: infoL.Comments,
                                        ISDETAILS_ANSWER_ONLY: infoL.ISDETAILS_ANSWER_ONLY,
                                        ISENABLE: infoL.ISENABLE,
                                        CREATED_BY: infoL.CREATED_BY,
                                        Last_updated_by: infoL.Last_updated_by,
                                        ISDetails_Answer_IfYes: infoL.ISDetails_Answer_IfYes
                                    }, {raw: true})
                                        .success(function () {
                                            //insert subquestions
                                            info.headers[hIndex].group[gIndex].line[lIndex].subquestion.forEach(function (infoS, sIndex) {
                                                db.subquestionsMHCLN.create({
                                                    PATIENT_ID: infoS.PATIENT_ID,
                                                    CAL_ID: infoS.CAL_ID,

                                                    MH_LINE_SUB_ID: infoS.MH_LINE_SUB_ID,

                                                    MH_LINE_ID: infoS.MH_LINE_ID,
                                                    ORD: infoS.ORD,
                                                    QUESTION: infoS.QUESTION,
                                                    YES_NO: infoS.YES_NO,
                                                    ISCOMMENT_WHEN_YES: infoS.ISCOMMENT_WHEN_YES,
                                                    ISCOMMENT_WHEN_NO: infoS.ISCOMMENT_WHEN_NO,
                                                    Comments: infoS.Comments,
                                                    ISENABLE: infoS.ISENABLE,
                                                    CREATED_BY: infoS.CREATED_BY,
                                                    Last_updated_by: infoS.Last_updated_by
                                                })
                                                    .success(function () {
                                                        //check finish insert
                                                        res.json({status: 'success'});
                                                    })
                                                    .error(function (err) {
                                                        console.log("ERROR:" + err);
                                                        res.json({status: 'fail'});
                                                    })
                                            })
                                        })
                                        .error(function (err) {
                                            console.log("ERROR:" + err);
                                            res.json({status: 'fail'});
                                        })
                                })
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                            })
                    })
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                })
        })
    },
    editMH: function (req, res) {
        var info = req.body.info;
        var Sign = info.Sign;
        var Date = info.Date;
        var Declaration_sign = info.Declaration_sign;
        var Declaration_witness_sign = info.Declaration_witness_sign;
        var Statement_sign = info.Statement_sign;
        var Statement_Date = info.Statement_Date;
        info.headers.forEach(function (infoH, hIndex) {
            //insert headers
            db.headersMHCLN.update({
                DF_CODE: infoH.DF_CODE,
                DESCRIPTION: infoH.DESCRIPTION,
                ISENABLE: infoH.ISENABLE,
                CREATED_BY: infoH.CREATED_BY,
                Last_updated_by: infoH.Last_updated_by,
                Sign: Sign,
                Date: Date,                                                               //edit
                Release_of_medical_info_sign: infoH.Release_of_medical_info_sign,
                Release_of_medical_info_witness_sign: infoH.Release_of_medical_info_witness_sign,
                Declaration_sign: Declaration_sign,
                Declaration_witness_sign: Declaration_witness_sign,
                Statement_sign: Statement_sign,
                Statement_Date: Statement_Date                                                      //edit

            }, {PATIENT_ID: infoH.PATIENT_ID, CAL_ID: infoH.CAL_ID, MH_DF_ID: infoH.MH_DF_ID})
                .success(function () {
                    info.headers[hIndex].group.forEach(function (infoG, gIndex) {
                        //update groups
                        db.groupsMHCLN.update({
                            MH_DF_ID: infoG.MH_DF_ID,
                            ORD: infoG.ORD,
                            GROUP_NAME: infoG.GROUP_NAME,
                            ISENABLE: infoG.ISENABLE,
                            CREATED_BY: infoG.CREATED_BY,
                            Last_updated_by: infoG.Last_updated_by,
                            USER_TYPE: infoG.USER_TYPE
                        }, {PATIENT_ID: infoG.PATIENT_ID, CAL_ID: infoG.CAL_ID, GROUP_ID: infoG.GROUP_ID})
                            .success(function () {
                                //update lines
                                info.headers[hIndex].group[gIndex].line.forEach(function (infoL, lIndex) {
                                    db.linesMHCLN.update({
                                        GROUP_ID: infoL.GROUP_ID,
                                        MH_DF_ID: infoL.MH_DF_ID,
                                        ORD: infoL.ORD,
                                        QUESTION: infoL.QUESTION,
                                        YES_NO: infoL.YES_NO,
                                        ISCOMMENT_WHEN_YES: infoL.ISCOMMENT_WHEN_YES,
                                        ISCOMMENT_WHEN_NO: infoL.ISCOMMENT_WHEN_NO,
                                        Comments: infoL.Comments,
                                        ISDETAILS_ANSWER_ONLY: infoL.ISDETAILS_ANSWER_ONLY,
                                        ISENABLE: infoL.ISENABLE,
                                        CREATED_BY: infoL.CREATED_BY,
                                        Last_updated_by: infoL.Last_updated_by,
                                        ISDetails_Answer_IfYes: infoL.ISDetails_Answer_IfYes
                                    }, {PATIENT_ID: infoL.PATIENT_ID, CAL_ID: infoL.CAL_ID, MH_LINE_ID: infoL.MH_LINE_ID})
                                        .success(function () {
                                            //update subquestions
                                            info.headers[hIndex].group[gIndex].line[lIndex].subquestion.forEach(function (infoS, sIndex) {
                                                db.subquestionsMHCLN.update({
                                                    MH_LINE_ID: infoS.MH_LINE_ID,
                                                    ORD: infoS.ORD,
                                                    QUESTION: infoS.QUESTION,
                                                    YES_NO: infoS.YES_NO,
                                                    ISCOMMENT_WHEN_YES: infoS.ISCOMMENT_WHEN_YES,
                                                    ISCOMMENT_WHEN_NO: infoS.ISCOMMENT_WHEN_NO,
                                                    Comments: infoS.Comments,
                                                    ISENABLE: infoS.ISENABLE,
                                                    CREATED_BY: infoS.CREATED_BY,
                                                    Last_updated_by: infoS.Last_updated_by
                                                }, {
                                                    PATIENT_ID: infoS.PATIENT_ID, CAL_ID: infoS.CAL_ID,
                                                    MH_LINE_SUB_ID: infoS.MH_LINE_SUB_ID
                                                })
                                                    .success(function (r) {
                                                        console.log("sasa" + r);
                                                        //check finish insert
                                                        res.json({status: 'success'});
                                                    })
                                                    .error(function (err) {
                                                        console.log("ERROR:" + err);
                                                        res.json({status: 'fail'});
                                                        return false;
                                                    })
                                            })
                                        })
                                        .error(function (err) {
                                            console.log("ERROR:" + err);
                                            res.json({status: 'fail'});
                                            return false;
                                        })
                                })
                            })
                            .error(function (err) {
                                console.log("ERROR:" + err);
                                res.json({status: 'fail'});
                                return false;
                            })
                    })
                })
                .error(function (err) {
                    console.log("ERROR:" + err);
                    res.json({status: 'fail'});
                    return false;
                })
        })
    }
}