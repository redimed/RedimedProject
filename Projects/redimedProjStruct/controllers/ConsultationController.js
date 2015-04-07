var db = require('../models');
var fs = require('fs');
var util = require("util");
var mime = require("mime");
var mkdirp = require('mkdirp');
var moment = require('moment');
var chainer = new db.Sequelize.Utils.QueryChainer;

module.exports = {
	getPatientProblem: function(req,res){
		var patientId = req.body.patient_id;

		db.ClnPatientProblem.findAll({where:{patient_id: patientId}})
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
                            url: targetFolderForSave + "\\" + req.files.file.name
                        })
                            .success(function(data){
                                res.json({status:"success", id: data.values.id});
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

    mobileDownloadFile: function(req,res){
        var id = req.params.id;

        db.UploadFile.find({where:{id:id}},{raw:true})
            .success(function(data){
                if(data)
                {
                    if(data.url!=null || data.url!='')
                    {
                        var ex = fs.existsSync(data.url);

                        if(ex)
                            res.sendfile(data.url);
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
            .success(function(){
                if(info.scripts.length > 0)
                {
                    for(var i=0; i<info.scripts.length;i++)
                    {
                        var s = info.scripts[i];
                        chainer.add(
                            db.ClnPatientMedication.create({
                                patient_id: info.patient_id,
                                consult_id: consultId,
                                medication_name: s.medication,
                                strength: s.strength,
                                form: s.form,
                                qty: s.qty,
                                code: s.code,
                                script: s.script,
                                dose: s.dose,
                                frequency: s.frequency,
                                instructions: s.instructions,
                                repeat: s.repeat,
                                reason: s.reason,
                                category: s.category,
                                price: s.price
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
  },

  getPatientCompany: function(req,res){
    var patient_id = req.body.patient_id;

    var info = {
        Company_name: null,
        Industry: null,
        Addr: null,
        users: []
    };

    db.sequelize.query("SELECT c.`Company_name`, c.`Industry`, c.`Addr` FROM companies c WHERE c.`id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?)",
                        null,{raw:true},[patient_id])
        .success(function(data){
            if(data.length > 0)
            {
                info.Company_name = data[0].Company_name;
                info.Industry = data[0].Industry;
                info.Addr = data[0].Addr;

                db.sequelize.query("SELECT u.id, u.`user_name`, u.`Booking_Person`, u.`socket` "+
                                    "FROM  users u "+
                                    "WHERE u.`socket` IS NOT NULL AND u.`company_id` = (SELECT p.`company_id` FROM cln_patients p WHERE p.`Patient_id` = ?)",
                                    null,{raw:true},[patient_id])
                    .success(function(rs){
                        info.users = rs;
                        res.json({status:'success', info: info});
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