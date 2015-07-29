angular.module('app.loggedIn.patient.apptdoc.controller',[])
    .controller("PatientApptDocController",function($scope, $stateParams, $timeout, FileUploader, ConfigService, PatientService, toastr){
        
        var patient_id = $stateParams.patient_id, cal_id = $stateParams.cal_id; 
        var download_api = 'https://' + location.host + '/api/erm/v2/apptdoc/download?id=';
        $scope.info_upload = {
            total_size: 0,
            progress_percent: 0,
            pre_progress_percent: 0,
        }

        var uploader = $scope.uploader = new FileUploader({
            url: '/api/erm/v2/apptdoc/upload',
            autoUpload: false,
            removeAfterUpload: true,

            onSuccessItem: function(item, response, status, headers){
                var uploaded_percent =  item.file.size   * 100 / $scope.info_upload.total_size ;
                $scope.info_upload.pre_progress_percent += uploaded_percent;

                console.log($scope.info_upload.pre_progress_percent)
            },
            onProgressItem: function(item, progress) {
                var uploaded_size = progress * item.file.size / 100;
                var uploaded_percent =  uploaded_size  * 100 / $scope.info_upload.total_size ;
                $scope.info_upload.progress_percent =  $scope.info_upload.pre_progress_percent + uploaded_percent;
            },
            onCompleteAll: function(res){
                $scope.document_panel.reload();
                $scope.info_upload = {
                    total_size: 0,
                    progress_percent: 0,
                    pre_progress_percent: 0,
                }
                toastr.success('Upload complete!','Complete!');
                $scope.documentFileSuccess.runWhenFinish();
            },
            onAfterAddingAll :function(items){
                angular.forEach(items, function(f){
                     $scope.info_upload.total_size += f.file.size;
                });

                $scope.info_upload.step_size = $scope.info_upload.total_size / 100;
                console.log('This is upload files',uploader);   
            }
        });

        uploader.formData[0] = {patient_id: patient_id, cal_id: cal_id};
        


        $scope.openUploader = function(){
             $timeout(function () {
                $('#appt_doc_upload').click();
            }, 100);
        };

        $scope.document_panel = {};
        $scope.docSelected = function(item){
             window.open(download_api + item.id);
        }
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
                    {field: 'id', is_hide: true},
                    {field: 'cal_id', label: 'Date', width:"20%", type:'custom', 
                        fn:function(item){
                            if(!item.appointment) return '';
                            return moment(item.appointment.FROM_TIME).format('DD-MM-YYYY - hh:mm');                            
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
                            PatientService.deleteFile(item.id).then(function(res){
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
                            window.open(download_api + item.id);

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