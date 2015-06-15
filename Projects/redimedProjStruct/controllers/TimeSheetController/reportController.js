//EXPORTS MODEL
var db = require("../../models");
var chainer = new db.Sequelize.Utils.QueryChainer;
var moment=require("moment");
var functionForTimesheet=require('./functionForTimesheet');
//END
module.exports = {
    LoadDeptReport: function(req, res) {
        var USER_ID = req.body.USER_ID;
        var query = "SELECT hr_employee.TITLE FROM hr_employee " +
            "INNER JOIN users ON users.employee_id  = hr_employee.Employee_ID " +
            "WHERE users.id = " + USER_ID;
        db.sequelize.query(query)
            .success(function(result) {
                if (result !== undefined && result !== null && result.length !== 0) {
                    var TITLE = result[0].TITLE;
                    var queryDept = "";
                    if (TITLE === "Director") {
                        //ALL DEPT
                        queryDept = "SELECT DISTINCT departments.departmentid as id, departments.departmentName as label FROM departments " +
                            "WHERE departments.departmentType = 'Time Sheet'";
                    } else {
                        //ONE DEPT
                        queryDept = "SELECT DISTINCT departments.departmentid as id, departments.departmentName as label FROM departments " +
                            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
                            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
                            "WHERE departments.departmentType = 'Time Sheet' AND users.id = " + USER_ID;
                    }
                    db.sequelize.query(queryDept)
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

    LoadEmpReport: function(req, res) {
        var listDept = req.body.listDept;
        var strListDept = "";
        for (var i = 0; i < listDept.length; i++) {
            strListDept += listDept[i].id + ", ";
        }
        if (strListDept !== undefined && strListDept !== null && strListDept !== "" && strListDept.length !== 0) {
            strListDept = strListDept.substring(0, strListDept.length - 2);
        } else {
            strListDept = null;
        }
        var queryStaff = "";
        if (req.body.listDept[0].USER_ID !== undefined &&
            req.body.listDept[0].isStaff === true) {
            queryStaff = "AND users.id = " + req.body.listDept[0].USER_ID;
        }
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

    LoadReports1: function(req, res) {
        var info = req.body.info;
        var weekNoFrom = info.weekNoFrom;
        var weekNoTo = info.weekNoTo;
        var listEMP = info.listEMP;
        var USER_ID = info.USER_ID;
        var listDept = info.listDept;
        var weekFrom = moment(info.weekFrom).format("YYYY-MM-DD");
        var weekTo = moment(info.weekTo).format("YYYY-MM-DD");
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

        // SELECT DEPT
        var queryDept = "SELECT DISTINCT COUNT(hr_employee.Employee_ID) AS CountEmp, departments.departmentName, departments.departmentid FROM departments " +
            "INNER JOIN hr_employee ON hr_employee.Dept_ID = departments.departmentid " +
            "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " +
            "INNER JOIN time_tasks_week ON time_tasks_week.user_id  = users.id " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks_week.week_no BETWEEN " + weekNoFrom + " AND " + weekNoTo + " GROUP BY departments.departmentName ORDER BY departments.departmentName ASC";
        // END DEPT

        // SELECT TIMECHARGE ACTIVITY
        var queryActivity = "SELECT sum(time_tasks.time_charge) as SUM_CHARGE_ACTIVITY, time_tasks.activity_id, hr_employee.Employee_ID, " +
            "hr_employee.FirstName, hr_employee.LastName, departments.departmentName " +
            "FROM time_tasks_week " +
            "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " +
            "INNER JOIN users ON users.id = time_tasks_week.user_id " +
            "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
            "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " +
            "WHERE users.employee_id IN (" + strListEmp + ") AND time_tasks_week.task_status_id = 3 AND " +
            "time_tasks_week.week_no BETWEEN " + weekNoFrom + " AND " + weekNoTo +
            " GROUP BY hr_employee.Employee_ID, time_tasks.activity_id ORDER BY departments.departmentid";
        // END ACTIVITY

        // SELECT TIMECHARGE ALL
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
            "time_tasks_week.week_no BETWEEN " + weekNoFrom + " AND " + weekNoTo + ") C GROUP BY C.Employee_ID";
        // END ALL
        db.sequelize.query(queryDept)
            .success(function(resultDept) {
                if(resultDept!==undefined&&resultDept!==null&&resultDept!==""&&resultDept.length!==0){                    
                    db.sequelize.query(querySumTimeCharge)
                        .success(function(resultTimeCharge) {
                            if(resultTimeCharge!==undefined&&resultTimeCharge!==null&&resultTimeCharge!==""&&resultTimeCharge.length!==0){                              
                                db.sequelize.query(queryActivity)
                                    .success(function(resultActivity) {
                                        if(resultActivity!==undefined&&resultActivity!==null&&resultActivity!==""&&resultActivity.length!==0){                                           
                                            for (var i = 0; i < resultDept.length; i++) {
                                                resultDept[i].listEmployee = [];
                                                for (var j = 0; j < resultTimeCharge.length; j++) {
                                                    if (resultDept[i].departmentid === resultTimeCharge[j].departmentid) {
                                                        //PUSH DATA
                                                        resultDept[i].listEmployee.push({
                                                            employee_id: resultTimeCharge[j].Employee_ID,
                                                            name: resultTimeCharge[j].FirstName + " " + resultTimeCharge[j].LastName,
                                                            time_charge: resultTimeCharge[j].SUM_CHARGE,
                                                            time_in_lieu: resultTimeCharge[j].SUM_IN_LIEU,
                                                            over_time: resultTimeCharge[j].SUM_OVER_TIME,
                                                            SUM_CHARGE_ACTIVITY: [],
                                                            activity_id: resultTimeCharge[j].activity_id
                                                        });
                                                        //END
                                                        for (var k = 0; k < resultActivity.length; k++) {
                                                            if (resultActivity[k].Employee_ID === resultDept[i].listEmployee[resultDept[i].listEmployee.length - 1].employee_id) {
                                                                resultDept[i].listEmployee[resultDept[i].listEmployee.length - 1].SUM_CHARGE_ACTIVITY[resultActivity[k].activity_id] = resultActivity[k].SUM_CHARGE_ACTIVITY;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            //INSERT TEMP TABLE REPORTS1

                                            //SUM TIME ON DEPT
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
                                            //END

                                            // SUM ALL
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

                                            //END
                                            var listEmployeeInsert = "";
                                            var listTimeInsert = "";
                                            for (var i = 0; i < resultDept.length; i++) {
                                                for (var j = 0; j < resultDept[i].listEmployee.length; j++) {

                                                    // VALUE EMP
                                                    listEmployeeInsert += "(" + USER_ID + "," + resultDept[i].departmentid + "," + resultDept[i].listEmployee[j].employee_id + ",'" +
                                                        resultDept[i].listEmployee[j].name + "','" + weekFrom + "','" + weekTo + "'," + resultDept[i].sum_ac1_dept +
                                                        "," + resultDept[i].sum_ac2_dept + "," +
                                                        resultDept[i].sum_ac3_dept + "," + resultDept[i].sum_ac4_dept + "," +
                                                        resultDept[i].sum_ac5_dept + "," + (resultDept[i].sum_ac1_dept + resultDept[i].sum_ac2_dept +
                                                            resultDept[i].sum_ac3_dept + resultDept[i].sum_ac4_dept + resultDept[i].sum_ac5_dept) + "," +
                                                        resultDept[i].time_in_lieu_dept + "," + resultDept[i].overtime_dept + ", " + sum_ac1_all +
                                                        ", " + sum_ac2_all + ", " + sum_ac3_all + ", " + sum_ac4_all + ", " +
                                                        sum_ac5_all + ", " + sum_all + ", " + time_in_lieu_all + ", " + overtime_all +
                                                        "), ";
                                                    //EMP
                                                    // VALUE TIME CHARGE
                                                    listTimeInsert += "(" + USER_ID + "," +
                                                        resultDept[i].listEmployee[j].employee_id + "," +
                                                        (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[1] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[1]) + "," +
                                                        (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[2] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[2]) + "," +
                                                        (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[3] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[3]) + "," +
                                                        (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[4] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[4]) + "," +
                                                        (resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[5] === undefined ? 0 : resultDept[i].listEmployee[j].SUM_CHARGE_ACTIVITY[5]) + "," +
                                                        (resultDept[i].listEmployee[j].time_charge === undefined ? 0 : resultDept[i].listEmployee[j].time_charge) + "," + resultDept[i].listEmployee[j].time_in_lieu + ", " + resultDept[i].listEmployee[j].over_time + "), ";
                                                    //TIME 3
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
                                            var queryDelEmployee = "DELETE FROM time_employee_reports1 WHERE user_id = " + USER_ID;
                                            var queryDelTime = "DELETE FROM time_time_charge_reports1 WHERE user_id = " + USER_ID;
                                            db.sequelize.query(queryDelEmployee)
                                                .success(function(delSuccessEmp) {
                                                    db.sequelize.query(queryDelTime)
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
                                        }
                                        else{
                                            res.json({
                                                status:"null"
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
                            }
                            else{
                                res.json({
                                    status:"null"
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
                }
                else{
                    res.json({
                        status:"null"
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
    },

    LoadReportOweLeave: function(req, res) {
        var info = req.body.info;
        //console.log(info);
        var stringEMP   = "";
        var stringDept  = "";
        var stringID    = "";
        var stringline1 = "";
        var start_date;
        var finish_date;
        var date;
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var listleave = [];
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        //get year from
        info.weekFrom = new Date(info.weekFrom);
        info.weekFrom.setHours(0, 0, 0);
        var yearsFrom = info.weekFrom.getFullYear();
        
        //end get year from

        //get year to
        info.weekTo = new Date(info.weekTo);
        info.weekTo.setHours(0, 0, 0);
        var yearsTo = info.weekTo.getFullYear();
        
        //end get year to

        //get string weekno+year
            //if yearfrom = yearto
        if(yearsFrom==yearsTo){
            for(var a = info.weekNoFrom; a <= info.weekNoTo; a++){
                stringline1+="("+a+","+yearsFrom+"),";
            }
            stringline1 = stringline1.substring(0, stringline1.length - 1);
            // console.log(stringline1);
        }//end if
        //else
        else{

            if(info.weekFrom.getMonth()===11){  // if month=12 ->>> lay tuan 53 cua nam do vi neu k set truong hop nay khi tra ve weekno=1 
                stringline1+="(53,"+yearsFrom+"),";
            }
            else{
                for(var a = info.weekNoFrom; a < 54; a++){
                    stringline1+="("+a+","+yearsFrom+"),";
                }
            }

            if(info.weekTo.getMonth()===0){ // if month=1 ->> lay tuan dau tien cua nam do vi neu k set truong hop nay khi tra ve weekno=53
                stringline1+="(1,"+yearsTo+"),";
            }
            else{
                for(var b = info.weekNoTo+1; b > 0;b--){
                    stringline1+="("+b+","+yearsTo+"),";
                }
            }
            var hieu_cua_2_nam = yearsTo - yearsFrom;
            for(var c = 0; c < hieu_cua_2_nam-1; c++){
                var years = yearsFrom+1;
                for(var d = 1;d <54; d++){
                    stringline1+="("+d+","+years+"),";
                }
            }

            stringline1 = stringline1.substring(0, stringline1.length - 1);
            // console.log(stringline1);
        }//end else
        //end get string weekno+year
        

        var sql_get_total_all = "SELECT COUNT(*) AS 'total_all' FROM hr_leave_owe WHERE create_id = :user_id ";
        var sql_get_total_Dept = "SELECT COUNT(department) AS 'total_Dept',department FROM hr_leave_owe WHERE create_id = :user_id GROUP BY department ";
        var sql_get_data_hr_leave_owe_table = "SELECT users.id,"+//SELECT
                                              "hr_employee.FirstName,"+//SELECT
                                              " hr_employee.LastName,"+//SELECT
                                              " hr_employee.Employee_ID ,"+//SELECT
                                              " departments.departmentid,"+//SELECT
                                              " departments.departmentName,"+//SELECT
                                              " time_tasks_week.time_charge,"+//SELECT
                                              " time_tasks_week.time_in_lieu,"+//SELECT
                                              " time_tasks_week.week_no,"+//SELECT
                                              " time_tasks_week.creation_date,"+//SELECT
                                              " time_tasks_week.last_update_date,"+//SELECT
                                              " time_tasks_week.task_week_id " + //SELECT
                                              "FROM hr_employee " + //FROM
                                              "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                              "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + //INNER JOIN
                                              "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + //INNER JOIN
                                              "WHERE time_tasks_week.task_status_id = 3 "+ //WHERE
                                                " AND departments.departmentid IN ( " + stringDept + " ) "+ //WHERE
                                                " AND (time_tasks_week.week_no,YEAR(time_tasks_week.start_date))  IN ( " + stringline1 + " ) "+ //WHERE
                                                " AND hr_employee.Employee_ID IN ( " + stringEMP + " )"; //WHERE

        var delete_hr_leave_owe = "DELETE FROM hr_leave_owe WHERE create_id = :user_id ";

        var delete_hr_leave_owe_table = "DELETE FROM hr_leave_owe_table WHERE create_id = :user_id ";
        db.sequelize.query(delete_hr_leave_owe,null,{
            raw: true
        },{
            user_id : info.USER_ID
        })
            .success(function(delete1) {
                db.sequelize.query(delete_hr_leave_owe_table,null,{
                    raw: true
                },{
                    user_id : info.USER_ID
                })
                    .success(function(delete2) {

                        db.sequelize.query(sql_get_data_hr_leave_owe_table)
                            .success(function(data_hr_leave_owe_table) {
                                if(data_hr_leave_owe_table!==undefined&&data_hr_leave_owe_table!==null&&data_hr_leave_owe_table!==""&&data_hr_leave_owe_table.length!==0){

                                    //console.log(data_hr_leave_owe_table)
                                    for (var i = 0; i < data_hr_leave_owe_table.length; i++) {
                                        db.hr_leave_owe_table.create({
                                                create_id: info.USER_ID,
                                                user_id: data_hr_leave_owe_table[i].id,
                                                task_week_id: data_hr_leave_owe_table[i].task_week_id,
                                                Employee_id: data_hr_leave_owe_table[i].Employee_ID,
                                                Department_id: data_hr_leave_owe_table[i].departmentid,
                                                FirstName: data_hr_leave_owe_table[i].FirstName,
                                                LastName: data_hr_leave_owe_table[i].LastName,
                                                Department_name: data_hr_leave_owe_table[i].departmentName,
                                                weekno: data_hr_leave_owe_table[i].week_no,
                                                from_date: info.weekFrom,
                                                to_date: info.weekTo
                                            })
                                            .success(function(data_insert1) {
                                                flag1++;
                                                if (flag1 == data_hr_leave_owe_table.length) {
                                                    //console.log("NEXXT")
                                                    var sql_get_data_1 = "SELECT " + //SELECT
                                                    "hr_leave_owe_table.create_id, " + //SELECT
                                                    "hr_leave_owe_table.user_id, " + //SELECT
                                                    "hr_leave_owe_table.task_week_id, " + //SELECT
                                                    "hr_leave_owe_table.Employee_id, " + //SELECT
                                                    "hr_leave_owe_table.Department_id, " + //SELECT
                                                    "hr_leave_owe_table.from_date, " + //SELECT
                                                    "hr_leave_owe_table.to_date, " + //SELECT
                                                    "time_tasks.tasks_id, " + //SELECT
                                                    "time_tasks.date, " + //SELECT
                                                    "time_item_task.item_id " + //SELECT
                                                    "FROM hr_leave_owe_table " + //FROM
                                                    "INNER JOIN time_tasks     ON time_tasks.tasks_week_id = hr_leave_owe_table.task_week_id " + //INNER JOIN
                                                    "INNER JOIN time_item_task ON time_item_task.task_id  = time_tasks.tasks_id " + //INNER JOIN
                                                    "WHERE time_item_task.item_id IN (15,16,17,19,24,25) AND hr_leave_owe_table.create_id= :user_id "+ //WHERE
                                                    " ORDER BY hr_leave_owe_table.user_id ";//ORDER BY
                                                    db.sequelize.query(sql_get_data_1,null,{
                                                        raw : true
                                                    },{
                                                        user_id : info.USER_ID
                                                    })
                                                        .success(function(data_1) {
                                                            if(data_1!==undefined&&data_1!==null&&data_1!==""&&data_1.length!==0){

                                                            //console.log(data_1)

                                                            for (var j = 0; j < data_1.length; j++) {
                                                                stringID += data_1[j].user_id + ", ";
                                                            }
                                                            stringID += 0;
                                                            //console.log(stringID)
                                                            var sql_get_data_2 = "SELECT leave_id,start_date,finish_date,status_id,user_id " + //SELECT
                                                                                    "FROM hr_leave " + //FROM
                                                                                    "WHERE user_id IN (" + stringID + ") AND status_id=3 ORDER BY user_id ";//WHERE
                                                            db.sequelize.query(sql_get_data_2)
                                                                .success(function(data_2) {
                                                                    if(data_2!==undefined&&data_2!==null&&data_2!==""&&data_2.length!==0){

                                                                        for(var t =0;t<data_1.length;t++){
                                                                            data_1[t].isReject=0;// if isReject=0 ->>>> ngay nghi khong nam trong leave form 
                                                                        }

                                                                        for(var a= 0;a<data_1.length;a++){
                                                                            date = moment(moment(data_1[a].date).startOf('day')).format("X");
                                                                            for(var b =0;b<data_2.length;b++){
                                                                               start_date  = moment(moment(data_2[b].start_date).startOf('day')).format("X");
                                                                                finish_date = moment(moment(data_2[b].finish_date).startOf('day')).format("X");
                                                                                if(date>=start_date&&date<=finish_date){
                                                                                    data_1[a].isReject=1;
                                                                                }
                                                                            }
                                                                            listleave.push(data_1[a]);
                                                                        }
                                                                        for (var q = 0; q < listleave.length; q++) {
                                                                            db.hr_leave_owe.create({
                                                                                    create_id: listleave[q].create_id,
                                                                                    user_id: listleave[q].user_id,
                                                                                    department: listleave[q].Department_id,
                                                                                    date_leave: listleave[q].date,
                                                                                    employee: listleave[q].Employee_id,
                                                                                    isReject: listleave[q].isReject,
                                                                                    from_date: listleave[q].from_date,
                                                                                    to_date: listleave[q].to_date,
                                                                                    created_by: info.USER_ID
                                                                                })
                                                                                .success(function(data_insert2) {
                                                                                    flag2++;
                                                                                    if (flag2 == listleave.length)

                                                                                        db.sequelize.query(sql_get_total_all,null,{
                                                                                            raw: true
                                                                                        },{
                                                                                            user_id : info.USER_ID
                                                                                        })
                                                                                        .success(function(data_total_all) {
                                                                                            if(data_total_all!==undefined&&data_total_all!==null&&data_total_all!==""&&data_total_all.length!==0){

                                                                                                db.sequelize.query(sql_get_total_Dept,null,{
                                                                                                   raw: true 
                                                                                                },{
                                                                                                    user_id : info.USER_ID
                                                                                                })
                                                                                                    .success(function(data_total_Dept) {
                                                                                                        if(data_total_Dept!==undefined&&data_total_Dept!==null&&data_total_Dept!==""&&data_total_Dept.length!==0){


                                                                                                            for (var u = 0; u < data_total_Dept.length; u++) {
                                                                                                                for (var t = 0; t < listleave.length; t++) {
                                                                                                                    db.hr_leave_owe.update({
                                                                                                                            total_all: data_total_all[0].total_all,
                                                                                                                            total_Dept: data_total_Dept[u].total_Dept
                                                                                                                        }, {
                                                                                                                            department: data_total_Dept[u].department
                                                                                                                        })
                                                                                                                        .success(function(success) {
                                                                                                                            flag4++;
                                                                                                                            if (flag3 == data_total_Dept.length && flag4 == listleave.length) {
                                                                                                                                res.json({
                                                                                                                                    status: "success"
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
                                                                                                                flag3++;
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
                                                                        }
                                                                        //console.log(listleave)
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

            })
            .error(function(err) {
                console.log("*****ERROR: " + err + " *****");
                res.json({
                    status: "error"
                });
                return;
            })

        .error(function(err) {
            console.log("*****ERROR: " + err + " *****");
            res.json({
                status: "error"
            });
            return;
        })
    },

    LoadReportTimeInLieu: function(req, res) {
        var info = req.body.info;
        //console.log(info);
        //CHUYEN LIST EMPL VA LIST DEPT THANH CHUOI STRING
        var stringEMP = "";
        var stringDept = "";
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;
        var sum_ = 0;
        var data      = [];
        var data_Dept = [];
        var d = new Date();
        d.setHours(0, 0, 0);
        var years = d.getFullYear();
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weeks = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

        var sql_delete_time_in_lieu_detail_report="DELETE FROM time_in_lieu_report WHERE create_id= :user_id";
        db.sequelize.query(sql_delete_time_in_lieu_detail_report,null,{
            raw: true
        },{
            user_id  : info.USER_ID
        })
            .success(function(data_delete1){
                //cau SQL lay time in lieu ma user duoc chon tich luy~ tu do den from_date
                var sql_get_data1 = "SELECT users.id, "+//SELECT
                                    "hr_employee.Employee_ID , "+//SELECT
                                    "departments.departmentid, "+//SELECT
                                    "time_tasks_week.week_no,"+//SELECT
                                    "time_tasks_week.task_week_id, "+//SELECT
                                    "time_tasks_week.time_in_lieu "+//SELECT
                                    "FROM hr_employee  "+//FROM
                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID "+//INNER JOIN
                                    "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid  "+//INNER JOIN
                                    "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id "+//INNER JOIN
                                    "WHERE time_tasks_week.task_status_id = 3 AND "+//WHERE
                                    "YEAR(time_tasks_week.start_date)=:years AND "+
                                    "departments.departmentid IN ("+stringDept+") AND "+//WHERE
                                    // "time_tasks_week.week_no<"+info.weekNoFrom+" AND "+
                                    "hr_employee.Employee_ID IN ("+stringEMP+")";//WHERE
                db.sequelize.query(sql_get_data1,null,{
                    raw : true
                },{
                    years : years
                })
                    .success(function(data1){
                        //get time in lieu*********************
                        if(data1!==null&&data1!==undefined&&data1!==""&&data1.length!==0){
                            
                            data1.forEach(function(value,index) {
                                
                               if(value!==null && value !==undefined){
                                    var isFound = false;
                                    data.forEach(function(valueTime,indexTime){
                                        if(valueTime!==null&&
                                            valueTime!==undefined&&
                                            valueTime.Employee_id===value.Employee_ID
                                            &&valueTime.Department_id===value.departmentid){
                                            isFound= true;
                                        }
                                    });
                                    if(isFound===false){
                                        data.push({create_id:info.USER_ID,
                                                    user_id:value.id,
                                                    Employee_id:value.Employee_ID,
                                                    Department_id:value.departmentid});

                                    }
                               }

                            });
                                data.forEach(function(value,index){
                                    data[index].time_in_lieu=0;
                                    data1.forEach(function(valueTime,indexTime){
                                        if(value.Employee_id===valueTime.Employee_ID&&value.Department_id===valueTime.departmentid){
                                            data[index].time_in_lieu=data[index].time_in_lieu+valueTime.time_in_lieu;
                                        }
                                    });
                                });
                        }
                        else{
                            res.json({
                                status:"null"
                            });
                            return;
                        }
                        //end get time in lieu**********
                        var sql_get_data2 = "SELECT users.id, "+//SELECT
                                                "hr_employee.Employee_ID , "+//SELECT
                                                "departments.departmentid, "+//SELECT
                                                "time_tasks_week.week_no, "+//SELECT
                                                "time_tasks_week.task_week_id, "+//SELECT
                                                "time_item_task.task_id, "+//SELECT
                                                "time_item_task.time_charge "+//SELECT
                                                "FROM hr_employee  "+//FROM
                                                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID "+//INNER JOIN
                                                "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid "+//INNER JOIN
                                                "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id "+//INNER JOIN
                                                "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id "+//INNER JOIN
                                                "INNER JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id "+//INNER JOIN
                                                "WHERE time_tasks_week.task_status_id = 3 AND "+//WHERE
                                                "YEAR(time_tasks_week.start_date)=:years AND "+
                                                "departments.departmentid IN ("+stringDept+") AND "+//WHERE
                                                // "(time_tasks_week.week_no <"+info.weekNoFrom+") AND "+
                                                "hr_employee.Employee_ID IN ("+stringEMP+") AND "+//WHERE
                                                "time_item_task.item_id=22";//WHERE
                    db.sequelize.query(sql_get_data2,null,{
                        raw:true
                    },{
                        years: years
                    })
                        .success(function(data2){
                            if(data2!==undefined&&data2!==null&&data2!==""&&data2.length!==0){
                            //get time in lieu used and time in lieu remain *******************
                                if(data!==null && data!==undefined&&data!==""&&data.length!==0){
                                    data.forEach(function(value,index){
                                        data[index].time_in_lieu_used=0;
                                        data[index].time_in_lieu_remain=0;
                                        data[index].time_in_lieu_gan_nhat=0;
                                       
                                        if(value!==null&&value!==undefined){
                                            data2.forEach(function(valueTime,indexTime){
                                                if(value.Employee_id===valueTime.Employee_ID&&value.Department_id===valueTime.departmentid){
                                                    data[index].time_in_lieu_used   = data[index].time_in_lieu_used + valueTime.time_charge; 
                                                }
                                            });
                                        }
                                    });
                                    data.forEach(function(value,index){
                                        if(value!==null&&value!==undefined){
                                            data[index].time_in_lieu_remain = data[index].time_in_lieu - data[index].time_in_lieu_used;
                                        }
                                    });
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
                            //end get ***********************************
                            //get time in lieu for Department
                            if(data!==null&&data!==undefined&&data!==""&&data.length!==0){
                                data.forEach(function(value,index){
                                    if(value!==null&&value!==undefined){
                                        var isFound=false;
                                        data_Dept.forEach(function(valueDept,indexDept){
                                            if(valueDept!==null&&
                                            valueDept!==undefined&&
                                            valueDept.Department_id===value.Department_id){
                                                
                                                isFound=true;
                                            }
                                        });
                                        if(isFound==false){
                                            data_Dept.push({Department_id:value.Department_id});
                                        }
                                    }
                                });
                                data_Dept.forEach(function(value,index){
                                    data_Dept[index].time_in_lieu_Dept=0;
                                    data_Dept[index].time_in_lieu_used_Dept=0;
                                    data_Dept[index].time_in_lieu_remain_Dept=0;
                                    if(value!==null&&value!==undefined){
                                        data.forEach(function(valueTime,indexTime){
                                            if(value.Department_id==valueTime.Department_id){
                                                data_Dept[index].time_in_lieu_Dept        = data_Dept[index].time_in_lieu_Dept + valueTime.time_in_lieu;
                                                data_Dept[index].time_in_lieu_used_Dept   = data_Dept[index].time_in_lieu_used_Dept + valueTime.time_in_lieu_used;
                                                data_Dept[index].time_in_lieu_remain_Dept = data_Dept[index].time_in_lieu_remain_Dept + valueTime.time_in_lieu_remain;
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                res.json({
                                    status:"null"
                                });
                                return;
                            }
                            //end get***********************

                            //get time_in_lieu_all***************
                            var time_in_lieu_all=0;
                            var time_in_lieu_used_all=0;
                            var time_in_lieu_remain_all=0;
                            if(data_Dept!==null&&data_Dept!==undefined&&data_Dept!==""&&data_Dept.length!==0){
                                data_Dept.forEach(function(value,index){
                                    if(value!==null&&value!==undefined){
                                        time_in_lieu_all        = time_in_lieu_all + data_Dept[index].time_in_lieu_Dept;
                                        time_in_lieu_used_all   = time_in_lieu_used_all + data_Dept[index].time_in_lieu_used_Dept;
                                        time_in_lieu_remain_all = time_in_lieu_remain_all + data_Dept[index].time_in_lieu_remain_Dept;

                                    }
                                });
                                data_Dept.forEach(function(value,index){
                                    data_Dept[index].time_in_lieu_all = 0;
                                    data_Dept[index].time_in_lieu_used_all = 0;
                                    data_Dept[index].time_in_lieu_remain_all = 0;
                                    if(value!==null&&value!==undefined){
                                        data_Dept[index].time_in_lieu_all        = time_in_lieu_all;
                                        data_Dept[index].time_in_lieu_used_all   = time_in_lieu_used_all;
                                        data_Dept[index].time_in_lieu_remain_all = time_in_lieu_remain_all;
                                    }
                                });
                            }
                            else{
                                res.json({
                                    status:"null"
                                });
                                return;
                            }
                            //end get************************

                            //push data_Dept into data**********************
                            if(data!==null&&data!==undefined&&data!==""&&data.length!==0){
                                data.forEach(function(value,index){
                                    data[index].time_in_lieu_Dept         = 0;
                                    data[index].time_in_lieu_used_Dept    = 0;
                                    data[index].time_in_lieu_remain_Dept  = 0;
                                    data[index].time_in_lieu_gan_nhat_Dept= 0;
                                    data[index].time_in_lieu_all          = 0;
                                    data[index].time_in_lieu_used_all     = 0;
                                    data[index].time_in_lieu_remain_all   = 0;
                                    data[index].time_in_lieu_gan_nhat_all = 0;
                                    if(value!==null&&value!==undefined){
                                        data_Dept.forEach(function(valueTime,indexTime){
                                            if(valueTime!==null&&valueTime!==undefined&&valueTime.Department_id===value.Department_id){
                                                data[index].time_in_lieu_Dept         = data_Dept[indexTime].time_in_lieu_Dept;
                                                data[index].time_in_lieu_used_Dept    = data_Dept[indexTime].time_in_lieu_used_Dept;
                                                data[index].time_in_lieu_remain_Dept  = data_Dept[indexTime].time_in_lieu_remain_Dept;
                                                data[index].time_in_lieu_all          = data_Dept[indexTime].time_in_lieu_all;
                                                data[index].time_in_lieu_used_all     = data_Dept[indexTime].time_in_lieu_used_all;
                                                data[index].time_in_lieu_remain_all   = data_Dept[indexTime].time_in_lieu_remain_all;
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                res.json({
                                    status:"null"
                                });
                                return;
                            }
                            //end push*********************************
                            //get data3 
                            var week2 = weeks-2;
                            var sql_get_data3 = "SELECT users.id, "+//SELECT
                                    "hr_employee.Employee_ID , "+//SELECT
                                    "departments.departmentid, "+//SELECT
                                    "time_tasks_week.week_no,"+//SELECT
                                    "time_tasks_week.task_week_id, "+//SELECT
                                    "time_tasks_week.time_in_lieu "+//SELECT
                                    "FROM hr_employee  "+//FROM
                                    "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID "+//INNER JOIN
                                    "INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid  "+//INNER JOIN
                                    "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id "+//INNER JOIN
                                    "WHERE time_tasks_week.task_status_id = 3 AND "+//WHERE
                                    "departments.departmentid IN ("+stringDept+") AND "+//WHERE
                                    "(time_tasks_week.week_no BETWEEN "+week2+" AND "+weeks+" ) AND "+//WHERE
                                    "YEAR(time_tasks_week.start_date)=:years AND "+
                                    "hr_employee.Employee_ID IN ("+stringEMP+")";//WHERE
                            db.sequelize.query(sql_get_data3,null,{
                                raw:true
                            },{
                                years:years
                            })
                                .success(function(data3){
                                    
                                    if(data3!==undefined&&data3!==null&&data3!==""&&data3.length!==0){
                                        if(data!==undefined&&data!==null&&data!==""&&data.length!==0){
                                            data.forEach(function(value,index){
                                                data[index].time_in_lieu_gan_nhat      = 0;
                                                data[index].time_in_lieu_gan_nhat_Dept = 0;
                                                data[index].time_in_lieu_gan_nhat_all  = 0;
                                                if(value!==null&&value!==undefined){
                                                    data3.forEach(function(valueTime,indexTime){
                                                        if(valueTime!==null&&valueTime!==undefined&&valueTime.departmentid===value.Department_id){
                                                            data[index].time_in_lieu_gan_nhat = data[index].time_in_lieu_gan_nhat + valueTime.time_in_lieu;
                                                        }
                                                    })
                                                }
                                            });
                                            if(data_Dept!==undefined&&data_Dept!==null&&data_Dept!==""&&data_Dept.length!==0){
                                                data_Dept.forEach(function(value,index){
                                                    data_Dept[index].time_in_lieu_gan_nhat_Dept = 0;
                                                    if(value!==null&&value!==undefined){
                                                        data.forEach(function(valueTime,indexTime){
                                                            if(valueTime!==null&&valueTime!==undefined&&valueTime.Department_id===value.Department_id){
                                                                data_Dept[index].time_in_lieu_gan_nhat_Dept = data_Dept[index].time_in_lieu_gan_nhat_Dept + valueTime.time_in_lieu_gan_nhat;
                                                            }
                                                        });
                                                    }
                                                });
                                                var time_in_lieu_gan_nhat_all = 0;
                                                data_Dept.forEach(function(value,index){
                                                    if(value!==null&&value!==undefined){
                                                        time_in_lieu_gan_nhat_all = time_in_lieu_gan_nhat_all + value.time_in_lieu_gan_nhat_Dept;
                                                    }
                                                });
                                                data.forEach(function(value,index){
                                                    if(value!==null&&value!==undefined){
                                                        data[index].time_in_lieu_gan_nhat_all = time_in_lieu_gan_nhat_all;
                                                        data_Dept.forEach(function(valueTime,indexTime){
                                                            if(valueTime!==null&&valueTime!==undefined&&valueTime.Department_id===value.Department_id){
                                                                data[index].time_in_lieu_gan_nhat_Dept = valueTime.time_in_lieu_gan_nhat_Dept;
                                                            }
                                                        })
                                                    }
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
                                    if(data!==null&&data!==undefined&&data!==""&&data.length!==0){
                                        data.forEach(function(value,index){
                                            if(value!==null&&value!==undefined){
                                                value.time_in_lieu_remain      = value.time_in_lieu_remain - value.time_in_lieu_gan_nhat;
                                                value.time_in_lieu_remain_Dept = value.time_in_lieu_remain_Dept - value.time_in_lieu_gan_nhat_Dept;
                                                value.time_in_lieu_remain_all  = value.time_in_lieu_remain_all - value.time_in_lieu_gan_nhat_all;
                                            }
                                        });
                                    }
                                    else{
                                        res.json({
                                            status:"null"
                                        });
                                        return;
                                    }
                                    
                                    for(var t = 0;t<data.length;t++){
                                        chainer.add(db.time_in_lieu_report.create({
                                            create_id                   : data[t].create_id,
                                            Employee_id                 : data[t].Employee_id,
                                            Department_id               : data[t].Department_id,
                                            time_in_lieu                : data[t].time_in_lieu,
                                            time_in_lieu_used           : data[t].time_in_lieu_used,
                                            time_in_lieu_remain         : data[t].time_in_lieu_remain,
                                            time_in_lieu_gan_nhat       : data[t].time_in_lieu_gan_nhat,
                                            time_in_lieu_Dept           : data[t].time_in_lieu_Dept,
                                            time_in_lieu_used_Dept      : data[t].time_in_lieu_used_Dept,
                                            time_in_lieu_remain_Dept    : data[t].time_in_lieu_remain_Dept,
                                            time_in_lieu_gan_nhat_Dept  : data[t].time_in_lieu_gan_nhat_Dept,
                                            time_in_lieu_all            : data[t].time_in_lieu_all,
                                            time_in_lieu_used_all       : data[t].time_in_lieu_used_all,
                                            time_in_lieu_remain_all     : data[t].time_in_lieu_remain_all,
                                            time_in_lieu_gan_nhat_all   : data[t].time_in_lieu_gan_nhat_all,
                                            user_id                     : data[t].user_id
                                        }));
                                    }
                                    chainer.runSerially()
                                        .success(function(data_success){
                                            res.json({
                                                status:"success"
                                            });
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
                            //
                            
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
                
            })
            .error(function(err){
                console.log("*****ERROR: "+err+" *****");
                res.json({
                    status:"error"
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
        var stringWeek  = "";
        var stringItem  = "";
        var stringline1 = "";
        var stringline2 = "";
        var flag1 = 0;
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var flag5 = 0;
        var flag6 = 0;
        var co1 = 0;
        var co2 = 0;
        var time_charge_1_all = 0;
        var time_charge_2_all = 0;
        var time_charge_3_all = 0;
        var time_charge_4_all = 0;
        var time_charge_5_all = 0;
        var time_charge_all = 0;
        for (var i = 0; i < info.listEMP.length; i++) {
            stringEMP += info.listEMP[i].id + ", ";
        }
        stringEMP += 0;
        for (var j = 0; j < info.listDept.length; j++) {
            stringDept += info.listDept[j].id + ", ";
        }
        stringDept += 0;

        //get year from
        info.weekFrom = new Date(info.weekFrom);
        info.weekFrom.setHours(0, 0, 0);
        var yearsFrom = info.weekFrom.getFullYear();
        
        //end get year from

        //get year to
        info.weekTo = new Date(info.weekTo);
        info.weekTo.setHours(0, 0, 0);
        var yearsTo = info.weekTo.getFullYear();
        
        //end get year to

        //get string weekno+year
            //if yearfrom = yearto
        if(yearsFrom==yearsTo){
            for(var a = info.weekNoFrom; a <= info.weekNoTo; a++){
                stringline2+="("+a+","+yearsFrom+"),";
            }
            stringline2 = stringline2.substring(0, stringline2.length - 1);
            //console.log(stringline1);
        }//end if
        //else
        else{

            if(info.weekFrom.getMonth()===11){  // if month=12 ->>> lay tuan 53 cua nam do vi neu k set truong hop nay khi tra ve weekno=1 
                stringline2+="(53,"+yearsFrom+"),";
            }
            else{
                for(var a = info.weekNoFrom; a < 54; a++){
                    stringline2+="("+a+","+yearsFrom+"),";
                }
            }

            if(info.weekTo.getMonth()===0){ // if month=1 ->> lay tuan dau tien cua nam do vi neu k set truong hop nay khi tra ve weekno=53
                stringline2+="(1,"+yearsTo+"),";
            }
            else{
                for(var b = info.weekNoTo+1; b > 0;b--){
                    stringline2+="("+b+","+yearsTo+"),";
                }
            }
            var hieu_cua_2_nam = yearsTo - yearsFrom;
            for(var c = 0; c < hieu_cua_2_nam-1; c++){
                var years = yearsFrom+1;
                for(var d = 1;d <54; d++){
                    stringline2+="("+d+","+years+"),";
                }
            }

            stringline2 = stringline2.substring(0, stringline2.length - 1);
            //console.log(stringline1);
        }//end else
        //end get string weekno+year

        var sql_get_data_time_activity_report = "SELECT user_id, "+//SELECT
        " task_week_id, "+//SELECT
        " Employee_id, "+//SELECT
        " Department_id, "+//SELECT
        " activity_id, "+//SELECT
        " SUM(time_charge) AS 'time_charge_by_activity_id', "+//SELECT
        " time_charge_week, "+//SELECT
        " weekno, "+//SELECT
        " from_date, "+//SELECT
        " to_date " +//SELECT
            "FROM time_activity_detail_table " +//FROM
            "WHERE Employee_id IN(" + stringEMP + ") AND Department_id in (" + stringDept + ") AND user_id= :user_id " +//WHERE
            "GROUP BY Department_id,activity_id,Employee_id ";//GROUP BY

        var sql_get_data_total = "SELECT Department_id,SUM(time_charge_1) AS 'time_charge_1_Dept', " +//SELECT
            "SUM(time_charge_2) AS 'time_charge_2_Dept',SUM(time_charge_3) AS 'time_charge_3_Dept', " +//SELECT
            "SUM(time_charge_4) AS 'time_charge_4_Dept',SUM(time_charge_5) AS 'time_charge_5_Dept', " +//SELECT
            "SUM(time_charge_week) AS 'time_charge_week_Dept' " + "from time_activity_report " +//SELECT
            "WHERE Department_id in (" + stringDept + ") AND Employee_id IN(" + stringEMP + ") AND user_id= :user_id " +//WHERE
            "GROUP BY Department_id";//GROUP BY

        var sql_get_total = "SELECT * FROM time_activity_report ";

        var sql_get_line_count = "SELECT COUNT(DISTINCT FirstName),Department_id,Employee_id,time_charge_week FROM time_activity_table GROUP BY FirstName ";

        //DELETE DATA IN TABLE
        var sql_delete_time_activity_table = "DELETE from time_activity_table WHERE user_id= :user_id ";
        var sql_delete_time_activity_detail_table = "DELETE from time_activity_detail_table WHERE user_id= :user_id ";
        var sql_delete_time_activity_report = "DELETE from time_activity_report WHERE user_id= :user_id ";
        db.sequelize.query(sql_delete_time_activity_report,null,{
            raw : true
        },{
            user_id  :info.USER_ID
        })
            .success(function(data_delete3) {

                db.sequelize.query(sql_delete_time_activity_detail_table,null,{
                    raw : true
                },{
                    user_id : info.USER_ID
                })
                    .success(function(data_delete1) {
                        db.sequelize.query(sql_delete_time_activity_table,null,{
                            raw : true
                        },{
                            user_id :info.USER_ID
                        })
                            .success(function(data_delete2) {
                                //END DELETE
                                var sql_get_data_time_activity_table = "SELECT users.id, "+//SELECT
                                                                       " hr_employee.FirstName, "+//SELECT
                                                                       " hr_employee.LastName, "+//SELECT
                                                                       " hr_employee.Employee_ID , "+//SELECT
                                                                       " departments.departmentid, "+//SELECT
                                                                       " departments.departmentName, "+//SELECT
                                                                       " time_tasks_week.time_charge, "+//SELECT
                                                                       " time_tasks_week.week_no, "+//SELECT
                                                                       " time_tasks_week.creation_date, "+//SELECT
                                                                       " time_tasks_week.last_update_date, "+//SELECT
                                                                       " time_tasks_week.task_week_id " + //SELECT
                                                                       " FROM hr_employee " + //FROM
                                                                       " INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                                                       " INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + //INNER JOIN
                                                                       " INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + //INNER JOIN
                                                                       " WHERE time_tasks_week.task_status_id = 3 "+//WHERE
                                                                            " AND departments.departmentid IN ( " + stringDept + " ) "+//WHERE
                                                                            " AND (time_tasks_week.week_no,YEAR(time_tasks_week.start_date)) IN (" + stringline2 + ")  "+//WHERE
                                                                            " AND hr_employee.Employee_ID IN ( " + stringEMP + " )";//WHERE
                                db.sequelize.query(sql_get_data_time_activity_table)
                                    .success(function(data_time_activity_table) {
                                        if(data_time_activity_table!==undefined&&data_time_activity_table!==null&&data_time_activity_table!==""&&data_time_activity_table.length!==0){
                                            for (var i = 0; i < data_time_activity_table.length; i++) {
                                                db.time_activity_table.create({
                                                        user_id: info.USER_ID,
                                                        task_week_id: data_time_activity_table[i].task_week_id,
                                                        Employee_id: data_time_activity_table[i].Employee_ID,
                                                        Department_id: data_time_activity_table[i].departmentid,
                                                        FirstName: data_time_activity_table[i].FirstName,
                                                        LastName: data_time_activity_table[i].LastName,
                                                        Department_name: data_time_activity_table[i].departmentName,
                                                        weekno: data_time_activity_table[i].week_no,
                                                        time_charge_week: data_time_activity_table[i].time_charge,
                                                        from_date: info.weekFrom,
                                                        to_date: info.weekTo,
                                                        Creation_by: info.USER_ID
                                                    })
                                                    .success(function(data_insert1) {
                                                        flag1++;
                                                        if (flag1 == data_time_activity_table.length) {
                                                            //GET DETAIL DATA
                                                            var sql_get_data_time_activity_detail_table = "SELECT time_activity_table.task_week_id,time_tasks.tasks_id," + //SELECT
                                                                                                          "time_activity_table.user_id,time_activity_table.Employee_id," + //SELECT
                                                                                                          "time_activity_table.Department_id,time_tasks.activity_id," + //SELECT
                                                                                                          "time_tasks.time_charge,time_activity_table.time_charge_week," + //SELECT
                                                                                                          "time_activity_table.weekno,time_activity_table.from_date,time_activity_table.to_date " + //SELECT
                                                                                                          "FROM time_tasks " + //FROM
                                                                                                          "INNER JOIN time_activity_table ON time_activity_table.task_week_id = time_tasks.tasks_week_id " + //INNER JOIN
                                                                                                          "WHERE time_activity_table.user_id= :user_id " + //WHERE
                                                                                                          "ORDER BY time_activity_table.Department_id,time_activity_table.Employee_id,time_tasks.activity_id,time_activity_table.weekno";//ORDER BY

                                                            var sql_get_time_charge_week = "SELECT SUM(time_charge) AS 'time_charge_week',Department_id,Employee_id " + //SELECT
                                                                                           " FROM time_activity_detail_table " + //FROM
                                                                                           " WHERE user_id= :user_id AND Employee_id IN (" + stringEMP + ") " + " GROUP BY Department_id,Employee_id";//WHERE , GROUP BY
                                                            db.sequelize.query(sql_get_data_time_activity_detail_table,null,{
                                                                raw : true
                                                            },{
                                                                user_id : info.USER_ID
                                                            })
                                                                .success(function(data_time_activity_detail_table) {
                                                                    if(data_time_activity_detail_table!==undefined&&data_time_activity_detail_table!==null&&data_time_activity_detail_table!==""&&data_time_activity_detail_table.length!==0){
                                                                        db.sequelize.query(sql_get_time_charge_week,null,{
                                                                            raw :true
                                                                        },{
                                                                            user_id : info.USER_ID
                                                                        })
                                                                            .success(function(data_get_time_charge_week) {

                                                                                
                                                                                    for (var j = 0; j < data_time_activity_detail_table.length; j++) {
                                                                                        //INSERT time_activity_detail_table
                                                                                        db.time_activity_detail_table.create({
                                                                                                task_week_id: data_time_activity_detail_table[j].task_week_id,
                                                                                                tasks_id: data_time_activity_detail_table[j].tasks_id,
                                                                                                user_id: data_time_activity_detail_table[j].user_id,
                                                                                                Employee_id: data_time_activity_detail_table[j].Employee_id,
                                                                                                Department_id: data_time_activity_detail_table[j].Department_id,
                                                                                                activity_id: data_time_activity_detail_table[j].activity_id,
                                                                                                time_charge: data_time_activity_detail_table[j].time_charge,
                                                                                                //time_charge_week: data_time_activity_detail_table[j].time_charge_week,
                                                                                                weekno: data_time_activity_detail_table[j].weekno,
                                                                                                from_date: data_time_activity_detail_table[j].from_date,
                                                                                                to_date: data_time_activity_detail_table[j].to_date,
                                                                                                Creation_by: info.USER_ID
                                                                                            })
                                                                                            .success(function(data_insert2) {
                                                                                                flag2++;
                                                                                                if (flag2 == data_time_activity_detail_table.length) {



                                                                                                    var sql_get_time_charge_new = "SELECT user_id,SUM(time_charge) AS 'time_charge',Department_id,Employee_id,activity_id " + //SELECT
                                                                                                                                  " FROM time_activity_detail_table " + //FROM
                                                                                                                                  " WHERE Department_id IN(" + stringDept + ") "+//WHERE
                                                                                                                                  " AND Employee_id IN(" + stringEMP + ") "+//WHERE
                                                                                                                                  " AND activity_id IN (1,2,3,4,5) " + //WHERE
                                                                                                                                  " AND user_id= :user_id " + //WHERE
                                                                                                                                  " GROUP BY Department_id,Employee_id,activity_id " + //GROUP BY
                                                                                                                                  " ORDER BY Department_id,Employee_id,activity_id "; //ORDER BY
                                                                                                    db.sequelize.query(sql_get_time_charge_new,null,{
                                                                                                        raw : true
                                                                                                    },{
                                                                                                        user_id : info.USER_ID
                                                                                                    })
                                                                                                        .success(function(data_time_charge_new) {
                                                                                                            
                                                                                                                var sql_get_length_line = "SELECT Department_id, "+//SELECT
                                                                                                                                          " Employee_id,user_id, "+//SELECT
                                                                                                                                          " SUM(time_charge) AS 'time_charge_week',from_date,to_date " + //SELECT
                                                                                                                                          " FROM time_activity_detail_table " + //FROM
                                                                                                                                          " WHERE user_id = :user_id " + //WHERE
                                                                                                                                          " GROUP BY Employee_id " + //GROUP BY
                                                                                                                                          " ORDER BY Department_id,Employee_id"; //ORDER BY
                                                                                                                db.sequelize.query(sql_get_length_line,null,{
                                                                                                                    raw : true
                                                                                                                },{
                                                                                                                    user_id : info.USER_ID
                                                                                                                })
                                                                                                                    .success(function(data_length_line) {
                                                                                                                        
                                                                                                                            for (var x = 0; x < data_length_line.length; x++) {
                                                                                                                                stringline1 += "(";
                                                                                                                                for (var y = 0; y < data_time_charge_new.length; y++) {

                                                                                                                                    if (data_length_line[x].Department_id == data_time_charge_new[y].Department_id && data_length_line[x].Employee_id == data_time_charge_new[y].Employee_id) {
                                                                                                                                        stringline1 += data_time_charge_new[y].time_charge + "," + ((data_time_charge_new[y].time_charge / data_length_line[x].time_charge_week) * 100).toFixed(2) + ",";
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                if (stringline1 !== "(") {
                                                                                                                                    stringline1 += data_length_line[x].Department_id + "," +
                                                                                                                                        data_length_line[x].Employee_id + "," +
                                                                                                                                        data_length_line[x].user_id + "," +
                                                                                                                                        data_length_line[x].time_charge_week + ",'" +
                                                                                                                                        moment(data_length_line[x].from_date).format("YYYY-MM-DD") + "','" +
                                                                                                                                        moment(data_length_line[x].to_date).format("YYYY-MM-DD") + "'),";

                                                                                                                                }

                                                                                                                            }
                                                                                                                            stringline1 = stringline1.substring(0, stringline1.length - 1);
                                                                                                                            console.log(stringline1);
                                                                                                                            var sql_insert_time_activity_report = "INSERT INTO "+//INSERT
                                                                                                                                                                  " time_activity_report "+//INSERT
                                                                                                                                                                  " (time_charge_1,per_1, "+//INSERT
                                                                                                                                                                  " time_charge_2,per_2, "+//INSERT
                                                                                                                                                                  " time_charge_3,per_3, "+//INSERT
                                                                                                                                                                  " time_charge_4,per_4, "+//INSERT
                                                                                                                                                                  " time_charge_5,per_5, "+//INSERT
                                                                                                                                                                  " Department_id,Employee_id,user_id, "+//INSERT
                                                                                                                                                                  " time_charge_week, "+//INSERT
                                                                                                                                                                  " from_date,to_date) VALUE " + stringline1;//VALUE
                                                                                                                            db.sequelize.query(sql_insert_time_activity_report)
                                                                                                                                .success(function(data_insert_success) {
                                                                                                                                   

                                                                                                                                    var sql_get_time_charge_Dept_all = "SELECT SUM(time_charge_1) AS'time_charge_1_Dept', "+//SELECT
                                                                                                                                                                       " SUM(time_charge_2) AS'time_charge_2_Dept', "+//SELECT
                                                                                                                                                                       " SUM(time_charge_3) AS'time_charge_3_Dept'," +//SELECT
                                                                                                                                                                       " SUM(time_charge_4) AS'time_charge_4_Dept', "+//SELECT
                                                                                                                                                                       " SUM(time_charge_5) AS'time_charge_5_Dept'," +//SELECT
                                                                                                                                                                       " SUM(time_charge_week) AS'time_charge_week_Dept', "+//SELECT
                                                                                                                                                                       " Department_id " +//SELECT
                                                                                                                                                                       " FROM time_activity_report " +//FROM
                                                                                                                                                                       " WHERE Department_id IN(" + stringDept + ") AND user_id= :user_id " +//WHERE
                                                                                                                                                                       " GROUP BY Department_id";//GROUP BY
                                                                                                                                    var sql_get_time_charge_all = "SELECT t.user_id, "+ 
                                                                                                                                                                           " SUM(t.time_charge_1_Dept) AS 'time_charge_1_all',"+
                                                                                                                                                                           " SUM(t.time_charge_2_Dept) AS 'time_charge_2_all', "+
                                                                                                                                                                           " SUM(t.time_charge_3_Dept) AS 'time_charge_3_all', "+
                                                                                                                                                                           " SUM(t.time_charge_4_Dept) AS 'time_charge_4_all', "+
                                                                                                                                                                           " SUM(t.time_charge_5_Dept) AS 'time_charge_5_all', "+
                                                                                                                                                                           " SUM(t.time_charge_week_Dept) AS 'time_charge_all' "+                                                                               
                                                                                                                                                                           "    FROM(SELECT * FROM time_activity_report "+
                                                                                                                                                                           "    WHERE user_id=:user_id "+
                                                                                                                                                                           "    GROUP BY Department_id)t";
                                                                                                                                                                        
                                                                                                                                    db.sequelize.query(sql_get_time_charge_Dept_all,null,{
                                                                                                                                        raw : true
                                                                                                                                    },{
                                                                                                                                        user_id : info.USER_ID
                                                                                                                                    })
                                                                                                                                        .success(function(data_time_charge_Dept_all) {
                                                                                                                                            
                                                                                                                                                var sql_count_line = "SELECT COUNT(*) AS count FROM time_activity_report WHERE user_id= :user_id ";
                                                                                                                                                db.sequelize.query(sql_count_line,null,{
                                                                                                                                                    raw : true
                                                                                                                                                },{
                                                                                                                                                    user_id :info.USER_ID
                                                                                                                                                })
                                                                                                                                                .success(function(data_count) {
                                                                                                                                                    if(data_count!==undefined&&data_count!==null&&data_count!==""&&data_count.length!==0){
                                                                                                                                                        for (var m = 0; m < data_count[0].count; m++) {
                                                                                                                                                            for (var v = 0; v < data_time_charge_Dept_all.length; v++) {
                                                                                                                                                                chainer.add(db.time_activity_report.update({
                                                                                                                                                                    time_charge_1_Dept: data_time_charge_Dept_all[v].time_charge_1_Dept,
                                                                                                                                                                    per_1_Dept: ((data_time_charge_Dept_all[v].time_charge_1_Dept / data_time_charge_Dept_all[v].time_charge_week_Dept) * 100).toFixed(2),
                                                                                                                                                                    time_charge_2_Dept: data_time_charge_Dept_all[v].time_charge_2_Dept,
                                                                                                                                                                    per_2_Dept: ((data_time_charge_Dept_all[v].time_charge_2_Dept / data_time_charge_Dept_all[v].time_charge_week_Dept) * 100).toFixed(2),
                                                                                                                                                                    time_charge_3_Dept: data_time_charge_Dept_all[v].time_charge_3_Dept,
                                                                                                                                                                    per_3_Dept: ((data_time_charge_Dept_all[v].time_charge_3_Dept / data_time_charge_Dept_all[v].time_charge_week_Dept) * 100).toFixed(2),
                                                                                                                                                                    time_charge_4_Dept: data_time_charge_Dept_all[v].time_charge_4_Dept,
                                                                                                                                                                    per_4_Dept: ((data_time_charge_Dept_all[v].time_charge_4_Dept / data_time_charge_Dept_all[v].time_charge_week_Dept) * 100).toFixed(2),
                                                                                                                                                                    time_charge_5_Dept: data_time_charge_Dept_all[v].time_charge_5_Dept,
                                                                                                                                                                    per_5_Dept: ((data_time_charge_Dept_all[v].time_charge_5_Dept / data_time_charge_Dept_all[v].time_charge_week_Dept) * 100).toFixed(2),
                                                                                                                                                                    time_charge_week_Dept: data_time_charge_Dept_all[v].time_charge_week_Dept
                                                                                                                                                                }, {
                                                                                                                                                                    Department_id: data_time_charge_Dept_all[v].Department_id
                                                                                                                                                                }));
                                                                                                                                                            }

                                                                                                                                                        }
                                                                                                                                                        chainer.runSerially()
                                                                                                                                                            .success(function(update_success1) {

                                                                                                                                                                db.sequelize.query(sql_get_time_charge_all,null,{
                                                                                                                                                                    raw :true
                                                                                                                                                                },{
                                                                                                                                                                    user_id : info.USER_ID
                                                                                                                                                                })
                                                                                                                                                                    .success(function(data_time_charge_all) {
                                                                                                                                                                        
                                                                                                                                                                        for (var f = 0; f < data_count[0].count; f++) {
                                                                                                                                                                            chainer.add(db.time_activity_report.update({
                                                                                                                                                                                time_charge_1_all: data_time_charge_all[0].time_charge_1_all,
                                                                                                                                                                                per_1_all: ((data_time_charge_all[0].time_charge_1_all / data_time_charge_all[0].time_charge_all) * 100).toFixed(2),
                                                                                                                                                                                time_charge_2_all: data_time_charge_all[0].time_charge_2_all,
                                                                                                                                                                                per_2_all: ((data_time_charge_all[0].time_charge_2_all / data_time_charge_all[0].time_charge_all) * 100).toFixed(2),
                                                                                                                                                                                time_charge_3_all: data_time_charge_all[0].time_charge_3_all,
                                                                                                                                                                                per_3_all: ((data_time_charge_all[0].time_charge_3_all / data_time_charge_all[0].time_charge_all) * 100).toFixed(2),
                                                                                                                                                                                time_charge_4_all: data_time_charge_all[0].time_charge_4_all,
                                                                                                                                                                                per_4_all: ((data_time_charge_all[0].time_charge_4_all / data_time_charge_all[0].time_charge_all) * 100).toFixed(2),
                                                                                                                                                                                time_charge_5_all: data_time_charge_all[0].time_charge_5_all,
                                                                                                                                                                                per_5_all: ((data_time_charge_all[0].time_charge_5_all / data_time_charge_all[0].time_charge_all) * 100).toFixed(2),
                                                                                                                                                                                time_charge_all: data_time_charge_all[0].time_charge_all
                                                                                                                                                                            }, {
                                                                                                                                                                                user_id: data_time_charge_all[0].user_id
                                                                                                                                                                            }))
                                                                                                                                                                        }
                                                                                                                                                                        chainer.runSerially()
                                                                                                                                                                            .success(function(update_success2) {
                                                                                                                                                                                res.json({
                                                                                                                                                                                    status: "success"
                                                                                                                                                                                });
                                                                                                                                                                                return;
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
                                                                                                                                                                        console.log("*****ERROR: " + err + " *****");
                                                                                                                                                                        res.json({
                                                                                                                                                                            status: "error"
                                                                                                                                                                        });
                                                                                                                                                                        return;
                                                                                                                                                                    });
                                                                                                                                                            })
                                                                                                                                                            .error(function(err) {
                                                                                                                                                                console.log("*****ERROR: " + err + " *****");
                                                                                                                                                                res.json({
                                                                                                                                                                    status: "error"
                                                                                                                                                                });
                                                                                                                                                                return;
                                                                                                                                                            });
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
                                                                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                                                                            res.json({
                                                                                                                                                status: "error"
                                                                                                                                            });
                                                                                                                                            return;
                                                                                                                                        });
                                                                                                                                    
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
                                                                                                                        console.log("*****ERROR: " + err + " *****");
                                                                                                                        res.json({
                                                                                                                            status: "error"
                                                                                                                        });
                                                                                                                        return;
                                                                                                                    });
                                                                                                           
                                                                                                        })
                                                                                                        .error(function(err) {
                                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                                            res.json({
                                                                                                                status: "error"
                                                                                                            });
                                                                                                            return;
                                                                                                        });
                                                                                                }
                                                                                            })

                                                                                        .error(function(err) {
                                                                                            console.log("*****ERROR: " + err + " *****");
                                                                                            res.json({
                                                                                                status: "error"
                                                                                            });
                                                                                            return;
                                                                                        });
                                                                                    }
                                                                                
                                                                                
                                                                            })
                                                                            .error(function(err) {
                                                                                console.log("*****ERROR: " + err + " *****");
                                                                                res.json({
                                                                                    status: "error"
                                                                                });
                                                                                return;
                                                                            });
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
                                                            //END GET
                                                        }
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR: " + err + " *****");
                                                        res.json({
                                                            status: "error"
                                                        });
                                                        return;
                                                    });
                                            }
                                        }
                                        else {
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
                                console.log("*****ERROR: " + err + " *****");
                                res.json({
                                    status: "error"
                                });
                                return;
                            });
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
        var stringline2 = "";
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
        var flag2 = 0;
        var flag3 = 0;
        var flag4 = 0;
        var flag5 = 0;
        var flag6 = 0;
        var flag7 = 0;
        var flag8 = 0;
        var flag9 = 0;
        var sum   = 0;

         //get year from
        info.weekFrom = new Date(info.weekFrom);
        info.weekFrom.setHours(0, 0, 0);
        var yearsFrom = info.weekFrom.getFullYear();
        
        //end get year from

        //get year to
        info.weekTo = new Date(info.weekTo);
        info.weekTo.setHours(0, 0, 0);
        var yearsTo = info.weekTo.getFullYear();
        
        //end get year to

        //get string weekno+year
            //if yearfrom = yearto
        if(yearsFrom==yearsTo){
            for(var a = info.weekNoFrom; a <= info.weekNoTo; a++){
                stringline2+="("+a+","+yearsFrom+"),";
            }
            stringline2 = stringline2.substring(0, stringline2.length - 1);
            //console.log(stringline1);
        }//end if
        //else
        else{

            if(info.weekFrom.getMonth()===11){  // if month=12 ->>> lay tuan 53 cua nam do vi neu k set truong hop nay khi tra ve weekno=1 
                stringline2+="(53,"+yearsFrom+"),";
            }
            else{
                for(var a = info.weekNoFrom; a < 54; a++){
                    stringline2+="("+a+","+yearsFrom+"),";
                }
            }

            if(info.weekTo.getMonth()===0){ // if month=1 ->> lay tuan dau tien cua nam do vi neu k set truong hop nay khi tra ve weekno=53
                stringline2+="(1,"+yearsTo+"),";
            }
            else{
                for(var b = info.weekNoTo+1; b > 0;b--){
                    stringline2+="("+b+","+yearsTo+"),";
                }
            }
            var hieu_cua_2_nam = yearsTo - yearsFrom;
            for(var c = 0; c < hieu_cua_2_nam-1; c++){
                var years = yearsFrom+1;
                for(var d = 1;d <54; d++){
                    stringline2+="("+d+","+years+"),";
                }
            }

            stringline2 = stringline2.substring(0, stringline2.length - 1);
            //console.log(stringline1);
        }//end else
        //end get string weekno+year

        //DELETE ALL TABLE
        var sql_delete_time_activity_summary_table = " DELETE FROM time_activity_summary_table WHERE user_id= :user_id ";
        var sql_delete_time_activity_summary_detail_table = " DELETE FROM time_activity_summary_detail_table WHERE user_id= :user_id ";
        var sql_delete_time_activity_summary_report = " DELETE FROM time_activity_summary_report WHERE user_id= :user_id ";
        //DELETE TABLE time_activity_summary_table
        db.sequelize.query(sql_delete_time_activity_summary_table,null,{
           raw : true 
        },{
            user_id : info.USER_ID
        })
            .success(function(data_delete1) {
                //DELETE TABLE time_activity_summary_detail_table
                db.sequelize.query(sql_delete_time_activity_summary_detail_table,null,{
                    raw : true
                },{
                    user_id : info.USER_ID
                })
                    .success(function(data_delete2) {
                        //DELETE TABLE time_activity_summary_report
                        db.sequelize.query(sql_delete_time_activity_summary_report,null,{
                            raw : true
                        },{
                            user_id : info.USER_ID
                        })
                            .success(function(data_delete3) {
                                var sql_get_data_time_activity_summary_table = "SELECT users.id, "+//SELECT
                                                                               " hr_employee.FirstName, "+//SELECT
                                                                               " hr_employee.LastName, "+//SELECT
                                                                               " hr_employee.Employee_ID ,"+//SELECT
                                                                               " departments.departmentid, "+//SELECT
                                                                               " departments.departmentName, "+//SELECT
                                                                               " time_tasks_week.time_charge,"+//SELECT
                                                                               " time_tasks_week.week_no, "+//SELECT
                                                                               " time_tasks_week.creation_date, "+//SELECT
                                                                               " time_tasks_week.last_update_date, "+//SELECT
                                                                               " time_tasks_week.task_week_id " + //SELECT
                                                                               " FROM hr_employee " + //FROM
                                                                               " INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                                                                               " INNER JOIN departments ON hr_employee.Dept_ID = departments.departmentid " + //INNER JOIN
                                                                               " INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " +//INNER JOIN 
                                                                               " WHERE time_tasks_week.task_status_id = 3 "+//WHERE
                                                                               " AND departments.departmentid IN ( " + stringDept + " ) "+//WHERE
                                                                               " AND (time_tasks_week.week_no,YEAR(time_tasks_week.start_date)) IN ("+stringline2+") "+//WHERE
                                                                               " AND hr_employee.Employee_ID IN ( " + stringEMP + " ) ";//WHERE
                                //GET DATA TABLE time_activity_summary_table
                                db.sequelize.query(sql_get_data_time_activity_summary_table)
                                    .success(function(data_time_activity_summary_table) {
                                        
                                        //INSERT DATA INTO time_activity_summary_table
                                        if(data_time_activity_summary_table!==undefined&&data_time_activity_summary_table!==null&&data_time_activity_summary_table!==""&&data_time_activity_summary_table.length!==0){
                                            for (var i = 0; i < data_time_activity_summary_table.length; i++) {
                                                db.time_activity_summary_table.create({
                                                        user_id: info.USER_ID,
                                                        task_week_id: data_time_activity_summary_table[i].task_week_id,
                                                        Employee_id: data_time_activity_summary_table[i].Employee_ID,
                                                        Department_id: data_time_activity_summary_table[i].departmentid,
                                                        FirstName: data_time_activity_summary_table[i].FirstName,
                                                        LastName: data_time_activity_summary_table[i].LastName,
                                                        Department_name: data_time_activity_summary_table[i].departmentName,
                                                        weekno: data_time_activity_summary_table[i].week_no,
                                                        time_charge_week: data_time_activity_summary_table[i].time_charge,
                                                        from_date: info.weekFrom,
                                                        to_date: info.weekTo,
                                                        Creation_by: info.USER_ID
                                                    })
                                                    .success(function(data_insert1) {
                                                        flag1++;
                                                        if (flag1 == data_time_activity_summary_table.length) {
                                                            //console.log("NEXT")
                                                            //GET DATA TABLE time_activity_summary_detail_table
                                                            var sql_get_data_time_activity_summary_detail_table = "SELECT " + //SELECT
                                                                "time_activity_summary_table.from_date, " + //SELECT
                                                                "time_activity_summary_table.to_date, " + //SELECT
                                                                "time_activity_summary_table.weekno, " + //SELECT
                                                                "time_tasks.tasks_id, " + "time_activity_summary_table.task_week_id, " + //SELECT
                                                                "time_activity_summary_table.user_id, " + //SELECT
                                                                "time_tasks.activity_id, " + //SELECT
                                                                "time_activity_summary_table.Department_id, " + //SELECT
                                                                "time_activity_summary_table.Employee_id, " + //SELECT
                                                                "time_tasks.time_charge, " + //SELECT
                                                                "time_activity_summary_table.time_charge_week " + //SELECT
                                                                "FROM time_tasks " + //FROM
                                                                "INNER JOIN time_activity_summary_table ON time_tasks.tasks_week_id = time_activity_summary_table.task_week_id " + //INNER JOIN
                                                                "WHERE time_activity_summary_table.Employee_id IN (" + stringEMP + ") "+ //WHERE
                                                                "AND time_activity_summary_table.Department_id IN (" + stringDept + ") "+ //WHERE
                                                                "AND time_activity_summary_table.user_id= :user_id "; //WHERE
                                                            db.sequelize.query(sql_get_data_time_activity_summary_detail_table,null,{
                                                                raw : true
                                                            },{
                                                                user_id : info.USER_ID
                                                            })
                                                                .success(function(data_time_activity_summary_detail_table) {
                                                                    if(data_time_activity_summary_detail_table!==undefined&&data_time_activity_summary_detail_table!==null&&data_time_activity_summary_detail_table!==""&&data_time_activity_summary_detail_table.length!==0){
                                                                    //INSERT DATA INTO time_activity_summary_detail_table
                                                                        for (var j = 0; j < data_time_activity_summary_detail_table.length; j++) {
                                                                            chainer.add(db.time_activity_summary_detail_table.create({
                                                                                task_week_id: data_time_activity_summary_detail_table[j].task_week_id,
                                                                                tasks_id: data_time_activity_summary_detail_table[j].tasks_id,
                                                                                user_id: data_time_activity_summary_detail_table[j].user_id,
                                                                                Employee_id: data_time_activity_summary_detail_table[j].Employee_id,
                                                                                Department_id: data_time_activity_summary_detail_table[j].Department_id,
                                                                                activity_id: data_time_activity_summary_detail_table[j].activity_id,
                                                                                time_charge: data_time_activity_summary_detail_table[j].time_charge,
                                                                                time_charge_week: data_time_activity_summary_detail_table[j].time_charge_week,
                                                                                weekno: data_time_activity_summary_detail_table[j].weekno,
                                                                                from_date: data_time_activity_summary_detail_table[j].from_date,
                                                                                to_date: data_time_activity_summary_detail_table[j].to_date,
                                                                                Creation_by: info.USER_ID
                                                                            }))

                                                                        }
                                                                        chainer.runSerially()
                                                                            .success(function(data_insert1) {
                                                                                var sql_line = "SELECT DISTINCT Department_id,from_date,to_date  " + //SELECT
                                                                                    "FROM time_activity_summary_detail_table " + //FROM
                                                                                    "WHERE user_id= :user_id "; //WHERE
                                                                                db.sequelize.query(sql_line,null,{
                                                                                    raw : true
                                                                                },{
                                                                                    user_id : info.USER_ID
                                                                                })
                                                                                    .success(function(data_insert1) {
                                                                                        if(data_insert1!==undefined&&data_insert1!==null&&data_insert1!==""&&data_insert1.length!==0){

                                                                                            for (var t = 0; t < data_insert1.length; t++) {
                                                                                                for (var u = 0; u < 5; u++) {
                                                                                                    chainer.add(db.time_activity_summary_report.create({
                                                                                                        user_id: info.USER_ID,
                                                                                                        Department_id: data_insert1[t].Department_id,
                                                                                                        activity_id: u + 1,
                                                                                                        from_date: data_insert1[t].from_date,
                                                                                                        to_date: data_insert1[t].to_date
                                                                                                    }));
                                                                                                }
                                                                                            }
                                                                                            chainer.runSerially()
                                                                                                .success(function(data_insert2) {
                                                                                                    var sql_update1 = "SELECT user_id,Department_id,activity_id,SUM(time_charge) AS'time_charge_Dept' "+ //SELECT
                                                                                                                        "FROM time_activity_summary_detail_table "+ //FROM
                                                                                                                        "WHERE user_id= :user_id "+ //WHERE
                                                                                                                        "GROUP BY Department_id,activity_id "+//GROUP BY
                                                                                                                        "ORDER BY Department_id,activity_id"; 
                                                                                                    db.sequelize.query(sql_update1,null,{
                                                                                                        raw : true
                                                                                                    },{
                                                                                                        user_id : info.USER_ID
                                                                                                    })
                                                                                                        .success(function(data_update1) {
                                                                                                            if(data_update1!==undefined&&data_update1!==null&&data_update1!==""&&data_update1.length!==0){
                                                                                                                for (var y = 0; y < 5 * data_insert1.length; y++) {
                                                                                                                    for (var x = 0; x < data_update1.length; x++) {
                                                                                                                        chainer.add(db.time_activity_summary_report.update({
                                                                                                                            time_charge_Dept: data_update1[x].time_charge_Dept,

                                                                                                                        }, {
                                                                                                                            user_id: data_update1[x].user_id,

                                                                                                                            Department_id: data_update1[x].Department_id,
                                                                                                                            activity_id: data_update1[x].activity_id
                                                                                                                        }));
                                                                                                                    }
                                                                                                                }
                                                                                                                chainer.runSerially()
                                                                                                                    .success(function(data_insert3) {
                                                                                                                        var sql_update2 = "SELECT SUM(time_charge_Dept) AS 'time_charge_Dept_all',Department_id,user_id " + //SELECT
                                                                                                                            "FROM time_activity_summary_report " + //FROM
                                                                                                                            "WHERE Department_id IN(" + stringDept + ") "+ //WHERE
                                                                                                                            "AND user_id= :user_id " + //WHERE
                                                                                                                            "GROUP BY Department_id "+//GROUP BY
                                                                                                                            "ORDER BY Department_id,activity_id"; 
                                                                                                                        db.sequelize.query(sql_update2,null,{
                                                                                                                            raw : true
                                                                                                                        },{
                                                                                                                            user_id : info.USER_ID
                                                                                                                        })
                                                                                                                            .success(function(data_update2) {
                                                                                                                                if(data_update2!==undefined&&data_update2!==null&&data_update2!==""&&data_update2.length!==0){
                                                                                                                                    for (var m = 0; m < 5 * data_insert1.length; m++) {
                                                                                                                                        for (var n = 0; n < data_update2.length; n++) {
                                                                                                                                            chainer.add(db.time_activity_summary_report.update({
                                                                                                                                                time_charge_Dept_all: data_update2[n].time_charge_Dept_all
                                                                                                                                            }, {
                                                                                                                                                Department_id: data_update2[n].Department_id,
                                                                                                                                                user_id: data_update2[n].user_id
                                                                                                                                            }))
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    chainer.runSerially()
                                                                                                                                        .success(function(data_insert4) {
                                                                                                                                            

                                                                                                                                            var sql_update3 = "SELECT SUM(t.time_charge_Dept_all) AS 'time_charge_all',t.user_id " + //SELECT
                                                                                                                                                "FROM " + //FROM
                                                                                                                                                "(SELECT * " +//FROM
                                                                                                                                                "FROM time_activity_summary_report " + //FROM
                                                                                                                                                "WHERE user_id= :user_id " + //FROM
                                                                                                                                                "GROUP BY Department_id " +//FROM
                                                                                                                                                ") t "+
                                                                                                                                                "ORDER BY Department_id,activity_id"; //FROM
                                                                                                                                            db.sequelize.query(sql_update3,null,{
                                                                                                                                                raw : true
                                                                                                                                            },{
                                                                                                                                                user_id :info.USER_ID
                                                                                                                                            })
                                                                                                                                                .success(function(data_update4) {
                                                                                                                                                    if(data_update4!==undefined&&data_update4!==null&&data_update4!==""&&data_update4.length!==0){
                                                                                                                                                        for (var h = 0; h < 5 * data_insert1.length; h++) {
                                                                                                                                                            chainer.add(db.time_activity_summary_report.update({
                                                                                                                                                                time_charge_all: data_update4[0].time_charge_all
                                                                                                                                                            }, {
                                                                                                                                                                user_id: data_update4[0].user_id
                                                                                                                                                            }))
                                                                                                                                                        }
                                                                                                                                                        chainer.runSerially()
                                                                                                                                                            .success(function(data_success) {
                                                                                                                                                                var sql_get_data = "SELECT * " + //SELECT
                                                                                                                                                                    "FROM time_activity_summary_report " + //FROM
                                                                                                                                                                    "WHERE user_id= :user_id " + //WHERE
                                                                                                                                                                    "GROUP BY Department_id,activity_id "+
                                                                                                                                                                    "ORDER BY Department_id,activity_id"; //GROUP BY
                                                                                                                                                                db.sequelize.query(sql_get_data,null,{
                                                                                                                                                                    raw : true
                                                                                                                                                                },{
                                                                                                                                                                    user_id : info.USER_ID
                                                                                                                                                                })
                                                                                                                                                                    .success(function(data) {
                                                                                                                                                                        if(data!==undefined&&data!==null&&data!==""&&data.length!==0){
                                                                                                                                                                            
                                                                                                                                                                            for (var k = 0; k < data.length; k++) {
                                                                                                                                                                                chainer.add(db.time_activity_summary_report.update({
                                                                                                                                                                                    time_charge_Dept_per: ((data[k].time_charge_Dept / data[k].time_charge_Dept_all) * 100).toFixed(2)
                                                                                                                                                                                }, {
                                                                                                                                                                                    user_id: data[k].user_id,
                                                                                                                                                                                    Department_id: data[k].Department_id,
                                                                                                                                                                                    activity_id: data[k].activity_id
                                                                                                                                                                                }))
                                                                                                                                                                            }
                                                                                                                                                                            chainer.runSerially()
                                                                                                                                                                                .success(function(data_success_final) {
                                                                                                                                                                                    res.json({
                                                                                                                                                                                        status: "success"
                                                                                                                                                                                    });
                                                                                                                                                                                })
                                                                                                                                                                                .error(function(err) {
                                                                                                                                                                                    console.log("*****ERROR: " + err + " *****");
                                                                                                                                                                                });
                                                                                                                                                                            return;
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
                                                                                                            }
                                                                                                            else{
                                                                                                                res.json({
                                                                                                                    status:"null"
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
                                                                                                        })
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
                                                    })
                                                    .error(function(err) {
                                                        console.log("*****ERROR: " + err + " *****");
                                                        res.json({
                                                            status: "error"
                                                        });
                                                        return;
                                                    })
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
                                    })
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
            })
            .error(function(err) {
                console.log("*****ERROR: " + err + "*****");
                res.json({
                    status: "error"
                });
                return;
            })
    },

    LoadReportItemNumber: function(req, res) {
        var weekNoFrom = req.body.info.weekNoFrom;
        var weekNoTo = req.body.info.weekNoTo - 1;
        var arrayEMP = req.body.info.listEMP;
        var weekFrom = req.body.info.weekFrom;
        var weekTo = req.body.info.weekTo;
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
                "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName, time_item_task.item_id, " + //SELECT
                "hr_employee.Employee_ID, hr_employee.Dept_ID, " + //SELECT
                "time_item_task.time_charge " + //SELECT
                "FROM hr_employee " + //FROM
                "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //INNER JOIN
                "INNER JOIN time_tasks_week ON time_tasks_week.user_id = users.id " + //INNER JOIN
                "INNER JOIN time_tasks ON time_tasks.tasks_week_id = time_tasks_week.task_week_id " + //INNER JOIN
                "INNER JOIN time_item_task ON time_item_task.task_id = time_tasks.tasks_id " + //INNER JOIN
                "INNER JOIN time_item_code ON time_item_code.ITEM_ID = time_item_task.item_id AND time_item_code.IS_BILLABLE = 1 " + //INNER JOIN
                "WHERE hr_employee.Employee_ID IN " + listEMP + //WHERE
                " AND time_tasks_week.task_status_id = 3 AND " + //WHERE
                "time_tasks_week.week_no BETWEEN " + weekNoFrom + //WHERE
                " AND " + weekNoTo + " ORDER BY time_item_task.item_id ASC"; //ORDER BY
            db.sequelize.query(queryGetItemBuilable)
                .success(function(resultListItemBuilble) {
                    if(resultListItemBuilble!==undefined&&resultListItemBuilble!==null&&resultListItemBuilble!==""&&resultListItemBuilble.length!==0){


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
                                        count_item_all + "," + sum_time_charge_all + ",'" + moment(weekFrom).format("YYYY-MM-DD HH:mm:ss") + "','" + moment(weekTo).format("YYYY-MM-DD HH:mm:ss") + "','" +
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
                    console.log("*****ERROR:" + err + "*****");
                    res.json({
                        status: "error"
                    });
                });
        }
    },
};
