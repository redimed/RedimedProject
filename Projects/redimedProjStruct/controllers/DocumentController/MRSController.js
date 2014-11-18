/**
 * Created by thanh on 10/8/2014.
 */
var db = require('../../models');
module.exports = {
    loadMRS: function (req, res) {
        var info = req.body.info;
        var PATIENT_ID = info.PATIENT_ID;
        var CAL_ID = info.CAL_ID;
        /**
         * search in cln table
         */
        db.headersMRSCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
            .success(function (dataH) {
                db.groupsMRSCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                    .success(function (dataG) {
                        db.linesMRSCLN.findAll({where: {PATIENT_ID: PATIENT_ID, CAL_ID: CAL_ID}}, {raw: true})
                            .success(function (dataL) {
                                if (dataH.length == 0 || dataG.length == 0 || dataL.length == 0) {
                                    //find null
                                    /**
                                     * select in sys table
                                     */
                                    db.headersMRSSYS.findAll({}, {raw: true})
                                        .success(function (dataH) {
                                            db.groupsMRSSYS.findAll({}, {raw: true})
                                                .success(function (dataG) {
                                                    db.linesMRSSYS.findAll({}, {raw: true})
                                                        .success(function (dataL) {
                                                            var data = [
                                                                {"headers": dataH, "groups": dataG, "lines": dataL, "status": "findNull"}
                                                            ];
                                                            res.json(data);
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
                                }
                                else {
                                    var data = [
                                        {"headers": dataH, "groups": dataG, "lines": dataL, "status": 'findFound'}
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
    },
    insertMRS: function (req, res) {
        var info = req.body.info;
        var practitionSign = info.practitionSign;
        var practitionDate = info.practitionDate;
        var isReview = info.isReview;
        var practitioner = info.practitioner;

        info.headers.forEach(function (infoH, hIndex) {
            db.headersMRSCLN.create({
                MRS_DF_ID: infoH.MRS_DF_ID,
                PATIENT_ID: infoH.PATIENT_ID,
                CAL_ID: infoH.CAL_ID,
                DF_CODE: infoH.DF_CODE,
                ITEM_ID: infoH.ITEM_ID,
                DESCRIPTION: infoH.DESCRIPTION,
                ISENABLE: infoH.ISENABLE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                practitioner: practitioner,
                practitionSign: practitionSign,
                practitionDate: practitionDate,
                isReview: isReview
            }, {raw: true})
                .success(function () {
                    info.headers[hIndex].group.forEach(function (infoG, gIndex) {
                        db.groupsMRSCLN.create({
                            MRS_GROUP_ID: infoG.MRS_GROUP_ID,
                            MRS_DF_ID: infoG.MRS_DF_ID,
                            PATIENT_ID: infoG.PATIENT_ID,
                            CAL_ID: infoG.CAL_ID,
                            ORD: infoG.ORD,
                            GROUP_NAME: infoG.GROUP_NAME,
                            USER_TYPE: infoG.USER_TYPE,
                            ISENABLE: infoG.ISENABLE,
                            Created_by: infoG.Created_by,
                            Last_updated_by: infoG.Last_updated_by
                        }, {raw: true})
                            .success(function () {
                                info.headers[hIndex].group[gIndex].line.forEach(function (infoL, lIndex) {
                                    db.linesMRSCLN.create({
                                        MRS_LINE_ID: infoL.MRS_LINE_ID,
                                        MRS_GROUP_ID: infoL.MRS_GROUP_ID,
                                        MRS_DF_ID: infoL.MRS_DF_ID,
                                        PATIENT_ID: infoL.PATIENT_ID,
                                        CAL_ID: infoL.CAL_ID,
                                        ORD: infoL.ORD,
                                        COMP_TYPE: infoL.COMP_TYPE,
                                        QUEST_LABEL: infoL.QUEST_LABEL,
                                        QUEST_VALUE: infoL.QUEST_VALUE,
                                        ISCOMMENT: infoL.ISCOMMENT,
                                        COMMENT_LABEL: infoL.COMMENT_LABEL,
                                        comments: infoL.comments,
                                        ISREQ_COMMENT: infoL.ISREQ_COMMENT,
                                        ISENABLE: infoL.ISENABLE,
                                        Created_by: infoL.Created_by,
                                        Last_updated_by: infoL.Last_updated_by
                                    }, {raw: true})
                                        .success(function () {
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
    },
    editMRS: function (req, res) {
        var info = req.body.info;
        var practitionSign = info.practitionSign;
        var practitionDate = info.practitionDate;
        var practitioner = info.practitioner;
        var isReview = info.isReview;
        info.headers.forEach(function (infoH, hIndex) {
            db.headersMRSCLN.update({
                DF_CODE: infoH.DF_CODE,
                ITEM_ID: infoH.ITEM_ID,
                DESCRIPTION: infoH.DESCRIPTION,
                ISENABLE: infoH.ISENABLE,
                Created_by: infoH.Created_by,
                Last_updated_by: infoH.Last_updated_by,
                practitioner: practitioner,
                practitionSign: practitionSign,
                practitionDate: practitionDate,
                isReview: isReview
            }, { MRS_DF_ID: infoH.MRS_DF_ID, PATIENT_ID: infoH.PATIENT_ID, CAL_ID: infoH.CAL_ID})
                .success(function () {
                    info.headers[hIndex].group.forEach(function (infoG, gIndex) {
                        db.groupsMRSCLN.update({
                            MRS_DF_ID: infoG.MRS_DF_ID,
                            ORD: infoG.ORD,
                            GROUP_NAME: infoG.GROUP_NAME,
                            USER_TYPE: infoG.USER_TYPE,
                            ISENABLE: infoG.ISENABLE,
                            Created_by: infoG.Created_by,
                            Last_updated_by: infoG.Last_updated_by
                        }, {MRS_GROUP_ID: infoG.MRS_GROUP_ID, PATIENT_ID: infoG.PATIENT_ID, CAL_ID: infoG.CAL_ID})
                            .success(function () {
                                info.headers[hIndex].group[gIndex].line.forEach(function (infoL, lIndex) {
                                    db.linesMRSCLN.update({
                                        MRS_GROUP_ID: infoL.MRS_GROUP_ID,
                                        MRS_DF_ID: infoL.MRS_DF_ID,
                                        ORD: infoL.ORD,
                                        COMP_TYPE: infoL.COMP_TYPE,
                                        QUEST_LABEL: infoL.QUEST_LABEL,
                                        QUEST_VALUE: infoL.QUEST_VALUE,
                                        ISCOMMENT: infoL.ISCOMMENT,
                                        COMMENT_LABEL: infoL.COMMENT_LABEL,
                                        comments: infoL.comments,
                                        ISREQ_COMMENT: infoL.ISREQ_COMMENT,
                                        ISENABLE: infoL.ISENABLE,
                                        Created_by: infoL.Created_by,
                                        Last_updated_by: infoL.Last_updated_by
                                    }, {MRS_LINE_ID: infoL.MRS_LINE_ID, PATIENT_ID: infoL.PATIENT_ID,
                                        CAL_ID: infoL.CAL_ID})
                                        .success(function () {
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
    }
}