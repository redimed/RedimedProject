


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
                selectedTreeNode:'=',
                isCreateNewCheckIn:'='
            },
            templateUrl: 'modules/iso/directives/isoCheckInDocument.html',
            controller: function ($scope,isoService,FileUploader)
            {
                $scope.checkInInfo={
                    checkInComment:''
                }

                //---------------------------------------------------------------
                //HANDLE UPLOAD FILES
                if($scope.isCreateNewCheckIn===true)
                {
                    
                    var uploader = $scope.uploader = new FileUploader({
                        url: '/api/iso/iso-check-out-in/create-new-check-in-document'
                    });
                }
                else
                {
                    var uploader = $scope.uploader = new FileUploader({
                        url: '/api/iso/iso-check-out-in/check-in-document'
                    });
                }

                
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
                        /*
                         *phanquocchien.c1109g@gmail.com
                         *check validate
                         */
                        if ($scope.checkInForm.$valid) {
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
                        };
                }
            }
        };
    })
    /*
     *phanquocchien.c1109g@gmail.com
     *check validate
     */
    .directive('showErrors', function ($timeout, showErrorsConfig) {
      var getShowSuccess, linkFn;
      getShowSuccess = function (options) {
        var showSuccess;
        showSuccess = showErrorsConfig.showSuccess;
        if (options && options.showSuccess != null) {
          showSuccess = options.showSuccess;
        }
        return showSuccess;
      };
      linkFn = function (scope, el, attrs, formCtrl) {
        var blurred, inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses;
        blurred = false;
        options = scope.$eval(attrs.showErrors);
        showSuccess = getShowSuccess(options);
        inputEl = el[0].querySelector('[name]');
        inputNgEl = angular.element(inputEl);
        inputName = inputNgEl.attr('name');
        if (!inputName) {
          throw 'show-errors element has no child input elements with a \'name\' attribute';
        }
        inputNgEl.bind('blur', function () {
          blurred = true;
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$watch(function () {
          return formCtrl[inputName] && formCtrl[inputName].$invalid;
        }, function (invalid) {
          if (!blurred) {
            return;
          }
          return toggleClasses(invalid);
        });
        scope.$on('show-errors-check-validity', function () {
          return toggleClasses(formCtrl[inputName].$invalid);
        });
        scope.$on('show-errors-reset', function () {
          return $timeout(function () {
            el.removeClass('has-error');
            el.removeClass('has-success');
            return blurred = false;
          }, 0, false);
        });
        return toggleClasses = function (invalid) {
          el.toggleClass('has-error', invalid);
          if (showSuccess) {
            return el.toggleClass('has-success', !invalid);
          }
        };
      };
      return {
        restrict: 'A',
        require: '^form',
        compile: function (elem, attrs) {
          if (!elem.hasClass('form-group')) {
            throw 'show-errors element does not have the \'form-group\' class';
          }
          return linkFn;
        }
      };
    })
    /*
     *phanquocchien.c1109g@gmail.com
     *check validate
     */
    .provider('showErrorsConfig', function () {
        var _showSuccess;
        _showSuccess = false;
        this.showSuccess = function (showSuccess) {
          return _showSuccess = showSuccess;
        };
        this.$get = function () {
          return { showSuccess: _showSuccess };
        };
    })
    .directive('isoReplyEditDocument', function() {
    return {
        restrict: 'E',
        transclude:true,
        required:['^ngModel'],
        scope: {
            requestData:'=',
            adminData:'='
        },
        templateUrl: 'modules/iso/directives/isoReplyEditDocument.html',
        controller: function ($scope,isoService)
        {
            $scope.setListReply=function(IDREQUEST){
                isoService.replyEdit.getAllReplyEditDocument(IDREQUEST).then(function(data){
                    if (data.status == 'success') {
                        $scope.listReplyEditDocument = data.data;
                        console.log($scope.listReplyEditDocument);
                    };
                });
            };

            $scope.$watch('requestData',function(oldValue,newValue){
                $scope.setListReply($scope.requestData);
            });
            
            $scope.insertReply=function(comment){
                console.log($scope.adminData);
                console.log(isoConst.isoPermission.administrator);
                var value = 1;
                isoService.replyEdit.insertReplyEditDocument($scope.requestData,comment).then(function(data){
                    if (data.status == 'success') {
                        // alert('okokok');
                        if ($scope.adminData == isoConst.isoPermission.administrator) {
                            isoService.replyEdit.updateAdminReply($scope.requestData,value).then(function(data){
                                if (data.status == 'success') {
                                    $scope.comment = null;
                                    $scope.setListReply($scope.requestData);
                                };
                            });
                        }else{
                            isoService.replyEdit.updateStaffReply($scope.requestData,value).then(function(data){
                                if (data.status == 'success') {
                                    $scope.comment = null;
                                    $scope.setListReply($scope.requestData);
                                };
                            });
                        };
                    };
                });
            }
        }
    };
    })

    
    