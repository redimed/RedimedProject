var db = require('../models');
var rlobEmailController=require('./rlobEmailController');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var bcrypt = require('bcrypt-nodejs');
var randomstr = require('randomstring');

/**
 * Xu ly cap nhat lai appointment fromTime va toTime
 * day la function con, la mot function chay trong 1 function beginTransaction truoc do
 * function nay khong the chay truc tiep ma phai duoc nam trong function beginTransaction
 * tannv.dts@gmail.com
 */
var saveBookingInfo=function(req,res)
{
	var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    var userId=kiss.checkData(userInfo.id)?userInfo.id:null;

	var bookingInfo=kiss.checkData(req.body.bookingInfo)?req.body.bookingInfo:{};
    var patientInfo={
    	Sur_name:bookingInfo.WRK_SURNAME,
    	First_name:bookingInfo.WRK_OTHERNAMES,
    	DOB:bookingInfo.WRK_DOB,
    	Email:bookingInfo.WRK_EMAIL,
    	Mobile:bookingInfo.WRK_CONTACT_NO
    }

    var claimInfo={
    	Claim_no :bookingInfo.CLAIM_NO,
        Injury_name : 'No Description'
    }

    var currentTime=kiss.getCurrentTimeStr();

    var sql="INSERT INTO `cln_patients` SET ?";

    kiss.executeQuery(req,sql,[patientInfo],function(result){
    	var patientId=result.insertId;
    	claimInfo.Patient_id = patientId;
    	var sql="INSERT INTO `cln_claims` SET ?";
    	kiss.executeQuery(req,sql,[claimInfo],function(result){
    		var sql="SELECT ap.id FROM `cln_appt_patients` ap WHERE ap.`Patient_id`=? AND ap.`CAL_ID`=?";
    		kiss.executeQuery(req,sql,[patientId,claimInfo.Claim_no],function(data){
    			if(data.length>0)
    			{
    				kiss.exlog("saveBookingInfo","Bi trung du lieu tai cln_appt_patients, patient nay da booking cal_id tu truoc roi");
            		kiss.rollback(req,function(){
						res.json({status:"fail"});
					});
    			}
    			else
    			{
    				var sql="INSERT INTO `cln_appt_patients` SET ?";
    				var apptPatientInsertInfo={
    					Patient_id:patientId,
    					CAL_ID:bookingInfo.CAL_ID,
    					Created_by:userId,
    					Creation_date:currentTime
    				}
    				kiss.executeQuery(req,sql,[apptPatientInsertInfo],function(result){
    					var sql="SELECT * FROM `cln_appointment_calendar` calendar WHERE calendar.`CAL_ID`=?";
	        			kiss.executeQuery(req,sql,[bookingInfo.CAL_ID],function(data){
	        				if(data.length>0)
	        				{
	                            var sql="UPDATE `cln_appointment_calendar` SET ? WHERE `CAL_ID`=?";
	                            var appointmentUpdateInfo={
	                            	STATUS:rlobUtil.calendarStatus.booked,
									NOTES:rlobUtil.sourceType.REDiLEGAL
	                            }
	                            kiss.executeQuery(req,sql,[appointmentUpdateInfo,bookingInfo.CAL_ID],function(result){
	                            	if(result.affectedRows>0)
	                            	{
	                            		var insertBookingInfo={
								            BOOKING_ID:bookingInfo.BOOKING_ID,
								            BOOKING_DATE:bookingInfo.BOOKING_DATE,
								            COMPANY_ID:bookingInfo.COMPANY_ID,
								            RL_TYPE_ID:bookingInfo.RL_TYPE_ID,
								            SPECIALITY_ID:bookingInfo.SPECIALITY_ID,
								            DOCTOR_ID:bookingInfo.DOCTOR_ID,
								            SITE_ID:bookingInfo.SITE_ID,
								            FROM_DATE:bookingInfo.FROM_DATE,
								            TO_DATE:bookingInfo.TO_DATE,
								            CAL_ID:bookingInfo.CAL_ID,
								            ASS_SURNAME:bookingInfo.ASS_SURNAME,
								            ASS_OTHERNAMES:bookingInfo.ASS_OTHERNAMES,
								            ASS_CONTACT_NO:bookingInfo.ASS_CONTACT_NO,
								            ASS_EMAIL:bookingInfo.ASS_EMAIL,
								            WRK_SURNAME:bookingInfo.WRK_SURNAME,
								            WRK_OTHERNAMES:bookingInfo.WRK_OTHERNAMES,
								            WRK_CONTACT_NO:bookingInfo.WRK_CONTACT_NO,
								            WRK_EMAIL:bookingInfo.WRK_EMAIL,
								            DESC_INJURY:bookingInfo.DESC_INJURY,
								            ISNEW:bookingInfo.ISNEW,
								            ISCONTACTPATIENT:bookingInfo.ISCONTACTPATIENT,
								            ISCONTACTMANAGER:bookingInfo.ISCONTACTMANAGER,
								            NOTES:bookingInfo.NOTES,
								            STATUS:bookingInfo.STATUS,
								            CREATED_BY:userId,
								            CREATION_DATE:currentTime,
								            refered_date_string:bookingInfo.refered_date_string,
								            isUrgent:bookingInfo.isUrgent,
								            CLAIM_NO:bookingInfo.CLAIM_NO,
								            WRK_DOB:bookingInfo.WRK_DOB,
								            APPOINTMENT_DATE:bookingInfo.APPOINTMENT_DATE,
								            ASS_ID:bookingInfo.ASS_ID,
								            EMPLOYEE_NUMBER:bookingInfo.EMPLOYEE_NUMBER,
								            DEPARTMENT_NAME:bookingInfo.DEPARTMENT_NAME,
								            DESC_VACCIN:bookingInfo.DESC_VACCIN,
								            BOOKING_TYPE:bookingInfo.BOOKING_TYPE,
								            WRK_DATE_OF_INJURY:bookingInfo.WRK_DATE_OF_INJURY,
								            PATIENT_ID:patientId
								        }
								        var sql="INSERT INTO `rl_bookings` SET ?";
								        kiss.executeQuery(req,sql,[insertBookingInfo],function(result){
								        	//Cap nhat appointment calendar status (thay the trigger after_rl_bookings_insert)
								        	var sql="UPDATE `cln_appointment_calendar` SET ? WHERE `CAL_ID`=?";
								        	var appointmentUpdateStatus={
								        		NOTES:rlobUtil.sourceType.REDiLEGAL,
								        		STATUS:rlobUtil.calendarStatus.booked
								        	}
								        	kiss.executeQuery(req,sql,[appointmentUpdateStatus,bookingInfo.CAL_ID],function(result){
								        		if(result.affectedRows>0)
								        		{
								        			kiss.commit(req,function(){
										        		res.json({status:'success'});
				                    				},function(err)
				                    				{
				                    					res.json({status:'fail'});
				                    				});
								        		}
								        		else
								        		{
								        			kiss.exlog("saveBookingInfo","Khong co appointment calendar nao duoc cap nhat status");
								        			kiss.rollback(req,function(){
						        						res.json({status:"fail"});
						        					});
								        		}
								        	},function(err){
								        		kiss.exlog("saveBookingInfo","Loi cap nhat appointmentCalendarStatus");
								        		kiss.rollback(req,function(){
					        						res.json({status:"fail"});
					        					});
								        	})
								        	
								        },function(err){
								        	kiss.exlog("saveBookingInfo","Loi insert booking info",err);
								        	kiss.rollback(req,function(){
				        						res.json({status:"fail"});
				        					});
								        });
								        
	                            	}
	                            	else
	                            	{
	                            		kiss.exlog("saveBookingInfo","khong co cln_appointment_calendar duoc cap nhat");
	                            		kiss.rollback(req,function(){
			        						res.json({status:"fail"});
			        					});
	                            	}
	                            },function(err){
	                            	kiss.exlog("saveBookingInfo","loi truy van cap nhat cln_appointment_calendar",err);
	                            	kiss.rollback(req,function(){
		        						res.json({status:"fail"});
		        					})
	                            })
	        				}
	        				else
	        				{
	        					kiss.exlog("saveBookingInfo","Khong co cln_appointment_calendar tuong ung");
	        					kiss.rollback(req,function(){
	        						res.json({status:"fail"});
	        					})
	        				}
	        			},function(err){
	        				kiss.exlog("saveBookingInfo","Loi select cln_appointment_calendar",err);
	        				kiss.rollback(req,function(){
	        					res.json({status:"fail"});
	        				})
	        			})
    				},function(err){
    					kiss.exlog("saveBookingInfo","Khong the thuc thi insert cln_appt_patients",err);
    					kiss.rollback(req,function(){
    						res.json({status:"fail"});
    					});
    				});
    			}
    			
    		},function(err){
    			kiss.exlog("saveBookingInfo","loi select cln_appt_patients",err);
    			kiss.rollback(req,function(){
    				res.json({status:'fail'});
    			});
    		})
    	},function(err){
    		kiss.exlog("saveBookingInfo","Loi khong the insert claim",err);
    		kiss.rollback(req,function(){
    			res.json({status:'fail'});
    		})
    	})

    },function(err){
    	kiss.exlog("saveBookingInfo","Loi khong the insert patient",err);
    	kiss.rollback(req,function(){
    		res.json({status:'fail'});
    	})
    });
}


