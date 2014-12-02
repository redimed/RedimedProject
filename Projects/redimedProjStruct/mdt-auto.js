var os = require('os');

module.exports = {
	contentRouteController: function(module_name){
		var controller = module_name+"Controller";
		var text = os.EOL+"var "+controller+" = require('./controllers/"+controller+"');"+os.EOL+os.EOL;

		text += "app.post('/api/meditek/v1/"+module_name.toLowerCase()+"/search', "+controller+".postSearch);"+os.EOL;
		text += "app.post('/api/meditek/v1/"+module_name.toLowerCase()+"/add', "+controller+".postAdd);"+os.EOL;
		text += "app.post('/api/meditek/v1/"+module_name.toLowerCase()+"/edit', "+controller+".postEdit);"+os.EOL;
		text += "app.post('/api/meditek/v1/"+module_name.toLowerCase()+"/byId', "+controller+".postById);"+os.EOL;
		return text;
	},
	contentFileController: function(module_name){
		var text_first = "var db = require('../models');"+os.EOL
						+"var mdt_functions = require('../mdt-functions.js');"+os.EOL+os.EOL
						+"module.exports = {"+os.EOL;

		var text_add = "\tpostAdd: function(req, res){"+os.EOL
						+"\t\tvar postData = req.body.add_data;"+os.EOL+os.EOL
						+"\t\tdb."+module_name+".create(postData)"+os.EOL
						+"\t\t.success(function(created){"+os.EOL
						+"\t\t\tif(!created) res.json(500, {'status': 'error', 'message': 'Cannot Insert'});"+os.EOL
						+"\t\t\tres.json({'status': 'success', 'data': created});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t\t.error(function(error){"+os.EOL
						+"\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t},"+os.EOL;

		var text_edit = "\tpostEdit: function(req, res){"+os.EOL
						+"\t\tvar postData = req.body.edit_data;"+os.EOL
						+"\t\tvar edit_id = req.body.edit_id;"+os.EOL+os.EOL
						+"\t\tdb."+module_name+".find(edit_id)"+os.EOL
						+"\t\t.success(function(detail){"+os.EOL
						+"\t\t\tif(!detail) res.json(500, {'status': 'error', 'message': 'Id Missing !!!'});"+os.EOL
						+"\t\t\tdetail.updateAttributes(postData).success(function(updated){"+os.EOL
						+"\t\t\t\tres.json({'status': 'success', 'data': updated});"+os.EOL
						+"\t\t\t})"+os.EOL
						+"\t\t\t.error(function(error){"+os.EOL
						+"\t\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t\t})"+os.EOL
						+"\t\t})"+os.EOL
						+"\t\t.error(function(error){"+os.EOL
						+"\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t},"+os.EOL;

		var text_delete = "\tpostDelete: function(req, res){"+os.EOL
						+"\t\tvar delete_id = req.body.delete_id;"+os.EOL+os.EOL
						+"\t\tdb."+module_name+".find(delete_id)"+os.EOL
						+"\t\t.success(function(detail){"+os.EOL
						+"\t\t\tif(!detail) res.json(500, {'status': 'error', 'message': 'Id Missing !!!'});"+os.EOL
						+"\t\t\tdetail.destroy().success(function(deleted){"+os.EOL
						+"\t\t\t\tres.json({'status': 'success', 'data': deleted});"+os.EOL
						+"\t\t\t})"+os.EOL
						+"\t\t\t.error(function(error){"+os.EOL
						+"\t\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t\t})"+os.EOL
						+"\t\t})"+os.EOL
						+"\t\t.error(function(error){"+os.EOL
						+"\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t},"+os.EOL;

		var text_by_id = "\tpostById: function(req, res){"+os.EOL
						+"\t\tvar detail_id = req.body.detail_id;"+os.EOL+os.EOL
						+"\t\tdb."+module_name+".find(detail_id)"+os.EOL
						+"\t\t.success(function(detail){"+os.EOL
						+"\t\t\tif(!detail) res.json(500, {'status': 'error', 'message': 'Cannot Get Detail'});"+os.EOL
						+"\t\t\tres.json({'status': 'success', 'data': detail});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t\t.error(function(error){"+os.EOL
						+"\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t},"+os.EOL;

		var text_search = "\tpostSearch: function(req, res){"+os.EOL
						+"\t\tvar pagination = req.body.pagination;"+os.EOL
						+"\t\tvar post_fields = req.body.filters;"+os.EOL
						+"\t\tvar select = req.body.select;"+os.EOL+os.EOL
						+"\t\tvar sql = mdt_functions.commonSearch(post_fields);"+os.EOL+os.EOL
						+"\t\tdb."+module_name+".findAndCountAll({"+os.EOL
						+"\t\t\twhere: [sql],"+os.EOL
						+"\t\t\toffset: pagination.offset,"+os.EOL
						+"\t\t\tlimit: pagination.limit,"+os.EOL
						+"\t\t\tattributes: select,"+os.EOL
						+"\t\t\torder: 'Creation_date DESC'"+os.EOL
						+"\t\t})"+os.EOL
						+"\t\t.success(function(result){"+os.EOL
						+"\t\t\tif(!result) res.json(500, {'status': 'error', 'message': 'Cannot Get Search'});"+os.EOL
						+"\t\t\tres.json({'status': 'success', 'data': result.rows, 'count': result.count});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t\t.error(function(error){"+os.EOL
						+"\t\t\tres.json(500, {'status': 'error', 'message': error});"+os.EOL
						+"\t\t})"+os.EOL
						+"\t},"+os.EOL;

		var text_last = "}";

		return text_first+text_add+text_edit+text_delete+text_by_id+text_search+text_last;
	},

	contentFileModel: function(module_name, table_name, fields){
		var text_first = "module.exports = function(sequelize, DataTypes){"+os.EOL
						+"\t var "+module_name+" = sequelize.define('"+module_name+"', {";

		var text_middle = os.EOL;
		for(var i = 0; i < fields.length; i++){
			var type = fields[i].Type.split('(');
			var num = (type[1])?parseInt(type[1]):0;

			var type_field = "";
			
			switch(type[0]){
				case 'int':
					type_field = 'INTEGER(';
					if(num != 0) type_field += num+')';
					else type_field += ')';
					break;
				case 'varchar':
					type_field = 'STRING(';
					if(num != 0) type_field += num+')';
					else type_field += ')';
					break;
				case 'datetime':
					type_field = 'DATE';
					break;
				case 'text':
					type_field = 'TEXT';
					break;
			}

			if(fields[i].Key == 'PRI' && fields[i].Extra == "auto_increment"){
				text_middle += "\t\t"+fields[i].Field+": {"+os.EOL
								+"\t\t\ttype: DataTypes."+type_field+","+os.EOL
								+"\t\t\tprimaryKey: true,"+os.EOL
								+"\t\t\tautoIncrement: true"+os.EOL
								+"\t\t},"+os.EOL;
			}else
				text_middle += "\t\t"+fields[i].Field+": DataTypes."+type_field+","+os.EOL;
		}

		text_middle += "\t}, {"+os.EOL
						+"\t\ttableName: '"+table_name+"',"+os.EOL
						+"\t\tcreatedAt: 'Creation_date',"+os.EOL
						+"\t\tupdatedAt: 'Last_update_date'"+os.EOL;

		var text_last = "\t});"+os.EOL+os.EOL+"\treturn "+module_name+";"+os.EOL+"}";

		return text_first+text_middle+text_last;
	},//end contentFileModel

	contentClientFileMain: function(module_name){
		var text = "angular.module('app.loggedIn."+module_name.toLowerCase()+"', ["+os.EOL
					+"\t'app.loggedIn."+module_name.toLowerCase()+".directives',"+os.EOL
					+"\t'app.loggedIn."+module_name.toLowerCase()+".services'"+os.EOL
					+"])";
		return text;
	},

	contentClientFileLoggedIn: function(module_name){
		var text = os.EOL+"\t'app.loggedIn."+module_name.toLowerCase()+"',"+os.EOL;
		return text;
	},

	contentClientFileDirectives: function(module_name){
		var text = "angular.module('app.loggedIn."+module_name.toLowerCase()+".directives', ["+os.EOL
					+"\t'app.loggedIn."+module_name.toLowerCase()+".detail.directive',"+os.EOL
					+"\t'app.loggedIn."+module_name.toLowerCase()+".search.directive'"+os.EOL
					+"])";
		return text;	
	},

	contentClientFileDetailDirective: function(module_name){
		var text = "angular.module('app.loggedIn."+module_name.toLowerCase()+".detail.directive', [])"+os.EOL+os.EOL;
		text += ".directive('"+module_name.toLowerCase()+"Detail', function("+module_name+"Model, ConfigService, "+module_name+"Service, toastr){"+os.EOL;
		text += "\treturn {"+os.EOL;
		text += "\t\trestrict: 'EA',"+os.EOL;
		text += "\t\tscope: {"+os.EOL;
		text += "\t\t\toptions: '=',"+os.EOL;
		text += "\t\t\tparams: '='"+os.EOL;
		text += "\t\t},"+os.EOL;
		text += "\t\ttemplateUrl: 'modules/"+module_name.toLowerCase()+"/directives/templates/detail.html',"+os.EOL;
		text += "\t\tlink: function(scope, element, attrs){"+os.EOL;
		text += "\t\t\tvar init = function(){"+os.EOL;
		text += "\t\t\t\tscope.isSubmit = false;"+os.EOL;

		text += "\t\t\t\t\tif(scope.params.permission.edit === true){"+os.EOL;
		text += "\t\t\t\t\t\t"+module_name+"Service.byId(scope.params.id).then(function(response){"+os.EOL;
		text += "\t\t\t\t\t\t\tif(response.status == 'error') toastr.error('Error Get Detail', 'Error')"+os.EOL;
		text += "\t\t\t\t\t\t\tangular.extend(scope."+module_name+"Map, response.data);"+os.EOL;
		text += "\t\t\t\t\t\t\tfor(var key in scope."+module_name+"Map){"+os.EOL;
		text += "\t\t\t\t\t\t\t\tif(scope."+module_name+"Map[key]){"+os.EOL;
		text += "\t\t\t\t\t\t\t\t\tif(key.indexOf('is') != -1 || key.indexOf('Is') != -1 || key.indexOf('IS') != -1)"+os.EOL;
		text += "\t\t\t\t\t\t\t\t\t\tscope."+module_name+"Map[key] = scope."+module_name+"Map[key].toString();"+os.EOL;
		text += "\t\t\t\t\t\t\t\t\tif(key.indexOf('date') != -1 || key.indexOf('Date') != -1 || key.indexOf('DATE') != -1)"+os.EOL;
		text += "\t\t\t\t\t\t\t\t\t\tscope."+module_name+"Map[key] = new Date(scope."+module_name+"Map[key]);"+os.EOL;
		text += "\t\t\t\t\t\t\t\t}"+os.EOL;
		text += "\t\t\t\t\t\t\t}//end for"+os.EOL;
		text += "\t\t\t\t\t\t})"+os.EOL;
		text += "\t\t\t\t\t}"+os.EOL;

		text += "\t\t\t\tscope."+module_name+"Map = angular.copy("+module_name+"Model);"+os.EOL;
		text += "\t\t\t}//end init"+os.EOL;
		text += "\t\t\tinit();"+os.EOL+os.EOL;
		text += "\t\t\tscope.clickAction = function(){"+os.EOL;
		text += "\t\t\t\tscope.isSubmit = true;"+os.EOL;
		text += "\t\t\t\tif(!scope."+module_name.toLowerCase()+"Form.$invalid){"+os.EOL;
		text += "\t\t\t\t\tvar postData = angular.copy(scope."+module_name+"Map);"+os.EOL;
		text += "\t\t\t\t\tfor(var key in postData){"+os.EOL;
		text += "\t\t\t\t\t\tif(postData[key] instanceof Date) postData[key] = ConfigService.getCommonDate(postData[key]);"+os.EOL;
		text += "\t\t\t\t\t}//end for"+os.EOL;
		
		//EDIT
		text += "\t\t\t\t\tif(scope.params.permission.edit === true){"+os.EOL;
		text += "\t\t\t\t\t\t"+module_name+"Service.edit(scope.params.id, postData).then(function(response){"+os.EOL;
		text += "\t\t\t\t\t\t\tif(response.status == 'error') toastr.error('Error Get Detail', 'Error')"+os.EOL;
		text += "\t\t\t\t\t\t\tinit();"+os.EOL;
		text += "\t\t\t\t\t\t\ttoastr.success('Edit Successfully !!!', 'Success');"+os.EOL;
		text += "\t\t\t\t\t\t})"+os.EOL;
		//END EDIT

		//ADD
		text += "\t\t\t\t\t}else{"+os.EOL;
		text += "\t\t\t\t\t\t"+module_name+"Service.add(postData).then(function(data){"+os.EOL;
		text += "\t\t\t\t\t\t\tif(data.status == 'error') toastr.error('Cannot Insert', 'Error')"+os.EOL;
		text += "\t\t\t\t\t\t\ttoastr.success('Insert Successfully !!!', 'Success');"+os.EOL;
		text += "\t\t\t\t\t\t\tinit();"+os.EOL;
		text += "\t\t\t\t\t\t})"+os.EOL;
		text += "\t\t\t\t\t\tinit();"+os.EOL;
		text += "\t\t\t\t\t\}"+os.EOL;
		//END ADD

		text += "\t\t\t\t}//end if invalid"+os.EOL;
		text += "\t\t\t\telse toastr.error('You got some fields left', 'Error')"+os.EOL;
		text += "\t\t\t}//end clickAction"+os.EOL;
		text += "\t\t}//end link"+os.EOL;
		text += "\t}//end return"+os.EOL;
		text += "})";	
		return text;
	},

	contentClientFileSearchDirective: function(module_name, fields){
		var text = "angular.module('app.loggedIn."+module_name.toLowerCase()+".search.directive', [])";

		text += ".directive('"+module_name.toLowerCase()+"Search', function("+module_name+"Service, toastr){"+os.EOL;
		text += "\treturn {"+os.EOL;
		text += "\t\trestrict: 'EA',"+os.EOL;
		text += "\t\tscope: {"+os.EOL;
		text += "\t\t\tclickRow: '=',"+os.EOL;
		text += "\t\t},"+os.EOL;
		text += "\t\ttemplateUrl: 'modules/"+module_name.toLowerCase()+"/directives/templates/search.html',"+os.EOL;
		text += "\t\tlink: function(scope, element, attrs){"+os.EOL;
		
		text += "\t\t\tvar init = function(){"+os.EOL;
		text += "\t\t\t\tscope.list = {};"+os.EOL;
		text += "\t\t\t\tscope.params = {"+os.EOL;
		text += "\t\t\t\t\tpagination: {"+os.EOL;
		text += "\t\t\t\t\t\tlimit: 5,"+os.EOL;
		text += "\t\t\t\t\t\toffset: 0,"+os.EOL;
		text += "\t\t\t\t\t\tcurrent_page: 1,"+os.EOL;
		text += "\t\t\t\t\t\tmax_size: 3"+os.EOL;
		text += "\t\t\t\t\t},"+os.EOL;
		text += "\t\t\t\t\tfilters: ["+os.EOL;
		text += "\t\t\t\t\t\t{type: 'text', name: '"+fields[1].Field+"', value:''},"+os.EOL;
		text += "\t\t\t\t\t\t{type: 'text', name: '"+fields[2].Field+"', value:''},"+os.EOL;
		text += "\t\t\t\t\t\t{type: 'text', name: '"+fields[3].Field+"', value:''}"+os.EOL;
		text += "\t\t\t\t\t],"+os.EOL;
		text += "\t\t\t\t\tselect: ["+os.EOL;
		text += "\t\t\t\t\t\t'"+fields[1].Field+"', '"+fields[2].Field+"', '"+fields[3].Field+"'"+os.EOL;
		text += "\t\t\t\t\t]"+os.EOL;
		text += "\t\t\t\t}"+os.EOL;
		text += "\t\t\t}//end init"+os.EOL;

		text += "\t\t\tvar loadList = function(){"+os.EOL;
		text += "\t\t\t\t"+module_name+"Service.search(scope.params).then(function(response){"+os.EOL;
		text += "\t\t\t\t\tif(response.status==='error') toastr.error('Cannot get Seacrh', 'Error')"+os.EOL;
		text += "\t\t\t\t\tscope.list = response;"+os.EOL;
		text += "\t\t\t\t})"+os.EOL;
		text += "\t\t\t}"+os.EOL;

		text += "\t\t\tinit();"+os.EOL;
		text += "\t\t\tloadList();"+os.EOL;
		text += "\t\t\tscope.setPage = function(){"+os.EOL;
		text += "\t\t\t\tscope.params.pagination.offset = (scope.params.pagination.current_page-1)*scope.params.pagination.limit;"+os.EOL;
		text += "\t\t\t\tloadList();"+os.EOL;
		text += "\t\t\t}"+os.EOL;
		
		text += "\t\t}//end link"+os.EOL;
		text += "\t}//end return"+os.EOL;
		text += "})";

		return text;
	},

	contentClientFileDetailView: function(module_name, fields){
		var text = '<form name="'+module_name.toLowerCase()+'Form" novalidate>'+os.EOL;
		text += '<!--ACTION-->'+os.EOL;
		text += '<div class="row" style="margin-bottom: 15px;">'+os.EOL;
		text += '\t<div class="col-md-2 col-sm-3 col-xs-6">'+os.EOL;
		text += '\t\t<button class="btn btn-sm btn-block green" ng-click="clickAction()" ng-show="params.permission.create">'+os.EOL;
		text += '\t\t\t<i class="fa fa-plus"></i>'+os.EOL;
		text += '\t\t</button>'+os.EOL;
		text += '\t\t<button class="btn btn-sm btn-block green" ng-click="clickAction()" ng-show="params.permission.edit">'+os.EOL;
		text += '\t\t\t<i class="fa fa-pencil"></i>'+os.EOL;
		text += '\t\t</button>'+os.EOL;
		text += '\t</div>'+os.EOL;
		text += '</div>'+os.EOL;
		text += '<!--END ACTION -->'+os.EOL+os.EOL;

		text += '<div class="row">'+os.EOL+os.EOL;
		for(var i = 0; i < fields.length; i++){
			var type = fields[i].Type.split('(');
			var num = (type[1])?parseInt(type[1]):0;

			var value = "";
			var placeholder = fields[i].Field.replace(/_/g, " ");
			placeholder = placeholder.toLowerCase();
			placeholder = placeholder.substr(0, 1).toUpperCase() + placeholder.substr(1);
			
			switch(type[0]){
				case 'int':
					value = '<input type="number" placeholder="'+placeholder+'" name="'+fields[i].Field.toLowerCase()+'" ng-model="'+module_name+'Map.'+fields[i].Field+'" class="form-control" id="'+fields[i].Field.toLowerCase()+'" float-label>'+os.EOL;
					break;
				case 'varchar':
					value = '<input type="text" placeholder="'+placeholder+'" name="'+fields[i].Field.toLowerCase()+'" ng-model="'+module_name+'Map.'+fields[i].Field+'" class="form-control" id="'+fields[i].Field.toLowerCase()+'" float-label>'+os.EOL;
					break;
				case 'datetime':
					value = '<input readonly ui-date="{dateFormat: \'dd/mm/yy\'}" placeholder="'+placeholder+'" name="'+fields[i].Field.toLowerCase()+'" ng-model="'+module_name+'Map.'+fields[i].Field+'" class="form-control" id="'+fields[i].Field.toLowerCase()+'" float-label>'+os.EOL;
					break;
				case 'text':
					value = '<input type="text" placeholder="'+placeholder+'" name="'+fields[i].Field.toLowerCase()+'" ng-model="'+module_name+'Map.'+fields[i].Field+'" class="form-control" id="'+fields[i].Field.toLowerCase()+'" float-label>'+os.EOL;
					break;
			}

			if(fields[i].Key != 'PRI' && fields[i].Field != 'Created_by' && fields[i].Field != 'Last_update_date' && fields[i].Field != 'Creation_date' && fields[i].Field != 'Last_updated_by'){
				text += '\t<!--'+fields[i].Field+'-->'+os.EOL;
				text += '\t<div class="col-md-4 col-sm-6 col-xs-12">'+os.EOL;
				if(fields[i].Field.indexOf("is") === -1 && fields[i].Field.indexOf("Is") === -1 && fields[i].Field.indexOf("IS") === -1){
					text += '\t\t<span class="field">'+os.EOL;
					text += '\t\t\t<label for="'+fields[i].Field.toLowerCase()+'">'+placeholder+'</label>'+os.EOL;
					text += '\t\t\t'+value;
					text += '\t\t</span>';
				}else{
					text += '\t\t<input type="checkbox" name="'+fields[i].Field.toLowerCase()+'" id="'+fields[i].Field.toLowerCase()+'" class="mdt-checkbox" ng-model="'+module_name+'Map.'+fields[i].Field+'" ng-true-value="1" ng-false-value="0">'+os.EOL;
					text += '\t\t<label for="'+fields[i].Field.toLowerCase()+'">'+placeholder+'</label>'+os.EOL;
				}
				text += '\t</div>'+os.EOL;
				text += '\t<!--'+fields[i].Field+'-->'+os.EOL+os.EOL;

				if(i % 3 === 0){
					text += os.EOL+'\t<div class="break-row"></div>'+os.EOL;
				}
			}//end if
		}
		text += '</div>'+os.EOL;

		text += '</form>';
		return text;
	},

	contentClientFileSearchView: function(module_name, fields){
		var text = "<div class='row'>"+os.EOL;
		text += "\t<div class='col-md-10'>"+os.EOL;
		text += "\t\t<pagination boundary-links='true' total-items='list.count' ng-model='params.pagination.current_page' class='pagination-sm' previous-text='&lsaquo;' next-text='&rsaquo;' first-text='&laquo;' last-text='&raquo;' items-per-page='params.pagination.limit' max-size='params.pagination.max_size' ng-change='setPage()'>"+os.EOL;
		text += "\t\t</pagination>"+os.EOL;
		text += "\t</div>"+os.EOL;
		text += "</div>"+os.EOL;

		text = "<div class='row'>"+os.EOL;
		text += "\t<div class='col-md-12'>"+os.EOL;
		text += "\t\t<table class='mdt-table'>"+os.EOL;
		text += "\t\t\t<thead>"+os.EOL;
		text += "\t\t\t\t<tr>"+os.EOL;
		text += "\t\t\t\t\t<th>"+fields[1].Field+"</th>"+os.EOL;
		text += "\t\t\t\t\t<th>"+fields[2].Field+"</th>"+os.EOL;
		text += "\t\t\t\t</tr>"+os.EOL;
		text += "\t\t\t</thead>"+os.EOL;
		text += "\t\t\t<tbody>"+os.EOL;
		text += "\t\t\t\t<tr ng-repeat='l in list.data' ng-click='clickRow({row: l})' style='cursor: pointer;'>"+os.EOL;
		text += "\t\t\t\t\t<td>{{l."+fields[1].Field+"}}</th>"+os.EOL;
		text += "\t\t\t\t\t<td>{{l."+fields[2].Field+"}}</th>"+os.EOL;
		text += "\t\t\t\t</tr>"+os.EOL;
		text += "\t\t\t</tbody>"+os.EOL;		
		text += "\t\t</table>"+os.EOL;
		text += "\t</div>"+os.EOL;
		text += "</div>"+os.EOL;
		return text;
	},

	contentClientFileIndex: function(module_name){
		var temp = "\t<script type='text/javascript' src='modules/"+module_name.toLowerCase()+"/"+module_name+".js'></script>"+os.EOL;
		temp += "\t<script type='text/javascript' src='modules/"+module_name.toLowerCase()+"/services/"+module_name+"Services.js'></script>"+os.EOL;
		temp += "\t<script type='text/javascript' src='modules/"+module_name.toLowerCase()+"/directives/"+module_name+"Directives.js'></script>"+os.EOL;
		temp += "\t<script type='text/javascript' src='modules/"+module_name.toLowerCase()+"/directives/"+module_name+"DetailDirective.js'></script>"+os.EOL;
		temp += "\t<script type='text/javascript' src='modules/"+module_name.toLowerCase()+"/directives/"+module_name+"SearchDirective.js'></script>";
		var text = os.EOL+temp+os.EOL;
		return text;
	},

	contentClientFileService: function(module_name){
		var text = "angular.module('app.loggedIn."+module_name.toLowerCase()+".services', [])"+os.EOL+os.EOL;
		text += ".factory('"+module_name+"Service', function(Restangular){"+os.EOL;
		text += "\tvar mdtService = {}"+os.EOL;
		text += "\tvar mdtApi = Restangular.all('api/meditek/v1/"+module_name.toLowerCase()+"/')"+os.EOL+os.EOL;
		//ADD
		text += "\tmdtService.add = function(postData){"+os.EOL;
		text += "\t\tvar funcApi = mdtApi.all('add');"+os.EOL;
		text += "\t\treturn funcApi.post({add_data: postData});"+os.EOL;
		text += "\t}"+os.EOL;
		//END ADD

		//EDIT
		text += "\tmdtService.edit = function(id, postData){"+os.EOL;
		text += "\t\tvar funcApi = mdtApi.all('edit');"+os.EOL;
		text += "\t\treturn funcApi.post({edit_data: postData, edit_id: id});"+os.EOL;
		text += "\t}"+os.EOL;
		//END EDIT

		//BY ID
		text += "\tmdtService.byId = function(id){"+os.EOL;
		text += "\t\tvar funcApi = mdtApi.all('byId');"+os.EOL;
		text += "\t\treturn funcApi.post({detail_id: id});"+os.EOL;
		text += "\t}"+os.EOL;
		//END BY ID

		//SEARCH
		text += "\tmdtService.search = function(option){"+os.EOL;
		text += "\t\tvar funcApi = mdtApi.all('search');"+os.EOL;
		text += "\t\treturn funcApi.post(option);"+os.EOL;
		text += "\t}"+os.EOL;
		//END SEARCH		

		text += "\treturn mdtService;"+os.EOL;
		text += "})";

		return text;
	},

	contentClientFileModel: function(module_name, fields){
		var text_first = os.EOL+".value('"+module_name+"Model', {"+os.EOL;

		var text_middle = "";
		for(var i = 0; i < fields.length; i++){
			var type = fields[i].Type.split('(');
			var num = (type[1])?parseInt(type[1]):0;

			var value = "";
			
			switch(type[0]){
				case 'int':
					value = null;
					break;
				case 'varchar':
					value = "";
					break;
				case 'datetime':
					value = null;
					break;
				case 'text':
					value = "";
					break;
			}

			if(fields[i].Key != 'PRI'){
				if(value === '')
					text_middle += "\t"+fields[i].Field+": '',"+os.EOL;
				else
					text_middle += "\t"+fields[i].Field+": null,"+os.EOL;
			}
		}
		var text_last = "})";

		return text_first+text_middle+text_last;
	}//end contentClientFileModel
}