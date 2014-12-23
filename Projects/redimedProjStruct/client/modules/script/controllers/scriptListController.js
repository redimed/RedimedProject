angular.module('app.loggedIn.script.list.controller',[

])
    .controller('ScriptListController',function($scope, $stateParams){
        $scope.script_panel = {};
        $scope.script = {};
    
        $scope.scripts = {
            select:0,
            class:function(script){
                return {
                    selected: (script.ID == $scope.scripts.select)
                };
            },
            scope: $scope.script_panel,
            options:{
                api:'api/erm/v2/script/search',
                method:'post',
                scope: $scope.script_panel,
                columns: [
                    {field: 'ID', is_hide: true},
                    {field: 'scriptNum', label: 'Script Number', width:"15%"},    
                    {field: 'prescriber', label: 'Prescriber', width:"40%"},
                    {field: 'EntitlementNo', label: 'Entitlement No'},       
                ],
                use_filters: true,
                filters: {
                    scriptNum: {type: 'text'},
                    prescriber: {type: 'text'},
                    EntitlementNo: {type: 'text'},
                },
                search: {
                    Patient_id: $stateParams.patient_id,
                    CAL_ID: $stateParams.cal_id
                },
                use_actions: true, 
                actions: [              
                    {
                        class: 'fa fa-info', title: 'Edit',
                        callback: function(item){
                            console.log('this is selected item',item)
                                $scope.script.id = item.ID;
                                $scope.scriptEditForm.open();
                        }
                    }
                ],
                
            }
        };
    
       $scope.scriptAddForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.script_panel.reload();
            }
        }
       
       $scope.scriptEditForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.script_panel.reload();
            }
        }
    
        
    });