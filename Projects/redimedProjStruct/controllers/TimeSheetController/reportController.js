//EXPORTS MODEL
var db = require("../../models");
var chainer = new db.Sequelize.Utils.QueryChainer;
var moment = require("moment");
var functionForTimesheet = require('./functionForTimesheet');
var clone = require('clone');
//END
module.exports = {
    /*
    LoadDeptReport: load list department for report
    input: id of user
    output: list department
    */
    LoadDeptReport: function(req, res) {
        var USER_ID = req.body.USER_ID;
        //get title of employee
        var query = "SELECT hr_employee.TITLE FROM hr_employee " +
            "INNER JOIN users ON users.employee_id  = hr_employee.Employee_ID " +
            "WHERE users.id = :userId";
        db.sequelize.query(query, null, {
                raw: true
            }, {
                userId: USER_ID
            })
            .success(function(result) {
                if (result !== undefined && result !== null && result.length !== 0) {
                    var TITLE = result[0].TITLE;
                    var queryDept = "";
                    if (TITLE === "Director") {
                        //get all department
                        queryDept = "SELECT DISTINCT departments.departmentid as id, departments.departmentName as label FROM departments " +
                            "WHERE departments.departmentType = 'Time Sheet'";
                    } else {
                        //get department
                        queryDept = "SELECT DISTINCT departments.departmentid as id, departments.departmentName as label FROM departments " +
                            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                            "WHERE departments.departmentType = 'Time Sheet' AND users.id = :userId";
                    }
                    db.sequelize.query(queryDept, null, {
                            raw: true
                        }, {
                            userId: USER_ID
                        })
                        .success(function(resultDept) {
                            res.json({
                                status: "success",
                                result: resultDept,
                                isStaff: (TITLE === "Head of Dept." || TITLE === "Director") ? false : true
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
                }
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
    LoadEmpReport: load list employee
    input: list department id
    output: list employee
    */
    LoadEmpReport: function(req, res) {
        var listDept = req.body.listDept;
        var strListDept = "";
        for (var i = 0; i < listDept.length; i++) {
            if (!isNaN(listDept[i].id)) {
                strListDept += listDept[i].id + ", ";
            }
        }
        if (strListDept !== undefined && strListDept !== null && strListDept !== "" && strListDept.length !== 0) {
            strListDept = strListDept.substring(0, strListDept.length - 2);
        } else {
            strListDept = null;
        }
        var queryStaff = "";
        if (req.body.listDept[0].USER_ID !== undefined &&
            req.body.listDept[0].isStaff === true) {
            queryStaff = "AND users.id = " + (!isNaN(req.body.listDept[0].USER_ID) ? req.body.listDept[0].USER_ID : -1);
        }
        //get list emloyee on list department tranmission
        var query = "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName, hr_employee.Employee_ID FROM hr_employee " +
            "INNER JOIN departments ON departments.departmentid = hr_employee.Dept_ID " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "WHERE departments.departmentid IN (" + strListDept + ") " + queryStaff;
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
                    status: "error",
                    result: []
                });
                return;
            });
    },

    /*
    LoadReportOnActualWorking: report time charge for employees classified by activity type as: 
    billable time, administrator time, time in lieu, over time,...
    input: information employees, period
    output: list employee with time charge on report
    */
    LoadReportOnActualWorking: function(req, res) {
        var info = req.body.info;
        var listEMP = info.listEMP;
        var USER_ID = info.USER_ID;
        var listDept = info.listDept;
        var dateFrom = moment(info.dateWeekFrom).format('YYYY-MM-DD');
        var dateTo = moment(info.dateWeekTo).format('YYYY-MM-DD');
        //STR EMP
        var strListEmp = "";
        for (var i = 0; i < listEMP.length; i++) {
            strListEmp += listEMP[i].id + ", ";
        }
        if (strListEmp !== undefined && strListEmp !== null && strListEmp !== "" && strListEmp.length !== 0) {
            strListEmp = strListEmp.substring(0, strListEmp.length - 2);
        } else {
            strListEmp = null;
        }
        //END
        var strListDept = "";
        var strListDeptID = "";
        for (var d = 0; d < listDept.length; d++) {
            strListDeptID += listDept[d].id + ", ";
        }
        if (strListDeptID !== "") {
            strListDeptID = strListDeptID.substring(0, strListDeptID.length - 2);
        } else strListDeptID = -1;

        //get department
        var queryDept = "SELECT DISTINCT COUNT(hr_employee.Employee_ID) AS CountEmp, departments.departmentName, departments.departmentid FROM departments " +
            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "INNER JOIN time_tasks_week ON time_tasks_week.user_id  = users.id " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks.date BETWEEN :dateFrom AND :dateTo GROUP BY departments.departmentName ORDER BY departments.departmentName ASC";

        //get time charge classified by activity
        var queryActivity = "SELECT sum(time_tasks.time_charge) as SUM_CHARGE_ACTIVITY, time_tasks.activity_id, hr_employee.Employee_ID, " +
            "hr_employee.FirstName, hr_employee.LastName, departments.departmentName " +
            "FROM time_tasks_week " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
            "INNER JOIN users ON users.id = time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks.date BETWEEN :dateFrom AND :dateTo " +
            "GROUP BY hr_employee.Employee_ID, time_tasks.activity_id ORDER BY departments.departmentid";

        //get time charge all
        var querySumTimeCharge = "SELECT DISTINCT SUM(C.time_charge) as SUM_CHARGE, SUM(c.time_in_lieu) AS SUM_IN_LIEU, SUM(C.over_time) AS SUM_OVER_TIME, " +
            "C.Employee_ID, C.FirstName, C.LastName, C.departmentName , C.departmentid " +
            " FROM (SELECT DISTINCT time_tasks_week.time_charge , " +
            "hr_employee.Employee_ID, time_tasks_week.over_time , time_tasks_week.time_in_lieu, time_tasks_week.week_no, " +
            "hr_employee.FirstName, hr_employee.LastName, departments.departmentName, departments.departmentid " +
            "FROM time_tasks_week " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
            "INNER JOIN users ON users.id = time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks.date BETWEEN :dateFrom AND :dateTo) C GROUP BY C.Employee_ID";
        db.sequelize.query(queryDept, null, {
                raw: true
            }, {
                dateFrom: dateFrom,
                dateTo: dateTo
            })
            .success(function(resultDept) {
                db.sequelize.query(querySumTimeCharge, null, {
                        raw: true
                    }, {
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    })
                    .success(function(resultTimeCharge) {
                        db.sequelize.query(queryActivity, null, {
                                raw: true
                            }, {
                                dateFrom: dateFrom,
                                dateTo: dateTo
                            })
                            .success(function(resultActivity) {
                                for (var i = 0; i < resultDept.length; i++) {
                                    resultDept[i].listEmployee = [];
                                    for (var j = 0; j < resultTimeCharge.length; j++) {
                                        if (resultDept[i].departmentid === resultTimeCharge[j].departmentid) {
                                            //push data
                                            resultDept[i].listEmployee.push({
                                                employee_id: resultTimeCharge[j].Employee_ID,
                                                name: resultTimeCharge[j].FirstName + " " + resultTimeCharge[j].LastName,
                                                time_charge: resultTimeCharge[j].SUM_CHARGE,
                                                time_in_lieu: resultTimeCharge[j].SUM_IN_LIEU,
                                                over_time: resultTimeCharge[j].SUM_OVER_TIME,
                                                SUM_CHARGE_ACTIVITY: [],
                                                activity_id: resultTimeCharge[j].activity_id
                                            });
                                            for (var k = 0; k < resultActivity.length; k++) {
                                                if (resultActivity[k].Employee_ID === resultDept[i].listEmployee[resultDept[i].listEmployee.length - 1].employee_id) {
                                                    resultDept[i].listEmployee[resultDept[i].listEmployee.length - 1].SUM_CHARGE_ACTIVITY[resultActivity[k].activity_id] = resultActivity[k].SUM_CHARGE_ACTIVITY;
                                                }
                                            }
                                        }
                                    }
                                }

                                //sum time classified department
                                for (var deptIndex = 0; deptIndex < resultDept.length; deptIndex++) {
                                    resultDept[deptIndex].sum_ac1_dept = 0;
                                    resultDept[deptIndex].sum_ac2_dept = 0;
                                    resultDept[deptIndex].sum_ac3_dept = 0;
                                    resultDept[deptIndex].sum_ac4_dept = 0;
                                    resultDept[deptIndex].sum_ac5_dept = 0;
                                    resultDept[deptIndex].time_in_lieu_dept = 0;
                                    resultDept[deptIndex].overtime_dept = 0;
                                    for (var empIndex = 0; empIndex < resultDept[deptIndex].listEmployee.length; empIndex++) {
                                        resultDept[deptIndex].sum_ac1_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[1] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[1] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[1]);
                                        resultDept[deptIndex].sum_ac2_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[2] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[2] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[2]);
                                        resultDept[deptIndex].sum_ac3_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[3] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[3] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[3]);
                                        resultDept[deptIndex].sum_ac4_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[4] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[4] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[4]);
                                        resultDept[deptIndex].sum_ac5_dept += ((resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[5] === undefined || resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[5] === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].SUM_CHARGE_ACTIVITY[5]);
                                        resultDept[deptIndex].time_in_lieu_dept += ((resultDept[deptIndex].listEmployee[empIndex].time_in_lieu === undefined || resultDept[deptIndex].listEmployee[empIndex].time_in_lieu === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].time_in_lieu);
                                        resultDept[deptIndex].overtime_dept += ((resultDept[deptIndex].listEmployee[empIndex].over_time === undefined || resultDept[deptIndex].listEmployee[empIndex].over_time === null) ? 0 : resultDept[deptIndex].listEmployee[empIndex].over_time);
                                    }
                                }

                                //sum all
                                var sum_all = 0;
                                var sum_ac1_all = 0,
                                    sum_ac2_all = 0,
                                    sum_ac3_all = 0,
                                    sum_ac4_all = 0,
                                    sum_ac5_all = 0,
                                    time_in_lieu_all = 0,
                                    overtime_all = 0;
                                for (var deptIndexAll = 0; deptIndexAll < resultDept.length; deptIndexAll++) {
                                    sum_ac1_all += resultDept[deptIndexAll].sum_ac1_dept;
                                    sum_ac2_all += resultDept[deptIndexAll].sum_ac2_dept;
                                    sum_ac3_all += resultDept[deptIndexAll].sum_ac3_dept;
                                    sum_ac4_all += resultDept[deptIndexAll].sum_ac4_dept;
                                    sum_ac5_all += resultDept[deptIndexAll].sum_ac5_dept;
                                    time_in_lieu_all += resultDept[deptIndexAll].time_in_lieu_dept;
                                    overtime_all += resultDept[deptIndexAll].overtime_dept;
                                    sum_all +=
                                        sum_ac1_all +
                                        sum_ac2_all +
                                        sum_ac3_all +
                                        sum_ac4_all +
                                        sum_ac5_all;
                                }

                                var listEmployeeInsert = "";
                                var listTimeInsert = "";
                                for (var i = 0; i < resultDept.length; i++) {
                                    for (var j = 0; j < resultDept[i].listEmployee.length; j++) {

                                        //value employee
                                        listEmployeeInsert += "(" + USER_ID + "," + resultDept[i].departmentid + "," + resultDept[i].listEmployee[j].employee_id + ",'" +
                                            resultDept[i].listEmployee[j].name + "','" + moment(info.dateWeekFrom).format("YYYY-MM-DD") + "','" + moment(info.dateWeekTo).format("YYYY-MM-DD") + "'," + resultDept[i].sum_ac1_dept +
                                            "," + resultDept[i].sum_ac2_dept + "," +
                                            resultDept[i].sum_ac3_dept + "," + resultDept[i].sum_ac4_dept + "," +
                                            resultDept[i].sum_ac5_dept + "," + (resultDept[i].sum_ac1_dept + resultDept[i].sum_ac2_dept +
                                                resultDept[i].sum_ac3_dept + resultDept[i].sum_ac4_dept + resultDept[i].sum_ac5_dept) + "," +
                                            resultDept[i].time_in_lieu_dept + "," + resultDept[i].overtime_dept + ", " + sum_ac1_all +
                                            ", " + sum_ac2_all + ", " + sum_ac3_all + ", " + sum_ac4_all + ", " +
                                            sum_ac5_all + ", " + sum_all + ", " + time_in_lieu_all + ", " + overtime_all +
                                            "), ";
                                        //value time charge
                                        listTimeInsert += "(" + USER_ID + "," +
                                            resultDept[i].listEmployee[j].employee_id + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[1] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[1]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[2] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[2]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[3] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[3]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[4] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[4]) + "," +
                                            (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[5] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[5]) + "," +
                                            (resultDept[i].listEmployee[j].time_charge === undefined ? 0 : resultDept[i].listEmployee[j].time_charge) + "," + resultDept[i].listEmployee[j].time_in_lieu + ", " + resultDept[i].listEmployee[j].over_time + "), ";
                                    }
                                }
                                if (listEmployeeInsert !== "") {
                                    listEmployeeInsert = listEmployeeInsert.substring(0, listEmployeeInsert.length - 2);
                                }
                                if (listTimeInsert !== "") {
                                    listTimeInsert = listTimeInsert.substring(0, listTimeInsert.length - 2);
                                }
                                var queryInsertEmployee = "INSERT INTO time_employee_reports1 (user_id, departmentid, employee_id, employee, from_date, to_date, " +
                                    "time_ac1_dept, time_ac2_dept, time_ac3_dept,time_ac4_dept, time_ac5_dept, total_dept, time_in_lieu_dept, overtime_dept, time_ac1_all, time_ac2_all, time_ac3_all, time_ac4_all, time_ac5_all, total_all, time_in_lieu_all, overtime_all)" +
                                    " VALUES " + listEmployeeInsert;
                                var queryInsertTimeInSert = "INSERT INTO time_time_charge_reports1 (user_id, employee_id, time_ac1, time_ac2, time_ac3, time_ac4, time_ac5, time_charge_sum, time_in_lieu, time_over) VALUES " + listTimeInsert;
                                var queryDelEmployee = "DELETE FROM time_employee_reports1 WHERE user_id = :userId";
                                var queryDelTime = "DELETE FROM time_time_charge_reports1 WHERE user_id = :userId";
                                db.sequelize.query(queryDelEmployee, null, {
                                        raw: true
                                    }, {
                                        userId: USER_ID
                                    })
                                    .success(function(delSuccessEmp) {
                                        db.sequelize.query(queryDelTime, null, {
                                                raw: true
                                            }, {
                                                userId: USER_ID
                                            })
                                            .success(function(delSuccessTime) {
                                                //INSERT EMP
                                                if (listEmployeeInsert !== "") {
                                                    db.sequelize.query(queryInsertEmployee)
                                                        .success(function(insertSuccessEmp) {
                                                            // INSERT TIME
                                                            if (queryInsertTimeInSert !== "") {
                                                                db.sequelize.query(queryInsertTimeInSert)
                                                                    .success(function(insertSuccessTime) {

                                                                        //RES.JSON
                                                                        res.json({
                                                                            status: "success",
                                                                            result: resultDept
                                                                        });
                                                                        return;
                                                                        //END
                                                                    })
                                                                    .error(function(err) {
                                                                        console.log("*****ERROR:" + err + "*****");
                                                                        res.json({
                                                                            status: "error",
                                                                            result: []
                                                                        });
                                                                        return;
                                                                    });
                                                            } else {
                                                                res.json({
                                                                    status: "dataNull"
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
                                                            return;
                                                        });
                                                } else {
                                                    res.json({
                                                        status: "dataNull"
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
                                //END INSERT
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

    LoadReportOweLeave: function(req, res) {
        var info = req.body.info;
        var stringEMP = "";
        var stringDept = "";
        var stringID = "";
        var stringline1 ="";
        var start_date;
        var finish_date;
        var date;
        var array = [];
        var listleave = [];
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var getnewdate= new Date();
        getnewdate.setHours(0, 0, 0);
        var delete_hr_leave_owe = "DELETE FROM hr_leave_owe WHERE create_id =" + info.USER_ID + " ";
        db.sequelize.query(delete_hr_leave_owe)
            .success(function(deletes){
                var sql_data1 = "SELECT "+
                                "users.id, "+
                                "hr_employee.FirstName, "+
                                "hr_employee.LastName, "+
                                "hr_employee.Employee_ID , "+
                                "departments.departmentid, "+
                                "departments.departmentName, "+
                                "time_tasks_week.time_charge, "+
                                "time_tasks_week.time_in_lieu, "+
                                "time_tasks_week.week_no, "+
                                "time_tasks_week.creation_date, "+
                                "time_tasks_week.last_update_date, "+
                                "time_tasks_week.task_week_id , "+
                                "time_tasks.tasks_id, "+
                                "time_tasks.date, "+
                                "time_item_task.item_id "+
                                "FROM hr_employee "+
                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID "+
                                "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid "+
                                "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id "+
                                "INNER JOIN time_tasks     ON time_tasks.tasks_week_id = time_tasks_week.task_week_id "+
                                "INNER JOIN time_item_task ON time_item_task.task_id  = time_tasks.tasks_id "+
                                "WHERE time_tasks_week.task_status_id = 3 AND "+
                                "departments.departmentid IN ( "+stringDept+" ) AND "+
                                "(time_tasks_week.start_date BETWEEN :start_date AND :end_date ) AND "+
                                "(time_tasks_week.end_date BETWEEN :start_date AND :end_date ) AND "+
                                "hr_employee.Employee_ID IN ( "+stringEMP+" ) AND "+
                                "time_item_task.item_id IN (15,16,17,19,24,25)";
                db.sequelize.query(sql_data1,null,{
                    raw : true
                },{
                    start_date : info.weekFrom,
                    end_date   : info.weekTo
                })
                    .success(function(data_1){
                        if(data_1!==undefined&&data_1!==null&&data_1!==""&&data_1.length!==0){
                            data_1.forEach(function(value,index){
                                if(value!==undefined&&value!==null){
                                    var isFound = false;
                                    array.forEach(function(valueTime,indexTime){
                                        if(valueTime!==undefined&&valueTime!==null&&
                                            valueTime.user_id===value.id){
                                            isFound = true;
                                        }
                                    });
                                    if(isFound===false){
                                        array.push({
                                            user_id     : value.id,
                                            create_id       : info.USER_ID,
                                            Employee_id   : value.Employee_ID,
                                            Department_id : value.departmentid
                                        })
                                    }
                                }
                            });
                            if(array!==undefined&&array!==null&&array!==""&&array.length!==0){
                                for (var i = 0; i < array.length; i++) {
                                    stringID += array[i].user_id + ", ";
                                }
                                stringID += 0;
                                var sql_data2 = "SELECT leave_id,start_date,finish_date,status_id,user_id " + 
                                                "FROM hr_leave " + 
                                                "WHERE user_id IN (" + stringID + ") AND status_id=3 ORDER BY user_id";
                                db.sequelize.query(sql_data2)
                                    .success(function(data_2){
                                       if(data_2!==undefined&&data_2!==null&&data_2!==""&&data_2.length!==0){
                                            for(var i = 0;i < data_1.length; i++){
                                                data_1[i].isReject = 0;
                                            }
                                            for(var x = 0; x < data_1.length;x++){
                                                date = moment(moment(data_1[x].date).format("YYYY-MM-DD")).format("X");
                                                for(var y =0; y <data_2.length; y++){
                                                    start_date = moment(moment(data_2[y].start_date).format("YYYY-MM-DD")).format("X");
                                                    finish_date = moment(moment(data_2[y].finish_date).format("YYYY-MM-DD")).format("X");
                                                    if(date>=start_date){
                                                        if(date<=finish_date){
                                                            data_1[x].isReject = 1;
                                                        }
                                                    }
                                                }
                                            }
                                            for(var j = 0; j <data_1.length; j++){
                                                if(data_1[j].isReject==0){
                                                    listleave.push(data_1[j]);
                                                }
                                            }
                                            if(listleave!==undefined&&listleave!==null&&listleave!==""&&listleave.length!==0){
                                                for(var q = 0; q < listleave.length; q++){
                                                    stringline1+="("+
                                                        info.USER_ID+","+
                                                        listleave[q].id+","+
                                                        listleave[q].isReject+", "+
                                                        listleave[q].departmentid+",'"+
                                                        moment(listleave[q].date).format("YYYY-MM-DD")+"',"+
                                                        listleave[q].Employee_ID+",'"+
                                                        moment(info.weekFrom).format("YYYY-MM-DD") + "','" +
                                                        moment(info.weekTo).format("YYYY-MM-DD") + "','"+
                                                        moment(getnewdate).format("YYYY-MM-DD")+ "',"+
                                                        info.USER_ID +"),";
                                                }
                                                stringline1 = stringline1.substring(0, stringline1.length - 1);
                                                var sql_insert = "INSERT INTO "+
                                                                    "hr_leave_owe "+
                                                                    "(create_id, "+
                                                                    "user_id, "+
                                                                    "isReject, "+
                                                                    "department, "+
                                                                    "date_leave, "+
                                                                    "employee, "+
                                                                    "from_date, "+
                                                                    "to_date, "+
                                                                    "creation_date, "+
                                                                    "created_by ) "+
                                                                    "VALUE "+stringline1;
                                                db.sequelize.query(sql_insert)
                                                    .success(function(data_success){
                                                        res.json({
                                                            status:"success"
                                                        });
                                                        return;
                                                    })
                                                    .error(function(err){
                                                        console.log("*****ERROR: "+err+" *****");
                                                        res.json({
                                                            status:"error"
                                                        });
                                                        return;
                                                    })
                                            }
                                            else{
                                                res.json({
                                                    status:"null"
                                                });
                                                return;
                                            }
                                       }
                                       else{
                                        res.json({
                                            status:"null"
                                        });
                                        return;
                                       }
                                    })
                                    .error(function(err){
                                        console.log("*****ERROR: "+err+" *****");
                                        res.json({
                                            status:"error"
                                        });
                                        return;
                                    })
                            }
                            else{
                                res.json({
                                    status:"null"
                                });
                                return;
                            }
                        }
                        else{
                            res.json({
                                status:"null"
                            });
                            return;
                        }
                    })
                    .error(function(err){
                        console.log("*****ERROR :"+err+" *****");
                        res.json({
                            status:"error"
                        });
                        return;
                    })
            })
            .error(function(err){
                console.log("*****ERROR: "+err+" *****");
                res.json({
                    status:"error"
                });
                return;
            })
    },

    LoadReportTimeInLieu: function(req, res) {
        var info = req.body.info;
        //CHUYEN LIST EMPL VA LIST DEPT THANH CHUOI STRING
        var stringEMP = "";
        var stringDept = "";
        var stringline1 = "";
        var getnewdate= new Date();
        getnewdate.setHours(0, 0, 0);
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var sum_ = 0;
        var data = [];
        var data_Dept = [];
        var d = new Date();
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weeks = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        var sql_delete_time_in_lieu_detail_report = "DELETE FROM time_in_lieu_report WHERE create_id=" + info.USER_ID;
        db.sequelize.query(sql_delete_time_in_lieu_detail_report)
            .success(function(data_delete1) {
                //cau SQL lay time in lieu ma user duoc chon tich luy~ tu do den from_date
                var sql_get_data1 = "SELECT users.id, " +
                    "hr_employee.Employee_ID , " +
                    "departments.departmentid, " +
                    "time_tasks_week.week_no," +
                    "time_tasks_week.task_week_id, " +
                    "time_tasks_week.time_in_lieu " +
                    "FROM hr_employee  " +
                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                    "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid  " +
                    "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " +
                    "WHERE time_tasks_week.task_status_id = 3 AND " +
                    "departments.departmentid IN (" + stringDept + ") AND " +
                    "hr_employee.Employee_ID IN (" + stringEMP + ")";
                db.sequelize.query(sql_get_data1)
                    .success(function(data1) {
                        //get time in lieu*********************
                        if (data1 !== null && data1 !== undefined && data1 !=="" && data1.length!==0) {

                            data1.forEach(function(value, index) {

                                if (value !== null && value !== undefined) {
                                    var isFound = false;
                                    data.forEach(function(valueTime, indexTime) {
                                        if (valueTime !== null &&
                                            valueTime !== undefined &&
                                            valueTime.Employee_id === value.Employee_ID && valueTime.Department_id === value.departmentid) {
                                            isFound = true;
                                        }
                                    });
                                    if (isFound === false) {
                                        data.push({
                                            create_id: info.USER_ID,
                                            user_id: value.id,
                                            Employee_id: value.Employee_ID,
                                            Department_id: value.departmentid
                                        });

                                    }
                                }

                            });
                            data.forEach(function(value, index) {
                                data[index].time_in_lieu = 0;
                                data1.forEach(function(valueTime, indexTime) {
                                    if (value.Employee_id === valueTime.Employee_ID && value.Department_id === valueTime.departmentid) {
                                        data[index].time_in_lieu = data[index].time_in_lieu + valueTime.time_in_lieu;
                                    }
                                });
                            });
                            //end get time in lieu**********
                            var sql_get_data2 = "SELECT users.id, " +
                                "hr_employee.Employee_ID , " +
                                "departments.departmentid, " +
                                "time_tasks_week.week_no, " +
                                "time_tasks_week.task_week_id, " +
                                "time_item_task.task_id, " +
                                "time_item_task.time_charge " +
                                "FROM hr_employee  " +
                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " +
                                "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " +
                                "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                                "INNER JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " +
                                "WHERE time_tasks_week.task_status_id = 3 AND " +
                                "departments.departmentid IN (" + stringDept + ") AND " +
                                "hr_employee.Employee_ID IN (" + stringEMP + ") AND " +
                                "time_item_task.item_id=22";
                            db.sequelize.query(sql_get_data2)
                                .success(function(data2) {
                                    if(data2!==undefined && data2!==null && data2!=="" && data2.length!==0){                                           
                                        //get time in lieu used and time in lieu remain *******************                                        
                                        if (data !== null && data !== undefined) {
                                            data.forEach(function(value, index) {
                                                data[index].time_in_lieu_used = 0;
                                                data[index].time_in_lieu_remain = 0;
                                                data[index].time_in_lieu_gan_nhat = 0;

                                                if (value !== null && value !== undefined) {
                                                    data2.forEach(function(valueTime, indexTime) {
                                                        if (value.Employee_id === valueTime.Employee_ID && value.Department_id === valueTime.departmentid) {
                                                            data[index].time_in_lieu_used = data[index].time_in_lieu_used + valueTime.time_charge;
                                                        }
                                                    });
                                                }
                                            });
                                            data.forEach(function(value, index) {
                                                if (value !== null && value !== undefined) {
                                                    data[index].time_in_lieu_remain = data[index].time_in_lieu - data[index].time_in_lieu_used;
                                                }
                                            });
                                        }
                                        //end get ***********************************
                                        //get time in lieu for Department
                                        if (data !== null && data !== undefined) {
                                            data.forEach(function(value, index) {
                                                if (value !== null && value !== undefined) {
                                                    var isFound = false;
                                                    data_Dept.forEach(function(valueDept, indexDept) {
                                                        if (valueDept !== null &&
                                                            valueDept !== undefined &&
                                                            valueDept.Department_id === value.Department_id) {

                                                            isFound = true;
                                                        }
                                                    });
                                                    if (isFound == false) {
                                                        data_Dept.push({
                                                            Department_id: value.Department_id
                                                        });
                                                    }
                                                }
                                            });
                                            data_Dept.forEach(function(value, index) {
                                                data_Dept[index].time_in_lieu_Dept = 0;
                                                data_Dept[index].time_in_lieu_used_Dept = 0;
                                                data_Dept[index].time_in_lieu_remain_Dept = 0;
                                                if (value !== null && value !== undefined) {
                                                    data.forEach(function(valueTime, indexTime) {
                                                        if (value.Department_id == valueTime.Department_id) {
                                                            data_Dept[index].time_in_lieu_Dept = data_Dept[index].time_in_lieu_Dept + valueTime.time_in_lieu;
                                                            data_Dept[index].time_in_lieu_used_Dept = data_Dept[index].time_in_lieu_used_Dept + valueTime.time_in_lieu_used;
                                                            data_Dept[index].time_in_lieu_remain_Dept = data_Dept[index].time_in_lieu_remain_Dept + valueTime.time_in_lieu_remain;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        //end get***********************

                                        //get time_in_lieu_all***************
                                        var time_in_lieu_all = 0;
                                        var time_in_lieu_used_all = 0;
                                        var time_in_lieu_remain_all = 0;
                                        if (data_Dept !== null && data_Dept !== undefined) {
                                            data_Dept.forEach(function(value, index) {
                                                if (value !== null && value !== undefined) {
                                                    time_in_lieu_all = time_in_lieu_all + data_Dept[index].time_in_lieu_Dept;
                                                    time_in_lieu_used_all = time_in_lieu_used_all + data_Dept[index].time_in_lieu_used_Dept;
                                                    time_in_lieu_remain_all = time_in_lieu_remain_all + data_Dept[index].time_in_lieu_remain_Dept;
                                                }
                                            });
                                            data_Dept.forEach(function(value, index) {
                                                data_Dept[index].time_in_lieu_all = 0;
                                                data_Dept[index].time_in_lieu_used_all = 0;
                                                data_Dept[index].time_in_lieu_remain_all = 0;
                                                if (value !== null && value !== undefined) {
                                                    data_Dept[index].time_in_lieu_all = time_in_lieu_all;
                                                    data_Dept[index].time_in_lieu_used_all = time_in_lieu_used_all;
                                                    data_Dept[index].time_in_lieu_remain_all = time_in_lieu_remain_all;
                                                }
                                            });
                                        }
                                        //end get************************

                                        //push data_Dept into data**********************
                                        if (data !== null && data !== undefined) {
                                            data.forEach(function(value, index) {
                                                data[index].time_in_lieu_Dept = 0;
                                                data[index].time_in_lieu_used_Dept = 0;
                                                data[index].time_in_lieu_remain_Dept = 0;
                                                data[index].time_in_lieu_gan_nhat_Dept = 0;
                                                data[index].time_in_lieu_all = 0;
                                                data[index].time_in_lieu_used_all = 0;
                                                data[index].time_in_lieu_remain_all = 0;
                                                data[index].time_in_lieu_gan_nhat_all = 0;
                                                if (value !== null && value !== undefined) {
                                                    data_Dept.forEach(function(valueTime, indexTime) {
                                                        if (valueTime !== null && valueTime !== undefined && valueTime.Department_id === value.Department_id) {
                                                            data[index].time_in_lieu_Dept = data_Dept[indexTime].time_in_lieu_Dept;
                                                            data[index].time_in_lieu_used_Dept = data_Dept[indexTime].time_in_lieu_used_Dept;
                                                            data[index].time_in_lieu_remain_Dept = data_Dept[indexTime].time_in_lieu_remain_Dept;
                                                            data[index].time_in_lieu_all = data_Dept[indexTime].time_in_lieu_all;
                                                            data[index].time_in_lieu_used_all = data_Dept[indexTime].time_in_lieu_used_all;
                                                            data[index].time_in_lieu_remain_all = data_Dept[indexTime].time_in_lieu_remain_all;
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        //end push*********************************
                                        //get data3 
                                        var week2 = weeks - 2;
                                        var sql_get_data3 = "SELECT users.id, " +
                                            "hr_employee.Employee_ID , " +
                                            "departments.departmentid, " +
                                            "time_tasks_week.week_no," +
                                            "time_tasks_week.task_week_id, " +
                                            "time_tasks_week.time_in_lieu " +
                                            "FROM hr_employee  " +
                                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                                            "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid  " +
                                            "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " +
                                            "WHERE time_tasks_week.task_status_id = 3 AND " +
                                            "departments.departmentid IN (" + stringDept + ") AND " +
                                            "(time_tasks_week.week_no BETWEEN " + week2 + " AND " + weeks + " ) AND " +
                                            "hr_employee.Employee_ID IN (" + stringEMP + ")";
                                        db.sequelize.query(sql_get_data3)
                                            .success(function(data3) {
                                                if (data3 !== undefined) {
                                                    if (data === null) {
                                                        data.forEach(function(value, index) {
                                                            data[index].time_in_lieu_gan_nhat = 0;
                                                            data[index].time_in_lieu_gan_nhat_Dept = 0;
                                                            data[index].time_in_lieu_gan_nhat_all = 0;
                                                        });
                                                    } else {
                                                        data.forEach(function(value, index) {
                                                            data[index].time_in_lieu_gan_nhat = 0;
                                                            data[index].time_in_lieu_gan_nhat_Dept = 0;
                                                            data[index].time_in_lieu_gan_nhat_all = 0;
                                                            if (value !== null && value !== undefined) {
                                                                data3.forEach(function(valueTime, indexTime) {
                                                                    if (valueTime !== null && valueTime !== undefined && valueTime.departmentid === value.Department_id) {
                                                                        data[index].time_in_lieu_gan_nhat = data[index].time_in_lieu_gan_nhat + valueTime.time_in_lieu;
                                                                    }
                                                                })
                                                            }
                                                        });
                                                        data_Dept.forEach(function(value, index) {
                                                            data_Dept[index].time_in_lieu_gan_nhat_Dept = 0;
                                                            if (value !== null && value !== undefined) {
                                                                data.forEach(function(valueTime, indexTime) {
                                                                    if (valueTime !== null && valueTime !== undefined && valueTime.Department_id === value.Department_id) {
                                                                        data_Dept[index].time_in_lieu_gan_nhat_Dept = data_Dept[index].time_in_lieu_gan_nhat_Dept + valueTime.time_in_lieu_gan_nhat;
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        var time_in_lieu_gan_nhat_all = 0;
                                                        data_Dept.forEach(function(value, index) {
                                                            if (value !== null && value !== undefined) {
                                                                time_in_lieu_gan_nhat_all = time_in_lieu_gan_nhat_all + value.time_in_lieu_gan_nhat_Dept;
                                                            }
                                                        });
                                                        data.forEach(function(value, index) {
                                                            if (value !== null && value !== undefined) {
                                                                data[index].time_in_lieu_gan_nhat_all = time_in_lieu_gan_nhat_all;
                                                                data_Dept.forEach(function(valueTime, indexTime) {
                                                                    if (valueTime !== null && valueTime !== undefined && valueTime.Department_id === value.Department_id) {
                                                                        data[index].time_in_lieu_gan_nhat_Dept = valueTime.time_in_lieu_gan_nhat_Dept;
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                }
                                                if (data !== null && data !== undefined) {
                                                    data.forEach(function(value, index) {
                                                        if (value !== null && value !== undefined) {
                                                            value.time_in_lieu_remain = value.time_in_lieu_remain - value.time_in_lieu_gan_nhat;
                                                            value.time_in_lieu_remain_Dept = value.time_in_lieu_remain_Dept - value.time_in_lieu_gan_nhat_Dept;
                                                            value.time_in_lieu_remain_all = value.time_in_lieu_remain_all - value.time_in_lieu_gan_nhat_all;
                                                        }
                                                    });
                                                }
                                                for(var i = 0; i < data.length; i++){
                                                    stringline1+="("+
                                                                data[i].create_id+","+
                                                                data[i].Employee_id+","+
                                                                data[i].Department_id+","+
                                                                data[i].time_in_lieu+","+
                                                                data[i].time_in_lieu_used+","+
                                                                data[i].time_in_lieu_remain+","+
                                                                data[i].time_in_lieu_gan_nhat+","+
                                                                data[i].time_in_lieu_Dept+","+
                                                                data[i].time_in_lieu_used_Dept+","+
                                                                data[i].time_in_lieu_remain_Dept+","+
                                                                data[i].time_in_lieu_gan_nhat_Dept+","+
                                                                data[i].time_in_lieu_all+","+
                                                                data[i].time_in_lieu_used_all+","+
                                                                data[i].time_in_lieu_remain_all+","+
                                                                data[i].time_in_lieu_gan_nhat_all+",'"+
                                                                moment(getnewdate).format("YYYY-MM-DD")+"',"+
                                                                data[i].user_id+","+
                                                                data[i].user_id+"),";
                                                }
                                                stringline1 = stringline1.substring(0, stringline1.length - 1);
                                                var sql_insert = "INSERT INTO "+
                                                                "time_in_lieu_report "+
                                                                "(create_id, "+
                                                                "Employee_id, "+
                                                                "Department_id, "+
                                                                "time_in_lieu, "+
                                                                "time_in_lieu_used, "+
                                                                "time_in_lieu_remain, "+
                                                                "time_in_lieu_gan_nhat, "+
                                                                "time_in_lieu_Dept, "+
                                                                "time_in_lieu_used_Dept, "+
                                                                "time_in_lieu_remain_Dept, "+
                                                                "time_in_lieu_gan_nhat_Dept, "+
                                                                "time_in_lieu_all, "+
                                                                "time_in_lieu_used_all, "+
                                                                "time_in_lieu_remain_all, "+
                                                                "time_in_lieu_gan_nhat_all, "+
                                                                "Creation_date, "+
                                                                "Creation_by, "+
                                                                "user_id) "+
                                                                "VALUE "+stringline1;
                                                db.sequelize.query(sql_insert)
                                                    .success(function(insert_success){
                                                        res.json({
                                                            status:"success"
                                                        });
                                                        return;
                                                    })
                                                    .error(function(err){
                                                        console.log("*****ERROR: "+err+" *****");
                                                        res.json({
                                                            status:"error"
                                                        });
                                                        return;
                                                    })
                                            })
                                            .error(function(err) {
                                                console.log("*****ERROR: " + err + " *****");
                                                res.json({
                                                    status: "error"
                                                });
                                                return;
                                            })
                                            //
                                    }
                                    else{
                                        res.json({
                                            status:"null"
                                        });
                                        return;
                                    }
                                })
                                .error(function(err) {
                                    console.log("*****ERROR: " + err + " *****");
                                    res.json({
                                        status: "error"
                                    });
                                    return;
                                })
                        }
                        else{
                            res.json({
                                status:"null"
                            });
                            return;
                        }                        

                    })
                    .error(function(err) {
                        console.log("*****ERROR: " + err + " *****");
                        res.json({
                            status: "error"
                        });
                        return;
                    })

            })
            .error(function(err) {
                console.log("*****ERROR: " + err + " *****");
                res.json({
                    status: "error"
                });
                return;
            })
            //1.END XOA TIME IN LIEU REPORT

        //END
    },

    LoadReportUtilizationRatioDetail: function(req, res) {
        var info = req.body.info;
        var stringEMP   = "";
        var stringDept  = "";
        var stringline1 = "";
        var array_employee = [];
        var flags_employee = [];
        var array_Dept = [];
        var flags_Dept = [];
        var getnewdate= new Date();
        getnewdate.setHours(0, 0, 0);
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        //DELETE DATA IN TABLE
        var sql_delete_time_activity_report = "DELETE from time_activity_report WHERE user_id= :user_id ";
        db.sequelize.query(sql_delete_time_activity_report,null,{
            raw : true
        },{
            user_id  :info.USER_ID
        })
            .success(function(data_delete3) {

                                //END DELETE
                                var sql_get_data_time_activity_table = "SELECT "+
                                                                    "users.id,  "+
                                                                    "hr_employee.FirstName,  "+
                                                                    "hr_employee.LastName,  "+
                                                                    "hr_employee.Employee_ID , "+  
                                                                    "departments.departmentid,  "+
                                                                    "departments.departmentName,  "+
                                                                    "time_tasks_week.week_no,  "+
                                                                    "time_tasks_week.creation_date,  "+
                                                                    "time_tasks_week.last_update_date,  "+
                                                                    "time_tasks_week.task_week_id, "+
                                                                    "time_tasks.activity_id, "+
                                                                    "time_tasks.time_charge "+
                                                                    "FROM hr_employee  "+
                                                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID "+ 
                                                                    "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid  "+
                                                                    "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id "+
                                                                    "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id "+
                                                                    "WHERE time_tasks_week.task_status_id = 3  "+
                                                                    "AND departments.departmentid IN ( "+stringDept+")  AND (time_tasks_week.start_date BETWEEN :start_date AND :end_date) "+
                                                                    "AND (time_tasks_week.end_date BETWEEN :start_date AND :end_date) "+
                                                                    "AND hr_employee.Employee_ID IN ( "+stringEMP+" ) "+
                                                                    "ORDER BY departments.departmentid,hr_employee.Employee_ID,time_tasks.activity_id";//WHERE
                                db.sequelize.query(sql_get_data_time_activity_table,null,{
                                        raw : true
                                    },{
                                        start_date : info.weekFrom,
                                        end_date   : info.weekTo
                                })
                                    .success(function(data) {
                                        if(data!==null&&data!=undefined&data!==""&&data.length!==0){
                                            data.forEach(function(value,index){
                                                if(value!==null&&value!==undefined){
                                                    var isFound = false;
                                                    array_employee.forEach(function(valueTime,indexTime){
                                                        if(valueTime!==null&&valueTime!==undefined&&
                                                            valueTime.Department_id===value.departmentid&&
                                                            valueTime.Employee_id===value.Employee_ID){
                                                            isFound = true;
                                                        }
                                                    });
                                                    if(isFound===false){
                                                        array_employee.push({
                                                            time_charge:{},
                                                            Department_id : value.departmentid,
                                                            Employee_id : value.Employee_ID
                                                        });
                                                    }
                                                }
                                            });
                                            if(array_employee!==null&&array_employee!==undefined&&array_employee!==""&&array_employee.length!==0){
                                                array_employee.forEach(function(value,index){
                                                    if(value!==null&&value!==undefined){
                                                        for(var i=0;i<5;i++){
                                                            flags_employee[i] ={};
                                                            flags_employee[i].activity_id = i+1;
                                                            flags_employee[i].time_charge = 0;
                                                        }
                                                        array_employee[index].time_charge = clone(flags_employee);
                                                        array_employee[index].time_charge_week = 0;
                                                    }
                                                });
                                                for(var i = 0; i < data.length; i++){
                                                    for(var j = 0; j < array_employee.length; j++){
                                                        if(data[i].departmentid===array_employee[j].Department_id&&
                                                            data[i].Employee_ID===array_employee[j].Employee_id){
                                                            for(var n = 0; n < 5; n++){
                                                                if(data[i].activity_id===array_employee[j].time_charge[n].activity_id){
                                                                    array_employee[j].time_charge[n].time_charge = array_employee[j].time_charge[n].time_charge + data[i].time_charge;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                for(var i = 0; i < array_employee.length; i++){
                                                    for(var j = 0; j < 5; j++){
                                                        array_employee[i].time_charge_week = array_employee[i].time_charge_week + array_employee[i].time_charge[j].time_charge;
                                                    }
                                                }
                                                array_employee.forEach(function(value,index){
                                                    if(value!==null&&value!==undefined){
                                                        var isFound= false;
                                                        array_Dept.forEach(function(valueTime,indexTime){
                                                            if(valueTime!==null&&valueTime!==undefined&&
                                                                valueTime.Department_id===value.Department_id){
                                                                isFound = true;
                                                            }
                                                        });
                                                        if(isFound==false){
                                                            array_Dept.push({
                                                                time_charge:{},
                                                                Department_id: value.Department_id,
                                                                user_id      : info.USER_ID
                                                            })
                                                        }
                                                    }
                                                });
                                                if(array_Dept!==null&&array_Dept!==undefined&&array_Dept!==""&&array_Dept.length!==0){
                                                    array_Dept.forEach(function(value,index){
                                                        if(value!==null&&value!==undefined){
                                                            for(var i = 0; i < 5; i++){
                                                                flags_Dept[i] ={};
                                                                flags_Dept[i].activity_id = i+1;
                                                                flags_Dept[i].time_charge_Dept = 0;
                                                                flags_Dept[i].time_charge_all = 0;
                                                            }
                                                            array_Dept[index].time_charge = clone(flags_Dept);
                                                            array_Dept[index].time_charge_Dept = 0;
                                                            array_Dept[index].time_charge_all = 0;
                                                        }
                                                    });
                                                    for(var i = 0; i< data.length; i++){
                                                        for(var j = 0; j < array_Dept.length; j++){
                                                            if(data[i].departmentid===array_Dept[j].Department_id){
                                                                for(var n = 0; n < 5; n++){
                                                                    if(data[i].activity_id===array_Dept[j].time_charge[n].activity_id){
                                                                        array_Dept[j].time_charge[n].time_charge_Dept = array_Dept[j].time_charge[n].time_charge_Dept + data[i].time_charge;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    for(var i = 0; i < data.length; i++){
                                                        for(var j = 0; j < array_Dept.length; j++){
                                                            for(var n = 0; n < 5; n++){
                                                                if(data[i].activity_id===array_Dept[j].time_charge[n].activity_id){
                                                                    array_Dept[j].time_charge[n].time_charge_all = array_Dept[j].time_charge[n].time_charge_all + data[i].time_charge;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    for(var i = 0;i < array_Dept.length; i++){
                                                        for(var j = 0; j < 5; j++){
                                                            array_Dept[i].time_charge_Dept = array_Dept[i].time_charge_Dept + array_Dept[i].time_charge[j].time_charge_Dept;
                                                            array_Dept[i].time_charge_all  = array_Dept[i].time_charge_all + array_Dept[i].time_charge[j].time_charge_all;
                                                        }
                                                    }

                                                    for(var i = 0; i < array_employee.length; i++){
                                                        stringline1 +="("+info.USER_ID+","+array_employee[i].time_charge_week+","+array_employee[i].Employee_id+","+array_employee[i].Department_id+",";
                                                        for(var j = 0; j < 5; j++){
                                                            stringline1+=array_employee[i].time_charge[j].time_charge+",";
                                                        }
                                                        if(stringline1!=="("){
                                                            for(var n = 0; n < array_Dept.length;n++){
                                                                if(array_employee[i].Department_id===array_Dept[n].Department_id){
                                                                    stringline1+=array_Dept[n].time_charge_Dept+","+array_Dept[n].time_charge_all+",";
                                                                    for(var m = 0; m < 5; m++){
                                                                        stringline1+=array_Dept[n].time_charge[m].time_charge_Dept+","+array_Dept[n].time_charge[m].time_charge_all+",";
                                                                    }
                                                                    stringline1+="'"+moment(info.weekFrom).format("YYYY-MM-DD") + "','" +
                                                                                 moment(info.weekTo).format("YYYY-MM-DD") + "','"+
                                                                                 moment(getnewdate).format("YYYY-MM-DD")+ "'),";
                                                                }
                                                            }
                                                        }
                                                    }
                                                    stringline1 = stringline1.substring(0, stringline1.length - 1);
                                                    var sql_insert = "INSERT INTO "+
                                                                        "time_activity_report "+
                                                                        "(user_id, "+
                                                                        "time_charge_week, "+
                                                                        "Employee_id, "+
                                                                        "Department_id, "+
                                                                        "time_charge_1, "+
                                                                        "time_charge_2, "+
                                                                        "time_charge_3, "+
                                                                        "time_charge_4, "+
                                                                        "time_charge_5, "+
                                                                        "time_charge_week_Dept, "+
                                                                        "time_charge_all, "+
                                                                        "time_charge_1_Dept, "+
                                                                        "time_charge_1_all, "+
                                                                        "time_charge_2_Dept, "+
                                                                        "time_charge_2_all, "+
                                                                        "time_charge_3_Dept, "+
                                                                        "time_charge_3_all, "+
                                                                        "time_charge_4_Dept, "+
                                                                        "time_charge_4_all, "+
                                                                        "time_charge_5_Dept, "+
                                                                        "time_charge_5_all, "+
                                                                        "from_date, "+
                                                                        "to_date, "+
                                                                        "Creation_date ) "+
                                                                    "VALUE "+stringline1;
                                                    db.sequelize.query(sql_insert)
                                                        .success(function(data_success){
                                                            res.json({
                                                                status:"success"
                                                            });
                                                            return;
                                                        })
                                                        .error(function(err){
                                                            console.log("*****ERROR: "+err+" *****");
                                                            res.json({
                                                                status:"error"
                                                            });
                                                            return;
                                                        })
                                                }
                                                else{
                                                    res.json({
                                                        status:"null"
                                                    });
                                                    return;
                                                }
                                            }
                                            else{
                                                res.json({
                                                    status:"null"
                                                });
                                                return;
                                            }
                                        }
                                        else{
                                            res.json({
                                                status:"null"
                                            });
                                            return;
                                        }
                                        
                                    })
                                    .error(function(err) {
                                        console.log("*****ERROR: " + err + " *****");
                                        res.json({
                                            status: "error"
                                        });
                                        return;
                                    });
                            

            })
            .error(function(err) {
                console.log("*****ERROR: " + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            });
        //
    },

    LoadReportUtilizationRatioSumary: function(req, res) {
        var info = req.body.info;
        var stringEMP   = "";
        var stringDept  = "";
        var stringline1 = "";
        var array_Dept = [];
        var flags_Dept = [];
        var time_charge_all = 0;
        var getnewdate= new Date();
        getnewdate.setHours(0, 0, 0);
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var time_charge_all = 0;
        var flag1 = 0;
        //DELETE ALL TABLE
        var sql_delete_time_activity_summary_report = " DELETE FROM time_activity_summary_report WHERE user_id= :user_id ";
        //DELETE TABLE time_activity_summary_table
        db.sequelize.query(sql_delete_time_activity_summary_report,null,{
            raw : true
        },{
            user_id : info.USER_ID
        })
            .success(function(sql_del){
                var sql_get_data = "SELECT "+
                                    "users.id,  "+
                                    "hr_employee.FirstName,  "+
                                    "hr_employee.LastName,  "+
                                    "hr_employee.Employee_ID , "+  
                                    "departments.departmentid,  "+
                                    "departments.departmentName,  "+
                                    "time_tasks_week.week_no,  "+
                                    "time_tasks_week.creation_date,  "+
                                    "time_tasks_week.last_update_date,  "+
                                    "time_tasks_week.task_week_id, "+
                                    "time_tasks.activity_id, "+
                                    "time_tasks.time_charge "+
                                    "FROM hr_employee  "+
                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID "+ 
                                    "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid  "+
                                    "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id "+
                                    "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id "+
                                    "WHERE time_tasks_week.task_status_id = 3  "+
                                    "AND departments.departmentid IN ( "+stringDept+")  AND (time_tasks_week.start_date BETWEEN :start_date AND :end_date) "+
                                    "AND (time_tasks_week.end_date BETWEEN :start_date AND :end_date) "+
                                    "AND hr_employee.Employee_ID IN ( "+stringEMP+" ) "+
                                    "ORDER BY departments.departmentid,hr_employee.Employee_ID,time_tasks.activity_id";//WHERE 
                db.sequelize.query(sql_get_data,null,{
                    raw : true
                },{
                    start_date : info.weekFrom,
                    end_date   : info.weekTo
                })
                    .success(function(data){
                        if(data!==undefined&&data!==null&&data!==""&&data.length!==0){
                            data.forEach(function(value,index){
                                if(value!==undefined&&value!==null){
                                    var isFound = false;
                                    array_Dept.forEach(function(valueTime,indexTime){
                                        if(valueTime!==undefined&&valueTime!==undefined&&
                                            valueTime.Department_id===value.departmentid){
                                            isFound = true;
                                        }
                                    });
                                    if(isFound==false){
                                        array_Dept.push({
                                            activity   : {},
                                            Department_id : value.departmentid
                                        })
                                    }
                                }
                            });
                            if(array_Dept!==undefined&&array_Dept!==null&&array_Dept!==""&&array_Dept.length!==0){
                                array_Dept.forEach(function(value,index){
                                    if(value!==undefined&&value!==null){
                                        for(var i = 0; i < 5; i++){
                                            flags_Dept[i] ={};
                                            flags_Dept[i].activity_id = i+1;
                                            flags_Dept[i].time_charge_Dept = 0;
                                            flags_Dept[i].time_charge_Dept_per = 0;
                                        }
                                        array_Dept[index].activity = clone(flags_Dept);
                                        array_Dept[index].time_charge_Dept_all = 0;
                                        array_Dept[index].time_charge_all = 0;
                                    }
                                });
                                data.forEach(function(value,index){
                                    if(value!==undefined&&value!==null){
                                        array_Dept.forEach(function(valueTime,indexTime){
                                            if(valueTime!==undefined&&valueTime!==null&&
                                                valueTime.Department_id===value.departmentid){
                                                for(var i = 0; i < 5; i++){
                                                    if(value.activity_id===valueTime.activity[i].activity_id){
                                                        valueTime.activity[i].time_charge_Dept = valueTime.activity[i].time_charge_Dept + value.time_charge;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                });
                                array_Dept.forEach(function(value,index){
                                    if(value!==undefined&&value!==null){
                                        for(var i = 0; i < 5; i++){
                                            value.time_charge_Dept_all += value.activity[i].time_charge_Dept;
                                        }
                                    }
                                });
                                array_Dept.forEach(function(value,index){
                                    if(value!==undefined&&value!==null){
                                        time_charge_all += value.time_charge_Dept_all;
                                    }
                                });
                                array_Dept.forEach(function(value,index){
                                    if(value!==undefined&&value!==null){
                                        value.time_charge_all = time_charge_all;
                                        for(var i = 0; i < 5; i++){
                                            value.activity[i].time_charge_Dept_per = (value.activity[i].time_charge_Dept/value.time_charge_Dept_all)*100;
                                        }
                                    }
                                });
                                for(var i = 0; i < array_Dept.length; i++){
                                    for(var j = 0; j < 5; j++){
                                         stringline1+="("+info.USER_ID+","+
                                                    array_Dept[i].Department_id+","+
                                                    array_Dept[i].time_charge_Dept_all+","+
                                                    array_Dept[i].time_charge_all+","+
                                                    array_Dept[i].activity[j].activity_id+","+
                                                    array_Dept[i].activity[j].time_charge_Dept+","+
                                                    array_Dept[i].activity[j].time_charge_Dept_per+",'"+
                                                    moment(info.weekFrom).format("YYYY-MM-DD") + "','" +
                                                    moment(info.weekTo).format("YYYY-MM-DD") + "','"+
                                                    moment(getnewdate).format("YYYY-MM-DD")+ "'),";

                                    }
                                }
                                stringline1 = stringline1.substring(0, stringline1.length - 1);
                                var sql_insert = "INSERT INTO "+
                                                 "time_activity_summary_report "+
                                                 "(user_id, "+
                                                 "Department_id, "+
                                                 "time_charge_Dept_all, "+
                                                 "time_charge_all, "+
                                                 "activity_id, "+
                                                 "time_charge_Dept, "+
                                                 "time_charge_Dept_per, "+
                                                 "from_date, "+
                                                 "to_date, "+
                                                 "Creation_date ) "+
                                                 "VALUE "+stringline1;
                                db.sequelize.query(sql_insert)
                                    .success(function(data_success){
                                        res.json({
                                            status:"success"
                                        });
                                        return;
                                    })
                                    .error(function(err){
                                        console.log("*****ERROR: "+err+" *****");
                                        res.json({
                                            status:"error"
                                        });
                                        return;
                                    })
                            }
                            else{
                                res.json({
                                    status:"null"
                                });
                                return;
                            }
                        }
                        else{
                            res.json({
                                status:"null"
                            });
                            return;
                        }
                    })
                    .error(function(err){
                        console.log("*****ERROR: "+err+" *****");
                        res.json({
                            status:"error"
                        });
                        return;
                    })
            })
            .error(function(err){
                console.log("*****ERROR: "+err+" *****");
                res.json({
                    status:"error"
                });
                return;
            })       
    },

    LoadReportItemNumber: function(req, res) {
        var arrayEMP = req.body.info.listEMP;
        var dateWeekFrom = moment(req.body.info.dateWeekFrom).format("YYYY-MM-DD");
        var dateWeekTo = moment(req.body.info.dateWeekTo).format("YYYY-MM-DD");
        var USER_ID = req.body.info.USER_ID;
        var listEMP = "";
        //CHECK LENGTH ARRAY
        if (arrayEMP !== undefined &&
            arrayEMP !== null &&
            arrayEMP.length !== 0) {
            arrayEMP.forEach(function(value, index) {
                if (value !== undefined &&
                    value !== null &&
                    !isNaN(value.id)) {
                    listEMP += value.id + ",";
                }
            });
            //CHECK LIST EMP
            if (listEMP === "") {
                listEMP = "(-1)";
            } else {
                listEMP = "(" + listEMP.substring(0, listEMP.length - 1) + ")";
            }
            var queryGetItemBuilable =
                "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName, time_item_task.item_id, " +
                "hr_employee.Employee_ID, hr_employee.Dept_ID, " +
                "time_item_task.time_charge " +
                "FROM hr_employee " +
                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                "INNER JOIN time_tasks_week ON time_tasks_week.user_id = users.id " +
                "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
                "INNER JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " +
                "INNER JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id AND time_item_code.IS_BILLABLE = 1 " +
                "WHERE hr_employee.Employee_ID IN " + listEMP +
                " AND time_tasks_week.task_status_id = 3 AND " +
                "time_tasks.date BETWEEN :dateWeekFrom AND :dateWeekTo " +
                "ORDER BY time_item_task.item_id ASC";
            db.sequelize.query(queryGetItemBuilable, null, {
                    raw: true
                }, {
                    dateWeekFrom: dateWeekFrom,
                    dateWeekTo: dateWeekTo
                })
                .success(function(resultListItemBuilble) {
                    if (resultListItemBuilble !== null &&
                        resultListItemBuilble.length !== 0) {
                        //GET ARRAY ITEM
                        var arrayItem = [];
                        var arrayDept = [];
                        var arrayEmployeeHasItem = [];
                        resultListItemBuilble.forEach(function(value, index) {
                            if (value !== null &&
                                value.item_id !== null) {
                                //PUSH ITEM
                                var isFoundItem = false;
                                arrayItem.forEach(function(valueItem, indexItem) {
                                    if (valueItem.item_id !== null &&
                                        valueItem.item_id !== undefined &&
                                        valueItem.item_id === value.item_id) {
                                        isFoundItem = true
                                    }
                                });
                                if (isFoundItem === false) {
                                    arrayItem.push({
                                        item_id: value.item_id
                                    });
                                }
                                //END PUSH ITEM

                                //PUSH DEPT
                                var isFoundDept = false;
                                arrayDept.forEach(function(valueDept, indexDept) {
                                    if (valueDept.Dept_ID !== null &&
                                        valueDept.Dept_ID !== undefined &&
                                        valueDept.Dept_ID === value.Dept_ID) {
                                        isFoundDept = true
                                    }
                                });
                                if (isFoundDept === false) {
                                    arrayDept.push({
                                        Dept_ID: value.Dept_ID
                                    });
                                }
                                //END PUSH DEPT

                                //PUSH EMP
                                var isFoundEMP = false;
                                arrayEmployeeHasItem.forEach(function(valueEmployee, indexEmployee) {
                                    if (valueEmployee.Employee_ID !== null &&
                                        valueEmployee.Employee_ID !== undefined &&
                                        valueEmployee.Employee_ID === value.Employee_ID) {
                                        isFoundEMP = true
                                    }
                                });
                                if (isFoundEMP === false) {
                                    arrayEmployeeHasItem.push({
                                        Employee_ID: value.Employee_ID,
                                        Dept_ID: value.Dept_ID
                                    });
                                }
                                //END PUSH EMP
                            }
                        });
                        //END GET ARRAY

                        var arrayReportEmployee = [];
                        // COUNT ITEM AND SUM TIME CHARGE FOR EMPLOYEE
                        arrayEmployeeHasItem.forEach(function(valueEmployee, indexEmployee) {
                            arrayItem.forEach(function(valueItem, indexItem) {
                                var countItemForEmployee = 0;
                                var sumTimechargeItemForEmployee = 0;
                                resultListItemBuilble.forEach(function(valueItemEMP, indexEMP) {
                                    if (valueItemEMP.item_id === valueItem.item_id &&
                                        valueItemEMP.Employee_ID === valueEmployee.Employee_ID) {
                                        countItemForEmployee++;
                                        sumTimechargeItemForEmployee += valueItemEMP.time_charge;
                                    }
                                });
                                if (countItemForEmployee > 0) {
                                    arrayReportEmployee.push({
                                        Employee_ID: valueEmployee.Employee_ID,
                                        item_id: valueItem.item_id,
                                        count_item_employee: countItemForEmployee,
                                        Dept_ID: valueEmployee.Dept_ID,
                                        time_charge_employee: sumTimechargeItemForEmployee
                                    });
                                }
                            });
                        });
                        //END COUNT AND SUM FOR EMPLOYEE
                        var arrayReportDept = [];
                        // COUNT ITEM AND SUM TIME CHARGE FOR DEPT
                        arrayDept.forEach(function(valueDept, indexDept) {
                            arrayItem.forEach(function(valueItem, indexItem) {
                                //SUM TIME CHARGE
                                var sumTimechargeItemForDept = 0;
                                var countItemForDept = 0;
                                resultListItemBuilble.forEach(function(valueItemEMP, indexItemEMP) {
                                    if (valueItemEMP.Dept_ID === valueDept.Dept_ID) {
                                        sumTimechargeItemForDept += valueItemEMP.time_charge;
                                        countItemForDept++;
                                    }
                                });
                                arrayReportDept.push({
                                    item_id: valueItem.item_id,
                                    count_item_dept: countItemForDept,
                                    Dept_ID: valueDept.Dept_ID,
                                    time_charge_dept: sumTimechargeItemForDept
                                });
                                //END SUM TIME CHARGE
                            });

                        });
                        // SET COUNT AND SUM TIME CHARGE FROM DEPT FOR EMPLOYEE ARRAY
                        var count_item_all = 0;
                        var sum_time_charge_all = 0;
                        arrayReportEmployee.forEach(function(valueEMP, indexEMP) {
                            arrayReportDept.forEach(function(valueDept, indexDept) {
                                if (valueEMP.Dept_ID === valueDept.Dept_ID) {
                                    arrayReportEmployee[indexEMP].count_item_dept = valueDept.count_item_dept;
                                    arrayReportEmployee[indexEMP].time_charge_dept = valueDept.time_charge_dept;
                                }
                            });
                        });

                        //SUM FOR DEPT
                        arrayDept.forEach(function(valueDeptFirst, indexFirst) {
                            arrayReportDept.forEach(function(valueDeptSecond, indexSecond) {
                                if (valueDeptFirst.Dept_ID === valueDeptSecond.Dept_ID) {
                                    arrayDept[indexFirst].count_item_dept = valueDeptSecond.count_item_dept;
                                    arrayDept[indexFirst].time_charge_dept = valueDeptSecond.time_charge_dept;
                                }
                            });
                        });
                        arrayDept.forEach(function(value, index) {
                            count_item_all += value.count_item_dept;
                            sum_time_charge_all += value.time_charge_dept;
                        });
                        //END SUM FOR DEPT

                        //INSERT DATA TO REPORT
                        var arrayInsertReport = "";
                        arrayReportEmployee.forEach(function(value, index) {
                            if (value !== undefined &&
                                value !== null) {
                                arrayInsertReport += "(" + USER_ID + ",'" + value.item_id + "'," + value.Dept_ID + "," +
                                    value.Employee_ID + "," + value.count_item_employee + "," + value.time_charge_employee +
                                    "," + value.count_item_dept + "," + value.time_charge_dept + "," +
                                    count_item_all + "," + sum_time_charge_all + ",'" + dateWeekFrom + "','" + dateWeekTo + "','" +
                                    moment().format("YYYY-MM-DD HH:mm:ss") + "'," + USER_ID + "),";
                            }
                        });
                        if (arrayInsertReport !== "") {
                            arrayInsertReport = arrayInsertReport.substring(0, arrayInsertReport.length - 1);
                        }
                        //END INSERT

                        var queryDelReport = "DELETE FROM report_item_code WHERE report_item_code.user_id = :userId";
                        db.sequelize.query(queryDelReport, null, {
                                raw: true
                            }, {
                                userId: USER_ID
                            })
                            .success(function(resultDel) {
                                var queryInsertReport =
                                    "INSERT INTO report_item_code (user_id, item_id, dept_id, employee_id, count_item_for_employee, " +
                                    "sum_time_charge_for_employee, count_item_for_dept, sum_time_charge_for_dept, count_item_all, sum_time_charge_all, " +
                                    "from_date, to_date, creation_date, created_by) " +
                                    "VALUES " + arrayInsertReport;
                                db.sequelize.query(queryInsertReport)
                                    .success(function(resultInsert) {
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
                            })
                            .error(function(err) {
                                console.log("*****ERROR:" + err + "*****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            });
                        //END SET FROM DEPT FOR EMPLOYEE ARRAY
                        //END COUNT AND SUM FOR DEPT

                    } else {
                        //DELETE DATA OLD AND RES
                        var queyDelOldReport = "DELETE FROM report_item_code WHERE report_item_code.user_id = :userId";
                        db.sequelize.query(queyDelOldReport, null, {
                                raw: true
                            }, {
                                userId: USER_ID
                            })
                            .success(function(resultDel) {
                                res.json({
                                    status: "dataNull"
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

                    }
                })
                .error(function(err) {
                    console.log("*****ERROR:" + err + "*****");
                    res.json({
                        status: "error"
                    });
                });
        }
    },
};
