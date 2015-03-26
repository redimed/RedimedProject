var db = require('../models');
var fs = require('fs');
var util = require("util");
var mime = require("mime");
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
                                category: s.category
                            })
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