angular.module("app.loggedIn.consult.services",[])
	.factory("ConsultationService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");

		return services;
	})