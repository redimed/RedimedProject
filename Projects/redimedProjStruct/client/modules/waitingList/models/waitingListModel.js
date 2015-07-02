angular.module('app.loggedIn.waitingList')

.factory('WaitingListModel', function(Restangular){
	var mainModel = {};
	var mainApi = Restangular.all('api/meditek/v1/waitingList');

	mainModel.add = function(data){
		var instanceApi = mainApi.all('add');
		return instanceApi.post({data: data});
	}

	mainModel.list = function(data){
		var instanceApi = mainApi.all('list');
		return instanceApi.post({data: data});
	}

	mainModel.remove = function(data){
		var instanceApi = mainApi.all('remove');
		return instanceApi.post({data: data});
	}

	return mainModel;
})