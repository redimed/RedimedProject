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

    getAllTaskAMonth: function(req,res){
        var year = req.body.year;
        var month = req.body.month;
        var search = year + '-' + month;
        db.timeTasks.findAll({where: ["date like ?", search+'%']})
            .success(function (task) {
                if (task === null || task.length === 0) {
                    console.log("Not found activity in table");
                    res.json({status: 'fail'});
                    return false;
                }else
                {

                    res.json(task);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }

};