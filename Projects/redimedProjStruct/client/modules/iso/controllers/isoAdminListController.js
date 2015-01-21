angular.module('app.loggedIn.iso.isoAdminController.controller',[])
    .controller("isoAdminController", function($scope,$http,$state,$window,$cookieStore,toastr,isoService) {      
        var msgPopup=isoMsg.popup;
        $scope.adminList= {};
        /**
         * voducgiap
         * Select full list approver
         * [getApproverList description]
         * @return {[type]} [description]
         */
          $scope.getAdminList = function(){
                isoService.isoAdmin.getAdminList().then(function(data){
                        if(data.status=='success'){
                            $scope.adminList = data.data;
                        }
                });
          }
          $scope.getAdminList();
 
          /*/**
           * voducgiap
           * insert new user to approver list
           * [showSelectionAdminUserName description]
           * @type {Boolean}
           */
          $scope.newAdminUserName={};
          $scope.addNewUserToAdminList = function(){
              $("#iso-admin-insert-list-popup").modal({show:true,backdrop:'static'});
               $scope.newAdminUserName={};
          }

          $scope.addAdmin = function(id,role){
          	console.log(id);
          	console.log(role);
          	if (id && role) {
          		console.log("aaaaaaaaaa");
          		isoService.isoAdmin.insertNewUserToAdmin(id,role).then(function(data){
					if(data.status=='success'){
	                  msgPopup("Add New User To Admin",isoConst.msgPopupType.success,"Add New User Success");
	                   $scope.getAdminList();
	                }else{
	                  msgPopup("Add New User To Admin",isoConst.msgPopupType.error,"Add New User Error");
	                }
	                $("#iso-admin-insert-list-popup").modal('hide');
	            })
          	}else{
          		msgPopup("Add New User To Admin",isoConst.msgPopupType.error,"Add New User Error");
          		$("#iso-admin-insert-list-popup").modal('hide');
          	}
          }

          $scope.editAdmin = function(info){
          	console.log(info);
          	console.log(info.ISENABLE);
          	$scope.newAdminUserName.user_name = info.user_name;
          	$scope.idAdmin = info.ADMIN_ID;
          	$scope.roleAdmin = info.ROLE;
          	$scope.enableAdmin = info.ISENABLE;
          	console.log($scope.idAdmin);
          	// console.log(info.ISENABLE);
            $("#iso-admin-edit-list-popup").modal({show:true,backdrop:'static'});
          }
          $scope.updateAdmin = function(adId,idAdminNew,adRole,adEnable){
          	console.log(adId);
          	console.log(adRole);
          	console.log(adEnable);
            $scope.enableAdmin = adEnable;
          	if (adId && adRole) {
          		// console.log("bbbbbbb");
          		isoService.isoAdmin.updateEnableAdmin(adId,idAdminNew,adRole,adEnable).then(function(data){
					if(data.status=='success'){
						console.log("okokokok");
					  $("#iso-admin-edit-list-popup").modal('hide');
	                  msgPopup("Edit User To Admin",isoConst.msgPopupType.success,"Edit User Success");
	                  $scope.getAdminList();
	                }else{
	                  msgPopup("Edit User To Admin",isoConst.msgPopupType.error,"Edit User Error");
	                }
	                $("#iso-admin-edit-list-popup").modal('hide');
	                $scope.newAdminUserName={};
	            })
          	}else{
          		msgPopup("EDit User To Admin",isoConst.msgPopupType.error,"Add New User Error");
          		$("#iso-admin-edit-list-popup").modal('hide');
          	}
	        
          }
    })

