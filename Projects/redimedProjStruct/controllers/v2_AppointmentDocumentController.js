var db = require('../models');
var mdt_functions = require('../mdt-functions.js');


var fs = require('fs');
var mkdirp = require('mkdirp');

var general_process = function(req, res) {


}

module.exports = {

    postSearch: function(req, res){
		var limit = (req.body.limit) ? req.body.limit : 10;
        var offset = (req.body.offset) ? req.body.offset : 0;
		var fields = req.body.fields;
		var search_data = req.body.search;
		console.log('this is search data', search_data);
		var whereOpt = {};
		whereOpt.patient_id = search_data.patient_id;
		if(!!search_data.document_name){
			whereOpt.document_name = {
				like: search_data.document_name + '%'
			}
		}

		db.AppointmentDocument.findAndCountAll({
            include:[
                {
                    model:db.Appointment, as:'Appointment',
                    attributes:['FROM_TIME'],
                }
            ],
			where: whereOpt,
			offset: offset,
			limit: limit,
			attributes: fields,
			order: 'cal_id DESC'
		}).success(function(result){
			res.json({"status": "success", "list": result.rows, "count": result.count});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		});
	},
	uploadUpload: function (req, res ) {
		var patient_id = req.body.patient_id;
		var cal_id = req.body.cal_id;

		// PROCESS FILE
		var UPLOAD_FOLDER = db.AppointmentDocument.getUploadPath(patient_id, cal_id);



		var server_name =  Date.now() +'-'+req.files.file.name ;
		var document_name = req.files.file.name;
		var tmp_path = req.files.file.path;
		var target_path = UPLOAD_FOLDER + server_name; 


		mkdirp(UPLOAD_FOLDER, function (err) {
		    if (err) console.error(err);
			fs.rename(tmp_path, target_path, function(err) {
	            if (err) res.json(500,{'status':'error'});
	            fs.unlink(tmp_path, function() { // delete 
	                if (err){ 
	                 	console.log(err)
	                 	res.json(500,{'status':'error'});
	                }
	    	        //PROCESS DATABASE
					var insertData = {
						patient_id: patient_id,
						cal_id: cal_id,
						document_path: UPLOAD_FOLDER,
						document_name: document_name,
						server_name: server_name
					};
					db.AppointmentDocument.create(insertData)
			           .success(function (created) {
			        		res.json({'status':'success', 'data':created});
			           })
			           .error(function(err){
			           		res.json(500,{'status':'error', 'error':err});
			           })
					//END PROCESS DATABASE
	           

	            });
	        });
		});
		// END PROCESS FILE
	},

	postDelete: function(req, res){
		var id = req.body.ID;

		db.AppointmentDocument.find(id)
            .success(function (data) {
            	if(!!data){
					//DELETE FILE PROGRESS
	                var filePath = data.document_path + data.server_name;
	                fs.unlink(filePath, function(err){
	                	if(err){
	                		res.json(500,{
	                			'status': 'error',
	                			'message': err
	                		})
	                	}
	                	else{
	                		//DELETE FROM DATABASE
	                		data.destroy().on('success',function(){
	                			res.json({
	                				'status':'success'
	                			});
	                		})
	                		//END DELETE FROM DATABASE
	                		
	                	}
	                })
	                //END DELETE FILE PROGRESS
            	}

            	else{
            		res.json(500, {
	                    "status": "error",
	                    "message": "Unexpected Error"
                	});
            	}
                
            })
            .error(function (error) {
                res.json(500, {
                    "status": "error",
                    "message": error
                });
            });
	},

	getDownload: function(req,res){
		var id = req.query.id;

		db.AppointmentDocument.find(id).success(function(data){
			if(!data){
				res.json(500,{'status':'error', 'error':'error'});
				return;
			}

			 var path=data.document_path+data.server_name;
			    res.download(path,function(err){
			    	console.log(err);
			    });

		})
		.error(function(err){
			res.json(500,{'status':'error', 'error':err});
		 })
	}
}