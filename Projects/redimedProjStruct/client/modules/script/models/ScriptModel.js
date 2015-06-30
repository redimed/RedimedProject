angular.module('app.loggedIn.script.model', [])

.factory('ScriptModel', function (Restangular){

	var mainModel = {};
	var mainApi = Restangular.all('api/meditek/v1/script/');

	mainModel.list = function(data){
		var instanceApi = mainApi.all('list');
		return instanceApi.post({data: data});
	}
	mainModel.add = function(data){
		var instanceApi = mainApi.all('add');
		return instanceApi.post({data: data});
	}
	mainModel.edit = function(data){
		var instanceApi = mainApi.all('edit');
		return instanceApi.post({data: data});
	}
	mainModel.remove = function(data){
		var instanceApi = mainApi.all('remove');
		return instanceApi.post({data: data});
	}
	mainModel.byid = function(data){
		var instanceApi = mainApi.all('byid');
		return instanceApi.post({data: data});
	}
	mainModel.postDisable = function(data){
		var instanceApi = mainApi.all('disable');
		return instanceApi.post({data: data});
	}
	mainModel.postSing = function(data){
		var instanceApi = mainApi.all('signature');
		return instanceApi.post({data: data});
	}
	mainModel.postScriptHead = function(data){
		var instanceApi = mainApi.all('addScriptHead');
		return instanceApi.post({data: data});
	}
	mainModel.listpostHead = function(data, datar){
		var instanceApi = mainApi.all('listscriptHead');
		return instanceApi.post({data: data, datar: datar});
	}
	mainModel.editHead = function(data, datar){
		var instanceApi = mainApi.all('editcriptHead');
		return instanceApi.post({data: data, datar: datar});
	}
	/*mainModel.updatepostHead = function(data){
		var instanceApi = mainApi.all('updatescriptHead');
		return instanceApi.post({data: data});
	}
	mainModel.removepostHead = function(data){
		var instanceApi = mainApi.all('removescriptHead');
		return instanceApi.post({data: data});
	}*/
	/*mainModel.postID = function(data){
		var instanceApi = mainApi.all('scriptHead');
		return instanceApi.post({data: data});
	}*/
	return mainModel;

});
