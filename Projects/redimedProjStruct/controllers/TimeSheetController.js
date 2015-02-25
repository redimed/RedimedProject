/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
module.exports = {
    addAllTask: function(req,res)
    {
        var allTask = req.body.allTask;
        var startWeek = req.body.startWeek;
        var endWeek = req.body.endWeek;

        db.timeTaskWeek.create({
            start_date : startWeek,
            end_date : endWeek,
            user_id : 1
        },{raw:true})
            .success(function(data){
                db.timeTaskWeek.max('task_week_id')
                    .success(function(max){
                        for(var tasks in allTask){
                            for(var task in allTask[tasks]){
                                db.timeTasks.create({
                                    tasks_week_id : max,
                                    "department_code_id" : allTask[tasks][task].task_department,
                                    "task" : allTask[tasks][task].task_name,
                                    "date": allTask[tasks][task].dateChosen,
                                    "location_id" : allTask[tasks][task].task_location,
                                    "activity_id" : allTask[tasks][task].task_activity,
                                    "start_time" : allTask[tasks][task].start_time,
                                    "end_time" : allTask[tasks][task].end_time,
                                    "task_status_id" : 1
                                })
                                    .success(function(data){
                                        res.json({status:'success'});
                                    })
                                    .error(function(err){
                                        res.json({status:'error'});
                                        console.log(err);
                                    })
                            }
                        }
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })




    },

    editTask: function(req,res)
    {
        var task = req.body.task;

        db.timeTasks.update({
            "department_code_id" : task.task_department,
            "task" : task.task_name,
            "location_id" : task.task_location,
            "activity_id" : task.task_activity,
            "start_time" : task.start_time,
            "end_time" : task.end_time,
            "task_status_id" : task.status
        },{tasks_id : task.tasks_id})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    getDepartmentLocation: function(req,res)
    {
        db.timeTaskWeek.find()

        db.timeLocation.findAll({raw: true})
            .success(function (location) {
                if (location === null || location.length === 0) {
                    console.log("Not found location in table");
                    res.json({status: 'fail'});
                    return false;
                }else
                {
                    db.timeDepartment.findAll({raw: true})
                        .success(function (department) {
                            if (department === null || department.length === 0) {
                                console.log("Not found department in table");
                                res.json({status: 'fail'});
                                return false;
                            }else
                            {
                                db.timeActivity.findAll({raw: true})
                                    .success(function (activity) {
                                        if (activity === null || activity.length === 0) {
                                            console.log("Not found activity in table");
                                            res.json({status: 'fail'});
                                            return false;
                                        }else
                                        {
                                            res.json({location : location, department: department, activity: activity});
                                        }
                                    })
                                    .error(function(err){
                                        res.json({status:'error'});
                                        console.log(err);
                                    })
                            }
                        })
                        .error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    getTaskList: function(req,res)
    {
        db.sequelize.query("SELECT t.*, tw.*, u.`Booking_Person`, ts.`color` AS COLOR, ts.`name` AS STATUS "+
                           "FROM time_tasks t "+
                           "INNER JOIN time_tasks_week tw ON t.`tasks_week_id` = tw.`task_week_id` "+
                           "INNER JOIN users u ON u.`id` =  tw.`user_id` "+
                           "INNER JOIN time_task_status ts ON ts.`stask_status_id` = t.`task_status_id`",null,{raw:true})
            .success(function(data){
                res.json({status:'success',data:data})
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })


    },

    getAllTaskAMonth: function(req,res){
        var year = req.body.year;
        var month = req.body.month;
        var search = year + '-' + month;

        db.sequelize.query("SELECT time_tasks.`task`,time_tasks.date,time_tasks.`start_time`,time_tasks.`end_time`,time_activity.`NAME` as activity_name, time_department_code.`NAME` as department_name,time_task_status.`color` as status,time_location.`NAME` as location_name FROM `time_tasks` time_tasks INNER JOIN `time_task_status` time_task_status ON time_task_status.`stask_status_id` = time_tasks.`task_status_id` INNER JOIN `time_activity` time_activity ON time_activity.`activity_id` = time_tasks.`activity_id` INNER JOIN `time_department_code` time_department_code ON time_department_code.`department_code_id` = time_tasks.`department_code_id` INNER JOIN `time_location` time_location ON time_location.`location_id` = time_tasks.`location_id` WHERE time_tasks.`isenable` = 1 AND time_tasks.date LIKE ?",
            null, {raw: true},[search+'%'])
            .success(function (task) {
                if (task === null || task.length === 0) {
                    console.log("Not found activity in table");
                    res.json({status: 'no task'});
                    return false;
                }else
                {
                    res.json(task);
                }
            })
            .error(function (err) {
                res.json({status: 'error', err: err});
                console.log(err);
            })
    }

};