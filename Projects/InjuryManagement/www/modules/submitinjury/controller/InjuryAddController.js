angular.module('starter.injury.add.controller', ['ngCordova'])

    .controller('InjuryAddController', function($scope, $state, $filter,
                                                InjuryServices, $cordovaCamera, $ionicPopup,
                                                $ionicSideMenuDelegate, localStorageService,
                                                $cordovaFile, $ionicModal, ConfigService){
        $scope.isSubmit = false;
        $scope.isShow = true;
        $scope.imgURI = [];
        $scope.isSubmitdesc = false;
        $scope.isClick = null;
        var i = 0;
        $scope.list = [];
        $scope.isShowImg = true;
        $scope.isFailMobile = false;
        $scope.isFailEmail = false;
        $scope.isMobile = null;
        $scope.goAddworker = true;

        var serverUpload = "http://testapp.redimed.com.au:3000/api/im/upload"
        var userInfoLS = localStorageService.get("userInfo");
        $scope.titleIndex = ConfigService.title_option();
        $ionicSideMenuDelegate.canDragContent(false)

        $scope.nextform = function(info) {
            $state.go('app.injury.desinjury');
            //$scope.isSubmit = true;
            //if(info.$invalid) {
            //    var alertValid = $ionicPopup.alert({
            //        title: "Can't next form",
            //        template: 'Please Check Your Information!'
            //    });
            //}
            //else {
            //
            //}
        }

        $scope.worker = {
            Patient_id: -1,
            Title: '',
            First_name: '',
            Sur_name: '',
            Middle_name: '',
            Address1: '',
            DOB: '',
            Sex: '',
            Mobile: '',
            Email: '',
            injury_description: '',
            injury_date: '',
            description:''
        }

        var scopeReset = angular.copy($scope.worker);

        $scope.reset = function() {
            $scope.worker = angular.copy(scopeReset);
            $scope.isShow = !$scope.isShow;
        }

        $scope.selectWorker = function (id) {
            $scope.isShow = !$scope.isShow;
            InjuryServices.getPatientID(id).then(function (data) {
                $scope.worker = data;
                $scope.worker.DOB = $filter('date')(new Date($scope.worker.DOB),'dd/MM/yyyy');
                $scope.temp1 = angular.copy($scope.worker);
            })
        }

        //init Form Search Worker
        var initFormWorker = function() {
            InjuryServices.searchWorker(userInfoLS.company_id).then(function (data) {
                if (data.status != 'success') {
                    alert('error');
                    return;
                }
                else{
                    $scope.list = data.rs;
                }
            });
        }

        //get localstorage
        var initFormLocalStorage = function () {

        }

        //PROCESS MODAL
        $ionicModal.fromTemplateUrl('modules/submitinjury/views/modal/imageDetail.html', function(modal) {
            $scope.InjuryImgControllerModal = modal;
        },{
            scope: $scope,
            animation: 'slide-in-up'
        });

        $scope.selectImg = function(imgData, desc) {
            $scope.imageDetail = imgData;
            $scope.imageDesc = desc;
            $scope.InjuryImgControllerModal.show();
        }

        //PROCESS MODAL
        //$scope.selectImage = function (image) {
        //    $scope.imageDetail = image;
        //}

        $scope.takePicture = function() {
            var options = {
                quality : 50,
                destinationType : Camera.DestinationType.FILE_URI,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };
            $cordovaCamera.getPicture(options).then(function(imageData) {
                var myPopup = $ionicPopup.show({
                    template: '<input type="text" ng-model="worker.description">',
                    title: 'Enter Description',
                    subTitle: 'Please use description picture',
                    scope: $scope,
                    buttons: [
                        { text: 'Cancel' },
                        {
                            text: '<b>Save</b>',
                            type: 'button-positive',
                            onTap: function(e) {
                                if (!$scope.worker.description) {
                                    $scope.imgURI.push({
                                        id: i++,
                                        image: imageData,
                                        desc: ''
                                    })
                                } else {
                                    $scope.imgURI.push({
                                        id: i++,
                                        image: imageData,
                                        desc: $scope.worker.description
                                    })
                                }
                                $scope.worker.description = '';
                            }
                        },
                    ]
                });
            }, function(err) {
                alert(err);
            });
        };

        //$scope.changeisShowimg = function() {
        //    $scope.isShowImg = !$scope.isShowImg;
        //}



        function uploadFile(img, server, params) {
            
            console.log(img);
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = img.substr(img.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = params;

            var ft = new FileTransfer();
            ft.upload(img, server, function(r) {
                var alertPopup = $ionicPopup.alert({
                    title: "Success",
                    template: 'Added Injury!'
                });
            }, function(error) {
                console.log(error);
            }, options);
        }

        //CHECK VALID MOBILE AND EMAIL
        $scope.Checkfield = function (isMobile) {
            if(isMobile)
            {
                InjuryServices.checkMobile($scope.worker.Mobile).then(function(data) {
                    if(data.status == 'success')
                    {
                        if(data.count == 0)
                        {
                            $scope.isFailMobile = true;
                        }
                        else
                        {
                            $scope.isFailMobile = false;
                        }
                    }
                })
            }
            else
            {
                InjuryServices.checkEmail($scope.worker.Email).then(function (data) {
                    if (data.status == 'success') {
                        if (data.count == 0) {
                            console.log("pass")
                            $scope.isFailEmail = true;
                        }
                        else {
                            $scope.isFailEmail = false;
                        }
                    }

                })
            }
        }
        //-----------------------------------

        $scope.showConfirm = function(desc, click) {
            if($scope.imgURI.length > 0) {
                if(click)
                {
                    $scope.isSubmitdesc = true;
                    if(desc.$invalid && isClick)
                    {
                        var alertPopup = $ionicPopup.alert({
                            title: "Error",
                            template: 'Please Check Your Information!'
                        });
                    }
                    else
                    {
                        InjuryServices.insertInjury($scope.worker).then(function(data){
                            if(data.status == 'success')
                            {
                                for(var i = 0 ; i <= $scope.imgURI.length; i++)
                                {
                                    var params = {
                                        injury_id: data.injury_id,
                                        description: $scope.imgURI[i].desc
                                    };
                                    console.log($scope.imgURI[i].image);
                                    uploadFile($scope.imgURI[i].image,serverUpload,params);
                                }
                            }
                        })
                    }
                }
                else
                {
                    NonEmergency();
                }
            }
            else
            {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'You need take photo',
                    template: 'Are you sure you want to take photo?'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        $scope.takePicture();
                    } else {
                        NonEmergency();
                        //console.log("cancel");
                    }
                });
            }
        };

        function NonEmergency() {
            if($scope.worker.Patient_id == -1)
            {
                localStorageService.set("injuryInfo", $scope.infoInjury);
                $state.go('app.worker.add',{nonEmerg: $scope.goAddworker});
            }
            else
            {
                $scope.infoInjury = {
                    info: $scope.worker,
                    dataImage: $scope.imgURI
                };
                localStorageService.set("injuryInfo", $scope.infoInjury);
                $state.go('app.chooseAppointmentCalendar',{Patient_id: $scope.worker.Patient_id});
            }
        }
        initFormWorker();
    })

    .controller('InjuryImgControllerModal', function($scope){
        $scope.hideModal = function() {
            $scope.InjuryImgControllerModal.hide();
        };
    })
