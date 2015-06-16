var db = require('../models');
var fs = require('fs');
var util = require("util");
var mime = require("mime");
var mkdirp = require('mkdirp');
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;
var kiss=require('./kissUtilsController');
var errorCode=require('./errorCode');
var invoiceUtil=require('./invoiceUtilController');
var knex = require('../knex-connect.js');
var commonFunction =  require('../knex-function.js');

//tannv.dts@gmail.com
var controllerCode="RED_CONSULT";

module.exports = {

    getByIdProblem: function(req, res){

        var postData = req.body.consult_id;

        var sql = knex
        .column('cln_patient_consults.history',
        'cln_patient_consults.Creation_date',
        'cln_patient_consults.examination',
        'cln_patient_consults.treatment_plan',
        'cln_patient_consults.diagnosis',
        'cln_problems.Notes')
        .from('cln_patient_consults')
        .innerJoin('cln_problems', 'cln_patient_consults.problem_id', 'cln_problems.Problem_id')
        .where({'consult_id': postData})
        .toString();
        db.sequelize.query(sql)
        .success(function(data){
            res.json({data: data[0]});
        })
        .error(function(error){
            res.json({'status': 'error', 'message': error})
        })

    },

	getPatientProblem: function(req,res){
		var patientId = req.body.patient_id;

		db.Problem.findAll({where:{Patient_id: patientId}})
			.success(function(data){
				res.json({status:'success',data: data});
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

    uploadFile: function(req,res){
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder = prefix+'uploadFile\\'+'PatientID_'+req.body.patient_id;
        var targetFolderForSave='.\\uploadFile\\'+'PatientID_'+req.body.patient_id;
            mkdirp(targetFolder, function(err) {
                if(err) return err;

                var tmp_path = req.files.file.path;
                var target_path =targetFolder+"\\" + req.files.file.name;
                fs.rename(tmp_path, target_path, function(err) {
                    if (err) throw err;
                    fs.unlink(tmp_path, function() {
                        if (err) throw err;
                    });
                });

                db.UploadFile.max('id')
                    .success(function(max){
                         db.UploadFile.create({
                            id: max + 1,
                            fileName: req.files.file.name,
                            url: targetFolderForSave + "\\" + req.files.file.name
                        })
                            .success(function(data){
                                res.json({status:"success", id: data.values.id, fileName: data.values.fileName});
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

            });
    },

    downloadFile: function(req,res){
        var id = req.params.id;

        db.UploadFile.find({where:{id:id}},{raw:true})
            .success(function(data){
                if(data)
                {
                    if(data.url!=null || data.url!='')
                    {
                        var ex = fs.existsSync(data.url);

                        if(ex)
                            res.download(data.url);
                        else
                            res.json({status:'error'});
                    }
                }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },

    saveImage: function(req,res){
        var patient_id = req.body.patient_id;
        var imgData = req.body.imgData;

        var data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');

        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'uploadFile\\'+'Drawings\\'+'PatientID_'+patient_id;
        var targetFolderForSave='.\\uploadFile\\'+'Drawings\\'+'PatientID_'+patient_id;

        mkdirp(targetFolder, function (err) {
            if(err) return err;

            var date = moment();
            fs.writeFile(targetFolder+"\\image_"+date+".png", buf, function(err){
                if(err) res.json({'status':'error'});

                db.ClnPatientDrawing.max('id')
                    .success(function(max){
                        db.ClnPatientDrawing.create({
                            id: max + 1,
                            patient_id: patient_id,
                            url: targetFolderForSave+"\\image_"+date+".png"
                        })
                        .success(function(data){
                            res.json({status:'success', id: data.values.id })
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
            })
        })
    },

    getImage: function(req,res){
        var id = req.params.id;

        db.ClnPatientDrawing.find({where:{id:id}},{raw:true})
            .success(function(data){
                if(data)
                {
                    if(data.url!=null || data.url!='')
                        res.json({'status':'success', 'data':base64Image(data.url)});
                    else
                        res.json({'status':'error'});
                }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
    },

	getDrawTemplate: function(req,res){
		db.DrawingTemplate.findAll({raw:true})
			.success(function(data){
				res.json({status:'success', data: data});
			})
			.error(function(err){
				res.json({status:'error'});
				console.log(err);
			})
	},

	getTemplateImg: function(req,res){
		var id = req.params.id;

		db.DrawingTemplate.find({where: {id: id}}, {raw: true})
            .success(function(data){
              if(data)
              {
              	if(data.isFolder != 1 && (data.fileUrl!=null || data.fileUrl!=''))
              	{
                    res.json({'status':'success', 'data':base64Image(data.fileUrl)});
              	}
              	else
              	{
              		res.json({'status':'error'});
              	}
              }
            })
            .error(function(err){
                res.json({status:'error',error:err})
            })
	},

  submitConsult: function(req,res){
    var info = req.body.info;

    if(info.measurements.length > 0)
    {
        for(var i=0; i<info.measurements.length ; i++)
        {
            chainer.add(
                db.ClnPatientMeasurement.create(info.measurements[i])
            )
        }
    }
    if (info.consult_id) {
        db.ClnPatientConsult.update({
            patient_id: info.patient_id,
            problem_id: info.problem_id,
            cal_id: info.cal_id,
            history: info.history,
            examination: info.examination,
            treatment_plan: info.treatment,
            diagnosis: info.diagnosis
        }, {consult_id: info.consult_id}, {raw: true})
        .success(function(data){
            if(info.scripts.length > 0)
            {
                for(var i=0; i<info.scripts.length;i++)
                {
                    var s = info.scripts[i];
                    if(s.start_date) {
                        var start_date = s.start_date.split("/").reverse().join("-");
                    };
                    if(s.end_date) {
                        var end_date = s.end_date.split("/").reverse().join("-");
                    };
                    chainer.add(
                        db.ClnPatientMedication.create({
                            patient_id: info.patient_id,
                            consult_id: consultId,
                            medication_name: s.medication_name,
                            unit: s.unit,
                            qty: s.qty,
                            dose: s.dose,
                            frequency: s.frequency,
                            start_date : start_date,
                            end_date : end_date,
                            route : s.route,
                            doctor_id : s.doctor_id,
                            condition_Indication : s.condition_Indication
                        })
                    )
                }
            }

            if(info.images.length > 0)
            {
                for(var i=0; i<info.images.length;i++)
                {
                    chainer.add(
                        db.ClnPatientDrawing.update({
                            consult_id: info.consult_id
                        },{id: info.images[i]})
                    )
                }
            }

            chainer.runSerially().success(function(){
                res.json({status:'success',rs:data});
            }).error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
        })
        .error(function(err){
            res.json({status:'error'});
            console.log(err);
        })
    }else{
        db.ClnPatientConsult.max('consult_id')
          .success(function(max){
                var consultId = max + 1;
                db.ClnPatientConsult.create({
                    consult_id: consultId,
                    patient_id: info.patient_id,
                    problem_id: info.problem_id,
                    cal_id: info.cal_id,
                    history: info.history,
                    examination: info.examination,
                    treatment_plan: info.treatment,
                    diagnosis: info.diagnosis
                })
                .success(function(data){
                    if(info.scripts.length > 0)
                    {
                        for(var i=0; i<info.scripts.length;i++)
                        {
                            var s = info.scripts[i];
                            if(s.start_date) {
                                var start_date = s.start_date.split("/").reverse().join("-");
                            };
                            if(s.end_date) {
                                var end_date = s.end_date.split("/").reverse().join("-");
                            };
                            chainer.add(
                                db.ClnPatientMedication.create({
                                    patient_id: info.patient_id,
                                    consult_id: consultId,
                                    medication_name: s.medication_name,
                                    unit: s.unit,
                                    qty: s.qty,
                                    dose: s.dose,
                                    frequency: s.frequency,
                                    start_date : start_date,
                                    end_date : end_date,
                                    route : s.route,
                                    doctor_id : s.doctor_id,
                                    condition_Indication : s.condition_Indication
                                })
                            )
                        }
                    }

                    if(info.images.length > 0)
                    {
                        for(var i=0; i<info.images.length;i++)
                        {
                            chainer.add(
                                db.ClnPatientDrawing.update({
                                    consult_id: consultId
                                },{id: info.images[i]})
                            )
                        }
                    }

                    chainer.runSerially().success(function(){
                        res.json({status:'success',rs:data});
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
    };
  },

  /**
   * create by: unknown
   * modify by:tannv.dts@gmail.com
   */
  getPatientCompany: function(req,res){
    var fHeader="ConsultationController->getPatientCompany";
    var functionCode="FN002";
    var patient_id = req.body.patient_id;

    var info = {
        Company_name: null,
        Industry: null,
        Addr: null,
        users: []
    };

    db.sequelize.query("SELECT c.`Company_name`, c.`Industry`, c.`Addr` FROM companies c WHERE c.`id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?)",
                        null,{raw:true},[patient_id])
    .success(function(data)
    {
        if(data.length > 0)
        {
            info.Company_name = data[0].Company_name;
            info.Industry = data[0].Industry;
            info.Addr = data[0].Addr;

            db.sequelize.query("SELECT u.id, u.`user_name`, u.`Booking_Person`, u.`socket` "+
                                "FROM  users u "+
                                "WHERE u.`socket` IS NOT NULL AND u.`company_id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?)",
                                null,{raw:true},[patient_id])
            .success(function(rs)
            {
                info.users = rs;
                res.json({status:'success', info: info});
            })
            .error(function(err)
            {
                kiss.exlog(fHeader,"Loi truy van lay cac user trong cung cong ty",err);
                res.json({status:'error',error:errorCode.get(controllerCode,functionCode,'TN003')});
            })
        }
        else
        {
            kiss.exlog(fHeader,"Patient khong co thong tin company.");
            res.json({status:'success',info:null});
        }
    })
    .error(function(err)
    {
        kiss.exlog(fHeader,"Loi truy van lay thong tin company",err);
        res.json({status:'error',error:errorCode.get(controllerCode,functionCode,'TN002')});
    })
  },

    /**
     * tannv.dts@gmail.com
     * ----------------------------------------------------------------------
     * ----------------------------------------------------------------------
     * ----------------------------------------------------------------------
     */
    beforeStartSession:function(req,res)
    {
        var fHeader="ConsultationController->beforeStartSession";
        var functionCode="FN006";
        var doctorId=kiss.checkData(req.body.doctorId)?req.body.doctorId:'';
        if(!kiss.checkListData(doctorId))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,"TN001")});
            return;
        }
        var sql=
            " SELECT patient.*,calendar.`FROM_TIME`,apptPatient.appt_status,apptPatient.CAL_ID           "+
            " FROM `cln_appt_patients` apptPatient                                                       "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`   "+
            " INNER JOIN `cln_patients` patient ON `apptPatient`.`Patient_id`=patient.`Patient_id`       "+
            " WHERE calendar.`DOCTOR_ID`=? AND `apptPatient`.`appt_status`=?                             ";

        kiss.executeQuery(req,sql,[doctorId,invoiceUtil.apptStatus.workInProgress.value],function(rows){
            res.json({status:'success',data:rows});
        },function(err){
            kiss.exlog(fHeader,"Loi truy van select du lieu",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,"TN002")});
        },true);
    },

    startSession:function(req,res)
    {
        var fHeader="ConsultationController->startSession";
        var functionCode="FN001";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        var startSessionTime=kiss.checkData(postData.startSessionTime)?postData.startSessionTime:'';
        if(!kiss.checkListData(calId,patientId,startSessionTime))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql="UPDATE `cln_appt_patients` SET appt_status=?,SESSION_START_TIME=? WHERE `Patient_id`=? AND `CAL_ID`=? AND appt_status<>?";
        var params=[invoiceUtil.apptStatus.workInProgress.value,startSessionTime,patientId,calId,invoiceUtil.apptStatus.cancelled.value];
        kiss.executeQuery(req,sql,params,function(result){
            if(result.affectedRows>0)
            {
                res.json({status:'success'});
            }
            else
            {
                kiss.exlog(fHeader,"Khong co dong nao duoc update status");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,"Loi truy van cap nhat status",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
        },true)
    },

    /**
     * tannv.dts@gmail.com
     */
    beforeFinishSession:function(req,res)
    {
        fHeader="ConsultationController->beforeFinishSession";
        var functionCode="FN005";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        if(!kiss.checkListData(calId,patientId))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql=
            " SELECT apptItem.* FROM `cln_appt_items` apptItem                                  "+
            " WHERE apptItem.`cal_id`=? AND apptItem.`Patient_id`=? AND apptItem.`is_enable`=1  ";
        var params=[calId,patientId];
        kiss.executeQuery(req,sql,params,function(rows){
           res.json({status:'success',data:rows})
        },function(err){
            kiss.exlog(fHeader,"Loi truy van select cac item cua apptPatient",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
        });
    },

    /**
     * tannv.dts@gmail.com
     */
    finishSession:function(req,res)
    {
        fHeader="ConsultationController->finishSession";
        var functionCode="FN004";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        var endSessionTime=kiss.checkData(postData.endSessionTime)?postData.endSessionTime:'';
        if(!kiss.checkListData(calId,patientId,endSessionTime))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }

        var sql="UPDATE `cln_appt_patients` SET appt_status=?,SESSION_END_TIME=? WHERE `Patient_id`=? AND `CAL_ID`=? AND appt_status=?";
        var params=[invoiceUtil.apptStatus.completed.value,endSessionTime,patientId,calId,invoiceUtil.apptStatus.workInProgress.value];
        kiss.executeQuery(req,sql,params,function(result){
            if(result.affectedRows>0)
            {
                res.json({status:'success'});
            }
            else
            {
                kiss.exlog(fHeader,"Khong co dong nao duoc update status");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,"Loi truy van cap nhat status",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
        },true)
    },

    /**
     * Lay thong tin patient tuong ung voi calendar id
     * tannv.dts@gmail.com
     */
    getApptPatient:function(req,res)
    {
        var fHeader="PatientConsultController->getApptPatient";
        var functionCode="FN003";
        var postData=kiss.checkData(req.body.data)?req.body.data:{};
        var calId=kiss.checkData(postData.calId)?postData.calId:'';
        var patientId=kiss.checkData(postData.patientId)?postData.patientId:'';
        if(!kiss.checkListData(calId,patientId))
        {
            kiss.exlog(fHeader,"Loi data truyen den");
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN001')});
            return;
        }
        var sql=
            " SELECT `apptPatient`.*,calendar.`DOCTOR_ID`                                               "+
            " FROM `cln_appt_patients` apptPatient                                                      "+
            " INNER JOIN `cln_appointment_calendar` calendar ON apptPatient.`CAL_ID`=calendar.`CAL_ID`  "+
            " WHERE apptPatient.`Patient_id`=? AND apptPatient.`CAL_ID`=? AND apptPatient.`appt_status`<>?; ";
        var params=[patientId,calId,invoiceUtil.apptStatus.cancelled.value];
        kiss.executeQuery(req,sql,params,function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows[0]});
            }
            else
            {
                kiss.exlog(fHeader,"Thong tin appt patient khong ton tai");
                res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN002')});
            }
        },function(err){
            kiss.exlog(fHeader,"Loi truy van lay appt patient.",err);
            res.json({status:'fail',error:errorCode.get(controllerCode,functionCode,'TN003')});
        },true);

    },
    /**
     * get list consultation of patient
     * pahnquocchien.c1109g@gmail.com@gmail.com
     */
    getListConsultOfPatient:function(req,res)
    {
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        if(!kiss.checkListData(patientId))
        {
            kiss.exlog("getListConsultOfPatient Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT consult.*,problem.`Notes` FROM `cln_patient_consults` consult               "+
            " LEFT JOIN `cln_problems` problem ON consult.`problem_id` = problem.`Problem_id`    "+
            " WHERE consult.`patient_id` = ?                                                     ";
        kiss.executeQuery(req,sql,patientId,function(rows){
            if(rows.length>0)
            {
                res.json({status:'success',data:rows});
            }
            else
            {
                res.json({status:'fail'});
            }
        })
    },
    /*
    * phanquocchien.c1109g@gmail.com
    * check consultation
    */
   checkConsultation:function(req,res){
        var patientId=kiss.checkData(req.body.patient_id)?req.body.patient_id:'';
        var calId=kiss.checkData(req.body.cal_id)?req.body.cal_id:'';
        if(!kiss.checkListData(patientId,calId))
        {
            kiss.exlog("checkConsultation Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql=
            " SELECT * FROM `cln_patient_consults` WHERE `patient_id` = ? AND `cal_id` = ? ";
        kiss.executeQuery(req,sql,[patientId,calId],function(rows){
            if(rows.length>0)
            {
                res.json({status:'update',data:rows[0]});
            }
            else
            {
                res.json({status:'insert'});
            }
        })
   }
}

function base64Image(src) {
    try
    {
        var srcImage;
        var data;
        var ex = fs.existsSync(src);

        if(ex)
            srcImage = src;
        else
            srcImage = "./uploadFile/no-image.png";

        data = fs.readFileSync(srcImage).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(srcImage), data);
    }
    catch(err){
        if (err.code !== 'ENOENT')
            return null;
    }
}

