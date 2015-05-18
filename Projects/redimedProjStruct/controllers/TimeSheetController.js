/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;
var FunctionSendMail = require("../controllers/TimeSheetController/timeSheetEmailController.js");
module.exports = {
    addAllTask: function(req, res) {
        var allTask = req.body.allTask;
        var info = req.body.info;
        db.timeTaskWeek.create({
                start_date: info.startWeek,
                end_date: info.endWeek,
                week_no: info.weekNo,
                time_charge: info.time_temp,
                user_id: info.userID,
                created_by: info.userID,
                task_status_id: info.statusID,
                time_in_lieuChoose: info.time_in_lieuFull
            }, {
                raw: true
            })
            .success(function(data) {
                db.timeTaskWeek.max('task_week_id')
                    .success(function(max) {
                        db.timeTasks.max('tasks_id')
                            .success(function(id) {
                                var tId = id;
                                for (var task in allTask) {
                                    tId = tId + 1;
                                    chainer.add(
                                        db.timeTasks.create({
                                            tasks_id: tId,
                                            tasks_week_id: max,
                                            "department_code_id": allTask[task].department_code_id,
                                            "task": allTask[task].task,
                                            "isParent": allTask[task].isParent,
                                            "order": allTask[task].order,
                                            "date": moment(allTask[task].date).format('YYYY-MM-DD'),
                                            "location_id": allTask[task].location_id,
                                            "activity_id": allTask[task].activity_id,
                                            "time_charge": allTask[task].time_temp
                                        })
                                    )
                                    if (allTask[task].item.length > 0) {
                                        for (var i = 0; i < allTask[task].item.length; i++) {
                                            var a = allTask[task].item[i];
                                            chainer.add(
                                                db.TimeItemTask.create({
                                                    task_id: tId,
                                                    item_id: a.ITEM_ID,
                                                    units: a.totalUnits,
                                                    ratio: a.ratio,
                                                    time_charge: a.time_temp,
                                                    comment: a.comment
                                                })
                                            )

                                        }
                                    }
                                }

                            })
                            .error(function(err) {
                                res.json({
                                    status: 'error'
                                });
                                console.log(err);
                            });

                        chainer.runSerially()
                            .success(function(result) {
                                if (result[0] !== undefined && result[0].dataValues !== undefined && result[0].dataValues.tasks_week_id !== undefined) {
                                    //TRACKER
                                    info.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                    var idTaskWeek = result[0].dataValues.tasks_week_id;
                                    var tracKer = {
                                        statusID: info.statusID,
                                        USER_ID: info.userID,
                                        idTaskWeek: idTaskWeek,
                                        date: info.date
                                    };
                                    //CALL FUNCTION TRACKER
                                    TracKerTimeSheet(tracKer);
                                    //END
                                    //END TRACKER

                                    //FUNCTION SEND MAIL
                                    if (info.statusID === 2) {
                                        SendMailSubmit(req, res, info);
                                    }
                                    //END SEND MAIL
                                }
                                res.json({
                                    status: 'success'
                                });
                            }).error(function(err) {
                                res.json({
                                    status: 'error'
                                });
                                console.log(err);
                            });
                    })
                    .error(function(err) {
                        res.json({
                            status: 'error'
                        });
                        console.log(err);
                    });
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });

    },

    editTask: function(req, res) {
        var allTask = req.body.allTask;
        var info = req.body.info;
        db.timeTasks.max('tasks_id')
            .success(function(id) {
                var tId = id;
                for (var i = 0; i < allTask.length; i++) {
                    tId = tId + 1;
                    if (allTask[i].isAction == 'update') {
                        chainer.add(
                            db.timeTasks.update({
                                "order": allTask[i].order,
                                "department_code_id": allTask[i].department_code_id,
                                "task": allTask[i].task,
                                "date": allTask[i].date,
                                "location_id": allTask[i].location_id,
                                "activity_id": allTask[i].activity_id,
                                "time_charge": allTask[i].time_temp
                            }, {
                                tasks_id: allTask[i].tasks_id
                            })
                        )

                        var taskId = allTask[i].tasks_id;

                        if (allTask[i].item.length > 0) {
                            for (var j = 0; j < allTask[i].item.length; j++) {
                                var a = allTask[i].item[j];
                                if (a.isAction == 'insert') {
                                    chainer.add(
                                        db.TimeItemTask.create({
                                            task_id: taskId,
                                            item_id: a.ITEM_ID,
                                            units: a.totalUnits,
                                            ratio: a.ratio,
                                            time_charge: a.time_temp,
                                            comment: a.comment,
                                        })
                                    )
                                } else if (a.isAction == 'update') {
                                    chainer.add(
                                        db.TimeItemTask.update({
                                            units: a.totalUnits,
                                            ratio: a.ratio,
                                            time_charge: a.time_temp,
                                            comment: a.comment
                                        }, {
                                            task_id: taskId,
                                            item_id: a.ITEM_ID
                                        })
                                    )
                                } else if (a.isAction == 'delete') {
                                    chainer.add(
                                        db.TimeItemTask.update({
                                            'deleted': 1
                                        }, {
                                            item_id: a.ITEM_ID,
                                            task_id: taskId
                                        })
                                    )
                                }
                            }
                        }

                    } else if (allTask[i].isAction == 'insert') {

                        chainer.add(
                            db.timeTasks.create({
                                tasks_id: tId,
                                "tasks_week_id": info.idWeek,
                                "department_code_id": allTask[i].department_code_id,
                                "task": allTask[i].task,
                                "order": allTask[i].order,
                                "date": moment(allTask[i].date).format('YYYY-MM-DD'),
                                "location_id": allTask[i].location_id,
                                "activity_id": allTask[i].activity_id,
                                "time_charge": allTask[i].time_temp
                            })
                        )



                        if (allTask[i].item.length > 0) {
                            for (var j = 0; j < allTask[i].item.length; j++) {
                                var a = allTask[i].item[j];
                                chainer.add(
                                    db.TimeItemTask.create({
                                        task_id: tId,
                                        item_id: a.ITEM_ID,
                                        units: a.totalUnits,
                                        ratio: a.ratio,
                                        time_charge: a.time_temp,
                                        comment: a.comment
                                    })
                                )

                            }
                        }

                    } else if (allTask[i].isAction == 'delete') {
                        chainer.add(
                            db.timeTasks.update({
                                "deleted": 1
                            }, {
                                tasks_id: allTask[i].tasks_id
                            })
                        )

                        var taskId = allTask[i].tasks_id;

                        if (allTask[i].item.length > 0) {
                            for (var j = 0; j < allTask[i].item.length; j++) {
                                var a = allTask[i].item[j];

                                chainer.add(
                                    db.TimeItemTask.update({
                                        'deleted': 1
                                    }, {
                                        item_id: a.ITEM_ID,
                                        task_id: taskId
                                    })
                                )

                            }
                        }
                    }
                }
                chainer.add(
                    db.timeTaskWeek.update({
                        time_charge: info.time_temp,
                        task_status_id: info.statusID
                    }, {
                        task_week_id: info.idWeek
                    })
                )
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: 'error'
                });
            })

        chainer.runSerially().success(function(result) {
            //TRACKER
            var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            var idTaskWeek = info.idWeek;
            var tracKer = {
                statusID: info.statusID,
                USER_ID: info.userID,
                idTaskWeek: idTaskWeek,
                date: date
            };
            //CALL FUNCTION TRACKER
            TracKerTimeSheet(tracKer);
            //END
            //END TRACKER

            //FUNCTION SEND MAIL
            if (info.statusID === 5 || info.statusID === 2) {
                SendMailSubmit(req, res, info);
            }
            //END SEND MAIL

            res.json({
                status: 'success'
            });
        }).error(function(err) {
            console.log("*****ERROR:" + err + "*****");
            res.json({
                status: 'error'
            });
        });
    },

    getItemList: function(req, res) {
        var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
        var fields = req.body.fields;
        var search_data = req.body.search;
        var agrs = [];
        for (var key in search_data) {
            if (search_data[key])
                agrs.push(key + " LIKE '" + search_data[key] + "%'");
        }

        var whereOpt = agrs.length ? db.Sequelize.and.apply(null, agrs) : null;

        db.TimeItemCode.findAndCountAll({
                where: whereOpt,
                offset: offset,
                limit: limit,
                attributes: fields,
                order: 'Creation_date DESC'
            }).success(function(result) {
                res.json({
                    "status": "success",
                    "list": result.rows,
                    "count": result.count
                });
            })
            .error(function(error) {
                res.json(500, {
                    "status": "error",
                    "message": error
                });
            });
    },



    getDepartmentLocation: function(req, res) {
        db.timeLocation.findAll({
                raw: true
            })
            .success(function(location) {
                if (location === null || location.length === 0) {
                    console.log("Not found location in table");
                    res.json({
                        status: 'fail'
                    });
                    return false;
                } else {
                    db.Departments.findAll({
                            where: {
                                departmentType: 'Time Sheet'
                            }
                        }, {
                            raw: true
                        })
                        .success(function(department) {
                            if (department === null || department.length === 0) {
                                console.log("Not found department in table");
                                res.json({
                                    status: 'fail'
                                });
                                return false;
                            } else {
                                db.sequelize.query("SELECT a.`activity_id`, a.`NAME` FROM `time_activity` a", null, {
                                        raw: true
                                    })
                                    .success(function(activity) {
                                        if (activity === null || activity.length === 0) {
                                            console.log("Not found activity in table");
                                            res.json({
                                                status: 'fail'
                                            });
                                            return false;
                                        } else {
                                            res.json({
                                                location: location,
                                                department: department,
                                                activity: activity
                                            });
                                        }
                                    })
                                    .error(function(err) {
                                        res.json({
                                            status: 'error'
                                        });
                                        console.log(err);
                                    });
                            }
                        })
                        .error(function(err) {
                            res.json({
                                status: 'error'
                            });
                            console.log(err);
                        });
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });
    },

    checkTaskWeek: function(req, res) {
        var info = req.body.info;
        db.timeTaskWeek.find({
                where: {
                    start_date: info.startWeek,
                    user_id: info.userID
                }
            }, {
                raw: true
            })
            .success(function(result) {
                if (result === null || result.length === 0) {
                    res.json({
                        data: 'no'
                    });
                } else {
                    db.timeTasks.findAll({
                            where: {
                                tasks_week_id: result.task_week_id,
                                deleted: 0
                            },
                            order: 'date'
                        }, {
                            raw: true
                        })
                        .success(function(tasks) {
                            if (tasks === null || tasks.length === 0) {
                                console.log("Not found tasks in table");
                                res.json({
                                    status: 'fail'
                                });
                                return false;
                            } else {
                                res.json({
                                    data: tasks
                                });
                            }
                        })
                        .error(function(err) {
                            res.json({
                                status: 'error'
                            });
                            console.log(err);
                        });
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });
    },

    showDetailDate: function(req, res) {
        var info = req.body.info;
        db.sequelize.query("SELECT t.`date`,t.activity_id, time_tasks_week.after_status_id, time_tasks_week.time_in_lieuChoose, time_task_status.name as status,tasks_week_id,hr_employee.FirstName, hr_employee.LastName ,t.`time_charge` FROM" +
                " `time_tasks` t INNER JOIN `time_activity` a ON a.`activity_id` = t.`activity_id`" +
                " INNER JOIN time_tasks_week ON t.tasks_week_id = time_tasks_week.task_week_id " +
                " INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN hr_employee ON " +
                " hr_employee.Employee_ID  = users.employee_id INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
                " WHERE t.`tasks_week_id` = ? AND t.`deleted`= 0 ORDER BY t.order ASC", null, {
                    raw: true
                }, [info])
            .success(function(tasks) {
                if (tasks === null || tasks.length === 0) {
                    console.log("Not found tasks in table");
                    res.json({
                        status: 'fail'
                    });
                    return false;
                } else {
                    res.json({
                        status: 'success',
                        data: tasks
                    });
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });
    },

    showEdit: function(req, res) {
        var info = req.body.info;
        var query = "SELECT * FROM time_tasks WHERE time_tasks.tasks_week_id = " + info + " AND time_tasks.deleted = 0 ORDER BY time_tasks.order ASC";
        db.sequelize.query(query)
            .success(function(tasks) {
                if (tasks === null || tasks.length === 0) {
                    console.log("Not found tasks in table");
                    res.json({
                        status: 'fail'
                    });
                    return false;
                } else {
                    db.sequelize.query("SELECT time_tasks_week.task_status_id, time_tasks_week.after_status_id, t.`tasks_id`, t.isParent, c.`item_id` as ITEM_ID,c.`ITEM_NAME`,i.deleted, i.`units`, i.ratio, i.`COMMENT` as comment, " +
                            "i.`time_charge` FROM `time_tasks` t LEFT JOIN `time_item_task` i ON i.`task_id` " +
                            "= t.`tasks_id` LEFT JOIN `time_item_code` c ON c.`ITEM_ID` = i.`item_id`" +
                            " INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = t.tasks_week_id " +
                            " WHERE " +
                            "t.`tasks_week_id` = ?", null, {
                                raw: true
                            }, [info])
                        .success(function(item) {
                            if (item === null || item.length === 0) {
                                console.log("Not found item in table");
                                res.json({
                                    status: 'fail'
                                });
                                return false;
                            } else {
                                res.json({
                                    status: 'success',
                                    data: tasks,
                                    item: item
                                });
                            }
                        })
                        .error(function(err) {
                            res.json({
                                status: 'error'
                            });
                            console.log(err);
                        })
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            })
    },

    checkFirstTaskWeek: function(req, res) {
        var info = req.body.info;
        db.timeTaskWeek.max('start_date', {
                where: {
                    user_id: info.userID,
                    deleted: 0
                }
            })
            .success(function(maxDate) {
                if (maxDate == 'Invalid Date') {
                    console.log("Not found maxDate in table");
                    res.json({
                        status: 'no maxDate'
                    });
                    return false;
                } else {
                    res.json({
                        status: 'success',
                        maxDate: maxDate
                    });
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });
    },

    getTaskList: function(req, res) {
        db.sequelize.query("SELECT t.*, tw.*, u.`Booking_Person`, ts.`color` AS COLOR, ts.`name` AS STATUS " +
                "FROM time_tasks t " +
                "INNER JOIN time_tasks_week tw ON t.`tasks_week_id` = tw.`task_week_id` " +
                "INNER JOIN users u ON u.`id` =  tw.`user_id` " +
                "INNER JOIN time_task_status ts ON ts.`stask_status_id` = t.`task_status_id`", null, {
                    raw: true
                })
            .success(function(data) {
                res.json({
                    status: 'success',
                    data: data
                });
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });


    },

    getTask: function(req, res) {
        var idWeek = req.body.idWeek;
        db.sequelize.query("SELECT DISTINCT t.`tasks_id`,t.`tasks_week_id`, time_item_code.ITEM_NAME, time_item_code.IS_BILLABLE , i.units, i.ratio, time_tasks_week.after_status_id, time_tasks_week.time_in_lieuChoose, t.`date`,l.`NAME` AS location,time_task_status.name as STATUS, hr_employee.FirstName, hr_employee.LastName, d.`departmentName` AS department," +
                "a.`NAME` AS activity,t.`time_charge`,t.`task`, i.`time_charge` AS time_item,i.`item_id` AS ITEM_ID,i.`units`,i.`COMMENT` AS comment " +
                "FROM `time_tasks` t LEFT JOIN `departments` d ON t.`department_code_id` = d.`departmentid` " +
                "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id  = t.tasks_week_id " +
                "INNER JOIN users ON users.id  = time_tasks_week.user_id " +
                "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
                "INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
                "LEFT JOIN `time_activity` a ON t.`activity_id` = a.`activity_id`" +
                "LEFT JOIN `time_location` l ON t.`location_id` = l.`location_id` " +
                "LEFT OUTER JOIN `time_item_task` i ON i.`task_id` = t.`tasks_id` AND i.deleted = 0 " +
                "LEFT JOIN time_item_code ON time_item_code.ITEM_ID = i.item_id " +
                "WHERE t.`tasks_week_id` = ? AND t.`deleted` = 0 ORDER BY t.`tasks_id`", null, {
                    raw: true
                }, [idWeek])
            .success(function(data) {
                if (data === null || data.length === 0) {
                    console.log("Not found tasks in table");
                    res.json({
                        status: 'fail'
                    });
                    return false;
                } else {
                    res.json({
                        status: 'success',
                        data: data
                    });
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });


    },

    getAllTaskAMonth: function(req, res) {
        var searchObj = req.body.search;
        //SEARCH
        var strSearch = " AND ";
        var strWeek = "";
        for (var keyStatus in searchObj.select) {
            if (searchObj.select[keyStatus] !== undefined &&
                searchObj.select[keyStatus] !== null &&
                searchObj.select[keyStatus] !== "") {
                strSearch += keyStatus + " = " + searchObj.select[keyStatus] + " AND ";
            }
        }
        if (strSearch.length === 5) {
            strSearch = "";
        } else {
            strSearch = strSearch.substring(0, strSearch.length - 5);
        }
        if (searchObj.week_no !== undefined &&
            searchObj.week_no !== null &&
            searchObj.week_no !== "") {
            strWeek = " AND time_tasks_week.week_no = " + searchObj.week_no;
        }
        //END SEARCH
        var query = "SELECT time_tasks_week.start_date,time_tasks_week.task_week_id, time_tasks_week.end_date, time_tasks_week.time_charge, time_task_status.name, " +
            "time_tasks_week.comments FROM time_tasks_week INNER JOIN time_task_status ON time_task_status.task_status_id = " +
            "time_tasks_week.task_status_id WHERE time_tasks_week.user_id = " + searchObj.userID + strWeek + strSearch + " ORDER BY time_tasks_week.start_date DESC LIMIT " +
            searchObj.limit + " OFFSET " + searchObj.offset;
        db.sequelize.query(query)
            .success(function(result) {
                var queryCount = "SELECT COUNT(time_tasks_week.task_week_id) AS COUNT FROM time_tasks_week INNER JOIN time_task_status ON time_task_status.task_status_id = " +
                    "time_tasks_week.task_status_id WHERE time_tasks_week.user_id = " + searchObj.userID + strWeek + strSearch;
                db.sequelize.query(queryCount)
                    .success(function(count) {
                        if ((result === null || result.length === 0) && strSearch === "" && strWeek === "") {
                            res.json({
                                status: "success",
                                result: null,
                                count: 0
                            });
                            return;
                        } else {
                            res.json({
                                status: "success",
                                result: result,
                                count: count[0].COUNT
                            });
                            return;
                        }
                    })
                    .error(function(err) {
                        console.log("*****ERROR:" + err + "*****");
                        res.json({
                            status: "error",
                            result: [],
                            count: 0
                        });
                        return;
                    });
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: [],
                    count: 0
                });
                return;
            });
    },

    checkMonth: function(req, res) {
        var info = req.body.info;
        var task_week_id = [],
            prevMonth = info.month,
            month = info.month * 1 + 1,
            year = info.year;

        if (month < 10) {
            month = '0' + month;
        }

        if (prevMonth < 10) {
            prevMonth = '0' + prevMonth;
        }

        db.timeTaskWeek.findAll({
                where: {
                    user_id: info.userID
                },
                attributes: ['task_week_id']
            }, {
                raw: true
            })
            .success(function(result) {
                if (result === null || result.length === 0) {
                    res.json({
                        data: 'no'
                    });
                } else {
                    for (var i = 0; i < result.length; i++) {
                        task_week_id.push(result[i].task_week_id);
                    }
                    db.timeTasks.findAll({
                            where: {
                                tasks_week_id: { in : task_week_id
                                }
                            },
                            $or: [{
                                date: {
                                    like: year + '-' + month + '%'
                                }
                            }, {
                                date: {
                                    like: year + '-' + prevMonth + '%'
                                }
                            }],
                            attributes: ['date']
                        }, {
                            raw: true
                        })
                        .success(function(tasks) {
                            if (tasks === null || tasks.length === 0) {
                                console.log("Not found tasks in table");
                                res.json({
                                    status: 'notFound'
                                });
                                return false;
                            } else {
                                res.json({
                                    tasks: tasks
                                });
                            }
                        })
                        .error(function(err) {
                            res.json({
                                status: 'error'
                            });
                            console.log(err);
                        });
                }
            })
            .error(function(err) {
                res.json({
                    status: 'error'
                });
                console.log(err);
            });
    },

    LoadContract: function(req, res) {
        var ID = req.body.ID;
        var query = "SELECT hr_employee.TypeOfContruct FROM hr_employee INNER JOIN users ON users.employee_id = hr_employee.Employee_ID WHERE users.id = " + ID;
        db.sequelize.query(query)
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
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
    SubmitOnView: function(req, res) {
        var info = req.body.info;
        var query = "UPDATE time_tasks_week SET time_tasks_week.task_status_id = " + info.status + " WHERE time_tasks_week.task_week_id = " + info.ID_WEEK;
        db.sequelize.query(query)
            .success(function(result) {
                //TRACKER
                var date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                var tracKer = {
                    statusID: info.status,
                    USER_ID: info.USER_ID,
                    idTaskWeek: info.ID_WEEK,
                    date: date
                };
                //CALL FUNCTION TRACKER
                TracKerTimeSheet(tracKer);
                //END
                //END TRACKER
                info.statusID = info.status;
                info.userID = info.USER_ID;
                // SEND MAIL
                SendMailSubmit(req, res, info);
                //END
                res.json({
                    status: 'success'
                });
                return;
            })
            .error(function(err) {
                res.json({
                    status: "error"
                });
                return;
            });
    },
    CheckTimeInLieu: function(req, res) {
        var weekNo = req.body.weekNo;
        var USER_ID = req.body.USER_ID;
        var weekStart = weekNo - 4;
        var query = "SELECT time_tasks_week.time_in_lieu FROM time_tasks_week WHERE user_id = " +
            USER_ID + " AND time_tasks_week.task_status_id = 3 AND time_tasks_week.week_no BETWEEN " + weekStart + " AND " + weekNo;
        db.sequelize.query(query)
            .success(function(result) {
                res.json({
                    status: "success",
                    result: result
                });
                return;
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "success",
                    result: []
                });
                return;
            });
    }
};

// FUNCTION TRACKER
var TracKerTimeSheet = function(info) {
    var arrayAction = {
        1: "Save",
        2: "Submit",
        3: "Approve",
        4: "Reject",
        5: "Resubmit"
    };
    var nameAction = arrayAction[info.statusID];
    var queryTracKer = "INSERT INTO time_tracker (name_action, user_id, creation_date,task_week_id) VALUES('" +
        nameAction + "'," + info.USER_ID + ",'" + info.date + "'," + info.idTaskWeek + ")";
    db.sequelize.query(queryTracKer)
        .success(function(result) {
            console.log("*****SAVE TRACKKER SUCCESS *****");
        })
        .error(function(err) {
            console.log("*****ERROR:" + err + "*****");
        });
};
//END

//FUNCTION SEND MAIL
var SendMailSubmit = function(req, res, info) {
    var USER_ID_SUBMIT = info.userID;
    var arrayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var DATE_OF_WEEK = arrayWeek[moment(info.date).format('e') - 1];
    var DATE_SUBMIT = moment(info.date).format('DD/MM/YYYY - HH:mm:ss');
    var idTaskWeek = info.idTaskWeek;
    var queryNodeChildren = "SELECT DISTINCT sys_hierarchies_users.NODE_ID, sys_hierarchies_users.DEPARTMENT_CODE_ID FROM sys_hierarchies_users " +
        "INNER JOIN hr_employee ON hr_employee.Dept_ID = sys_hierarchies_users.DEPARTMENT_CODE_ID " +
        "WHERE sys_hierarchies_users.USER_ID = " + USER_ID_SUBMIT;
    db.sequelize.query(queryNodeChildren)
        .success(function(result) {
            if (result[0] !== undefined && result[0] !== null && result[0].NODE_ID !== undefined && result[0].NODE_ID !== null && result[0].DEPARTMENT_CODE_ID !== undefined && result[0].DEPARTMENT_CODE_ID !== null) {
                var queryParentNodeId = "SELECT sys_hierarchy_nodes.TO_NODE_ID FROM sys_hierarchy_nodes WHERE sys_hierarchy_nodes.NODE_ID = " + result[0].NODE_ID;
                db.sequelize.query(queryParentNodeId)
                    .success(function(result2) {
                        if (result2[0] !== undefined && result2[0] !== null && result2[0].TO_NODE_ID !== undefined && result2[0].TO_NODE_ID !== null) {
                            var queryGetUser = "SELECT sys_hierarchies_users.USER_ID FROM sys_hierarchies_users " +
                                "WHERE sys_hierarchies_users.NODE_ID = " + result2[0].TO_NODE_ID +
                                " AND sys_hierarchies_users.DEPARTMENT_CODE_ID = " + result[0].DEPARTMENT_CODE_ID;
                            db.sequelize.query(queryGetUser)
                                .success(function(result3) {
                                    if (result3[0] !== undefined && result3[0] !== null && result3[0].USER_ID !== undefined && result3[0].USER_ID !== null) {
                                        var queryManage = "SELECT hr_employee.Email, hr_employee.FirstName, hr_employee.LastName FROM hr_employee " +
                                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID WHERE users.id = " + result3[0].USER_ID;
                                        db.sequelize.query(queryManage)
                                            .success(function(resultManage) {
                                                var queryEmp = "SELECT hr_employee.FirstName, hr_employee.LastName FROM hr_employee " +
                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID WHERE users.id = " + USER_ID_SUBMIT;
                                                db.sequelize.query(queryEmp)
                                                    .success(function(resultEmp) {
                                                        if (resultManage[0] !== undefined && resultManage[0] !== null && resultEmp[0] !== undefined && resultEmp[0] !== null) {
                                                            //SEND MAIL
                                                            mailOptions = {
                                                                senders: 'TimeSheet',
                                                                recipients: resultManage[0].Email,
                                                                subject: 'Notification of Submitted Timesheet(s)',
                                                                htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultManage[0].FirstName + ' ' + resultManage[0].LastName + ',</label></b><br/><br/><br/>' +
                                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a notice that you has been submitted a timesheet from <b>' + resultEmp[0].FirstName + ' ' + resultEmp[0].LastName + '</b> on <b>' + DATE_OF_WEEK + ', ' +
                                                                    DATE_SUBMIT + '.</b><br/><br/><br/>' +
                                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the Timesheet System to review and approve/reject the timesheet.<br/><br/><br/>' +
                                                                    'Access the e-Timesheet at https://apps.redimed.com.au:4000/#/login</label><br/><br/><br/>' +
                                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System<br></label><br/><br/><br/>' +
                                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                                                    '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                                                    '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                                                    '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                                                    'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                                                    '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                                                            };
                                                            // END APPROVE

                                                            //CALL SEND MAIL
                                                            FunctionSendMail.sendEmail(req, res, mailOptions);
                                                            // END CALL

                                                            // END SEND
                                                        }
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR:" + err + "*****");
                                                        res.json({
                                                            status: "success"
                                                        });
                                                        return;
                                                    });

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
                                        status: "success"
                                    });
                                    return;

                                });
                        }
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
                status: "success"
            });
            return;
        });
};
//END SEND MAIL