/**
 * Thay doi lich kham chua benh, danh cho cac booking da dat roi nhung muon dat lai
 * Ham nay chi duoc goi boi mot ham co beginTransaction
 * tannv.dts@gmail.com
 */
var changeBookingCalendar=function(req,res)
{
    var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
    var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
	var actionInfo=kiss.checkData(req.body.actionInfo)?req.body.actionInfo:{};
	var oldCalId=kiss.checkData(actionInfo.oldCalId)?actionInfo.oldCalId:'';
	var newCalId=kiss.checkData(actionInfo.newCalId)?actionInfo.newCalId:'';
	var patientId=kiss.checkData(actionInfo.patientId)?actionInfo.patientId:'';
	var doctorId=kiss.checkData(actionInfo.doctorId)?actionInfo.doctorId:'';
	var siteId=kiss.checkData(actionInfo.siteId)?actionInfo.siteId:'';
	var appointmentDate=kiss.checkData(actionInfo.appointmentDate)?moment(new Date(actionInfo.appointmentDate)).format("YYYY/MM/DD HH:mm:ss"):null;
	var rlTypeId=kiss.checkData(actionInfo.rlTypeId)?actionInfo.rlTypeId:'';
	var specialtyId=kiss.checkData(actionInfo.specialtyId)?actionInfo.specialtyId:'';
	var bookingId=kiss.checkData(actionInfo.bookingId)?actionInfo.bookingId:'';
	var currentTime=kiss.getCurrentTimeStr();
	if(!kiss.checkListData(userId,oldCalId,newCalId,patientId,doctorId,siteId,
	appointmentDate,rlTypeId,specialtyId,bookingId))
	{
		kiss.exlog("changeAppointmentCalendar","Loi data truyen den");
		res.json({status:'fail'});
		return;
	}

	//Cancel booking
	var sql="SELECT * FROM `cln_appointment_calendar` WHERE `CAL_ID` = ?";
	kiss.executeQuery(req,sql,[oldCalId],function(rows){
		if(rows.length>0)
		{
			var sql="UPDATE `cln_appointment_calendar` SET ? WHERE `CAL_ID` = ?";
			var updateInfo={
				STATUS:rlobUtil.calendarStatus.noAppointment,
				NOTES:null
			}
			kiss.executeQuery(req,sql,[updateInfo,oldCalId],function(result){
				if(result.affectedRows>0)
				{
					var sql="DELETE FROM `cln_appt_patients` WHERE `Patient_id` = ? AND `CAL_ID` = ?";
					kiss.executeQuery(req,sql,[patientId,oldCalId],function(result){
						//Change booking
						var sql="UPDATE `cln_appointment_calendar` SET ? WHERE `CAL_ID` = ?";
						var updateInfo={
							STATUS:rlobUtil.calendarStatus.booked,
							NOTES:rlobUtil.sourceType.REDiLEGAL
						}
						kiss.executeQuery(req,sql,[updateInfo,newCalId],function(result){
							if(result.affectedRows>0)
							{
								var sql="INSERT INTO `cln_appt_patients` SET ?";
								var insertInfo={
									Patient_id:patientId,
									CAL_ID:newCalId,
									Created_by:userId,
									Creation_date:currentTime
								}
								kiss.executeQuery(req,sql,[insertInfo],function(result){
									//Cap nhat booking Info
									var sql="UPDATE `rl_bookings` booking SET ? WHERE booking.`BOOKING_ID`=? ";
									var updateInfo={
										CAL_ID:newCalId,
										DOCTOR_ID:doctorId,
										SITE_ID:siteId,
										APPOINTMENT_DATE:appointmentDate,
										RL_TYPE_ID:rlTypeId,
										SPECIALITY_ID:specialtyId,
										Last_updated_by:userId,
										Last_update_date:currentTime
									}
									kiss.executeQuery(req,sql,[updateInfo,bookingId],function(result){
										kiss.commit(req,function(){
											res.json({status:'success'});
										},function(err){
											kiss.exlog("changeAppointmentCalendar","Loi commit");
											res.json({status:'fail'});
										});
									},function(err){
										kiss.exlog("changeAppointmentCalendar","loi query cap nhat rl_bookings",err);
										kiss.rollback(req,function(){
											res.json({status:'fail'});
										});
									});
								},function(err){
									kiss.exlog("changeAppointmentCalendar","Khong insert duoc cln_appt_patients",err);
									kiss.rollback(req,function(){
										res.json({status:'fail'});
									})
								})
							}
							else
							{
								kiss.exlog("changeAppointmentCalendar","Khong co newCalendar duoc cap nhat");
								kiss.rollback(req,function(){
									res.json({status:'fail'});
								})
							}
						},function(err){
							kiss.exlog("changeAppointmentCalendar","Loi update newCalendar",err);
							kiss.rollback(req,function(){
								res.json({status:'fail'});
							})
						})
					},function(err){
						kiss.exlog("changeAppointmentCalendar","Loi delete thong tin cln_appt_patients",err);
						kiss.rollback(req,function(){
							res.json({status:'fail'});
						});
					})
				}
				else
				{
					kiss.exlog("changeAppointmentCalendar","Khong co oldCalendar nao duoc cap nhat");
					kiss.rollback(req,function(){
						res.json({status:'fail'});
					});
				}
			},function(err){
				kiss.exlog("changeAppointmentCalendar","Loi update oldCalendar status",err);
				kiss.rollback(req,function(){
					res.json({status:'fail'});
				});
			})

		}
	},function(err){
		kiss.exlog("changeAppointmentCalendar","Loi truy van lay thong  tin oldCalendar");
		res.json({status:'fail'});
	});

	
}

