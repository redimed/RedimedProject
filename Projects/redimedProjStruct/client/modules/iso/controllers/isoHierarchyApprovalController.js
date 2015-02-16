
angular.module('app.loggedIn.isoHierarchyApprovalController.controller',[])
    .controller("isoHierarchyApprovalController", function($scope,$http,$state,$window,$cookieStore,FileUploader,toastr,isoService) {
        $scope.hierarchyApprovalStatus=isoConst.hierarchyApprovalStatus;
        $scope.submitStatus=isoConst.submitStatus;
        $scope.hierarchyApprovalTreeTemp={};
        $scope.hierarchyApprovalTree={};
        isoService.hierarchyApproval.getAllHierarchyLineForUser()
        .then(function(data){
            if(data.status=='success')
            {
                
                for(var i=0;i<data.data.length;i++)
                {
                    var item=data.data[i];
                    $scope.hierarchyApprovalTreeTemp[item.APPR_LINE_ID]=item;
                }


                for(var i=0;i<data.data.length;i++)
                {
                    var item=data.data[i];
                    if($scope.hierarchyApprovalTreeTemp[item.PREVIOUS_LINE_ID])
                    {
                        $scope.hierarchyApprovalTreeTemp[item.PREVIOUS_LINE_ID].NEXT_LINE_ID=item.APPR_LINE_ID;
                    }
                }

                
                for(var i=0;i<data.data.length;i++)
                {
                    var item=data.data[i];
                    if($scope.hierarchyApprovalTreeTemp[item.NEXT_LINE_ID])
                    {
                        $scope.hierarchyApprovalTreeTemp[item.NEXT_LINE_ID].nodes={};
                        $scope.hierarchyApprovalTreeTemp[item.NEXT_LINE_ID].nodes[item.APPR_LINE_ID]=item;
                    }
                }

                angular.forEach($scope.hierarchyApprovalTreeTemp,function(value,key){
                    if(value.NEXT_LINE_ID==null)
                    {
                        $scope.hierarchyApprovalTree[value.APPR_LINE_ID]=value;
                    }
                });
                console.log(">>>>>")
                console.log($scope.hierarchyApprovalTree);
            }
            else
            {
                
            }
        },function(err){

        });
        
        $scope.approved=function(line)
        {
            var approvalInfo={
                hierarchyHeaderId:line.APPR_HEADER_ID,
                hierarchyLineId:line.APPR_LINE_ID,
                hierarchyNodeId:line.NODE_ID,
                sourceLineId:line.SOURCE_LINE_ID,
                status:isoConst.hierarchyApprovalStatus.approved,
                isoNodeId:line.SOURCE_HEADER_ID
            }
            isoService.hierarchyApproval.approval(approvalInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    //exlog.alert(data);
                    line.STATUS=isoConst.hierarchyApprovalStatus.approved;
                    isoMsg.popup("Approved",isoConst.msgPopupType.success,"Approved Document Success!");
                    if(data.info && data.info=='release')
                    {
                        isoService.checkOutIn.sendEmailNotificationNewDocumentVersion(line.SOURCE_HEADER_ID)
                        .then(function(data){

                        },function(err){

                        });
                    }

                    // if(data.info && data.info=='updateNextNode')
                    // {
                    //     alert("OK")
                    //     isoService.hierarchyApproval.sendEmailNotificationApprovalToNextNode(
                    //         data.data.nextHierarchyLineId,
                    //         data.data.nextHierarchyNodeId,
                    //         data.data.isoNodeId,
                    //         data.data.sourceLineId
                    //     ).then(function(data){

                    //     },function(err){

                    //     })
                    // }
                }
                else
                {
                    isoMsg.popup("Approved",isoConst.msgPopupType.error,"Approved Document fail!");
                }
            },function(err){
                isoMsg.popup("Approved",isoConst.msgPopupType.error,"Approved Document fail!");
            })
        }

        $scope.rejected=function(line)
        {
            var approvalInfo={
                hierarchyHeaderId:line.APPR_HEADER_ID,
                hierarchyLineId:line.APPR_LINE_ID,
                hierarchyNodeId:line.NODE_ID,
                sourceLineId:line.SOURCE_LINE_ID,
                status:isoConst.hierarchyApprovalStatus.rejected,
                isoNodeId:line.SOURCE_HEADER_ID
            }
            isoService.hierarchyApproval.approval(approvalInfo)
            .then(function(data){
                if(data.status=='success')
                {
                    line.STATUS=isoConst.hierarchyApprovalStatus.rejected;
                    isoMsg.popup("Rejected",isoConst.msgPopupType.success,"Rejected Document Success!");
                }
                else
                {
                    isoMsg.popup("Rejected",isoConst.msgPopupType.error,"Rejected Document fail!");
                }
            },function(err){
                isoMsg.popup("Rejected",isoConst.msgPopupType.error,"Rejected Document fail!");
            })
        }

        $scope.downloadFile  = function(line){

            isoService.hierarchyApproval.downloadFileCheckOutIn(line.SOURCE_HEADER_ID,line.SOURCE_LINE_ID).then(function(data){

            });
        };
    });