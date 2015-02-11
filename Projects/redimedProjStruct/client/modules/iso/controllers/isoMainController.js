/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
angular.module('app.loggedIn.iso.main.controller',[])
    .controller("isoMainController", function($scope,$http,$state,$window,$cookieStore,FileUploader,toastr,isoService) {      
        $scope.testHierarchy=function()
        {
            // var submitInfo={
            //     nodeId:112,
            //     checkOutInId:69
            // }
            
            // isoService.hierarchyApproval.addHierarchyApprovalHeader(submitInfo)
            // .then(function(data){
            //     var approvalInfo={
            //         userApprovalId:1,
            //         hierarchyHeaderId:199,
            //         hierarchyLineId:377,
            //         hierarchyNodeId:26,
            //         sourceLineId:69,
            //         status:'approved',
            //         isoNodeId:11
            //     }
            //     isoService.hierarchyApproval.approval(approvalInfo)
            //     .then(function(data){
            //         exlog.alert(data);
            //     },function(err){

            //     })
                
            // },function(err){

            // });
            
            var approvalInfo={
                    userApprovalId:7,
                    hierarchyHeaderId:199,
                    hierarchyLineId:379,
                    hierarchyNodeId:24,
                    sourceLineId:69,
                    status:'approved',
                    isoNodeId:112
                }
                isoService.hierarchyApproval.approval(approvalInfo)
                .then(function(data){
                    exlog.alert(data);
                },function(err){

                })
        }

        /***
        //Khoi tao cac bien can thiet
        //tannv.dts@gmail.com
        */
        //lay thong tin nguoi login
        $scope.userInfo=$cookieStore.get('userInfo');
        //dinh nghia cac kieu node
        $scope.nodeType=isoConst.nodeType;
        /**
         * Ham suat cac thong bao dang the, tren goc tren ben phai
         * tannv.dts@gmail.com
         */
        var msg={
            success:function(msg)
            {
                toastr.success(msg, 'ISO Message');
            },
            error:function(msg)
            {
                toastr.error(msg, 'ISO Message');
            }
        };
        /**
         * Ham hien thi thong bao duoi dang dialog popup
         * tannv.dts@gmail.com
         */

        var msgPopup=isoMsg.popup;


        /***
        //hien thi toan bo cay thu muc hien hanh
        //tannv.dts@gmail.com
        */
        $scope.tempData={};
        $scope.tempData[-1]={};
        $scope.treeData={};

        $scope.isIsoAdminSystem=0;
        
        $scope.getTreeDir=function()
        {
            isoService.treeDir.getTreeDir($scope.userInfo.id,$scope.isIsoAdminSystem)
            .then(function(data){
                if(data.status=='success')
                {

                    for(var i=0;i<data.data.length;i++)
                    {
                        $scope.tempData[data.data[i].NODE_ID]=data.data[i];
                    }

                    //get relative path
                    //----------------------------------------------
                    for(var i=(data.data.length-1);i>=0;i--)
                    {
                        console.log(">>>>>>>>>>>node_id:"+data.data[i].NODE_ID+">>>father:"+data.data[i].FATHER_NODE_ID);
                        if(data.data[i].FATHER_NODE_ID==-1)
                        {
                            $scope.tempData[data.data[i].FATHER_NODE_ID].relativePath=''
                        }
                        else
                        {
                            //Kiem tra xem node cha co ton tai hay chua
                            if($scope.tempData[data.data[i].FATHER_NODE_ID])
                            {
                                //neu co ton tai thi lay relative path  
                                if(!$scope.tempData[data.data[i].FATHER_NODE_ID].relativePath)
                                {
                                    $scope.tempData[data.data[i].FATHER_NODE_ID].relativePath=
                                        '\\'+$scope.tempData[data.data[i].FATHER_NODE_ID].NODE_NAME;
                                }
                            }
                            
                        }

                        
                        //Kiem tra xem node cha co ton tai chua
                        if($scope.tempData[data.data[i].FATHER_NODE_ID])
                        {
                            $scope.tempData[data.data[i].NODE_ID].relativePath=
                                $scope.tempData[data.data[i].FATHER_NODE_ID].relativePath+
                                '\\'+$scope.tempData[data.data[i].NODE_ID].NODE_NAME;
                        }
                        

                        //tannv.dts@gmail.com
                        //tinh ke thua
                        //neu user co nhung quyen han tren node cha, thi se co quyen han tren node con
                        //user co quyen han nao tren node cha cung co quyen han do tren node con
                        //*
                        //neu node khong co ACCESSIBLE_USER_ID trung voi user dang nhap
                        //thi kiem tra node cha xem user hien tai co quyen han khong
                        //neu co thi node nay user cung co quyen han
                        
                        //Kiem tra xem node cha co ton tai chua
                        if($scope.tempData[data.data[i].FATHER_NODE_ID])
                        {
                            if($scope.tempData[data.data[i].NODE_ID].ACCESSIBLE_USER_ID!=$scope.userInfo.id)
                            {
                                isoNode.inheritPermission($scope.tempData[data.data[i].NODE_ID],$scope.tempData[data.data[i].FATHER_NODE_ID]);
                            }
                        }
                        
                    }
                    //----------------------------------------------

                    for(var i=0;i<data.data.length;i++)
                    {
                        //Kiem tra xem node cha co ton tai chua
                        if($scope.tempData[data.data[i].FATHER_NODE_ID])
                        {
                            if(!$scope.tempData[data.data[i].FATHER_NODE_ID].nodes)
                            {
                                $scope.tempData[data.data[i].FATHER_NODE_ID].nodes={};
                            }
                            $scope.tempData[data.data[i].FATHER_NODE_ID].nodes[data.data[i].NODE_ID]=angular.copy(data.data[i]);
                        }
                        
                    }

                    $scope.treeData=$scope.tempData[-1].nodes;
                }
            },function(err){

            });
        }
        /**
         * Kiem tra xem user dang nhap co phai la admin cua he  thong iso hay khong
         * tannv.dts@gmail.com
         */
        isoService.isoAdmin.checkIsAdminIsoSystem()
        .then(function(data){
            if(data.status=='success')
            {
                $scope.isIsoAdminSystem=1;
            }
            else
            {
                $scope.isIsoAdminSystem=0;
            }
        },function(err){
            $scope.isIsoAdminSystem=0;
        })
        .then(function()
        {
            $scope.getTreeDir();
        });

        //-------------------------------------------------------------------------------------
        //cac action duoc su dung trong tree
        $scope.treeActions={
            createFolder:{name:'createFolder',url:'iso_create_folder_template.html'},
            createDocument:{name:'createDocument',url:'iso_create_document_template.html'},
            grantNodePermission:{name:'grantNodePermission',url:'iso_grant_node_permission.html'},
            checkInDocument:{name:'checkInDocument',url:'iso_check_in_document.html'},
            getFullVersionDocument:{name:'getFullVersionDocument',url:'iso_get_full_version_document.html'},
            getFullCheckinDocument:{name:'getFullCheckinDocument',url:'iso_get_full_checkin_document.html'}
            
        };
        //action hien tai dang dc thao tac
        $scope.currentTreeAction={};
        //node hien tai duoc chon tren cay thu muc
        $scope.selectedTreeNode={};
        //hien thi popup liet ke tat cac cac action co the thao tac tuong ung voi node hien tai
        $scope.showTreeActionsMenuPopup=function(node)
        {
            $scope.selectedTreeNode=node;
               /**
               * phanquocchien.c1109g@gmail.com
               * set new folder and document 
               */
            $scope.newFolder=angular.copy($scope.newFolderBlank);
            $scope.newDocument=angular.copy($scope.newDocumentBlank);
            $("#iso-tree-actions-menu-popup").modal({show:true,backdrop:'static'});
        };

        //new folder info template
        $scope.newFolderBlank={
                    fatherNodeId:'',
                    nodeType:$scope.nodeType.folder,
                    nodeName:'',
                    description:'',
                    createdBy:$scope.userInfo.id,
                    relativePath:''
        };
        //new document template
        $scope.newDocumentBlank={
            fatherNodeId:'',
            nodeType:$scope.nodeType.document,
            nodeName:'',
            docCode:'',
            description:'',
            createdBy:$scope.userInfo.id,
            relativePath:''
        };
        //hien thi popup la noi dung cua action da duoc chon
        $scope.resetFlag=0;
        $scope.showTreeActionContentPopup=function(treeAction)
        {
            switch(treeAction)
            {
                case $scope.treeActions.createFolder.name:
                    $scope.currentTreeAction=$scope.treeActions.createFolder;
                     /**
                       * phanquocchien.c1109g@gmail.com
                       * remove class validate 
                       */
                    angular.element(".form-group").removeClass('has-success');
                    angular.element(".form-group").removeClass('has-error');
                    break;
                case $scope.treeActions.createDocument.name:
                    $scope.currentTreeAction=$scope.treeActions.createDocument;
                    /**
                       * phanquocchien.c1109g@gmail.com
                       * remove class validate 
                       */
                    angular.element(".form-group").removeClass('has-success');
                    angular.element(".form-group").removeClass('has-error');
                    break;
                case $scope.treeActions.grantNodePermission.name:
                    $scope.currentTreeAction=$scope.treeActions.grantNodePermission;
                    $scope.resetFlag=$scope.resetFlag+1;
                    break;
                case $scope.treeActions.checkInDocument.name:
                    $scope.currentTreeAction=$scope.treeActions.checkInDocument;
                    break;
                case $scope.treeActions.getFullVersionDocument.name:
                    $scope.currentTreeAction=$scope.treeActions.getFullVersionDocument;
                    $scope.getFullVersionDoccument();
                    break;
                case $scope.treeActions.getFullCheckinDocument.name:
                    $scope.currentTreeAction=$scope.treeActions.getFullCheckinDocument;
                    $scope.getFullCheckinDocument();

                    break;

            }
            $("#iso-tree-actions-menu-popup").modal('hide');
            $("#iso-tree-action-content-popup").modal({show:true,backdrop:'static'});
        };


        /***
        //Ham tao thu muc
        //tann.dts@gmail.com
        */
       $scope.newFolderBackErrorTemplate={
            name:''
       };
       $scope.beforeCreateFolder=function()
       {
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.actionContentForm.$valid && $scope.newFolder.nodeName != null && $scope.newFolder.nodeName !="") {
                $scope.newFolder.fatherNodeId=$scope.selectedTreeNode.NODE_ID;
                $scope.newFolder.relativePath=$scope.selectedTreeNode.relativePath+'\\'+$scope.newFolder.nodeName;
                $scope.newFolderBackError=angular.copy($scope.newFolderBackErrorTemplate);
                isoService.treeDir.checkDupEntry($scope.newFolder.fatherNodeId,$scope.newFolder.nodeName)
                .then(function(data){
                    if(data.status=='success')
                    {
                        if(data.data.isDup)
                        {
                            if(data.data.counts.NAME)
                                $scope.newFolderBackError.name="Name has been used!";
                        }
                        else
                        {
                            $scope.createFolder();
                        }
                    }
                });
             }; 
       };
        $scope.createFolder=function()
        {
            isoService.treeDir.createFolder($scope.selectedTreeNode.NODE_ID,$scope.newFolder)
                .then(function(data){
                    if(data.status=='success')
                    {
                        msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,isoLang.createFolderSuccess);
                        if(!$scope.selectedTreeNode.nodes)
                        {
                            $scope.selectedTreeNode.nodes={};
                        }
                        $scope.selectedTreeNode.nodes[data.data.NODE_ID]=angular.copy(data.data);
                        $scope.selectedTreeNode.nodes[data.data.NODE_ID].relativePath=$scope.selectedTreeNode.relativePath+"\\"+$scope.selectedTreeNode.nodes[data.data.NODE_ID].NODE_NAME;
                        if(!data.data.ACCESSIBLE_USER_ID)
                        {
                            isoNode.inheritPermission($scope.selectedTreeNode.nodes[data.data.NODE_ID],$scope.selectedTreeNode);
                        }
                    }
                    else
                    {
                        msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.createFolderError);
                    }
                    $("#iso-tree-action-content-popup").modal('hide');
                },function(err){
                        msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.createFolderError);
                });
        };

        /***
        //Ham tao file
        //tannv.dts@gmail.com
        */
        $scope.newDocumentBackErrorTemplate={
            name:'',
            docCode:''
        };
       $scope.beforeCreateDocument=function()
       {
            //$scope.newDocument.nodeId la node dang duoc tao document, dung de kiem tra quyen han cua user tren node
            //tannv.dts@gmail.com
            $scope.$broadcast('show-errors-check-validity');
            if ($scope.actionContentForm.$valid && $scope.newDocument.nodeName != null && $scope.newDocument.nodeName !="") {
                $scope.newDocument.nodeId=$scope.selectedTreeNode.NODE_ID;
                $scope.newDocument.fatherNodeId=$scope.selectedTreeNode.NODE_ID;
                $scope.newDocument.relativePath=$scope.selectedTreeNode.relativePath+'\\'+$scope.newDocument.nodeName;
                $scope.newDocumentBackError=angular.copy($scope.newDocumentBackErrorTemplate);
                isoService.treeDir.checkDupEntry($scope.newDocument.fatherNodeId,$scope.newDocument.nodeName,$scope.newDocument.docCode)
                .then(function(data){
                    if(data.status=='success')
                    {
                        if(data.data.isDup)
                        {
                            if(data.data.counts.NAME)
                                $scope.newDocumentBackError.name="Name has been used!";
                            if(data.data.counts.CODE)
                                $scope.newDocumentBackError.docCode="Document Code has been used!";
                        }
                        else
                        {
                            $scope.createDocument();
                        }
                    }
                });
            };
       };
        $scope.createDocument=function()
        {
            
            if(uploader.queue[0])
            {
                uploader.queue[0].formData[0]={};
                uploader.queue[0].formData[0]=$scope.newDocument;
                uploader.uploadAll();
            }
            else
            {
                msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.pleaseSelectFile);
            }
      
        };

        //---------------------------------------------------------------
        //HANDLE UPLOAD FILES
        var uploader = $scope.uploader = new FileUploader({
            url: '/api/iso/iso-tree-dir/create-document-with-file'
        });
        // FILTERS
        uploader.filters.push({
            name: 'customFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            uploader.queue.splice(0,uploader.queue.length-1);
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            $("#iso-tree-action-content-popup").modal('hide');
            if(response.status)
            {
                if(response.status=='success')
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,isoLang.createDocumentSuccess);
                    if(!$scope.selectedTreeNode.nodes)
                    {
                        $scope.selectedTreeNode.nodes={};
                    }
                    $scope.selectedTreeNode.nodes[data.data.NODE_ID]=angular.copy(response.data);
                    $scope.selectedTreeNode.nodes[data.data.NODE_ID].relativePath=$scope.selectedTreeNode.relativePath+"\\"+$scope.selectedTreeNode.nodes[data.data.NODE_ID].NODE_NAME;
                }
                else
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.createDocumentError);
                }
            }
            uploader.queue.splice(0);
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);
        /**
         * Tai document ve may de edit
         * @return {[type]} [description]
         */
        $scope.checkOutDocument=function()
        {
            isoService.checkOutIn.checkOutDocument($scope.selectedTreeNode.NODE_ID,$scope.selectedTreeNode.relativePath)
            .then(function(data){
                $("#iso-tree-actions-menu-popup").modal('hide');
                if(data.status=='success')
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,'Check out success, document has locked');
                    $window.location.href = "/api/iso/iso-check-out-in/download-check-out-document?nodeId="+$scope.selectedTreeNode.NODE_ID
                                    +"&relativePath="+$scope.selectedTreeNode.relativePath;
                    //Sau khi checkout thi khong cho checkout nua, tru phi document duoc checkin moi
                    $scope.selectedTreeNode.CHECK_IN_STATUS=data.data.CHECK_IN_STATUS;//lock
                    $scope.selectedTreeNode.CHECK_IN_NO=data.data.CHECK_IN_NO;
                }
                else if(data.status=='lock')
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Document is locked');
                }
                else
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Check out fail!');
                }
            },function(err){
                msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Check out fail!');
            })
        };
        $scope.beforeCheckIn=function(){
            isoService.checkOutIn.canCheckInDocument($scope.selectedTreeNode.NODE_ID)
            .then(function(data){
                if(data.status=='success')
                {
                    if(data.info=='1')
                    {
                        $scope.showTreeActionContentPopup($scope.treeActions.checkInDocument.name);
                    }
                    else if(data.info=='0')
                    {
                        msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Cannot check in because not check out');
                    }
                    else if(data.info=='2')
                    {
                        msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'You cannot check in');
                    }
                    else
                    {
                        msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Error');
                    }
                }
                else
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Error');
                }
            },function(err){
            })
        };

        // $scope.SubmitDocument = function(){

        //     isoService.checkOutIn.submitDocument($scope.selectedTreeNode.NODE_ID)
        //     .then(function(data)
        //     {
        //         if(data.status=='success'){
        //             msgPopup("Submit Document",isoConst.msgPopupType.success,"Submit Document Success");
        //             $scope.selectedTreeNode.SUBMIT_STATUS=data.data.SUBMIT_STATUS;
        //             $scope.selectedTreeNode.CHECK_IN_STATUS=data.data.CHECK_IN_STATUS;
        //         }else{
        //             msgPopup("Submit Document",isoConst.msgPopupType.error,"Submit Document Error");
        //         }
        //     },function(err){
        //         msgPopup("Submit Document",isoConst.msgPopupType.error,"Submit Document Error");
        //     });
        // }
        $scope.SubmitDocument = function(){
            
            isoService.hierarchyApproval.addHierarchyApprovalHeader($scope.selectedTreeNode.NODE_ID)
            .then(function(data){
                if(data.status=='success'){
                    msgPopup("Submit Document",isoConst.msgPopupType.success,"Submit Document Success");
                    $scope.selectedTreeNode.SUBMIT_STATUS=isoConst.submitStatus.pending;
                    $scope.selectedTreeNode.CHECK_IN_STATUS=isoConst.checkInStatus.lock;
                }else{
                    msgPopup("Submit Document",isoConst.msgPopupType.error,"Submit Document Error");
                }
                // var approvalInfo={
                //     userApprovalId:1,
                //     hierarchyHeaderId:199,
                //     hierarchyLineId:377,
                //     hierarchyNodeId:26,
                //     sourceLineId:69,
                //     status:'approved',
                //     isoNodeId:11
                // }
                // isoService.hierarchyApproval.approval(approvalInfo)
                // .then(function(data){
                //     exlog.alert(data);
                // },function(err){

                // })
                
            },function(err){
                msgPopup("Submit Document",isoConst.msgPopupType.error,"Submit Document Error");
            });

            
        }

        $scope.cancelSubmitDocument=function()
        {
            isoService.checkOutIn.cancelSubmitDocument($scope.selectedTreeNode.NODE_ID)
            .then(function(data){
                if(data.status=='success')
                {
                    msgPopup("Cancel Submit Document",isoConst.msgPopupType.success,"Cancel submit document success!");
                    $scope.selectedTreeNode.SUBMIT_STATUS=data.data.SUBMIT_STATUS;
                    $scope.selectedTreeNode.CHECK_IN_STATUS=data.data.CHECK_IN_STATUS;
                }
                else
                {
                    msgPopup("Cancel Submit Document",isoConst.msgPopupType.error,"Cancel Submit Document Error");
                }
            },function(err){
                msgPopup("Cancel Submit Document",isoConst.msgPopupType.error,"Cancel Submit Document Error");
            });
        }

        $scope.grantNodePermissionItem=function(nodeId,accessibleUserId,permission)
        {
            isoService.treeUser.grantNodePermission(nodeId,accessibleUserId,permission)
            .then(function(data){
                exlog.alert(data);
                if(data.status=='success')
                {
                    alert("dung roi");
                    item.STATUS=data.status;
                    //isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Grant Permission success!');
                }
                else
                {
                    alert("sai roi");
                    item.STATUS=data.status;
                    //isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Grant Permission error!');
                }
                //$("#iso-tree-action-content-popup").modal('hide');
            },function(err){
                item.STATUS='error';
            })
        };
        $scope.checkCanPermission=function(nodeId,userGrant,userIsGranted,permission)
        {
            isoService.treeUser.checkCanPermission(nodeId,userGrant,userIsGranted,permission)
            .then(function(data){
                exlog.alert(data);
            },function(err){
            })
        };
        //download newest version document
        $scope.downloadNewestVersionDocument = function(){
            isoService.checkOutIn.downloadNewestVersionDocument($scope.selectedTreeNode.NODE_ID).then(function(){
            })
        }

        /**
         * Xoa node
         * tannv.dts@gmail.com
         */
        $scope.deleteNode=function()
        {
            isoService.treeDir.deleteNode($scope.selectedTreeNode.NODE_ID)
            .then(function(data){
                if(data.status=='success')
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,'Delete success!');
                    var deletex=function(node)
                    {
                        node.ISENABLE=0;
                        if(node.nodes)
                        {
                            angular.forEach(node.nodes, function(value, key) {
                                deletex(value);
                            });
                        }
                    }
                    deletex($scope.selectedTreeNode);
                }
                else
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Cannot delete!');
                }
            },function(err){
                msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Cannot delete!');
            })
            .then(function(){
                $("#iso-tree-actions-menu-popup").modal('hide');
            })
            
        }

        $scope.restoreNode=function()
        {
            isoService.treeDir.restoreNode($scope.selectedTreeNode.NODE_ID)
            .then(function(data){
                if(data.status=='success')
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.success,'Restore success!');   
                    var restore=function(node)
                    {
                        node.ISENABLE=1;
                        if(node.nodes)
                        {
                            angular.forEach(node.nodes, function(value, key) {
                                restore(value);
                            });
                        }
                    }
                    restore($scope.selectedTreeNode);
                }
                else
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Cannot restore!');
                }
            },function(err){
                msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Cannot restore!');
            })
            .then(function(){
                $("#iso-tree-actions-menu-popup").modal('hide');
            })
            
        }

        /**
         * Download folder 
         * Voducgiap
         * modify:tannv.dts@gmail.com
         */
    	$scope.downloadFolderSelected = function(){

    		var listNode = [];
    		var dequy = function(node){
    			var item={
    				NODE_ID:node.NODE_ID,
    				relativePath:node.relativePath,
    				NODE_TYPE:node.NODE_TYPE,
    				NODE_NAME:node.NODE_NAME

    			};
    			listNode.push(item);
    			if(node.nodes)
    			{
    				angular.forEach(node.nodes,function(values){
    					dequy(values);
    				})
    			}
    		};
    		dequy($scope.selectedTreeNode);
    		console.log(listNode);
            isoService.treeDir.handlingCloneFolder($scope.selectedTreeNode.NODE_ID,listNode)
            .then(function(data){
                if(data.status=='success')
                {
                    isoService.treeDir.cloneFolder($scope.selectedTreeNode.NODE_ID,data.data.downloadPackName);
                }
                else
                {
                    msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Download folder fail!');
                }
                // exlog.alert(data);
            },function(err){
                msgPopup(isoLang.isoHeader,isoConst.msgPopupType.error,'Download folder fail!');
            })
    	}

        //get full version document
        $scope.fullVersionDocumentData = {};
        $scope.getFullVersionDoccument = function(){
            isoService.treeDir.getFullVersionDoccument($scope.selectedTreeNode.NODE_ID).then(function(data){
                if(data.status=='success'){
                    console.log(data);
                   $scope.fullVersionDocumentData = data.data;
                }
            })
        };
        //download document 
        $scope.downloadVersionNo = function(FILE_NAME,CHECK_IN_FOLDER_STORAGE,NODE_ID){
               isoService.treeDir.handlingDownloadVersionDocument(FILE_NAME,CHECK_IN_FOLDER_STORAGE,NODE_ID);
        },

        //get full checkin document
        $scope.fullCheckinDocumentData = {};
        $scope.getFullCheckinDocument = function(){
            isoService.treeDir.getFullCheckinDoccument($scope.selectedTreeNode.NODE_ID).then(function(data){
                if(data.status=='success'){
                    console.log(data);
                   $scope.fullCheckinDocumentData = data.data;
                }
            })
        }

    })

