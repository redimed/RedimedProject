 //EXPORTS MODEL
 var db = require("../../models");
 var CronJob = require('cron').CronJob;
 var moment = require('moment');
 var FunctionSendMail = require("./sendMailSystemController");
 //END
 module.exports = {
     sendMailSubmitLeave: function(req, res, info) {
         var arrayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
         var DATE_OF_WEEK = arrayWeek[moment(info.dateSubmit).format('e') - 1];
         var DATE_SUBMIT = moment(info.dateSubmit).format('DD/MM/YYYY - HH:mm:ss');
         //GET INFOMATION MANAGE AND EMPLOYEE
         var queryGetInfoEmployee =
             "SELECT hr_employee.FirstName, hr_employee.LastName, sys_hierarchy_nodes.NODE_ID " + //SELECT
             "FROM hr_employee " + //FROM
             "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
             "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
             "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
             "WHERE users.id = :userID"; //WHERE
         db.sequelize.query(queryGetInfoEmployee, null, {
                 raw: true
             }, {
                 userID: info.userID
             })
             .success(function(resultInfoEmployee) {
                 if (resultInfoEmployee !== undefined &&
                     resultInfoEmployee !== null &&
                     resultInfoEmployee.length !== 0 &&
                     resultInfoEmployee[0] !== undefined &&
                     resultInfoEmployee[0] !== null &&
                     !(isNaN(resultInfoEmployee[0].NODE_ID))) {
                     var queryGetInfoManage =
                         "SELECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email " + //SELECT
                         "FROM hr_employee " + //FROM
                         "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                         "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                         "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.TO_NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                         "WHERE sys_hierarchy_nodes.NODE_ID = :nodeID"; //WHERE
                     db.sequelize.query(queryGetInfoManage, null, {
                             raw: true
                         }, {
                             nodeID: resultInfoEmployee[0].NODE_ID
                         })
                         .success(function(resultInfoManage) {
                             if (resultInfoManage !== undefined &&
                                 resultInfoManage !== null &&
                                 resultInfoManage.length !== 0 &&
                                 resultInfoManage[0] !== undefined &&
                                 resultInfoManage[0] !== null &&
                                 resultInfoManage[0].Email !== undefined &&
                                 resultInfoManage[0].Email !== null &&
                                 resultInfoManage[0].Email.length !== 0) {
                                 //SEND EMAIL TO MANAGE
                                 mailOptions = {
                                     senders: 'TimeSheet',
                                     recipients: resultInfoManage[0].Email,
                                     subject: 'Notification of Submitted Leave(s)',
                                     htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultInfoManage[0].FirstName + ' ' + resultInfoManage[0].LastName + ',</label></b><br/><br/><br/>' +
                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a notice that you has been submitted a Leave Form from <b>' + resultInfoEmployee[0].FirstName + ' ' + resultInfoEmployee[0].LastName + '</b> on <b>' + DATE_OF_WEEK + ', ' +
                                         DATE_SUBMIT + '.</b><br/><br/><br/>' +
                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the e-Timesheet System to review and approve/reject the leave.<br/><br/><br/>' +
                                         'Access the e-Timesheet System at https://apps.redimed.com.au</label><br/><br/><br/>' +
                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<br></label><br/><br/><br/>' +
                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                         '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                         '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                         '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                         'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                         '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                                 };

                                 // CALL SEND MAIL
                                 FunctionSendMail.sendEmail(req, res, mailOptions);
                                 // END CALL

                                 // END SEND EMAIL
                             }
                         })
                         .error(function(err) {
                             cosole.log("*****ERROR:" + err + "*****");
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
         //END GET INFORMATION
     },

     sendMailSubmitLeaveAgain: function(req, res, info) {
         var arrayWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
         var DATE_OF_WEEK = arrayWeek[moment(info.dateSubmit).format('e') - 1];
         var DATE_SUBMIT = moment(info.dateSubmit).format('DD/MM/YYYY - HH:mm:ss');
         var queryGetNodeIdUserApproveFirst =
             "SElECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email, sys_hierarchy_nodes.TO_NODE_ID " + //SELECT
             "FROM hr_employee " + //FROM
             "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
             "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
             "INNER JOIN sys_hierarchy_nodes ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
             "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
             "WHERE sys_hierarchies_users.USER_ID = :userId"; //WHERE
         db.sequelize.query(queryGetNodeIdUserApproveFirst, null, {
                 raw: true
             }, {
                 userId: info.userId
             })
             .success(function(resultNodeInUserApproveFirst) {
                 if (resultNodeInUserApproveFirst !== undefined &&
                     resultNodeInUserApproveFirst !== null &&
                     resultNodeInUserApproveFirst.length !== 0) {
                     var queryGetInfoUserApproveSecond =
                         "SElECT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email " + //SELECT
                         "FROM hr_employee " + //FROM
                         "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                         "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                         "INNER JOIN sys_hierarchy_nodes ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
                         "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                         "WHERE sys_hierarchy_nodes.NODE_ID = :nodeId"; //WHERE
                     db.sequelize.query(queryGetInfoUserApproveSecond, null, {
                             raw: true
                         }, {
                             nodeId: resultNodeInUserApproveFirst[0].TO_NODE_ID
                         })
                         .success(function(resultInfoUserApproveSecond) {
                             if (resultInfoUserApproveSecond !== undefined &&
                                 resultInfoUserApproveSecond !== null &&
                                 resultInfoUserApproveSecond.length !== 0) {
                                 var queryGetInfoEmployee =
                                     "SELECT DISTINCT hr_employee.FirstName, hr_employee.LastName, hr_employee.Email " + //SELECT
                                     "FROM hr_employee " + //FROM
                                     "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                                     "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                     "INNER JOIN sys_hierarchy_nodes ON sys_hierarchy_nodes.NODE_ID = sys_hierarchies_users.NODE_ID " + //JOIN
                                     "INNER JOIN sys_hierarchy_group on sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                     "INNER JOIN hr_leave ON hr_leave.user_id = users.id " + //JOIN
                                     "WHERE hr_leave.leave_id = :leaveID AND sys_hierarchy_group.GROUP_TYPE='Time Sheet'"; //WHERE
                                 db.sequelize.query(queryGetInfoEmployee, null, {
                                         raw: true
                                     }, {
                                         leaveID: info.leaveID
                                     })
                                     .success(function(resultInfoEmployee) {
                                         if (resultInfoEmployee !== undefined &&
                                             resultInfoEmployee !== null &&
                                             resultInfoEmployee.length !== 0) {
                                             for (var keyManageSecond in resultInfoUserApproveSecond) {
                                                 var mailOptions = {
                                                     senders: 'TimeSheet',
                                                     recipients: resultInfoUserApproveSecond[keyManageSecond].Email,
                                                     subject: 'Notification of Submitted Leave(s)',
                                                     htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultInfoUserApproveSecond[keyManageSecond].FirstName + ' ' + resultInfoUserApproveSecond[keyManageSecond].LastName + ',</label></b><br/><br/><br/>' +
                                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a notice that you has been submitted a leave from <b>' + resultInfoEmployee[0].FirstName + ' ' + resultInfoEmployee[0].LastName + '</b> on <b>' + DATE_OF_WEEK + ', ' +
                                                         DATE_SUBMIT + '.</b><br/><br/><br/>' +
                                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the e-Timesheet System to review and approve/reject the leave.<br/><br/><br/>' +
                                                         'Access the e-Timesheet System at https://apps.redimed.com.au</label><br/><br/><br/>' +
                                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<br></label><br/><br/><br/>' +
                                                         '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                                         '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                                         '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                                         '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                                         'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                                         '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                                                 };

                                                 // CALL SEND MAIL
                                                 FunctionSendMail.sendEmail(req, res, mailOptions);
                                                 // END CALL
                                             }
                                         } else {
                                             console.log("*****ERROR:NOT FOUND INFOMATION EMPLOYEE TO SEND EMAIL*****");
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

                             }
                         })
                         .error(function(err) {
                             console.log("*****ERROR:" + err + "*****");
                             res.json({
                                 status: "error"
                             });
                             return;
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

     sendMailLeave: function(req, res, info) {
         var mailOptions = {};
         var queryGetInfoEmployee =
             "SELECT hr_employee.FirstName, hr_employee.TITLE, hr_employee.Email, hr_employee.LastName, " + //SELECT
             "hr_leave.start_date, hr_leave.finish_date, hr_leave.user_id " + //SELECT
             "FROM hr_employee INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //FROM
             "INNER JOIN hr_leave ON users.id = hr_leave.user_id " + //JOIN
             "WHERE hr_leave.leave_id = :leaveID"; //WHERE
         db.sequelize.query(queryGetInfoEmployee, null, {
                 raw: true
             }, {
                 leaveID: info.leaveID
             })
             .success(function(result) {
                 var start_date = "";
                 var end_date = "";
                 if (result[0] !== undefined && result[0] !== null) {
                     start_date = moment(result[0].start_date).format('DD/MM/YYYY');
                     finish_date = moment(result[0].finish_date).format('DD/MM/YYYY');
                 }
                 if (info.status === 4) {
                     mailOptions = {
                         senders: 'TimeSheet',
                         recipients: result[0].Email,
                         subject: 'Notification of Rejected Leave(s)',
                         htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' + result[0].FirstName + ' ' + result[0].LastName + ',</b></label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your leave for the period (' + start_date + '–' + finish_date + ') has been rejected.<br/><br/><br/> Please log into the e-Timesheet System to correct and re-submit your leave. ' +
                             'Failure to re-submit your leave may result in not being paid or loss of accrued leave.</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">If you have any questions regarding your leave in general then please contact your Team Leader.</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet System at https://apps.redimed.com.au<label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<br></label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond' +
                             '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                             '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                             '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                             'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                             '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                     };
                     queryGetPositionUserReject =
                         "SELECT hr_employee.TITLE " + //SELECT
                         "FROM hr_employee " + //FROM
                         "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
                         "WHERE users.id = :userId"; //WHERE
                     db.sequelize.query(queryGetPositionUserReject, null, {
                             raw: true
                         }, {
                             userId: info.userID
                         })
                         .success(function(resultPosition) {
                             if (resultPosition !== undefined &&
                                 resultPosition !== null &&
                                 resultPosition.length !== 0 &&
                                 resultPosition[0] !== undefined &&
                                 resultPosition[0] !== null &&
                                 resultPosition[0].TITLE === "Director" &&
                                 result[0].TITLE === "Staff") {
                                 var queryGetNodeIdManage =
                                     "SELECT sys_hierarchy_nodes.TO_NODE_ID " + //SELECT
                                     "FROM sys_hierarchy_nodes " + //FROM
                                     "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.NODE_ID " + //JOIN
                                     "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
                                     "WHERE sys_hierarchy_group.GROUP_TYPE='Time Sheet' AND sys_hierarchies_users.USER_ID = :userId"; //WHERE
                                 db.sequelize.query(queryGetNodeIdManage, null, {
                                         raw: true
                                     }, {
                                         userId: result[0].user_id
                                     })
                                     .success(function(resultNodeIdManage) {
                                         if (resultNodeIdManage !== undefined &&
                                             resultNodeIdManage !== null &&
                                             resultNodeIdManage.length !== 0) {
                                             var queryGetEmailTeamLeader =
                                                 "SElECT hr_employee.Email " + //SELECT
                                                 "FROM hr_employee " + //FROM
                                                 "INNER JOIN users ON hr_employee.Employee_ID = users.employee_id " + //JOIN
                                                 "INNER JOIN sys_hierarchies_users ON sys_hierarchies_users.USER_ID = users.id " + //JOIN
                                                 "INNER JOIN sys_hierarchy_nodes ON sys_hierarchies_users.NODE_ID = sys_hierarchy_nodes.TO_NODE_ID " + //JOIN
                                                 "WHERE sys_hierarchies_users.NODE_ID = :nodeId"; //WHERE
                                             db.sequelize.query(queryGetEmailTeamLeader, null, {
                                                     raw: true
                                                 }, {
                                                     nodeId: resultNodeIdManage[0].TO_NODE_ID
                                                 })
                                                 .success(function(resultEmailTeamLeader) {
                                                     if (resultEmailTeamLeader !== undefined &&
                                                         resultEmailTeamLeader !== null &&
                                                         resultEmailTeamLeader.length !== 0 &&
                                                         resultEmailTeamLeader[0] !== undefined &&
                                                         resultEmailTeamLeader[0] !== null) {
                                                         mailOptions.cc = resultEmailTeamLeader[0].Email;
                                                     }
                                                     //CALL SEND MAIL
                                                     FunctionSendMail.sendEmail(req, res, mailOptions);
                                                     // END CALL
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
                             } else {
                                 //CALL SEND MAIL
                                 FunctionSendMail.sendEmail(req, res, mailOptions);
                                 // END CALL
                             }

                         })
                         .error(function(err) {
                             console.log("*****ERROR:" + err + "*****");
                             res.json({
                                 status: "error"
                             });
                             return;
                         });

                     // END REJECT

                 } else if (info.status === 3) {
                     //IS APPROVE
                     mailOptions = {
                         senders: 'TimeSheet',
                         recipients: result[0].Email,
                         subject: 'Notification of Approved Leave(s)',
                         htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' +
                             result[0].FirstName + ' ' + result[0].LastName +
                             '</b></label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your leave for the period (' +
                             start_date + '–' + finish_date + ') has been approved.</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet System at https://apps.redimed.com.au</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">e-Timesheet Reporting System<label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label</i>' +
                             '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                             '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                             '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                             'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                             '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                     };
                     // END APPROVE

                     //CALL SEND MAIL
                     FunctionSendMail.sendEmail(req, res, mailOptions);
                     // END CALL
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

     SendMailNotification: function(req, res) {
         //SEND MAIL
         var queryNode =
             "SELECT sys_hierarchy_nodes.NODE_ID " + //SELECT
             "FROM sys_hierarchy_nodes " + //FROM
             "INNER JOIN sys_hierarchy_group ON sys_hierarchy_group.GROUP_ID = sys_hierarchy_nodes.GROUP_ID " + //JOIN
             "WHERE sys_hierarchy_group.GROUP_TYPE = 'Time Sheet' AND (sys_hierarchy_nodes.NODE_CODE = 'Staff' OR sys_hierarchy_nodes.NODE_CODE = 'Head of Dept.')"; //WHERE
         db.sequelize.query(queryNode)
             .success(function(resultNode) {
                 var strNode = "";
                 if (resultNode !== undefined && resultNode !== null) {
                     for (var i = 0; i < resultNode.length; i++) {
                         if (resultNode[i] !== undefined &&
                             resultNode[i] !== null &&
                             !isNaN(resultNode[i].NODE_ID)) {
                             strNode += resultNode[i].NODE_ID + ", ";
                         }
                     }
                 }
                 if (strNode === "" || strNode.length === 0) {
                     strNode = "(-1)";
                 } else {
                     strNode = "(" + strNode.substring(0, strNode.length - 2) + ")";
                 }
                 var queryHasTimeSheet = "SELECT time_tasks_week.user_id FROM time_tasks_week WHERE time_tasks_week.week_no = " + module.exports.getWeekNo();
                 db.sequelize.query(queryHasTimeSheet)
                     .success(function(resultHasTimeSheet) {
                         var strHasTimeSheet = "";
                         if (resultHasTimeSheet !== undefined && resultHasTimeSheet !== null) {
                             for (var i = 0; i < resultHasTimeSheet.length; i++) {
                                 if (resultHasTimeSheet[i] !== undefined &&
                                     resultHasTimeSheet[i] !== null &&
                                     !isNaN(resultHasTimeSheet[i].user_id)) {
                                     strHasTimeSheet += resultHasTimeSheet[i].user_id + ", ";
                                 }
                             }
                         }
                         if (strHasTimeSheet === "" || strHasTimeSheet.length === 0) {
                             strHasTimeSheet = "(-1)";
                         } else {
                             strHasTimeSheet = "(" + strHasTimeSheet.substring(0, strHasTimeSheet.length - 2) + ")";
                         }

                         var queryListEmp = "SELECT DISTINCT hr_employee.Email, hr_employee.FirstName, hr_employee.LastName FROM users " +
                             "INNER JOIN hr_employee ON hr_employee.Employee_ID = users.employee_id " +
                             "INNER JOIN sys_hierarchies_users ON users.id = sys_hierarchies_users.USER_ID " +
                             "WHERE (hr_employee.TITLE = 'Staff' OR hr_employee.TITLE = 'Head of Dept.') " +
                             "AND sys_hierarchies_users.NODE_ID IN " + strNode + " AND sys_hierarchies_users.USER_ID NOT IN " + strHasTimeSheet;
                         db.sequelize.query(queryListEmp)
                             .success(function(resultListEmp) {
                                 var FRIDAY = moment(moment().day(5)).format("DD/MM/YYYY");
                                 for (var lM = 0; lM < resultListEmp.length; lM++) {
                                     var mailOptions = {
                                         senders: 'TimeSheet',
                                         recipients: resultListEmp[lM].Email,
                                         subject: 'Notification of Late Timesheet(s) Due',
                                         htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Dear <b>' + resultListEmp[lM].FirstName + ' ' + resultListEmp[lM].LastName + '</label></b>,<br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This is a reminder that your timesheet was due</label><b> FRIDAY, ' + FRIDAY + ' - 12:00pm.&nbsp;</b><br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please log into the Timesheet System to complete and submit your timesheet. ' +
                                             'Failure to submit your timesheets may result in not being paid or loss of accrued leave.</label><br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">If you have any questions regarding your timesheet in general then please contact your Team Leader.</label><br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au</label><br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System</label><br/><br/><br/>' +
                                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label>' +
                                             '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                                             '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                                             '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                                             'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                                             '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                                     };
                                     //CALL SEND MAIL
                                     FunctionSendMail.sendEmail(req, res, mailOptions);
                                     // END CALL
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
         //END
     },

     getWeekNo: function() {
         d = new Date();
         d.setHours(0, 0, 0);
         d.setDate(d.getDate() + 4 - (d.getDay() || 7));
         var yearStart = new Date(d.getFullYear(), 0, 1);
         var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
         return weekNo;
     },

     TracKerTimeSheet: function(info) {
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
     },

     TracKerLeave: function(info) {
         var queryGetUserIdLeave =
             "SElECT hr_leave.user_id " +
             "FROM hr_leave " +
             "WHERE hr_leave.leave_id = :leaveId";
         db.sequelize.query(queryGetUserIdLeave, null, {
                 raw: true
             }, {
                 leaveId: info.leaveID
             })
             .success(function(resultUserIdLeave) {
                 if (resultUserIdLeave !== undefined &&
                     resultUserIdLeave !== null &&
                     resultUserIdLeave.length !== 0) {
                     var arrayAction = {
                         1: "Save",
                         2: "Submit",
                         3: "Approve",
                         4: "Reject",
                         5: "Resubmit"
                     };
                     var nameAction = "";
                     if (resultUserIdLeave[0].user_id === info.userID &&
                         info.statusID === 4) {
                         nameAction = "Save";
                     } else {
                         nameAction = arrayAction[info.statusID];
                     }
                     var queryTracKer = "INSERT INTO leave_tracker (action_name, leave_id, user_id, creation_date) " +
                         "VALUES(:nameAction, :leaveID, :userID, :creationDate)";
                     db.sequelize.query(queryTracKer, null, {
                             "reload": true
                         }, {
                             nameAction: nameAction,
                             leaveID: info.leaveID,
                             userID: info.userID,
                             creationDate: info.creationDate
                         })
                         .success(function(resultTracKer) {
                             console.log("***** SAVE TRACKER SUCCESS *****");
                         })
                         .error(function(error) {
                             console.log("***** SAVE TRACKER ERROR *****");
                         });
                 }
             })
             .error(function(err) {
                 console.log("*****ERROR:" + err + "*****");
                 res.json({
                     status: "error"
                 });
             });
     },

     getFortMatTimeCharge: function(time_charge) {
         if (time_charge !== undefined && time_charge !== null && time_charge !== 0) {
             var hours = parseInt(time_charge / 60);
             var minutes = parseInt(time_charge % 60);
             if (hours < 10) {
                 hours = '0' + hours;
             }
             if (minutes < 10) {
                 minutes = '0' + minutes;
             }
             return hours + ':' + minutes;
         } else {
             return "-";
         }
     },

     convertTime: function(time) {
         if (time === undefined || time === null || isNaN(time)) {
             return 0;
         } else {
             var tempTime = (time * 37.25) / 2235;
             var tempTimeInt = parseInt(tempTime);
             var tempDecimal = (tempTime - tempTimeInt).toFixed(3) * 100;
             if (tempDecimal >= 87.5) {
                 tempTimeInt += 1;
             } else if (tempDecimal >= 62.5) {
                 tempTimeInt += 0.75;
             } else if (tempDecimal >= 37.5) {
                 tempTimeInt += 0.5;
             } else if (tempDecimal >= 12.5) {
                 tempTimeInt += 0.25;
             }
             return tempTimeInt;
         }
     },

     SendMailTimeSheet: function(req, res, info) {
         var mailOptions = {};
         var query =
             "SELECT hr_employee.FirstName, hr_employee.Email, hr_employee.LastName, time_tasks_week.start_date, " + //SELECT
             "time_tasks_week.end_date " + //SELECT
             "FROM hr_employee " + //FROM
             "INNER JOIN users ON users.employee_id = hr_employee.Employee_ID " + //JOIN
             "INNER JOIN time_tasks_week ON users.id = time_tasks_week.user_id " + //JOIN
             "WHERE time_tasks_week.task_week_id = :idTaskWeek";
         db.sequelize.query(query, null, {
                 raw: true
             }, {
                 idTaskWeek: info.idTaskWeek
             })
             .success(function(result) {
                 var start_date = "";
                 var end_date = "";
                 if (result[0] !== undefined && result[0] !== null) {
                     start_date = moment(result[0].start_date).format('DD/MM/YYYY');
                     end_date = moment(result[0].end_date).format('DD/MM/YYYY');
                 }
                 if (info.status === 4) {
                     mailOptions = {
                         senders: 'TimeSheet',
                         recipients: result[0].Email,
                         subject: 'Notification of Rejected Timesheet(s)',
                         htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' + result[0].FirstName + ' ' + result[0].LastName + ',</b></label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your timesheet for the period (' + start_date + '–' + end_date + ') has been rejected.<br/><br/><br/> Please log into the Timesheet System to correct and re-submit your timesheet. ' +
                             'Failure to re-submit your timesheets may result in not being paid or loss of accrued leave.</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">If you have any questions regarding your timesheet in general then please contact your Team Leader.</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au<label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System<br></label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond' +
                             '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                             '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                             '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                             'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                             '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                     };
                     // END APPROVE

                     //CALL SEND MAIL
                     FunctionSendMail.sendEmail(req, res, mailOptions);
                     // END CALL

                 } else if (info.status === 3) {
                     //IS APPROVE
                     mailOptions = {
                         senders: 'TimeSheet',
                         recipients: result[0].Email,
                         subject: 'Notification of Approved Timesheet(s)',
                         htmlBody: '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Attention: <b>' +
                             result[0].FirstName + ' ' + result[0].LastName +
                             '</b></label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Your timesheet for the period (' +
                             start_date + '–' + end_date + ') has been approved.</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Access the e-Timesheet at https://apps.redimed.com.au</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Regards,</label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Timesheet Reporting System<label><br/><br/><br/>' +
                             '<label style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This e-mail was auto generated. Please do not respond</label</i>' +
                             '<hr/><table><tbody><tr><td><img src="cid:logoRedimed"></td><td><b><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">A</b>&nbsp;1 Frederick Street, Belmont, Western Australia 610</span>' +
                             '<br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>T&nbsp;</b>1300 881 301 (REDiMED Emergency Service 24/7)</span><br/><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;"><b>W&nbsp;</b>www.redimed.com.au</span></td></tr><tr><tr>' +
                             '<td colspan="2"><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">This message and any files transmitted with it contains confidential information intended only for the use of the addressee. If you are not the intended recipient of this message, ' +
                             'any unauthorized form of reproduction of this message is strictly prohibited. If you have received this message in error, please notify us immediately.</span></td></tr>' +
                             '<br/><br/><tr><td><span style="font-family:Helvetica Neue,Segoe UI,Helvetica,Arial,Lucida Grande,sans-serif;">Please consider our environment before printing this e-mail.</span></td></tr></tbody></table>'
                     };
                     // END APPROVE

                     //CALL SEND MAIL
                     FunctionSendMail.sendEmail(req, res, mailOptions);
                     // END CALL
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
 };

 var job = new CronJob({
     cronTime: '00 00 07 * * 5',
     onTick: function(req, res) {
         module.exports.SendMailNotification(req, res);
     },
     start: false,
     timeZone: 'Australia/Canberra',
     // timeZone: 'Asia/Bangkok'
 });
 // job.start();
