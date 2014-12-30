angular.module('app.loggedIn.isoSubmitStatusPendingController.controller',[])
    .controller("isoSubmitStatusPendingController", function($scope,$http,$state,$window,$cookieStore,FileUploader,toastr,isoService) {
            $scope.checkInOutStatusPending = {};

            isoService.checkOutIn.getAllOutInStatusPending().then(function(data){
                $scope.checkInOutStatusPending = data.data;

            })

            $scope.approved = function(id,node_id){
                var info = {
                    ID:id,
                    status:isoConst.submitStatus.approved,
                    Node_ID:node_id
                }

                isoService.checkOutIn.approvedAndReject(info).then(function(data){

                    if(data.status =='success'){

                        toastr.success('Approved Success');
                        $state.go('loggedIn.isoSubmitStatusPending',null,{reload:true});
                    }else{
                        toastr.error('Approved Error');
                    }
                })
            }
            $scope.rejects = function(id,node_id){
                var info = {
                    ID:id,
                    status:isoConst.submitStatus.reject,
                    Node_ID:node_id
                }

                isoService.checkOutIn.approvedAndReject(info).then(function(data){
                    if(data.status =='success'){
                        toastr.success('Reject Success');
                        $state.go('loggedIn.isoSubmitStatusPending',null,{reload:true});
                    }else{
                        toastr.error('Reject Error');
                    }
                })
            }

        $scope.downloadFile = function(id,fileName){
          var info = {
              Node_ID : id,
              File_Name: fileName
          }

            isoService.checkOutIn.dowloadFile(info).then(function(){

            })

        }




    })