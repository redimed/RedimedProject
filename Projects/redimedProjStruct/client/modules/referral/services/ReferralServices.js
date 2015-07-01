angular.module('app.loggedIn.referral')
.factory('ReferralService', function(Restangular){
	var mdtService = {}
	var mdtApi = Restangular.all('api/erm/')

	mdtService.referralInsert = function(postData){
		var detailApi = mdtApi.all('v2/referral/insert');
		return detailApi.post(postData);
	};
    mdtService.referralDetail = function(postData){
		var detailApi = mdtApi.all('v2/referral/detail');
		return detailApi.post({ID: postData});
	};
    mdtService.referralUpdate = function(postData){
		var detailApi = mdtApi.all('v2/referral/update');
		return detailApi.post(postData);
	}


	return mdtService;
})