//EXPORTS MODEL
var db = require("../../models");
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;
var functionForTimesheet = require("./functionForTimesheet");
var ServiceErp = require('../../helper/ERP_Rest');
//END
module.exports = {
    /*
    ViewApproved: View detail Timesheet to approve
    input: id of Timesheet
    output: detail of Timesheet
    */
    ViewApproved: function(req, res) {
        var idTaskWeek = req.body.info;
        //get information Timesheet 
        var strQuery =
            "SELECT SUM(DISTINCT time_tasks.time_charge) AS sumDATE, time_tasks.date, time_tasks.tasks_id, " + //SELECT
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date, " + //SELECT
            "time_tasks_week.user_id, time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, " + //SELECT
            "time_item_task.item_id, " + //SELECT
            "time_tasks.time_charge, time_tasks_week.over_time, time_task_status.name AS status, " + //SELECT
            "time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, " + //SELECT
            "hr_employee.FirstName, hr_employee.LastName " + //SELECT
            "FROM time_tasks " + //FROM
            "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " + //JOIN
            "LEFT JOIN time_item_task ON time_tasks.tasks_id = time_item_task.task_id " + //JOIN
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " + //JOIN
            "INNER JOIN users ON time_tasks_week.user_id = users.id " + //JOIN
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " + //JOIN
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "WHERE time_tasks.tasks_week_id = :idTaskWeek GROUP BY time_tasks.date ORDER BY time_tasks.date"; //WHERE
        //get information Timesheet detail, group by date, activiti id
        var strActivity =
            "SELECT SUM(time_tasks.time_charge) AS sumAC, time_tasks.date, " + //SELECT
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date,  " + //SELECT
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, " + //SELECT
            "time_tasks_week.over_time, time_task_status.name AS status, time_task_status.task_status_id, " + //SELECT
            "time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " + //SELECT
            "FROM time_tasks " + //FROM
            "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " + //JOIN
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " + //JOIN
            "INNER JOIN users ON time_tasks_week.user_id = users.id " + //JOIN
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " + //JOIN
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "WHERE time_tasks.tasks_week_id = :idTaskWeek " + //WHERE
            "GROUP BY time_tasks.date, time_activity.activity_id " + //GROUP
            "ORDER BY time_tasks.date"; //ORDER

        db.sequelize.query(strQuery, null, {
                raw: true
            }, {
                idTaskWeek: idTaskWeek
            })
            .success(function(result) {
                //check Leave form - Timesheet
                var queryGetLeaveApprove =
                    "SELECT hr_leave.start_date, hr_leave.finish_date " + //SELECT
                    "FROM hr_leave " + //FROM
                    "WHERE hr_leave.user_id = :userId AND hr_leave.status_id = 3"; //WHERE
                db.sequelize.query(queryGetLeaveApprove, null, {
                        raw: true
                    }, {
                        userId: result[0].user_id
                    })
                    .success(function(resultLeaveApprove) {
                        //check exist leave
                        var forPermission = true;
                        result.forEach(function(valueResult, indexResult) {
                            var date = moment(valueResult.date).format("X");
                            resultLeaveApprove.forEach(function(valueResultLeaveApprove, indexResultLeaveApprove) {
                                var startDate = moment(valueResultLeaveApprove.start_date).format("X");
                                var finishDate = moment(valueResultLeaveApprove.finish_date).format("X");
                                if ((valueResult.item_id == 15 ||
                                        valueResult.item_id == 16 ||
                                        valueResult.item_id == 17 ||
                                        valueResult.item_id == 19 ||
                                        valueResult.item_id == 24 ||
                                        valueResult.item_id == 25) &&
                                    (date < startDate || date > finishDate)) {
                                    forPermission = false;
                                }
                            });
                        });

                        //get Timesheet
                        if (result === undefined || result === null || result.length === 0) {
                            res.json({
                                status: "success",
                                result: [],
                                resultActivity: [],
                                forPermission: forPermission
                            });
                            return;
                        } else {
                            db.sequelize.query(strActivity, null, {
                                    raw: true
                                }, {
                                    idTaskWeek: idTaskWeek
                                })
                                .success(function(resultActivity) {
                                    res.json({
                                        status: "success",
                                        result: result,
                                        resultActivity: resultActivity,
                                        forPermission: forPermission
                                    });
                                    return;
                                }).error(function(err) {
                                    console.log("*****ERROR:" + err + "*****");
                                    res.json({
                                        status: "error",
                                        result: [],
                                        resultActivity: [],
                                        forPermission: forPermission
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
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: [],
                    resultActivity: []
                });
                return;
            });
    },

    /*
    ViewOnDate: View detail Timesheet on date
    input: information Timesheet
    output: Detail Timesheet on date
    */
    ViewOnDate: function(req, res) {
        var info = req.body.info;
        //get detail Timesheet on date
        var strQuery =
            "SELECT DISTINCT time_tasks.date, time_tasks.tasks_id, time_tasks.task, time_item_task.units, " + //SELECT
            "time_item_code.ITEM_NAME,time_item_task.ITEM_ID, time_item_code.IS_BILLABLE, time_item_task.ratio, " + //SELECT
            "time_activity.NAME, time_location.NAME AS LOCATION, departments.departmentName, " + //SELECT
            "time_tasks.time_charge, time_item_task.item_id, time_item_task.deleted, " + //SELECT
            "time_item_task.time_charge as chargeItem, time_item_task.comment, " + //SELECT
            "hr_employee.FirstName, hr_employee.LastName, time_tasks_week.start_date, " + //SELECT
            "time_tasks_week.end_date, time_tasks_week.time_charge as chargeWeek, " + //SELECT
            "time_task_status.name AS status " + //SELECT
            "FROM time_tasks " + //FROM
            "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " + //JOIN
            "INNER JOIN users ON users.id=time_tasks_week.user_id " + //JOIN
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " + //JOIN
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " + //JOIN
            "LEFT JOIN time_location ON time_location.location_id = time_tasks.location_id " + //JOIN
            "LEFT JOIN departments ON departments.departmentid = time_tasks.department_code_id " + //JOIN
            "LEFT OUTER JOIN time_item_task ON time_tasks.tasks_id = time_item_task.task_id AND time_item_task.deleted = 0 " + //JOIN
            "LEFT JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id " + //JOIN
            "WHERE time_tasks.date = :dateTast AND time_tasks.tasks_week_id = :id" + //WHERE
            " AND time_tasks.deleted = 0" + //WHERE
            " ORDER BY time_tasks.order ASC"; //ORDER
        db.sequelize.query(strQuery, null, {
                raw: true
            }, {
                dateTast: info.DATE,
                id: info.ID
            })
            .success(function(result) {
                //get file on this Timesheet
                var queryGetFile =
                    "SELECT DISTINCT t.`tasks_id`, c.`item_id` as ITEM_ID, " + //SELECT
                    "time_task_file.path_file, time_task_file.file_id, time_task_file.file_name, " + //SELECT
                    "time_task_file.file_size " + //SELECT
                    "FROM `time_tasks` " + //FROM
                    "t INNER JOIN `time_item_task` i ON i.`task_id` = t.`tasks_id` " + //JOIN
                    "INNER JOIN `time_item_code` c ON c.`ITEM_ID` = i.`item_id`" + //JOIN
                    "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = t.tasks_week_id " + //JOIN
                    "INNER JOIN time_item_file ON time_item_file.task_id = i.task_id AND time_item_file.item_id = i.item_id " + //JOIN
                    "INNER JOIN time_task_file ON time_task_file.file_id = time_item_file.file_id " + //JOIN
                    "WHERE " + //WHERE
                    "t.`tasks_week_id` = ?";
                db.sequelize.query(queryGetFile, null, {
                        raw: true
                    }, [info.ID])
                    .success(function(file) {
                        res.json({
                            status: "success",
                            result: result,
                            file: file
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
    LoadTimeSheetApprove: Load list Timesheet to approve
    input: infomation search, pagination, order, ...
    output: list Timesheet
    */
    LoadTimeSheetApprove: function(req, res) {
        var searchObj = req.body.searchObj;
        var strSearch = " AND ";
        var orderBY = " ORDER BY ";
        var strSearchEmployee = "";
        if (searchObj.name['nameEmployee'] !== undefined && searchObj.name['nameEmployee'] !== null && searchObj.name['nameEmployee'] !== "") {
            strSearchEmployee = " AND (hr_employee.FirstName like '%" + searchObj.name['nameEmployee'] + "%' OR " +
                "hr_employee.LastName like '%" + searchObj.name['nameEmployee'] + "%')";
        }

        //search
        for (var keySearch in searchObj.data) {
            if (searchObj.data[keySearch] !== undefined &&
                searchObj.data[keySearch] !== null &&
                searchObj.data[keySearch] !== "") {
                strSearch += keySearch + " like '%" + searchObj.data[keySearch] + "%' AND ";
            }
        }

        //select
        for (var keySelect in searchObj.select) {
            if (searchObj.select[keySelect] !== undefined &&
                searchObj.select[keySelect] !== null &&
                searchObj.select[keySelect] !== "") {
                strSearch += keySelect + " = " + searchObj.select[keySelect] + " AND ";
            }
        }

        if (strSearch.length === 5) {
            strSearch = "";
        } else {
            strSearch = strSearch.substring(0, strSearch.length - 5);
        }

        for (var keyOrder in searchObj.order) {
            if (searchObj.order[keyOrder] !== undefined &&
                searchObj.order[keyOrder] !== null &&
                searchObj.order[keyOrder] !== "") {
                orderBY += keyOrder + " " + searchObj.order[keyOrder];
            }
        }
        if (orderBY.length === 10) {
            orderBY = "";
        }
        var isDirector = false;
        //get node id Head of Dept. on TIMESHEET
        var strQueryGetNodeDept =
            "SELECT sys_hierarchy_nodes.NODE_ID, sys_hierarchy_nodes.NODE_CODE " + //SELECT
            "FROM sys_hierarchy_nodes " + //FROM
            "INNER JOIN sys_hierarchy_group ON sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID " + //JOIN
            "INNER JOIN sys_hierarchies_types ON sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE " + //JOIN
            "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
            "WHERE sys_hierarchies_users.USER_ID = :userId " + //WHERE
            "AND sys_hierarchies_types.TYPE_NAME='Time Sheet'"; //WHERE
        db.sequelize.query(strQueryGetNodeDept, null, {
                raw: true
            }, {
                userId: searchObj.USER_ID
            })
            .success(function(result) {
                if (result === undefined || result === null || result.length === 0) {
                    res.json({
                        status: "success",
                        count: 0,
                        result: null
                    });
                    return;
                } else {
                    var NodeDeptId = "";
                    for (var deptId in result) {
                        if (result[deptId] !== undefined &&
                            result[deptId] !== null &&
                            result[deptId] !== "") {
                            if (result[deptId].NODE_CODE === "Director") {
                                isDirector = true;
                            }
                            NodeDeptId += result[deptId].NODE_ID + ",";
                        }
                    }
                    if (NodeDeptId !== "") {
                        NodeDeptId = "(" + NodeDeptId.substring(0, NodeDeptId.length - 1) + ")";
                    }
                    //get list department
                    var strQueryDeptList =
                        "SELECT sys_hierarchies_users.DEPARTMENT_CODE_ID " + //SELECT
                        "FROM sys_hierarchies_users " + //FORM
                        "WHERE NODE_ID IN " + NodeDeptId + " AND sys_hierarchies_users.USER_ID = :userId"; //WHERE
                    db.sequelize.query(strQueryDeptList, null, {
                            raw: true
                        }, {
                            userId: searchObj.USER_ID
                        })
                        .success(function(resultDept) {
                            var Depts = "";
                            if (resultDept === undefined || resultDept === null || resultDept.length === 0) {
                                res.json({
                                    status: "success",
                                    count: 0,
                                    result: []
                                });
                                return;
                            } else {
                                for (var keyDept in resultDept) {
                                    if (resultDept[keyDept] !== undefined &&
                                        resultDept[keyDept] !== null &&
                                        resultDept[keyDept] !== "") {
                                        Depts += resultDept[keyDept].DEPARTMENT_CODE_ID + ",";
                                    }
                                }
                                if (Depts !== "") {
                                    Depts = "(" + Depts.substring(0, Depts.length - 1) + ")";
                                }
                                //get node staff
                                var queryNodeStaff =
                                    "SELECT NODE_ID " + //SELECT
                                    "FROM sys_hierarchy_nodes " + //FROM
                                    "WHERE TO_NODE_ID IN " + NodeDeptId; //WHERE
                                db.sequelize.query(queryNodeStaff)
                                    .success(function(staffNode) {
                                        if (staffNode === undefined || staffNode === null || staffNode.length === 0) {
                                            res.json({
                                                status: "success",
                                                count: 0,
                                                result: []
                                            });
                                            return;
                                        } else {
                                            var NodeList = "";
                                            for (var keyNode in staffNode) {
                                                if (staffNode[keyNode] !== undefined &&
                                                    staffNode[keyNode] !== null &&
                                                    staffNode[keyNode].length !== 0) {
                                                    NodeList += staffNode[keyNode].NODE_ID + ",";
                                                }
                                            }
                                            if (NodeList !== "") {
                                                NodeList = "(" + NodeList.substring(0, NodeList.length - 1) + ")";
                                            }
                                            //get list user staff
                                            var strUserStaff = "";
                                            if (isDirector === true) {
                                                strUserStaff =
                                                    "SELECT USER_ID " + //SELECT
                                                    "FROM sys_hierarchies_users " + //FROM
                                                    "WHERE NODE_ID IN " + NodeList; //WHERE
                                            } else if (isDirector === false) {
                                                strUserStaff =
                                                    "SELECT USER_ID " + //SELECT
                                                    "FROM sys_hierarchies_users " + //FROM
                                                    "WHERE NODE_ID IN" + NodeList + " AND DEPARTMENT_CODE_ID IN " + Depts; //WHERE
                                            }
                                            db.sequelize.query(strUserStaff)
                                                .success(function(resultListUser) {
                                                    if (resultListUser === undefined || resultListUser === null || resultListUser.length === 0) {
                                                        res.json({
                                                            status: "success",
                                                            count: 0,
                                                            result: []
                                                        });
                                                        return;
                                                    } else {
                                                        var listUser = "";
                                                        for (var keyUser in resultListUser) {
                                                            if (resultListUser[keyUser] !== undefined &&
                                                                resultListUser[keyUser] !== null &&
                                                                resultListUser[keyUser] !== "") {
                                                                listUser += resultListUser[keyUser].USER_ID + ",";
                                                            }
                                                        }
                                                        if (listUser !== "") {
                                                            listUser = "(" + listUser.substring(0, listUser.length - 1) + ")";
                                                        }
                                                        //get list for approver
                                                        var queryApprovedTimeSheet =
                                                            "SELECT DISTINCT time_tasks_week.task_week_id, time_tasks_week.time_charge, " + //SELECT
                                                            "time_tasks_week.start_date, time_tasks_week.end_date, " + //SELECT
                                                            "time_tasks_week.over_time, time_tasks_week.date_submited, time_tasks_week.comments, " + //SELECT
                                                            "hr_employee.Employee_Code, hr_employee.FirstName, hr_employee.LastName, " + //SELECT
                                                            "hr_employee.TypeOfContruct, time_task_status.name " + //SELECT
                                                            "FROM time_tasks_week " + //FROM
                                                            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " + //JOIN
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id " + //JOIN
                                                            "INNER JOIN time_task_status ON time_tasks_week.task_status_id = time_task_status.task_status_id " + //JOIN
                                                            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
                                                            "WHERE time_task_status.task_status_id NOT IN(1) " + //WHERE
                                                            "AND users.id IN " + listUser + strSearch + strSearchEmployee + orderBY +
                                                            " LIMIT :limit" + //LIMIT
                                                            " OFFSET :offset"; //OFFSET
                                                        //count list
                                                        var queryCountApprovedTimeSheet =
                                                            "SELECT COUNT(DISTINCT time_tasks_week.task_week_id) AS COUNT " + //SELECT
                                                            "FROM time_tasks_week " + //FORM
                                                            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " + //JOIN
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id " + //JOIN
                                                            "INNER JOIN time_task_status ON time_tasks_week.task_status_id = time_task_status.task_status_id " + //JOIN
                                                            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " + //JOIN
                                                            "WHERE time_task_status.task_status_id NOT IN(1) " + //WHERE
                                                            "AND users.id IN " + listUser + strSearch + strSearchEmployee; //WHERE
                                                        db.sequelize.query(queryApprovedTimeSheet, null, {
                                                                raw: true
                                                            }, {
                                                                limit: searchObj.limit,
                                                                offset: searchObj.offset
                                                            })
                                                            .success(function(listApproved) {
                                                                db.sequelize.query(queryCountApprovedTimeSheet)
                                                                    .success(function(count) {
                                                                        //get list employee
                                                                        var queryEmployee = "SELECT hr_employee.Employee_ID, hr_employee.Employee_Code FROM hr_employee INNER JOIN users ON " +
                                                                            " users.employee_id = hr_employee.Employee_ID WHERE users.id IN " + listUser;
                                                                        db.sequelize.query(queryEmployee)
                                                                            .success(function(listEmployee) {
                                                                                if ((listApproved === null || listApproved.length === 0) && strSearch === "" && strSearchEmployee === "") {
                                                                                    res.json({
                                                                                        status: "success",
                                                                                        count: 0,
                                                                                        result: null,
                                                                                        listEmployee: listEmployee
                                                                                    });
                                                                                    return;
                                                                                } else {
                                                                                    res.json({
                                                                                        status: "success",
                                                                                        count: count[0].COUNT,
                                                                                        result: listApproved,
                                                                                        listEmployee: listEmployee
                                                                                    });
                                                                                    return;

                                                                                }
                                                                            })
                                                                            .error(function(err) {
                                                                                console.log("*****ERROR:" + err + "*****");
                                                                                res.json({
                                                                                    status: "error",
                                                                                    count: 0,
                                                                                    result: [],
                                                                                    listEmployee: []
                                                                                });
                                                                                return;
                                                                            });
                                                                    })
                                                                    .error(function(err) {
                                                                        console.log("*****ERROR:" + err + "*****");
                                                                        res.json({
                                                                            status: "error",
                                                                            count: 0,
                                                                            result: [],
                                                                            listEmployee: []
                                                                        });
                                                                        return;
                                                                    });
                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error",
                                                                    count: 0,
                                                                    result: [],
                                                                    listEmployee: []
                                                                });
                                                                return;
                                                            });
                                                    }
                                                })
                                                .error(function(err) {
                                                    console.log("*****ERROR:" + err + "*****");
                                                    res.json({
                                                        status: "error",
                                                        count: 0,
                                                        result: [],
                                                        listEmployee: []
                                                    });
                                                    return;
                                                });
                                        }
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR:" + err + "*****");
                                        res.json({
                                            status: "error",
                                            count: 0,
                                            result: [],
                                            listEmployee: []
                                        });
                                    });
                            }
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                count: 0,
                                result: [],
                                listEmployee: []
                            });
                            return;
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    count: 0,
                    result: [],
                    listEmployee: []
                });
                return;
            });
    },
    /*
    RejectTaskWeek: rejected a Timesheet
    input: id of Timesheet
    output: - success: send message success
            - fail: send message error
    */
    RejectTaskWeek: function(req, res) {
        var info = req.body.info;
        info.date = moment().format("YYYY-MM-DD HH:mm:ss");
        info.status = 4;
        var query =
            "UPDATE time_tasks_week " + //UPDATE
            "SET task_status_id = 4, after_status_id = 4, approved_date ='" + //SET
            info.date + "', comments ='" + info.comments + //SET
            "' WHERE task_week_id = :idTaskWeek"; //WHERE
        db.sequelize.query(query, null, {
                raw: true
            }, {
                idTaskWeek: info.idTaskWeek
            })
            .success(function(result) {
                //tracker
                var tracKer = {
                    statusID: 4,
                    USER_ID: info.USER_ID,
                    idTaskWeek: info.idTaskWeek,
                    date: info.date
                };
                functionForTimesheet.TracKerTimeSheet(tracKer);
                //send mail
                functionForTimesheet.SendMailTimeSheet(req, res, info);
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
    ApproveTaskWeek: approved a Timesheet
    input: id of Timesheet
    output: - success: send message success
            - fail: send message error 
    */
    ApproveTaskWeek: function(req, res) {
        var info = req.body.info;
        var idTaskWeek = info.idTaskWeek;
        //get Timesheet's Time in lieu
        var queryGetTimeInLieu =
            "SELECT time_in_lieuChoose " + //SELECT
            "FROM time_tasks_week " + //FROM
            "WHERE task_week_id = :idTaskWeek"; //WHERE
        db.sequelize.query(queryGetTimeInLieu, null, {
                raw: true
            }, {
                idTaskWeek: idTaskWeek
            })
            .success(function(result) {
                if (result[0] !== undefined &&
                    result[0] !== null &&
                    result[0].time_in_lieuChoose > 0) {
                    var time_in_lieuChoose = result[0].time_in_lieuChoose;
                    //get user id of employee
                    var queryGetUserID =
                        "SELECT time_tasks_week.user_id " + //SELECT
                        "FROM time_tasks_week " + //FROM
                        "WHERE time_tasks_week.task_week_id = :idTaskWeek"; //WHERE
                    db.sequelize.query(queryGetUserID, null, {
                            raw: true
                        }, {
                            idTaskWeek: idTaskWeek
                        })
                        .success(function(users) {
                            if (users !== null &&
                                users[0] !== undefined &&
                                users[0] !== null &&
                                users[0].user_id !== undefined &&
                                users[0].user_id !== null) {
                                var userId = users[0].user_id;
                                var numberWeek = functionForTimesheet.defineNumberWeekTimeSheet();
                                var dateAddEnd = (7 - moment().day()) % 7;
                                var dateEnd = moment().add(dateAddEnd, 'day');
                                var weekNoEnd = functionForTimesheet.getWeekNo(dateEnd);
                                var yearEnd = moment(dateEnd).year();
                                var arrayWeekNo = [{
                                    weekNo: weekNoEnd,
                                    year: yearEnd
                                }];
                                for (var i = 0; i < numberWeek; i++) {
                                    var dateAdd = (7 - moment().day()) % 7;
                                    var lastDateOfWeek = moment().add(dateAdd, 'day').subtract((i + 1) * 7, 'day').format("YYYY-MM-DD");
                                    var weekNo = functionForTimesheet.getWeekNo(lastDateOfWeek);
                                    var yearOfFirstDate = moment(lastDateOfWeek).year();
                                    arrayWeekNo.push({
                                        weekNo: weekNo,
                                        year: yearOfFirstDate,
                                    });
                                }
                                var strWeekNo = "";
                                arrayWeekNo.forEach(function(valueWeekNo, indexWeekNo) {
                                    if (valueWeekNo !== null &&
                                        valueWeekNo.weekNo !== undefined &&
                                        valueWeekNo.weekNo !== null &&
                                        valueWeekNo.year !== undefined &&
                                        valueWeekNo.year !== null &&
                                        !isNaN(valueWeekNo.weekNo) &&
                                        !isNaN(valueWeekNo.year)) {
                                        strWeekNo += "(" + valueWeekNo.weekNo + "," + valueWeekNo.year + "), ";
                                    }
                                });
                                if (strWeekNo !== "") {
                                    strWeekNo = "(" + strWeekNo.substring(0, strWeekNo.length - 2) + ")";
                                } else {
                                    strWeekNo = "((-1,-1))";
                                }
                                //get Time in lieu of employee
                                var queryGetTimeInLieu = "SELECT time_tasks_week.time_in_lieu, time_tasks_week.task_week_id " + //SELECT
                                    "FROM time_tasks_week " + //FROM
                                    "WHERE time_tasks_week.user_id = :userId AND " + //WHERE
                                    "(time_tasks_week.week_no, YEAR(time_tasks_week.end_date)) IN " + strWeekNo;
                                db.sequelize.query(queryGetTimeInLieu, null, {
                                        raw: true
                                    }, {
                                        userId: userId
                                    })
                                    .success(function(resultTimeInLieu) {
                                        if (resultTimeInLieu !== null &&
                                            resultTimeInLieu.length !== 0) {
                                            //subtract time in lieu
                                            resultTimeInLieu.forEach(function(valueTimeInLieu, indexTimeInLieu) {
                                                if (valueTimeInLieu !== null &&
                                                    valueTimeInLieu.time_in_lieu !== undefined &&
                                                    valueTimeInLieu.time_in_lieu !== null &&
                                                    !isNaN(valueTimeInLieu.time_in_lieu) &&
                                                    valueTimeInLieu.time_in_lieu > 0 &&
                                                    time_in_lieuChoose > 0) {
                                                    if (time_in_lieuChoose <= valueTimeInLieu.time_in_lieu) {
                                                        resultTimeInLieu[indexTimeInLieu].time_in_lieu -= time_in_lieuChoose;
                                                        time_in_lieuChoose = 0;
                                                    } else {
                                                        time_in_lieuChoose -= valueTimeInLieu.time_in_lieu;
                                                        resultTimeInLieu[indexTimeInLieu].time_in_lieu = 0;
                                                    }
                                                }
                                            });

                                            //Time in lieu is not enough
                                            if (time_in_lieuChoose > 0) {
                                                res.json({
                                                    status: "error"
                                                });
                                            }

                                            //update Time in lieu
                                            var queryUpdateTimeInLieu = "UPDATE time_tasks_week " + //UPDATE
                                                "SET time_tasks_week.time_in_lieu = :timeInLieu " +
                                                "WHERE time_tasks_week.task_week_id = :taskWeekId";
                                            resultTimeInLieu.forEach(function(valueTimeInLieu, indexTimeInLieu) {
                                                chainer.add(
                                                    db.sequelize.query(queryUpdateTimeInLieu, null, {
                                                        raw: true
                                                    }, {
                                                        timeInLieu: valueTimeInLieu.time_in_lieu,
                                                        taskWeekId: valueTimeInLieu.task_week_id
                                                    }))
                                            });
                                            chainer.runSerially()
                                                .success(function(resultSuccess) {
                                                    //SET APPROVE
                                                    info.date = moment().format("YYYY-MM-DD HH:mm:ss");
                                                    info.status = 3;
                                                    db.sequelize.transaction(function(t) {
                                                        db.timeTaskWeek.update({
                                                                task_status_id: 3,
                                                                approved_date: info.date,
                                                                time_in_lieu: info.time_in_lieuFull,
                                                                over_time: info.over_timeFull
                                                            }, {
                                                                task_week_id: info.idTaskWeek
                                                            }, {
                                                                transaction: t
                                                            })
                                                            .success(function(result) {
                                                                //transfer data to ERP system
                                                                var queryGetInfoTimeWeek =
                                                                    "SELECT DISTINCT hr_employee.Employee_Code, " + //SELECT
                                                                    "time_tasks_week.start_date, time_tasks_week.end_date, time_tasks_week.over_time, " + //SELECT
                                                                    "time_tasks_week.week_no, time_item_task.time_charge as time_charge_item, time_item_task.item_id, " + //SELECT
                                                                    "time_item_code.item_name, time_tasks.time_charge as time_charge_task " + //SELECT
                                                                    "FROM hr_employee " + //FROM
                                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                                                    "INNER JOIN time_tasks_week ON time_tasks_week.user_id = users.id " + //JOIN
                                                                    "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " + //JOIN
                                                                    "LEFT JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " + //JOIN
                                                                    "LEFT JOIN time_item_code ON time_item_task.item_id = time_item_code.item_id " + //JOIN
                                                                    "WHERE time_tasks_week.task_week_id = :taskWeekId";
                                                                db.sequelize.query(queryGetInfoTimeWeek, null, {
                                                                        raw: true
                                                                    }, {
                                                                        taskWeekId: info.idTaskWeek
                                                                    })
                                                                    .success(function(resultInfoTimeWeek) {
                                                                        if (resultInfoTimeWeek !== undefined &&
                                                                            resultInfoTimeWeek !== null &&
                                                                            resultInfoTimeWeek.length !== 0) {
                                                                            var paidHour = 0,
                                                                                publicHoliday = 0,
                                                                                carerPersonal = 0,
                                                                                annualLeave = 0,
                                                                                overTime = 0,
                                                                                nonPaid = 0;
                                                                            resultInfoTimeWeek.forEach(function(valueResultInfoTimeWeek, indexResultInfoTimeWeek) {
                                                                                //sum puclic holiday
                                                                                if (valueResultInfoTimeWeek !== undefined &&
                                                                                    valueResultInfoTimeWeek !== null &&
                                                                                    valueResultInfoTimeWeek.item_id == 26) {
                                                                                    publicHoliday += valueResultInfoTimeWeek.time_charge_item;
                                                                                }

                                                                                //sum carer/personal
                                                                                else if (valueResultInfoTimeWeek !== undefined &&
                                                                                    valueResultInfoTimeWeek !== null &&
                                                                                    (valueResultInfoTimeWeek.item_id == 15 ||
                                                                                        valueResultInfoTimeWeek.item_id == 16 ||
                                                                                        valueResultInfoTimeWeek.item_id == 24)) {
                                                                                    carerPersonal += valueResultInfoTimeWeek.time_charge_item;
                                                                                }

                                                                                //sum annual leave
                                                                                else if (valueResultInfoTimeWeek !== undefined &&
                                                                                    valueResultInfoTimeWeek !== null &&
                                                                                    (valueResultInfoTimeWeek.item_id == 17)) {
                                                                                    annualLeave += valueResultInfoTimeWeek.time_charge_item;
                                                                                }

                                                                                //sum non-pain
                                                                                else if (valueResultInfoTimeWeek !== undefined &&
                                                                                    valueResultInfoTimeWeek !== null &&
                                                                                    (valueResultInfoTimeWeek.item_id == 19)) {
                                                                                    nonPaid += valueResultInfoTimeWeek.time_charge_item;
                                                                                }

                                                                                //sum pain-hour
                                                                                else if (valueResultInfoTimeWeek !== undefined &&
                                                                                    valueResultInfoTimeWeek !== null) {
                                                                                    if (valueResultInfoTimeWeek.item_id !== undefined &&
                                                                                        valueResultInfoTimeWeek.item_id !== null &&
                                                                                        valueResultInfoTimeWeek.item_id !== "" &&
                                                                                        valueResultInfoTimeWeek.item_id != 18) {
                                                                                        paidHour += valueResultInfoTimeWeek.time_charge_item;
                                                                                    } else {
                                                                                        paidHour += valueResultInfoTimeWeek.time_charge_task;
                                                                                    }
                                                                                }
                                                                            });
                                                                            var objectTranfer = {
                                                                                pEMPLOYEE_CODE: resultInfoTimeWeek[0].Employee_Code,
                                                                                pWEEKNO: moment(resultInfoTimeWeek[0].end_date).format("YYYY") + resultInfoTimeWeek[0].week_no,
                                                                                pFROMDATE: moment(resultInfoTimeWeek[0].start_date).format("YYYY-MM-DD"),
                                                                                pTODATE: moment(resultInfoTimeWeek[0].end_date).format("YYYY-MM-DD"),
                                                                                pPAID_HOUR: paidHour,
                                                                                pNON_PAID: nonPaid,
                                                                                pOVER_TIME: resultInfoTimeWeek[0].over_time,
                                                                                pPUBLIC_HOLIDAY: publicHoliday,
                                                                                pANNUAL_LEAVE: annualLeave,
                                                                                pCARER_PERSONAL: carerPersonal
                                                                            };

                                                                            setTimeout(function() {
                                                                                t.rollback();
                                                                                res.json({
                                                                                    status: "error-erp"
                                                                                });
                                                                                return;
                                                                            }, 30000);

                                                                            ServiceErp.transferTimeWeek(objectTranfer).then(function(resultErp) {
                                                                                if (resultErp !== undefined &&
                                                                                    resultErp !== null &&
                                                                                    resultErp.data === true) {
                                                                                    //tracker
                                                                                    var tracKer = {
                                                                                        statusID: 3,
                                                                                        USER_ID: info.USER_ID,
                                                                                        idTaskWeek: info.idTaskWeek,
                                                                                        date: info.date
                                                                                    };

                                                                                    functionForTimesheet.TracKerTimeSheet(tracKer);


                                                                                    //send mail
                                                                                    functionForTimesheet.SendMailTimeSheet(req, res, info);

                                                                                    t.commit();

                                                                                    res.json({
                                                                                        status: "success"
                                                                                    });
                                                                                    return;

                                                                                } else {
                                                                                    t.rollback();
                                                                                    res.json({
                                                                                        status: "error"
                                                                                    });
                                                                                }
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

                                                            })
                                                            .error(function(err) {
                                                                console.log("*****ERROR:" + err + "*****");
                                                                res.json({
                                                                    status: "error"
                                                                });
                                                                return;
                                                            });
                                                    });
                                                })
                                                .error(function(err) {

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
                }
                //not choose Time in lieu
                info.date = moment().format("YYYY-MM-DD HH:mm:ss");
                info.status = 3;
                db.sequelize.transaction(function(t) {
                    db.timeTaskWeek.update({
                            task_status_id: 3,
                            approved_date: info.date,
                            time_in_lieu: info.time_in_lieuFull,
                            over_time: info.over_timeFull
                        }, {
                            task_week_id: info.idTaskWeek
                        }, {
                            transaction: t
                        })
                        .success(function(result) {
                            //transfer data to ERP system
                            var queryGetInfoTimeWeek =
                                "SELECT DISTINCT hr_employee.Employee_Code, " + //SELECT
                                "time_tasks_week.start_date, time_tasks_week.end_date, time_tasks_week.over_time, " + //SELECT
                                "time_tasks_week.week_no, time_item_task.time_charge as time_charge_item, time_item_task.item_id, " + //SELECT
                                "time_item_code.item_name, time_tasks.time_charge as time_charge_task " + //SELECT
                                "FROM hr_employee " + //FROM
                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                "INNER JOIN time_tasks_week ON time_tasks_week.user_id = users.id " + //JOIN
                                "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " + //JOIN
                                "LEFT JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " + //JOIN
                                "LEFT JOIN time_item_code ON time_item_task.item_id = time_item_code.item_id " + //JOIN
                                "WHERE time_tasks_week.task_week_id = :taskWeekId";
                            db.sequelize.query(queryGetInfoTimeWeek, null, {
                                    raw: true
                                }, {
                                    taskWeekId: info.idTaskWeek
                                })
                                .success(function(resultInfoTimeWeek) {
                                    if (resultInfoTimeWeek !== undefined &&
                                        resultInfoTimeWeek !== null &&
                                        resultInfoTimeWeek.length !== 0) {
                                        var paidHour = 0,
                                            publicHoliday = 0,
                                            carerPersonal = 0,
                                            annualLeave = 0,
                                            overTime = 0,
                                            nonPaid = 0;
                                        resultInfoTimeWeek.forEach(function(valueResultInfoTimeWeek, indexResultInfoTimeWeek) {
                                            //sum public holiday
                                            if (valueResultInfoTimeWeek !== undefined &&
                                                valueResultInfoTimeWeek !== null &&
                                                valueResultInfoTimeWeek.item_id == 26) {
                                                publicHoliday += valueResultInfoTimeWeek.time_charge_item;
                                            }

                                            //sum carer/personal
                                            else if (valueResultInfoTimeWeek !== undefined &&
                                                valueResultInfoTimeWeek !== null &&
                                                (valueResultInfoTimeWeek.item_id == 15 ||
                                                    valueResultInfoTimeWeek.item_id == 16 ||
                                                    valueResultInfoTimeWeek.item_id == 24)) {
                                                carerPersonal += valueResultInfoTimeWeek.time_charge_item;
                                            }

                                            //sum annual leave
                                            else if (valueResultInfoTimeWeek !== undefined &&
                                                valueResultInfoTimeWeek !== null &&
                                                (valueResultInfoTimeWeek.item_id == 17)) {
                                                annualLeave += valueResultInfoTimeWeek.time_charge_item;
                                            }

                                            //sum non-pain
                                            else if (valueResultInfoTimeWeek !== undefined &&
                                                valueResultInfoTimeWeek !== null &&
                                                (valueResultInfoTimeWeek.item_id == 19)) {
                                                nonPaid += valueResultInfoTimeWeek.time_charge_item;
                                            }

                                            //sum pain-hour
                                            else if (valueResultInfoTimeWeek !== undefined &&
                                                valueResultInfoTimeWeek !== null) {
                                                if (valueResultInfoTimeWeek.item_id !== undefined &&
                                                    valueResultInfoTimeWeek.item_id !== null &&
                                                    valueResultInfoTimeWeek.item_id !== "" &&
                                                    valueResultInfoTimeWeek.item_id != 18) {
                                                    paidHour += valueResultInfoTimeWeek.time_charge_item;
                                                } else {
                                                    paidHour += valueResultInfoTimeWeek.time_charge_task;
                                                }
                                            }
                                        });
                                        var objectTranfer = {
                                            pEMPLOYEE_CODE: resultInfoTimeWeek[0].Employee_Code,
                                            pWEEKNO: moment(resultInfoTimeWeek[0].end_date).format("YYYY") + resultInfoTimeWeek[0].week_no,
                                            pFROMDATE: moment(resultInfoTimeWeek[0].start_date).format("YYYY-MM-DD"),
                                            pTODATE: moment(resultInfoTimeWeek[0].end_date).format("YYYY-MM-DD"),
                                            pPAID_HOUR: paidHour,
                                            pNON_PAID: nonPaid,
                                            pOVER_TIME: resultInfoTimeWeek[0].over_time,
                                            pPUBLIC_HOLIDAY: publicHoliday,
                                            pANNUAL_LEAVE: annualLeave,
                                            pCARER_PERSONAL: carerPersonal
                                        };

                                        setTimeout(function() {
                                            t.rollback();
                                            res.json({
                                                status: "error-erp"
                                            });
                                            return;
                                        }, 30000);

                                        ServiceErp.transferTimeWeek(objectTranfer).then(function(resultErp) {
                                            if (resultErp !== undefined &&
                                                resultErp !== null &&
                                                resultErp.data === true) {
                                                //tracker
                                                var tracKer = {
                                                    statusID: 3,
                                                    USER_ID: info.USER_ID,
                                                    idTaskWeek: info.idTaskWeek,
                                                    date: info.date
                                                };

                                                functionForTimesheet.TracKerTimeSheet(tracKer);


                                                //send mail
                                                functionForTimesheet.SendMailTimeSheet(req, res, info);

                                                t.commit();

                                                res.json({
                                                    status: "success"
                                                });
                                                return;

                                            } else {
                                                t.rollback();
                                                res.json({
                                                    status: "error"
                                                });
                                            }
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
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error"
                            });
                            return;
                        });
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

};
