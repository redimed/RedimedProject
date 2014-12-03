/**
 * Created by Phan Quoc Chien on 01/12/2014.
 */

angular.module('app.loggedIn.rlob.adminBookingMessages.controller',[])
    .controller("rlob_admin_bookingMessagesController", function($scope,rlobService,toastr) {
        $scope.editMessageContent = '';
        //$scope.messageContent = '';
        rlobService.getListBookingMessages().then(function(data){
            $scope.ListBookingMessages = data;
        });
        $scope.showModalAddNew = function(){
            $("#addNewModal").modal('show');
        }
        $scope.submitAddNewMessage = function(){
            rlobService.addNewBookingMessages($scope.messageContent).then(function(data){
                if(data.status == 'success')
                {
                    rlobService.getListBookingMessages().then(function(data){
                        $scope.ListBookingMessages = data;
                    });
                    $scope.messageContent='';
                    $("#addNewModal").modal('hide');
                    toastr.success("Add Message Successfully!","Success");
                }
                else
                {
                    $("#addNewModal").modal('hide');
                    toastr.error("Add Message Failed!","Error");
                }
            });
        }
        $scope.changeIsenableBookingMessage = function(ID){
            rlobService.changeIsenableMessage(ID).then(function(data){
                if(data.status == 'success')
                {
                    rlobService.getListBookingMessages().then(function(data){
                        $scope.ListBookingMessages = data;
                        //$scope.messageContent='';
                    });
                    toastr.success("Delete Successfully!","Success");
                }
                else
                {
                    toastr.error("Delete Failed!","Error");
                }
            });
        }
        $scope.editBookingMessage = function(ID,CONTENTS){
            $scope.editMessageID = ID;
            $scope.editMessageContent = CONTENTS;
            $("#editModal").modal('show');
        }
        $scope.submitEditMessage = function(){
            rlobService.updateBookingMessage($scope.editMessageID,$scope.editMessageContent).then(function(data){
                if(data.status == 'success')
                {
                    rlobService.getListBookingMessages().then(function(data){
                        $scope.ListBookingMessages = data;
                        //$scope.messageContent='';
                    });
                    $("#editModal").modal('hide');
                    toastr.success("Edit Successfully!","Success");
                }
                else
                {
                    $("#editModal").modal('hide');
                    toastr.error("Edit Failed!","Error");
                }
            });
        }
    });
