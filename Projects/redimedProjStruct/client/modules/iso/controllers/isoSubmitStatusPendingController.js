
angular.module('app.loggedIn.isoSubmitStatusPendingController.controller',[])
    .controller("isoSubmitStatusPendingController", function($scope,$http,$state,$window,$cookieStore,FileUploader,toastr,isoService) {
            /**
             * Kiem tra xem user dang nhap co quyen approval hay khong
             * neu khong co quyen thi khong duoc truy cap page
             * tannv.dts@gmail.com
             */
            isoService.checkOutIn.checkCanAccessApprovalPage()
            .then(function(data){
                if(data.status!='success')
                {
                    $state.go("loggedIn.iso.main");
                }
            },function(err){
                $state.go("loggedIn.iso.main");
            });
            $scope.checkInOutStatusPending = {};
            var msgPopup=isoMsg.popup;
            var getAllOutInStatusPending = function(){
                $scope.currentPage=1;
                $scope.handleListPaging();
            };
            $scope.handleListPaging = function(){
                //get count sum item in database
                isoService.checkOutIn.countOutIn().then(function(data){
                    if(data.status == 'success'){
                        $scope.totalItems=data.data[0].SumData;
                        $scope.itemsPerPage=5;
                        $scope.maxSize=7;
                        //get item with current page and itemperpage
                        isoService.checkOutIn.getAllOutInStatusPending($scope.currentPage,$scope.itemsPerPage).then(function(data){
                            if(data.status=='success'){
                                $scope.checkInOutStatusPending = data.data;
                            }
                            else{}
                        })
                    }
                })
            };
            getAllOutInStatusPending();
            //approved
            $scope.approved = function(id,node_id){
                var info = {
                    ID:id,
                    status:isoConst.submitStatus.approved,
                    Node_ID:node_id
                };
                isoService.checkOutIn.approvedAndReject(info).then(function(data){
                    if(data.status =='success'){
                        msgPopup("Approved",isoConst.msgPopupType.success,"Approved Success");
                        getAllOutInStatusPending();
                        
                    }else{
                        msgPopup("Approved",isoConst.msgPopupType.error,"Approved Error");
                    }
                })
            };

            //reject
            $scope.rejects = function(id,node_id){
                var info = {
                    ID:id,
                    status:isoConst.submitStatus.reject,
		            Node_ID:node_id
                };
                isoService.checkOutIn.approvedAndReject(info).then(function(data){
                    if(data.status =='success'){

                        msgPopup("Reject",isoConst.msgPopupType.success,"Reject Success");
                        getAllOutInStatusPending();
                    }else{
                        msgPopup("Reject",isoConst.msgPopupType.Error,"Reject Error");
                    }
                })
            };
            //dowload file
            $scope.downloadFile  = function(nodeId,checkOutInId){
                isoService.checkOutIn.dowloadFile(nodeId,checkOutInId).then(function(data){

                });
            };

            /**
             * Approved document
             * tannv.dts@gmail.com
             */
            $scope.approvedDocument=function(nodeId,checkOutInId){
                isoService.checkOutIn.approvedDocument(nodeId,checkOutInId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        msgPopup("Approved",isoConst.msgPopupType.success,"Approved Success");
                        getAllOutInStatusPending();
                        isoService.checkOutIn.sendEmailNotificationNewDocumentVersion(nodeId)
                        .then(function(data){

                        },function(err){

                        });
                    }
                    else
                    {
                        msgPopup("Approved",isoConst.msgPopupType.error,"Approved Error");
                    }
                },function(err){
                    msgPopup("Approved",isoConst.msgPopupType.error,"Approved Error");
                });
            };

            /**
             * Reject document
             * tannv.dts@gmail.com
             */
            $scope.rejectedDocument=function(checkOutInId)
            {
                isoService.checkOutIn.rejectedDocument(checkOutInId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        msgPopup("Reject",isoConst.msgPopupType.success,"Reject Success");
                        getAllOutInStatusPending();
                    }
                    else
                    {
                        msgPopup("Reject",isoConst.msgPopupType.error,"Reject Error");
                    }
                },function(err){
                    msgPopup("Reject",isoConst.msgPopupType.error,"Reject Error");
                })
            }
    });