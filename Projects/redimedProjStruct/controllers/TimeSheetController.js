/**
 * Created by meditech on 19/09/2014.
 */
var db = require('../models');
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;
module.exports = {
    addAllTask: function(req,res)
    {
        var allTask = req.body.allTask;
        var info = req.body.info;

        db.timeTaskWeek.create({
            start_date : info.startWeek,
            end_date : info.endWeek,
            week_no: info.weekNo,
            user_id : info.userID,
            task_status_id : info.statusID
        },{raw:true})
            .success(function(data){
                db.timeTaskWeek.max('task_week_id')
                    .success(function(max){
                        for(var tasks in allTask){
                            chainer.add(
                                db.timeTasks.create({
                                    tasks_week_id : max,
                                    "department_code_id" : allTask[tasks].department_code_id,
                                    "task" : allTask[tasks].task,
                                    "order": allTask[tasks].order,
                                    "date": moment(allTask[tasks].date).format('YYYY-MM-DD'),
                                    "location_id" : allTask[tasks].location_id,
                                    "activity_id" : allTask[tasks].activity_id,
                                    "time_spent" : allTask[tasks].time_spent,
                                    "time_charge" : allTask[tasks].time_charge
                                })
                            )
                        }
                        chainer.runSerially().success(function(){
                            res.json({status:'success'});
                        }).error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
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
            if(allTask[i].isAction == 'update'){
                chainer.add(
                    db.timeTasks.update({
                        "department_code_id" : allTask[i].department_code_id,
                        "task" : allTask[i].task,
                        "date": allTask[i].date,
                        "location_id" : allTask[i].location_id,
                        "activity_id" : allTask[i].activity_id,
                        "time_charge" : allTask[i].time_charge
                    },{tasks_id : allTask[i].tasks_id})
                )
            }else if(allTask[i].isAction == 'insert'){
                chainer.add(
                    db.timeTasks.create({
                        tasks_week_id : allTask[i].tasks_week_id,
                        "department_code_id" : allTask[i].department_code_id,
                        "task" : allTask[i].task,
                        "order": allTask[i].order,
                        "date": moment(allTask[i].date).format('YYYY-MM-DD'),
                        "location_id" : allTask[i].location_id,
                        "activity_id" : allTask[i].activity_id,
                        "time_charge" : allTask[i].time_charge
                    })
                )
            }else if(allTask[i].isAction == 'delete'){
                chainer.add(
                    db.timeTasks.update({
                        "deleted" : 1
                    },{tasks_id : allTask[i].tasks_id})
                )
            }
        }
        chainer.runSerially().success(function(){
            res.json({status:'success'});
        }).error(function(err){
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
                                db.sequelize.query("SELECT a.`activity_id`, a.`NAME`, t.`NAME` AS type_name FROM `time_activity` a" 
                                + " INNER JOIN `time_type_activity` t ON t.`type_activity_id` = a.`type_activity_id`" ,null,{raw:true})
                                .success(function(activity){
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
        var info = req.body.info;
        db.timeTaskWeek.find({where:{start_date : info.startWeek,user_id : info.userID}},{raw: true})
            .success(function (result) {
                if (result === null || result.length === 0) {
                    res.json({data: 'no'});
                }else
                {
                    db.timeTasks.findAll({where:{tasks_week_id : result.task_week_id},order: 'date'},{raw: true})
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

    checkFirstTaskWeek: function(req,res){
        var info = req.body.info;
        db.timeTaskWeek.max('start_date', { where: { user_id : info.userID} })
            .success(function (maxDate) {
                if (maxDate == 'Invalid Date') {
                    console.log("Not found maxDate in table");
                    res.json({status: 'no maxDate'});
                    return false;
                }else
                {
                    res.json({status: 'success',maxDate: maxDate});
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
        var search = req.body.search;

        db.sequelize.query("SELECT time_tasks_week.*,time_task_status.`name` AS STATUS " +
        "FROM `time_tasks_week` time_tasks_week INNER JOIN `time_task_status` time_task_status "+
        "ON time_task_status.`task_status_id` = time_tasks_week.`task_status_id` "+
        "WHERE  time_tasks_week.`user_id` = ? ORDER BY time_tasks_week.`start_date` DESC LIMIT ? OFFSET ?",null, {raw: true},[search.userID,search.limit,search.offset])
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