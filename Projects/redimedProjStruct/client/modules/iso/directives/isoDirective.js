


angular.module("app.loggedIn.iso.directive", [])
	.directive('isoDemoDirective', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                message:'@',
                type:'='
            },
            templateUrl: 'modules/rediLegalOnlineBooking/directives/rlob_fade_in_out_template.html',
            controller: function ($scope)
            {
                
            }
        };
    })

    .directive('isoNoticeFinishRenderDirectoryTree', function() {
        return function(scope, element, attrs) {
            //angular.element(element).css('color','blue');
            if (scope.$last)
            {
                //scope.collapseAll();
                $('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
                //tannv.dts modify
                $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').unbind('click');
                //----------------
                $('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').on('click', function (e) {
                    var children = $(this).parent('li.parent_li').find(' > ul > li');
                    if (children.is(':visible')) {
                        children.hide('fast');
                        $(this).attr('title', 'Expand this branch').find(' > i').addClass('fa-plus').removeClass('fa-minus');
                    }
                    else {
                        children.show('fast');
                        $(this).attr('title', 'Collapse this branch').find(' > i').addClass('fa-minus').removeClass('fa-plus');
                    }
                    e.stopPropagation();
                });
                //window.alert("im the last!");
            }
        };
    })
    
    /**
     * check in document, luu ban cap nhat moi nhat
     * tannv.dts@gmail.com
     */
    .directive('isoCheckInDocument', function() {
        return {
            restrict: 'E',
            transclude:true,
            required:['^ngModel'],
            scope: {
                selectedTreeNode:'='
            },
            templateUrl: 'modules/iso/directives/isoCheckInDocument.html',
            controller: function ($scope,isoService,FileUploader)
            {
                $scope.checkInInfo={
                    checkInComment:''
                }


                //---------------------------------------------------------------
                //HANDLE UPLOAD FILES
                var uploader = $scope.uploader = new FileUploader({
                    url: '/api/iso/iso-check-out-in/check-in-document'
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
                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.success,'Check in success!');
                            //khong cho checkin neu chua checkout
                            $scope.selectedTreeNode.CHECK_IN_STATUS=response.data.CHECK_IN_STATUS;
                            $scope.selectedTreeNode.CHECK_IN_NO=response.data.CHECK_IN_NO;
                            $scope.selectedTreeNode.SUBMIT_STATUS=response.data.SUBMIT_STATUS;
                            uploader.queue.splice(0);

                        }
                        else
                        {
                            isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,'Check in fail!');
                        }
                    }
                    console.info('onCompleteItem', fileItem, response, status, headers);
                };
                uploader.onCompleteAll = function() {
                    console.info('onCompleteAll');
                };

                console.info('uploader', uploader);


                $scope.checkIn=function()
                {
                    $scope.checkInInfo.nodeId=$scope.selectedTreeNode.NODE_ID;
                    $scope.checkInInfo.relativePath=$scope.selectedTreeNode.relativePath;
                    if(uploader.queue[0])
                    {
                        uploader.queue[0].formData[0]={};
                        uploader.queue[0].formData[0]=$scope.checkInInfo;
    
                        uploader.uploadAll();
                    }
                    else
                    {
                        isoMsg.popup(isoLang.isoHeader,isoConst.msgPopupType.error,isoLang.pleaseSelectFile);
                    }
                    
                }
            }
        };
    })


    
    