/**
 * xu ly dieu chinh fromtime va to time cua cac appointment calendar phia sau
 * tannv.dts@gmail.com
 */
var handlePeriodTimeAppointmentCalendar=function(req,res,functionNext)	
{
	
	var handlePeriodInfo=kiss.checkData(req.body.handlePeriodInfo)?req.body.handlePeriodInfo:{};
	var doctorId=kiss.checkData(handlePeriodInfo.doctorId)?handlePeriodInfo.doctorId:'';
	var siteId=kiss.checkData(handlePeriodInfo.siteId)?handlePeriodInfo.siteId:'';
	var selectedAppFromTime=kiss.checkData(handlePeriodInfo.selectedAppFromTime)?
						moment(new Date(handlePeriodInfo.selectedAppFromTime)).format("YYYY-MM-DD HH:mm:ss"):null;
	var selectedDate=kiss.checkData(handlePeriodInfo.selectedAppFromTime)?
				moment(new Date(handlePeriodInfo.selectedAppFromTime)).format("YYYY-MM-DD"):null;
	var rlTypeId=kiss.checkData(handlePeriodInfo.rlTypeId)?handlePeriodInfo.rlTypeId:'';
	var oldCalId=kiss.checkData(handlePeriodInfo.oldCalId)?handlePeriodInfo.oldCalId:-1;
	var periodTimeDefault=rlobUtil.periodTimeDefault;

	if(!kiss.checkListData(doctorId,siteId,selectedAppFromTime,rlTypeId))
	{
		kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi data truyen den");
		res.json({status:'fail'});
		return;
	}

	if(!rlobUtil.periodTimeOfRlType[rlTypeId])
	{
		kiss.exlog("handlePeriodTimeAppointmentCalendar","RL Type khong hop le!");
		res.json({status:'fail'});
		return;
	}
	//Thoi gian can thiet 
	var periodRequire=rlobUtil.periodTimeOfRlType[rlTypeId].value;
	//service REDiLEGAL id=7
	var serviceId = rlobUtil.redilegalServiceId;
	//Lay danh cac session, ke tu selectedSession, cac session nay phai thuoc redilegal
	//phai con trong va phai co periodTime>0 tuc la con thoi gian. 
	var sql=
		" SELECT calendar.*,MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) AS `PERIOD_TIME`   "+
		" FROM `cln_appointment_calendar` calendar                                                       "+
		" WHERE calendar.`DOCTOR_ID`=? AND calendar.`SITE_ID`=?                                          "+
		" 	AND MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) >0                             "+
		"   AND DATE(calendar.`FROM_TIME`)= ?                                                            "+
		" 	AND calendar.`FROM_TIME`>=?                                                                  "+
		" 	and (calendar.`NOTES` is null or calendar.CAL_ID =?)                                         "+
		" 	and calendar.`SERVICE_ID`=?                                                                  "+
		" ORDER BY calendar.FROM_TIME ASC                                                                ";

	kiss.beginTransaction(req,function(){
		kiss.executeQuery(req,sql,[doctorId,siteId,selectedDate,selectedAppFromTime,oldCalId,serviceId],function(data){
			if(data.length>0)
			{
				//selectedItem, day chinh la session duoc chon de booking
				var selectedItem=data[0];
				//khoang thoi gian cua selectedSession
	            var selectedItemPeriodTime=moment(new Date(selectedItem.TO_TIME)).diff(moment(new Date(selectedItem.FROM_TIME)),'minutes');
	            //Neu selectedSession co khoang thoi gian nho hon khoang default mac dinh
	            //thi khong duoc phep booking, chung nao bang hoac lon hon khoang thoi gian
	            //mac dinh thi moi duoc "xet" booking
	            if(selectedItemPeriodTime<periodTimeDefault)
	            {
	            	kiss.exlog("handlePeriodTimeAppointmentCalendar","selectedSession con qua it thoi gian, nho hon khoang thoi gian mac dinh");
	            	res.json({status:'fail'});
	            	return;
	            }
	            else
	            {
	            	//tinh xem do chenh lech cua selectedSession va khoang thoi gian can thiet
		            var periodLack=periodRequire-selectedItemPeriodTime;
		            //Neu selectedSession co khoang thoi gian lon hon khoang thoi gian can thiet
		            //thi duoc quyen booking ngay
		            //neu khong (selectedSession khong du khoang thoi gian) phai xem xet de dich chuyen thoi gian
		            if(periodLack>0)
		            {
		            	//mang Y nay se chua cac session bao bong selectedSession va cac session lien ke liep tiep
		            	//tat cac cac session phai trong va deu thuoc redilegal
		            	//qua trinh lay cac item cua i se duong lai khi
		            	//- Phat hien thay co session khong lien ke (do co mot booking chen ngang chang han)
		            	//- Khi co mot session khong toan ven ve khoang thoi gian, tuc co khoang thoi gian>0 nhung nho hon khoang thoi gian mac dinh
		                var listY=[];
		                //day selectedItem vao mang
		                listY.push(selectedItem);
		                var previousToTime=moment(new Date(selectedItem.TO_TIME));
		                for(var i=1;i<data.length;i++)
		                {
		                    var item=data[i];
		                    var fromTime=moment(new Date(item.FROM_TIME));
		                    //kiem tra tinh lien ke lien tiep cua cac sesssion
		                    if(fromTime.diff(previousToTime,'minutes')==0)
		                    {
		                        listY.push(item);
		                        previousToTime=moment(new Date(item.TO_TIME));
		                    }
		                    else
		                    {
		                        break;
		                    }
		                    //neu currentSession khong phai la mot session du (<default), ma la mot session thieu
		                    //thi ngung lai
		                    
		                    var periodTime=moment(new Date(item.TO_TIME)).diff(moment(new Date(item.FROM_TIME)),'minutes');
		                    if(periodTime<periodTimeDefault)
		                    {
		                    	break;
		                    }
		                    //hoac currentSession la mot session du(>default) thi cung ngung lai
		                    if(periodTime>periodTimeDefault)
		                    {
		                    	break;
		                    }
		                }

		                //Vi hien tai selectedSession khong du thoi gian
		                //nen phai can cac session lien ke de bu tru
		                //Neu khong co cac session lien ke de bu tru thi khong the booking
		                if(listY.length>1)
		                {
		                	var listChanged=[];
		                    //cong them khoang thoi gian thieu cho selectedSession
		                    listY[0].TO_TIME=moment(new Date(listY[0].TO_TIME)).add(periodLack,"minutes").toDate();
		                    listChanged.push(listY[0]);
		                    for(var i=1;i<listY.length;i++)
		                    {
		                        var item=listY[i];
		                        var periodTime=moment(new Date(item.TO_TIME)).diff(moment(new Date(item.FROM_TIME)),'minutes');
		                        //neu currentSession co khoang thoi gian lon hon khoang thoi gian mac dinh
		                        //thi ngung tai day va chi can cong FROM_TIME
		                        if(periodTime>periodTimeDefault)
		                        {
		                            item.FROM_TIME=moment(new Date(item.FROM_TIME)).add(periodLack,"minutes").toDate();
		                            listChanged.push(item);
		                            break;
		                        }
		                        else
		                        {
		                            item.FROM_TIME=moment(new Date(item.FROM_TIME)).add(periodLack,"minutes").toDate();
		                            //Neu la session cuoi cung trong mang thi khong dich chuyen TO_TIME nua
		                            //neu khong phai la session cuoi cung thi dich chuyen ca FROM_TIME va TO_TIME
		                            if(i<listY.length-1)
		                            	item.TO_TIME=moment(new Date(item.TO_TIME)).add(periodLack,"minutes").toDate();
		                            listChanged.push(item);
		                        }
		                    }

		                    function updateAppointmentCalendar(req,list,index)
		                    {
		                    	var item=list[index];
		                    	var sql="UPDATE `cln_appointment_calendar` SET ? WHERE CAL_ID=?";
		                    	var updateInfo={
		                    		FROM_TIME:moment(new Date(item.FROM_TIME)).format("YYYY/MM/DD HH:mm:ss"),
		                    		TO_TIME:moment(new Date(item.TO_TIME)).format("YYYY/MM/DD HH:mm:ss")
		                    	}
		                    	kiss.executeQuery(req,sql,[updateInfo,item.CAL_ID],function(result){
		                    		if(result.affectedRows>0)
		                    		{
		                    			if(index<list.length-1)
		                    			{
		                    				updateAppointmentCalendar(req,list,index+1);
		                    			}
		                    			else
		                    			{
		                    				req.body.list=list;
		                    				functionNext(req,res);
		                    				
		                    			}
		                    		}
		                    		else
		                    		{
		                    			kiss.exlog("handlePeriodTimeAppointmentCalendar","updateAppointmentCalendar -> khong co dong nao duoc doi");
		                    			kiss.rollback(req,function(){
			                    			res.json({status:'fail'});
			                    		})
		                    		}
		                    	},function(err)
		                    	{
		                    		kiss.exlog("handlePeriodTimeAppointmentCalendar","updateAppointmentCalendar-> loi khi chay cau update",err);
		                    		kiss.rollback(req,function(){
		                    			res.json({status:'fail'});
		                    		})
		                    	})
		                    }

		                    // for(var i=0;i<listChanged.length;i++)
		                    // {
		                    //     console.log(moment(new Date(listChanged[i].FROM_TIME)).format("HH:mm DD/MM/YYYY")+
		                    //         " "+moment(new Date(listChanged[i].TO_TIME)).format("HH:mm DD/MM/YYYY"));
		                    // }
		                    updateAppointmentCalendar(req,listChanged,0);
		                }
		                else
		                {
		                	kiss.exlog("handlePeriodTimeAppointmentCalendar","session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru");
		                	kiss.rollback(req,function(){
		                		res.json({status:'fail',msg:"session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru"});
		                	})
		                }
		            }
		            else
		            {
		            	kiss.exlog("handlePeriodTimeAppointmentCalendar","Co the booking voi this session vi session nay co du thoi gian");
		            	functionNext(req,res);
		            }
	            }
	            
			}
			else
			{
				kiss.exlog("handlePeriodTimeAppointmentCalendar","Khong the booking voi session nay; vi khong the lay duoc thong tin session");
				kiss.rollback(req,function(){
	        		res.json({status:'fail'});
	        	});
			}
		},function(err){
			kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi truy van, truy van lay cac session",err);
			kiss.rollback(req,function(){
	    		res.json({status:'fail'});
	    	})
		},true);
	},function(err){
		kiss.exlog("handlePeriodTimeAppointmentCalendar","Khong the mo transaction",err);
		res.json({status:'fail'});
	})
	
}

