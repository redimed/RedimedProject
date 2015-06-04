//EXPORTS MODEL
var db = require("../../models");
var moment = require('moment');
var functionForTimesheet=require("./functionForTimesheet");
//END
module.exports = {
    ViewApproved: function(req, res) {
        //DECLARATION
        var idTaskWeek = req.body.info;
        // END DECLARATION
        // QUERY 
        var strQuery = "SELECT SUM(time_tasks.time_charge) AS sumDATE, time_tasks.date, time_tasks.tasks_id, " +
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date, time_tasks_week.user_id, " +
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, time_tasks_week.over_time, " +
            "time_task_status.name AS status, time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " +
            "FROM time_tasks INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "INNER JOIN users ON time_tasks_week.user_id = users.id " +
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE time_tasks.tasks_week_id = " + idTaskWeek + " GROUP BY time_tasks.date ORDER BY time_tasks.date";
        var strActivity = "SELECT SUM(time_tasks.time_charge) AS sumAC, time_tasks.date, " +
            "time_tasks.activity_id, time_tasks_week.start_date, time_tasks_week.end_date,  " +
            "time_tasks_week.task_week_id, time_tasks_week.time_in_lieu, time_tasks.time_charge, time_tasks_week.over_time, " +
            "time_task_status.name AS status, time_task_status.task_status_id, time_tasks_week.time_charge as chargeWeek, hr_employee.FirstName, hr_employee.LastName " +
            "FROM time_tasks INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "INNER JOIN users ON time_tasks_week.user_id = users.id " +
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "WHERE time_tasks.tasks_week_id = " + idTaskWeek + " GROUP BY time_tasks.date, time_activity.activity_id ORDER BY time_tasks.date";
        // END QUERY
        db.sequelize.query(strQuery)
            .success(function(result) {
                //CHECK LEAVE
                var queryGetLeaveApprove = "SELECT hr_leave.start_date, hr_leave.finish_date " +
                    "FROM hr_leave " +
                    "WHERE hr_leave.user_id = :userId AND hr_leave.status_id = 3";
                db.sequelize.query(queryGetLeaveApprove, null, {
                        raw: true
                    }, {
                        userId: result[0].user_id
                    })
                    .success(function(resultLeaveApprove) {
                        var forPermission = true;
                        if (resultLeaveApprove !== undefined &&
                            resultLeaveApprove !== null &&
                            resultLeaveApprove.length !== 0) {
                            //CHECK EXIST LEAVE
                            for (var keyTimeSheet in result) {
                                var checkExistLeave = false;
                                var date = moment(moment(result[keyTimeSheet].date).format("YYYY-MM-DD")).format("X");
                                for (var keyLeave in resultLeaveApprove) {
                                    var startDate = moment(moment(resultLeaveApprove[keyLeave].start_date).format("YYYY-MM-DD")).format("X");
                                    var finishDate = moment(moment(resultLeaveApprove[keyLeave].finish_date).format("YYYY-MM-DD")).format("X");
                                    if ((result[keyTimeSheet].activity_id === 15 ||
                                            result[keyTimeSheet].activity_id === 16 ||
                                            result[keyTimeSheet].activity_id === 17 ||
                                            result[keyTimeSheet].activity_id === 19 ||
                                            result[keyTimeSheet].activity_id === 25) &&
                                        date >= startDate &&
                                        date <= finishDate) {
                                        checkExistLeave = true;
                                    }
                                }
                                if (checkExistLeave === false) {
                                    forPermission = false;
                                }
                            }
                            //END CHECK EXIST LEAVE
                        } else {
                            forPermission = false;
                        }
                        //GET TIME SHEET
                        if (result === undefined || result === null || result.length === 0) {
                            res.json({
                                status: "success",
                                result: [],
                                resultActivity: [],
                                forPermission: forPermission
                            });
                            return;
                        } else {
                            db.sequelize.query(strActivity)
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
                        //END GET TIME SHEET
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error"
                        });
                        return;
                    });
                //END CHECK LEAVE
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

    ViewOnDate: function(req, res) {
        var info = req.body.info;
        var strQuery = "SELECT DISTINCT time_tasks.date,time_tasks.tasks_id, time_tasks.task,time_item_task.units,time_item_code.ITEM_NAME,time_item_task.ITEM_ID, " +
            "time_item_code.IS_BILLABLE, time_item_task.ratio, time_activity.NAME, time_location.NAME AS LOCATION, departments.departmentName, " +
            "time_tasks.time_charge, time_item_task.item_id, time_item_task.deleted, time_item_task.time_charge as chargeItem, time_item_task.comment, " +
            "hr_employee.FirstName, hr_employee.LastName, time_tasks_week.start_date, time_tasks_week.end_date, " +
            "time_tasks_week.time_charge as chargeWeek, time_task_status.name AS status FROM time_tasks " +
            "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = time_tasks.tasks_week_id " +
            "INNER JOIN users ON users.id=time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            "LEFT JOIN time_activity ON time_activity.activity_id = time_tasks.activity_id " +
            "LEFT JOIN time_location ON time_location.location_id = time_tasks.location_id " +
            "LEFT JOIN departments ON departments.departmentid = time_tasks.department_code_id " +
            "LEFT OUTER JOIN time_item_task ON time_tasks.tasks_id = time_item_task.task_id AND time_item_task.deleted = 0 " +
            "LEFT JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id " +
            "WHERE time_tasks.date = '" + info.DATE + "' AND time_tasks.tasks_week_id = " + info.ID +
            " AND time_tasks.deleted = 0" +
            " ORDER BY time_tasks.order ASC";
        db.sequelize.query(strQuery)
            .success(function(result) {
                db.sequelize.query("SELECT DISTINCT t.`tasks_id`, c.`item_id` as ITEM_ID, " +
                        "time_task_file.path_file, time_task_file.file_id, time_task_file.file_name, time_task_file.file_size " +
                        "FROM `time_tasks` t INNER JOIN `time_item_task` i ON i.`task_id` = t.`tasks_id` " +
                        "INNER JOIN `time_item_code` c ON c.`ITEM_ID` = i.`item_id`" +
                        "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = t.tasks_week_id " +
                        "INNER JOIN time_item_file ON time_item_file.task_id = i.task_id AND time_item_file.item_id = i.item_id " +
                        "INNER JOIN time_task_file ON time_task_file.file_id = time_item_file.file_id " +
                        " WHERE " +
                        "t.`tasks_week_id` = ?", null, {
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
        //end search

        //select
        for (var keySelect in searchObj.select) {
            if (searchObj.select[keySelect] !== undefined &&
                searchObj.select[keySelect] !== null &&
                searchObj.select[keySelect] !== "") {
                strSearch += keySelect + " = " + searchObj.select[keySelect] + " AND ";
            }
        }
        //end select

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
        //get NODE_ID Head of Dept. on TIMESHEET
        var strQueryGetNodeDept = "SELECT sys_hierarchy_nodes.NODE_ID, sys_hierarchy_nodes.NODE_CODE FROM sys_hierarchy_nodes INNER JOIN sys_hierarchy_group ON " +
            "sys_hierarchy_nodes.GROUP_ID = sys_hierarchy_group.GROUP_ID INNER JOIN sys_hierarchies_types ON " +
            " sys_hierarchies_types.TYPE_NAME = sys_hierarchy_group.GROUP_TYPE INNER JOIN sys_hierarchies_users ON " +
            "sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID WHERE sys_hierarchies_users.USER_ID = " + searchObj.USER_ID +
            " AND sys_hierarchies_types.TYPE_NAME='Time Sheet'";
        db.sequelize.query(strQueryGetNodeDept)
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
                    //get list Dept's manager
                    var strQueryDeptList = "SELECT sys_hierarchies_users.DEPARTMENT_CODE_ID FROM sys_hierarchies_users WHERE NODE_ID IN " +
                        NodeDeptId + " AND sys_hierarchies_users.USER_ID = " +
                        searchObj.USER_ID;
                    db.sequelize.query(strQueryDeptList)
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
                                var queryNodeStaff = "SELECT NODE_ID FROM sys_hierarchy_nodes WHERE TO_NODE_ID IN " + NodeDeptId;
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
                                                strUserStaff = "SELECT USER_ID FROM sys_hierarchies_users WHERE NODE_ID IN" +
                                                    NodeList;
                                            } else if (isDirector === false) {
                                                strUserStaff = "SELECT USER_ID FROM sys_hierarchies_users WHERE NODE_ID IN" +
                                                    NodeList + " AND DEPARTMENT_CODE_ID IN " + Depts;
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
                                                        //get list approved
                                                        var queryApprovedTimeSheet = "SELECT DISTINCT time_tasks_week.task_week_id, time_tasks_week.time_charge, time_tasks_week.start_date, time_tasks_week.end_date, " +
                                                            "time_tasks_week.over_time, time_tasks_week.date_submited, time_tasks_week.comments, " +
                                                            "hr_employee.Employee_Code, hr_employee.FirstName, hr_employee.LastName, hr_employee.TypeOfContruct, time_task_status.name " +
                                                            "FROM time_tasks_week INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN time_task_status ON " +
                                                            "time_tasks_week.task_status_id = time_task_status.task_status_id INNER JOIN hr_employee ON " +
                                                            "hr_employee.Employee_ID = users.employee_id WHERE time_task_status.task_status_id NOT IN(1) " +
                                                            " AND users.id IN " + listUser + strSearch + strSearchEmployee + orderBY + " LIMIT " + searchObj.limit +
                                                            " OFFSET " + searchObj.offset;
                                                        var queryCountApprovedTimeSheet = "SELECT COUNT(DISTINCT time_tasks_week.task_week_id) AS COUNT " +
                                                            "FROM time_tasks_week INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                                            "INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN time_task_status ON " +
                                                            "time_tasks_week.task_status_id = time_task_status.task_status_id INNER JOIN hr_employee ON " +
                                                            "hr_employee.Employee_ID = users.employee_id WHERE time_task_status.task_status_id NOT IN(1) " +
                                                            " AND users.id IN " + listUser + strSearch + strSearchEmployee;
                                                        db.sequelize.query(queryApprovedTimeSheet)
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
                                                                                //end get list employee
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
    
    RejectTaskWeek: function(req, res) {
        var info = req.body.info;
        info.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        info.status = 4;
        var query = "UPDATE time_tasks_week SET task_status_id = 4, after_status_id = 4, approved_date ='" + info.date + "', comments ='" +
            info.comments + "' WHERE task_week_id = " + info.idTaskWeek;
        db.sequelize.query(query)
            .success(function(result) {
                //TRACKER
                var tracKer = {
                    statusID: 4,
                    USER_ID: info.USER_ID,
                    idTaskWeek: info.idTaskWeek,
                    date: info.date
                };
                //CALL FUNCTION TRACKER
                functionForTimesheet.TracKerTimeSheet(tracKer);
                //END
                // SEND MAIL
                functionForTimesheet.SendMailTimeSheet(req, res, info);
                // END MAIL

                //END TRACKER
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

    ApproveTaskWeek: function(req, res) {
        var info = req.body.info;
        var idTaskWeek = info.idTaskWeek;
        var queryGetTimeInLieu = "SELECT time_in_lieuChoose FROM  time_tasks_week WHERE task_week_id = " + idTaskWeek;
        db.sequelize.query(queryGetTimeInLieu)
            .success(function(result) {
                if (result[0] !== undefined && result[0] !== null && result[0].time_in_lieuChoose > 0) {
                    //processing time in lieu
                    var time_in_lieuChoose = result[0].time_in_lieuChoose;
                    //GET USER ID OF EMPLOYEE
                    var queryGetUserID = "SELECT user_id FROM time_tasks_week WHERE task_week_id = " + idTaskWeek;
                    db.sequelize.query(queryGetUserID)
                        .success(function(users) {
                            if (users[0] !== undefined && users[0] !== null) {
                                var USER_ID = users[0].user_id;
                                var weekNo = getWeekNo();
                                var weekStart = weekNo - 4;
                                //GET TIME IN LIEU 4 WEEK
                                var queryGet4Week = "SELECT task_week_id, time_in_lieu FROM time_tasks_week WHERE user_id = " + USER_ID +
                                    " AND week_no  BETWEEN " + weekStart + " AND " + weekNo + " AND task_status_id = 3 ";
                                db.sequelize.query(queryGet4Week)
                                    .success(function(listWeek) {
                                        if (listWeek === undefined || listWeek === null || listWeek.length === 0) {
                                            console.log("*****ERROR: User has not time in lieu *****");
                                            res.json({
                                                status: "error"
                                            });

                                        } else {
                                            var Weeks = listWeek;
                                            //CHECK NULL OR 0 DELETE
                                            for (var i = 0; i < Weeks.length; i++) {
                                                if (Weeks[i].time_in_lieu === undefined ||
                                                    Weeks[i].time_in_lieu === null ||
                                                    Weeks[i].time_in_lieu === 0) {
                                                    Weeks.splice(i, 1);
                                                } else {
                                                    //MINUS TIME IN LIEU REST
                                                    if (time_in_lieuChoose <= Weeks[i].time_in_lieu) {
                                                        Weeks[i].time_in_lieu = Weeks[i].time_in_lieu - time_in_lieuChoose;
                                                        time_in_lieuChoose = 0;
                                                        break;
                                                    } else {
                                                        time_in_lieuChoose = time_in_lieuChoose - Weeks[i].time_in_lieu;
                                                        Weeks[i].time_in_lieu = 0;
                                                    }
                                                }
                                            }
                                            //END CHECK

                                            //UPDATE TIME IN LIEU FOR WEEK BEFORE
                                            for (var j = 0; j < Weeks.length; j++) {
                                                var queryUpdateTimeInLieu = "UPDATE time_tasks_week SET time_in_lieu = " + Weeks[j].time_in_lieu + " WHERE task_week_id = " + Weeks[j].task_week_id;
                                                db.sequelize.query(queryUpdateTimeInLieu)
                                                    .success(function(success) {
                                                        res.json({
                                                            status: "success"
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
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error"
                            });
                            return;
                        });
                    //END
                } else {
                    console.log("*****Not found time in lieu choose of this week *****");
                }
                //SET APPROVE
                info.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                info.status = 3;
                var timeType = "";
                if (info.time_rest !== 0 && info.time_rest !== null && info.time_rest !== undefined) {
                    if (info.time_in_lieuFull !== undefined && info.time_in_lieuFull !== null) {
                        timeType += ", time_in_lieu = " + info.time_in_lieuFull;
                    }
                    if (info.over_timeFull !== undefined && info.over_timeFull !== null) {
                        timeType += ", over_time = " + info.over_timeFull;
                    }
                }
                var query = "UPDATE time_tasks_week SET task_status_id = 3, approved_date = '" + info.date + "'" + timeType + " WHERE task_week_id = " + idTaskWeek;
                db.sequelize.query(query)
                    .success(function(result) {
                        //TRACKER
                        var tracKer = {
                            statusID: 3,
                            USER_ID: info.USER_ID,
                            idTaskWeek: info.idTaskWeek,
                            date: info.date
                        };

                        //CALL FUNCTION TRACKER
                        functionForTimesheet.TracKerTimeSheet(tracKer);
                        //END

                        // SEND MAIL
                        functionForTimesheet.SendMailTimeSheet(req, res, info);
                        // ENE MAIL

                        //END TRACKER
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

                //END
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
