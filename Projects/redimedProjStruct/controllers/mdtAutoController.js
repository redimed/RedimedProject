var db = require('../models');
var mdt_functions = require('../mdt-functions.js');
var auto_functions = require('../mdt-auto.js');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = {
	postModule: function(req, res){
		var table_name = req.query.tname;
		var module_name = req.query.mname;

		db.sequelize.query("SHOW COLUMNS FROM "+table_name)
		.success(function(result){


			// SERVER

			/* MODEL */
			var model_string = auto_functions.contentFileModel(module_name, table_name, result);
			var model_file = "models/"+module_name+".js";

			fs.writeFile(model_file, model_string, encoding='utf-8', function(error){
				if(error) {
					res.json(500, {"status": "error", "message": "File "+model_file+" cannot create !!!"});
				}
			});
			/* END MODEL */

			/* CONTROLLER */
			var controller_string = auto_functions.contentFileController(module_name);
			var controller_file = "controllers/"+module_name+"Controller.js";

			fs.writeFile(controller_file, controller_string, encoding='utf-8', function(error){
				if(error) {
					res.json(500, {"status": "error", "message": "File "+controller_file+" cannot create !!!"});
				}
			});
			/* END CONTROLLER */

			/* ROUTES */
			fs.readFile("routes/mdt_route.js", "utf-8", function(err, data){
				if(err) throw err;
				var content = data;
				var appendStr = auto_functions.contentRouteController(module_name);
				var index = content.indexOf("/*AUTO CREATE*/");

				content = mdt_functions.appendString(content, appendStr, index+15, 0);

				fs.writeFile("routes/mdt_route.js", content, 'utf-8', function(error){
					if(error) {
						res.json(500, {"status": "error", "message": "File routes/mdt_route.js cannot override !!!"});
					}
				})
			})
			/* END ROUTES */

			// END SERVER


			//CLIENT
			
			/* MAIN MODULES */
			var module_folder = "client/modules/"+module_name.toLowerCase();
			var module_main_file = module_folder+"/"+module_name+".js";

			fs.exists(module_folder, function(exists){
				if(exists){
					res.json(500, {"status": "error", "message": "Folder "+module_folder+" existed !!!"});
				}else{
					// CREATE MAIN FOLDER
					mkdirp(module_folder, function(err){
						if(err) res.json(500, {"status": "error", "message": "Folder "+module_folder+" cannot created !!!"});

						mkdirp(module_folder+"/services", function(err){
							if(err) res.json(500, {"status": "error", "message": "Folder "+module_folder+"/services cannot created !!!"});

							var service_content = auto_functions.contentClientFileService(module_name);

							fs.writeFile(module_folder+"/services/"+module_name+"Services.js", service_content, function(error){
								if(error) res.json(500, {"status": "error", "message": "File "+module_folder+"/services/"+module_name+".Services.js cannot create !!!"});
							})
						})

						mkdirp(module_folder+"/directives", function(err){
							if(err) res.json(500, {"status": "error", "message": "Folder "+module_folder+"/directives cannot created !!!"});

							var directive_content = auto_functions.contentClientFileDirectives(module_name);

							fs.writeFile(module_folder+"/directives/"+module_name+"Directives.js", directive_content, function(error){
								if(error) res.json(500, {"status": "error", "message": "File "+module_folder+"/directives/"+module_name+".Directives.js cannot create !!!"});
							})

							var directive_detail_content = auto_functions.contentClientFileDetailDirective(module_name);
							fs.writeFile(module_folder+"/directives/"+module_name+"DetailDirective.js", directive_detail_content, function(error){
								if(error) res.json(500, {"status": "error", "message": "File "+module_folder+"/directives/"+module_name+".DetailDirective.js cannot create !!!"});
							})

							var directive_search_content = auto_functions.contentClientFileSearchDirective(module_name, result);
							fs.writeFile(module_folder+"/directives/"+module_name+"SearchDirective.js", directive_search_content, function(error){
								if(error) res.json(500, {"status": "error", "message": "File "+module_folder+"/directives/"+module_name+".SearchDirective.js cannot create !!!"});
							})

							var template_folder = module_folder+"/directives/templates";
							mkdirp(template_folder, function(err){
								if(err) res.json(500, {"status": "error", "message": "Folder "+template_folder+"/directives cannot created !!!"});

								var directive_detail_view = auto_functions.contentClientFileDetailView(module_name, result);
								fs.writeFile(template_folder+"/detail.html", directive_detail_view, function(error){
									if(error) res.json(500, {"status": "error", "message": "File "+template_folder+"/detail.html cannot create !!!"});
								})

								var directive_search_view = auto_functions.contentClientFileSearchView(module_name, result);
								fs.writeFile(template_folder+"/search.html", directive_search_view, function(error){
									if(error) res.json(500, {"status": "error", "message": "File "+template_folder+"/search.html cannot create !!!"});
								})
							})
						})

						var content = auto_functions.contentClientFileMain(module_name);

						fs.writeFile(module_main_file, content, encoding='utf-8', function(error){
							if(error) {
								res.json(500, {"status": "error", "message": "File "+module_main_file+" cannot create !!!"});
							}

							//OVERRIDE LOGGEDIN.JS
							fs.readFile("client/modules/loggedIn.js", "utf-8", function(err, data){
								if(err) throw err;
								var content = data;
								var appendStr = auto_functions.contentClientFileLoggedIn(module_name);
								var index = content.indexOf("/*AUTO CREATE*/");

								content = mdt_functions.appendString(content, appendStr, index+15, 0);

								fs.writeFile("client/modules/loggedIn.js", content, 'utf-8', function(error){
									if(error) {
										res.json(500, {"status": "error", "message": "File client/modules/loggedIn.js cannot override !!!"});
									}
								})
							})
							//END OVERRIDE LOGGEDIN.JS

							//OVERRIDE INDEX.JS
							fs.readFile("client/index.html", "utf-8", function(err, data){
								if(err) throw err;
								var content = data;
								var appendStr = auto_functions.contentClientFileIndex(module_name);
								var index = content.indexOf("<!--AUTO CREATE-->");

								content = mdt_functions.appendString(content, appendStr, index+18, 0);

								fs.writeFile("client/index.html", content, 'utf-8', function(error){
									if(error) {
										res.json(500, {"status": "error", "message": "File client/index.html cannot override !!!"});
									}
								})
							})
							//END OVERRIDE INDEX.JS

							//OVERRIDE MODEL.JS
							fs.readFile("client/common/models/Model.js", "utf-8", function(err, data){
								if(err) throw err;
								var content = data;
								var appendStr = auto_functions.contentClientFileModel(module_name, result);
								var index = content.indexOf("/*AUTO CREATE*/");

								content = mdt_functions.appendString(content, appendStr, index+15, 0);

								fs.writeFile("client/common/models/Model.js", content, 'utf-8', function(error){
									if(error) {
										res.json(500, {"status": "error", "message": "File client/common/models/Model.js cannot override !!!"});
									}
								})
							})
							//END OVERRIDE MODEL.JS
						});
					});
					// END CREATE MAIN FOLDER
				}
			});
			/* END MAIN MODULES */

			//END CLIENT
			//res.json({"status": "success", "data": result});
		})
		.error(function(error){
			res.json(500, {"status": "error", "message": error});
		})
	}//end postModule
}