module.exports =
{
    

	//Kiem tra xem co the dung calendar nay de book lich kham hay khong
	//tannv.dts@gmail.com
	checkPeriodTimeToBooking:function(req,res)
	{
		// var bookingInfo=kiss.checkData(req.body.bookingInfo)?req.body.bookingInfo:{};
		// //xu ly dieu chinh fromtime va to time cua cac appointment calendar phia sau
		// var handlePeriodInfo={
		// 	doctorId:req.body.doctorId,
		// 	siteId:req.body.siteId,
		// 	selectedAppFromTime:req.body.selectedAppFromTime,
		// 	rlTypeId:req.body.rlTypeId
		// }

		var handlePeriodInfo=kiss.checkData(req.body.handlePeriodInfo)?req.body.handlePeriodInfo:{};
		//var handlePeriodInfo=kiss.checkData(req.body.handlePeriodInfo)?req.body.handlePeriodInfo:{};
		var doctorId=kiss.checkData(handlePeriodInfo.doctorId)?handlePeriodInfo.doctorId:'';
		var siteId=kiss.checkData(handlePeriodInfo.siteId)?handlePeriodInfo.siteId:'';
		var selectedAppFromTime=kiss.checkData(handlePeriodInfo.selectedAppFromTime)?
							moment(new Date(handlePeriodInfo.selectedAppFromTime)).format("YYYY-MM-DD HH:mm:ss"):null;
		var selectedDate=kiss.checkData(handlePeriodInfo.selectedAppFromTime)?
					moment(new Date(handlePeriodInfo.selectedAppFromTime)).format("YYYY-MM-DD"):null;
		var rlTypeId=kiss.checkData(handlePeriodInfo.rlTypeId)?handlePeriodInfo.rlTypeId:'';
		var oldCalId=kiss.checkData(handlePeriodInfo.oldCalId)?handlePeriodInfo.oldCalId:-1;
		var periodTimeDefault=rlobUtil.periodTimeDefault;
		if(!kiss.checkListData(doctorId,siteId,selectedAppFromTime,rlTypeId))
		{
			kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi data truyen den");
			res.json({status:'fail'});
			return;
		}

		if(!rlobUtil.periodTimeOfRlType[rlTypeId])
		{
			kiss.exlog("handlePeriodTimeAppointmentCalendar","RL Type khong hop le!");
			res.json({status:'fail'});
			return;
		}
		//Thoi gian can thiet 
		var periodRequire=rlobUtil.periodTimeOfRlType[rlTypeId].value;
		//service REDiLEGAL id=7
		var serviceId = rlobUtil.redilegalServiceId;
		//Lay danh cac session, ke tu selectedSession, cac session nay phai thuoc redilegal
		//phai con trong va phai co periodTime>0 tuc la con thoi gian. 
		var sql=
			" SELECT calendar.*,MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) AS `PERIOD_TIME`   "+
			" FROM `cln_appointment_calendar` calendar                                                       "+
			" WHERE calendar.`DOCTOR_ID`=? AND calendar.`SITE_ID`=?                                          "+
			" 	AND MINUTE(TIMEDIFF(calendar.`TO_TIME`,calendar.`FROM_TIME`)) >0                             "+
			"   AND DATE(calendar.`FROM_TIME`)= ?                                                            "+
			" 	AND calendar.`FROM_TIME`>=?                                                                  "+
			" 	and (calendar.`NOTES` is null OR calendar.CAL_ID=? )                                         "+
			" 	and calendar.`SERVICE_ID`=?                                                                  "+
			" ORDER BY calendar.FROM_TIME ASC                                                                ";
		kiss.executeQuery(req,sql,[doctorId,siteId,selectedDate,selectedAppFromTime,oldCalId,serviceId],function(data){
			if(data.length>0)
			{
				//selectedItem, day chinh la session duoc chon de booking
				var selectedItem=data[0];
				//khoang thoi gian cua selectedSession
	            var selectedItemPeriodTime=moment(new Date(selectedItem.TO_TIME)).diff(moment(new Date(selectedItem.FROM_TIME)),'minutes');
	            //Neu selectedSession co khoang thoi gian nho hon khoang default mac dinh
	            //thi khong duoc phep booking, chung nao bang hoac lon hon khoang thoi gian
	            //mac dinh thi moi duoc "xet" booking
	            if(selectedItemPeriodTime<periodTimeDefault)
	            {
	            	kiss.exlog("handlePeriodTimeAppointmentCalendar","selectedSession con qua it thoi gian, nho hon khoang thoi gian mac dinh");
	            	res.json({status:'fail'});
	            	return;
	            }
	            else
	            {
	            	//tinh xem do chenh lech cua selectedSession va khoang thoi gian can thiet
		            var periodLack=periodRequire-selectedItemPeriodTime;
		            //Neu selectedSession co khoang thoi gian lon hon khoang thoi gian can thiet
		            //thi duoc quyen booking ngay
		            //neu khong (selectedSession khong du khoang thoi gian) phai xem xet de dich chuyen thoi gian
		            if(periodLack>0)
		            {
		            	//mang Y nay se chua cac session bao bong selectedSession va cac session lien ke liep tiep
		            	//tat cac cac session phai trong va deu thuoc redilegal
		            	//qua trinh lay cac item cua i se duong lai khi
		            	//- Phat hien thay co session khong lien ke (do co mot booking chen ngang chang han)
		            	//- Khi co mot session khong toan ven ve khoang thoi gian, tuc co khoang thoi gian>0 nhung nho hon khoang thoi gian mac dinh
		                var listY=[];
		                //day selectedItem vao mang
		                listY.push(selectedItem);
		                var previousToTime=moment(new Date(selectedItem.TO_TIME));
		                for(var i=1;i<data.length;i++)
		                {
		                    var item=data[i];
		                    var fromTime=moment(new Date(item.FROM_TIME));
		                    //kiem tra tinh lien ke lien tiep cua cac sesssion
		                    if(fromTime.diff(previousToTime,'minutes')==0)
		                    {
		                        listY.push(item);
		                        previousToTime=moment(new Date(item.TO_TIME));
		                    }
		                    else
		                    {
		                        break;
		                    }
		                    //neu currentSession khong phai la mot session du (<default), ma la mot session thieu
		                    //thi ngung lai
		                    
		                    var periodTime=moment(new Date(item.TO_TIME)).diff(moment(new Date(item.FROM_TIME)),'minutes');
		                    if(periodTime<periodTimeDefault)
		                    {
		                    	break;
		                    }
		                    //hoac currentSession la mot session du(>default) thi cung ngung lai
		                    if(periodTime>periodTimeDefault)
		                    {
		                    	break;
		                    }
		                }

		                //Vi hien tai selectedSession khong du thoi gian
		                //nen phai can cac session lien ke de bu tru
		                //Neu khong co cac session lien ke de bu tru thi khong the booking
		                if(listY.length>1)
		                {
		                	kiss.exlog("checkPeriodTimeToBooking","selectedSession khong du, nhung co cac session lien ke nen co the booking");
		                	res.json({status:'success'});
		                }
		                else
		                {
		                	kiss.exlog("handlePeriodTimeAppointmentCalendar","session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru");
		                	res.json({status:'fail',msg:"session hien tai khong du thoi gian, nhung cung khong co session lien ke de bu tru"});
		                }
		            }
		            else
		            {
		            	kiss.exlog("handlePeriodTimeAppointmentCalendar","Co the booking voi this session vi session nay co du thoi gian");
		            	res.json({status:'success'});
		            }
	            }
			}
			else
			{
				kiss.exlog("handlePeriodTimeAppointmentCalendar","Khong the booking voi session nay; vi khong the lay duoc thong tin session");
				res.json({status:'fail'});
			}
		},function(err){
			kiss.exlog("handlePeriodTimeAppointmentCalendar","Loi truy van, truy van lay cac session",err);
			res.json({status:'fail'});
		},true);
	},

	/**
     * Xu ly save booking
     * tannv.dts@gmail.com
     */
	handleSaveBookingInfo:function(req,res)
	{
		var bookingInfo=kiss.checkData(req.body.bookingInfo)?req.body.bookingInfo:{};
		//xu ly dieu chinh fromtime va to time cua cac appointment calendar phia sau
		var handlePeriodInfo={
			doctorId:bookingInfo.DOCTOR_ID,
			siteId:bookingInfo.SITE_ID,
			selectedAppFromTime:bookingInfo.APPOINTMENT_DATE,
			rlTypeId:bookingInfo.RL_TYPE_ID,
			oldCalId:null
		}
		req.body.handlePeriodInfo=handlePeriodInfo;
		handlePeriodTimeAppointmentCalendar(req,res,saveBookingInfo);
	},

	/**
	 * Xu ly doi lich hen cua booking
	 * tannv.dts@gmail.com
	 */
	handleChangeBookingCalendar:function(req,res)
	{
		var actionInfo=kiss.checkData(req.body.actionInfo)?req.body.actionInfo:{};
		var handlePeriodInfo={
			doctorId:actionInfo.doctorId,
			siteId:actionInfo.siteId,
			selectedAppFromTime:actionInfo.appointmentDate,
			rlTypeId:actionInfo.rlTypeId,
			oldCalId:actionInfo.oldCalId
		}
		req.body.handlePeriodInfo=handlePeriodInfo;
		handlePeriodTimeAppointmentCalendar(req,res,changeBookingCalendar);
	}

}