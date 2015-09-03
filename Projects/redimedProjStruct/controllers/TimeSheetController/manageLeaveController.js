//EXPORTS MODEL
var db = require('../../models');
var moment = require('moment');
var functionForTimesheet = require('./functionForTimesheet');
module.exports = {
    /*
    ApproveLeave: approve Leave form for employee, if Leave form non-standard and approver level 1
    then send Leave form to approver level 2
    input: information of Leave form
    output: 1. Leave form  non-standard, approver level 1: 
                    - send Leave form to approver level 2
            2 else: - success: send confirmation notification and message success
                    - fail: send message error
    */
    ApproveLeave: function(req, res) {
        var info = req.body.info;
        var dateApprove = moment().format('YYYY-MM-DD h:mm:ss');
        var infoTracKer = {
            leaveID: info.leaveID,
            statusID: 3,
            userID: info.userID,
            creationDate: moment().format("YYYY-MM-DD h:mm:ss")
        };
        //get information approver
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
                    //approver is director
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

                            //tracker
                            functionForTimesheet.TracKerLeave(infoTracKer);

                            //send mail
                            sendMailInfo = {
                                leaveID: info.leaveID,
                                status: 3
                            };

                            functionForTimesheet.SendMailApprovedLeave(req, res, sendMailInfo);

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
                } else {
                    //approver is head of dept.
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
                                //non-standard
                                if (resultInfoLeave[0].standard === 0) {
                                    //Leave form is approved by approver level 1
                                    if (resultInfoLeave[0].is_approve_first === 0 &&
                                        resultInfoLeave[0].is_approve_second === 1) {
                                        db.HrLeave.update({
                                                status_id: 3,
                                                status_id_first: 3,
                                                status_id_second: 3,
                                                date_approve: dateApprove
                                            }, {
                                                leave_id: info.leaveID
                                            })
                                            .success(function(result) {

                                                //tracker
                                                functionForTimesheet.TracKerLeave(infoTracKer);

                                                //sen mail
                                                sendMailInfo = {
                                                    leaveID: info.leaveID,
                                                    status: 3
                                                };

                                                functionForTimesheet.SendMailApprovedLeave(req, res, sendMailInfo);

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
                                        //approver level 1
                                    } else if (resultInfoLeave[0].is_approve_first === 1 &&
                                        resultInfoLeave[0].is_approve_second === 0) {
                                        //check approver is head of dept. ?
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
                                                    //approver level 1 completed, watting approver level 2
                                                    db.HrLeave.update({
                                                            is_approve_first: 0,
                                                            is_approve_second: 1,
                                                            status_id_first: 3
                                                        }, {
                                                            leave_id: info.leaveID
                                                        })
                                                        .success(function(result) {
                                                            //tracker
                                                            functionForTimesheet.TracKerLeave(infoTracKer);

                                                            //get node id of Director
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
                                                                        //get node id for approver
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
                                                                                    //get information for approver
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
                                                                                            if (resultInfoManage !== undefined &&
                                                                                                resultInfoManage !== null &&
                                                                                                resultInfoManage.length !== 0 &&
                                                                                                resultInfoManage[0] !== undefined &&
                                                                                                resultInfoManage[0] !== null &&
                                                                                                resultInfoManage[0].length !== 0) {
                                                                                                //send mail
                                                                                                var sendMailInfo = {
                                                                                                    userId: resultInfoManage[0].USER_ID,
                                                                                                    dateSubmit: new Date(),
                                                                                                    leaveID: info.leaveID
                                                                                                };
                                                                                                functionForTimesheet.SendMailSubmitLeaveAgain(req, res, sendMailInfo);
                                                                                            }
                                                                                        })
                                                                                        .error(function(err) {
                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                            res.json({
                                                                                                status: "error"
                                                                                            });
                                                                                        });
                                                                                } else {
                                                                                    //send mail
                                                                                    sendMailInfo = {
                                                                                        leaveID: info.leaveID,
                                                                                        status: 3
                                                                                    };
                                                                                    functionForTimesheet.SendMailApprovedLeave(req, res, sendMailInfo);
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
                                                } else {
                                                    //approve completed
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

                                                            //tracker
                                                            functionForTimesheet.TracKerLeave(infoTracKer);

                                                            //send mail
                                                            sendMailInfo = {
                                                                leaveID: info.leaveID,
                                                                status: 3
                                                            };
                                                            functionForTimesheet.SendMailApprovedLeave(req, res, sendMailInfo);
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
                                    //standard:
                                } else if (resultInfoLeave[0].standard === 1) {
                                    //approve completed
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

                                            //tracker
                                            functionForTimesheet.TracKerLeave(infoTracKer);

                                            //send mail
                                            sendMailInfo = {
                                                leaveID: info.leaveID,
                                                status: 3
                                            };
                                            functionForTimesheet.SendMailApprovedLeave(req, res, sendMailInfo);
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
                                }
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

    /*
    RejectLeave: send mail for employee when approver rejected a Leave form
    input: information Leave form
    output: - success: 1. if Leave form is non-standard and approver level 2 then: send confirmation
                          notification for approver leave 1, employee and send message success
                       2. else: send confirmation notification for employee and send message success
            - fail: send message error
    */
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
            .success(function(result) {

                //tracker Leave form
                var infoTracKer = {
                    leaveID: info.leaveID,
                    userID: info.userID,
                    creationDate: moment().format("YYYY-MM-DD h:mm:ss"),
                    statusID: 4
                };
                functionForTimesheet.TracKerLeave(infoTracKer);

                //send mail Leave form
                var infoSendMail = {
                    status: 4,
                    leaveID: info.leaveID,
                    userID: info.userID
                };

                functionForTimesheet.SendMailRejectedLeave(req, res, infoSendMail);

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
    },
};
