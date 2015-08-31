//EXPORTS MODEL
var db = require('../../models');
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;
var FunctionSendMail = require("./sendMailSystemController");
var functionForTimesheet = require("./functionForTimesheet");
//END EXPORTS
module.exports = {

    /* addAllTask: create a new timesheet and add details
       input: new timesheet data, task list data, task item data, file item data
       output:  - success: send confirmation notification and success message
                - fail: send error message
    */
    AddAllTask: function(req, res) {
        var allTask = req.body.allTask;
        var info = req.body.info;

        // add new timesheet with request data 
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
                //add list tasks to created timesheet
                db.timeTaskWeek.max('task_week_id')
                    .success(function(max) {
                        db.timeTasks.max('tasks_id')
                            .success(function(id) {
                                var tId = id;
                                //insert task list to Timesheet
                                for (var task in allTask) {
                                    tId = tId + 1;
                                    chainer.add(
                                        db.timeTasks.create({
                                            tasks_id: tId,
                                            tasks_week_id: max,
                                            department_code_id: allTask[task].department_code_id,
                                            task: allTask[task].task,
                                            isParent: allTask[task].isParent,
                                            order: allTask[task].order,
                                            date: moment(allTask[task].date).format('YYYY-MM-DD'),
                                            location_id: allTask[task].location_id,
                                            activity_id: allTask[task].activity_id,
                                            time_charge: allTask[task].time_temp
                                        })
                                    )

                                    //insert item list to task
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
                                            if (a.fileUpload !== undefined &&
                                                a.fileUpload.length > 0) {
                                                //insert file list to task item
                                                for (var keyFile = 0; keyFile < a.fileUpload.length; keyFile++) {
                                                    chainer.add(
                                                        db.time_item_file.create({
                                                            task_id: tId,
                                                            item_id: a.ITEM_ID,
                                                            file_id: a.fileUpload[keyFile].file_id,
                                                            created_by: info.userID
                                                        })
                                                    )
                                                }
                                            }

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
                                    //tracker
                                    info.date = moment().format("YYYY-MM-DD HH:mm:ss");
                                    var idTaskWeek = result[0].dataValues.tasks_week_id;
                                    var tracKer = {
                                        statusID: info.statusID,
                                        USER_ID: info.userID,
                                        idTaskWeek: idTaskWeek,
                                        date: info.date
                                    };
                                    TracKerTimeSheet(tracKer);

                                    if (info.statusID === 2) {
                                        //send mail
                                        SendMailSubmit(req, res, info);
                                    }
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

    /*
    EditTask: Update information a Timesheet
    input: update Timesheet data, update task list data, update task item data, update file item data
    output: - success: send confirmation information and message success
            -  fail: send message error
    */
    EditTask: function(req, res) {
        var allTask = req.body.allTask;
        var info = req.body.info;
        db.timeTasks.max('tasks_id')
            .success(function(id) {
                var tId = id;
                for (var i = 0; i < allTask.length; i++) {
                    tId = tId + 1;
                    if (allTask[i].isAction == 'update') {
                        //update time task with data request
                        chainer.add(
                            db.timeTasks.update({
                                order: allTask[i].order,
                                department_code_id: allTask[i].department_code_id,
                                task: allTask[i].task,
                                date: allTask[i].date,
                                location_id: allTask[i].location_id,
                                activity_id: allTask[i].activity_id,
                                time_charge: allTask[i].time_temp
                            }, {
                                tasks_id: allTask[i].tasks_id
                            })
                        )

                        var taskId = allTask[i].tasks_id;
                        if (allTask[i].item.length > 0) {
                            for (var j = 0; j < allTask[i].item.length; j++) {
                                var a = allTask[i].item[j];
                                if (a.isAction == 'update') {
                                    //update item task with data request
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
                                    if (a.fileUpload !== undefined &&
                                        a.fileUpload.length > 0) {
                                        //add file item with data request
                                        for (var keyFile = 0; keyFile < a.fileUpload.length; keyFile++) {
                                            if (a.fileUpload[keyFile].isAction == "insert") {
                                                chainer.add(
                                                    db.time_item_file.create({
                                                        task_id: taskId,
                                                        item_id: a.ITEM_ID,
                                                        file_id: a.fileUpload[keyFile].file_id,
                                                        created_by: info.userID
                                                    })
                                                )
                                            }
                                        }
                                    }
                                    //END
                                } else if (a.isAction == 'delete') {
                                    //delete task item with data request
                                    chainer.add(
                                        db.TimeItemTask.update({
                                            'deleted': 1
                                        }, {
                                            item_id: a.ITEM_ID,
                                            task_id: taskId
                                        })
                                    )
                                    if (a.fileUpload !== undefined &&
                                        a.fileUpload.length > 0) {
                                        //delete file item with data request
                                        for (var keyFileS = 0; keyFileS < a.fileUpload.length; keyFileS++) {
                                            chainer.add(
                                                db.sequelize.query("DELETE FROM time_task_file WHERE time_task_file.file_id = :fileId", null, {
                                                    raw: true
                                                }, {
                                                    fileId: a.fileUpload[keyFileS].file_id
                                                })
                                            )

                                            chainer.add(
                                                db.sequelize.query("DELETE FROM time_item_file WHERE time_item_file.task_id = :taskId AND time_item_file.item_id = :itemId AND time_item_file.file_id = :fileId", null, {
                                                    raw: true
                                                }, {
                                                    taskId: taskId,
                                                    itemId: a.ITEM_ID,
                                                    fileId: a.fileUpload[keyFileS].file_id
                                                })
                                            )
                                        }
                                    }
                                } else if (a.isAction == 'insert') {
                                    //add time task item with data request
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

                                    if (a.fileUpload !== undefined &&
                                        a.fileUpload.length > 0) {
                                        //add file item with data request
                                        for (var keyFile = 0; keyFile < a.fileUpload.length; keyFile++) {
                                            if (a.fileUpload[keyFile].isAction == "insert") {
                                                chainer.add(
                                                    db.time_item_file.create({
                                                        task_id: taskId,
                                                        item_id: a.ITEM_ID,
                                                        file_id: a.fileUpload[keyFile].file_id,
                                                        created_by: info.userID
                                                    })
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (allTask[i].isAction == 'delete') {
                        //delete time task with data request
                        chainer.add(
                            db.timeTasks.update({
                                "deleted": 1
                            }, {
                                tasks_id: allTask[i].tasks_id
                            })
                        )

                        var taskId = allTask[i].tasks_id;
                        if (allTask[i].item.length > 0) {
                            //delete time item with data request
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
                                if (a.fileUpload !== undefined &&
                                    a.fileUpload.length > 0) {
                                    //delete file item with data request
                                    for (var keyFileS = 0; keyFileS < a.fileUpload.length; keyFileS++) {
                                        chainer.add(
                                            db.sequelize.query("DELETE FROM time_task_file WHERE time_task_file.file_id = :fileId", null, {
                                                raw: true
                                            }, {
                                                fileId: a.fileUpload[keyFileS].file_id
                                            })
                                        )

                                        chainer.add(
                                            db.sequelize.query("DELETE FROM time_item_file WHERE time_item_file.task_id = :taskId AND time_item_file.item_id = :itemId AND time_item_file.file_id = :fileId", null, {
                                                raw: true
                                            }, {
                                                taskId: taskId,
                                                itemId: a.ITEM_ID,
                                                fileId: a.fileUpload[keyFileS].file_id
                                            })
                                        )
                                    }
                                }

                            }
                        }
                    } else if (allTask[i].isAction == 'insert') {
                        //add time task with data request
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
                            //add time item with data request
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
                                if (a.fileUpload !== undefined &&
                                    a.fileUpload.length > 0) {
                                    //add file item with data request
                                    for (var keyFileL = 0; keyFileL < a.fileUpload.length; keyFileL++) {
                                        if (a.fileUpload[keyFileL].isAction == "insert") {
                                            chainer.add(
                                                db.time_item_file.create({
                                                    task_id: tId,
                                                    item_id: a.ITEM_ID,
                                                    file_id: a.fileUpload[keyFileL].file_id,
                                                    created_by: info.userID
                                                })
                                            )
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
                //update time task week with data request
                chainer.add(
                    db.timeTaskWeek.update({
                        time_charge: info.time_temp,
                        task_status_id: info.statusID,
                        time_in_lieuChoose: info.time_in_lieuFull
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
            //tracker
            var date = moment().format("YYYY-MM-DD HH:mm:ss");
            var idTaskWeek = info.idWeek;
            var tracKer = {
                statusID: info.statusID,
                USER_ID: info.userID,
                idTaskWeek: idTaskWeek,
                date: date
            };
            TracKerTimeSheet(tracKer);
            if (info.statusID === 5 || info.statusID === 2) {
                SendMailSubmit(req, res, info);
            }
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

    GetItemList: function(req, res) {
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

    /*
    GetDepartmentLocationActivity: get information departments, locations, activities
    input: 
    output: list departments, locations, activities
    */
    GetDepartmentLocationActivity: function(req, res) {
        //get list locations
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
                    //get list departments
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
                                //get list activities
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

    /*
    CheckTaskWeek: check time task on Timesheet
    input: start date of week, id of user
    output: - exist: list task on Timesheet
            - not exist: message 'no'
    */
    CheckTaskWeek: function(req, res) {
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
    /*
    ShowDetailDate: show task detail on date
    input: id of Timesheet
    output: task detail on date
    */
    ShowDetailDate: function(req, res) {
        var info = req.body.info;
        var queryGetInformationTask = "SELECT t.`date`,t.activity_id, time_tasks_week.after_status_id, time_tasks_week.time_in_lieuChoose, time_task_status.name as status,tasks_week_id,hr_employee.FirstName, hr_employee.LastName ,t.`time_charge` FROM" +
            " `time_tasks` t INNER JOIN `time_activity` a ON a.`activity_id` = t.`activity_id`" +
            " INNER JOIN time_tasks_week ON t.tasks_week_id = time_tasks_week.task_week_id " +
            " INNER JOIN users ON time_tasks_week.user_id = users.id INNER JOIN hr_employee ON " +
            " hr_employee.Employee_ID  = users.employee_id INNER JOIN time_task_status ON time_task_status.task_status_id = time_tasks_week.task_status_id " +
            " WHERE t.`tasks_week_id` = ? AND t.`deleted`= 0 ORDER BY t.order ASC";
        //get information a task
        db.sequelize.query(queryGetInformationTask, null, {
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

    /*
    ShowEdit: show information Timesheet to update
    input: id of Timesheet, id of user
    output: information detail a Timesheet
    */
    ShowEdit: function(req, res) {
        var info = req.body.info;
        //check permission
        var queryGetPermiss = "SELECT time_tasks_week.task_status_id " + //SELECT
            "FROM time_tasks_week " + //FROM
            "WHERE task_week_id = :idWeek AND time_tasks_week.user_id = :userId";
        db.sequelize.query(queryGetPermiss, null, {
                raw: true
            }, {
                idWeek: info.idWeek,
                userId: info.userId
            })
            .success(function(resultPermiss) {
                if (resultPermiss !== undefined &&
                    resultPermiss !== null &&
                    resultPermiss.length !== 0 &&
                    resultPermiss[0] !== undefined &&
                    resultPermiss[0] !== null &&
                    resultPermiss[0].task_status_id !== 2 &&
                    resultPermiss[0].task_status_id !== 3 &&
                    resultPermiss[0].task_status_id !== 5) {
                    //load edit
                    var query = "SELECT * FROM time_tasks WHERE time_tasks.tasks_week_id =:idWeek AND time_tasks.deleted = 0 ORDER BY time_tasks.order ASC";
                    db.sequelize.query(query, null, {
                            raw: true
                        }, {
                            idWeek: info.idWeek
                        })
                        .success(function(tasks) {
                            if (tasks === null || tasks.length === 0) {
                                console.log("Not found tasks in table");
                                res.json({
                                    status: 'fail'
                                });
                                return false;
                            } else {
                                //get information Timesheet
                                var queryGetInfomationTimesheet = "SELECT DISTINCT time_tasks_week.task_status_id, time_tasks_week.after_status_id, " +
                                    "t.`tasks_id`, t.isParent, c.`item_id` as ITEM_ID,c.`ITEM_NAME`,i.deleted, i.`units`, i.ratio, i.`COMMENT` as comment, " +
                                    "i.`time_charge` FROM `time_tasks` t LEFT JOIN `time_item_task` i ON i.`task_id` " +
                                    "= t.`tasks_id` LEFT JOIN `time_item_code` c ON c.`ITEM_ID` = i.`item_id`" +
                                    " INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = t.tasks_week_id " +
                                    " WHERE " +
                                    "t.`tasks_week_id` = ?";
                                db.sequelize.query(queryGetInfomationTimesheet, null, {
                                        raw: true
                                    }, [info.idWeek])
                                    .success(function(item) {
                                        //get information Timesheet's detail
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
                                                }, [info.idWeek])
                                            .success(function(file) {
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
                                                        item: item,
                                                        file: file
                                                    });
                                                }
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
                            }
                        })
                        .error(function(err) {
                            res.json({
                                status: 'error'
                            });
                            console.log(err);
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
    },
    /*
    CheckFirstTaskWeek: get start date of Timesheet
    input: id of user
    output: date later
    */
    CheckFirstTaskWeek: function(req, res) {
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

    /*
    GetTaskList: get list Timesheet
    input: 
    output: list Timesheet
    */
    GetTaskList: function(req, res) {
        //get list Timesheet
        var queryGetListTimesheet = "SELECT t.*, tw.*, u.`Booking_Person`, ts.`color` AS COLOR, ts.`name` AS STATUS " +
            "FROM time_tasks t " +
            "INNER JOIN time_tasks_week tw ON t.`tasks_week_id` = tw.`task_week_id` " +
            "INNER JOIN users u ON u.`id` =  tw.`user_id` " +
            "INNER JOIN time_task_status ts ON ts.`stask_status_id` = t.`task_status_id`";
        db.sequelize.query(queryGetListTimesheet, null, {
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

    /*
    GetTask: get list task of Timesheets
    input: id of Timesheet
    output: list task
    */
    GetTask: function(req, res) {
        var idWeek = req.body.idWeek;
        //get list task
        var queryGetListTask = "SELECT DISTINCT t.`tasks_id`,t.`tasks_week_id`, time_item_code.ITEM_NAME, time_item_code.IS_BILLABLE , i.units, i.ratio, time_tasks_week.after_status_id, time_tasks_week.time_in_lieuChoose, t.`date`,l.`NAME` AS location,time_task_status.name as STATUS, hr_employee.FirstName, hr_employee.LastName, d.`departmentName` AS department," +
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
            "WHERE t.`tasks_week_id` = ? AND t.`deleted` = 0 ORDER BY t.`tasks_id`";
        db.sequelize.query(queryGetListTask, null, {
                raw: true
            }, [idWeek])
            .success(function(data) {
                //get list file item
                var queryGetItemcode = "SELECT DISTINCT t.`tasks_id`, c.`item_id` as ITEM_ID, " +
                    "time_task_file.path_file, time_task_file.file_id, time_task_file.file_name, time_task_file.file_size " +
                    "FROM `time_tasks` t INNER JOIN `time_item_task` i ON i.`task_id` = t.`tasks_id` " +
                    "INNER JOIN `time_item_code` c ON c.`ITEM_ID` = i.`item_id`" +
                    "INNER JOIN time_tasks_week ON time_tasks_week.task_week_id = t.tasks_week_id " +
                    "INNER JOIN time_item_file ON time_item_file.task_id = i.task_id AND time_item_file.item_id = i.item_id " +
                    "INNER JOIN time_task_file ON time_task_file.file_id = time_item_file.file_id " +
                    " WHERE " +
                    "t.`tasks_week_id` = ?";
                db.sequelize.query(queryGetItemcode, null, {
                        raw: true
                    }, [idWeek])
                    .success(function(file) {
                        if (data === null || data.length === 0) {
                            console.log("Not found tasks in table");
                            res.json({
                                status: 'fail'
                            });
                            return false;
                        } else {
                            res.json({
                                status: 'success',
                                data: data,
                                file: file
                            });
                        }
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

    /*
    GetAllTaskMonth: get all Timesheet of user
    input: information search, pagination, ...
    output: list Timesheets
    */
    GetAllTaskAMonth: function(req, res) {
        var searchObj = req.body.search;
        var yearNow = moment(searchObj.dateFrom).format("YYYY");
        //search
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
            strWeek = " AND time_tasks_week.week_no = " + searchObj.week_no + " AND YEAR(time_tasks_week.end_date) = :yearNow";
        }

        //order by
        var strOrder = " ORDER BY ";
        for (var keyOrder in searchObj.order) {
            if (searchObj.order[keyOrder] !== undefined && searchObj.order[keyOrder] !== null && searchObj.order[keyOrder] !== "") {
                strOrder += " time_tasks_week.start_date " + searchObj.order[keyOrder] + ", ";
            }
        }
        if (strOrder.length === 10) {
            strOrder = "";
        } else {
            strOrder = strOrder.substring(0, strOrder.length - 2);
        }
        //get list Timesheets
        var query = "SELECT time_tasks_week.start_date,time_tasks_week.task_week_id, time_tasks_week.end_date, time_tasks_week.time_charge, time_task_status.name, " +
            "time_tasks_week.comments FROM time_tasks_week INNER JOIN time_task_status ON time_task_status.task_status_id = " +
            "time_tasks_week.task_status_id WHERE time_tasks_week.user_id = :userId" + strWeek + strSearch +
            strOrder +
            " LIMIT :limit OFFSET :offset";
        db.sequelize.query(query, null, {
                raw: true
            }, {
                userId: searchObj.userID,
                yearNow: yearNow,
                limit: searchObj.limit,
                offset: searchObj.offset
            })
            .success(function(result) {
                //count list Timesheet
                var queryCount = "SELECT COUNT(time_tasks_week.task_week_id) AS COUNT FROM time_tasks_week INNER JOIN time_task_status ON time_task_status.task_status_id = " +
                    "time_tasks_week.task_status_id WHERE time_tasks_week.user_id = :userId" + strWeek + strSearch;
                db.sequelize.query(queryCount, null, {
                        raw: true
                    }, {
                        userId: searchObj.userID,
                        yearNow: yearNow
                    })
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


    CheckMonth: function(req, res) {
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

    /*
        LoadContract: Load contract of employee
        input: id of employee
        output: contract of employee
    */
    LoadContract: function(req, res) {
        var ID = req.body.ID;
        var query = "SELECT hr_employee.TypeOfContruct FROM hr_employee INNER JOIN users ON " +
            "users.employee_id = hr_employee.Employee_ID WHERE users.id = :id";
        db.sequelize.query(query, null, {
                raw: true
            }, {
                id: ID
            })
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
    /*
        SubmitOnView: submit a Timesheet on view it
        input: information this Timesheet
        output: - success: send send message success
                - fail: send message error
    */
    SubmitOnView: function(req, res) {
        var info = req.body.info;
        var query = "UPDATE time_tasks_week SET time_tasks_week.task_status_id = :statusId " +
            "WHERE time_tasks_week.task_week_id = :idWeek";
        db.sequelize.query(query, null, {
                raw: true
            }, {
                statusId: info.status,
                idWeek: info.ID_WEEK
            })
            .success(function(result) {
                //tracker
                var date = moment().format("YYYY-MM-DD HH:mm:ss");
                var tracKer = {
                    statusID: info.status,
                    USER_ID: info.USER_ID,
                    idTaskWeek: info.ID_WEEK,
                    date: date
                };
                TracKerTimeSheet(tracKer);
                info.statusID = info.status;
                info.userID = info.USER_ID;
                //send mail
                SendMailSubmit(req, res, info);
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

    /*
    CheckTimeInLieu: get Time in lieu of employ
    input: current date, id of user
    output: Time in lieu
    */
    CheckTimeInLieu: function(req, res) {
        var info = req.body.info;
        var dateAddEnd = (7 - moment(info.date).day()) % 7;
        var dateEnd = moment(info.date).add(dateAddEnd, 'day')
        var weekNoEnd = functionForTimesheet.getWeekNo(dateEnd);
        var yearEnd = moment(dateEnd).year();
        var numberWeek = functionForTimesheet.defineNumberWeekTimeSheet();
        var arrayWeekNo = [{
            weekNo: weekNoEnd,
            year: yearEnd
        }];
        for (var i = 0; i < numberWeek; i++) {
            var dateAdd = (7 - moment(info.date).day()) % 7;
            var lastDateOfWeek = moment(info.date).add(dateAdd, 'day').subtract((i + 1) * 7, 'day').format("YYYY-MM-DD");
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
        //get current Time in lieu
        var queryGetTimInLieuHas = "SELECT time_tasks_week.time_in_lieu FROM time_tasks_week WHERE user_id = :userId " +
            "AND time_tasks_week.task_status_id = 3 AND (time_tasks_week.week_no, YEAR(time_tasks_week.end_date)) IN " + strWeekNo;
        db.sequelize.query(queryGetTimInLieuHas, null, {
                raw: true
            }, {
                userId: info.userId
            })
            .success(function(result) {
                //get time in lieu choose of Timesheet has not status approved
                var queryGetTimInLieuChoose = "SELECT time_tasks_week.time_in_lieuChoose FROM time_tasks_week WHERE user_id = :userId " +
                    "AND time_tasks_week.task_status_id = 2";
                db.sequelize.query(queryGetTimInLieuChoose, null, {
                        raw: true
                    }, {
                        userId: info.userId
                    })
                    .success(function(result2) {
                        var totalTimeInieuHas = 0;
                        var totalTimeInLieuChoose = 0;
                        result.forEach(function(valueHas, indexHas) {
                            if (valueHas !== undefined &&
                                valueHas !== null &&
                                !isNaN(valueHas.time_in_lieu)) {
                                totalTimeInieuHas += valueHas.time_in_lieu;
                            }
                        });
                        result2.forEach(function(valueChoose, indexChoose) {
                            if (valueChoose !== undefined &&
                                valueChoose !== null &&
                                !isNaN(valueChoose.time_in_lieuChoose)) {
                                totalTimeInLieuChoose += valueChoose.time_in_lieuChoose;
                            }
                        });
                        totalTimeInieuHas -= totalTimeInLieuChoose;
                        res.json({
                            status: "success",
                            time_in_lieu: totalTimeInieuHas
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
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "success",
                    result: []
                });
                return;
            });
    },

    LoadItemCode: function(req, res) {
        var searchObj = req.body.searchObj;
        var strSearch = " WHERE 1 = 1 AND ";
        var strOrder = " ORDER BY ";
        var activity = "";
        // CHECK ISBILLABLE OR NOT
        if (searchObj.isBillable === false) {
            activity = " AND time_item_code.ACTIVITY_ID = " + searchObj.activity_id + " ";
        } else {
            activity = " AND time_item_code.IS_BILLABLE = 1 ";
        }
        //END
        //get search
        for (var keySearch in searchObj.data) {
            if (searchObj.data[keySearch] !== undefined &&
                searchObj.data[keySearch] !== null &&
                searchObj.data[keySearch] !== "") {
                strSearch += keySearch + " like '%" + searchObj.data[keySearch] +
                    "%' AND ";
            }
        }

        strSearch = strSearch.substring(0, strSearch.length - 5);
        //end get search

        //get ORDER
        for (var keyOrder in searchObj.order) {
            if (searchObj.order[keyOrder] !== undefined &&
                searchObj.order[keyOrder] !== null &&
                searchObj.order[keyOrder] !== "") {
                strOrder += keyOrder + " " + searchObj.order[keyOrder] + ", ";
            }
        }
        if (strOrder.length === 10) {
            strOrder = "";
        } else {
            strOrder = strOrder.substring(0, strOrder.length - 2);
        }
        //end get ORDER
        var query = "SELECT time_item_code.ITEM_ID, time_item_code.ITEM_NAME, time_item_code.ITEM_UNITS FROM time_item_code " + strSearch + activity + strOrder + " LIMIT " + searchObj.limit + " OFFSET " + searchObj.offset;
        var queryCount = "SELECT COUNT(time_item_code.ITEM_ID) AS COUNTITEM FROM time_item_code " + strSearch + activity + strOrder;
        db.sequelize.query(query)
            .success(function(result) {
                if ((result === undefined || result === null || result.length === 0) && strSearch === "") {
                    res.json({
                        status: "success",
                        result: null,
                        count: 0
                    });
                    return;
                } else {

                    db.sequelize.query(queryCount)
                        .success(function(count) {
                            res.json({
                                status: "success",
                                result: result,
                                count: count[0].COUNTITEM
                            });
                            return;
                        })
                        .error(function(err) {
                            console.log("*****ERROR:" + err + "*****");
                            res.json({
                                status: "error",
                                result: null,
                                count: 0
                            });
                            return;
                        });
                }
            })
            .error(function(err) {
                console.log("*****ERROR:" + err + "*****");
                res.json({
                    status: "error",
                    result: null,
                    count: 0
                });
                return;
            });
    },

};

//tracker
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

//send mail
var SendMailSubmit = function(req, res, info) {
    var USER_ID_SUBMIT = info.userID;
    var arrayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var DATE_OF_WEEK = arrayWeek[moment(info.date).format('e') - 1];
    var DATE_SUBMIT = moment(info.date).format('DD/MM/YYYY - HH:mm:ss');
    var idTaskWeek = info.idTaskWeek;
    //get node id ò employee
    var queryNodeChildren =
        "SELECT DISTINCT sys_hierarchies_users.NODE_ID, sys_hierarchies_users.DEPARTMENT_CODE_ID FROM sys_hierarchies_users " +
        "INNER JOIN hr_employee ON hr_employee.Dept_ID = sys_hierarchies_users.DEPARTMENT_CODE_ID " +
        "WHERE sys_hierarchies_users.USER_ID = :userId";
    db.sequelize.query(queryNodeChildren, null, {
            raw: true
        }, {
            userId: USER_ID_SUBMIT
        })
        .success(function(result) {
            if (result[0] !== undefined && result[0] !== null && result[0].NODE_ID !== undefined && result[0].NODE_ID !== null && result[0].DEPARTMENT_CODE_ID !== undefined && result[0].DEPARTMENT_CODE_ID !== null) {
                //get node id approver
                var queryParentNodeId = "SELECT sys_hierarchy_nodes.TO_NODE_ID, sys_hierarchy_nodes.NODE_CODE " +
                    "FROM sys_hierarchy_nodes WHERE sys_hierarchy_nodes.NODE_ID = :nodeId";
                db.sequelize.query(queryParentNodeId, null, {
                        raw: true
                    }, {
                        nodeId: result[0].NODE_ID
                    })
                    .success(function(result2) {
                        if (result2[0] !== undefined && result2[0] !== null && result2[0].TO_NODE_ID !== undefined && result2[0].TO_NODE_ID !== null) {
                            var queryAddForStaff = "";
                            if (result2[0].NODE_CODE === "Staff") {
                                queryAddForStaff = "AND sys_hierarchies_users.DEPARTMENT_CODE_ID = :departmentCode"
                            }
                            var queryGetUser = "SELECT sys_hierarchies_users.USER_ID FROM sys_hierarchies_users " +
                                "WHERE sys_hierarchies_users.NODE_ID = :toNodeId " +
                                queryAddForStaff;
                            db.sequelize.query(queryGetUser, null, {
                                    raw: true
                                }, {
                                    toNodeId: result2[0].TO_NODE_ID,
                                    departmentCode: result[0].DEPARTMENT_CODE_ID //USE fo Staff
                                })
                                .success(function(result3) {
                                    if (result3[0] !== undefined && result3[0] !== null && result3[0].USER_ID !== undefined && result3[0].USER_ID !== null) {
                                        //get approver's information
                                        var queryManage = "SELECT hr_employee.Email, hr_employee.FirstName, hr_employee.LastName FROM hr_employee " +
                                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID WHERE users.id = :userId";
                                        db.sequelize.query(queryManage, null, {
                                                raw: true
                                            }, {
                                                userId: result3[0].USER_ID
                                            })
                                            .success(function(resultManage) {
                                                //get employee's information
                                                var queryEmp = "SELECT hr_employee.FirstName, hr_employee.LastName FROM hr_employee " +
                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID WHERE users.id = :userId";
                                                db.sequelize.query(queryEmp, null, {
                                                        raw: true
                                                    }, {
                                                        userId: USER_ID_SUBMIT
                                                    })
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
                                                                    '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label><br/><br/><br/>' +
                                                                    '<table><tbody><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">1 Frederick Street, Belmont WA 6104</span>' +
                                                                    '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T:&nbsp;</b> 08 9230 0900 | F: 08 9230 0999</span><br/><span><b>W:&nbsp;</b>www.redimed.com.au</span></td></tr>' +
                                                                    '<tr><td><img src="cid:logoRedimed"></td></tr>' +
                                                                    '<tr><td><span style="color:#203864;">&nbsp;&nbsp;&nbsp;Joondalup | Belmont | Rockingham</span></td></tr>' +
                                                                    '<tr><td><span style="font-family:Calibri,sans-serif;font-size:9.0pt;color:#203864;">This e-mail and any attachments are intended for the addressee(s) only and may be confidential.<br/>' +
                                                                    'They may contain legally privileged or copyright material.You should not read, copy, use or disclose them without authorisation.<br/>' +
                                                                    'If you are not the intended recipient, please contact the sender as soon as possible by return e-mail and then please delete both messages.<br/>' +
                                                                    'Please note that any views or opinions presented in this email are solely those of the author and do not necessarily represent those of REDIMED Pty Ltd. The ' +
                                                                    'recipient should check this email and any attachments for the presence of viruses. REDIMED Pty Ltd accepts no liability for any damage caused by any virus ' +
                                                                    'transmitted by this email.<br/><br/><br/>' +
                                                                    '<p class="MsoNormal"><span style="font-size:13.5pt;font-family:Webdings;color:green">P</span>' +
                                                                    '<span style="font-size:9.0pt;font-family:&quot;Arial&quot;,sans-serif;color:green">&nbsp;</span>' +
                                                                    '<b><span style="font-size:8.0pt;color:green">Please consider our environment before printing this e - mail</span></b></p>' +
                                                                    '</td></tr></tbody></table>'
                                                            };

                                                            FunctionSendMail.sendEmail(req, res, mailOptions);
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
