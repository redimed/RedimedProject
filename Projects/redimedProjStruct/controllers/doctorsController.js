/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */

var db = require('../models');
var util = require('util');
var common_function = require("../functions.js");


 var squel = require("squel");
 squel.useFlavour('mysql');

module.exports =
{
    changeCasual: function(req, res){
        var from_time = req.body.FROM_TIME;
        var to_time = req.body.TO_TIME;
        var site_id = req.body.SITE_ID;
        var doctor_id = req.body.DOCTOR_ID;
        var cal_id = req.body.CAL_ID;
        var service_id = req.body.SERVICE_ID;

        var sql = "UPDATE cln_appointment_calendar"
                +" SET FROM_TIME='"+from_time+"'"
                +", TO_TIME='"+to_time+"'"
                +", SITE_ID="+site_id
                +", SERVICE_ID="+service_id
                +" WHERE DOCTOR_ID="+doctor_id
                +" AND CAL_ID="+cal_id;

        console.log(sql);
        
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: err, sql: sql});
                    return;
                }
                res.json({status: 'success', data: data});
            });
        });
    },
    getCasualCalendar: function(req, res){
        var from_time = common_function.toDateDatabase(req.body.from_time);
        var to_time = common_function.toDateDatabase(req.body.to_time);
        var doctor_id = req.body.doctor_id;

        var sql = "SELECT * FROM cln_appointment_calendar WHERE DOCTOR_ID = "+doctor_id
                +" AND FROM_TIME LIKE '%"+from_time+"%'";

        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: err, sql: sql});
                    return;
                }
                res.json({status: 'success', data: data});
            });
        });
    },
    getMaxId: function(req, res){
        var sql = "SELECT MAX(doctor_id) AS doctor_id FROM doctors LIMIT 1";

        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: err, sql: sql});
                    return;
                }
                res.json({status: 'success', data: data[0]});
            });
        });
    },
    insert: function(req, res){
        var created_by = req.body.Created_by;

        delete req.body.Created_by;

        var sqlbuilder = squel.insert()
                .into("doctors")
                .set('Creation_date', 'NOW()', {dontQuote: true})
                .set('Created_by', created_by);
        ;

        var data = req.body;

        for (var key in data) {
            if (data[key] || data[key] === 0 || data[key] === '0')
                sqlbuilder.set(key, data[key]);
        }

        var sql = sqlbuilder.toString();
        
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: err, sql: sql});
                    return;
                }
                res.json({status: 'success', data: data});
            });
        });
    },
    update: function(req, res){
        var doctor_id = req.body.doctor_id;
        delete req.body.doctor_id;
        delete req.body.Last_update_date;

        var sqlbuilder = squel.update()
                .table("doctors")
                .set('Last_update_date', 'NOW()', {dontQuote: true})
                .where('doctor_id = ?', doctor_id);

        var data = req.body;

        for (var key in data) {
            if (data[key] || data[key] === 0 || data[key] === '0')
                sqlbuilder.set(key, data[key]);
        }

        var sql = sqlbuilder.toString();
        
        req.getConnection(function (err, connection) {
            var query = connection.query(sql, function (err, data) {
                if (err) {
                    res.json({status: err, sql: sql});
                    return;
                }
                res.json({status: 'success', data: data});
            });
        });
    },
    generateTimetable: function(req, res){
        var timetable_data = req.body.data.timetable;
        var timetable_interval = req.body.data.interval;
        var clinical_id = req.body.data.clinical_id;

        //var current_date = new Date("October 26, 2014 11:13:00");
        var current_date = new Date();
        var day_list = {
            '0':'Sunday',
            '1':'Monday',
            '2':'Tuesday',
            '3':'Wednesday',
            '4':'Thursday',
            '5':'Friday',
            '6':'Saturday'
        };

        var day_list_reverse = {
            'Sunday': '0',
            'Monday': '1',
            'Tuesday': '2',
            'Wednesday': '3',
            'Thursday': '4',
            'Friday': '5',
            'Saturday': '6'
        }

        var current_day = current_date.getDay();
        var remaining_day = 7-current_day;

        if(remaining_day === 7){
            remaining_day = 0;
        }

        var current_week = common_function.getWeekFromDate(current_date);
        if(current_week === 5) current_week = 1;
        var doctor_id = timetable_data[0].doctor_id;

        var sql = "INSERT INTO cln_appointment_calendar"+
                    "(DOCTOR_ID, SITE_ID, CLINICAL_DEPT_ID, FROM_TIME, TO_TIME, STATUS) VALUES";

        //INIT CALENDAR
        remain_day_list = [
            {'day_of_Week': day_list[current_day], 'day_of_Week_key': current_day}
        ];

        var temp_day = current_day;
        for(var i = 0; i < remaining_day; i++){
            var temp_day = temp_day+1;
            if(temp_day === 7)
                temp_day = 0;
            remain_day_list.push({'day_of_Week': day_list[temp_day], 'day_of_Week_key': temp_day});
        }

        for(var i = 0; i < remain_day_list.length; i++){
            for(var j = 0; j < timetable_data.length; j++){
                if(timetable_data[j].WEEKS && timetable_data[j].SITES){
                    var WEEKS = timetable_data[j].WEEKS.split(",");
                    var SITES = timetable_data[j].SITES.split(",");

                    var FROM_TIME = timetable_data[j].from_time_map;
                    var TO_TIME = timetable_data[j].to_time_map;

                    if(timetable_data[j].day_of_Week === remain_day_list[i].day_of_Week){
                        var offset = day_list_reverse[timetable_data[j].day_of_Week]-current_day;

                        var FROM_MINUTES = common_function.toMinutes(FROM_TIME, 0);
                        var TO_MINUTES = common_function.toMinutes(TO_TIME, 0);

                        var from = FROM_MINUTES;
                        while(from+timetable_interval <= TO_MINUTES){
                            var add_from_time = common_function.toTime(from);
                            var add_to_time = common_function.toTime(parseInt(from+timetable_interval));

                            var FROM_DATE = common_function.getFirstDateOffset(current_date, add_from_time, offset);
                            var TO_DATE = common_function.getFirstDateOffset(current_date, add_to_time, offset);

                            // SITE
                            var site_id = 0;
                            for(var site = 0; site < SITES.length; site++){
                                if(current_week == WEEKS[site]){
                                    site_id = SITES[site];
                                    break;
                                }else{
                                    var temp_week = current_week;
                                    while(temp_week > 1){
                                        temp_week = Math.floor(temp_week/2);

                                        if(temp_week == WEEKS[temp_week-1]){
                                            site_id = SITES[temp_week-1];
                                            break;
                                        }
                                    }
                                }
                            }
                            // END SITE

                            sql += "('"+doctor_id+"', "+site_id+", "+clinical_id+", '"+FROM_DATE+"', '"+TO_DATE+"', 'No Appoinment'),";
                            from += timetable_interval;
                        }
                    } // END DAY OF WEEK
                }
            }
        }
        //END INIT CALENDAR

        //LOOP 52 DAYS
        var week = 1;
        if(current_week == 4)
            week = 1;
        else
            week = week+1;
        var remaining_date = new Date();
        var millisecondOffset = (remaining_day+1) * 24 * 60 * 60 * 1000;
        remaining_date.setTime(current_date.getTime()+millisecondOffset);
        var loop_date = remaining_date;
        for(var i = 1; i <= 52; i++){
            if(week == 5)
                week = 1;

            for(var j = 0; j < timetable_data.length; j++){
                if(timetable_data[j].WEEKS && timetable_data[j].SITES){
                    var WEEKS = timetable_data[j].WEEKS.split(",");
                    var SITES = timetable_data[j].SITES.split(",");

                    var FROM_TIME = timetable_data[j].from_time_map;
                    var TO_TIME = timetable_data[j].to_time_map;

                    var offset = day_list_reverse[timetable_data[j].day_of_Week]-current_day;                    

                    var FROM_MINUTES = common_function.toMinutes(FROM_TIME, 0);
                    var TO_MINUTES = common_function.toMinutes(TO_TIME, 0);

                    var from = FROM_MINUTES;
                    while(from+timetable_interval <= TO_MINUTES){
                        var add_from_time = common_function.toTime(from);
                        var add_to_time = common_function.toTime(parseInt(from+timetable_interval));

                        var FROM_DATE = common_function.getDateOffset(loop_date, add_from_time, offset);
                        var TO_DATE = common_function.getDateOffset(loop_date, add_to_time, offset);

                        // SITE
                        var site_id = 0;
                        for(var site = 0; site < SITES.length; site++){
                            if(week == WEEKS[site]){
                                site_id = SITES[site];
                                break;
                            }else{
                                var temp_week = week;
                                while(temp_week > 1){
                                    temp_week = Math.floor(temp_week/2);

                                    if(WEEKS[temp_week-1]){
                                        if(temp_week == WEEKS[temp_week-1]){
                                            site_id = SITES[temp_week-1];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        // END SITE

                        sql += "('"+doctor_id+"', "+site_id+", "+clinical_id+", '"+FROM_DATE+"', '"+TO_DATE+"', 'No Appoinment'),";
                        from += timetable_interval;
                    } // END WHILE
                }
            }
            var temp_date = new Date();
            var millisecondOffset = 7 * 24 * 60 * 60 * 1000;
            temp_date.setTime(loop_date.getTime()+millisecondOffset);
            loop_date = temp_date;
            week++;
        }
        //END LOOP 52 WEEKS

        current_date = common_function.toDateDatabase(current_date);
        end_date = common_function.toDateDatabase(loop_date);
        sql = sql.substring(0, sql.length - 1);

        req.getConnection(function(err, connection){
            var remove_sql = "DELETE FROM cln_appointment_calendar WHERE DATE(FROM_TIME) BETWEEN '"+current_date+"' AND '"+end_date+"' AND DOCTOR_ID='"+doctor_id+"'";

            var query = connection.query(
                remove_sql,
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }else{
                        var insert = connection.query(
                            sql,
                            function(err, rows){
                                if(err){
                                    console.log("Error Selecting : %s ",err );
                                }else{
                                    res.json({'test': sql, 'status':'OK'});
                                }
                            }
                        );
                    }
                }
            );
        });
    },
    changeTimetableWeek: function(req, res){
        if(req.body.data){
            var data = req.body.data;

            var cal_header_df_id = data.cal_header_df_id;
            var doctor_id = data.doctor_id;
            var week_ord_of_month = data.week_ord_of_month;
            var site_id = data.site_id;
            var description = (data.description)?data.description:'';
            var isenable = data.isenable;

            req.getConnection(function(err, connection){
                var update_sql = "UPDATE sys_cal_sites_df "+
                    " SET site_id='"+site_id+"'"+
                    ", description='"+description+"'"+
                    ", isenable="+isenable+""+
                    " WHERE doctor_id='"+doctor_id+"'"+
                    " AND cal_header_df_id='"+cal_header_df_id+"'"+
                    " AND week_ord_of_month='"+week_ord_of_month+"'";

                var query = connection.query(
                    update_sql,
                    function(err, rows){
                        if(err){
                            console.log("Error Selecting : %s ",err );
                        }
                        else{
                            res.json({status: 'OK'});
                        }
                    }
                );
            });
        }
    },
    insertTimetableWeek: function(req, res){
        if(req.body.data){
            var data = req.body.data;

            var cal_header_df_id = data.cal_header_df_id;
            var doctor_id = data.doctor_id;
            var week_ord_of_month = data.week_ord_of_month;
            var site_id = data.site_id;
            var description = (data.description)?data.description:'';
            var isenable = data.isenable;

            req.getConnection(function(err, connection){
                var insert_sql = "INSERT INTO sys_cal_sites_df"+
                    "(cal_header_df_id, week_ord_of_month, site_id, description, isenable, doctor_id)"+
                    " VALUES('"+cal_header_df_id+"', '"+week_ord_of_month+"', '"+site_id+"', '"+description+"',"+isenable+",'"+doctor_id+"')";

                var query = connection.query(
                    insert_sql,
                    function(err, rows){
                        if(err){
                            console.log("Error Selecting : %s ",err );
                        }
                        else{
                            res.json({status: 'OK'});
                        }
                    }
                );
            });
        }
    },
    removeTimetableWeek: function(req, res){
        if(req.body.data){
            var data = req.body.data;

            var cal_header_df_id = data.cal_header_df_id;
            var doctor_id = data.doctor_id;
            var week_ord_of_month = data.week_ord_of_month;

            req.getConnection(function(err, connection){
                var remove_sql = "DELETE FROM sys_cal_sites_df"+
                    " WHERE cal_header_df_id='"+cal_header_df_id+"'"+
                    " AND doctor_id='"+doctor_id+"'"+
                    " AND week_ord_of_month="+week_ord_of_month;

                var query = connection.query(
                    remove_sql,
                    function(err, rows){
                        if(err){
                            console.log("Error Selecting : %s ",err );
                        }
                        else{
                            res.json({status: 'OK'});
                        }
                    }
                );
            });
        }
    },
    insertTimetable: function(req, res){
        if(req.body.data){
            var data = req.body.data;

            var doctor_id = data.doctor_id;
            var day_of_Week = data.day_of_Week;
            var description = (data.description)?data.description:'';

            var from_time = common_function.convertFromHoursToDateTime(data.from_time_map);
            var to_time = common_function.convertFromHoursToDateTime(data.to_time_map);
            var isenable = data.isenable;

            req.getConnection(function(err, connection){
                var insert_sql = "INSERT INTO sys_permernant_calendar_df"+
                    "(doctor_id, day_of_Week, description, from_time, to_time, isenable)"+
                    " VALUES('"+doctor_id+"', '"+day_of_Week+"', '"+description+"', '"+from_time+"', '"+to_time+"', "+isenable+")";

                var query = connection.query(
                    insert_sql,
                    function(err, rows){
                        if(err){
                            console.log("Error Selecting : %s ",err );
                        }
                        else{
                            res.json({status: 'OK'});
                        }
                    }
                );
            });
        }
    },
    removeTimetable: function(req, res){
        if(req.body.data){
            var data = req.body.data;

            var cal_header_df_id = data.cal_header_df_id;

            req.getConnection(function(err, connection){
                var remove_sql = "DELETE FROM sys_permernant_calendar_df"+
                    " WHERE cal_header_df_id='"+cal_header_df_id+"'";

                var query = connection.query(
                    remove_sql,
                    function(err, rows){
                        if(err){
                            console.log("Error Selecting : %s ",err );
                        }
                        else{
                            res.json({status: 'OK'});
                        }
                    }
                );
            });
        }
    },
    changeTimetable: function(req, res){
        var data = (req.body.data)?req.body.data:{};
        
        if(data){
            var cal_header_df_id = data.cal_header_df_id;
            var doctor_id = data.doctor_id;
            var day_of_Week = data.day_of_Week;
            var description = (data.description)?data.description:'';

            var from_time = common_function.convertFromHoursToDateTime(data.from_time_map);
            var to_time = common_function.convertFromHoursToDateTime(data.to_time_map);
            var isenable = data.isenable;
        }

        req.getConnection(function(err, connection){
            var update_sql = "UPDATE sys_permernant_calendar_df "+
                " SET day_of_Week='"+day_of_Week+"'"+
                ", description='"+description+"'"+
                ", from_time='"+from_time+"'"+
                ", to_time='"+to_time+"'"+
                ", isenable="+isenable+""+
                " WHERE doctor_id='"+doctor_id+"'"+
                " AND cal_header_df_id='"+cal_header_df_id+"'";

            var query = connection.query(
                update_sql,
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        res.json({status: 'OK'});
                    }
                }
            );
        });
    },
    updateTimetable: function(req, res){
         
    },
    timetableWeekById: function(req, res){
        var timetable_id = (req.body.cal_header_df_id)?req.body.cal_header_df_id:0;
        var doctor_id = (req.body.doctor_id)?req.body.doctor_id:0;

        req.getConnection(function(err, connection){
            var query = connection.query(
                "SELECT calsite.* "+
                " FROM sys_cal_sites_df calsite"+
                " WHERE doctor_id="+doctor_id+
                " AND cal_header_df_id="+timetable_id,
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        res.json(rows);
                    }
                }
            );
        });
    },
    timetable: function(req, res){
        var doctor_id = (req.body.doctor_id)?req.body.doctor_id:0;

        req.getConnection(function(err, connection){
            var query = connection.query(
                "SELECT per.*,GROUP_CONCAT(cal.week_ord_of_month) AS WEEKS, GROUP_CONCAT(cal.site_id) AS SITES"+
                " FROM sys_permernant_calendar_df per"+
                " LEFT OUTER JOIN sys_cal_sites_df cal"+
                " ON cal.doctor_id="+doctor_id+
                " AND cal.cal_header_df_id=per.cal_header_df_id"+
                " WHERE per.doctor_id="+doctor_id+
                " GROUP BY per.cal_header_df_id",
                function(err, rows){
                    if(err){
                        console.log("Error Selecting : %s ",err );
                    }
                    else{
                        res.json(rows);
                    }
                }
            );
        });
    },
    search: function(req, res){
        var limit = (req.body.search.limit)?req.body.search.limit:10;
        var offset = (req.body.search.offset)?req.body.search.offset:0;
        var data = (req.body.search.data)?req.body.search.data:{};

        var params = "WHERE ";
        for(var key in data){
            if(key !== "DATE"){
                if(data[key] === null)
                    data[key] = "";
                params += "IFNULL(d."+key+", 1) LIKE '%"+data[key]+"%' AND ";
            }else{
                var str_date = "";
                for(var key2 in data[key]){
                    if(data[key][key2].from_map !== null && data[key][key2].to_map !== null){
                        str_date += "d."+key2;
                        str_date += " BETWEEN '"+data[key][key2].from_map+"' AND '"+data[key][key2].to_map+"' AND ";
                    }
                }
                params += str_date;
            }
        }

        // CUT AND STRING
        params = params.substring(0, params.length - 5);
        // END CUT AND STRING

        var sql = "SELECT d.doctor_id, d.NAME, d.Email, d.Phone, d.Title, d.First_name, d.Middle_name, d.Sur_name "+
            " FROM doctors d "+
            params+
            " ORDER BY d.Creation_date DESC "+
            " LIMIT "+limit+
            " OFFSET "+offset;

        req.getConnection(function(err, connection){

            var key_result=connection.query(sql,
                    function(err,rows){
                        if(err)
                        {
                            res.json({status:err});
                        }
                        else
                        {
                            var count = 0;

                            var key_result = connection.query("SELECT COUNT(d.doctor_id) AS count "+
                                " FROM doctors d "+
                                params, function(err, rowsCount){
                                    if(err)
                                    {
                                        res.json({status:err});
                                    }else{
                                        var count = rowsCount[0].count;
                                        res.json({count:count, results:rows, params: params});
                                    }
                                }
                            );
                        }
                    }
            )
        });
    },
    getById: function(req, res){
        var id = (req.body.id)?req.body.id:0;

        req.getConnection(function(err, connection){
            var query = connection.query(
                "SELECT d.*"+
                " FROM doctors d"+
                " WHERE d.doctor_id="+id
                ,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }else{
                        res.json(rows[0]);
                    }
                });
        });
    },
    listByClinical: function(req, res){
        var dept = (req.body.dept)?req.body.dept:0;
        var datepicker = (req.body.datepicker_map)?req.body.datepicker_map:"";
        var site = (req.body.site)?req.body.site:0;

        var dept_sql = "";
        if(dept === 0 || dept === null){
            dept_sql = "";
        }else{
            dept_sql = " AND cac.clinical_dept_id="+dept;
        }

        req.getConnection(function(err, connection){
            var sql = "SELECT DISTINCT cac.DOCTOR_ID, d.NAME, d.CLINICAL_DEPT_ID"+
                " FROM cln_appointment_calendar cac"+
                " INNER JOIN doctors d ON cac.DOCTOR_ID=d.doctor_id"+
                dept_sql+
                " AND DATE(cac.FROM_TIME) LIKE '%"+datepicker+"%'"+
                " AND cac.SITE_ID="+site+
                " ORDER BY cac.DOCTOR_ID DESC";
            var query = connection.query(
                sql
                ,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }else{
                        res.json(rows);
                    }
                });
        });
    },
    list_bv:function(req,res)
    {
        req.getConnection(function(err, connection){
            var query = connection.query(
                'SELECT d.* from doctors d'
                ,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }

                    for(var i = 0; i < rows.length; i++){
                        if(rows[i].Signature){
                            var buffer = new Buffer(rows[i].Signature, "binary");
                            var data = buffer.toString('base64');
                            var rs = util.format("data:image/png;base64,%s", data);

                            rows[i].Signature = rs;
                        }
                    }
                    res.json(rows);
                });
        });
    },
    
 //tannv.dts@gmail.com   
    list:function(req,res)
    {
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                'SELECT d.*,s.Specialties_id FROM doctors d LEFT JOIN  doctor_specialities s ON d.`doctor_id`=s.`doctor_id`'
                ,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                    }
                    res.json(rows);
                });
        });
    },
    
    //tannv.dts@gmail.com
    getDoctorOfSpeciality:function(req,res)
    {
        var Specialties_id=req.query.Specialties_id;
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                'SELECT DISTINCT d.* FROM doctors d INNER JOIN  doctor_specialities s ON d.`doctor_id`=s.`doctor_id` WHERE s.Specialties_id=?'
                ,Specialties_id,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'})
                    }
                    else
                    {
                        res.json({status:'success',data:rows})
                    }

                });
        });
    },

    //tannv.dts@gmail.com
    getDoctorForSourceType:function(req,res)
    {
        var sourceType=req.query.sourceType?req.query.sourceType:'%' ;
        var sql=
            " SELECT DISTINCT doctor.*                                                                                      "+
            " FROM  doctors doctor INNER JOIN doctor_specialities doctorSpec ON doctor.`doctor_id`=doctorSpec.`doctor_id`   "+
            "  INNER JOIN `cln_specialties` spec ON spec.`Specialties_id`=doctorSpec.`Specialties_id`                      "+
            "  INNER JOIN `rl_types` rltype ON rltype.`RL_TYPE_ID`=spec.`RL_TYPE_ID`                                       "+
            " WHERE  rltype.`SOURCE_TYPE` like ?                                                                             ";
        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,[sourceType],function(err,rows)
            {
                if(err)
                {
                    res.json({status:'fail'})
                }
                else
                {
                    res.json({status:'success',data:rows})
                }

            });
        });
    },

//tannv.dts@gmail.com
    getDoctorInfoByUserId:function(req,res)
    {
        var userId=req.query.userId;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>"+userId);
        req.getConnection(function(err,connection)
        {

            var query = connection.query(
                ' SELECT doctor.doctor_id FROM `doctors` doctor WHERE doctor.`User_id`=? '
                ,userId,function(err,rows)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'})
                    }
                    else
                    {
                        if(rows.length>0)
                            res.json({status:'success',data:rows[0]});
                        else
                            res.json({status:'fail'});
                    }

                });
        });
    },

//tannv.dts@gmail.com
    getDoctorById:function(req,res)
    {
        var doctorId=req.query.doctorId;
        var sql='SELECT doctor.`doctor_id`,doctor.`NAME` FROM `doctors` doctor WHERE doctor.`doctor_id`=?';
        req.getConnection(function(err,connection)
        {

            var query = connection.query(sql,doctorId,function(err,rows)
            {
                if(err)
                {
                    console.log("Error Selecting : %s ",err );
                    res.json({status:'fail'})
                }
                else
                {
                    if(rows.length>0)
                        res.json({status:'success',data:rows[0]});
                    else
                        res.json({status:'fail'});
                }

            });
        });
    }
}
