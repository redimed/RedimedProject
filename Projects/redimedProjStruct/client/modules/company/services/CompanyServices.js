angular.module("app.loggedIn.company.services", [])

.factory("CompanyService", function(Restangular){
	var companyService = {};
	var companyApi = Restangular.all("api");
	return companyService;
})