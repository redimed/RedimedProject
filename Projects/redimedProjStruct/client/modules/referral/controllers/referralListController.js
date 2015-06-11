angular.module('app.loggedIn.referral.list.controller',[

])
    .controller('ReferralListController',function($scope, $stateParams){
        $scope.referral_panel = {};
        $scope.referral = {};
        $scope.referrals = {
            select:0,
            class:function(referral){
                return {
                    selected: (referral.ID == $scope.referral.select)
                };
            },
            scope: $scope.referral_panel,
            options:{
                api:'api/erm/v2/referral/search',
                method:'post',
                scope: $scope.referral_panel,
                columns: [
                    {field: 'ID', is_hide: true},
                    {field: 'CAL_ID', label: 'Calendar ID', width:"10%"},    
                    {field: 'CLINICAL_DETAILS', label: 'Clinical details', width:"40%"},    
                    {field: 'REQUESTING_PRACTITIONER', label: 'Requesting practitioner', width:"40%"},   
                ],
                use_filters: true,
                filters: {
                    CAL_ID: {type: 'text'},
                    CLINICAL_DETAILS: {type: 'text'},
                    REQUESTING_PRACTITIONER: {type: 'text'},
                },
                search: {
                    Patient_id: $stateParams.patient_id,
//                    CAL_ID: $stateParams.cal_id
                },
                use_actions: true, 
                actions: [              
                    {
                        class: 'fa fa-info', title: 'Edit',
                        callback: function(item){
                            console.log('this is selected item',item)
                                $scope.referral.id = item.ID;
                                $scope.referralEditForm.open();
                        }
                    },
                    {
                        class: 'fa fa-print', title: 'Print',
                        callback: function(item){
                            console.log('this is selected item',item)
                            alert(item);
//                                $scope.script.id = item.ID;
//                            $scope.go('http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/script/'+item.ID);
                            window.open('http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/referral/'+item.ID);
                        }
                    },
                ],
                
            }
        };
        // $scope.showPopupAddMakeReferral.openPopup = function(){
        //     $scope.referralAddForm.open();
        // };
       $scope.referralAddForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.referralAddForm.close();
            }
        }
        
       $scope.referralEditForm = {
            is_show: false,
            open: function () {
                this.is_show = true;
            },
            close: function () {
                this.is_show = false;
            },
            success: function (response) {
                if (response.status == 'success')
                    $scope.referral_panel.reload();
                    $scope.referralEditForm.close();
            }
        }
    
        
    });