
angular.module('app.loggedIn.iso.isoApproverListController.controller',[])
    .controller("isoApproverListController", function($scope,$http,$state,$window,$cookieStore,toastr,isoService) {
       var msgPopup=isoMsg.popup;
        $scope.approverList= {};
        /**
         * voducgiap
         * Select full list approver
         * [getApproverList description]
         * @return {[type]} [description]
         */
          $scope.getApproverList = function(){
                isoService.isoApprover.getApproverList().then(function(data){
                        if(data.status=='success'){
                            $scope.approverList = data.data;
                        }
                        
                });
          }
          $scope.getApproverList();
 
          /**
           * voducgiap
           * insert new user to approver list
           * [showSelectionAdminUserName description]
           * @type {Boolean}
           */
          $scope.addNewUserToApproverList = function(){
              $("#iso-approver-list-popup").modal({show:true,backdrop:'static'});
               $scope.showSelectionAdminUserName=true;
          }
          
          $scope.showSelectionAdminUserName=false;
          $scope.newAdminUserName={};
                $scope.$watchCollection('newAdminUserName',function(newval,oldval){    
                    if($scope.newAdminUserName && $scope.newAdminUserName.user_name)
                    {
                        isoService.isoApprover.insertNewUserToApprover(newval.id).then(function(data){
                            if(data.status=='success'){
                              msgPopup("Add New User To Approver",isoConst.msgPopupType.success,"Add New User Success");
                               $scope.getApproverList();
                               
                            }else{
                              msgPopup("Add New User To Approver",isoConst.msgPopupType.error,"Add New User Error");
                            }
                            $("#iso-approver-list-popup").modal('hide');
                        })
                    }

          });
          /**
           * voducgiap
           * [changeEnable description]
           * @param  {[type]} id     [description]
           * @param  {[type]} enable [description]
           * @return {[type]}        [description]
           */
          $scope.changeEnable = function(id,enable){
             isoService.isoApprover.updateEnableApprover(id,enable).then(function(data){
                if(data.status=='success'){
                  msgPopup("Update Enable Approver",isoConst.msgPopupType.success,"Update Enable Approver Success");
        
                }else{
                  msgPopup("Update Enable Approver",isoConst.msgPopupType.error,"Update Enable Approver Error");
                }
             })
          }
    });