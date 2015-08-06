
angular.module("app.loggedIn.insurer.list.controller", [])

        .controller("InsurerListController", function ($scope, $state, localStorageService,$modal) {
    
            $scope.insurer_panel = {};
            
            var item_type_options = [
                {code: 'Service', label: 'Service'},
                {code: 'Goods', label: 'Goods'},
            ]
            $scope.data_options = {
                api: 'api/erm/v2/insurers/search',
                method: 'post',
                scope: $scope.insurer_panel,
                search:{
                },
                columns: [
                    {field: 'id', is_hide: true},
                    {field: 'insurer_name', label: 'Company Name'},
                    {field: 'address', label: 'Address'},
                    {field: 'suburb', label: 'Suburb'},
                    {field: 'isenable'}
                ]
                 
            };
             $scope.add_forminsurer = function(){
                var modalInstance=$modal.open({
                    templateUrl:'add_forminsurer',
                    controller:function($scope,$modalInstance,add_form){
                         $scope.cancel=function()
                        {
                            $modalInstance.dismiss('cancel');
                        }
                       $scope.add_form = {
                            success: false
                        }
                        $scope.$watch('add_form.success', function(success){
                            if(success){
                                $modalInstance.close('success');
                            }
                        })
                    },
                    resolve:{
                        add_form : function(){
                         return $scope.add_form;
                       }
                    }
                })
                .result.then(function(response){
                    if(response === 'success'){
                         $scope.insurer_panel.reload();
                    }
                })
            }
            $scope.edit_forminsurer = function(){
                var modalInstance=$modal.open({
                    templateUrl:'edit_forminsurer',
                    controller:function($scope,$modalInstance,edit_form,id){
                         $scope.cancel=function()
                        {
                            $modalInstance.dismiss('cancel');
                        }
                       $scope.edit_form = {
                            success: false,
                            id:id
                        }
                        $scope.$watch('edit_form.success', function(success){
                            if(success){
                                $modalInstance.close('success');
                            }
                        })
                    },
                    resolve:{
                        edit_form : function(){
                         return $scope.edit_form;
                       },
                       id : function(){
                         return $scope.insurerInfo.id;
                       }
                    }
                })
                .result.then(function(response){
                    if(response === 'success'){
                         $scope.insurer_panel.reload();
                    }
                })
            }

            $scope.add_form = {
                is_show: false,
                open: function() {
                    this.is_show = true;
                },
                close: function() {
                    this.is_show = false;
                },
                success: function(response){
                    $scope.insurer_panel.reload();
                }
            }

            $scope.edit_form = {
                is_show: false,
                open: function() {
                    $scope.edit_forminsurer();
                },
                close: function() {
                    this.is_show = false;
                },
                success: function(response){
                    console.log('edit reloading');
                    $scope.insurer_panel.reload();
                }
            }
            $scope.clickRow = function (item) {
                if($scope.add_form.is_show) {
                    $scope.add_form.close();
                }
                $scope.insurerInfo = item;
                // $scope.openEditForm();
                $scope.edit_form.open();
            }
            $scope.reload = function(){
                console.log($scope.data_options.search.SHOW_ALL);
                $scope.insurer_panel.reload();
            }
     
        })
