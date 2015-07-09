//EXPORTS MODEL
var db = require('../../models');
var moment = require('moment');
var functionForTimesheet = require('./functionForTimesheet');
//END EXPORTS
module.exports = {
    // APPROVE LEAVE
    ApproveLeave: function(req, res) {
        var info = req.body.info;
        var dateApprove = moment().format('YYYY-MM-DD h:mm:ss');
        var infoTracKer = {
            leaveID: info.leaveID,
            statusID: 3,
            userID: info.userID,
            creationDate: moment().format("YYYY-MM-DD h:mm:ss")
        };
        //CHECK USER APPROVE
        var queryGetInfoUserApprove = "SELECT hr_employee.TITLE " + //SELECT
            "FROM hr_employee " + //FROM
            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "WHERE users.id = :userId";
        db.sequelize.query(queryGetInfoUserApprove, null, {
                raw: true
            }, {
                userId: info.userID
            })
            .success(function(resultInfoUserApprove) {
                if (resultInfoUserApprove !== undefined &&
                    resultInfoUserApprove !== null &&
                    resultInfoUserApprove[0] !== undefined &&
                    resultInfoUserApprove[0] !== null &&
                    resultInfoUserApprove[0].TITLE === "Director") {
                    //APPROVE FOR DIRECTOR
                    //APPROVE COMPLETE
                    db.HrLeave.update({
                            status_id: 3,
                            is_approve_first: 0,
                            is_approve_second: 1,
                            status_id_first: 3,
                            status_id_second: 3,
                            date_approve: dateApprove
                        }, {
                            leave_id: info.leaveID
                        })
                        .success(function(result) {

                            //TRACKER LEAVE
                            functionForTimesheet.TracKerLeave(infoTracKer);
                            //END TRACKER

                            //SEND MAIL
                            sendMailInfo = {
                                leaveID: info.leaveID,
                                status: 3
                            };
                            functionForTimesheet.sendMailLeave(req, res, sendMailInfo);
                            //END SEND MAIL

                            res.json({
                                status: "success"
                            });
                            return;
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "success"
                            });
                            return;
                        });
                    //END APPROVE FOR DIRECTOR
                }
                //END CHECK
                else {
                    //APPROVE FOR HEAD OF DEPT.
                    var queryGetInfoLeave =
                        "SELECT hr_leave.leave_id, hr_leave.standard, hr_leave.is_approve_first, " + //SELECT
                        "hr_leave.is_approve_second, hr_leave.status_id_first, hr_leave.status_id_second " + //SELECT
                        "FROM hr_leave " + //FROM
                        "WHERE hr_leave.leave_id = :leaveID"; //WHERE
                    db.sequelize.query(queryGetInfoLeave, null, {
                            raw: true
                        }, {
                            leaveID: info.leaveID
                        })
                        .success(function(resultInfoLeave) {
                            if (resultInfoLeave !== undefined &&
                                resultInfoLeave !== null &&
                                resultInfoLeave[0] !== undefined &&
                                resultInfoLeave[0] !== null) {
                                //CHECK STANDARD
                                if (resultInfoLeave[0].standard === 0) {
                                    if (resultInfoLeave[0].is_approve_first === 0 &&
                                        resultInfoLeave[0].is_approve_second === 1) {

                                        //APPROVE COMPLETE
                                        db.HrLeave.update({
                                                status_id: 3,
                                                status_id_first: 3,
                                                status_id_second: 3,
                                                date_approve: dateApprove
                                            }, {
                                                leave_id: info.leaveID
                                            })
                                            .success(function(result) {

                                                //TRACKER LEAVE
                                                functionForTimesheet.TracKerLeave(infoTracKer);
                                                //END TRACKER

                                                //SEND MAIL
                                                sendMailInfo = {
                                                    leaveID: info.leaveID,
                                                    status: 3
                                                };
                                                functionForTimesheet.sendMailLeave(req, res, sendMailInfo);
                                                //END SEND MAIL

                                                res.json({
                                                    status: "success"
                                                });
                                                return;
                                            })
                                            .error(function(err) {
                                                console.log("*****ERROR:" + err + "*****");
                                                res.json({
                                                    status: "success"
                                                });
                                                return;
                                            });
                                        //END APPROVE
                                    } else if (resultInfoLeave[0].is_approve_first === 1 &&
                                        resultInfoLeave[0].is_approve_second === 0) {
                                        var queryCheckHeadOfDept =
                                            "SElECT sys_hierarchy_nodes.NODE_ID " + //SELECT
                                            "FROM sys_hierarchy_nodes " + //FROM
                                            "INNER JOIN sys_hierarchies_users ON sys_hierarchy_nodes.TO_NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                            "WHERE sys_hierarchies_users.USER_ID = :userID"; //WHERE
                                        db.sequelize.query(queryCheckHeadOfDept, null, {
                                                raw: true
                                            }, {
                                                userID: info.userID
                                            })
                                            .success(function(resultCheckHeadOfDept) {
                                                if (resultCheckHeadOfDept !== undefined &&
                                                    resultCheckHeadOfDept !== null &&
                                                    resultCheckHeadOfDept.length !== 0 &&
                                                    resultCheckHeadOfDept[0] !== undefined &&
                                                    resultCheckHeadOfDept[0] !== null &&
                                                    !isNaN(resultCheckHeadOfDept[0].NODE_ID)) {
                                                    //APPROVE FIRST AND WAITTING SECOND
                                                    db.HrLeave.update({
                                                            is_approve_first: 0,
                                                            is_approve_second: 1,
                                                            status_id_first: 3
                                                        }, {
                                                            leave_id: info.leaveID
                                                        })
                                                        .success(function(result) {

                                                            //TRACKER LEAVE
                                                            functionForTimesheet.TracKerLeave(infoTracKer);
                                                            //END TRACKER

                                                            //SEND MAIL

                                                            //GET NODE_ID DIRECTOR
                                                            var queryGetNodeID =
                                                                "SELECT DISTINCT sys_hierarchy_nodes.NODE_ID " + //SELECT
                                                                "FROM sys_hierarchy_nodes " + //FROM
                                                                "INNER JOIN sys_hierarchy_group ON sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID " + //JOIN
                                                                "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
                                                                "WHERE sys_hierarchies_users.USER_ID = :userID AND sys_hierarchy_group.GROUP_TYPE = 'Time Sheet'"; //WHERE
                                                            db.sequelize.query(queryGetNodeID, null, {
                                                                    raw: true
                                                                }, {
                                                                    userID: info.userID
                                                                })
                                                                .success(function(resultNodeId) {
                                                                    if (resultNodeId !== undefined &&
                                                                        resultNodeId !== null &&
                                                                        resultNodeId.length !== 0 &&
                                                                        resultNodeId[0] !== undefined &&
                                                                        resultNodeId[0] !== null &&
                                                                        !isNaN(resultNodeId[0].NODE_ID)) {
                                                                        var queryGetNodeIdManage =
                                                                            "SELECT DISTINCT sys_hierarchy_nodes.NODE_ID " + //SELECT
                                                                            "FROM sys_hierarchy_nodes " + //FROM
                                                                            "INNER JOIN sys_hierarchies_users ON sys_hierarchy_nodes.TO_NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                                            "WHERE sys_hierarchy_nodes.NODE_ID = :nodeId"; //WHERE
                                                                        db.sequelize.query(queryGetNodeIdManage, null, {
                                                                                raw: true
                                                                            }, {
                                                                                nodeId: resultNodeId[0].NODE_ID
                                                                            })
                                                                            .success(function(resultNodeIdManage) {
                                                                                if (resultNodeIdManage !== undefined &&
                                                                                    resultNodeIdManage !== null &&
                                                                                    resultNodeIdManage.length !== 0 &&
                                                                                    resultNodeIdManage[0] !== undefined &&
                                                                                    resultNodeIdManage[0] !== null &&
                                                                                    !isNaN(resultNodeIdManage[0].NODE_ID)) {
                                                                                    //GET INFOMATION MANAGE
                                                                                    var queryGetInfoManage =
                                                                                        "SELECT sys_hierarchies_users.USER_ID " + //SELECT
                                                                                        "FROM sys_hierarchies_users " + //FROM
                                                                                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID " + //JOIN
                                                                                        "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId"; //WHERE
                                                                                    db.sequelize.query(queryGetInfoManage, null, {
                                                                                            raw: true
                                                                                        }, {
                                                                                            nodeId: resultNodeIdManage[0].NODE_ID
                                                                                        })
                                                                                        .success(function(resultInfoManage) {
                                                                                            //NOTIFICATION SUBMIT LEAVE
                                                                                            if (resultInfoManage !== undefined &&
                                                                                                resultInfoManage !== null &&
                                                                                                resultInfoManage.length !== 0 &&
                                                                                                resultInfoManage[0] !== undefined &&
                                                                                                resultInfoManage[0] !== null &&
                                                                                                resultInfoManage[0].length !== 0) {
                                                                                                //SEND MAIL
                                                                                                var sendMailInfo = {
                                                                                                    userId: resultInfoManage[0].USER_ID,
                                                                                                    dateSubmit: new Date(),
                                                                                                    leaveID: info.leaveID
                                                                                                };
                                                                                                functionForTimesheet.sendMailSubmitLeaveAgain(req, res, sendMailInfo);
                                                                                                //END SEND MAIL
                                                                                            }
                                                                                        })
                                                                                        .error(function(err) {
                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                            res.json({
                                                                                                status: "error"
                                                                                            });
                                                                                        });
                                                                                    //END GET
                                                                                } else {
                                                                                    //NOTIFICATION APPROVE FOR EMPLOYEE
                                                                                    //SEND MAIL
                                                                                    sendMailInfo = {
                                                                                        leaveID: info.leaveID,
                                                                                        status: 3
                                                                                    };
                                                                                    functionForTimesheet.sendMailLeave(req, res, sendMailInfo);
                                                                                    //END SEND MAIL
                                                                                }
                                                                            })
                                                                            .error(function(err) {
                                                                                console.log("*****ERRROR:" + err + "*****");
                                                                                res.json({
                                                                                    status: "error"
                                                                                });
                                                                            });
                                                                    } else {
                                                                        res.json({
                                                                            status: "error"
                                                                        });
                                                                        return;
                                                                    }
                                                                })
                                                                .error(function(err) {
                                                                    console.log("*****ERROR:" + err + "*****");
                                                                    res.json({
                                                                        status: "error"
                                                                    });
                                                                    return;
                                                                });
                                                            //END

                                                            //END SEND MAIL

                                                            res.json({
                                                                status: "success"
                                                            });
                                                            return;
                                                        })
                                                        .error(function(err) {
                                                            console.log("*****ERROR:" + err + "*****");
                                                            res.json({
                                                                status: "error"
                                                            });
                                                            return;
                                                        });
                                                    //END APPROVE FIRST
                                                } else {
                                                    //APPROVE COMPLETE
                                                    db.HrLeave.update({
                                                            status_id: 3,
                                                            is_approve_first: 0,
                                                            is_approve_second: 1,
                                                            status_id_first: 3,
                                                            status_id_second: 3,
                                                            date_approve: dateApprove
                                                        }, {
                                                            leave_id: info.leaveID
                                                        })
                                                        .success(function(result) {

                                                            //TRACKER LEAVE
                                                            functionForTimesheet.TracKerLeave(infoTracKer);
                                                            //END TRACKER

                                                            //SEND MAIL
                                                            sendMailInfo = {
                                                                leaveID: info.leaveID,
                                                                status: 3
                                                            };
                                                            functionForTimesheet.sendMailLeave(req, res, sendMailInfo);
                                                            //END SEND MAIL

                                                            res.json({
                                                                status: "success"
                                                            });
                                                            return;
                                                        })
                                                        .error(function(err) {
                                                            console.log("*****ERROR:" + err + "*****");
                                                            res.json({
                                                                status: "success"
                                                            });
                                                            return;
                                                        });
                                                    //END APPROVE
                                                }
                                            })
                                            .error(function(err) {
                                                console.log("*****ERROR:" + err + "*****");
                                                res.json({
                                                    status: "error"
                                                });
                                                return;
                                            });
                                    }

                                } else if (resultInfoLeave[0].standard === 1) {
                                    //APPROVE COMPLETE
                                    db.HrLeave.update({
                                            status_id: 3,
                                            is_approve_first: 0,
                                            is_approve_second: 1,
                                            status_id_first: 3,
                                            status_id_second: 3,
                                            date_approve: dateApprove
                                        }, {
                                            leave_id: info.leaveID
                                        })
                                        .success(function(result) {

                                            //TRACKER LEAVE
                                            functionForTimesheet.TracKerLeave(infoTracKer);
                                            //END TRACKER

                                            //SEND MAIL
                                            sendMailInfo = {
                                                leaveID: info.leaveID,
                                                status: 3
                                            };
                                            functionForTimesheet.sendMailLeave(req, res, sendMailInfo);
                                            //END SEND MAIL

                                            res.json({
                                                status: "success"
                                            });
                                            return;
                                        })
                                        .error(function(err) {
                                            console.log("*****ERROR:" + err + "*****");
                                            res.json({
                                                status: "success"
                                            });
                                            return;
                                        });
                                    //end approve
                                }
                                //end
                            } else {
                                res.json({
                                    status: "error"
                                });
                                return;
                            }
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                result: []
                            });
                        });
                    //END APPROVE FOR HEAD OF DEPT.
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },
    //END APPROVE

    //REJECT LEAVE
    RejectLeave: function(req, res) {
        var info = req.body.info;
        db.HrLeave.update({
                status_id: 4,
                is_approve_first: 1,
                is_approve_second: 0,
                status_id_first: 4,
                status_id_second: null,
                comments: info.comments,
                is_reject: 1

            }, {
                leave_id: info.leaveID
            })
            //SUCCESS
            .success(function(result) {

                //TRACKER LEAVE
                var infoTracKer = {
                    leaveID: info.leaveID,
                    userID: info.userID,
                    creationDate: moment().format("YYYY-MM-DD h:mm:ss"),
                    statusID: 4
                };
                functionForTimesheet.TracKerLeave(infoTracKer);
                //END TRACKER

                //SEND MAIL
                var infoSendMail = {
                    status: 4,
                    leaveID: info.leaveID,
                    userID: info.userID
                };
                functionForTimesheet.sendMailLeave(req, res, infoSendMail);
                //END SEND MAIL

                // GET STATUS SUCCESS REJECT
                res.json({
                    status: "success"
                });
                return;
                //END GET 
            })
            //END SUCCESS

        //ERROR
        .error(function(err) {
            console.log("*****ERROR:" + err + "*****");
            res.json({
                status: "error"
            });
            return;
        });
        //END ERROR
    },
    //END REJECT
};
