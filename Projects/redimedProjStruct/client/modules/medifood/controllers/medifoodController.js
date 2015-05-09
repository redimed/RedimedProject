angular.module('app.loggedIn.medifood.controller',[])
    .controller("medifoodController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval,medifoodService) {
		medifoodService.core.createSession()
    	.then(function(data){
    		if(data.status=='success')
    		{
    			$scope.dataCenter={
    				SESSION_CODE:data.data.SESSION_CODE,
                    SESSION_STATUS:data.data.STATUS
    			}
    		}
    		else
    		{
    			alert("Create session error.");
    		}
    	},function(err){
    		alert("Create session error.");
    	});

        $scope.actionCenter={};
});	