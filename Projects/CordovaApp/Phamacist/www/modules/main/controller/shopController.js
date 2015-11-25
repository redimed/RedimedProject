angular.module('starter.main.shopController',['ionic-datepicker'])

    .controller('shopController', function ($scope, $state, $q, localStorageService ,SecurityService, $ionicPopup, $ionicLoading, $ionicModal, $timeout, MainService, $filter, $stateParams, $location) {
            
            $scope.shopInfo = {};
            $scope.currentDate = {};
            $scope.RequiredDatePicker = new Date();
            $scope.StartDatePicker = new Date();
            $scope.title = $stateParams.title;
            $scope.myOption = 'inf';
            
            $scope.getCompanyInfo = function(){
                MainService.getCompany($scope.userInfo.user_id).then(function(result){
                  if(result.status=="Success"){
                    $scope.companyinfo = result.data;
                    $scope.companyinfo.phone =  parseInt($scope.companyinfo.phone);
                    $scope.companyinfo.mobile =  parseInt($scope.companyinfo.mobile);
                    $scope.selectShopByCompany();
                    }else{
                        var alertPopup = $ionicPopup.alert({
                        title: 'Alert',
                        template: 'Error'
                      });
                    }
                })
            }
            $scope.getCompanyInfo();

            $scope.addNewShop = function(){
              $scope.title = 'Add New Shop';
              $state.go('app.main.addNewShop', {title:$scope.title});
            }

            $scope.editShop = function(shop){
              $scope.title = "Edit Shop";
              MainService.editShop = shop;
              $state.go('app.main.editShop', {title:$scope.title});
            }

            if($location.$$path === "/app/main/editShop/Edit Shop"){
              $scope.shopInfo = MainService.editShop;
              $scope.shopInfo.phone = parseInt($scope.shopInfo.phone);
              document.getElementById('disableIput').disabled = true;
            }

            //create new shop 
            $scope.createNewShop = function(formShop){
              $ionicLoading.show({
                template: '<i class="fa fa-refresh fa-spin"></i>'+
                "<br />"+
                "<span>Waiting...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
              });
              if (formShop.$invalid) {
                alert("Pls check form!");
                $ionicLoading.hide();     
              }else{
              var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': $scope.shopInfo.address }, function (results, status) {
                  console.log(google.maps.GeocoderStatus.OK);
                  if (status == google.maps.GeocoderStatus.OK) {
                    $scope.shopInfo.latitude = results[0].geometry.location.lat();
                    $scope.shopInfo.longitude = results[0].geometry.location.lng();
                    console.log($scope.shopInfo.latitude);
                    if ($scope.shopInfo.latitude === 'undefined' || $scope.shopInfo.longitude === 'undefined') {
                      alert("Pls check address!");
                      $ionicLoading.hide();     
                    }else{
                    MainService.insertCompanyShop($scope.shopInfo, $scope.companyinfo.company_id).then(function(result){
                    if(result.status=="success"){
                        $ionicLoading.hide();     
                        var alertPopup = $ionicPopup.alert({
                              title: 'Alert',
                              template: 'Add New Shop Success'
                            });
                           alertPopup.then(function(res) { 
                                  $scope.shopInfo= {};
                                  $state.go('app.main.shop');
                                  $scope.selectShopByCompany();
                           });
                    }else{
                      // $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Error'
                      });
                    }
                  })
                  }
                }
                else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Error'
                  });
                }
              });
              }
            }

            // select  shop by company
            $scope.selectShopByCompany = function(){
               $ionicLoading.show({
                       template: '<i class="fa fa-refresh fa-spin"></i>'+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                        });
              MainService.getCompanyShopById($scope.companyinfo.company_id).then(function(result){
                  if(result.status=="success"){
                    $ionicLoading.hide();
                    $scope.Shops = result.data;
                    MainService.allShop = $scope.Shops; 
                  }else{
                    $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Error'
                        });
                  }
              })
            }

            //delete shop company
            // $scope.delelteShopCompany = function(shop_id){
            //      var confirmPopup = $ionicPopup.confirm({
            //        title: 'confirm Delete',
            //        template: 'Are you sure you want delete Shop'
            //      });
            //      confirmPopup.then(function(res) {
            //        if(res) {
            //              MainService.delelteShopCompany(shop_id).then(function(result){
            //               if(result.status=="success"){
            //                 //$scope.deletePostShop(shop_id);
            //                   var alertPopup = $ionicPopup.alert({
            //                     title: 'Alert',
            //                     template: 'Delete Shop Success'
            //                   });
            //                  alertPopup.then(function(res) { 
            //                     $scope.selectShopByCompany();
            //                  });
            //               }
            //           })
            //        } else {
            //               console.log('You are not sure');
            //        }
            //      });
            // }

            $scope.deletePostShop = function(shop_id){
              // MainService.deletePostShop(shop_id).then(function(result){
              //   if (result.status == "success") {
              //     $scope.delelteShopCompany(shop_id);
              //   }
              //   else{
              //     console.log("Error: ", result);
              //   }
              // })
                var confirmPopup = $ionicPopup.confirm({
                   title: 'confirm Delete',
                   template: 'Are you sure you want delete Shop'
                });
                 confirmPopup.then(function(res) {
                   if(res) {
                         MainService.deletePostShop(shop_id).then(function(result){
                          if(result.status=="success"){
                            //$scope.deletePostShop(shop_id);
                              var alertPopup = $ionicPopup.alert({
                                title: 'Alert',
                                template: 'Delete Shop Success'
                              });
                             alertPopup.then(function(res) { 
                                $scope.selectShopByCompany();
                             });
                          }
                      })
                   } else {
                          console.log('You are not sure');
                   }
                 });
            }

            $scope.updateShopCompany = function(){
            var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'address': $scope.shopInfo.address }, function (results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    $scope.shopInfo.latitude = results[0].geometry.location.lat();
                    $scope.shopInfo.longitude = results[0].geometry.location.lng();
                    console.log($scope.shopInfo.longitude);
                  if ($scope.shopInfo.latitude === 'undefined' || $scope.shopInfo.longitude === 'undefined') {
                    alert("Pls check address!");
                  }else{
                  MainService.updateShopCompany($scope.shopInfo).then(function(result){
                  if(result.status=="success"){
                       $ionicLoading.hide();
                       var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Update Shop Success'
                        });
                       alertPopup.then(function(res) { 
                              $scope.selectShopByCompany();
                              $state.go('app.main.shop');
                              // $scope.closeModalShop()
                       });
                 }
                })
              }
              }else{
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Error'
                  });
              }
            })
          }
           
            $scope.unique = function(origArr) {
              $scope.modernShop = [];
              $scope.found = false;
              for (var i = 0; i < origArr.length; i++) {
                for (var j = 0; j < $scope.modernShop.length; j++) {
                  if (origArr[i].shop_id === $scope.modernShop[j].id) {
                    $scope.found = true;
                    break;
                  }
                }
                if (!$scope.found) {
                  $scope.modernShop.push(
                  {
                    name: origArr[i].shop_name,
                    id: origArr[i].shop_id,
                    ticked: false
                  });
                }
              }
              console.log($scope.modernShop);
              return $scope.modernShop;
            }

            // //open Modal New Post
            // $ionicModal.fromTemplateUrl('modules/main/views/addNewPosts.html', {
            //   scope: $scope,
            //   animation: 'slide-in-up'
            // }).then(function(modal) {
            //   $scope.modalAddNewPost = modal;
            // });
            // $scope.post = {
            //     isweekend_shift:0,
            //     isAccommodation:0,
            //     isTravel:0,
            //     Duration:1
            // };

            // $scope.openModalPost = function(title,options) {
            //     $scope.titlePost = title;
            //     $scope.optionsPost = options;
            //     $timeout(function(){
            //     $scope.modalAddNewPost.show();
            //     $scope.unique($scope.Shops);
            //   },200)
            // } 

            // $scope.closeModalPost = function() {
            //   $scope.modalAddNewPost.hide();
            // };

            $scope.openFormPost = function(){
              $state.go('app.main.addNewPosts');
            };

            if($location.$$path === "/app/main/addNewPosts"){
              $scope.unique(MainService.allShop);
              $scope.post = {
                isweekend_shift:0,
                isAccommodation:0,
                isTravel:0,
                Duration:1
              };
            }

            $scope.datePickerCallbackRequired = function (val) {
                if(typeof(val)==='undefined'){      
                    console.log('Date not selected');
                }else{
                  $scope.post.required_date = val;
                  $scope.StartDatePicker = $scope.post.required_date
                  console.log('Selected required_date is : ', $scope.post.required_date);
                }
            };

            $scope.datePickerCallbackStart = function (val) {
                if(typeof(val)==='undefined'){      
                    console.log('Date not selected');
                }else{
                  $scope.post.Start_date = val;
                  console.log('Selected Start_date is : ', $scope.post.Start_date);
                }
            };

            //add new posts 
            $scope.addNewPost = function(outputShop, formPost){
                $ionicLoading.show({
                  template: '<i class="fa fa-refresh fa-spin"></i>'+
                  "<br />"+
                  "<span>Waiting...</span>",
                  animation: 'fade-in',
                  showBackdrop: true,
                  maxWidth: 200,
                  showDelay: 0
                });
                console.log(formPost);
                if (typeof outputShop === 'undefined' || formPost.$invalid){
                  alert("Please check form");
                  $ionicLoading.hide();
                }else{
                  if (typeof $scope.post.Start_date === 'undefined' || typeof $scope.post.required_date === 'undefined') {
                    // $scope.post.Start_date = $filter('date')( Date.parse($scope.post.Start_date.year +'/'+  $scope.post.Start_date.month +'/'+ $scope.post.Start_date.date), 'yyyy/MM/dd');
                    // $scope.post.required_date = $filter('date')( Date.parse($scope.post.required_date.year +'/'+  $scope.post.required_date.month +'/'+ $scope.post.required_date.date), 'yyyy/MM/dd');
                    $scope.post.required_date = $scope.currentDate;
                    $scope.post.Start_date = $scope.currentDate;
                  }
                  console.log($scope.post);

                  $scope.post.company_id = $scope.companyinfo.company_id;
                  $scope.itemShop_id = [];
                  for (var i = 0; i < outputShop.length; i++) {
                    $scope.itemShop_id.push(outputShop[i].id);
                  };

                  console.log($scope.itemShop_id);
                  console.log($scope.post);

                  MainService.insertNewPost($scope.post, $scope.itemShop_id).then(function(result){
                      if(result.status=="success"){
                        $ionicLoading.hide();
                        // $scope.closeModalPost();
                        $scope.post = {
                          isweekend_shift:0,
                          isAccommodation:0,
                          isTravel:0
                        };
                        var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Success'
                        });
                        $state.go("app.main.shop");
                      }
                      else{
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Error'
                        });
                        //$scope.closeModalPost();
                      }
                  })
                }
            };

            $scope.getPostForShop = function(shop_id){
              $state.go('app.main.postShop', {shopId:shop_id});
            }

            $scope.getPostForShopId = function(){
              $scope.shop_id = $stateParams.shopId;
              MainService.getPostForShopId($scope.shop_id).then(function(result){
                if (result.status == "success") {
                  $scope.postShop = result.data;
                };
              })
            }
            $scope.getPostForShopId();   

            $scope.getDetailPost = function(post){
              MainService.detailPosts.postShop = post;
              $state.go('app.main.postDetailShop');
            }

            $scope.countMemPost = function(){
              $scope.mem = "0";
              if ($scope.postDetail !== 'undefined') {
              $scope.postDetail = MainService.detailPosts.postShop;
              console.log($scope.postDetail);
                MainService.countMember($scope.postDetail.post_id, $scope.postDetail.shop_id).then(function(result){
                  if (result.status == "success") {
                    $scope.mem = result.data;
                    console.log($scope.mem);
                  };
                })
              }
            }

            if($location.$$path === "/app/main/postDetailShops"){
              $scope.countMemPost();
            }if($location.$$path === "/app/main/postDetailPost"){
              $scope.countMemPost();
            }

            $scope.disableTap = function(){
              container = document.getElementsByClassName('pac-container');
              // disable ionic data tab
              angular.element(container).attr('data-tap-disabled', 'true');
              // leave input field if google-address-entry is selected
              angular.element(container).on("click", function(){
                  document.getElementById('autocomplete').blur();
              });
            };

            $scope.phamacist_id = [];
            $scope.getPharmacistId = function(data){
              MainService.getPharmacistId(data.post_id, data.shop_id).then(function(result){
                if (result.status = 'success') {
                      angular.forEach(result.data, function(value, key){
                        $scope.phamacist_id.push(value.phamacist_id);
                      })
                      $scope.getPharmacistInfo($scope.phamacist_id);
                }else{
                  console.log(result.err);
                }
              })
            }

            $scope.getPharmacistInfo = function(data){
                  console.log(data);
                  MainService.getPharmacistInfo(data).then(function(result){
                    if(result.status = 'success'){
                      MainService.infoPharmacist.infoPharmacists = result.data;
                      $state.go("app.main.infoPhar");
                    }
                  });
            }

            if($location.$$path === "/app/main/detailInfoPhar"){
              $scope.detailInfoPhar = [];
              $scope.isSelect = {};
              $scope.detailInfoPhar = MainService.infoPharmacist.detail;
              $scope.postShop = MainService.detailPosts.postShop;
              MainService.checkIsSelect($scope.postShop.post_id, $scope.postShop.shop_id, $scope.detailInfoPhar.phamacist_id).then(function(result){
                if(result.status = 'success'){
                  $scope.isSelect = result.data;
                }
              })
              MainService.getExpPhar($scope.detailInfoPhar.phamacist_id).then(function(result){
                if(result.status = 'success'){
                  $scope.dataExp = result.data_exp;
                  console.log(result.data_exp);
                }
              })
              MainService.getQuaPhar($scope.detailInfoPhar.phamacist_id).then(function(result){
                if(result.status = 'success'){
                  $scope.dataQua = result.data_qua;
                  console.log(result.data_qua);
                }
              })
            }

            $scope.getCurrentDate = function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 
                var today = yyyy + '/' + mm + '/' + dd;
                $scope.currentDate = today.toString();
                console.log($scope.currentDate);
            }
            $scope.getCurrentDate();

            $scope.AcceptPharmacist = function(phamacist_id){
              console.log(phamacist_id);
              $scope.postShop = MainService.detailPosts.postShop;
              MainService.acceptPharmacist($scope.postShop.post_id, $scope.postShop.shop_id, phamacist_id, $scope.currentDate).then(function(result){
                if(result.status = 'success'){
                  MainService.selTokenIdPhar(phamacist_id);
                  var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Accept Success'
                    });
                    alertPopup.then(function(res) { 
                        $state.go('app.main.infoPhar');
                    });
                }else{
                  var alertPopup = $ionicPopup.alert({
                      title: 'Alert',
                      template: 'Accept Fail'
                  });
                }
              })
            }

            $scope.deletePost = function(data){
              var confirmPopup = $ionicPopup.confirm({
                   title: 'confirm Delete',
                   template: 'Are you sure you want delete Post'
              });
                confirmPopup.then(function(res) {
                  if(res) {
                    MainService.delPostById(data).then(function(result){
                    if(result.status=="success"){
                      var alertPopup = $ionicPopup.alert({
                          title: 'Alert',
                          template: 'Delete Post Success'
                        });
                        alertPopup.then(function(res) { 
                          $scope.getPostForShopId();
                        });
                      }
                    })
                  }else {
                    console.log('You are not sure');
                  }
              });
            }

          $scope.$watch('shopInfo.address', function(newval, old) {
            if ($scope.shopInfo && $scope.shopInfo.address && newval) {
              $scope.change();
            }
          })

        $scope.change = function() {
          var string = $scope.shopInfo.address;
          var arr = string.split(", ");
          var trim = _.map(arr, _.trim);
          console.log(trim);
          if (trim.length == 4) {
              switch (trim[2]) {
                  case "Northern Territory":
                      $scope.shopInfo.state = "NT";
                      break;
                  case "Queensland":
                      $scope.shopInfo.state = "QLD";
                      break;
                  case "Victoria":
                      $scope.shopInfo.state = "VIC";
                      break;
                  case "New South Wales":
                      $scope.shopInfo.state = "NSW";
                      break;
                  case "South Australia":
                      $scope.shopInfo.state = "SA";
                      break;
                  case "Western Australia":
                      $scope.shopInfo.state = "WA";
                      break;
                  case "Tasmania":
                      $scope.shopInfo.state = "TAS";
                      break;
                  default:
                      break;
              }
            $scope.shopInfo.suburb = trim[1];
            $scope.shopInfo_company = trim[3];
          }else{
            $scope.shopInfo.suburb = '';
            $scope.shopInfo.country = 'Australia';
            $scope.shopInfo.state = '';
          }
        }
})