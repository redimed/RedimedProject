//EXPORTS MODEL
var db = require('../../models');
var chainer = new db.Sequelize.Utils.QueryChainer;
var moment = require('moment');
var Q = require("q");
var functionForTimesheet = require("./functionForTimesheet");
//END EXPORTS
module.exports = {
    /*
    LoadInfoEmployee: load information of employee
    input: id of user
    output: information employee
    */
    LoadInfoEmployee: function(req, res) {
        var USER_ID = req.body.USER_ID;
        //get information employee
        var queryGetInfoUser =
            "SELECT hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct, " + //SELECT
            "departments.departmentName " + //SELECT
            "FROM hr_employee " + //FROM
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
            "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " + //JOIN
            "WHERE users.id = ?"; //WHERE
        db.sequelize.query(queryGetInfoUser, null, {
                raw: true
            }, [USER_ID])
            .success(function(resultEmployee) {
                //get leave type
                var queryGetTypeLeave =
                    "SELECT hr_leave_type.leave_name, hr_leave_type.leave_type_id " + //SELECT
                    "FROM hr_leave_type"; //FROM
                db.sequelize.query(queryGetTypeLeave)
                    .success(function(resultTypeLeave) {
                        res.json({
                            status: "success",
                            resultEmployee: resultEmployee,
                            resultTypeLeave: resultTypeLeave
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
    CheckLeave: check exist Leave form
    input: id of user
    output: - confirm notification message if exist Leave form
    */
    CheckLeave: function(req, res) {
        var USER_ID = req.body.USER_ID;
        //get information Leave form
        var queryGetListTime =
            "SElECT hr_leave.start_date, hr_leave.finish_date, hr_leave.leave_id " + //SELECT
            "FROM hr_leave " + //FROM
            "WHERE hr_leave.user_id = :userId"; //WHERE
        db.sequelize.query(queryGetListTime, null, {
                raw: true
            }, {
                userId: USER_ID
            })
            .success(function(resultListTime) {
                res.json({
                    status: "success",
                    result: resultListTime
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
    /*
    UpLeaveServer: create new Leave form
    input: information new Leave form
    output: - success: confirmation notification  and success message
            - fail: send error message
    */
    UpLeaveServer: function(req, res) {
        var info = req.body.info;
        //add new Leave form with request data
        db.HrLeave.create({
                application_date: info.application_date,
                start_date: info.start_date,
                finish_date: info.finish_date,
                work_date: info.work_date,
                standard: info.standard,
                time_leave: info.time_leave_real,
                reason_leave: info.reason_leave,
                is_approve_first: 1,
                user_id: info.USER_ID,
                status_id: info.statusID,
                status_id_first: info.statusID,
                created_by: info.USER_ID
            })
            .success(function(result) {
                if (result !== undefined && result !== null &&
                    result !== undefined && result !== null &&
                    result.dataValues !== undefined && result.dataValues !== null &&
                    result.dataValues.leave_id !== undefined && result.dataValues.leave_id !== null) {
                    for (var i = 0; i < info.infoTypeLeave.length; i++) {
                        //add details to created Leave form
                        chainer.add(db.HrLeaveDetail.create({
                            leave_id: result.dataValues.leave_id,
                            leave_type_id: info.infoTypeLeave[i].leave_type_id,
                            time_leave: (info.infoTypeLeave[i].time_leave_real !== 0) ? info.infoTypeLeave[i].time_leave_real : null,
                            type_other: i === 4 ? info.infoTypeLeave[i].type_other : null,
                            reason_leave: info.infoTypeLeave[i].reason_leave,
                            created_by: info.USER_ID
                        }));
                    }
                }
                chainer.runSerially()
                    .success(function(resultAll) {
                        //tracker
                        var trackerInfo = {};

                        if (result !== undefined && result !== null &&
                            result.dataValues !== undefined && result.dataValues !== null &&
                            result.dataValues.leave_id !== undefined && result.dataValues.leave_id !== null) {
                            trackerInfo.leaveID = result.dataValues.leave_id;
                        }
                        trackerInfo.creationDate = moment().format("YYYY-MM-DD h:mm:ss");
                        trackerInfo.userID = info.USER_ID;
                        trackerInfo.statusID = info.statusID;
                        functionForTimesheet.TracKerLeave(trackerInfo);

                        if (info.statusID === 2 || info.statusID === 5) {
                            //send mail
                            var sendMailInfo = {
                                userID: trackerInfo.userID,
                                dateSubmit: trackerInfo.creationDate
                            };
                            functionForTimesheet.sendMailSubmitLeave(req, res, sendMailInfo);
                        }
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
    LoadHistoryLeave: load list history Leave form
    input: information search, order, pagination,...
    output: list Leave form
    */
    LoadHistoryLeave: function(req, res) {
        var searchObj = req.body.searchObj;
        //select
        var paramSelect = " AND ";
        for (var key in searchObj.select) {
            if (searchObj.select[key] !== undefined && searchObj.select[key] !== null && searchObj.select[key] !== "") {
                paramSelect += key + " = " + searchObj.select[key] + ", ";
            }
        }
        if (paramSelect.length !== 5) {
            paramSelect = paramSelect.substring(0, paramSelect.length - 2);
        } else {
            paramSelect = "";
        }

        //order
        var strOrder = " ORDER BY ";
        for (var keyOrder in searchObj.order) {
            if (searchObj.order[keyOrder] !== undefined && searchObj.order[keyOrder] !== null && searchObj.order[keyOrder] !== "") {
                strOrder += "hr_leave.start_date " + searchObj.order[keyOrder] + ", ";
            }
        }
        if (strOrder.length === 10) {
            strOrder = "";
        } else {
            strOrder = strOrder.substring(0, strOrder.length - 2);
        }
        //get my list Leave form
        var queryGetAllMyLeave =
            "SELECT hr_employee.FirstName, hr_employee.LastName, hr_leave.start_date, time_task_status.name, " + //SELECT
            "hr_leave.finish_date, hr_leave.standard, hr_leave.status_id, hr_leave.time_leave, hr_leave.is_approve_first, " + //SELECT
            "hr_leave.is_approve_second, hr_leave.comments, " + //SELECT
            "hr_leave.reason_leave, hr_leave.leave_id, hr_leave.application_date " + //SELECT
            "FROM hr_employee " + //FROM
            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " + //JOIN
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //JOIN
            "WHERE hr_leave.user_id = ? " + paramSelect + //WHERE
            strOrder + //ORDER
            " LIMIT ? " + //LIMIT
            "OFFSET ?"; //OFFSET
        //count my list Leave form
        var queryCountAllMyLeave =
            "SELECT COUNT(*) as COUNT " + //SELECT
            "FROM hr_employee " + //FROM
            "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " + //JOIN
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //JOIN
            "WHERE hr_leave.user_id = ? " + paramSelect + //WHERE
            " LIMIT ? " + //LIMIT
            "OFFSET ?"; //OFFSET
        //get list status for Leave form
        var queryStatus =
            "SELECT time_task_status.task_status_id, time_task_status.name " + //SELECT
            "FROM time_task_status"; //FROM

        db.sequelize.query(queryGetAllMyLeave, null, {
                raw: true
            }, [
                searchObj.USER_ID,
                searchObj.limit,
                searchObj.offset
            ])
            .success(function(result) {
                db.sequelize.query(queryStatus)
                    .success(function(resultStatus) {
                        db.sequelize.query(queryCountAllMyLeave, null, {
                                raw: true
                            }, [
                                searchObj.USER_ID,
                                searchObj.limit,
                                searchObj.offset
                            ])
                            .success(function(resultCount) {
                                if (result.length === 0 &&
                                    paramSelect === "") {
                                    res.json({
                                        status: "success",
                                        result: null,
                                        count: 0,
                                        resultStatus: resultStatus
                                    });
                                } else if (result !== undefined &&
                                    result !== null &&
                                    result.length !== 0) {

                                    var listLeaveId = "";
                                    result.forEach(function(element, index) {
                                        listLeaveId += element.leave_id + ", ";
                                    });
                                    if (listLeaveId === "") {
                                        listLeaveId = "(-1)";
                                    } else {
                                        listLeaveId = "(" + listLeaveId.substring(0, listLeaveId.length - 2) + ")";
                                    }
                                    //get node id approver level1
                                    var queryGetNodeIdLevel1 =
                                        "SElECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID, sys_hierarchy_nodes.NODE_CODE, sys_hierarchies_users.DEPARTMENT_CODE_ID " + //SELECT
                                        "FROM hr_leave " + //FROM
                                        "INNER JOIN users ON hr_leave.user_id = users.id " + //JOIN
                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                        "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND hr_leave.leave_id IN " + listLeaveId; //WHERE
                                    db.sequelize.query(queryGetNodeIdLevel1)
                                        .success(function(resultNodeIdLevel1) {
                                            if (resultNodeIdLevel1 !== undefined &&
                                                resultNodeIdLevel1 !== null &&
                                                resultNodeIdLevel1.length !== 0) {
                                                var listNodeLevel1 = "";
                                                resultNodeIdLevel1.forEach(function(elemLevel2, indexLevel2) {
                                                    listNodeLevel1 += elemLevel2.TO_NODE_ID + ", ";
                                                });
                                                if (listNodeLevel1 === "") {
                                                    listNodeLevel1 = "(-1)";
                                                } else {
                                                    listNodeLevel1 = "(" + listNodeLevel1.substring(0, listNodeLevel1.length - 2) + ")";
                                                }
                                                var queryAdd = "";
                                                if (resultNodeIdLevel1[0].NODE_CODE === 'Staff') {
                                                    queryAdd = " AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :deptId";
                                                }
                                                //get node id approver level 2
                                                var queryGetNodeIdLevel2 =
                                                    "SElECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " + //SELECT
                                                    "FROM sys_hierarchy_nodes " + //FROM
                                                    "INNER JOIN sys_hierarchies_users ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                    "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                                    "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID IN " + listNodeLevel1 + queryAdd; //WHERE
                                                db.sequelize.query(queryGetNodeIdLevel2, null, {
                                                        raw: true
                                                    }, {
                                                        deptId: resultNodeIdLevel1[0].DEPARTMENT_CODE_ID
                                                    })
                                                    .success(function(resultNodeLevel2) {
                                                        //GET INFO LEVEL 1 AND LEVEL 2
                                                        var queryAdd = "";
                                                        if (resultNodeIdLevel1[0].NODE_CODE === 'Staff') {
                                                            queryAdd = " AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :deptId";
                                                        }
                                                        //get information approver level 1
                                                        var queryGetInfoLevel1 =
                                                            "SElECT hr_employee.FirstName, hr_employee.LastName " + //SELECT
                                                            "FROM hr_employee " + //FROM
                                                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                                            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                                            "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                                            "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID IN " + listNodeLevel1 + queryAdd; //WHERE
                                                        db.sequelize.query(queryGetInfoLevel1, null, {
                                                                raw: true
                                                            }, {
                                                                deptId: resultNodeIdLevel1[0].DEPARTMENT_CODE_ID
                                                            })
                                                            .success(function(resultInfoLevel1) {
                                                                if (resultNodeLevel2 !== undefined &&
                                                                    resultNodeLevel2 !== null &&
                                                                    resultNodeLevel2.length !== 0 &&
                                                                    resultNodeLevel2[0].TO_NODE_ID !== null) {
                                                                    var listNodeLevel2 = "";
                                                                    resultNodeLevel2.forEach(function(elemLevel2, indexLevel2) {
                                                                        listNodeLevel2 += elemLevel2.TO_NODE_ID + ", ";
                                                                    });
                                                                    if (listNodeLevel2 === "") {
                                                                        listNodeLevel2 = "(-1)";
                                                                    } else {
                                                                        listNodeLevel2 = "(" + listNodeLevel2.substring(0, listNodeLevel2.length - 2) + ")";
                                                                    }
                                                                    //get information approver level 2
                                                                    var queryGetInfoLevel2 =
                                                                        "SElECT hr_employee.FirstName, hr_employee.LastName " + //SELECT
                                                                        "FROM hr_employee " + //FROM
                                                                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                                                        "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                                                        "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID IN " + listNodeLevel2; //WHERE
                                                                    db.sequelize.query(queryGetInfoLevel2)
                                                                        .success(function(resultInfoLevel2) {
                                                                            result.forEach(function(elemResult, indexResult) {
                                                                                if (elemResult.status_id === 1 || elemResult.status_id === 4) {
                                                                                    result[indexResult].person_charge = result[indexResult].FirstName + " " + result[indexResult].LastName;
                                                                                } else if ((elemResult.status_id === 2 || elemResult.status_id === 5) &&
                                                                                    elemResult.is_approve_first === 1 &&
                                                                                    elemResult.is_approve_second === 0) {
                                                                                    if (resultInfoLevel1 !== undefined &&
                                                                                        resultInfoLevel1 !== null &&
                                                                                        resultInfoLevel1.length !== 0) {
                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                    }

                                                                                } else {
                                                                                    if (resultInfoLevel2 !== undefined &&
                                                                                        resultInfoLevel2 !== null &&
                                                                                        resultInfoLevel2.length !== 0 &&
                                                                                        result[indexResult].standard === 0) {
                                                                                        result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                    } else if (resultInfoLevel1 !== undefined &&
                                                                                        resultInfoLevel1 !== null &&
                                                                                        resultInfoLevel1.length !== 0 &&
                                                                                        result[indexResult].standard === 1) {
                                                                                        result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                    }

                                                                                }
                                                                            });
                                                                            res.json({
                                                                                status: "success",
                                                                                result: result,
                                                                                count: resultCount[0].COUNT,
                                                                                resultStatus: resultStatus
                                                                            });
                                                                            return;
                                                                        })
                                                                        .error(function(err) {
                                                                            console.log("*****ERROR:" + err + "*****");
                                                                            res.json({
                                                                                status: "error"
                                                                            });
                                                                        });
                                                                } else {
                                                                    result.forEach(function(elemResult, indexResult) {
                                                                        if (elemResult.status_id === 1 || elemResult.status_id === 4) {
                                                                            result[indexResult].person_charge = result[indexResult].FirstName + " " + result[indexResult].LastName;
                                                                        } else if ((elemResult.status_id === 2 || elemResult.status_id === 5) &&
                                                                            elemResult.is_approve_first === 0 &&
                                                                            elemResult.is_approve_second === 1) {
                                                                            if (resultInfoLevel1 !== undefined &&
                                                                                resultInfoLevel1 !== null &&
                                                                                resultInfoLevel1.length !== 0) {
                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                            }

                                                                        } else {
                                                                            if (resultInfoLevel1 !== undefined &&
                                                                                resultInfoLevel1 !== null &&
                                                                                resultInfoLevel1.length !== 0) {
                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                            }
                                                                        }
                                                                    });
                                                                    res.json({
                                                                        status: "success",
                                                                        result: result,
                                                                        count: resultCount[0].COUNT,
                                                                        resultStatus: resultStatus
                                                                    });
                                                                    return;
                                                                }

                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                            });
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR:" + err + "*****");
                                                        res.json({
                                                            status: "error"
                                                        });
                                                    });
                                            } else {
                                                res.json({
                                                    status: "success",
                                                    result: result,
                                                    count: resultCount[0].COUNT,
                                                    resultStatus: resultStatus
                                                });
                                            }
                                        })
                                        .error(function(err) {
                                            console.log("*****ERROR:" + err + "*****");
                                            res.json({
                                                status: "error"
                                            });
                                        });

                                } else if (result.length === 0 && paramSelect !== "") {
                                    res.json({
                                        status: "success",
                                        result: [],
                                        count: 0,
                                        resultStatus: resultStatus
                                    });
                                    return;
                                }
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error",
                                    result: null,
                                    count: 0,
                                    resultStatus: resultStatus
                                });
                                return;
                            });
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: null,
                            count: 0,
                            resultStatus: resultStatus
                        });
                        return;
                    });
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
    ViewLeave: View detail a Leave form
    input: id of Leave form
    output: details of Leave form
    */
    ViewLeave: function(req, res) {
        var info = req.body.info
        var leave_id = info.leave_id;
        //get information detail of Leave form
        var queryView =
            "SELECT hr_employee.FirstName, hr_employee.LastName, hr_leave.leave_id, hr_leave.is_reject, " + //SELECT
            "hr_leave.time_leave as time_leave_all, hr_leave.reason_leave as reason_leave_all, " + //SELECT
            "hr_leave.application_date, hr_leave.work_date, hr_leave_detail.type_other, " + //SELECT
            "hr_leave.start_date, hr_leave.finish_date, hr_leave_type.leave_name, hr_leave.standard, " + //SELECT
            "hr_leave.is_approve_first, hr_leave.is_approve_second, " + //SELECT
            "hr_leave_detail.time_leave, hr_leave_detail.reason_leave, time_task_status.name as status, " + //SELECT
            "time_task_status.task_status_id " + //SELECT
            "FROM hr_employee " + //FROM
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " + //JOIN
            "INNER JOIN hr_leave_detail ON hr_leave.leave_id = hr_leave_detail.leave_id " + //JOIN
            "INNER JOIN hr_leave_type ON hr_leave_type.leave_type_id = hr_leave_detail.leave_type_id " + //JOIN
            "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //JOIN
            "WHERE hr_leave.leave_id = :leave_id"; //WHERE
        db.sequelize.query(queryView, null, {
                raw: true
            }, {
                leave_id: leave_id
            })
            .success(function(result) {
                //get person-in-charge
                var queryGetTitleEmployee =
                    "SELECT hr_employee.TITLE " +
                    "FROM hr_employee " +
                    "INNER JOIN users on users.employee_id = hr_employee.Employee_ID " +
                    "WHERE users.id = :userId";
                db.sequelize.query(queryGetTitleEmployee, null, {
                        raw: true
                    }, {
                        userId: info.user_id
                    })
                    .success(function(resultTitle) {
                        var isPermiss = true;
                        if (resultTitle !== undefined &&
                            resultTitle !== null &&
                            resultTitle[0] !== undefined &&
                            resultTitle[0] !== null &&
                            resultTitle[0].TITLE === "Head of Dept." &&
                            result !== undefined &&
                            result !== null &&
                            result[0] !== undefined &&
                            result[0] !== null &&
                            result[0].standard === 0 &&
                            result[0].is_approve_first === 0 &&
                            result[0].is_approve_second === 1) {
                            isPermiss = false;
                        }
                        res.json({
                            status: "success",
                            isPermiss: isPermiss,
                            result: result
                        });
                        return;
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: []
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: []
                });
                return;
            });
    },

    /*
    SubmitOnViewLeave: submitted a Leave form on view
    input: information Leave form
    output: - success: send confirmation notification and message success
            - fail: send message error
    */
    SubmitOnViewLeave: function(req, res) {
        var trackerInfo = req.body.info;
        var statusID = req.body.info.statusID;
        var leaveID = req.body.info.leaveID;
        var userID = req.body.info.userID;
        var dateUpdate = moment().format("YYYY-MM-DD hh:mm:ss");
        //update status for Leave form
        var queryUpdateStatus =
            "UPDATE hr_leave " + //UPDATE
            "SET hr_leave.status_id = :statusID, status_id_first = :statusIdFirst, " + //SET
            "last_update_date = :dateUpdate " + //SET
            "WHERE hr_leave.leave_id = :leaveID"; //WHERE
        db.sequelize.query(queryUpdateStatus, null, {
                raw: true
            }, {
                statusID: statusID,
                statusIdFirst: statusID,
                dateUpdate: dateUpdate,
                leaveID: leaveID
            })
            .success(function(result) {
                //tracker
                trackerInfo.creationDate = moment().format("YYYY-MM-DD h:mm:ss");
                functionForTimesheet.TracKerLeave(trackerInfo);

                //send mail
                var sendMailInfo = {
                    userID: trackerInfo.userID,
                    dateSubmit: trackerInfo.creationDate
                };
                functionForTimesheet.sendMailSubmitLeave(req, res, sendMailInfo);

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

    /*
    LoadLeaveEdit: load a Leave form to edit
    input: information Leave form
    output: Leave form been editted
    */
    LoadLeaveEdit: function(req, res) {
        var info = req.body.info;
        var leaveID = info.idLeave;
        var queryPermiss =
            "SELECT hr_leave.status_id " +
            "FROM hr_leave " +
            "WHERE hr_leave.user_id = :userId AND hr_leave.leave_id = :idLeave";
        db.sequelize.query(queryPermiss, null, {
                raw: true
            }, {
                userId: info.userId,
                idLeave: leaveID
            })
            .success(function(resultPermiss) {
                if (resultPermiss !== undefined &&
                    resultPermiss !== null &&
                    resultPermiss.length !== 0 &&
                    resultPermiss[0] !== undefined &&
                    resultPermiss[0] !== null &&
                    resultPermiss[0].status_id !== 2 &&
                    resultPermiss[0].status_id !== 3 &&
                    resultPermiss[0].status_id !== 5) {
                    //load Leave form edit
                    var queryLoadLeaveEdit =
                        "SELECT hr_leave.leave_id, hr_leave.application_date, hr_leave.start_date, hr_leave.is_reject, hr_leave.status_id, " + //SELECT
                        "hr_leave.finish_date, hr_leave.work_date, hr_leave.standard, hr_leave.status_id, hr_leave.time_leave, departments.departmentName, " + //SELECT
                        "hr_leave.reason_leave, hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct " + //SELECT
                        "FROM hr_leave " + //FROM
                        "INNER JOIN users ON users.id = hr_leave.user_id " + //JOIN
                        "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
                        "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " + //JOIN
                        "WHERE hr_leave.leave_id = :leaveID"; //WHERE
                    //load detail this Leave form
                    var queryLoadLeaveDetailEdit =
                        "SELECT hr_leave_detail.leave_detail_id, hr_leave_detail.time_leave, " + //SELECT
                        "hr_leave_detail.reason_leave, " + //SELECT
                        "hr_leave_detail.type_other, hr_leave_type.leave_name, hr_leave_type.leave_type_id " + //SELECT
                        "FROM hr_employee " + //FROM
                        "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                        "INNER JOIN hr_leave ON hr_leave.user_id = users.id " + //JOIN
                        "INNER JOIN hr_leave_detail ON hr_leave.leave_id = hr_leave_detail.leave_id " + //JOIN
                        "INNER JOIN hr_leave_type ON hr_leave_type.leave_type_id = hr_leave_detail.leave_type_id " + //JOIN
                        "WHERE hr_leave.leave_id = :leaveID"; //WHERE
                    db.sequelize.query(queryLoadLeaveEdit, null, {
                            raw: true
                        }, {
                            leaveID: leaveID
                        })
                        .success(function(resultLeave) {
                            db.sequelize.query(queryLoadLeaveDetailEdit, null, {
                                    raw: true
                                }, {
                                    leaveID: leaveID
                                })
                                .success(function(resultLeaveDetail) {
                                    res.json({
                                        status: "success",
                                        resultLeave: resultLeave,
                                        resultLeaveDetail: resultLeaveDetail
                                    });
                                    return;
                                })
                                .error(function(err) {
                                    console.log("*****ERROR:" + err + "*****");
                                    res.json({
                                        status: "error",
                                        resultLeave: [],
                                        resultLeaveDetail: []
                                    });
                                    return;
                                });
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                resultLeave: [],
                                resultLeaveDetail: []
                            });
                            return;
                        });
                } else {
                    res.json({
                        status: "error"
                    });
                    return;
                }
            })
            .error(function(err) {
                console.log("*****ERROR: " + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
    },

    /*
    UpdateLeave: update a Leave form
    input: information Leave form
    output: - success: send message success
            - fail: send message error
    */
    UpdateLeave: function(req, res) {
        var info = req.body.info;
        //update Leave form with data request
        db.HrLeave.update({
                application_date: info.application_date,
                start_date: info.start_date,
                finish_date: info.finish_date,
                work_date: info.work_date,
                standard: info.standard,
                time_leave: info.time_leave_real,
                reason_leave: info.reason_leave,
                is_approve_first: 1,
                is_approve_second: 0,
                status_id: info.statusID,
                status_id_first: info.statusID,
                status_id_second: null,
                user_id: info.USER_ID,
                last_updated_by: info.USER_ID
            }, {
                leave_id: info.leave_id
            })
            .success(function(result) {
                for (var i = 0; i < info.infoTypeLeave.length; i++) {
                    //update details Leave form updated
                    chainer.add(db.HrLeaveDetail.update({
                        time_leave: info.infoTypeLeave[i].time_leave_real,
                        reason_leave: info.infoTypeLeave[i].reason_leave,
                        last_updated_by: info.USER_ID,
                        type_other: i === 4 ? info.infoTypeLeave[i].type_other : null
                    }, {
                        leave_detail_id: info.infoTypeLeave[i].leave_detail_id
                    }));
                }
                chainer.runSerially()
                    .success(function(resultAll) {
                        //tracker
                        var trackerInfo = {
                            statusID: info.statusID,
                            leaveID: info.leave_id,
                            creationDate: moment().format("YYYY-MM-DD h:mm:ss"),
                            userID: info.USER_ID
                        };
                        functionForTimesheet.TracKerLeave(trackerInfo);
                        if (info.statusID === 2 || info.statusID === 5) {
                            //send mail
                            var sendMailInfo = {
                                userID: trackerInfo.userID,
                                dateSubmit: trackerInfo.creationDate
                            };
                            functionForTimesheet.sendMailSubmitLeave(req, res, sendMailInfo);
                        }
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
    LoadLeaveApprove: load list Leave form submitted by employee
    input: information of approver
    output: list Leave form is submitted
    */
    LoadLeaveApprove: function(req, res) {
            var deferred = Q.defer();
            var info = req.body.info;
            var searchStr = " AND (",
                orderStr = " ORDER BY ",
                selectStr = " AND ";
            //search
            if (info.search[0] !== undefined &&
                info.search[0] !== null &&
                info.search[0] !== '' &&
                info.search[0] !== ' ') {
                searchStr += "hr_employee.FirstName like '%" + info.search[0] +
                    "%' OR hr_employee.LastName like '%" + info.search[0] + "%') ";
            } else {
                searchStr = "";
            }

            //order
            if (info.order[0] !== undefined &&
                info.order[0] !== null &&
                info.order[0] !== '' &&
                info.order[0] !== ' ') {
                orderStr += "hr_leave.start_date " + info.order[0];
            } else {
                orderStr = "";
            }

            //sellect
            if (info.select[0] !== undefined &&
                info.select[0] !== null &&
                info.select[0] !== '' &&
                info.select[0] !== ' ') {
                selectStr += "time_task_status.task_status_id = " + info.select[0];
            } else {
                selectStr = "";
            }
            //get department code, node code of user
            var queryGetDept =
                "SELECT DISTINCT sys_hierarchies_users.DEPARTMENT_CODE_ID, sys_hierarchy_nodes.NODE_CODE, sys_hierarchy_nodes.NODE_ID " + //SELECT
                "FROM sys_hierarchies_users " + //FROM
                "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " +
                "WHERE sys_hierarchies_users.USER_ID = :userID"; //WHERE

            db.sequelize.query(queryGetDept, null, {
                    raw: true
                }, {
                    userID: info.USER_ID
                })
                .success(function(resultDept) {
                        if (resultDept !== undefined &&
                            resultDept !== null &&
                            resultDept[0] !== undefined &&
                            resultDept[0] !== null) {
                            var DEPARTMENT_CODE_ID = resultDept[0].DEPARTMENT_CODE_ID;
                            var NODE_CODE = resultDept[0].NODE_CODE;
                            var NODE_ID = resultDept[0].NODE_ID;
                            var queryGetListLeave = "";
                            var queryCountListLeave = "";
                            var queryAddListUser = "";
                            if (NODE_CODE === "Director") {
                                queryAddListUser = " OR sys_hierarchy_nodes.NODE_CODE = 'Head of Dept.'";
                            }
                            //get information subordiante
                            var queryGetUserSubordinate =
                                "SELECT DISTINCT sys_hierarchies_users.USER_ID, sys_hierarchies_users.DEPARTMENT_CODE_ID " + //SELECT
                                "FROM sys_hierarchies_users " + //FROM
                                "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //INNER JOIN
                                "WHERE (sys_hierarchy_nodes.TO_NODE_ID = :nodeId AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :deptId)" + queryAddListUser; //WHERE
                            db.sequelize.query(queryGetUserSubordinate, null, {
                                    raw: true
                                }, {
                                    nodeId: NODE_ID,
                                    deptId: DEPARTMENT_CODE_ID
                                })
                                .success(function(resultSubordinate) {
                                        var listUser = "";
                                        if (resultSubordinate !== undefined &&
                                            resultSubordinate !== null &&
                                            resultSubordinate.length !== 0) {
                                            for (var i = 0; i < resultSubordinate.length; i++) {
                                                listUser += resultSubordinate[i].USER_ID + ", ";
                                            }
                                            if (listUser !== "") {
                                                listUser = listUser.substring(0, listUser.length - 2);
                                                listUser = "(" + listUser + ")";
                                            } else {
                                                listUser = "(-1)";
                                            }
                                        }
                                        if (NODE_CODE === "Head of Dept." || NODE_CODE === "Director") {
                                            //get list Leave form, count list
                                            if (NODE_CODE === "Head of Dept.") {
                                                queryGetListLeave =
                                                    "SELECT hr_employee.FirstName, hr_employee.LastName, " + //SELECT
                                                    "hr_leave.status_id, hr_leave.is_approve_first, hr_leave.is_approve_second, hr_leave.standard, " + //SELECT
                                                    "hr_leave.leave_id, hr_leave.time_leave, hr_leave.reason_leave, hr_leave.start_date, hr_leave.finish_date, " + //SELECT
                                                    "hr_leave.status_id_first as task_status_id, time_task_status.name " + //SElECT
                                                    "FROM hr_employee " + //FROM
                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                                    "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                                    "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //INNER JOIN
                                                    "WHERE hr_leave.status_id != 1 AND hr_leave.user_id IN " + listUser +
                                                    selectStr + " " + searchStr + " " + orderStr + " LIMIT :limit OFFSET :offset";
                                                queryCountListLeave =
                                                    "SELECT COUNT(*) AS COUNT " + //SElECT
                                                    "FROM hr_employee " + //FROM
                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                                    "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                                    "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id_first " + //INNER JOIN
                                                    "WHERE hr_leave.status_id != 1 AND hr_leave.user_id IN " + listUser +
                                                    selectStr + " " + searchStr + " " + orderStr;
                                            } else if (NODE_CODE === "Director") {
                                                queryGetListLeave = "SELECT hr_employee.FirstName, hr_employee.LastName, " + //SELECT
                                                    "hr_leave.status_id, hr_leave.is_approve_first, hr_leave.is_approve_second, hr_leave.standard, " + //SELECT
                                                    "hr_leave.leave_id, hr_leave.time_leave, hr_leave.reason_leave, hr_leave.start_date, hr_leave.finish_date, " + //SELECT
                                                    "time_task_status.task_status_id, time_task_status.name " + //SElECT
                                                    "FROM hr_employee " + //FROM
                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                                    "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                                    "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //INNER JOIN
                                                    " AND ((hr_leave.is_approve_first = 0 AND hr_leave.is_approve_second = 1 AND hr_leave.standard = 0) OR hr_leave.user_id IN " +
                                                    listUser + ") AND hr_leave.status_id!=1 " +
                                                    selectStr + " " + searchStr + " " + orderStr + " LIMIT :limit OFFSET :offset";
                                                queryCountListLeave = "SELECT COUNT(*) AS COUNT " + //SElECT
                                                    "FROM hr_employee " + //FROM
                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                                    "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //INNER JOIN
                                                    "INNER JOIN time_task_status ON time_task_status.task_status_id = hr_leave.status_id " + //INNER JOIN
                                                    " AND ((hr_leave.is_approve_first = 0 AND hr_leave.is_approve_second = 1 AND hr_leave.standard = 0) OR hr_leave.user_id IN " +
                                                    listUser + ") AND hr_leave.status_id!=1 " +
                                                    selectStr + " " + searchStr + " " + orderStr;
                                            }
                                            db.sequelize.query(queryGetListLeave, null, {
                                                    raw: true
                                                }, {
                                                    limit: info.limit,
                                                    offset: info.offset
                                                })
                                                .success(function(result) {
                                                        db.sequelize.query(queryCountListLeave, null, {
                                                                raw: true
                                                            })
                                                            .success(function(resultCount) {
                                                                    if (searchStr === "" &&
                                                                        selectStr === "" &&
                                                                        result.length === 0) {
                                                                        res.json({
                                                                            status: "success",
                                                                            result: null,
                                                                            count: 0
                                                                        });
                                                                        return;
                                                                    } else {
                                                                        //PROMISE
                                                                        var promise_chain = Q.fcall(function() {});
                                                                        //END ERROR
                                                                        result.forEach(function(elemResult, indexResult) {
                                                                                var promise_link = function() {
                                                                                        var deferred = Q.defer();
                                                                                        var queryAdd = "";
                                                                                        if (NODE_CODE === "Head of Dept.") {
                                                                                            queryAdd = "AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :deptId";
                                                                                        }
                                                                                        //get person-in-charge

                                                                                        //get node id approver level 1
                                                                                        var queryGetNodeLevel1 =
                                                                                            "SELECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " + //SELECT
                                                                                            "FROM sys_hierarchy_nodes " + //FROM
                                                                                            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
                                                                                            "INNER JOIN users on users.id = sys_hierarchies_users.USER_ID " + //JOIN
                                                                                            "INNER JOIN hr_leave ON hr_leave.user_id = users.id " + //JOIN
                                                                                            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                                                                            "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND hr_leave.leave_id = :leaveId " + queryAdd; //WHERE
                                                                                        db.sequelize.query(queryGetNodeLevel1, null, {
                                                                                                raw: true
                                                                                            }, {
                                                                                                leaveId: result[indexResult].leave_id,
                                                                                                deptId: resultDept[0].DEPARTMENT_CODE_ID //USE WHEN Head of Dept.
                                                                                            })
                                                                                            .success(function(resultNodeLevel1) {
                                                                                                    //get node id approver level 2
                                                                                                    var queryGetNodeLevel2 =
                                                                                                        "SELECT DISTINCT sys_hierarchy_nodes.TO_NODE_ID " + //SELECT
                                                                                                        "FROM sys_hierarchy_nodes " + //FROM
                                                                                                        "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
                                                                                                        "INNER JOIN users on users.id = sys_hierarchies_users.USER_ID " + //JOIN
                                                                                                        "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                                                                                        "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId"; //WHERE
                                                                                                    db.sequelize.query(queryGetNodeLevel2, null, {
                                                                                                            raw: true
                                                                                                        }, {
                                                                                                            nodeId: (resultNodeLevel1 !== undefined &&
                                                                                                                resultNodeLevel1 !== null &&
                                                                                                                resultNodeLevel1[0] !== undefined &&
                                                                                                                resultNodeLevel1[0] !== null &&
                                                                                                                !isNaN(resultNodeLevel1[0].TO_NODE_ID) ? resultNodeLevel1[0].TO_NODE_ID : -1)
                                                                                                        })
                                                                                                        .success(function(resultNodeLevel2) {
                                                                                                                //get information approver leve 1
                                                                                                                var getInfoLevel1 =
                                                                                                                    "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName " + //SELECT
                                                                                                                    "FROM hr_employee " + //FROM
                                                                                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                                                                                                    "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                                                                                                    "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                                                                                    "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_group.GROUP_ID " + //JOIN
                                                                                                                    "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId " + queryAdd; //WHERE
                                                                                                                db.sequelize.query(getInfoLevel1, null, {
                                                                                                                        raw: true
                                                                                                                    }, {
                                                                                                                        nodeId: (resultNodeLevel1 !== undefined &&
                                                                                                                            resultNodeLevel1 !== null &&
                                                                                                                            resultNodeLevel1[0] !== undefined &&
                                                                                                                            resultNodeLevel1[0] !== null &&
                                                                                                                            !isNaN(resultNodeLevel1[0].TO_NODE_ID) ? resultNodeLevel1[0].TO_NODE_ID : -1),
                                                                                                                        deptId: resultDept[0].DEPARTMENT_CODE_ID
                                                                                                                    })
                                                                                                                    .success(function(resultInfoLevel1) {
                                                                                                                            //get information approver level 2
                                                                                                                            var getInfoLevel2 =
                                                                                                                                "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName " + //SELECT
                                                                                                                                "FROM hr_employee " + //FROM
                                                                                                                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                                                                                                                "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                                                                                                                "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                                                                                                                "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_group.GROUP_ID " + //JOIN
                                                                                                                                "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchy_nodes.NODE_ID = :nodeId"; //WHERE
                                                                                                                            db.sequelize.query(getInfoLevel2, null, {
                                                                                                                                    raw: true
                                                                                                                                }, {
                                                                                                                                    nodeId: (resultNodeLevel2 !== undefined &&
                                                                                                                                        resultNodeLevel2 !== null &&
                                                                                                                                        resultNodeLevel2[0] !== undefined &&
                                                                                                                                        resultNodeLevel2[0] !== null &&
                                                                                                                                        !isNaN(resultNodeLevel2[0].TO_NODE_ID) ? resultNodeLevel2[0].TO_NODE_ID : -1)
                                                                                                                                })
                                                                                                                                .success(function(resultInfoLevel2) {
                                                                                                                                        if ((result[indexResult].status_id === 2 ||
                                                                                                                                                result[indexResult].status_id === 5) &&
                                                                                                                                            result[indexResult].standard === 1) {
                                                                                                                                            result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                                                        } else if ((result[indexResult].status_id === 2 ||
                                                                                                                                                result[indexResult].status_id === 5) &&
                                                                                                                                            result[indexResult].standard === 0 &&
                                                                                                                                            result[indexResult].is_approve_first === 1 &&
                                                                                                                                            result[indexResult].is_approve_second === 0) {
                                                                                                                                            result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                                                        } else if ((result[indexResult].status_id === 2 ||
                                                                                                                                                result[indexResult].status_id === 5) &&
                                                                                                                                            result[indexResult].standard === 0 &&
                                                                                                                                            result[indexResult].is_approve_first === 0 &&
                                                                                                                                            result[indexResult].is_approve_second === 1 &&
                                                                                                                                            resultInfoLevel2 !== undefined &&
                                                                                                                                            resultInfoLevel2 !== null &&
                                                                                                                                            resultInfoLevel2[0] !== undefined &&
                                                                                                                                            resultInfoLevel2[0] !== null) {
                                                                                                                                            result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                                                                        } else if (elemResult.status_id === 3 &&
                                                                                                                                            elemResult.standard === 0) {
                                                                                                                                            //check approver level 2    
                                                                                                                                          if (resultInfoLevel2 !== undefined &&resultInfoLevel2 !== null &&
                                                                                                                                                resultInfoLevel2[0] !== undefined &&
                                                                                                                                                resultInfoLevel2[0] !== null &&
                                                                                                                                                resultInfoLevel2[0].length !== 0) {
                                                                                                                                            result[indexResult].person_charge = resultInfoLevel2[0].FirstName + " " + resultInfoLevel2[0].LastName;
                                                                                                                                        } else {
                                                                                                                                            if (resultInfoLevel1 !== undefined &&
                                                                                                                                                resultInfoLevel1 !== null &&
                                                                                                                                                resultInfoLevel1[0] !== undefined &&
                                                                                                                                                resultInfoLevel1[0] !== null &&
                                                                                                                                                resultInfoLevel1[0].length !== 0) {
                                                                                                                                                result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    } else if (elemResult.status_id === 3 &&
                                                                                                                                        elemResult.standard === 1) {
                                                                                                                                        //check approver leve 1
                                                                                                                                        if (resultInfoLevel1 !== undefined &&
                                                                                                                                            resultInfoLevel1 !== null &&
                                                                                                                                            resultInfoLevel1[0] !== undefined &&
                                                                                                                                            resultInfoLevel1[0] !== null &&
                                                                                                                                            resultInfoLevel1[0].length !== 0) {
                                                                                                                                            result[indexResult].person_charge = resultInfoLevel1[0].FirstName + " " + resultInfoLevel1[0].LastName;
                                                                                                                                        }
                                                                                                                                    } else if (elemResult.status_id === 4) {
                                                                                                                                        result[indexResult].person_charge = result[indexResult].FirstName + " " + result[indexResult].LastName;
                                                                                                                                    }
                                                                                                                                    deferred.resolve(resultInfoLevel2);
                                                                                                                                })
                                                                                                                        .error(function(err) {
                                                                                                                            console.log("*****ERROR:" + err + "*****");
                                                                                                                            res.json({
                                                                                                                                status: "error"
                                                                                                                            });
                                                                                                                            return;
                                                                                                                        });
                                                                                                                    })
                                                                                                            .error(function(err) {
                                                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                                                res.json({
                                                                                                                    status: "error"
                                                                                                                });
                                                                                                                return;
                                                                                                            });
                                                                                                        })
                                                                                                .error(function(err) {
                                                                                                    console.log("*****ERROR:" + err + "*****");
                                                                                                    res.json({
                                                                                                        status: "error"
                                                                                                    });
                                                                                                    return;
                                                                                                });

                                                                                            })
                                                                                    .error(function(err) {
                                                                                        console.log("*****ERROR:" + err + "*****");
                                                                                        res.json({
                                                                                            status: "error"
                                                                                        });
                                                                                        return;
                                                                                    });
                                                                                return deferred.promise;
                                                                            }; promise_chain = promise_chain.then(promise_link);
                                                                        });
                                                                    promise_chain.then(function() {
                                                                        res.json({
                                                                            status: "success",
                                                                            result: result,
                                                                            count: resultCount[0].COUNT
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

                                                })
                                        .error(function(err) {
                                            console.log("*****ERROR:" + err + "*****");
                                            res.json({
                                                status: "error"
                                            });
                                            return;
                                        });
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
                status: "error",
                result: []
            });
        });
},
};
