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
            user_id : 1,
            task_status_id : 5
        },{raw:true})
            .success(function(data){
                db.timeTaskWeek.max('task_week_id')
                    .success(function(max){
                        for(var tasks in allTask){

                            db.timeTasks.create({
                                tasks_week_id : max,
                                "department_code_id" : allTask[tasks].department_code_id,
                                "task" : allTask[tasks].task,
                                "date": allTask[tasks].date,
                                "location_id" : allTask[tasks].location_id,
                                "activity_id" : allTask[tasks].activity_id,
                                "time_charge" : allTask[tasks].time_charge
                            })
                                .success(function(data){
                                    res.json({status:'success'});
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
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    },

    editTask: function(req,res)
    {

        var allTask = req.body.allTask;

        for(var i=0; i<allTask.length;i++){

            db.timeTasks.update({
                "department_code_id" : allTask[i].department_code_id,
                "task" : allTask[i].task,
                "date": allTask[i].date,
                "location_id" : allTask[i].location_id,
                "activity_id" : allTask[i].activity_id,
                "time_charge" : allTask[i].time_charge
            },{tasks_id : allTask[i].tasks_id})
                .success(function(data){
                    res.json({status:'success'});
                })
                .error(function(err){
                    res.json({status:'error'});
                    console.log(err);
                })

        }

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

    checkTaskWeek: function(req,res){
        var startWeek = req.body.startWeek;
        db.timeTaskWeek.find({where:{start_date : startWeek,user_id : 1}},{raw: true})
            .success(function (result) {
                if (result === null || result.length === 0) {
                    res.json({data: 'no'});
                }else
                {
                    db.timeTasks.findAll({where:{tasks_week_id : result.task_week_id}},{raw: true})
                        .success(function (tasks) {
                            if (tasks === null || tasks.length === 0) {
                                console.log("Not found tasks in table");
                                res.json({status: 'fail'});
                                return false;
                            }else
                            {
                                res.json({data: tasks});
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
        var monthNext = month + 2;
        var yearNext = year;
        if(monthNext > 12){
            monthNext = monthNext -12;
            yearNext = year + 1;
        }

        db.sequelize.query("SELECT time_tasks_week.`start_date`, time_tasks_week.`end_date`,time_task_status.`color` AS STATUS " +
                            "FROM `time_tasks_week` time_tasks_week INNER JOIN `time_task_status` time_task_status " +
            "ON time_task_status.`stask_status_id` = time_tasks_week.`task_status_id` WHERE time_tasks_week.`start_date` BETWEEN ? AND ?",
            null, {raw: true},[year + '-' + month + '-01',yearNext + '-' + monthNext + '-31'])
            .success(function (task) {
                if (task === null || task.length === 0) {
                    console.log("Not found task in table");
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