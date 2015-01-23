angular.module('app.loggedIn.patient.apptdoc.controller',[])
    .controller("PatientApptDocController",function($scope, $stateParams, $timeout, FileUploader, ConfigService, PatientService, toastr){
        
        var patient_id = $stateParams.patient_id, cal_id = $stateParams.cal_id; 
        var download_api = 'http://' + location.host + '/api/erm/v2/apptdoc/download?id=';

        var uploader = $scope.uploader = new FileUploader({
            url: '/api/erm/v2/apptdoc/upload',
            autoUpload: true,
            removeAfterUpload: true,
            onCompleteAll: function(res){
                $scope.document_panel.reload();
            }
        });

        uploader.formData[0] = {patient_id: patient_id, cal_id: cal_id};
        


        $scope.openUploader = function(){
             $timeout(function () {
                $('#appt_doc_upload').click();
            }, 100);
        };

        $scope.document_panel = {};
        
        $scope.docs = {
            select:0,
            class:function(doc){
                return {
                    selected: (doc.cal_id == cal_id)
                };
            },
            scope: $scope.document_panel,
            options: {
                api:'api/erm/v2/apptdoc/search',
                method:'post',
                scope: $scope.document_panel,
                columns:[
                    {field: 'ID', is_hide: true},
                    {field: 'cal_id', label: 'Date', width:"20%", type:'custom', 
                        fn:function(item){
                            if(!item.appointment) return '';
                            
                            return ConfigService.getCommonDateDefault(item.appointment.FROM_TIME);
                        }
                    },    
                    {field: 'document_name', label: 'Document Name', width:"70%"}    
                ],
                use_filters: true,
                filters: {
                    document_name: {type: 'text'},
                    cal_id: {type: 'dropdown', values: [
                        { label: 'Appointment', code: cal_id},
                        { label: 'All'},
                    ]},
                },
                search: {
                    patient_id: $stateParams.patient_id,
                    // cal_id: $stateParams.cal_id
                },
                use_actions: true, 
                actions: [              
                    {
                        class: 'fa fa-times', title: 'Delete',
                        callback: function(item){
                            PatientService.deleteFile(item.ID).then(function(res){
                                if(res.status === 'success'){
                                    toastr.success('Delete file success!','Success!');
                                    $scope.document_panel.reload();
                                }
                            });
//                                $scope.referral.id = item.ID;;
//                                $scope.referralEditForm.open();
                        }
                    },
                    {
                        class: 'fa fa-download', title: 'Donwload',
                        callback: function(item){
                            console.log(item);
                            window.open(download_api + item.ID);

                        }
                    },
//                    {
//                        class: 'fa fa-print', title: 'Print',
//                        callback: function(item){
//                            console.log('this is selected item',item)
////                                $scope.script.id = item.ID;
////                            $scope.go('http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/script/'+item.ID);
//                            window.open('http://testapp.redimed.com.au:3003/RedimedJavaREST/api/document/referral/'+item.ID);
//                        }
//                    },
                ],
                
            }
        }
        
        
    });